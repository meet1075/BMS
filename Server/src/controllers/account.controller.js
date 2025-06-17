import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Account } from "../models/account.model.js";
import { User } from "../models/user.model.js";
import generateUniqueAccountNumber from "../utils/generateAccountNumber.js";
import generatePin from "../utils/generatePinforAccountNumber.js";
import { isValidObjectId } from "mongoose";
const createAccount=asyncHandler(async (req, res) => {
    const {accountType,balance} = req.body;

    if (!accountType ) {
      throw new ApiErrors(400, "Account type required");
    }
    const user= await User.findById(req.user._id);
    if(!user){
        throw new ApiErrors(404,"User not found");
    }
    const accountNumber = await generateUniqueAccountNumber();
    const plainpin = await generatePin();
    const existingAccounts = await Account.find({ userId: user._id });
    const isPrimary = existingAccounts.length === 0;
    const account = await Account.create({
        userId: user._id,
        accountType,
        accountNumber,
        balance:0,
        pin: plainpin,
        status: "activate",
        isPrimary,
    });
    
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $inc: { totalAccounts: 1 } },
        { new: true }
    );
    if (!updatedUser) {
        throw new ApiErrors(500, "Failed to update user accounts count");
    }
    const createdAccount=await Account.findById(account._id).select("-pin");
    if (!createdAccount) {
        throw new ApiErrors(500, "Failed to create account");
    }
    return res
    .status(201)
    .json(new ApiResponse(200,{account:createdAccount,pin:plainpin},"Account created successfully"));
})

const deleteAccount=asyncHandler(async (req, res) => {
    const {accountId} = req.params;
    if (!isValidObjectId(accountId)) {
        throw new ApiErrors(400, "Account ID is required");
    }
    const account=await Account.findByIdAndDelete(accountId);
    if (!account) {
        throw new ApiErrors(404, "Account not found");
    }
    const user = await User.findByIdAndUpdate(
        account.userId,
        { $inc: { totalAccounts: -1 } },
        { new: true }
    );
    if (!user) {
        throw new ApiErrors(500, "Failed to update user accounts count");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, { account }, "Account deleted successfully"));
})

const getAccountDetails = asyncHandler(async (req, res) => {
    const {accountId}=req.params;
    if (!isValidObjectId(accountId)) {
        throw new ApiErrors(400, "Account ID is required");
    }
    const account= await Account.findById(accountId)
    .select("accountNumber accountType balancs status isPrimary createdAt updatedAt")
    .sort({ createdAt: -1 });
    if (!account) {
        throw new ApiErrors(404, "Account not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, { account }, "Account details retrieved successfully"));

})

const getAllAccounts = asyncHandler(async (req, res) => {
    const accounts = await Account.find()
        .select("accountNumber accountType balance status isPrimary createdAt updatedAt")
        .sort({ createdAt: -1 });
    if (!accounts || accounts.length === 0) {
        throw new ApiErrors(404, "No accounts found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { accounts }, "All accounts retrieved successfully"));
})

const getAllAccountsByUserId = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if (!isValidObjectId(userId)) {
        throw new ApiErrors(400, "User ID is required");
    }
    const user=await User.findById(userId);
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }
    const accounts = await Account.find({ userId: user._id })
        .select("accountNumber accountType balance status isPrimary createdAt updatedAt")
        .sort({ createdAt: -1 });
    if (!accounts || accounts.length === 0) {
        throw new ApiErrors(404, "No accounts found for this user");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { accounts }, "Accounts retrieved successfully for user"));
})

