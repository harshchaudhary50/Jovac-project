import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "UserModel",
            required: true
        },
        orderId: {
            type: String,
            required: true
        },
        paymentId: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: "INR"
        },
        creditsAdded: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["success", "failed", "pending"],
            default: "success"
        },
        customerEmail: {
            type: String
        },
        customerName: {
            type: String
        }
    },
    { timestamps: true }
);

const PaymentModel = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default PaymentModel;
