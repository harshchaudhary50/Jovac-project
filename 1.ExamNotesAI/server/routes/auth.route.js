import express from "express"
import { googleAuth, logOut, login, signup } from "../controllers/auth.controller.js"

const authRouter = express.Router()

authRouter.post("/google" , googleAuth)
authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.get("/logout" , logOut)
export default authRouter