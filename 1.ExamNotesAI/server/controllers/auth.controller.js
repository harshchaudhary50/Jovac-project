import UserModel from "../models/user.model.js"
import { getToken } from "../utils/token.js"
import crypto from "crypto"

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => ({
    salt,
    hash: crypto.scryptSync(password, salt, 64).toString("hex")
})

const setAuthCookie = async (res, userId) => {
    const token = await getToken(userId)
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: "Name, email and password are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        const normalizedEmail = email.trim().toLowerCase()
        if (await UserModel.exists({ email: normalizedEmail })) {
            return res.status(409).json({ message: "An account with this email already exists" })
        }
        const { salt, hash } = hashPassword(password)
        const user = await UserModel.create({ name: name.trim(), email: normalizedEmail, passwordHash: `${salt}:${hash}` })
        user.passwordHash = undefined
        await setAuthCookie(res, user._id)
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Signup error ${error.message}` })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email: email?.trim().toLowerCase() }).select("+passwordHash")
        if (!user?.passwordHash) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        const [salt, storedHash] = user.passwordHash.split(":")
        const { hash } = hashPassword(password || "", salt)
        if (!crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"))) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        user.passwordHash = undefined
        await setAuthCookie(res, user._id)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: `Login error ${error.message}` })
    }
}


export const googleAuth = async (req,res) => {
    try {
        
        const {name , email} = req.body
        let user = await UserModel.findOne({email})
        if(!user){
            user = await UserModel.create({
                name , email
            })
        }
        await setAuthCookie(res, user._id)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`googleSignup Error  ${error}`})
    }
    
}

export const logOut = async (req,res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        })
         return res.status(200).json({message:"LogOut Successfully"})
    } catch (error) {
        return res.status(500).json({message:`Logout Error  ${error}`})
    }
}