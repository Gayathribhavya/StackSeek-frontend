import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  // Access authentication helpers from context
  const { register: registerUser, loginWithGoogle, loginWithMicrosoft, loginWithGitHub } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(formData.email, formData.password, formData.name);
      alert("Registration successful! A verification email has been sent. Please verify your email before signing in.");
      window.location.href = "/login";
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      window.location.href = "/connect-repository";
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Google sign up failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleMicrosoftRegister = async () => {
    setIsMicrosoftLoading(true);
    try {
      await loginWithMicrosoft();
      window.location.href = "/connect-repository";
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Microsoft sign up failed");
    } finally {
      setIsMicrosoftLoading(false);
    }
  };

  const handleGitHubRegister = async () => {
    setIsGitHubLoading(true);
    try {
      await loginWithGitHub();
      window.location.href = "/connect-repository";
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "GitHub sign up failed");
    } finally {
      setIsGitHubLoading(false);
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
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
            src="/final-transparent-logo.png"
            alt="Stack Seek Logo"
            className="h-12 sm:h-16 mx-auto transition-transform duration-300 hover:scale-110 drop-shadow-sm"
          />
        </div>
        
        <Card className="shadow-xl border backdrop-blur-sm bg-background/95">
          <CardHeader className="text-center pb-6 px-4 sm:px-6 pt-6 sm:pt-8">
            <CardTitle className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Create your account
            </CardTitle>
            <CardDescription className="text-sm sm:text-base px-2">
              Start analyzing errors with AI-powered insights.
            </CardDescription>
          </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
          {/* Social Register Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleRegister}
              disabled={isGoogleLoading || isMicrosoftLoading || isGitHubLoading}
              variant="outline"
              className="w-full h-11 font-medium enhanced-button"
            >
              {isGoogleLoading ? (
                <div className="relative flex items-center justify-center mr-2 h-[30px] w-[30px]">
                  <div className="absolute animate-spin rounded-full border-2 border-current border-t-transparent h-[30px] w-[30px]"></div>
                  <img
                    src="/minimized-logo.png"
                    alt="Loading"
                    className="h-[18px] w-[18px] object-contain animate-logo-beat"
                  />
                </div>
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Continue with Google
            </Button>

            <Button
              onClick={handleMicrosoftRegister}
              disabled={isGoogleLoading || isMicrosoftLoading || isGitHubLoading}
              variant="outline"
              className="w-full h-11 font-medium enhanced-button"
            >
              {isMicrosoftLoading ? (
                <div className="relative flex items-center justify-center mr-2 h-[30px] w-[30px]">
                  <div className="absolute animate-spin rounded-full border-2 border-current border-t-transparent h-[30px] w-[30px]"></div>
                  <img
                    src="/minimized-logo.png"
                    alt="Loading"
                    className="h-[18px] w-[18px] object-contain animate-logo-beat"
                  />
                </div>
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="#00A4EF">
                  <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"/>
                </svg>
              )}
              Continue with Microsoft
            </Button>

            <Button
              onClick={handleGitHubRegister}
              disabled={isGoogleLoading || isMicrosoftLoading || isGitHubLoading}
              variant="outline"
              className="w-full h-11 font-medium enhanced-button"
            >
              {isGitHubLoading ? (
                <div className="relative flex items-center justify-center mr-2 h-[30px] w-[30px]">
                  <div className="absolute animate-spin rounded-full border-2 border-current border-t-transparent h-[30px] w-[30px]"></div>
                  <img
                    src="/minimized-logo.png"
                    alt="Loading"
                    className="h-[18px] w-[18px] object-contain animate-logo-beat"
                  />
                </div>
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
              )}
              Continue with GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or register with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Full Name
              </Label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange("name")}
                required
                placeholder="Enter your full name"
                className="w-full transition-colors focus:border-primary text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </Label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange("email")}
                required
                placeholder="Enter your email"
                className="w-full transition-colors focus:border-primary text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <Input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange("password")}
                required
                placeholder="Create a password"
                className="w-full transition-colors focus:border-primary text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirm Password
              </Label>
              <Input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                required
                placeholder="Confirm your password"
                className="w-full transition-colors focus:border-primary text-sm sm:text-base"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full transition-all duration-200 hover:scale-105 mt-6"
              size="lg"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="text-center space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => (window.location.href = "/login")}
                className="text-[#1d4ed8] hover:text-[#1e40af] transition-colors font-medium underline"
              >
                Sign in
              </button>
            </p>

            <button
              onClick={handleBackToHome}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              ← Back to home
            </button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
