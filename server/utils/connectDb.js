import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 8000
        });
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        if (error.message.includes("whitelist") || error.message.includes("ServerSelectionError")) {
            console.error("💡 TIP: Please whitelist your IP address in MongoDB Atlas (Network Access -> Add IP Address -> 0.0.0.0/0).");
        }
    }
}
export default connectDb;