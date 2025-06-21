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
    const {amount,pin} = req.body;
    if(!amount || amount <= 0){
        throw new ApiErrors(400,"Amount is required and should be greater than zero");
    }
    if(!pin || pin.length !== 4){
        throw new ApiErrors(400,"Pin is required and should be 4 digits");
    }

    const account = await Account.findById(accountId);
    if(!account){
        throw new ApiErrors(404,"Account not found");
    }
    if(account.status !== "activate"){
        throw new ApiErrors(400,"Account is not activated");
    }
    const isPinCorrect=await account.isPinCorrect(pin);
    if(!isPinCorrect){  
        throw new ApiErrors(400,"Incorrect pin");
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
    const {amount,pin} = req.body;
    if(!amount || amount <= 0){
        throw new ApiErrors(400,"Amount is required and should be greater than zero");
    }
    if(!pin || pin.length !== 4){
        throw new ApiErrors(400,"Pin is required and should be 4 digits");
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
    const isPinCorrect=await account.isPinCorrect(pin);
    if(!isPinCorrect){
        throw new ApiErrors(400,"Incorrect pin");
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
    const {toAccountNumber, amount,pin} = req.body;
    if(!pin || pin.length !== 4){
        throw new ApiErrors(400,"Pin is required and should be 4 digits");
    }
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
    const isPinCorrect=await fromAccount.isPinCorrect(pin);
    if(!isPinCorrect){
        throw new ApiErrors(400,"Incorrect pin");
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
    const transactions = await Transaction.find()
        .populate("toAccountId", "accountNumber accountType")
        .populate("fromAccountId", "accountNumber accountType")
        .populate("userId", "name email")
        .select("fromAccountId toAccountId amount type transactionId status createdAt userId")
        .sort({createdAt: -1});
    
    if(!transactions || transactions.length === 0){
        throw new ApiErrors(404,"No transactions found");
    }
    
    return res
        .status(200)
        .json(new ApiResponse(200, { transactions }, "All transactions retrieved successfully"));
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

const getTransactionByUserId = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { type, accountNumber } = req.query;

  if (!isValidObjectId(userId)) {
    throw new ApiErrors(404, "User ID is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiErrors(404, "User not found");
  }

  const userAccounts = await Account.find({ userId: user._id }).select("_id");

  const accountIds = userAccounts.map(acc => acc._id.toString());

  const query = {
    $or: [
      { fromAccountId: { $in: accountIds } },
      { toAccountId: { $in: accountIds } }
    ]
  };

  if (type && ["deposit", "withdraw", "transfer"].includes(type.toLowerCase())) {
    query.type = type.toLowerCase();
  }

  if (accountNumber && accountNumber !== "all") {
    const account = await Account.findOne({ accountNumber });
    if (!account) {
      return res.status(200).json(new ApiResponse(200, [], "No transactions found for this account"));
    }

    const accountIdStr = account._id.toString();

    // Restrict to only that account
    query.$or = [
      { fromAccountId: accountIdStr },
      { toAccountId: accountIdStr },
    ];
  }

  const transactions = await Transaction.find(query)
    .populate("toAccountId", "accountNumber accountType")
    .populate("fromAccountId", "accountNumber accountType")
    .select("fromAccountId toAccountId amount type transactionId status createdAt")
    .sort({ createdAt: -1 });

  if (!transactions || transactions.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No transactions found for this user"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, transactions, "Transactions retrieved successfully for user"));
});
export {
    depositMoney,
    withdrawMoney,
    transferMoney,
    getTransactionById,
    getAllTransactions,
    getTransactionByUserId,
    getDepositTransaction,
    getWithdrawTransaction,
    getTransferTransaction,
}