import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getCurrentUser, updateOnboarding, updateThemePreference } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/currentuser", isAuth, getCurrentUser);
userRouter.post("/onboarding", isAuth, updateOnboarding);
userRouter.post("/theme", isAuth, updateThemePreference);

export default userRouter;