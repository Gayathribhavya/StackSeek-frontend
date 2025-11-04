"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "../../client/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Bug, Github, Mail } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  const router = useRouter();

  // Dynamically import Firebase auth methods to ensure they are
  // only evaluated on the client side. If firebase isn't installed
  // the build will fail, so ensure it is present in your
  // dependencies. See `lib/firebaseConfig.ts` for the
  // configuration.
  const {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    OAuthProvider,
    fetchSignInMethodsForEmail,
    linkWithPopup,
  } = require("firebase/auth");
  const { auth } = require("@/lib/firebaseConfig");

  /**
   * Sign in with email and password. If the email hasn't been
   * verified we inform the user and abort the navigation.
   */
  const loginWithEmail = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      if (!user.emailVerified) {
        toast.error("Please verify your email before logging in.");
        return;
      }
      // Navigate to the next step: connect repository or dashboard
      router.push("/connect-repository");
    } catch (error: any) {
      const message = error?.message || "Login failed";
      toast.error(message);
    }
  };

  /**
   * Sign in using Google OAuth via Firebase. On success the user
   * will be redirected to the connect-repository page. If you want
   * to support other providers (e.g. GitHub), add them here.
   */
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/connect-repository");
    } catch (error: any) {
      const message = error?.message || "Google sign-in failed";
      toast.error(message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    await loginWithEmail(email, password);
    // Simulate API call to check 2FA
    setTimeout(() => {
      // Replace with real API call
      const is2FAEnabled = false; // await check2FAEnabled(email);
      if (is2FAEnabled) {
        setShow2FA(true);
      }
      setIsLoading(false);
    }, 1000);
  };

  // Simulate 2FA verification
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Replace with real API call
      const success = twoFACode === "123456"; // await verify2FACode(twoFACode);
      if (success) {
        router.push("/connect-repository");
      } else {
        toast.error("Invalid 2FA code");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleProviderLogin = async (provider: string) => {
    const providerEndpoints: Record<string, string> = {
      github: "/api/auth/github",
      gitlab: "/api/auth/gitlab",
      bitbucket: "/api/auth/bitbucket",
      "azure-devops": "/api/auth/azure-devops"
    };

    const endpoint = providerEndpoints[provider];
    if (endpoint) {
      window.location.href = endpoint;
    } else {
      alert(`OAuth for ${provider} is not configured yet.`);
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleGitHubUserLogin = async () => {
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
      
      router.push("/connect-repository");
    } catch (error: any) {
      const message = error?.message || "GitHub sign-in failed";
      toast.error(message);
    }
  };

  const handleMicrosoftUserLogin = async () => {
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
      
      router.push("/connect-repository");
    } catch (error: any) {
      const message = error?.message || "Microsoft sign-in failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <img
              src="/final-transparent-logo.png"
              alt="StackSeek Logo"
              className="h-14 w-auto"
            />
          </Link>
        </div>

        <Card className="shadow-lg border bg-card/50 backdrop-blur">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="mt-2 leading-relaxed">
              Sign in to your account to continue analyzing errors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OAuth Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleProviderLogin("github")}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 font-medium enhanced-button"
              >
                <Github className="mr-2 h-4 w-4" />
                Continue with GitHub
              </Button>

              <Button
                onClick={() => handleProviderLogin("gitlab")}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 font-medium enhanced-button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.918 1.263c-.135-.423-.73-.423-.867 0L1.387 9.452L.045 13.587a.424.424 0 0 0 .153.475L12 24l11.802-9.938a.424.424 0 0 0 .153-.475" />
                </svg>
                Continue with GitLab
              </Button>

              <Button
                onClick={() => handleProviderLogin("bitbucket")}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 font-medium enhanced-button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.499.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z" />
                </svg>
                Continue with Bitbucket
              </Button>

              <Button
                onClick={() => handleProviderLogin("azure-devops")}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 font-medium enhanced-button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 8.617L16.52.014 5.535 2.633v5.728L0 6.728l5.535 9.928v5.625L16.52 24 24 15.406v-6.79zM5.535 17.22V6.975L15.56 2.32v19.36L5.535 17.22z" />
                </svg>
                Continue with Azure DevOps
              </Button>

              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 font-medium enhanced-button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <Button
                onClick={handleMicrosoftUserLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 font-medium enhanced-button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
                </svg>
                Continue with Microsoft
              </Button>

              <Button
                onClick={handleGitHubUserLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-11 font-medium enhanced-button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            {/* Email/Password Form or 2FA Form */}
            {!show2FA ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-medium enhanced-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handle2FASubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="twofa">Two-Factor Code</Label>
                  <Input
                    id="twofa"
                    type="text"
                    placeholder="Enter your 2FA code"
                    value={twoFACode}
                    onChange={e => setTwoFACode(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-11 font-medium enhanced-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify 2FA"}
                </Button>
              </form>
            )}

            <div className="text-center space-y-2">
              <Link
                href="/forgot-password"
                className="text-sm text-[#1d4ed8] hover:text-[#1e40af]"
              >
                Forgot your password?
              </Link>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-[#1d4ed8] hover:text-[#1e40af] font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing in, you agree to our{" "}
          <Link href="https://stackseek.com/terms" target="_blank" className="hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="https://stackseek.com/privacy" target="_blank" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
