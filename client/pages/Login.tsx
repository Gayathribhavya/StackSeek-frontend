import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to check 2FA
    setTimeout(async () => {
      // Replace with real API call
      const is2FAEnabled = false; // await check2FAEnabled(email);
      if (is2FAEnabled) {
        setShow2FA(true);
      } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        window.location.href = "/connect-repository";
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
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        window.location.href = "/connect-repository";
      } else {
        alert("Invalid 2FA code");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    // Simulate Google OAuth flow
    setTimeout(() => {
      // Store login state and user info
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", "user@gmail.com");

      // Redirect to connect repository page
      window.location.href = "/connect-repository";
    }, 2000);
  };

  const handleMicrosoftLogin = async () => {
    setIsMicrosoftLoading(true);

    // Simulate Microsoft OAuth flow
    setTimeout(() => {
      // Store login state and user info
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", "user@outlook.com");

      // Redirect to connect repository page
      window.location.href = "/connect-repository";
    }, 2000);
  };

  const handleForgotPassword = () => {
    window.location.href = "/forgot-password";
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo positioned above the card */}
        <div className="text-center mb-10">
         <img 
              src="/stack-seek-high-resolution-logo-transparent.png"
              alt="Stack Seek Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-all duration-300 hover:scale-110"
              />
        </div>
        
        <Card className="shadow-xl border backdrop-blur-sm bg-background/95">
          <CardHeader className="text-center pb-6 px-4 sm:px-6 pt-6 sm:pt-8">
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm sm:text-base px-2">
              Sign in to your StackSeek account to continue analyzing errors and
              improving your code quality.
            </CardDescription>
          </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {!show2FA ? (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="transition-colors focus:border-primary text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[#1d4ed8] hover:text-[#1e40af] transition-colors underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="transition-colors focus:border-primary text-sm sm:text-base"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading || isMicrosoftLoading}
                className="w-full transition-all duration-200 hover:scale-105 mt-6"
                size="lg"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twofa" className="text-sm font-medium text-foreground">
                  Two-Factor Code
                </Label>
                <Input
                  type="text"
                  id="twofa"
                  value={twoFACode}
                  onChange={e => setTwoFACode(e.target.value)}
                  required
                  placeholder="Enter your 2FA code"
                  className="transition-colors focus:border-primary text-sm sm:text-base"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading || isMicrosoftLoading}
                className="w-full transition-all duration-200 hover:scale-105 mt-6"
                size="lg"
              >
                {isLoading ? "Verifying..." : "Verify 2FA"}
              </Button>
            </form>
          )}

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-4 text-sm text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading || isMicrosoftLoading}
              className="w-full transition-all duration-200 hover:scale-105 text-sm sm:text-base"
              size="lg"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {isGoogleLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleMicrosoftLogin}
              disabled={isLoading || isGoogleLoading || isMicrosoftLoading}
              className="w-full transition-all duration-200 hover:scale-105 text-sm sm:text-base"
              size="lg"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"
                />
              </svg>
              {isMicrosoftLoading ? "Connecting..." : "Continue with Microsoft"}
            </Button>
          </div>

          <div className="text-center space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => (window.location.href = "/register")}
                className="text-[#1d4ed8] hover:text-[#1e40af] transition-colors font-medium underline"
              >
                Sign up here
              </button>
            </p>

            <button
              onClick={handleBackToHome}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              ← Back to home page
            </button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
