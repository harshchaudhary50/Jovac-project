import axios from "axios"
import { serverUrl } from "../App"
import { setUserData, clearUserData } from "../redux/userSlice"

export const getCurrentUser = async (dispatch) => {
    try {
        const result = await axios.get(serverUrl + "/api/user/currentuser", { withCredentials: true });
        if (result.data) {
            dispatch(setUserData(result.data));
        } else {
            dispatch(clearUserData());
        }
    } catch (error) {
        dispatch(clearUserData());
    }
};

export const saveThemePreference = async (theme) => {
    try {
        await axios.post(serverUrl + "/api/user/theme", { theme }, { withCredentials: true });
    } catch (error) {
        console.warn("Theme save warning:", error.message);
    }
};

export const logoutUser = async (dispatch) => {
    try {
        await axios.post(`${serverUrl}/api/auth/logout`, {}, { withCredentials: true });
    } catch (e) {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
        } catch (err) {}
    } finally {
        if (dispatch) {
            dispatch(clearUserData());
        }
    }
};

export const generateNotes = async (payload) => {
    try {
        const result = await axios.post(serverUrl + "/api/notes/generate-notes", payload, { withCredentials: true });
        return result.data;
    } catch (error) {
        console.error("Generate Notes API Error:", error);
        const msg = error.response?.data?.message || error.response?.data?.error || error.message || "Note generation failed";
        throw new Error(msg);
    }
}

export const getNotesHistory = async () => {
    try {
        const result = await axios.get(serverUrl + "/api/notes/get-notes", { withCredentials: true });
        return result.data;
    } catch (error) {
        return { success: false, data: [] };
    }
};

export const deleteNoteApi = async (noteId) => {
    try {
        const result = await axios.delete(`${serverUrl}/api/notes/${noteId}`, { withCredentials: true });
        return result.data;
    } catch (error) {
        console.error("Delete note error:", error);
        throw error;
    }
};

import { exportNotesToPdf } from '../utils/pdfExport';

export const downloadPdf = async (result) => {
    try {
        await exportNotesToPdf(result);
    } catch (error) {
        console.error("PDF export error:", error);
        throw new Error("PDF download failed");
    }
};

export const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const createRazorpayOrder = async (amount) => {
    try {
        const response = await axios.post(serverUrl + "/api/payment/create-order", { amount }, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const verifyPayment = async (paymentData) => {
    try {
        const response = await axios.post(serverUrl + "/api/payment/verify-payment", paymentData, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error;
    }
};