"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSubscription } from "../../client/hooks/use-subscription";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bug,
  LogOut,
  Send,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb,
  Code,
  FileText,
  BarChart3,
  Calendar,
  Users,
  Zap,
  Shield,
  Crown,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Copy, X } from "lucide-react";

// Utility function to send browser notification if window is out of focus
const sendNotificationIfOutOfFocus = async (title: string, message: string) => {
  // Check if window is out of focus
  if (!document.hasFocus()) {
    // Request notification permission if not already granted
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
    
    // Send notification if permission is granted
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body: message,
        icon: "/stack-seek-high-resolution-logo-transparent (1).png",
        badge: "/stack-seek-high-resolution-logo-transparent (1).png",
        requireInteraction: false,
        silent: false
      });
      
      // Auto close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);
      
      // Focus window when notification is clicked
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }
};

// Repository type returned from the backend. Each repository
// includes its id, url and privacy flag. We will fetch these from
// the backend based on the authenticated user.
interface Repo {
  id: string;
  url: string;
  isPrivate: boolean;
  provider?: string; // add this line
}

// Analysis result type (would come from API in real implementation)
type AnalysisResult = {
  id: string;
  errorType: string;
  severity: "low" | "medium" | "high";
  summary: string;
  description: string;
  suggestions: string[];
  codeExample?: string;
  relatedFiles: string[];
  timestamp: string;
};

export default function DashboardPage() {
  const [errorForm, setErrorForm] = useState({
    repository: "",
    errorMessage: "",
    stackTrace: "",
    context: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null,
  );
  const [repos, setRepos] = useState<Repo[]>([]);
  const [authUser, setAuthUser] = useState<any>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const router = useRouter();
   const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [currentPayload, setCurrentPayload] = useState<any>(null);

  // Get real-time subscription data
  const { 
    subscription, 
    loading: subscriptionLoading, 
    incrementAnalysisUsage, 
    getRemainingAnalyses,
    getTrialDaysRemaining,
    canUseFeature 
  } = useSubscription();

  // Dynamically import Firebase auth functions and configuration. We
  // use require here because Next.js will tree-shake unused code
  // during server-side rendering.
  const { auth } = require("@/lib/firebaseConfig");
  const {
    onAuthStateChanged,
    signOut: firebaseSignOut,
  } = require("firebase/auth");

  /**
   * Fetch the list of repositories for the authenticated user. This
   * mirrors the fetch logic in the original dashboard. Each call
   * requires a Firebase ID token for authorization.
   */
  const fetchRepos = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch(
        "${BASE_URL}/api/repository/user",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) {
        console.error("Failed to fetch repositories");
        return;
      }
      const text = await res.text();
      const data = JSON.parse(text);
      setRepos(data || []);
    } catch (err) {
      console.error("Error fetching repositories:", err);
    }
  };


  // Monitor authentication state. When the user logs in or out,
  // update local state accordingly and fetch repositories if
  // authenticated.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      setAuthCheckComplete(true);
      if (user) {
        await fetchRepos();
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sign out the current user. This will remove their data from
   * our backend (`/api/repository/delete-user-data`) and sign them
   * out of Firebase. Upon completion we redirect back to the login
   * page.
   */
  const logout = async () => {
    setIsLoggingOut(true); 
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }
      const token = await user.getIdToken();
      // Delete backend data
      await fetch(
        "${BASE_URL}/api/repository/delete-user-data",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Sign out of Firebase
      await firebaseSignOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Error signing out. Please try again.");
    }
  };

  // If we haven't finished checking authentication state, display a loading message
  if (!authCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg">⏳ Checking authentication...</p>
      </div>
    );
  }

  // If the user is not authenticated, prompt them to log in
  if (!authUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          🔒 You are not logged in.
        </h1>
        <p className="mb-6 text-gray-600">
          Please log in to access your dashboard.
        </p>
        <Button onClick={() => router.push("/login")} className="enhanced-button">Go to Login</Button>
      </div>
    );
  }
// ...existing code...

