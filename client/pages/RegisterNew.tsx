import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

  // Access authentication helpers from context
  const { register: registerUser, loginWithGoogle, loginWithGitHub, loginWithMicrosoft } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!acceptedTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    setIsLoading(true);
    try {
      await registerUser(formData.email, formData.password, formData.name);
      // After registration, instruct the user to verify their email. Once
      // verification is complete they can log in normally.
      alert(
        "Registration successful! A verification email has been sent. Please verify your email before signing in.",
      );
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
      // Google users are already verified. Redirect directly to
      // connecting repositories.
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
      // Microsoft users are authenticated through Firebase OAuth. Navigate directly to connect repository.
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
      // GitHub users are already verified. Redirect directly to
      // connecting repositories.
      window.location.href = "/connect-repository";
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "GitHub sign up failed");
    } finally {
      setIsGitHubLoading(false);
    }
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button onClick={handleBackToHome} variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105 hover:bg-accent/50">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Button>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <CardHeader className="text-center pb-0 -mb-2">
            <div className="mx-auto mb-0 transition-transform duration-300 hover:scale-110">
             <img 
              src="/stack-seek-high-resolution-logo-transparent (6).png"
              alt="Stack Seek Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-all duration-300 hover:scale-110"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Centered Welcome Text */}
            <div className="flex flex-col items-center justify-center text-center pt-0 pb-2 px-2">
              <CardTitle className="text-2xl font-bold mb-2 leading-tight">Create your account</CardTitle>
              <CardDescription className="text-base leading-relaxed text-muted-foreground">
                Sign up using
              </CardDescription>
            </div>
            {/* Social Register Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={handleGoogleRegister}
                disabled={isGoogleLoading || isMicrosoftLoading || isGitHubLoading}
                variant="outline"
                className="enhanced-button hover:bg-transparent hover:text-foreground"
                size="lg"
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
                  <svg className="h-4 w-4 animate-icon" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                <span className="hidden sm:inline ml-2">Google</span>
              </Button>

              <Button
                onClick={handleMicrosoftRegister}
                disabled={isGoogleLoading || isMicrosoftLoading || isGitHubLoading}
                variant="outline"
                className="enhanced-button hover:bg-transparent hover:text-foreground"
                size="lg"
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
                  <svg className="h-4 w-4 animate-icon" viewBox="0 0 24 24">
                    <path
                      d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z"
                      fill="#00A4EF"
                    />
                  </svg>
                )}
                <span className="hidden sm:inline ml-2">Microsoft</span>
              </Button>

              <Button
                onClick={handleGitHubRegister}
                disabled={isGoogleLoading || isMicrosoftLoading || isGitHubLoading}
                variant="outline"
                className="enhanced-button hover:bg-transparent hover:text-foreground"
                size="lg"
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
                  <svg className="h-4 w-4 animate-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                )}
                <span className="hidden sm:inline ml-2">GitHub</span>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or register with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 transition-all duration-200 border border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-0 focus:outline-0 focus:shadow-none rounded-md bg-transparent dark:bg-transparent dark:border-gray-600 dark:hover:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 transition-all duration-200 border border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-0 focus:outline-0 focus:shadow-none rounded-md bg-transparent dark:bg-transparent dark:border-gray-600 dark:hover:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className="pl-10 pr-10 transition-all duration-200 border border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-0 focus:outline-0 focus:shadow-none rounded-md bg-transparent dark:bg-transparent dark:border-gray-600 dark:hover:border-blue-400"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="pl-10 pr-10 transition-all duration-200 border border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-0 focus:outline-0 focus:shadow-none rounded-md bg-transparent dark:bg-transparent dark:border-gray-600 dark:hover:border-blue-400"
                    required
                  />
                  <Button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={setAcceptedTerms}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal cursor-pointer"
                >
                  I agree to the{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#1d4ed8] hover:text-[#1e40af] text-sm focus:underline active:underline"
                    onClick={() => window.open('/terms-of-service', '_blank')}
                  >
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 text-[#1d4ed8] hover:text-[#1e40af] text-sm focus:underline active:underline"
                    onClick={() => window.open('/privacy-policy', '_blank')}
                  >
                    Privacy Policy
                  </Button>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading || isMicrosoftLoading || isGitHubLoading}
                className="w-full enhanced-button primary-gradient text-white border-0"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="relative flex items-center justify-center mr-2 h-[30px] w-[30px]">
                      <div className="absolute animate-spin rounded-full border-2 border-background border-t-transparent h-[30px] w-[30px]"></div>
                      <img
                        src="/minimized-logo.png"
                        alt="Loading"
                        className="h-[18px] w-[18px] object-contain animate-logo-beat"
                      />
                    </div>
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                onClick={() => (window.location.href = "/login")}
                variant="link"
                className="h-auto p-0 text-[#1d4ed8] hover:text-[#1e40af] focus:underline active:underline"
              >
                Sign in
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Loading Overlay */}
      {(isLoading || isGoogleLoading || isMicrosoftLoading || isGitHubLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-96">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <div className="relative flex items-center justify-center h-[30px] w-[30px]">
                <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[30px] w-[30px]"></div>
                <img
                  src="/minimized-logo.png"
                  alt="Loading"
                  className="h-[18px] w-[18px] object-contain animate-logo-beat"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">
                  {isGoogleLoading
                    ? "Connecting with Google..."
                    : isMicrosoftLoading
                    ? "Connecting with Microsoft..."
                    : isGitHubLoading
                    ? "Connecting with GitHub..."
                    : "Creating your account..."}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please wait a moment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
