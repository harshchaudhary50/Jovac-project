import UserModel from "../models/user.model.js";
import { getToken } from "../utils/token.js";
import mongoose from "mongoose";

// List of 3 Authorized Admin Emails (Primary + 2 slots for future)
export const ADMIN_EMAILS = [
    "jadounmadhav44@gmail.com",                     // Primary Admin
    process.env.ADMIN_EMAIL_2 || "admin2@gmail.com", // Admin Slot 2 (Change via .env or here)
    process.env.ADMIN_EMAIL_3 || "admin3@gmail.com"  // Admin Slot 3 (Change via .env or here)
].map(e => e.toLowerCase().trim());

const isEmailAdmin = (email) => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

const isValidEmail = (email) => {
    if (!email) return false;
    const trimmed = email.trim().toLowerCase();
    const basicRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!basicRegex.test(trimmed)) return false;

    const allowedDomains = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "hotmail.com",
        "icloud.com",
        "proton.me",
        "protonmail.com"
    ];

    const domain = trimmed.split("@")[1];
    if (!domain) return false;

    return allowedDomains.includes(domain) || 
           domain.endsWith(".edu") || 
           domain.endsWith(".ac.in") || 
           domain.endsWith(".edu.in");
};

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: "A valid email is required" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const isAdmin = isEmailAdmin(normalizedEmail);
        const userRole = isAdmin ? "Admin" : "Student";

        let user = await UserModel.findOne({ email: normalizedEmail });
        
        if (!user) {
            user = await UserModel.create({ 
                name: name || "Student User", 
                email: normalizedEmail, 
                credits: 50, 
                role: userRole, 
                onboardingCompleted: false 
            });
        } else {
            // Preserve onboarding completed status if user already completed onboarding or set course
            if ((user.course && user.course.trim().length > 0) || user.onboardingCompleted) {
                user.onboardingCompleted = true;
            }
            // Ensure admin role is updated if email matches admin list
            if (isAdmin && user.role !== "Admin") {
                user.role = "Admin";
            }
            await user.save();
        }
        
        let token = await getToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json(user);
    } catch (error) {
        console.error("❌ googleAuth error:", error);
        return res.status(500).json({ message: "Database connection failed. Please check MongoDB Atlas IP access." });
    }
};

export const emailAuth = async (req, res) => {
    try {
        const { name, email, password, isSignUp } = req.body;
        if (!email || !isValidEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email address (e.g. name@gmail.com)" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const isAdmin = isEmailAdmin(normalizedEmail);
        const userRole = isAdmin ? "Admin" : "Student";

        let user = await UserModel.findOne({ email: normalizedEmail });

        if (isSignUp) {
            // Sign Up flow: Check if user already exists
            if (user) {
                return res.status(400).json({ message: "An account with this email already exists. Please sign in." });
            }
            const userName = name?.trim() || normalizedEmail.split("@")[0];
            user = await UserModel.create({ 
                name: userName, 
                email: normalizedEmail, 
                credits: 50, 
                role: userRole, 
                onboardingCompleted: false 
            });
        } else {
            // Sign In flow: User must exist in the database
            if (!user) {
                return res.status(404).json({ message: "No account found with this email. Please create an account first." });
            }
            // Preserve onboarding completed status if profile was previously saved
            if ((user.course && user.course.trim().length > 0) || user.onboardingCompleted) {
                user.onboardingCompleted = true;
            }
            if (isAdmin && user.role !== "Admin") {
                user.role = "Admin";
            }
            await user.save();
        }

        let token = await getToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json(user);
    } catch (error) {
        console.error("❌ emailAuth error:", error);
        return res.status(500).json({ message: "Database connection error. Please ensure MongoDB Atlas allows connection." });
    }
};

export const logOut = async (req, res) => {
    try {
        const isProd = process.env.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax"
        };
        res.clearCookie("token", cookieOptions);
        res.cookie("token", "", {
            ...cookieOptions,
            expires: new Date(0),
            maxAge: 0
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};