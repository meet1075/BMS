import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Account } from "../models/account.model.js";
import { User } from "../models/user.model.js";
import generateUniqueAccountNumber from "../utils/generateAccountNumber.js";
import generatePin from "../utils/generatePinforAccountNumber.js";
const createAccount=asyncHandler(async (req, res) => {
    const {accountType,balance} = req.body;

    if (!accountType || balance === undefined) {
      throw new ApiErrors(400, "Account type and balance are required");
    }
    if (typeof balance !== "number" || balance < 10) {
      throw new ApiErrors(400, "Minimum balance should be ₹10");
    }
    const user= await User.findById(req.user._id);
    if(!user){
        throw new ApiErrors(404,"User not found");
    }
    const accountNumber = await generateUniqueAccountNumber();
    const pin = await generatePin();
    const existingAccounts = await Account.find({ userId: user._id });
    const isPrimary = existingAccounts.length === 0;
    const account = await Account.create({
        userId: user._id,
        accountType,
        accountNumber,
        balance,
        pin,
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
    .json(new ApiResponse(200,createdAccount,"Account created successfully"));
})

export {
    createAccount
}