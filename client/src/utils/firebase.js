import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY || "AIzaSyCStYsZtzovu0alNaQYZPxRmo60zELTCec",
  authDomain: "ainotes-a3933.firebaseapp.com",
  projectId: "ainotes-a3933",
  storageBucket: "ainotes-a3933.firebasestorage.app",
  messagingSenderId: "844794980189",
  appId: "1:844794980189:web:1a06ab06bf8cde0a03eab4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };