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
                user = await UserModel.create({ 
                    name: name || "Student User", 
                    email, 
                    credits: 50,
                    onboardingCompleted: false 
                });
            }
        } else {
            user = { 
                _id: "64e0a1b2c3d4e5f678901234", 
                name: name || "Student User", 
                email: email || "student@examnotes.ai", 
                credits: 50,
                role: "student",
                course: "",
                semester: "",
                preferredNoteType: "Deep Concept Notes",
                onboardingCompleted: false 
            };
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
        return res.status(500).json({ message: error.message });
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
                user = await UserModel.create({ 
                    name: userName, 
                    email, 
                    credits: 50,
                    onboardingCompleted: false 
                });
            }
        } else {
            const userName = name || email.split("@")[0];
            user = { 
                _id: "64e0a1b2c3d4e5f678901234", 
                name: userName, 
                email: email, 
                credits: 50,
                role: "student",
                course: "",
                semester: "",
                preferredNoteType: "Deep Concept Notes",
                onboardingCompleted: false 
            };
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
        return res.status(500).json({ message: error.message });
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