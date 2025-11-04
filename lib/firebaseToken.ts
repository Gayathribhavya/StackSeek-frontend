// src/firebase/firebaseToken.ts

import { auth } from './firebaseConfig';

/**
 * Retrieves the Firebase ID token for the currently authenticated user.
 * Returns the token string, or null if the user is not authenticated.
 */
export async function getFirebaseToken(): Promise<string | null> {
  // Get the currently signed-in Firebase user
  const user = auth.currentUser;
  // If user is present, get their Firebase ID token for API authentication
  if (user) {
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error("Error fetching Firebase token:", error);
      return null;
    }
  }
  // If not logged in, return null
  return null;
}
