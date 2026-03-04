import express from "express";
import multer from "multer";
import { profileStorage } from "../config/cloudinary.js";
import {
    registerUser,
    loginUser,
    getUserProfile,
    forgotPassword,
    resetPassword,
    updateUserProfile,
    googleAuthCallback,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import passport from "passport";

const router = express.Router();
const upload = multer({ storage: profileStorage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, upload.single("profilePic"), updateUserProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Google Auth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=google_failed` }),
    googleAuthCallback
);

// Microsoft Auth Routes
router.get("/microsoft", passport.authenticate("microsoft", { scope: ["user.read"] }));
router.get(
    "/microsoft/callback",
    passport.authenticate("microsoft", { session: false, failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=microsoft_failed` }),
    googleAuthCallback
);

export default router;
