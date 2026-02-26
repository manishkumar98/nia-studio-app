import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCeObBboLXNYV0POjDLTqkfDSMbqTLA95s",
    authDomain: "nia-nest.firebaseapp.com",
    projectId: "nia-nest",
    storageBucket: "nia-nest.firebasestorage.app",
    messagingSenderId: "5221148078",
    appId: "1:5221148078:web:94cd55857d7abc3a06943f",
    measurementId: "G-Y9P1SPBWLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
