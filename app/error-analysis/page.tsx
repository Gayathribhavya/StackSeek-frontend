"use client";

import { useState, useEffect, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Search,
  ChevronDown,
  Github,
  GitBranch,
  Eye,
  Copy,
  Code2,
  Database,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";

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
        icon: "/favicon.ico",
        badge: "/favicon.ico",
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

// Define the shape of a repository returned from the backend.
interface Repo {
  id: string;
  url: string;
  isPrivate: boolean;
  provider?: string;
}

// The analysis result returned by our backend.
interface AnalysisResult {
  id: string;
  errorType: string;
  severity: "low" | "medium" | "high";
  summary: string;
  description: string;
  suggestions: string[];
  codeExample?: string;
  relatedFiles: string[];
  timestamp: string;
}

// Azure DevOps Icon Component
const AzureDevOpsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M24 8.617L16.52.014 5.535 2.633v5.728L0 6.728l5.535 9.928v5.625L16.52 24 24 15.406v-6.79zM5.535 17.22V6.975L15.56 2.32v19.36L5.535 17.22z" />
  </svg>
);

// Helper function to get provider info
const getRepoProvider = (url: string) => {
  if (url.includes('github.com')) return { name: 'GitHub', icon: Github, color: 'text-gray-700' };
  if (url.includes('gitlab.com')) return { name: 'GitLab', icon: GitBranch, color: 'text-orange-600' };
  if (url.includes('bitbucket.org')) return { name: 'Bitbucket', icon: GitBranch, color: 'text-blue-600' };
  if (url.includes('dev.azure.com') || url.includes('visualstudio.com')) return { name: 'Azure DevOps', icon: AzureDevOpsIcon, color: 'text-blue-500' };
  return { name: 'Git', icon: GitBranch, color: 'text-gray-500' };
};

// Helper function to extract repo name from URL
const getRepoName = (url: string) => {
  try {
    const parts = url.replace(/\.git$/, '').split('/');
    return parts.slice(-2).join('/');
  } catch {
    return url;
  }
};

