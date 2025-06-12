import {asyncHandler} from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiErrors} from "../utils/ApiErrors.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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
    const {name,email,contact,address,authType,googleId,password}=req.body;
    if([name,email,contact,address,authType].some((field)=>field?.trim()==="")){
        throw new ApiErrors(400,"All fields are required");
    };
    if (authType === "local" && !password?.trim()) {
        throw new ApiErrors(400, "Password is required for local signup");
    }

    if (authType === "google" && !googleId?.trim()) {
        throw new ApiErrors(400, "Google ID is required for Google signup");
    }

    const userExists=await User.findOne({
        $or:[{email},{name}]
    });
    if(userExists){
        throw new ApiErrors(400,"User already exists");
    }
    let assignedRole="customer";
    const userCount=await User.countDocuments();
    if(userCount===0){
        assignedRole="admin";
    }
    else if (role === "admin") {
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
    });
    const createdUser=await User.findById(user._id).select("-password -refreshToken");
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
    else if(authType==="google"){
        if(!(email||googleId)){
            throw new ApiErrors(400,"Email and Google ID are required for login");
        }
        const user=await User.findOne({email,authType:"google"});
        if(!user){
            throw new ApiErrors(404,"User not found");
        }
        if(user.googleId !== googleId){
            throw new ApiErrors(401,"Invalid Google ID");
        }
        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
        const options={
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
        }
        const loggedInUser=await User.findById(user._id).select("-password -refreshToken");
        return res
        .status(200)
        .cookie("refreshToken",refreshToken,options)
        .cookie("accessToken",accessToken,options)
        .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User Logged In Successfully"));
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

export {register,
        login ,
        logout,  
       } 