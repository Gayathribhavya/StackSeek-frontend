// firebaseConfig.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9JXnOKXVJfiA-hZGTMD98XegCIXziwPY",
  authDomain: "studio-5012646871-facfb.firebaseapp.com",
  projectId: "studio-5012646871-facfb",
  storageBucket: "studio-5012646871-facfb.firebasestorage.app",
  messagingSenderId: "751817350847",
  appId: "1:751817350847:web:63130d4e749da40259f00a",
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exports
export const auth = getAuth(app);
export const db = getFirestore(app);

// Providers
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
