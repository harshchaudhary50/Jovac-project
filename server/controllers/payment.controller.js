import Razorpay from "razorpay";
import crypto from "crypto";
import UserModel from "../models/user.model.js";
import PaymentModel from "../models/payment.model.js";
import AdminSettings from "../models/admin.model.js";
import dotenv from "dotenv";
dotenv.config();

const getRazorpayInstance = () => {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
        throw new Error("Razorpay Key ID or Secret is missing in environment variables");
    }

    return new Razorpay({
        key_id,
        key_secret
    });
};

/**
 * Calculate credits granted based on paid amount
 */
const getCreditsForAmount = async (amount) => {
    const amt = Number(amount);
    
    // Check dynamic prices from Admin Settings
    let starterPrice = 49;
    let proPrice = 199;
    try {
        const adminSetting = await AdminSettings.findOne();
        if (adminSetting?.starterPlanPrice) starterPrice = adminSetting.starterPlanPrice;
        if (adminSetting?.proPlanPrice) proPrice = adminSetting.proPlanPrice;
    } catch (e) {}

    if (amt === starterPrice) return 60;
    if (amt === proPrice) return 300;
    if (amt === 499) return 1000;

    // Proportional fallback (~1.5 credits per Rupee)
    return Math.max(10, Math.round(amt * 1.5));
};

/**
 * Create a new Razorpay Order
 */
export const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "Valid payment amount is required" });
        }

        const razorpay = getRazorpayInstance();

        const options = {
            amount: Math.round(Number(amount) * 100), // Amount in paise (1 INR = 100 paise)
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error("Razorpay createOrder error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to initialize Razorpay order"
        });
    }
};

/**
 * Cryptographically verify Razorpay payment and credit user account
 */
export const verifyPayment = async (req, res) => {
    try {
        const userId = req.userId;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ success: false, message: "Incomplete payment verification payload" });
        }

        // Cryptographic HMAC SHA256 Signature Verification
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generatedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            console.error("❌ Razorpay signature verification mismatch!");
            return res.status(400).json({ success: false, message: "Payment verification signature failed" });
        }

        // Fetch Order details from Razorpay to confirm exact paid amount
        const razorpay = getRazorpayInstance();
        const orderDetails = await razorpay.orders.fetch(razorpay_order_id);
        const amountInRupees = Math.round(orderDetails.amount / 100);

        const creditsToAdd = await getCreditsForAmount(amountInRupees);

        // Update User Credits in MongoDB
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User account not found" });
        }

        user.credits = (user.credits || 0) + creditsToAdd;
        user.isCreditAvailable = true;
        await user.save();

        // Record Transaction in Payment Database
        await PaymentModel.create({
            user: user._id,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            amount: amountInRupees,
            currency: "INR",
            creditsAdded: creditsToAdd,
            status: "success",
            customerEmail: user.email,
            customerName: user.name
        });

        console.log(`✅ Payment Verified: ₹${amountInRupees} received. Added ${creditsToAdd} credits to ${user.email}.`);

        return res.status(200).json({
            success: true,
            message: "Payment successfully verified and credits added",
            creditsAdded: creditsToAdd,
            totalCredits: user.credits
        });

    } catch (error) {
        console.error("Razorpay verifyPayment error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to verify payment"
        });
    }
};
