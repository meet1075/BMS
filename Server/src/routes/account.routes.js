import { Router } from "express";
import { createAccount,deleteAccount,getAccountDetails,getAllAccounts,getAllAccountsByUserId,getAllCurrentAccounts,getAllSavingsAccounts,updatePin,setPrimaryAccount,deactivateAccount,activateAccount,checkBalance } from "../controllers/account.controller.js";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);
router.route("/create-account").post(verifyRoles("customer","admin"),createAccount);
router.route("/delete-account/:accountId").delete(verifyRoles("customer","admin"),deleteAccount);
router.route("/get-account-details/:accountId").get(verifyRoles("customer","admin"),getAccountDetails);
router.route("/get-all-accounts").get(verifyRoles("admin"),getAllAccounts);
router.route("/get-all-accounts-by-user/:userId").get(verifyRoles("customer","admin"),getAllAccountsByUserId);
router.route("/get-all-savings-accounts").get(verifyRoles("admin"),getAllSavingsAccounts);
router.route("/get-all-current-accounts").get(verifyRoles("admin"),getAllCurrentAccounts);
router.route("/update-pin/:accountId").patch(verifyRoles("customer","admin"),updatePin);
router.route("/set-primary-account/:accountId").patch(verifyRoles("customer","admin"),setPrimaryAccount);
router.route("/deactivate-account/:accountId").patch(verifyRoles("admin"),deactivateAccount);
router.route("/activate-account/:accountId").patch(verifyRoles("admin"),activateAccount);
router.route("/check-balance/:accountId").get(verifyRoles("customer","admin"),checkBalance);

export default router;