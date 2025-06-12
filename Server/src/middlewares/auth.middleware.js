import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import jwt from "jsonwebtoken";
export const verifyJWT= asyncHandler(async (req, res, next) => {
    try{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
    throw new ApiErrors(401, "unauthorized required");
}
    const decoded=jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user=await User.findById(decoded?._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiErrors(401, "unauthorized user");
    }

    req.user=user;
    next();
}   catch (error) {
    console.error("JWT verification error:", error);
    next(new ApiErrors(401,error?.message|| "Invald access token"));
}})
export const verifyRoles = (...allowedRoles)=>(req,res,next)=>{
    try {
        const roleList=allowedRoles.flatMap(role=>role.split(","))
        if (!req.user || !roleList.includes(req.user.role.trim())) {
            throw new ApiErrors(403, `Forbidden: Allowed roles are ${roleList.join(", ")}`);
        }
        next();
    } catch (error) {
        next(error);
    }
}