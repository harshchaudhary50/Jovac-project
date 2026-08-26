import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    credits: {
        type: Number,
        default: 50,
        min: 0
    },
    isCreditAvailable: {
        type: Boolean,
        default: true
    },
    notes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Notes",
        default: []
    },
    role: {
        type: String,
        default: "Student"
    },
    course: {
        type: String,
        default: ""
    },
    semester: {
        type: String,
        default: ""
    },
    preferredNoteType: {
        type: String,
        default: "Deep Concept Notes"
    },
    onboardingCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const UserModel = mongoose.model("UserModel", userSchema);

export default UserModel;