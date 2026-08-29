import { createSlice } from "@reduxjs/toolkit";
import { generateNotes } from "../services/api";
import { updateCredits } from "./userSlice";

const generatorSlice = createSlice({
  name: "generator",
  initialState: {
    isGenerating: false,
    activeTopic: "",
    activeParams: null,
    generatedResult: null,
    generationError: null,
    startedAt: null,
    completedAt: null
  },
  reducers: {
    startGeneration: (state, action) => {
      state.isGenerating = true;
      state.activeTopic = action.payload.topic;
      state.activeParams = action.payload;
      state.generatedResult = null;
      state.generationError = null;
      state.startedAt = Date.now();
    },
    generationSuccess: (state, action) => {
      state.isGenerating = false;
      state.generatedResult = action.payload;
      state.generationError = null;
      state.completedAt = Date.now();
    },
    generationFailure: (state, action) => {
      state.isGenerating = false;
      state.generationError = action.payload;
    },
    clearGeneratedResult: (state) => {
      state.generatedResult = null;
      state.generationError = null;
      state.activeTopic = "";
    },
    resetGenerator: (state) => {
      state.isGenerating = false;
      state.activeTopic = "";
      state.activeParams = null;
      state.generatedResult = null;
      state.generationError = null;
    }
  }
});

export const {
  startGeneration,
  generationSuccess,
  generationFailure,
  clearGeneratedResult,
  resetGenerator
} = generatorSlice.actions;

/**
 * Async Background Generation Thunk
 * Continues running regardless of page navigation within the SPA.
 */
export const runBackgroundGeneration = (payload) => async (dispatch) => {
  dispatch(startGeneration(payload));
  try {
    const result = await generateNotes(payload);
    if (result && result.data) {
      dispatch(generationSuccess(result.data));
      if (typeof result.creditsLeft === "number") {
        dispatch(updateCredits(result.creditsLeft));
      }
      return { success: true, data: result.data };
    } else {
      throw new Error("Invalid response format received from AI server");
    }
  } catch (error) {
    console.error("Background Note Generation Error:", error);
    const msg = error.message || "Failed to generate notes. Please try again.";
    dispatch(generationFailure(msg));
    return { success: false, error: msg };
  }
};

export default generatorSlice.reducer;
