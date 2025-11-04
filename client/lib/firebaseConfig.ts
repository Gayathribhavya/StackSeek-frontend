import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// FRONTEND Firebase config (your StackSeek frontend firebase project)
const firebaseConfig = {
  apiKey: "AIzaSyB9JXnOKXVJfiA-hZGTMD98XegCIXziwPY",
  authDomain: "studio-5012646871-facfb.firebaseapp.com",
  projectId: "studio-5012646871-facfb",
  storageBucket: "studio-5012646871-facfb.firebasestorage.app",
  messagingSenderId: "751817350847",
  appId: "1:751817350847:web:63130d4e749da40259f00a"
};

// Initialize Firebase once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth + Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// IMPORTANT: provider with your Web Client ID
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  client_id: "751817350847-lg3irjlqog288gk0rj6se2tp58vgglil.apps.googleusercontent.com"
});
