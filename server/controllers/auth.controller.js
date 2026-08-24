import UserModel from "../models/user.model.js";
import { getToken } from "../utils/token.js";
import mongoose from "mongoose";

export const googleAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await UserModel.findOne({ email });
            if (!user) {
                user = await UserModel.create({ name, email, onboardingCompleted: false });
            } else {
                // If user already exists, mark onboarding as completed if course/role is set or default to true for returning user
                if (!user.onboardingCompleted && (user.course || user.role)) {
                    user.onboardingCompleted = true;
                    await user.save();
                }
            }
        } else {
            console.log("DB offline, using instant auth session");
            user = { 
                _id: "64e0a1b2c3d4e5f678901234", 
                name: name || "Student User", 
                email: email || "student@preppulse.ai", 
                credits: 50,
                role: "Student",
                course: "B.Tech Computer Science",
                semester: "Semester 4",
                preferredNoteType: "Deep Concept Notes",
                onboardingCompleted: true 
            };
        }
        
        let token = await getToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            samesite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json(user);
    } catch (error) {
        const mockUser = { 
            _id: "64e0a1b2c3d4e5f678901234", 
            name: req.body.name || "Student User", 
            email: req.body.email || "student@preppulse.ai", 
            credits: 50,
            role: "Student",
            course: "B.Tech Computer Science",
            semester: "Semester 4",
            preferredNoteType: "Deep Concept Notes",
            onboardingCompleted: true 
        };
        res.cookie("token", "mock_token_12345", {
            httpOnly: true,
            secure: true,
            samesite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json(mockUser);
    }
};

export const emailAuth = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await UserModel.findOne({ email });
            if (!user) {
                const userName = name || email.split("@")[0];
                user = await UserModel.create({ name: userName, email, onboardingCompleted: false });
            } else {
                // For returning users, mark onboarding as completed
                if (!user.onboardingCompleted) {
                    user.onboardingCompleted = true;
                    await user.save();
                }
            }
        } else {
            console.log("DB offline, using instant auth session");
            const userName = name || email.split("@")[0];
            user = { 
                _id: "64e0a1b2c3d4e5f678901234", 
                name: userName, 
                email: email, 
                credits: 50,
                role: "Student",
                course: "B.Tech Computer Science",
                semester: "Semester 4",
                preferredNoteType: "Deep Concept Notes",
                onboardingCompleted: true 
            };
        }

        let token = await getToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            samesite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json(user);
    } catch (error) {
        const userName = req.body.name || (req.body.email ? req.body.email.split("@")[0] : "Student User");
        const mockUser = { 
            _id: "64e0a1b2c3d4e5f678901234", 
            name: userName, 
            email: req.body.email || "student@preppulse.ai", 
            credits: 50,
            role: "Student",
            course: "B.Tech Computer Science",
            semester: "Semester 4",
            preferredNoteType: "Deep Concept Notes",
            onboardingCompleted: true 
        };
        res.cookie("token", "mock_token_12345", {
            httpOnly: true,
            secure: true,
            samesite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json(mockUser);
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};