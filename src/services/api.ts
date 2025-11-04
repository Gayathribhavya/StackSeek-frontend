// /client/lib/api.ts

import { getAuth } from "firebase/auth";

// This is the authFetch function from the guide, with one variable name fixed
export async function authFetch(endpoint: string, options: RequestInit = {}) {
  const user = getAuth().currentUser;
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const idToken = await user.getIdToken();

  // Use the Next.js environment variable
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL; 
  const defaultHeaders: HeadersInit = {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json'
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    }
  };

  const response = await fetch(`${backendUrl}${endpoint}`, config);

  // Auto-parse JSON response
  const data = await response.json();

  if (!response.ok) {
    // If not OK, throw an error with the backend's message
    throw new Error(data.message || `Error ${response.status}`);
  }

  return data; // Return the successful JSON data
}