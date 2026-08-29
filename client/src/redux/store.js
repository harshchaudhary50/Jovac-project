import { configureStore } from '@reduxjs/toolkit';
import userSlice from "./userSlice";
import generatorSlice from "./generatorSlice";

export default configureStore({
  reducer: {
    user: userSlice,
    generator: generatorSlice
  },
});