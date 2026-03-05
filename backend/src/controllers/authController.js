import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

const getFrontendUrl = () => {
    let url = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Strip trailing slash if present
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            designation: user.designation,
            officeLocation: user.officeLocation,
            profilePic: user.profilePic,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        // Update last login
        user.lastLogin = new Date().toLocaleString();
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            designation: user.designation,
            officeLocation: user.officeLocation,
            profilePic: user.profilePic,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    console.log("Forgot Password Request for:", email);

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    // Set expire (10 mins)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset URL
    const resetUrl = `${getFrontendUrl()}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please visit: \n\n ${resetUrl}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            .container { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; }
            .header { text-align: center; padding-bottom: 20px; }
            .button { background-color: #4f46e5; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 20px 0; }
            .footer { font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="color: #4f46e5;">Nexus Portal</h1>
            </div>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Welcome to our Portal !! You are receiving this email because you (or someone else) has requested the reset of a password.</p>
            <p>To reset your password, please click on the following button:</p>
            <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Your Password</a>
            </div>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <div class="footer">
                <p>Need help, or have questions? Just reply to the email on the Portal in help section, we'd love to help.</p>
                <p>Yours truly,<br>Support Team</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        console.log("Calling sendEmail utility...");
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            message,
            html,
        });
        console.log("sendEmail utility finished successfully.");

        res.status(200).json({ message: "Email sent" });
    } catch (error) {
        console.error("Forgot Password Controller Error:", error.message);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500).json({ message: error.message || "Email could not be sent" });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    // Hash token to match database
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        res.status(400).json({ message: "Invalid or expired token" });
        return;
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            designation: user.designation,
            officeLocation: user.officeLocation,
            profilePic: user.profilePic,
            lastLogin: user.lastLogin,
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.designation = req.body.designation || user.designation;
        user.officeLocation = req.body.officeLocation || user.officeLocation;
        user.profilePic = req.file ? req.file.path : user.profilePic;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            designation: updatedUser.designation,
            officeLocation: updatedUser.officeLocation,
            profilePic: updatedUser.profilePic,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// @desc    Google auth callback
// @route   GET /api/auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res) => {
    if (!req.user) {
        res.redirect(`${getFrontendUrl()}/login?error=auth_failed`);
        return;
    }

    // Update last login
    req.user.lastLogin = new Date().toLocaleString();
    await req.user.save();

    const token = generateToken(req.user._id);

    // Redirect to frontend with token
    res.redirect(`${getFrontendUrl()}/login?token=${token}`);
};

export { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword, updateUserProfile, googleAuthCallback };
