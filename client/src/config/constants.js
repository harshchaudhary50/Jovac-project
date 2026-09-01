/**
 * Application Constants & Environment Configurations
 */

export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "https://jovac-project-fu4c.onrender.com";

export const APP_CONFIG = {
  name: "ExamNotesAI",
  brandName: "NoteX",
  version: "1.0.0",
  defaultTheme: "dark",
  supportEmail: "support@examnotesai.com"
};

export const API_ROUTES = {
  AUTH: {
    GOOGLE: `${SERVER_URL}/api/auth/google`,
    EMAIL: `${SERVER_URL}/api/auth/email`,
    LOGOUT: `${SERVER_URL}/api/auth/logout`
  },
  USER: {
    CURRENT: `${SERVER_URL}/api/user/currentuser`,
    THEME: `${SERVER_URL}/api/user/theme`,
    ONBOARDING: `${SERVER_URL}/api/user/onboarding`
  },
  NOTES: {
    GENERATE: `${SERVER_URL}/api/notes/generate-notes`,
    GET_ALL: `${SERVER_URL}/api/notes/get-notes`,
    SINGLE: (id) => `${SERVER_URL}/api/notes/${id}`,
    DELETE: (id) => `${SERVER_URL}/api/notes/${id}`
  },
  PAYMENT: {
    CREATE_ORDER: `${SERVER_URL}/api/payment/create-order`,
    VERIFY: `${SERVER_URL}/api/payment/verify-payment`
  },
  ADMIN: {
    SETTINGS: `${SERVER_URL}/api/admin/settings`
  }
};
