import mongoose , {Schema}from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        index:true,
        lowercase:true,
    },
    authType:{
        type:String,
        required:true,
        enum:["local","google"],
        default:"local"
    },
    password:{
        type:String,
        required:[function(){
            return this.authType==="local";
        },"Password is required"]
    },
    googleId:{
        type:String,
        required:function(){
            return this.authType==="google";
        },
        trim:true
    },
    role:{
        type:String,
        required:true,
        enum:["customer","admin"],
        default:"customer"
    },
    contact:{
        type:String,
        required:true,
        trim:true,
        index:true,
        unique:true,
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    refreshToken:{
        type:String,
    },
    totalAccounts:{
        type:Number,
        default:0
    }
},{timestamps:true});

userSchema.pre("save",async function (next){
    if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
    } 
    next();
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
    )}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}
export const User=mongoose.model("User",userSchema);