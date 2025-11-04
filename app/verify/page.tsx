"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebaseConfig";

/**
 * Email verification page
 *
 * This page mirrors the functionality of the verify page from the
 * original error-analyzer project. When a user clicks the
 * verification link sent to their email, Firebase redirects them
 * here. We check the authentication state and whether the
 * `emailVerified` flag is set. If verified we persist the user
 * record to Firestore and send them to the login page. Otherwise
 * we display a helpful message.
 */
export default function VerifyPage() {
  const [message, setMessage] = useState<string>("Verifying your email...");
  const router = useRouter();

  useEffect(() => {
    // If verification takes too long, update the message to prompt
    // the user to ensure they're signed in.
    const timeoutId = setTimeout(() => {
      setMessage("⏳ Still verifying... Please make sure you're signed in.");
    }, 8000);

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        clearTimeout(timeoutId);
        await user.reload();

        if (user.emailVerified) {
          try {
            // Persist the user data to Firestore under the users
            // collection. This is similar to the original
            // implementation.
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              uid: user.uid,
              createdAt: new Date().toISOString(),
            });

            setMessage("✅ Thank you! Your email has been verified.");
            // Redirect to login after a short delay.
            setTimeout(() => router.push("/login"), 1000);
          } catch (error: any) {
            console.error("Error saving user:", error);
            setMessage(
              "❌ Error saving user data. Please try again or contact support.",
            );
          }
        } else {
          setMessage(
            "❌ Email not verified. Please check your inbox and click the confirmation link.",
          );
        }
      } else {
        setMessage(
          "⚠️ No user signed in. Please return to the signup page and log in.",
        );
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-md text-center text-lg max-w-md w-full">
        {message}
      </div>
    </div>
  );
}
