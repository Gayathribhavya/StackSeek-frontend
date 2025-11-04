"use client";

import { useEffect, useState } from "react";
import { mockFetch } from "@/lib/mock-api";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "../../client/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Bug,
  LogOut,
  Plus,
  GitBranch,
  Github,
  ExternalLink,
  ArrowRight,
  CheckCircle,
  GitMerge,
  Cloud,
  Key,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast, Toaster } from "sonner";

// Firebase auth imports are loaded dynamically to ensure they only
// execute on the client. See `lib/firebaseConfig` for the config.
const { auth } = require("@/lib/firebaseConfig");
const {
  onAuthStateChanged,
  signOut: firebaseSignOut,
} = require("firebase/auth");

export default function ConnectRepositoryPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [authMethod, setAuthMethod] = useState("token");
  const [authData, setAuthData] = useState({
    token: "",
    username: "",
    password: "",
    sshKey: "",
    deployKey: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const router = useRouter();

  // Track the authenticated Firebase user and list of repositories.
  const [authUser, setAuthUser] = useState<any>(null);
  const [repos, setRepos] = useState<Array<{ id: string; url: string; isPrivate: boolean }>>([]);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Spinner for all OAuth providers
  const [isConnectingOAuth, setIsConnectingOAuth] = useState(false);

  // Access query parameters. We'll use this to extract the `code`
  // returned from OAuth providers after a flow completes.
  const searchParams = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successDialogData, setSuccessDialogData] = useState<{
    provider: string;
    repositoryCount: number;
  } | null>(null);
  
  // Debug dialog state
  console.log('Dialog state - showSuccessDialog:', showSuccessDialog, 'data:', successDialogData);


  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const user = auth.currentUser;
      if (!user) return;
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

  const fetchRepos = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      const res = await mockFetch("${BASE_URL}/api/repository/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: any) => {
      setAuthUser(user);
      setAuthCheckComplete(true);
      if (user) {
        await fetchRepos();
      }
    });
    return () => unsubscribe();
  }, []);

  // OAuth handler for all providers (example: GitHub)
  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || typeof code !== "string") return;

    // Prevent handling the same code twice.
    const hasHandled = sessionStorage.getItem("github-code-handled");
    if (hasHandled === code) return;

    const handleOAuthRedirect = async () => {
      setIsConnectingOAuth(true);
      try {
        // Step 1: Exchange code for access token
        const tokenRes = await mockFetch(
          "${BASE_URL}/api/repository/oauth/github",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          },
        );
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;
        if (!accessToken) throw new Error("Access token not received");

        // Step 2: Save the token for the user in our backend
        const user = auth.currentUser;
        if (!user) throw new Error("User not logged in");
        const firebaseToken = await user.getIdToken();
        await mockFetch("${BASE_URL}/api/repository/github-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify({ accessToken }),
        });

        // Step 3: Fetch the user's repositories from GitHub
        const ghRes = await fetch(
          "https://api.github.com/user/repos?visibility=all&affiliation=owner,collaborator,organization_member&per_page=100",
          {
            headers: {
              Authorization: `token ${accessToken}`,
              "User-Agent": "ErrorAnalyzerApp",
            },
          },
        );
        const ghRepos = await ghRes.json();
        // Step 4: Connect each repository via our backend
        for (const repo of ghRepos) {
          if (!repo.html_url || typeof repo.html_url !== "string") continue;
          await mockFetch("${BASE_URL}/api/repository/connect", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseToken}`,
            },
            body: JSON.stringify({
              repoUrl: repo.html_url,
              isPrivate: repo.private,
            }),
          });
        }
        // Mark this code as handled to avoid duplicate processing
        sessionStorage.setItem("github-code-handled", code);
        // Refresh the repository list
        await fetchRepos();
        
        // Show beautiful success dialog
        console.log('SUCCESS: Connected GitHub repositories');
        console.log('GitHub repos:', ghRepos?.length);
        
        const dialogData = {
          provider: 'GitHub',
          repositoryCount: ghRepos?.length || 0
        };
        console.log('Setting dialog data:', dialogData);
        
        setSuccessDialogData(dialogData);
        setShowSuccessDialog(true);
        
        console.log('Dialog should be showing now');
        
        // Show toast notification for successful connection
        setTimeout(() => {
          toast.success("Repository Connection Successful!", {
            description: `Successfully connected ${ghRepos?.length || 0} GitHub repositories. Your repositories are now ready for AI-powered error analysis!`,
          });
        }, 500);
        
        // Force dialog to show with a small delay
        setTimeout(() => {
          console.log('Ensuring dialog is visible');
          setShowSuccessDialog(true);
        }, 100);
      } catch (err) {
        console.error("OAuth repo fetch failed:", err);
      } finally {
        setIsConnectingOAuth(false);
      }
    };
    handleOAuthRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleConnectRepo = async () => {
    if (!repoUrl) {
      toast.error("Please enter a repository URL");
      return;
    }

    if (isPrivate) {
      if (authMethod === "token" && !authData.token) {
        toast.error("Please enter your access token");
        return;
      }
      if (
        authMethod === "credentials" &&
        (!authData.username || !authData.password)
      ) {
        toast.error("Please enter username and password");
        return;
      }
      if (authMethod === "ssh" && !authData.sshKey) {
        toast.error("Please enter your SSH private key");
        return;
      }
      if (authMethod === "deploy" && !authData.deployKey) {
        toast.error("Please enter your deploy key");
        return;
      }
    }

    setIsConnecting(true);

    try {
      // Ensure the user is authenticated
      const user = auth.currentUser;
      if (!user) {
        toast.error("You must be logged in to connect a repository.");
        setIsConnecting(false);
        return;
      }
      const firebaseToken = await user.getIdToken();

      // If a token is provided, save it via the backend based on provider
      if (authMethod === "token" && authData.token) {
        let tokenEndpoint = "${BASE_URL}/api/repository/github-token"; // default
        
        // Determine provider from repo URL or selected provider
        if (selectedProvider === "azure_devops" || repoUrl.includes("dev.azure.com") || repoUrl.includes("visualstudio.com")) {
          tokenEndpoint = "${BASE_URL}/api/repository/azure-token";
        } else if (repoUrl.includes("gitlab.com")) {
          tokenEndpoint = "${BASE_URL}/api/repository/gitlab-token";
        } else if (repoUrl.includes("bitbucket.org")) {
          tokenEndpoint = "${BASE_URL}/api/repository/bitbucket-token";
        }
        
        await mockFetch(tokenEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseToken}`,
          },
          body: JSON.stringify({ accessToken: authData.token }),
        });
      }

      // Connect the repository through the backend.
      const res = await mockFetch("${BASE_URL}/api/repository/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseToken}`,
        },
        body: JSON.stringify({
          repoUrl: repoUrl,
          isPrivate: isPrivate,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to connect repository");
      }
      // Refresh repository list and indicate success
      await fetchRepos();
      setIsConnected(true);
      
      // Show success alert
      const provider = repoUrl.includes("github.com") ? "GitHub" : 
                     repoUrl.includes("gitlab.com") ? "GitLab" :
                     repoUrl.includes("bitbucket.org") ? "Bitbucket" :
                     repoUrl.includes("dev.azure.com") || repoUrl.includes("visualstudio.com") ? "Azure DevOps" :
                     "Git Provider";
      console.log(`SUCCESS: Connected repository via ${provider}`);
      
      const dialogData = {
        provider: provider,
        repositoryCount: 1
      };
      console.log('Setting dialog data:', dialogData);
      
      setSuccessDialogData(dialogData);
      setShowSuccessDialog(true);
      
      console.log('Dialog should be showing now');
      
      // Show alert alongside dialog for double confirmation
      setTimeout(() => {
        alert(`✅ Successfully connected ${provider} repository!\n\nYour repository is now ready for AI-powered error analysis!`);
      }, 500);
      
      // Force dialog to show with a small delay
      setTimeout(() => {
        console.log('Ensuring dialog is visible');
        setShowSuccessDialog(true);
      }, 100);
    } catch (error: any) {
      const message = error?.message || "Failed to connect repository.";
      toast.error(message);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleContinueToDashboard = () => {
    router.push("/dashboard");
  };

  const handleConnectProvider = async (provider: string) => {
    try {
      // Special handling for Azure DevOps - no OAuth flow, always manual
      if (provider === "Azure DevOps") {
        // Force manual setup for Azure DevOps
        handleProviderSelectManual("azure_devops");
        return;
      }
      
      // Redirect to the backend OAuth start endpoint for other providers.
      const oauthEndpoint = `${BASE_URL}/api/repository/oauth/${provider
        .toLowerCase()
        .replace(" ", "-")}/start`;
      window.location.href = oauthEndpoint;
    } catch (error) {
      toast.error(`Failed to connect ${provider}. Please try again.`);
    }
  };

  const handleProviderSelectManual = (providerId: string) => {
    // Set up state to show manual form for the provider
    setSelectedProvider(providerId);
    setStep(2);
    setAuthMethod("token"); // Force token-based authentication
  };

  // Spinner overlay for all OAuth providers
  if (isConnectingOAuth) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-blue-600" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          <span className="text-lg font-medium text-blue-700">
            Connecting repositories, please wait...
          </span>
        </div>
      </div>
    );
  }

  // If authentication is still being checked, show a loading state
  if (!authCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg">⏳ Checking authentication...</p>
      </div>
    );
  }

  // If the user is not signed in, prompt them to log in
  if (!authUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-600">
          🔒 You are not logged in.
        </h1>
        <p className="mb-6 text-gray-600">Please log in to connect a repository.</p>
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

          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>
                {authUser?.email?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {authUser?.email || "Guest"}
            </span>
            <Button variant="ghost" size="icon" onClick={logout} className="enhanced-button">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Setup Progress</span>
              <span>{isConnected ? "2/2" : "1/2"}</span>
            </div>
            <Progress value={isConnected ? 100 : 50} className="h-2" />
          </div>

          {/* Welcome message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Welcome to StackSeek!</h1>
            <p className="text-lg text-muted-foreground">
              Let's connect your first repository to start analyzing errors
            </p>
          </div>

          {!isConnected ? (
            <div className="space-y-6">
              {/* Provider Connect Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Setup with Git Providers</CardTitle>
                  <CardDescription>
                    Connect your Git provider account to automatically import
                    repositories
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleConnectProvider("GitHub")}
                    variant="outline"
                    className="h-12 justify-start enhanced-button"
                  >
                    <Github className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">GitHub</div>
                      <div className="text-xs text-muted-foreground">
                        github.com
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleConnectProvider("GitLab")}
                    variant="outline"
                    className="h-12 justify-start enhanced-button"
                  >
                    <GitMerge className="mr-3 h-5 w-5 text-orange-500" />
                    <div className="text-left">
                      <div className="font-medium">GitLab</div>
                      <div className="text-xs text-muted-foreground">
                        gitlab.com
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleConnectProvider("Bitbucket")}
                    variant="outline"
                    className="h-12 justify-start enhanced-button"
                  >
                    <GitBranch className="mr-3 h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium">Bitbucket</div>
                      <div className="text-xs text-muted-foreground">
                        bitbucket.org
                      </div>
                    </div>
                  </Button>

                  <Button
                    onClick={() => handleConnectProvider("Azure DevOps")}
                    variant="outline"
                    className="h-12 justify-start enhanced-button"
                  >
                    <Cloud className="mr-3 h-5 w-5 text-blue-500" />
                    <div className="text-left">
                      <div className="font-medium">Azure DevOps</div>
                      <div className="text-xs text-muted-foreground">
                        dev.azure.com (Manual Setup)
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or connect manually
                  </span>
                </div>
              </div>

              {/* Manual Connect Option */}
              <Card className="bg-card text-card-foreground border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Connect Repository Manually
                  </CardTitle>
                  <CardDescription>
                    Add any public or private repository with comprehensive
                    authentication options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="repo-url">Repository URL</Label>
                    <Input
                      id="repo-url"
                      placeholder="https://github.com/username/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="private-repo"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                    <Label htmlFor="private-repo">Private Repository</Label>
                  </div>

                  {isPrivate && (
                    <Card className="border-orange-200 bg-card text-card-foreground border-border">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Shield className="h-5 w-5 text-orange-600" />
                          Private Repository Authentication
                        </CardTitle>
                        <CardDescription>
                          Choose your preferred authentication method for
                          accessing this private repository
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Authentication Method</Label>
                          <Select
                            value={authMethod}
                            onValueChange={setAuthMethod}
                          >
                            <SelectTrigger className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
                              <SelectItem value="token">
                                Personal Access Token (Recommended)
                              </SelectItem>
                              <SelectItem value="credentials">
                                Username & Password
                              </SelectItem>
                              <SelectItem value="ssh">
                                SSH Private Key
                              </SelectItem>
                              <SelectItem value="deploy">Deploy Key</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Tabs value={authMethod} onValueChange={setAuthMethod}>
                          <TabsContent value="token" className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="access-token">
                                Personal Access Token
                              </Label>
                              <Input
                                id="access-token"
                                type="password"
                                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                value={authData.token}
                                onChange={(e) =>
                                  setAuthData((prev) => ({
                                    ...prev,
                                    token: e.target.value,
                                  }))
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                Create a token with repo permissions in your Git
                                provider settings
                              </p>
                            </div>
                          </TabsContent>

                          <TabsContent
                            value="credentials"
                            className="space-y-4 mt-4"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                  id="username"
                                  placeholder="your-username"
                                  value={authData.username}
                                  onChange={(e) =>
                                    setAuthData((prev) => ({
                                      ...prev,
                                      username: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                  <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="your-password"
                                    value={authData.password}
                                    onChange={(e) =>
                                      setAuthData((prev) => ({
                                        ...prev,
                                        password: e.target.value,
                                      }))
                                    }
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent enhanced-button"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Note: Some providers require app passwords instead
                              of account passwords
                            </p>
                          </TabsContent>

                          <TabsContent value="ssh" className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="ssh-key">SSH Private Key</Label>
                              <Textarea
                                id="ssh-key"
                                placeholder="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA..."
                                rows={6}
                                value={authData.sshKey}
                                onChange={(e) =>
                                  setAuthData((prev) => ({
                                    ...prev,
                                    sshKey: e.target.value,
                                  }))
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                Paste your SSH private key (make sure the public
                                key is added to your Git provider)
                              </p>
                            </div>
                          </TabsContent>

                          <TabsContent
                            value="deploy"
                            className="space-y-4 mt-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="deploy-key">Deploy Key</Label>
                              <Textarea
                                id="deploy-key"
                                placeholder="ssh-rsa AAAAB3NzaC1yc2EAAAA..."
                                rows={4}
                                value={authData.deployKey}
                                onChange={(e) =>
                                  setAuthData((prev) => ({
                                    ...prev,
                                    deployKey: e.target.value,
                                  }))
                                }
                              />
                              <p className="text-xs text-muted-foreground">
                                Repository-specific deploy key (read-only
                                access)
                              </p>
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Key className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-blue-800">
                                Security Notice
                              </p>
                              <p className="text-blue-700">
                                Your credentials are encrypted and securely
                                stored. We recommend using Personal Access
                                Tokens for better security.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    onClick={handleConnectRepo}
                    disabled={isConnecting}
                    className="w-full enhanced-button"
                    size="lg"
                  >
                    {isConnecting ? (
                      <>
                        <GitBranch className="mr-2 h-4 w-4 animate-pulse" />
                        Connecting Repository...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Connect Repository
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Success state
            <Card className="border-border bg-background">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-2">
                  Repository Connected!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your repository has been successfully connected. You can now
                  start analyzing errors.
                </p>

                <div className="bg-white rounded-lg p-4 mb-6 text-left">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {repoUrl.split("/").pop() || "Repository"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{repoUrl}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="enhanced-button">
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleContinueToDashboard}
                  size="lg"
                  className="w-full enhanced-button"
                >
                  Continue to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Skip option */}
          {!isConnected && (
            <div className="text-center mt-6">
              <Button
                variant="ghost"
                onClick={handleContinueToDashboard}
                className="text-muted-foreground enhanced-button"
              >
                Skip for now, I'll connect later
              </Button>
            </div>
          )}
        </div>
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

      
      {/* Beautiful Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-background text-foreground border-border">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">
              Repository Connected!
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Your {successDialogData?.provider} repository has been successfully connected and is ready for analysis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Repository Stats Card */}
            <div className="rounded-lg border bg-background text-foreground border-border p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">
                  {successDialogData?.repositoryCount === 1 ? '1 Repository' : `${successDialogData?.repositoryCount || 0} Repositories`} Connected
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ready for AI-powered error analysis
                </p>
              </div>
            </div>

            
            {/* Fun Facts */}
            <div className="rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800 p-4">
              <div className="flex items-start gap-3">
                <div className="text-purple-600 dark:text-purple-400">🎯</div>
                <div>
                  <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-1">
                    Did You Know?
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-400">
                    Our AI can analyze stack traces in milliseconds and provide solutions based on millions of code patterns!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
              }}
              className="w-full sm:w-auto"
            >
              Connect More Repositories
            </Button>
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                window.location.href = '/dashboard';
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
  );
}