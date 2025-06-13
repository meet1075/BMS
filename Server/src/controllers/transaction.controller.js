import { asyncHandler } from "../utils/asyncHandler.js";
import {Transaction} from "../models/transaction.model.js";
import { User } from "../models/user.model.js"; 
import { Account } from "../models/account.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import generateUniqueTransactionId from "../utils/generateTransactionId.js";
const depositMoney=asyncHandler(async (req, res) => {
    const {accountId}=req.params;
    if(!isValidObjectId(accountId)){
        throw new ApiErrors(404,"Account ID is required");
    }
    const {amount} = req.body;
    if(!amount || amount <= 0){
        throw new ApiErrors(400,"Amount is required and should be greater than zero");
    }
    const account = await Account.findById(accountId);
    if(!account){
        throw new ApiErrors(404,"Account not found");
    }
    if(account.status !== "activate"){
        throw new ApiErrors(400,"Account is not activated");
    }
    let totalAmount = account.balance + amount;
    const transactionId = await generateUniqueTransactionId();

    const transaction = await Transaction.create({
        toAccountId: accountId,
        type: "deposit",
        amount: amount,
        status: "successful",
        transactionId,
        userId: req.user._id
    });
    account.balance = totalAmount;
    await account.save();
    return res
    .status(201)
    .json(new ApiResponse(201, transaction,"Deposit successful"));
})
    
const withdrawMoney=asyncHandler(async (req, res) => {
    const {accountId} = req.params;
    if(!isValidObjectId(accountId)){
        throw new ApiErrors(404,"Account ID is required");
    }
    const {amount} = req.body;
    if(!amount || amount <= 0){
        throw new ApiErrors(400,"Amount is required and should be greater than zero");
    }
    const account = await Account.findById(accountId);
    if(!account){
        throw new ApiErrors(404,"Account not found");
    }
    if(account.status!== "activate"){
        throw new ApiErrors(400,"Account is not activated");
    }
    if(account.balance < amount){
        throw new ApiErrors(400,"Insufficient balance");
    }
    let totalAmount = account.balance - amount;
    const transactionId = await generateUniqueTransactionId();
    const transaction = await Transaction.create({
        fromAccountId: accountId,
        type: "withdraw",
        amount: amount,
        status: "successful",
        transactionId,
        userId: req.user._id
    });
    account.balance = totalAmount;
    await account.save();
    return res
    .status(201)
    .json(new ApiResponse(201, transaction,"Withdrawal successful"));
})

const transferMoney=asyncHandler(async (req, res) => {
    const {fromAccountId} = req.params;
    if(!isValidObjectId(fromAccountId)){
        throw new ApiErrors(404,"From Account ID is required");
    }
    const {toAccountNumber, amount} = req.body;
    if(!toAccountNumber){
        throw new ApiErrors(404,"To Account ID is required");
    }
    if(!amount || amount <= 0){
        throw new ApiErrors(400,"Amount is required and should be greater than zero");
    }
    const fromAccount = await Account.findById(fromAccountId);
    if(!fromAccount){
        throw new ApiErrors(404,"From Account not found");
    }
    if(fromAccount.status !== "activate"){
        throw new ApiErrors(400,"From Account is not activated");
    }
    if(fromAccount.balance < amount){
        throw new ApiErrors(400,"Insufficient balance in From Account");
    }
    const toAccount = await Account.findOne({accountNumber: toAccountNumber});
    if(!toAccount){
        throw new ApiErrors(404,"To Account not found");
    }
    if(toAccount.status !== "activate"){
        throw new ApiErrors(400,"To Account is not activated");
    }
    if(fromAccount.accountNumber === toAccount.accountNumber){
        throw new ApiErrors(400,"Cannot transfer to the same account");
    }
    let totalFromAmount = fromAccount.balance - amount;
    let totalToAmount = toAccount.balance + amount;
    const transactionId = await generateUniqueTransactionId();
    const transaction = await Transaction.create({
        fromAccountId: fromAccount._id,
        toAccountId: toAccount._id,
        type: "transfer",
        amount: amount,
        status: "successful",
        transactionId,
        userId: req.user._id
    });
    fromAccount.balance = totalFromAmount;
    toAccount.balance = totalToAmount;
    await fromAccount.save();
    await toAccount.save();
    return res
    .status(201)
    .json(new ApiResponse(201, transaction,"Transfer successful"));
})

