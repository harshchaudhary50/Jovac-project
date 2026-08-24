import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_MOCK_USER = {
    _id: "64e0a1b2c3d4e5f678901234",
    name: "Student User",
    email: "student@preppulse.ai",
    credits: 120,
    role: "Student",
    course: "B.Tech Computer Science",
    semester: "Semester 4",
    preferredNoteType: "Deep Concept Notes",
    onboardingCompleted: true
};

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: DEFAULT_MOCK_USER
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload || DEFAULT_MOCK_USER;
        },
        updateCredits: (state, action) => {
            if (state.userData) {
                state.userData.credits = action.payload;
            }
        }
    }
});

export const { setUserData, updateCredits } = userSlice.actions;

export default userSlice.reducer;