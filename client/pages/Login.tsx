import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, googleProvider, githubProvider } from "@/lib/firebaseConfig";
import { signInWithPopup, OAuthProvider } from "firebase/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", result.user.email!);
      window.location.href = "/connect-repository";
    } catch (err) {
      alert(err);
    }
    setIsGoogleLoading(false);
  };

  const handleGithubLogin = async () => {
    setIsGithubLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", result.user.email!);
      window.location.href = "/connect-repository";
    } catch (err) {
      alert(err);
    }
    setIsGithubLoading(false);
  };

  const handleMicrosoftLogin = async () => {
    setIsMicrosoftLoading(true);
    try {
      const microsoftProvider = new OAuthProvider("microsoft.com");
      const result = await signInWithPopup(auth, microsoftProvider);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", result.user.email!);
      window.location.href = "/connect-repository";
    } catch (err) {
      alert("Microsoft Login Failed");
    }
    setIsMicrosoftLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to continue analyzing errors
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">
                Continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full"
          >
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleGithubLogin}
            disabled={isGithubLoading}
            className="w-full"
          >
            {isGithubLoading ? "Connecting..." : "Continue with GitHub"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleMicrosoftLogin}
            disabled={isMicrosoftLoading}
            className="w-full"
          >
            {isMicrosoftLoading ? "Connecting..." : "Continue with Microsoft"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
