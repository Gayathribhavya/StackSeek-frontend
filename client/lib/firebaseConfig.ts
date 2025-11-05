import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider,
  GithubAuthProvider
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// FRONTEND Firebase config (StackSeek frontend firebase project)
const firebaseConfig = {
  apiKey: "AIzaSyB9JXnOKXVJfiA-hZGTMD98XegCIXziwPY",
  authDomain: "studio-5012646871-facfb.firebaseapp.com",
  projectId: "studio-5012646871-facfb",
  storageBucket: "studio-5012646871-facfb.firebasestorage.app",
  messagingSenderId: "751817350847",
  appId: "1:751817350847:web:63130d4e749da40259f00a"
};

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// AUTH & DB EXPORTS
export const auth = getAuth(app);
export const db = getFirestore(app);

// GOOGLE PROVIDER
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  client_id: "751817350847-lg3irjlqog288gk0rj6se2tp58vgglil.apps.googleusercontent.com"
});

// GITHUB PROVIDER
export const githubProvider = new GithubAuthProvider();
