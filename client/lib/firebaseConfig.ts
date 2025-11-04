import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration copied from the working error‑analyzer project.
// These values correspond to the backend project "erroranalyzerbackend" and must
// remain in sync with your Firebase console. If you need to rotate
// credentials, update them here as well as in the backend.
const firebaseConfig = {
  apiKey: "AIzaSyAnu2nS2-OSknQAMeCOkpXpQCvVj2LodV8",
  authDomain: "stackseek-backend.firebaseapp.com",
  projectId: "stackseek-backend",
  storageBucket: "stackseek-backend.firebasestorage.app",
  messagingSenderId: "568164620056",
  appId: "1:568164620056:web:7f6a18cf9e14e16416706d",
  measurementId: "G-TDRBMGGGG1"
};

// Initialize Firebase only once. The `getApps()` check prevents re‑initialization
// when this module is imported multiple times.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export the Auth and Firestore instances for use throughout the client.
export const auth = getAuth(app);
export const db = getFirestore(app);