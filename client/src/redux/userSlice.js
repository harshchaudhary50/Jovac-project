import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        authChecked: false
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
            state.authChecked = true;
        },
        clearUserData: (state) => {
            state.userData = null;
            state.authChecked = true;
        },
        updateCredits: (state, action) => {
            if (state.userData) {
                state.userData.credits = action.payload;
            }
        },
        updateUserTheme: (state, action) => {
            if (state.userData) {
                state.userData.themePreference = action.payload;
            }
        }
    }
});

export const { setUserData, clearUserData, updateCredits, updateUserTheme } = userSlice.actions;

export default userSlice.reducer;