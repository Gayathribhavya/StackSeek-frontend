// Firebase configuration and initialization for StackSeekUI
//
// This file mirrors the setup used in the original error-analyzer
// project. It centralizes initialization of Firebase and exports
// the `auth` and `db` instances so that other parts of the
// application can perform authentication and database operations.

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Your Firebase configuration. This should match the
// configuration used in the original error-analyzer project so
// that authentication works seamlessly across the two UIs.
const firebaseConfig = {
  apiKey: "AIzaSyAnu2nS2-OSknQAMeCOkpXpQCvVj2LodV8",
  authDomain: "stackseek-backend.firebaseapp.com",
  projectId: "stackseek-backend",
  storageBucket: "stackseek-backend.firebasestorage.app",
  messagingSenderId: "568164620056",
  appId: "1:568164620056:web:7f6a18cf9e14e16416706d",
  measurementId: "G-TDRBMGGGG1"
};
// Initialize Firebase only once. If the app has already been
// initialized (e.g. during a hot reload) reuse the existing app.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export auth and firestore instances. Other modules can import
// these to interact with Firebase authentication and database.
export const auth = getAuth(app);
export const db = getFirestore(app);