const getTransactionById=asyncHandler(async (req, res) => {
    const {transactionId} = req.params;
    if(!transactionId){
        throw new ApiErrors(404,"Transaction ID is required");
    }
    const transaction = await Transaction.findById(transactionId);
    if(!transaction){
        throw new ApiErrors(404,"Transaction not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, transaction,"Transaction retrieved successfully"));
})

const getAllTransactions=asyncHandler(async (req, res) => {
    const transaction=await Transaction.find()
    .populate("toAccountId","accountNumber")
    .populate("fromAccountId","accountNumber")
    .select("fromAccountId toAccountId amount type")
    .sort({createdAt: -1});
    if(!transaction || transaction.length === 0){
        throw new ApiErrors(404,"No transactions found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, transaction,"All transactions retrieved successfully"));

})

const getTransactionHistoryByAccountId=asyncHandler(async (req, res) => {
    const {accountId} = req.params;
    if(!isValidObjectId(accountId)){
        throw new ApiErrors(404,"Account ID is required");
    }
    const account = await Account.findById(accountId);
    if(!account){
        throw new ApiErrors(404,"Account not found");
    }
    const transaction=await Transaction.find(
        {
            $or:[
                {fromAccountId:accountId},
                {toAccountId:accountId}
            ]
        }       
    ).populate("toAccountId","accountNumber")
    .populate("fromAccountId","accountNumber")
    .select ("toAccountId fromAccountId accountNumber type amount transactionId")
    
    return res
    .status(200)
    .json(new ApiResponse(200, transaction,"Transaction history retrieved successfully for account"));
})

const getDepositTransaction=asyncHandler(async (req, res) => {
    const transaction=await Transaction.find({type:"deposit"})
    .populate("toAccountId","accountNumber")
    .select("toAccountId amount type transactionId")
    .sort({createdAt: -1});
    if(!transaction || transaction.length === 0){
        throw new ApiErrors(404,"No deposit transactions found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, transaction,"All deposit transactions retrieved successfully"));
})

const getWithdrawTransaction=asyncHandler(async (req, res) => {
    const transaction=await Transaction.find({type:"withdraw"})
    .populate("fromAccountId","accountNumber")
    .select("fromAccountId amount type transactionId")
    .sort({createdAt: -1});
    if(!transaction || transaction.length === 0){
        throw new ApiErrors(404,"No withdraw transactions found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, transaction,"All withdraw transactions retrieved successfully"));
})

const getTransferTransaction=asyncHandler(async (req, res) => {
    const transaction=await Transaction.find({type:"transfer"})
    .populate("toAccountId","accountNumber")
    .populate("fromAccountId","accountNumber")
    .select("fromAccountId toAccountId amount type transactionId")
    .sort({createdAt: -1});
    if(!transaction || transaction.length === 0){
        throw new ApiErrors(404,"No transfer transactions found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, transaction,"All transfer transactions retrieved successfully"));
})

const getDepositTransactionByAccountId=asyncHandler(async (req, res) => {
    const {accountId} = req.params;
    if(!isValidObjectId(accountId)){
        throw new ApiErrors(404,"Account ID is required");
    }
    const account = await Account.findById(accountId);
    if(!account){
        throw new ApiErrors(404,"Account not found");
    }
    const transaction = await Transaction.find({toAccountId: accountId, type: "deposit"})
    .populate("toAccountId", "accountNumber")
    .select("toAccountId amount type transactionId")
    .sort({createdAt: -1});
    if(!transaction || transaction.length === 0){
        throw new ApiErrors(404,"No deposit transactions found for this account");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, transaction,"Deposit transactions retrieved successfully for account"));
})

const getWithdrawTransactionByAccountId=asyncHandler(async (req, res) => {
    const {accountId} = req.params;
    if(!isValidObjectId(accountId)){
        throw new ApiErrors(404,"Account ID is required");
    }
    const account = await Account.findById(accountId);
    if(!account){
        throw new ApiErrors(404,"Account not found");
    }
    const transaction = await Transaction.find({fromAccountId: accountId, type: "withdraw"})
    .populate("fromAccountId", "accountNumber")
    .select("fromAccountId amount type transactionId")
    .sort({createdAt: -1});
    if(!transaction || transaction.length === 0){
        throw new ApiErrors(404,"No withdraw transactions found for this account");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, transaction,"withdraw transactions retrieved successfully for account"));
})

const getTransferTransactionByAccountId=asyncHandler(async (req, res) => {
    const {accountId} = req.params;
    if(!isValidObjectId(accountId)){
        throw new ApiErrors(404,"Account ID is required");
    }
    const account = await Account.findById(accountId);
    if(!account){
        throw new ApiErrors(404,"Account not found");
    }
    const transaction = await Transaction.find({
            $or:[
                {fromAccountId:accountId},
                {toAccountId:accountId}
            ],
            type: "transfer"
        })
    .populate("toAccountId", "accountNumber")
    .populate("fromAccountId", "accountNumber")
    .select("fromAccountId toAccountId amount type transactionId")
    .sort({createdAt: -1});
    if(!transaction || transaction.length === 0){
        throw new ApiErrors(404,"No transfer transactions found for this account");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, transaction,"transfer transactions retrieved successfully for account"));
})

export {
    depositMoney,
    withdrawMoney,
    transferMoney,
    getTransactionById,
    getAllTransactions,
    getTransactionHistoryByAccountId,
    getDepositTransaction,
    getWithdrawTransaction,
    getTransferTransaction,
    getDepositTransactionByAccountId,
    getWithdrawTransactionByAccountId,
    getTransferTransactionByAccountId,
}