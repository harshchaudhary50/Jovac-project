import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema({
    creditCostPerGeneration: {
        type: Number,
        default: 10
    },
    starterPlanPrice: {
        type: Number,
        default: 49
    },
    proPlanPrice: {
        type: Number,
        default: 199
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    selectedAiModel: {
        type: String,
        default: "Gemini 2.5 Flash"
    },
    announcementBanner: {
        type: String,
        default: "Welcome to PrepAI! Upgrade to Pro for unlimited priority note generation."
    },
    isBannerActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const AdminSettings = mongoose.model("AdminSettings", adminSettingsSchema);

export default AdminSettings;
