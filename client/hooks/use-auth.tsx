"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../../client/config";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut,
  updateProfile as firebaseUpdateProfile,
  fetchSignInMethodsForEmail,
  linkWithPopup,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../lib/firebaseConfig";

/**
 * A React context that exposes authentication state and helpers backed by
 * Firebase authentication.
 */
interface AuthContextValue {
  /** The user object or null if not authenticated. */
  user: any;
  /** True if a user is logged in and their auth state has been resolved. */
  isAuthenticated: boolean;
  /** True while determining the initial auth state. */
  loading: boolean;
  /** Create a new user with email/password and send a verification email. */
  register: (email: string, password: string, name?: string) => Promise<void>;
  /** Sign in with email/password. */
  login: (email: string, password: string) => Promise<void>;
  /** Sign in via Google OAuth. */
  loginWithGoogle: () => Promise<void>;
  /** Sign in via GitHub OAuth. */
  loginWithGitHub: () => Promise<void>;
  /** Sign in via Microsoft OAuth. */
  loginWithMicrosoft: () => Promise<void>;
  /** Sign out the current user. */
  logout: () => Promise<void>;
  /** Retrieve the current user's ID token, or null if not logged in. */
  getIdToken: () => Promise<string | null>;
  /** Update user profile information */
  updateProfile: (updates: { displayName?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize Firebase authentication listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAuthenticated(!!firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, name?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Update the user's display name if provided
      if (name && userCredential.user) {
        await firebaseUpdateProfile(userCredential.user, {
          displayName: name,
        });
      }

      // Send email verification
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }

      // Navigate to login page for email verification
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Google login error:", error);
      throw error;
    }
  };

  const loginWithGitHub = async () => {
    try {
      const provider = new GithubAuthProvider();
      provider.addScope('user:email');
      
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (error: any) {
        // Handle account exists with different credential error
        if (error.code === 'auth/account-exists-with-different-credential') {
          const email = error.customData?.email;
          if (email) {
            // Get existing sign-in methods for this email
            const methods = await fetchSignInMethodsForEmail(auth, email);
            
            let message = `An account with email ${email} already exists using: ${methods.join(', ')}`;
            
            if (methods.includes('google.com')) {
              message += '\n\nWould you like to sign in with Google instead and link your GitHub account?';
              if (window.confirm(message)) {
                // Sign in with Google first, then link GitHub
                const googleProvider = new GoogleAuthProvider();
                const googleResult = await signInWithPopup(auth, googleProvider);
                
                // Now link the GitHub account
                try {
                  await linkWithPopup(googleResult.user, provider);
                  result = googleResult; // Use the Google result but now with GitHub linked
                } catch (linkError: any) {
                  console.log("Failed to link GitHub account:", linkError);
                  // Continue with Google login even if linking fails
                  result = googleResult;
                }
              } else {
                throw new Error("Please sign in with your existing account method");
              }
            } else if (methods.includes('microsoft.com')) {
              message += '\n\nWould you like to sign in with Microsoft instead and link your GitHub account?';
              if (window.confirm(message)) {
                // Sign in with Microsoft first, then link GitHub
                const msProvider = new OAuthProvider('microsoft.com');
                msProvider.addScope('openid');
                msProvider.addScope('email');
                msProvider.addScope('profile');
                const msResult = await signInWithPopup(auth, msProvider);
                
                // Now link the GitHub account
                try {
                  await linkWithPopup(msResult.user, provider);
                  result = msResult; // Use the Microsoft result but now with GitHub linked
                } catch (linkError: any) {
                  console.log("Failed to link GitHub account:", linkError);
                  // Continue with Microsoft login even if linking fails
                  result = msResult;
                }
              } else {
                throw new Error("Please sign in with your existing account method");
              }
            } else {
              throw new Error(message + '\n\nPlease sign in using one of the existing methods.');
            }
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
      
      // Save user profile to backend
      if (result && result.user) {
        const idToken = await result.user.getIdToken();
        await fetch("${BASE_URL}/api/repository/save-user-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            email: result.user.email,
            displayName: result.user.displayName,
            authProvider: "github",
            photoURL: result.user.photoURL
          })
        });
      }
      
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("GitHub login error:", error);
      throw error;
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      const provider = new OAuthProvider('microsoft.com');
      provider.addScope('openid');
      provider.addScope('email');
      provider.addScope('profile');
      
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (error: any) {
        // Handle account exists with different credential error
        if (error.code === 'auth/account-exists-with-different-credential') {
          const email = error.customData?.email;
          if (email) {
            // Get existing sign-in methods for this email
            const methods = await fetchSignInMethodsForEmail(auth, email);
            
            let message = `An account with email ${email} already exists using: ${methods.join(', ')}`;
            
            if (methods.includes('google.com')) {
              message += '\n\nWould you like to sign in with Google instead and link your Microsoft account?';
              if (window.confirm(message)) {
                // Sign in with Google first, then link Microsoft
                const googleProvider = new GoogleAuthProvider();
                const googleResult = await signInWithPopup(auth, googleProvider);
                
                // Now link the Microsoft account
                try {
                  await linkWithPopup(googleResult.user, provider);
                  result = googleResult; // Use the Google result but now with Microsoft linked
                } catch (linkError: any) {
                  console.log("Failed to link Microsoft account:", linkError);
                  // Continue with Google login even if linking fails
                  result = googleResult;
                }
              } else {
                throw new Error("Please sign in with your existing account method");
              }
            } else {
              throw new Error(message + '\n\nPlease sign in using one of the existing methods.');
            }
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
      
      // Save user profile to backend and extract access token
      if (result && result.user) {
        const idToken = await result.user.getIdToken();
        
        // Save user profile
        await fetch("${BASE_URL}/api/repository/save-user-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({
            email: result.user.email,
            displayName: result.user.displayName,
            authProvider: "microsoft",
            photoURL: result.user.photoURL
          })
        });

        // Extract and save Microsoft access token to Firestore with provider=azure_devops
        const credential = OAuthProvider.credentialFromResult(result);
        if (credential && credential.accessToken) {
          try {
            await fetch("${BASE_URL}/api/repository/save-microsoft-token", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${idToken}`
              },
              body: JSON.stringify({
                accessToken: credential.accessToken,
                provider: "azure_devops"
              })
            });
            console.log("Microsoft access token saved successfully");
          } catch (tokenError) {
            console.error("Failed to save Microsoft access token:", tokenError);
            // Don't throw error - continue with login even if token save fails
          }
        }
      }
      
      window.location.href = "/connect-repository";
    } catch (error: any) {
      console.error("Microsoft login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Starting logout process...");
      
      // Clear state immediately to prevent UI issues
      setUser(null);
      setIsAuthenticated(false);
      
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cached data
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }
      
      console.log("Logout completed successfully");
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if there's an error, ensure state is cleared
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
      sessionStorage.clear();
      
      // Don't throw error to prevent blocking logout
      console.log("Logout completed with errors but state cleared");
    }
  };

  const fetchIdToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch (error: any) {
      console.error("Error fetching ID token:", error);
      throw error;
    }
  };

  const updateProfile = async (updates: { displayName?: string }) => {
    if (!auth.currentUser) {
      throw new Error("No user is currently signed in");
    }

    await firebaseUpdateProfile(auth.currentUser, updates);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        register,
        login,
        loginWithGoogle,
        loginWithGitHub,
        loginWithMicrosoft,
        logout,
        getIdToken: fetchIdToken,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
