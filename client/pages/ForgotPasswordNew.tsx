import { useState } from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
// Import Firebase helpers to send a real password reset email
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Send a real password reset email via Firebase. If the email
      // does not exist or another error occurs, an exception is thrown.
      await sendPasswordResetEmail(auth, email);
      setIsEmailSent(true);
    } catch (error: any) {
      console.error(error);
      alert(error?.message || "Failed to send password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <Button onClick={handleBackToHome} variant="ghost" size="sm" className="enhanced-button transition-all duration-300 hover:scale-105 hover:bg-accent/50">
              <ArrowLeft className="mr-2 h-4 w-4 animate-icon transition-transform duration-300 group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </div>
          <ThemeToggle />
        </header>

        {/* Success Content */}
        <main className="flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
          <Card className="w-full max-w-md transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription>
                  We've sent a password reset link to your email address
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your inbox and follow the instructions to reset
                  your password.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  onClick={handleBackToLogin}
                  className="w-full"
                  size="lg"
                >
                  Back to Sign In
                </Button>

                <Button
                  onClick={() => setIsEmailSent(false)}
                  variant="outline"
                  className="w-full enhanced-button"
                  size="lg"
                >
                  Send Another Email
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or{" "}
                <Button
                  onClick={() => setIsEmailSent(false)}
                  variant="link"
                  className="h-auto p-0 text-primary enhanced-button"
                >
                  try again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-4">
          <Button onClick={handleBackToLogin} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Sign In
          </Button>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center p-6 min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 hover:scale-110">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Forgot your password?</CardTitle>
              <CardDescription>
                No worries! Enter your email address and we'll send you a reset
                link
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full enhanced-button"
                size="lg"
              >
                {isLoading ? (
                  <div className="relative flex items-center justify-center mr-2 h-[30px] w-[30px]">
                    <div className="absolute animate-spin rounded-full border-2 border-white border-t-transparent h-[30px] w-[30px]"></div>
                    <img
                      src="/minimized-logo.png"
                      alt="Loading"
                      className="h-[18px] w-[18px] object-contain animate-logo-beat"
                    />
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Button
                onClick={handleBackToLogin}
                variant="link"
                className="h-auto p-0 text-primary"
              >
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Loading Overlay */}
      {isLoading && (
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
                <h3 className="font-semibold">Sending reset link...</h3>
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
