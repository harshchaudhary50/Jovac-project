import UserModel from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User account not found." });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `getCurrentUser error: ${error.message}` });
    }
};

export const updateOnboarding = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { role, course, semester, preferredNoteType, teacherDept, teacherAudience, teacherMaterialType } = req.body;

        const finalCourse = course || teacherDept || "General Studies";
        const finalSemester = semester || teacherAudience || "Current Term";
        const finalNoteType = preferredNoteType || teacherMaterialType || "Deep Concept Notes";

        const user = await UserModel.findByIdAndUpdate(
            userId,
            {
                role: role || "Student",
                course: finalCourse,
                semester: finalSemester,
                preferredNoteType: finalNoteType,
                onboardingCompleted: true
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `updateOnboarding error: ${error.message}` });
    }
};

export const updateThemePreference = async (req, res) => {
    try {
        const userId = req.userId;
        const { theme } = req.body; // 'light' or 'dark'

        if (!['light', 'dark'].includes(theme)) {
            return res.status(400).json({ message: "Invalid theme value. Must be 'light' or 'dark'." });
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { themePreference: theme },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        return res.status(200).json({ success: true, themePreference: user.themePreference });
    } catch (error) {
        return res.status(500).json({ message: `updateThemePreference error: ${error.message}` });
    }
};