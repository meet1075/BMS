import { Router } from "express";
import { createAccount } from "../controllers/account.controller.js";
import { verifyJWT, verifyRoles } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);
router.route("/create-account").post(verifyRoles("customer","admin"),createAccount);

export default router;