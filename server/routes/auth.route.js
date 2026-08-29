import express from "express";
import { googleAuth, emailAuth, logOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/google", googleAuth);
authRouter.post("/email", emailAuth);
authRouter.post("/logout", logOut);
authRouter.get("/logout", logOut);

export default authRouter;