export default function ErrorAnalysisPage() {
  const [errorForm, setErrorForm] = useState({
    repository: "",
    errorMessage: "",
    stackTrace: "",
    context: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [currentPayload, setCurrentPayload] = useState<any>(null);

  const { auth } = require("@/lib/firebaseConfig");
  const {
    onAuthStateChanged,
    signOut: firebaseSignOut,
  } = require("firebase/auth");

  const [authUser, setAuthUser] = useState<any>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();const [isLoggingOut, setIsLoggingOut] = useState(false);


  const fetchRepos = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        // Not authenticated - no repositories available
        setRepos([]);
        return;
      }
      const token = await user.getIdToken();
      const res = await fetch("${BASE_URL}/api/repository/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error("Failed to fetch repositories");
        setRepos([]);
        return;
      }
      const text = await res.text();
      const data = JSON.parse(text);
      setRepos(data || []);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setRepos([]);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      setAuthUser(user);
      setAuthCheckComplete(true);
      // Always fetch repos (will use mock data if not authenticated)
      await fetchRepos();
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRepoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      await fetch(
        "${BASE_URL}/api/repository/delete-user-data",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      await firebaseSignOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Error signing out. Please try again.");
    }
  };

  const handleSubmitError = async () => {
    if (!errorForm.repository || !errorForm.errorMessage) {
      toast.error("Please fill in repository and error message");
      return;
    }

    setIsAnalyzing(true);

    try {
      const repo = repos.find((r) => r.id === errorForm.repository);
      if (!repo || !repo.url) {
        toast.error("Please select a valid repository to analyze");
        setIsAnalyzing(false);
        return;
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error("You must be logged in to perform analysis");
        setIsAnalyzing(false);
        return;
      }
      const firebaseToken = await currentUser.getIdToken();

      let provider = "github";
      if (repo.url.includes("gitlab.com")) provider = "gitlab";
      else if (repo.url.includes("bitbucket.org")) provider = "bitbucket";
      else if (
        repo.url.includes("dev.azure.com") ||
        repo.url.includes("visualstudio.com")
      )
        provider = "azure_devops";

      let tokenEndpoint = `${provider}-token`;
      if (provider === "azure_devops") {
        tokenEndpoint = "azure-token"; // Backend still uses "azure-token" endpoint
      }
      
      const tokenRes = await fetch(
        `${BASE_URL}/api/repository/${tokenEndpoint}`,
        {
          headers: { Authorization: `Bearer ${firebaseToken}` },
        }
      );
      const tokenJson = await tokenRes.json();
      const accessToken = tokenJson.token;
      if (!accessToken) {
        toast.error(
          `${provider.charAt(0).toUpperCase() + provider.slice(1)} token not found. Please connect your repository first.`
        );
        setIsAnalyzing(false);
        return;
      }

      const payload = {
        stack_trace: errorForm.stackTrace.trim(),
        repo_url: repo.url,
        auth_token: accessToken,
        provider,
        output_file_name: "analysis_report_from_api_gitlab.json",
        force_index: false,
      };

      // Show payload preview modal immediately
      setIsAnalyzing(false);
      setCurrentPayload(payload);
      setShowPayloadModal(true);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
      setIsAnalyzing(false);
    }
  };

  const handleSendPayload = async () => {
    if (!currentPayload) return;
    
    setShowPayloadModal(false);
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("https://tbnqzvymar.ap-south-1.awsapprunner.com/analyze-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPayload),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Analysis service error: ${errorText || response.statusText}`
        );
      }
      const apiResult = await response.json();
      const converted: AnalysisResult = {
        id: new Date().toISOString(),
        errorType: "Analysis",
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
      toast.success("Error analysis completed!");
      
      // Send browser notification if window is out of focus
      await sendNotificationIfOutOfFocus(
        "StackSeek - Analysis Complete",
        "Your error analysis has been completed successfully!"
      );
    } catch (err: any) {
      console.error("Analysis error:", err);
      const message = err?.message || "Error during analysis";
      toast.error(message);
      setAnalysisResult(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisResult(null);
    setErrorForm({
      repository: "",
      errorMessage: "",
      stackTrace: "",
      context: "",
    });
    setSearchTerm("");
  };

  // Filter repositories based on search term
  const filteredRepos = repos.filter(repo => {
    const searchLower = searchTerm.toLowerCase();
    const repoName = getRepoName(repo.url).toLowerCase();
    const fullUrl = repo.url.toLowerCase();
    const provider = getRepoProvider(repo.url).name.toLowerCase();
    
    return repoName.includes(searchLower) || 
           fullUrl.includes(searchLower) || 
           provider.includes(searchLower);
  });

  const selectedRepo = repos.find(repo => repo.id === errorForm.repository);
  const selectedRepoName = selectedRepo ? getRepoName(selectedRepo.url) : "";
  const selectedProvider = selectedRepo ? getRepoProvider(selectedRepo.url) : null;

  if (!authCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg">⏳ Checking authentication...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          🔒 You are not logged in.
        </h1>
        <p className="mb-6 text-gray-600">Please log in to analyze errors.</p>
        <Button onClick={() => router.push("/login")} className="enhanced-button">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--card-foreground))',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
          },
        }}
        theme="dark"
      />
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {isAnalyzing ? (
          // Analysis Progress Display
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <Card className="w-96">
              <CardContent className="flex flex-col items-center gap-4 p-8">
                
<img
                  src="/stack-seek-high-resolution-logo-transparent (1).png"
                  alt="StackSeek Logo"
                  className="h-12 w-12 object-contain animate-pulse"
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
          <div className="max-w-2xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Error Analysis</CardTitle>
                <CardDescription>
                  Select a repository and provide an error message or stack trace to analyze.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="repository">Repository</Label>
                  <div className="relative" ref={dropdownRef}>
                    {/* Enhanced Repository Selector */}
                    <div
                      className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white dark:bg-background border-gray-200 dark:border-slate-700 rounded-md cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {selectedProvider ? (
                          <>
                            <selectedProvider.icon className={`h-4 w-4 ${selectedProvider.color} flex-shrink-0`} />
                            <span className="truncate font-medium">{selectedRepoName}</span>
                            <span className="text-xs text-muted-foreground">({selectedProvider.name})</span>
                          </>
                        ) : (
                          <span className="text-muted-foreground">Select repository</span>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isRepoDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                    
                    {/* Dropdown Content */}
                    {isRepoDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-background border-gray-200 dark:border-slate-700 rounded-md shadow-lg max-h-60 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-3 border-b border-gray-200 dark:border-slate-700">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search repositories..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-9 h-9 bg-white dark:bg-background border-gray-200 dark:border-slate-700"
                              autoFocus
                            />
                          </div>
                        </div>
                        
                        {/* Repository List */}
                        <div className="max-h-48 overflow-y-auto">
                          {filteredRepos.length > 0 ? (
                            filteredRepos.map((repo) => {
                              const provider = getRepoProvider(repo.url);
                              const repoName = getRepoName(repo.url);
                              const isSelected = errorForm.repository === repo.id;
                              
                              return (
                                <div
                                  key={repo.id}
                                  className={`flex items-center gap-3 px-3 py-3 hover:bg-muted cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 dark:bg-background border-r-2 border-primary dark:border-slate-700' : ''}`}
                                  onClick={() => {
                                    setErrorForm(prev => ({ ...prev, repository: repo.id }));
                                    setIsRepoDropdownOpen(false);
                                    setSearchTerm("");
                                  }}
                                >
                                  <provider.icon className={`h-4 w-4 ${provider.color} flex-shrink-0`} />
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-sm truncate">{repoName}</div>
                                    <div className="text-xs text-muted-foreground truncate">{repo.url}</div>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    {repo.isPrivate && (
                                      <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-1.5 py-0.5 rounded">
                                        Private
                                      </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">{provider.name}</span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                              {searchTerm ? 'No repositories match your search' : 'No repositories found'}
                            </div>
                          )}
                        </div>
                        
                        {/* Footer */}
                        {repos.length > 0 && (
                          <div className="px-3 py-2 border-t border-border bg-muted/30">
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{filteredRepos.length} of {repos.length} repositories</span>
                              {searchTerm && (
                                <button
                                  onClick={() => setSearchTerm("")}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  Clear search
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="error-message">Error Message</Label>
                  <Input
                    id="error-message"
                    placeholder="TypeError: Cannot read property 'name' of null"
                    value={errorForm.errorMessage}
                    onChange={(e) =>
                      setErrorForm((prev) => ({
                        ...prev,
                        errorMessage: e.target.value,
                      }))
                    }
                    className="bg-white dark:bg-background border-gray-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stack-trace">Stack Trace (Optional)</Label>
                  <Textarea
                    id="stack-trace"
                    placeholder="Paste your stack trace here..."
                    rows={6}
                    value={errorForm.stackTrace}
                    onChange={(e) =>
                      setErrorForm((prev) => ({
                        ...prev,
                        stackTrace: e.target.value,
                      }))
                    }
                    className="bg-white dark:bg-background border-gray-200 dark:border-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">Additional Context (Optional)</Label>
                  <Textarea
                    id="context"
                    placeholder="Describe what you were trying to do when the error occurred..."
                    rows={3}
                    value={errorForm.context}
                    onChange={(e) =>
                      setErrorForm((prev) => ({
                        ...prev,
                        context: e.target.value,
                      }))
                    }
                  />
                </div>

                <Button
                  onClick={handleSubmitError}
                  disabled={isAnalyzing}
                  className="w-full enhanced-button"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Error...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Analyze Error
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
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

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Analysis */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border bg-white dark:bg-background border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
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

                <Card className="border bg-white dark:bg-background border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-warning" />
                      Suggested Solutions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysisResult.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border bg-white dark:bg-background border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
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
      {/* Beautiful Payload Preview Modal */}
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
          
          <div className="flex-1 space-y-3">
            <div className="bg-slate-900 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">JSON Payload</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(currentPayload, null, 2));
                    toast.success("Payload copied to clipboard!");
                  }}
                  className="text-gray-400 hover:text-white h-6 px-2"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="text-xs text-gray-300 overflow-x-auto">
                <code>{JSON.stringify(currentPayload, null, 2)}</code>
              </pre>
            </div>
            
            {currentPayload && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Card className="border-primary/30 bg-primary/5 dark:border-primary/40 dark:bg-primary/10">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Database className="h-3 w-3 text-primary" />
                      <span className="font-medium text-xs">Repository Info</span>
                    </div>
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      <div className="truncate">URL: {currentPayload.repo_url}</div>
                      <div>Provider: {currentPayload.provider}</div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/30 bg-primary/5 dark:border-primary/40 dark:bg-primary/10">
                  <CardContent className="p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <FileText className="h-3 w-3 text-primary" />
                      <span className="font-medium text-xs">Analysis Details</span>
                    </div>
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                      <div>Stack Trace: {currentPayload.stack_trace ? 'Yes' : 'None'}</div>
                      <div>Force Index: {currentPayload.force_index ? 'Yes' : 'No'}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex-shrink-0 border-t pt-4 mt-3">
            <div className="w-full space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3" />
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
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
      </>
  );
}