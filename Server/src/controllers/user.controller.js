import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiErrors} from "../utils/ApiErrors.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import  { isValidObjectId } from "mongoose";
const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        if (!accessToken || !refreshToken) {
      console.log("Token generation failed: ", { accessToken, refreshToken });
      throw new Error("Token generation failed");
    }

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiErrors(500, "Something went wrong while generating refresh and access token");
    }
};

const register = asyncHandler(async(req,res)=>{
    const {name,email,contact,address,authType,googleId,password,totalAccounts,role}=req.body;
    if([name,email,contact,address,authType].some((field)=>field?.trim()==="")){
        throw new ApiErrors(400,"All fields are required");
    };
    if (authType === "local" && !password?.trim()) {
        throw new ApiErrors(400, "Password is required for local signup");
    }

    if (authType === "google" && !googleId?.trim()) {
        throw new ApiErrors(400, "Google ID is required for Google signup");
    }

    const userExists = await User.findOne({
        $or: [{ email }, { contact }]
    });

    if (userExists) {
        let duplicateField = "";
     if (userExists.email === email) {
        duplicateField = "email";
     } else if (userExists.contact === contact) {
        duplicateField = "contact";
    }

  throw new ApiErrors(400, `User already exists with same ${duplicateField}`);
}
    let assignedRole = "customer"; 

    const existingUsersCount = await User.countDocuments();
    if (existingUsersCount === 0) {
        assignedRole = "admin";
    }

    
    if (role === "admin") {
        if (!req.user || req.user.role !== "admin") {
            throw new ApiErrors(403, "Only admins can create another admin");
        }
        assignedRole = "admin";
    }
    const user=await User.create({
       name,
       email,
       contact,
       address, 
       role: assignedRole,
       authType, 
       password : authType === "local" ? password : undefined,
       googleId : authType === "google" ? googleId : undefined,
       totalAccounts: totalAccounts || 0,
    });
    const createdUser=await User.findById(user._id).select("-password -refreshToken -googleId");
    if(!createdUser){
        throw new ApiErrors(404,"User not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,createdUser,"User Registered Successfully"))
})

const login = asyncHandler(async(req,res)=>{
    const {email,authType,password,googleId}=req.body;
    if(authType==="local"){
        if(!(email||password)){
            throw new ApiErrors(400,"Email and Password are required for login");
        }
        const user = await User.findOne({email});
        if (!user) {
            throw new ApiErrors(404, "User not found");
        }
        const CheckPassword=await user.isPasswordCorrect(password);
        if (!CheckPassword) {
            throw new ApiErrors(401, "Invalid password");
        }
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

        const options={
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
        }
        const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

        return res
        .status(200)
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)
        .json({
            status:200,
            user:loggedInUser,
            accessToken,
            refreshToken
        })
    }
    else if (authType === "google") {
  if (!(email || googleId)) {
    throw new ApiErrors(400, "Email and Google ID are required for login");
  }

  let user = await User.findOne({ email, authType: "google" });

  if (!user) {
    // ✅ auto register
    user = await User.create({
      name: email.split("@")[0], 
      email,
      googleId,
      authType: "google",
      role: "customer",
      contact: "", 
      address: "",
      totalAccounts: 0,
    });
  }

  if (user.googleId !== googleId) {
    throw new ApiErrors(401, "Invalid Google ID");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken -googleId");

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json({
      status: 200,
      user: loggedInUser,
      accessToken,
      refreshToken
    });
}

})

const logout = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    return res
    .status(200)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json(new ApiResponse(200,{},"User Logged Out Successfully"));
})
const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingToken=req.cookies.refreshToken||req.body.refreshToken
    if(!incomingToken){
        throw new ApiErrors(401,"Refresh token is required");
    }
    try {
        const decoded=jwt.verify(
            incomingToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user= await User.findById(decoded?._id)
        if(!user){
            throw new ApiErrors(404,"Invalid refresh token");
        }
        if(incomingToken!==user?.refreshToken){
            throw new ApiErrors(401,"Refresh token is expired or used");
        }
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id);
        const options={
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
        }
        return res
        .status(200)
        .cookie("refreshToken",newRefreshToken,options)
        .cookie("accessToken",accessToken,options)
        .json(new ApiResponse(200,{accessToken,newRefreshToken},"Access token refreshed successfully"));
    } catch (error) {
        throw new ApiErrors(401, "Invalid refresh token"); 
    }
})
const updateDetails=asyncHandler(async(req,res)=>{
    const {email,address,contact}=req.body
    if(!(email||address||contact)){
        throw new ApiErrors(400,"details is required");
    }
    const updatedUserDetails=await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                email,
                address,
                contact
            }
        },
        {
            new:true
        }
    ).select("-password -refreshToken -googleId");
    return res
    .status(200)
    .json(new ApiResponse(200,updatedUserDetails,"User details updated successfully"));
})
const ChangePassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user._id);
    if(!user){
        throw new ApiErrors(404,"User not found");
    }
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiErrors(401,"Invalid old password");
    }
    user.password=newPassword;
    await user.save({validateBeforeSave:false});
    return res
    .status(200)
    .json(new ApiResponse(200,{}, "Password changed successfully"));
})
const getCurrentCustomer=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user._id).select("-password -refreshToken -googleId");
    if(!user){
        throw new ApiErrors(404,"User not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Current user fetched successfully"));
})
const deactivateUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiErrors(400, "Invalid user ID");
    }

    if (req.user.role !== "admin") {
        throw new ApiErrors(403, "Only admin can deactivate a user");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiErrors(404, "User not found");
    }

    if (user.isActive === false) {
        throw new ApiErrors(400, "User is already deactivated");
    }

    user.isActive = false;
    await user.save();

    const updatedUser = await User.findById(userId).select("-password -refreshToken -googleId");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User deactivated successfully"));
});

const activateUser=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    if(!isValidObjectId(userId)){
        throw new ApiErrors(400,"Invalid user ID");
    }
    if(req.user.role!=="admin"){
        throw new ApiErrors(403,"Only admin can activate a user");
    }
    const user=await User.findById(userId);
    if(!user){
        throw new ApiErrors(404,"User not found");
    }
    if(user.isActive===true){
        throw new ApiErrors(400,"User is already activated");
    }
    user.isActive=true;
    await user.save();
    const updatedUser = await User.findById(userId).select("-password -refreshToken -googleId");
    if (!updatedUser) {
        throw new ApiErrors(404, "User not found after activation");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,user,"User activated successfully"));
})
const getUserById = asyncHandler(async (req, res) => {
    const {userId}= req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiErrors(400, "Invalid user ID");
    }
    const user = await User.findById(userId).select("-password -refreshToken -googleId");
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
})
const getAllUsers = asyncHandler(async (req, res) => {

if (req.user.role !== "admin") {
    throw new ApiErrors(403, "Only admin can access this route");
    }
    const users=await User.find()
    .select("name isActive role")
    .sort({createdAt:-1});

    return res
        .status(200)
        .json(new ApiResponse(200, users, "All users fetched successfully"));
})
export {register,
        login ,
        logout,
        generateAccessAndRefreshToken,
        refreshAccessToken,
        updateDetails,
        ChangePassword,
        getCurrentCustomer,
        deactivateUser,
        activateUser,
        getUserById,
        getAllUsers  
       } 