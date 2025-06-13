import {Router} from 'express';
import {verifyJWT, verifyRoles} from '../middlewares/auth.middleware.js';
import {depositMoney,withdrawMoney,transferMoney,getAllTransactions,getDepositTransaction,getDepositTransactionByAccountId,getTransactionById,getTransactionHistoryByAccountId,getTransferTransaction,getTransferTransactionByAccountId,getWithdrawTransaction,getWithdrawTransactionByAccountId} from '../controllers/transaction.controller.js';

const router = Router();
router.use(verifyJWT);

router.route("/deposit/:accountId").patch(verifyRoles("customer"), depositMoney);
router.route("/withdraw/:accountId").patch(verifyRoles("customer"), withdrawMoney);
router.route("/transfer/:fromAccountId").patch(verifyRoles("customer"), transferMoney);
router.route("/transaction/:transactionId").get(verifyRoles("customer,admin"), getTransactionById);
router.route("/transactions").get(verifyRoles("admin"), getAllTransactions);
router.route("/transaction/history/account/:accountId").get(verifyRoles("customer,admin"), getTransactionHistoryByAccountId);
router.route("/transactions/deposit-type").get(verifyRoles("admin"), getDepositTransaction);
router.route("/transactions/deposit/:accountId").get(verifyRoles("customer,admin"), getDepositTransactionByAccountId);
router.route("/transactions/withdraw-type").get(verifyRoles("admin"), getWithdrawTransaction);
router.route("/transactions/withdraw/:accountId").get(verifyRoles("customer,admin"), getWithdrawTransactionByAccountId);
router.route("/transactions/transfer-type").get(verifyRoles("admin"), getTransferTransaction);
router.route("/transactions/transfer/:accountId").get(verifyRoles("customer,admin"), getTransferTransactionByAccountId);

export default router;