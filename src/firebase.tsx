// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCcSjaEKZq6MV-qpzuBqQlSAOV1YFKARBg",
  authDomain: "dowhat-de940.firebaseapp.com",
  projectId: "dowhat-de940",
  storageBucket: "dowhat-de940.appspot.com",
  messagingSenderId: "400482231055",
  appId: "1:400482231055:web:23ffb8e584473d21e1147a",
  measurementId: "G-NFTWH7M32G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
export const db = getFirestore(app);