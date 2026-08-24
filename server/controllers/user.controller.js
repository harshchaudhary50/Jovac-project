import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "Current User is not found" });
            }
        } else {
            user = { 
                _id: userId || "64e0a1b2c3d4e5f678901234", 
                name: "Student User", 
                email: "student@examnotes.ai", 
                credits: 50,
                role: "Student",
                course: "B.Tech Computer Science",
                semester: "Semester 4",
                preferredNoteType: "Deep Concept Notes",
                onboardingCompleted: true
            };
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `getCurrentUser error ${error}` });
    }
};

export const updateOnboarding = async (req, res) => {
    try {
        const userId = req.userId;
        const { role, course, semester, preferredNoteType } = req.body;

        let user;
        if (mongoose.connection.readyState === 1) {
            user = await UserModel.findByIdAndUpdate(
                userId,
                {
                    role: role || "Student",
                    course: course || "General Studies",
                    semester: semester || "Current Term",
                    preferredNoteType: preferredNoteType || "Deep Concept Notes",
                    onboardingCompleted: true
                },
                { new: true }
            );
        } else {
            user = {
                _id: userId || "64e0a1b2c3d4e5f678901234",
                name: "Student User",
                email: "student@examnotes.ai",
                credits: 50,
                role: role || "Student",
                course: course || "B.Tech Computer Science",
                semester: semester || "Semester 4",
                preferredNoteType: preferredNoteType || "Deep Concept Notes",
                onboardingCompleted: true
            };
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `updateOnboarding error ${error}` });
    }
};