const handleSubmitError = async () => {
  if (!errorForm.repository || !errorForm.errorMessage) {
    toast.error("Please fill in repository and error message");
    return;
  }

  // Check if user has remaining analyses
  if (getRemainingAnalyses() <= 0) {
    toast.error("You've reached your analysis limit. Please upgrade your plan to continue.");
    return;
  }

  setIsAnalyzing(true);

  try {
    // Find the selected repository from our fetched list
    const repo = repos.find((r) => r.id === errorForm.repository);
    if (!repo || !repo.url) {
      toast.error("Please select a valid repository to analyze");
      setIsAnalyzing(false);
      return;
    }

    // Ensure the user is signed in
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("You must be logged in to perform analysis");
      setIsAnalyzing(false);
      return;
    }
    const firebaseToken = await currentUser.getIdToken();

    // Determine provider from selected repository
    let provider = repo.provider || "github"; // default
    if (!repo.provider) {
      if (repo.url.includes("gitlab.com")) {
        provider = "gitlab";
      } else if (repo.url.includes("bitbucket.org")) {
        provider = "bitbucket";
      } else if (repo.url.includes("dev.azure.com") || repo.url.includes("visualstudio.com")) {
        provider = "azure_devops";
      }
    }

    // Retrieve the stored access token from the backend
    let tokenEndpoint = `${provider}-token`;
    if (provider === "azure_devops") {
      tokenEndpoint = "azure-token"; // Backend still uses "azure-token" endpoint
    }
    
    const tokenRes = await fetch(
      `${BASE_URL}/api/repository/${tokenEndpoint}`,
      {
        headers: { Authorization: `Bearer ${firebaseToken}` },
      },
    );
    const tokenJson = await tokenRes.json();
    const accessToken = tokenJson.token;
    if (!accessToken) {
      toast.error(
        `${provider.charAt(0).toUpperCase() + provider.slice(1)} token not found. Please connect your repository first.`,
      );
      setIsAnalyzing(false);
      return;
    }

    // Build the payload expected by the analysis backend
    const payload = {
      stack_trace: errorForm.errorMessage.trim(),
      repo_url: repo.url,
      auth_token: accessToken,
      provider: provider,
      output_file_name: "analysis_report_from_api_gitlab.json",
      force_index: false,
    };

    // Show payload preview modal immediately
    setIsAnalyzing(false);
    setCurrentPayload(payload);
    setShowPayloadModal(true);
    return;
  };

  const handleSendPayload = async () => {
    if (!currentPayload) return;
    
    setShowPayloadModal(false);
    setIsAnalyzing(true);
    
    try {
      // Send the payload only if user confirms
      const response = await fetch(
        "https://tbnqzvymar.ap-south-1.awsapprunner.com/analyze-error",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentPayload),
        },
      );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Analysis service error: ${errorText || response.statusText}`,
      );
    }
    const apiResult = await response.json();
    // ...existing code...
      // Convert the API result into the AnalysisResult shape used
      // throughout this page. We derive a simple summary and list
      // of suggestions from the API response.
      const converted: AnalysisResult = {
        id: new Date().toISOString(),
        errorType: "Analysis",
        // Severity is not provided by the backend; default to medium
        severity: "medium",
        summary:
          apiResult?.analysis?.root_cause_analysis || "AI analysis completed",
        description:
          (apiResult?.analysis?.error_location || "") +
          (apiResult?.analysis?.execution_path
            ? `\n${apiResult.analysis.execution_path}`
            : ""),
        suggestions: [
          ...((apiResult?.analysis?.replication_steps as string[]) || []),
          apiResult?.analysis?.suggested_fix || "",
        ].filter(Boolean),
        codeExample: undefined,
        relatedFiles: [],
        timestamp: new Date().toISOString(),
      };
        setAnalysisResult(converted);
      
      // Track analysis usage
      incrementAnalysisUsage("error_analysis", errorForm.repository);
      
      toast.success("Error analysis completed!");
      
      // Send browser notification if window is out of focus
      await sendNotificationIfOutOfFocus(
        "StackSeek - Analysis Complete",
        "Your error analysis has been completed successfully!"
      );
    } catch (err: any) {
      console.error("Test run error:", err);
      const message = err?.message || "Error during analysis";
      toast.error(message);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };
// ...existing code...

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setErrorForm({
      repository: "",
      errorMessage: "",
      stackTrace: "",
      context: "",
    });
  };

  return (
    <>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/final-transparent-logo.png"
              alt="Stack Seek Logo"
              className="h-12 w-auto transition-transform duration-300 hover:scale-110 cursor-pointer"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/connect-repository")}
              className="enhanced-button"
            >
              Repositories
            </Button>
            <Avatar className="h-7 w-7">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {authUser?.email?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {authUser?.email || "Guest"}
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="enhanced-button">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <div className="mb-8 pb-3">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent mb-2">
            Error Analysis Dashboard
          </h1>
          <p className="text-lg text-muted-foreground/80 font-medium">
            Transform errors into insights with AI-powered analysis
          </p>
        </div>

        {/* Real-time Subscription Status */}
        {!subscriptionLoading && subscription && (
          <div className="mb-8">
            <Card className="border bg-gradient-to-r from-primary/5 to-blue-600/5 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                      {subscription.plan.type === 'free_trial' ? (
                        <Timer className="h-6 w-6 text-white" />
                      ) : subscription.plan.type === 'pro' ? (
                        <Zap className="h-6 w-6 text-white" />
                      ) : (
                        <Crown className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        {subscription.plan.name}
                        {subscription.plan.type === 'free_trial' && (
                          <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({getTrialDaysRemaining()} days left)
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Welcome back, <span className="font-medium">{authUser?.email}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {getRemainingAnalyses()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Analyses left
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {subscription.analysisUsed}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Used this period
                      </div>
                    </div>


                    {subscription.plan.type === 'free_trial' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push("/pricing")}
                        className="bg-gradient-to-r from-primary to-blue-600 text-white border-0 hover:from-primary/90 hover:to-blue-600/90"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>

                {/* Usage Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">
                      Analysis Usage
                    </span>
                    <span className="font-medium">
                      {subscription.analysisUsed} / {subscription.plan.analysisLimit}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, (subscription.analysisUsed / subscription.plan.analysisLimit) * 100)}%` 
                      }}
                    />
                  </div>
                  {getRemainingAnalyses() <= 3 && getRemainingAnalyses() > 0 && (
                    <p className="text-amber-600 text-sm mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      You have {getRemainingAnalyses()} analysis{getRemainingAnalyses() === 1 ? '' : 'es'} remaining
                    </p>
                  )}
                  {getRemainingAnalyses() === 0 && (
                    <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      You've reached your analysis limit. Please upgrade to continue.
                    </p>
                  )}
                </div>

                {/* Recent Activity */}
                {subscription.analysisHistory.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      Last analysis: {new Date(subscription.lastAnalysisDate || '').toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BarChart3 className="h-4 w-4" />
                      Total analyses: {subscription.analysisHistory.length}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {isAnalyzing ? (
          // Analysis Progress Display
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-96">
              <CardContent className="flex flex-col items-center gap-4 p-8">
                <img
                  src="/stack-seek-high-resolution-logo-transparent (1).png"
                  alt="StackSeek Logo"
                  className="h-12 w-12 object-contain"
                />
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <div className="text-center">
                  <h3 className="font-semibold">Analyzing...</h3>
                  <p className="text-sm text-muted-foreground">
                    analyzing..wait
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : !analysisResult ? (
          // Error Submission Form
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card className="border bg-card/50 backdrop-blur">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    Error Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-8">
                  <div className="space-y-3">
                    <Label
                      htmlFor="repository"
                      className="text-sm font-semibold"
                    >
                      Select Repository
                    </Label>
                    <Select
                      value={errorForm.repository}
                      onValueChange={(value) =>
                        setErrorForm((prev) => ({ ...prev, repository: value }))
                      }
                    >
                      <SelectTrigger className="h-12 bg-white dark:bg-background border-gray-200 dark:border-slate-700">
                        <SelectValue placeholder="Choose a repository to analyze" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-background border-gray-200 dark:border-slate-700">
                        {repos.length > 0 ? (
                          repos.map((repo) => (
                            <SelectItem key={repo.id} value={repo.id}>
                              {repo.url}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            No repositories connected
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                    {repos.length === 0 && (
                      <p className="text-sm text-amber-600 font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Connect a repository to unlock AI-powered error analysis
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="error-message-trace"
                      className="text-sm font-semibold"
                    >
                      Error Message or Stack Trace
                    </Label>
                    <Textarea
                      id="error-message-trace"
                      placeholder="Paste your error message or stack trace here..."
                      rows={38}
                      value={errorForm.errorMessage}
                      onChange={(e) =>
                        setErrorForm((prev) => ({
                          ...prev,
                          errorMessage: e.target.value,
                        }))
                      }
                      className="resize-none font-mono text-sm bg-white dark:bg-background border-gray-200 dark:border-slate-700"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="code-snippet"
                      className="text-sm font-semibold"
                    >
                      Code Snippet (Optional)
                    </Label>
                    <Textarea
                      id="code-snippet"
                      placeholder="Paste the code that's causing the error..."
                      rows={36}
                      value={errorForm.stackTrace}
                      onChange={(e) =>
                        setErrorForm((prev) => ({
                          ...prev,
                          stackTrace: e.target.value,
                        }))
                      }
                      className="resize-none font-mono text-sm bg-white dark:bg-background border-gray-200 dark:border-slate-700"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleSubmitError}
                      disabled={isAnalyzing || getRemainingAnalyses() <= 0}
                      className={`w-full h-12 text-base font-semibold enhanced-button ${
                        getRemainingAnalyses() <= 0 
                          ? 'opacity-50 cursor-not-allowed' 
                          : ''
                      }`}
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <img
                            src="/final-transparent-logo.png"
                            alt="Stack Seek Logo"
                            className="mr-2 h-5 w-5"
                          />
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                          Analyzing...
                        </>
                      ) : getRemainingAnalyses() <= 0 ? (
                        <>
                          <AlertTriangle className="mr-2 h-5 w-5" />
                          Analysis Limit Reached
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Analyze Error ({getRemainingAnalyses()} left)
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {repos.length === 0 && (
                <Card className="border-warning/30 bg-warning/5">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                          🚀 Ready to Get Started?
                        </p>
                        <p className="text-sm text-foreground/90 mb-4 leading-relaxed font-medium">
                          Connect your repository to unlock powerful AI-driven
                          error analysis. Support for{" "}
                          <span className="font-semibold text-primary">
                            GitHub, GitLab, Bitbucket & Azure DevOps
                          </span>
                          .
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-background hover:bg-muted enhanced-button"
                          onClick={() => router.push("/connect-repository")}
                        >
                          Connect Repository
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}


              <Card className="border bg-card/50 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      Pro Tips
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base font-medium text-muted-foreground/90">
                    Maximize your analysis results with these expert
                    recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 bg-warning/10 rounded-md flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-3 w-3 text-warning" />
                    </div>
                    <span className="text-sm leading-relaxed font-medium">
                      📝 Include the complete error message with all details for
                      precise analysis
                    </span>
                  </div>
                  <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                      <Code className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-sm leading-relaxed font-medium">
                      🎯 Stack traces help pinpoint the exact error location
                      instantly
                    </span>
                  </div>
                  <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 bg-success/10 rounded-md flex items-center justify-center flex-shrink-0">
                      <FileText className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm leading-relaxed font-medium">
                      💡 Share context about your goals for more targeted
                      solutions
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Analysis Results
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Analysis Results</h2>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      analysisResult.severity === "high"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {analysisResult.severity} severity
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(analysisResult.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              <Button onClick={handleNewAnalysis} variant="outline" className="enhanced-button">
                New Analysis
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Analysis */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white dark:bg-background border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      Error Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-lg mb-2">
                      {analysisResult.summary}
                    </h3>
                    <p className="text-muted-foreground">
                      {analysisResult.description}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-background border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Suggested Solutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-background border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Code Example
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{analysisResult.codeExample}</code>
                    </pre>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Related Files
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {analysisResult.relatedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="p-2 bg-muted rounded text-sm font-mono"
                      >
                        {file}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start enhanced-button">
                      <FileText className="mr-2 h-4 w-4" />
                      Export Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start enhanced-button">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Re-analyze
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    {isLoggingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-96">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <img
                src="/final-transparent-logo.png"
                alt="StackSeek Logo"
                className="h-12 w-auto"
              />
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <div className="text-center">
                <h3 className="font-semibold">Logging out...</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait a moment
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Payload Preview Modal */}
      <Dialog open={showPayloadModal} onOpenChange={setShowPayloadModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4">
            <DialogTitle className="flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
              Request Payload Preview
            </DialogTitle>
            <DialogDescription className="text-sm">
              Review the data that will be sent to the analysis service.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 space-y-3">
            {/* Repository Info */}
            <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-background p-3 border-blue-200 dark:border-slate-700">
              <h4 className="font-medium text-blue-800 dark:text-slate-200 text-sm mb-1">Repository Information</h4>
              <p className="text-xs text-blue-600 dark:text-slate-300">
                <strong>Repository:</strong> {currentPayload?.repo_url}
              </p>
              <p className="text-xs text-blue-600 dark:text-slate-300">
                <strong>Provider:</strong> {currentPayload?.provider}
              </p>
            </div>

            {/* Analysis Details */}
            <div className="rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-800 dark:text-green-300 text-sm mb-1">Analysis Details</h4>
              <p className="text-xs text-green-600 dark:text-green-400">
                <strong>Error Message:</strong> {currentPayload?.stack_trace?.substring(0, 100)}...
              </p>
            </div>

            {/* JSON Payload */}
            <div className="rounded-lg border bg-gray-50 dark:bg-gray-900/50 p-3 flex-1 min-h-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">JSON Payload</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2));
                    toast.success("Payload Copied", {
                      description: "Payload copied to clipboard successfully!",
                    });
                  }}
                  className="text-gray-400 hover:text-white h-6 px-2"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="max-h-48 overflow-auto">
                <pre className="text-xs text-gray-300">
                  <code>{JSON.stringify(currentPayload, null, 2)}</code>
                </pre>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
              <Shield className="h-3 w-3" />
              <span>This data will be sent securely to our analysis service</span>
            </div>
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                onClick={() => setShowPayloadModal(false)}
                className="enhanced-button flex-1 h-8 text-xs"
                size="sm"
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
              <Button 
                onClick={handleSendPayload}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white enhanced-button flex-1 h-8 text-xs"
                size="sm"
              >
                <Send className="h-3 w-3 mr-1" />
                Send & Analyze
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
  );
}