const getAllSavingsAccounts = asyncHandler(async (req, res) => {
    const accounts = await Account.find({ accountType: "savings" })
        .select("accountNumber accountType balance status isPrimary createdAt updatedAt")
        .sort({ createdAt: -1 });
    if (!accounts || accounts.length === 0) {
        throw new ApiErrors(404, "No savings accounts found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { accounts }, "All savings accounts retrieved successfully"));
})

const getAllCurrentAccounts = asyncHandler(async (req, res) => {
    const accounts = await Account.find({ accountType: "current" })
        .select("accountNumber accountType balance status isPrimary createdAt updatedAt")
        .sort({ createdAt: -1 });
    if (!accounts || accounts.length === 0) {
        throw new ApiErrors(404, "No current accounts found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { accounts }, "All current accounts retrieved successfully"));
})

const updatePin = asyncHandler(async (req, res) => {
    const { accountId } = req.params;
    const {oldPin, newPin} = req.body;
    if (!isValidObjectId(accountId) || !oldPin || !newPin) {
        throw new ApiErrors(400, "Account ID, old PIN, and new PIN are required");
    }
    const account = await Account.findById(accountId);  
    if (!account) {
        throw new ApiErrors(404, "Account not found");
    }
    const isOldPinCorrect = await account.isPasswordCorrect(oldPin);
    if(!isOldPinCorrect){
        throw new ApiErrors(404,"incorrect old pin")
    }
    await account.save({ validateBeforeSave: true });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "PIN updated successfully"));
})

const setPrimaryAccount= asyncHandler(async(req,res)=>{
    const { accountId } = req.params;
    if (!isValidObjectId(accountId)) {
        throw new ApiErrors(400, "Account ID is required");
    }
    const account = await Account.findById(accountId);
    if (!account) {
        throw new ApiErrors(404, "Account not found");
    }
    const user= await User.findById(account.userId);
    if (!user) {
        throw new ApiErrors(404, "User not found");
    }
    if (account.isPrimary === true) {
        throw new ApiErrors(400, "This account is already set as primary");
    }
    const existingPrimaryAccount = await Account.findOne({ userId: user._id, isPrimary: true });
    if (existingPrimaryAccount) {
        existingPrimaryAccount.isPrimary = false;
        await existingPrimaryAccount.save();
    }
    account.isPrimary = true;
    await account.save();
    return res
        .status(200)
        .json(new ApiResponse(200, { account }, "Primary account set successfully"));
})

const deactivateAccount= asyncHandler(async(req,res)=>{
    const {accountId} = req.params;
    if (!isValidObjectId(accountId)) {
        throw new ApiErrors(400, "Account ID is required");
    }
    const account = await Account.findById(accountId);
    if (!account) {
        throw new ApiErrors(404, "Account not found");
    }
    if (account.status === "deactivate") {
        throw new ApiErrors(400, "Account is already deactivated");
    }
    account.status = "deactivate";
    await account.save();   
    return res
        .status(200)
        .json(new ApiResponse(200, { account }, "Account deactivated successfully"));
})

const activateAccount= asyncHandler(async(req,res)=>{
        const {accountId} = req.params;
    if (!isValidObjectId(accountId)) {
        throw new ApiErrors(400, "Account ID is required");
    }
    const account = await Account.findById(accountId);
    if (!account) {
        throw new ApiErrors(404, "Account not found");
    }
    if (account.status === "activate") {
        throw new ApiErrors(400, "Account is already activated");
    }
    account.status = "activate";
    await account.save();   
    return res
        .status(200)
        .json(new ApiResponse(200, { account }, "Account activated successfully"));
})

const checkBalance= asyncHandler(async(req,res)=>{
    const {accountId}= req.params;
    if (!isValidObjectId(accountId)) {
        throw new ApiErrors(400, "Account ID is required");
    }
    const account=await Account.findById(accountId)
    .select("balance");
    if (!account) {
        throw new ApiErrors(404, "Account not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, { balance: account.balance }, "Account balance retrieved successfully"));
})

export {
    createAccount,
    deleteAccount,
    getAccountDetails,
    getAllAccounts,
    getAllAccountsByUserId,
    getAllSavingsAccounts,
    getAllCurrentAccounts,
    updatePin,
    setPrimaryAccount,
    deactivateAccount,
    activateAccount,
    checkBalance
}