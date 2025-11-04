'use client';
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Settings,
  Github, // Import Github icon
  Cloud, // Import Cloud icon
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserProfile } from "@/components/user-profile";
import { useAuth } from "@/hooks/use-auth";
import { toast, Toaster } from "sonner";

interface ConnectedRepo {
  id: string;
  url: string;
  isPrivate?: boolean;
}

// Client IDs from Code 2
const GITHUB_CLIENT_ID = "Ov23liNVv3BrXEQyXx1O";
const AZURE_CLIENT_ID = "13133603-4070-401f-891f-a41a5aa76e28";
// TODO: Add your Client IDs for GitLab and Bitbucket
const GITLAB_CLIENT_ID = "YOUR_GITLAB_CLIENT_ID_HERE";
const BITBUCKET_CLIENT_ID = "YOUR_BITBUCKET_CLIENT_ID_HERE";

export default function ConnectRepository() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [repoUrl, setRepoUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [defaultTab, setDefaultTab] = useState<"oauth" | "manual">("oauth");

  // Success dialog state (from Code 1)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successDialogData, setSuccessDialogData] = useState<{
    provider: string;
    repositoryCount: number;
  } | null>(null);

  // Prevent multiple OAuth processing (from Code 1)
  const [oauthCompleted, setOauthCompleted] = useState(false);

  // providerConfig (from Code 1, with syntax fixes)
  const providerConfig = {
    github: {
      oauthStart: `${BASE_URL}/api/repository/oauth/github/start`,
      tokenSave: `${BASE_URL}/api/repository/github-token`,
      apiRepos: "https://api.github.com/user/repos?per_page=100",
      tokenType: "token",
    },
    gitlab: {
      oauthStart: `${BASE_URL}/api/repository/oauth/gitlab/start`,
      tokenSave: `${BASE_URL}/api/repository/gitlab-token`,
      apiRepos: "https://gitlab.com/api/v4/projects?membership=true&per_page=100",
      tokenType: "Bearer",
    },
    bitbucket: {
      oauthStart: `${BASE_URL}/api/repository/oauth/bitbucket/start`,
      tokenSave: `${BASE_URL}/api/repository/bitbucket-token`,
      apiRepos: "https://api.bitbucket.org/2.0/repositories?role=member&pagelen=100",
      tokenType: "Bearer",
    },
    azure_devops: {
      oauthStart: `${BASE_URL}/api/repository/oauth/azure_devops/start`,
      tokenSave: `${BASE_URL}/api/repository/azure-token`,
      apiRepos: "https://dev.azure.com/_apis/git/repositories?api-version=6.0",
      tokenType: "Bearer",
    },
  };

  // Auth hook (from Code 1)
  const { isAuthenticated, getIdToken, loading } = useAuth();
  const [repos, setRepos] = useState<ConnectedRepo[]>([]);

  // --- Spinner logic for OAuth callback ---
  const [oauthProcessing, setOauthProcessing] = useState(false);

  // fetchRepos (from Code 1, with syntax fixes)
  const fetchRepos = async () => {
    try {
      const idToken = await getIdToken();
      if (!idToken) return;
      const res = await fetch(
        `${BASE_URL}/api/repository/user`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );
      if (res.ok) {
        const data = await res.json();
        setRepos(data);
        return data;
      } else {
        console.error("Failed to fetch repositories");
        return [];
      }
    } catch (error) {
      console.error("Error fetching repositories", error);
      return [];
    }
  };

  // --- NEW OAUTH LOGIC (from Code 2, adapted) ---

  /**
   * This is the simple callback handler from Code 2.
   * It makes one call to the backend and assumes the backend
   * handles token exchange, saving, and repo connection.
   * ADAPTED to use Code 1's `useAuth` hook.
   */
  const exchangeCodeForToken = async (code: string, provider: string) => {
    // Prevent multiple runs
    if (oauthCompleted) return;
    setOauthCompleted(true);
    setOauthProcessing(true); // Show spinner
    setIsConnecting(true);

    try {
      const idToken = await getIdToken();
      if (!idToken) throw new Error("Authentication required");

      // This is the simple backend call from Code 2
      const res = await fetch(`${BASE_URL}/api/oauth/${provider}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`, // Use auth from Code 1
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Code: code }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to exchange OAuth code");
      }

      // If successful, show Code 1's success dialog
      const updatedRepos = await fetchRepos(); // Refresh repo list
      setSuccessDialogData({
        provider: provider.charAt(0).toUpperCase() + provider.slice(1),
        repositoryCount: updatedRepos?.length || 0
      });
      setShowSuccessDialog(true);
      
      toast.success("Repository Connected Successfully!", {
        description: "Your repositories are now ready for AI-powered error analysis!",
      });

    } catch (error) {
      console.error('OAuth token exchange failed:', error);
      toast.error(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
      setOauthProcessing(false); // Hide spinner
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("provider");
      window.history.replaceState({}, document.title, url.toString());
    }
  };

  /**
   * This is the merged useEffect.
   * It fetches repos on load (from Code 1).
   * It handles the OAuth callback using Code 2's logic.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    // Use `sessionStorage` to get provider, matching Code 2's `handleConnect`
    const provider = sessionStorage.getItem('oauth_provider');
    const error = params.get("error");

    if (error) {
      toast.error(`OAuth error: ${error}`);
      // Clean up URL
      const url = new URL(window.location.href);
      url.searchParams.delete("code");
      url.searchParams.delete("error");
      window.history.replaceState({}, document.title, url.toString());
      sessionStorage.removeItem('oauth_provider');
      return;
    }

    // Handle OAuth callback (Code 2 logic)
    if (code && provider && !oauthCompleted) {
      exchangeCodeForToken(code, provider);
      sessionStorage.removeItem('oauth_provider');
    }

    // Fetch existing repos on load (Code 1 logic)
    if (!loading && isAuthenticated && !code) { // Don't fetch if handling a callback
      fetchRepos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading]); // Dependencies from Code 1

  /**
   * This is the `handleConnect` from Code 2, which redirects
   * to the provider from the frontend.
   * EXPANDED to support all 4 providers from Code 1's UI.
   */
  const handleConnect = () => {
    if (!selectedProvider) return;

    // Store provider info so the callback page knows which provider it was
    sessionStorage.setItem('oauth_provider', selectedProvider);

    let oauthUrl = "";
    
    // This is the URL of THIS frontend page
    const frontendRedirectUri = window.location.href.split('?')[0];

    if (selectedProvider === "github") {
      oauthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=repo,read:user&redirect_uri=${encodeURIComponent(frontendRedirectUri)}`;
    } else if (selectedProvider === "azure_devops") {
      const scope = "vso.code_read vso.project_read vso.identity";
      oauthUrl = `https://app.vssps.visualstudio.com/oauth2/authorize?client_id=${AZURE_CLIENT_ID}&response_type=code&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(frontendRedirectUri)}`;
    } else if (selectedProvider === "gitlab") {
      // NOTE: Ensure this redirect URI is in your GitLab App settings
      const scope = "read_api read_repository";
      oauthUrl = `https://gitlab.com/oauth/authorize?client_id=${GITLAB_CLIENT_ID}&response_type=code&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(frontendRedirectUri)}`;
    } else if (selectedProvider === "bitbucket") {
      // NOTE: Ensure this redirect URI is in your Bitbucket App settings
      const scope = "repository project account";
      oauthUrl = `https://bitbucket.org/site/oauth2/authorize?client_id=${BITBUCKET_CLIENT_ID}&response_type=code&scope=${encodeURIComponent(scope)}`;
    } else {
      toast.error("This provider's OAuth flow is not implemented yet.");
      return;
    }

    window.location.href = oauthUrl; // Redirect user
  };

  /**
   * This is the generic Manual Connect logic from Code 1.
   * It's better than Code 2's hardcoded version.
   * (Syntax errors fixed).
   */
  const handlePrivateRepoConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) {
        alert("You must be logged in to connect a repository.");
        return;
      }
      if (!selectedProvider) {
        alert("Please select a provider.");
        return;
      }
      const config = providerConfig[selectedProvider];
      if (!config) {
        alert("Unknown provider");
        return;
      }
      // Step 1: Save the token
      if (accessToken) {
        await fetch(config.tokenSave, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ AccessToken: accessToken }),
        });
      }
      // Step 2: Connect the repo
      const connectRes = await fetch(
        `${BASE_URL}/api/repository/connect`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            RepoUrl: repoUrl,
            IsPrivate: !!accessToken,
            Provider: selectedProvider,
          }),
        },
      );
      if (!connectRes.ok) {
        const errorData = await connectRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to connect repository");
      }
      
      // Success: Show dialog (Code 1 UI)
      await fetchRepos(); // Refresh list
      setSuccessDialogData({
        provider: selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1),
        repositoryCount: 1 // We only connected one
      });
      setShowSuccessDialog(true);
      toast.success("Repository Connected Successfully!");

      // Reset form
      setRepoUrl("");
      setAccessToken("");

    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to connect repository");
    } finally {
      setIsConnecting(false);
    }
  };

  // --- End of Merged Logic ---

  // Helper functions (from Code 1)
  const handleSkip = () => {
    window.location.href = "/dashboard";
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setSelectedProvider(null);
    setRepoUrl("");
    setAccessToken("");
  };

  // Auth loading spinner (from Code 1)
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative flex items-center justify-center h-[30px] w-[30px] mx-auto mb-4">
            <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[30px] w-[30px]"></div>
            <img
              src="/minimized-logo.png"
              alt="Loading"
              className="h-[18px] w-[18px] object-contain animate-logo-beat"
            />
          </div>
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // OAuth processing overlay (from Code 1)
  if (oauthProcessing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center gap-4 p-8">
            <div className="relative flex items-center justify-center h-[30px] w-[30px]">
              <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[30px] w-[30px]"></div>
              <img
                src="/minimized-logo.png"
                alt="StackSeek Logo"
                className="h-[18px] w-[18px] object-contain animate-logo-beat"
                loading="lazy"
                decoding="async"
              />
            </div> <div className="text-center">
              <h3 className="font-semibold">Connecting Repository...</h3>
              <p className="text-sm text-muted-foreground">
                Setting up secure access to your codebase
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // providers array (from Code 1)
  const providers = [
    {
      id: "github",
      name: "GitHub",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="h-6 w-6">
          <g fill="currentColor" className="text-black dark:text-white">
            <path fillRule="evenodd" clipRule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z" />
            <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0" />
          </g>
        </svg>
      ),
      whiteIcon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="h-4 w-4" fill="currentColor">
          <g>
            <path fillRule="evenodd" clipRule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z" />
            <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0" />
          </g>
        </svg>
      ),
      description: "Seamlessly integrate with public & private repos",
      color: "bg-card text-card-foreground border-border",
      popular: true,
    },
    {
      id: "gitlab",
      name: "GitLab",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="h-6 w-6">
          <path fill="#E24329" d="m124.755 51.382-.177-.452L107.47 6.282a4.459 4.459 0 0 0-1.761-2.121 4.581 4.581 0 0 0-5.236.281 4.578 4.578 0 0 0-1.518 2.304L87.404 42.088H40.629L29.077 6.746a4.492 4.492 0 0 0-1.518-2.31 4.581 4.581 0 0 0-5.236-.281 4.502 4.502 0 0 0-1.761 2.121L3.422 50.904l-.17.452c-5.059 13.219-.763 28.192 10.537 36.716l.059.046.157.111 26.061 19.516 12.893 9.758 7.854 5.93a5.283 5.283 0 0 0 6.388 0l7.854-5.93 12.893-9.758 26.218-19.634.065-.052c11.273-8.526 15.562-23.472 10.524-36.677z" />
          <path fill="#FC6D26" d="m124.755 51.382-.177-.452a57.79 57.79 0 0 0-23.005 10.341L64 89.682c12.795 9.68 23.934 18.09 23.934 18.09l26.218-19.634.065-.052c11.291-8.527 15.586-23.488 10.538-36.704z" />
          <path fill="#FCA326" d="m40.066 107.771 12.893 9.758 7.854 5.93a5.283 5.283 0 0 0 6.388 0l7.854-5.93 12.893-9.758s-11.152-8.436-23.947-18.09a18379.202 18379.202 0 0 0-23.935 18.09z" />
          <path fill="#FC6D26" d="M26.42 61.271A57.73 57.73 0 0 0 3.422 50.904l-.17.452c-5.059 13.219-.763 28.192 10.537 36.716l.059.046.157.111 26.061 19.516L64 89.655 26.42 61.271z" />
        </svg>
      ),
      whiteIcon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="h-4 w-4" fill="currentColor">
          <path d="m124.755 51.382-.177-.452L107.47 6.282a4.459 4.459 0 0 0-1.761-2.121 4.581 4.581 0 0 0-5.236.281 4.578 4.578 0 0 0-1.518 2.304L87.404 42.088H40.629L29.077 6.746a4.492 4.492 0 0 0-1.518-2.31 4.581 4.581 0 0 0-5.236-.281 4.502 4.502 0 0 0-1.761 2.121L3.422 50.904l-.17.452c-5.059 13.219-.763 28.192 10.537 36.716l.059.046.157.111 26.061 19.516 12.893 9.758 7.854 5.93a5.283 5.283 0 0 0 6.388 0l7.854-5.93 12.893-9.758 26.218-19.634.065-.052c11.273-8.526 15.562-23.472 10.524-36.677z" />
        </svg>
      ),
      description: "Full support for GitLab CI/CD pipelines",
      color: "bg-card text-card-foreground border-border",
    },
    {
      id: "bitbucket",
      name: "Bitbucket",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="h-6 w-6">
          <defs>
            <linearGradient id="bitbucket-gradient" gradientUnits="userSpaceOnUse" x1="28.593" y1="14.226" x2="16.672" y2="23.532" gradientTransform="scale(4)">
              <stop offset=".176" stopColor="#0052cc" />
              <stop offset="1" stopColor="#2684ff" />
            </linearGradient>
          </defs>
          <path d="M19.082 20c-1.918 0-3.355 1.758-3.039 3.516l12.95 79.289c.32 2.078 2.077 3.515 4.155 3.515h62.66c1.442 0 2.72-1.12 3.04-2.558l13.109-80.086c.316-1.918-1.121-3.516-3.039-3.516zM74.07 77.227H54.09l-5.278-28.293h30.215zm0 0" fill="#2684ff" />
          <path d="M107.64 48.934H78.868L74.07 77.227H54.09l-23.5 27.972s1.12.961 2.719.961h62.66c1.441 0 2.719-1.12 3.039-2.558zm0 0" fill="url(#bitbucket-gradient)" />
        </svg>
      ),
      whiteIcon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" className="h-4 w-4" fill="currentColor">
          <path d="M19.082 20c-1.918 0-3.355 1.758-3.039 3.516l12.95 79.289c.32 2.078 2.077 3.515 4.155 3.515h62.66c1.442 0 2.72-1.12 3.04-2.558l13.109-80.086c.316-1.918-1.121-3.516-3.039-3.516zM74.07 77.227H54.09l-5.278-28.293h30.215zm0 0M107.64 48.934H78.868L74.07 77.227H54.09l-23.5 27.972s1.12.961 2.719.961h62.66c1.441 0 2.719-1.12 3.039-2.558zm0 0" />
        </svg>
      ),
      description: "Atlassian ecosystem integration & Jira linking",
      color: "bg-card text-card-foreground border-border",
    },
    {
      id: "azure_devops",
      name: "Azure DevOps",
      icon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" className="h-6 w-6">
          <defs>
            <linearGradient id="azure-gradient" x1="9" y1="16.97" x2="9" y2="1.03" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#0078d4" />
              <stop offset="0.16" stopColor="#1380da" />
              <stop offset="0.53" stopColor="#3c91e5" />
              <stop offset="0.82" stopColor="#559cec" />
              <stop offset="1" stopColor="#5ea0ef" />
            </linearGradient>
          </defs>
          <path d="M17,4v9.74l-4,3.28-6.2-2.26V17L3.29,12.41l10.23.8V4.44Zm-3.41.49L7.85,1V3.29L2.58,4.84,1,6.87v4.61l2.26,1V6.57Z" fill="url(#azure-gradient)" />
        </svg>
      ),
      whiteIcon: () => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" className="h-4 w-4" fill="currentColor">
          <path d="M17,4v9.74l-4,3.28-6.2-2.26V17L3.29,12.41l10.23.8V4.44Zm-3.41.49L7.85,1V3.29L2.58,4.84,1,6.87v4.61l2.26,1V6.57Z" />
        </svg>
      ),
      description: "Enterprise DevOps with Microsoft integrations",
      color: "bg-card text-card-foreground border-border",
    },
  ];

  const handleProviderSelect = (
    provider: string,
    connectionType: "oauth" | "manual" = "oauth",
  ) => {
    setSelectedProvider(provider);
    setDefaultTab(connectionType);
    setStep(2);
  };

  // --- Start of Code 1 UI (JSX) ---

  if (step === 1) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/stack-seek-high-resolution-logo-transparent (6).png"
                alt="Stack Seek Logo"
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-all duration-300 hover:scale-110"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserProfile />
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-3 bg-gradient-to-br from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Connect Your Repository
            </h1>
            <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 max-w-xl mx-auto leading-relaxed">
              Choose your Git provider to start analyzing errors in your
              codebase. We support all major platforms with secure
              authentication and enterprise-grade protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {providers.map((provider, index) => (
              <Card
                key={provider.id}
                className="group transition-all duration-500 hover:shadow-3xl hover:scale-105 hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-2 duration-700 border-2 hover:border-primary/20 bg-gradient-to-br from-background to-muted/5"
                style={{ animationDelay: `${index * 100 + 200}ms` }} // Syntax Fix
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`p-3 rounded-lg ${provider.color} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`} // Syntax Fix
                    >
                      <provider.icon />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold group-hover:text-primary transition-colors duration-300">
                          {provider.name}
                        </h3>
                        {provider.popular && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0.5 h-4 animate-pulse"
                          >
                            Most Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                        {provider.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="group-hover:text-foreground transition-colors duration-300">
                      Choose connection method
                    </span>
                  </div>

                  {/* Connection Method Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleProviderSelect(provider.id, "oauth")}
                      className="flex-1 enhanced-button primary-gradient text-white font-medium border-0"
                      size="sm"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 text-white animate-icon">
                          <provider.whiteIcon />
                        </div>
                        <span>OAuth</span>
                      </div>
                    </Button>
                    <Button
                      onClick={() =>
                        handleProviderSelect(provider.id, "manual")
                      }
                      variant="outline"
                      className="flex-1 enhanced-button border-2 border-blue-500/20 hover:border-blue-500/40 font-medium text-foreground hover:text-blue-600"
                      size="sm"
                    >
                      <span>Manual</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-1 duration-1000 delay-700">
            <Alert className="max-w-2xl mx-auto mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Enterprise-grade security.</strong> End-to-end
                encryption, SOC 2 compliance, and read-only access. Your code is
                never stored - only analyzed in real-time.
              </AlertDescription>
            </Alert>

            {/* Skip Button moved to bottom center */}
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="enhanced-button"
            >
              Skip for now
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // --- Step 2 UI (Tabs) ---
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between w-full">
          <Button
            onClick={handleBackToStep1}
            variant="ghost"
            size="sm"
            className="enhanced-button text-sm px-3 py-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4 animate-icon" />
            Back to Providers
          </Button>
          <img
            src="/stack-seek-high-resolution-logo-transparent (6).png"
            alt="Stack Seek Logo"
            className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-all duration-300 hover:scale-110 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex items-center gap-2">
          <UserProfile />
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">
            Connect to {providers.find((p) => p.id === selectedProvider)?.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Choose how you'd like to connect your repository
          </p>
        </div>

        <Card className="animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-200 bg-card text-card-foreground border-border">
          <CardContent className="p-6">
            <Tabs value={defaultTab} onValueChange={setDefaultTab as (value: string) => void} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="oauth">
                  OAuth (Recommended)
                </TabsTrigger>
                <TabsTrigger value="manual">Manual Setup</TabsTrigger>
              </TabsList>

              {/* OAUTH TAB (with Code 2's `handleConnect` logic) */}
              <TabsContent value="oauth" className="space-y-6 mt-6">
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    {(() => {
                      const provider = providers.find(
                        (p) => p.id === selectedProvider,
                      );
                      if (provider?.icon) {
                        const Icon = provider.icon;
                        return <Icon className="h-8 w-8" />;
                      }
                      return null;
                    })()}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-2">
                      Quick & Secure Connection
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Authorize StackSeek to access your repositories with one
                      click. We'll only request the minimum permissions needed.
                    </p>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Secure:</strong> We use industry-standard OAuth 2.0
                    authentication. Your credentials are never stored on our
                    servers.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleConnect} // This now calls Code 2's logic
                  disabled={isConnecting}
                  className="w-full enhanced-button primary-gradient text-white border-0"
                  size="lg"
                >
                  {isConnecting ? (
                    <>
                      <div className="relative flex items-center justify-center mr-2 h-[30px] w-[30px]">
                        <div className="absolute animate-spin rounded-full border-2 border-white border-t-transparent h-[30px] w-[30px]"></div>
                        <img
                          src="/minimized-logo.png"
                          alt="Connecting"
                          className="h-[18px] w-[18px] object-contain animate-logo-beat"
                        />
                      </div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4 animate-icon" />
                      Connect with{" "}
                      {providers.find((p) => p.id === selectedProvider)?.name}
                    </>
                  )}
                </Button>
              </TabsContent>

              {/* MANUAL TAB (with Code 1's `handlePrivateRepoConnect` logic) */}
              <TabsContent value="manual" className="space-y-6 mt-6">
                <div className="text-center space-y-4">
                  <div>
                    <h3 className="text-base font-semibold mb-2 flex items-center justify-center gap-2">
                      <Settings className="h-4 w-4" />
                      Manual Repository Setup
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      For advanced users or private repositories that require
                      specific access tokens.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePrivateRepoConnect} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="repo-url">Repository URL</Label>
                    <Input
                      id="repo-url"
                      type="url"
                      placeholder="https://github.com/username/repository"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="access-token">
                      Access Token
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Required
                      </Badge>
                    </Label>
                    <Input
                      id="access-token"
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 transition-all duration-200 hover:border-primary/50 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      Required for private repositories. Create a personal
                      access token with 'repo' scope.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isConnecting}
                    className="w-full enhanced-button primary-gradient text-white border-0"
                    size="lg"
                  >
                    {isConnecting ? (
                      <>
                        <div className="relative flex items-center justify-center mr-2 h-[30px] w-[30px]">
                          <div className="absolute animate-spin rounded-full border-2 border-white border-t-transparent h-[30px] w-[30px]"></div>
                          <img
                            src="/minimized-logo.png"
                            alt="Connecting"
                            className="h-[18px] w-[18px] object-contain animate-logo-beat"
                          />
                        </div> Connecting Repository...
                      </>
                    ) : (
                      "Connect Repository"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Skip Button moved to bottom center */}
        <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-1 duration-1000">
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="enhanced-button"
          >
            Skip for now
          </Button>
        </div>
      </main>

      {/* Loading Overlay (hidden by default) */}
      {isConnecting && !oauthProcessing && ( // Only show if *not* in oauth processing
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-96">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <div className="relative flex items-center justify-center h-[30px] w-[30px]">
                <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[30px] w-[30px]"></div>
                <img
                  src="/minimized-logo.png"
                  alt="StackSeek Logo"
                  className="h-[18px] w-[18px] object-contain animate-logo-beat"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Connecting Repository...</h3>
                <p className="text-sm text-muted-foreground">
                  Setting up secure access to your codebase
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Beautiful Success Dialog (from Code 1) */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-background text-foreground border-border">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">
              Connection Successful!
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Your {successDialogData?.provider} repositories have been successfully connected.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Repository Stats Card */}
            <div className="rounded-lg border bg-background text-foreground border-border p-4">
              <div className="text-center">
                <h3 className="text-lg font-bold text-foreground">
                  {successDialogData?.repositoryCount || 0} Repositories Connected
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ready for AI-powered error analysis
                </p>
              </div>
            </div>

          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccessDialog(false);
                // Reset to step 1 to connect more repositories
                setStep(1);
                setSelectedProvider(null);
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

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--card-foreground))',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
        expand={true}
        richColors
      />
    </div>
  );
}