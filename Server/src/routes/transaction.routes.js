import {Router} from 'express';
import {verifyJWT, verifyRoles} from '../middlewares/auth.middleware.js';
import {depositMoney,withdrawMoney,transferMoney,getAllTransactions,getTransactionById,getDepositTransaction,getTransferTransaction,getWithdrawTransaction,getTransactionByUserId} from '../controllers/transaction.controller.js';

const router = Router();
router.use(verifyJWT);

router.route("/deposit/:accountId").patch(verifyRoles("customer"), depositMoney);
router.route("/withdraw/:accountId").patch(verifyRoles("customer"), withdrawMoney);
router.route("/transfer/:fromAccountId").patch(verifyRoles("customer"), transferMoney);
router.route("/transaction/:transactionId").get(verifyRoles("customer,admin"), getTransactionById);
router.route("/transactions").get(verifyRoles("admin"), getAllTransactions);
router.route("/transactions/deposit-type").get(verifyRoles("admin"), getDepositTransaction);
router.route("/transactions/withdraw-type").get(verifyRoles("admin"), getWithdrawTransaction);
router.route("/transactions/transfer-type").get(verifyRoles("admin"), getTransferTransaction);
router.route("/get-transaction-data/:userId").get(verifyRoles("customer,admin"), getTransactionByUserId);

export default router;