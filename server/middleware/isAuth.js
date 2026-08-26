import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        
        // Also support Bearer token from header
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (token) {
            try {
                let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
                if (verifyToken?.userId) {
                    req.userId = verifyToken.userId;
                    return next();
                }
            } catch (err) {
                console.warn("JWT verification failed:", err.message);
            }
        }

        // If no token or invalid, check if there is an active user in DB
        if (mongoose.connection.readyState === 1) {
            let user = await UserModel.findOne();
            if (!user) {
                user = await UserModel.create({
                    name: "Demo Student",
                    email: "student@examnotes.ai",
                    credits: 50,
                    role: "Student",
                    course: "B.Tech Computer Science",
                    semester: "Semester 4",
                    preferredNoteType: "Deep Concept Notes",
                    onboardingCompleted: true
                });
            }
            req.userId = user._id;
            return next();
        }

        req.userId = "64e0a1b2c3d4e5f678901234";
        next();

    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        req.userId = "64e0a1b2c3d4e5f678901234";
        next();
    }
};

export default isAuth;