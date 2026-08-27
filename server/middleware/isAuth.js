import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        
        // Also support Bearer token from Authorization header
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Authentication required. Please log in." });
        }

        const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret_key_12345";
        const verifyToken = jwt.verify(token, jwtSecret);
        
        if (!verifyToken?.userId) {
            return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
        }

        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Authentication session expired. Please log in again." });
    }
};

export default isAuth;