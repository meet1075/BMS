import  { Router } from "express";
import { register,login,logout } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import passport from "passport";
const router = Router();
router.route("/register").post(register);
router.route("/login").post(login); 
router.route("/logout").post(verifyJWT,logout);

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