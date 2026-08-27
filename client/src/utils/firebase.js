import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ainotes-a3933.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ainotes-a3933",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ainotes-a3933.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "844794980189",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:844794980189:web:1a06ab06bf8cde0a03eab4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };