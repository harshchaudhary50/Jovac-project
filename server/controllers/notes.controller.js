import Notes from "../models/notes.model.js";

export const getMyNotes = async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: notes || [] });
    } catch (error) {
        console.error("❌ getMyNotes error:", error);
        return res.status(500).json({ success: false, message: `getMyNotes error: ${error.message}`, data: [] });
    }
};

export const getSingleNotes = async (req, res) => {
    try {
        const notes = await Notes.findOne({
            _id: req.params.id,
            user: req.userId
        });
        if (!notes) {
            return res.status(404).json({
                success: false,
                error: "Note not found"
            });
        }
        return res.status(200).json({
            success: true,
            data: notes,
            content: notes.content,
            topic: notes.topic,
            createdAt: notes.createdAt
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: `getSingleNotes error: ${error.message}` });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const note = await Notes.findOneAndDelete({ _id: noteId, user: req.userId });
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found or unauthorized" });
        }
        return res.status(200).json({ success: true, message: "Note deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};