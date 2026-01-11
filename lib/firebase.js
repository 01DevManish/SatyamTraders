import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDZtRV7ZgsgrhwnjntaNAf0dqBUEmYtQgE",
    authDomain: "preploner.firebaseapp.com",
    projectId: "preploner",
    storageBucket: "preploner.firebasestorage.app",
    messagingSenderId: "104475352938",
    appId: "1:104475352938:web:5e0a7376605bc5a0d08f13",
    measurementId: "G-KFK5JLGWEB"
};

// Initialize Firebase (prevent re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Admin email - only this user can access admin page
export const ADMIN_EMAIL = "admin@satyamtraders.com";

export { app, auth, db };
