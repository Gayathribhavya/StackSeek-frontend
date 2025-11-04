// /client/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth, User } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig'; // Assuming you have a /lib/firebase.ts file
import { authFetch } from '../lib/api'; // Import the function we just made

// Define the context value shape
interface AuthContextType {
  user: User | null;
}

// Create the context
const AuthContext = createContext<AuthContextType>({ user: null });

// Create the Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User just logged in
        setUser(user);

        // --- THIS IS THE GUIDE'S STEP 3 ---
        // Call the backend registration endpoint.
        try {
          await authFetch("/api/oauth/register", { method: 'POST' });
          console.log("Backend user profile created/verified.");
        } catch (error: any) {
          // It's safe to ignore "already exists" errors
          if (!error.message.includes("already exists")) {
             console.error("Backend registration failed:", error.message);
          }
        }
        // ------------------------------------

      } else {
        // User logged out
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily access the user
export const useAuth = () => useContext(AuthContext);