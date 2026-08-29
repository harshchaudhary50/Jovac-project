import Notes from "../models/notes.model.js";
import UserModel from "../models/user.model.js";
import AdminSettings from "../models/admin.model.js";
import { generateGeminiResponse } from "../services/gemini.services.js";
import { generateGroqResponse } from "../services/groq.services.js";
import { generateOllamaResponse } from "../services/ollama.services.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import mongoose from "mongoose";

export const generateNotes = async (req, res) => {
    try {
        const {
            topic,
            classLevel,
            examType,
            formatMode,
            revisionMode = false,
            includeDiagram = false,
            includeChart = false
        } = req.body;
        if (!topic) {
            return res.status(400).json({ message: "Topic is required" });
        }

        let user;
        if (mongoose.connection.readyState === 1) {
            user = await UserModel.findById(req.userId);
        } else {
            user = { 
                _id: req.userId || "64e0a1b2c3d4e5f678901234", 
                credits: 1000, 
                notes: [],
                role: "Student",
                course: "B.Tech Computer Science",
                semester: "Semester 4",
                preferredNoteType: "Deep Concept Notes"
            };
        }

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Fetch dynamic Admin Settings (Active AI Model + Dynamic Credit Cost)
        let selectedModel = "Gemini 2.5 Flash";
        let costPerGeneration = 10;
        if (mongoose.connection.readyState === 1) {
            const adminSetting = await AdminSettings.findOne();
            if (adminSetting?.selectedAiModel) {
                selectedModel = adminSetting.selectedAiModel;
            }
            if (adminSetting?.creditCostPerGeneration !== undefined && adminSetting?.creditCostPerGeneration !== null) {
                costPerGeneration = Math.max(1, Number(adminSetting.creditCostPerGeneration) || 10);
            }
        }

        if (user.credits < costPerGeneration) {
            if (mongoose.connection.readyState === 1 && typeof user.save === 'function') {
                user.isCreditAvailable = false;
                await user.save();
            }
            return res.status(403).json({
                message: `Insufficient credits. You need at least ${costPerGeneration} credits to generate notes.`
            });
        }

        const prompt = buildPrompt({
            topic,
            classLevel: classLevel || user.semester || user.course,
            examType: examType || user.course,
            formatMode: formatMode || user.preferredNoteType,
            revisionMode,
            includeDiagram,
            includeChart,
            userRole: user.role,
            userCourse: user.course,
            userSemester: user.semester
        });

        let aiResponse = null;
        const isOllama = selectedModel.toLowerCase().includes("ollama") || selectedModel.toLowerCase().includes("local");
        const isGroq = selectedModel.toLowerCase().includes("groq") || selectedModel.toLowerCase().includes("gpt");

        try {
            if (isOllama) {
                console.log("💻 Generating notes using Local Ollama (llama3.2:3b)...");
                aiResponse = await generateOllamaResponse(prompt, topic);
            } else if (isGroq) {
                console.log("⚡ Generating notes using Groq AI...");
                aiResponse = await generateGroqResponse(prompt, topic);
            } else {
                console.log("🧠 Generating notes using Google Gemini 2.5 Flash...");
                aiResponse = await generateGeminiResponse(prompt, topic);
            }
        } catch (primaryError) {
            console.warn("⚠️ Primary AI model failed, falling back to secondary provider...", primaryError.message);
            try {
                // Fallback attempt 1: Groq AI
                aiResponse = await generateGroqResponse(prompt, topic);
            } catch (fallback1) {
                console.warn("⚠️ Fallback 1 failed, trying Gemini...", fallback1.message);
                try {
                    // Fallback attempt 2: Gemini
                    aiResponse = await generateGeminiResponse(prompt, topic);
                } catch (fallback2) {
                    console.error("❌ All AI generation providers failed:", fallback2.message);
                }
            }
        }

        // Strictly validate that AI returned valid content BEFORE deducting credits or saving notes
        if (!aiResponse || (typeof aiResponse !== "object" && typeof aiResponse !== "string")) {
            return res.status(502).json({
                message: "AI model was unable to generate notes at this moment. No credits were deducted. Please try again."
            });
        }

        let notes = { _id: "note_" + Date.now() };
        if (mongoose.connection.readyState === 1) {
            notes = await Notes.create({
                user: user._id,
                topic,
                classLevel,
                examType,
                revisionMode,
                includeDiagram,
                includeChart,
                content: aiResponse
            });

            // Deduct exact configured credits from Admin Settings
            user.credits = Math.max(0, (user.credits || 0) - costPerGeneration);
            if (user.credits <= 0) user.isCreditAvailable = false;
            if (!Array.isArray(user.notes)) user.notes = [];
            user.notes.push(notes._id);
            await user.save();
        } else {
            user.credits = Math.max(0, (user.credits || 0) - costPerGeneration);
        }

        return res.status(200).json({
            data: aiResponse,
            noteId: notes._id,
            creditsLeft: user.credits
        });

    } catch (error) {
        console.error("Generate Notes Controller Error:", error);
        res.status(500).json({
            error: "AI generation failed",
            message: error.message || "Internal server error"
        });
    }
};
