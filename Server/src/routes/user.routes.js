import  { Router } from "express";
import { register,login,logout,updateDetails,ChangePassword,getCurrentCustomer,getAllUsers,getUserById,deactivateUser,activateUser,refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJWT,verifyRoles } from "../middlewares/auth.middleware.js";
import passport from "passport";
const router = Router();

router.route("/register").post(register);
router.route("/login").post(login); 
router.route("/logout").post(verifyJWT,logout);
router.route("/update-details").patch(verifyJWT,updateDetails);
router.route("/change-password").patch(verifyJWT,ChangePassword);
router.route("/current-customer").get(verifyJWT,getCurrentCustomer);
router.route("/refresh-access-token").post(verifyJWT,refreshAccessToken);
router.route("/get-all-user").get(verifyJWT,verifyRoles("admin"),getAllUsers);
router.route("/get-user-by-id/:userId").get(verifyJWT,verifyRoles("admin"),getUserById);
router.route("/deactivate-user/:userId").patch(verifyJWT,verifyRoles("admin"),deactivateUser);
router.route("/activate-user/:userId").patch(verifyJWT,verifyRoles("admin"),activateUser);

router.get("/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

router.get("/google/callback",passport.authenticate("google",{failureRedirect:"/login", session:false}),

async (req, res) => {
    const{generateAccessAndRefreshToken} = await import("../controllers/user.controller.js");
    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(req.user._id);

    res
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .redirect("http://localhost:3000/dashboard");
}

);

export default router;