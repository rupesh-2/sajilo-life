// src/services/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCzENeFWQLDEEvalC9jpKgmlbuQqDzu66Y",
    authDomain: "deliveryappauth-5562a.firebaseapp.com",
    projectId: "deliveryappauth-5562a",
    storageBucket: "deliveryappauth-5562a.firebasestorage.app",
    messagingSenderId: "611676620942",
    appId: "1:611676620942:web:1b3fcf8baa9b3359fa61df",
    measurementId: "G-54D36VQGW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);