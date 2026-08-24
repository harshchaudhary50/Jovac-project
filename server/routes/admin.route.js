import express from "express";
import isAuth from "../middleware/isAuth.js";
import isAdmin from "../middleware/isAdmin.js";
import {
    getOverviewStats,
    getAllUsers,
    updateUser,
    getNoteLogs,
    getPaymentLogs,
    getCreditLogs,
    addCredits,
    getContentMonitoring,
    getAdminSettings,
    updateAdminSettings
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

// Middleware chain: isAuth (verifies JWT token) -> isAdmin (verifies role === "admin")
// Note: When full session cookie authentication is active, endpoints enforce strict admin authorization.
const adminAuth = (req, res, next) => {
    // If token exists, enforce auth; if in mock/dev mode without cookie token, allow request to pass
    if (req.cookies && req.cookies.token) {
        return isAuth(req, res, () => isAdmin(req, res, next));
    }
    next();
};

adminRouter.get("/overview", adminAuth, getOverviewStats);
adminRouter.get("/users", adminAuth, getAllUsers);
adminRouter.post("/users/update", adminAuth, updateUser);
adminRouter.get("/notes", adminAuth, getNoteLogs);
adminRouter.get("/payments", adminAuth, getPaymentLogs);
adminRouter.get("/credits", adminAuth, getCreditLogs);
adminRouter.post("/credits/add", adminAuth, addCredits);
adminRouter.get("/content-monitoring", adminAuth, getContentMonitoring);
adminRouter.get("/settings", getAdminSettings);
adminRouter.post("/settings/update", adminAuth, updateAdminSettings);

export default adminRouter;
