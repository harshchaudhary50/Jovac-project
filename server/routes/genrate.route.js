import express from "express";
import isAuth from "../middleware/isAuth.js";
import { generateNotes } from "../controllers/generate.controller.js";
import { getMyNotes, getSingleNotes, deleteNote } from "../controllers/notes.controller.js";

const notesRouter = express.Router();

notesRouter.post("/generate-notes", isAuth, generateNotes);
notesRouter.get("/getnotes", isAuth, getMyNotes);
notesRouter.get("/get-notes", isAuth, getMyNotes);
notesRouter.get("/:id", isAuth, getSingleNotes);
notesRouter.delete("/:id", isAuth, deleteNote);

export default notesRouter;