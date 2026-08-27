import mongoose from "mongoose";
const notesSchema = new mongoose.Schema({
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      required: true
    },

    topic: {
      type: String,
      required: true
    },

    classLevel: String,
    examType: String,

    revisionMode: {
      type: Boolean,
      default: false
    },

    includeDiagram: Boolean,
    includeChart: Boolean,

    monitoringStatus: {
      type: String,
      default: "Normal"
    },

    content: {
      type: mongoose.Schema.Types.Mixed, // AI response (string / JSON)
      required: true
    }

},{timestamps:true})

const Notes = mongoose.model("Notes" , notesSchema)

export default Notes