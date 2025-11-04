'use client';
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authFetch } from '../../services/api';

import { CheckCircle, ArrowRight, Github, GitBranch, GitMerge, Cloud, Shield } from "lucide-react";
import { toast, Toaster } from "sonner";
import { BASE_URL } from "../../client/config";

export default function ConnectRepository() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [repoUrl, setRepoUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnectingOAuth, setIsConnectingOAuth] = useState(false);

  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [connectedRepoInfo, setConnectedRepoInfo] = useState<{
    name: string;
    url: string;
    provider: string;
    isPrivate: boolean;
  } | null>(null);

  // Handle OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const provider = urlParams.get('provider');
    const error = urlParams.get('error');

    if (error) {
      alert(`OAuth error: ${error}`);
      return;
    }

    if (code && provider) {
      setIsConnectingOAuth(true);
      // Exchange code for access token using the .NET backend
      exchangeCodeForToken(code, provider);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exchangeCodeForToken = async (code: string, provider: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/repository/oauth/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Code: code }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Save the token to the backend (this calls the .NET API to store it)
        await saveTokenToBackend(data.access_token, provider);

        // Show spinner for a moment before success dialog
        setTimeout(() => {
          setIsConnectingOAuth(false);
          
          // Show success dialog with repository info
          const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
          setConnectedRepoInfo({
            name: "Repository",
            url: "",
            provider: providerName,
            isPrivate: false
          });
          toast.success("Repository Connected Successfully!", {
            description: "Your repository is now ready for AI-powered error analysis!",
          });
        }, 600);
      } else {
        throw new Error(data.message || 'Failed to exchange code for token');
      }
    } catch (error) {
      setIsConnectingOAuth(false);
      console.error('OAuth token exchange failed:', error);
      alert(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const saveTokenToBackend = async (accessToken: string, provider: string) => {
    // Get Firebase auth token (assuming user is authenticated)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const idToken = user.accessToken || localStorage.getItem('authToken'); // Adjust based on your auth implementation

    if (!idToken) {
      throw new Error('User not authenticated');
    }

    const endpoint = `${BASE_URL}/api/repository/${provider}-token`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify({ AccessToken: accessToken }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to save ${provider} token: ${error}`);
    }
  };

  const handleProviderSelect = (provider: string) => {
    setSelectedProvider(provider);
    setStep(2);
  };
  
  const handleConnect = () => {
    if (!selectedProvider) return;

    // Store provider info for later use
    sessionStorage.setItem('oauth_provider', selectedProvider);

    // Redirect to the .NET backend OAuth endpoints
    const oauthUrl = `${BASE_URL}/api/repository/oauth/${selectedProvider}/start`;
    window.location.href = oauthUrl;
  };


  const handlePrivateRepoConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    try {
      // Get Firebase auth token
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const idToken = user.accessToken || localStorage.getItem('authToken');

      if (!idToken) {
        throw new Error('User not authenticated');
      }

      // Call the .NET backend API to connect the private repository
      const response = await fetch('${BASE_URL}/api/repository/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          RepoUrl: repoUrl,
          IsPrivate: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success dialog with repository info
        const repoName = repoUrl.split("/").pop() || "Repository";
        const provider = repoUrl.includes("github.com") ? "GitHub" : 
                       repoUrl.includes("gitlab.com") ? "GitLab" :
                       repoUrl.includes("bitbucket.org") ? "Bitbucket" :
                       repoUrl.includes("dev.azure.com") || repoUrl.includes("visualstudio.com") ? "Azure DevOps" :
                       "Git Provider";
        setConnectedRepoInfo({
          name: repoName,
          url: repoUrl,
          provider: provider,
          isPrivate: true
        });
        toast.success("Private Repository Connected Successfully!", {
          description: "Your private repository is now ready for AI-powered error analysis!",
        });
      } else {
        throw new Error(data.message || 'Failed to connect repository');
      }
    } catch (error) {
      console.error('Failed to connect repository:', error);
      alert(`Failed to connect repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    window.location.href = "/dashboard";
  };

  const userEmail = localStorage.getItem("userEmail") || "user@example.com";

  const providers = [
    {
      id: "github",
      name: "GitHub",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="24" height="24">
          <g fill="currentColor" className="text-black dark:text-white">
            <path fillRule="evenodd" clipRule="evenodd" d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"/>
            <path d="M26.484 91.806c-.133.3-.605.39-1.035.185-.44-.196-.685-.605-.543-.906.13-.31.603-.395 1.04-.188.44.197.69.61.537.91zm2.446 2.729c-.287.267-.85.143-1.232-.28-.396-.42-.47-.983-.177-1.254.298-.266.844-.14 1.24.28.394.426.472.984.17 1.255zM31.312 98.012c-.37.258-.976.017-1.35-.52-.37-.538-.37-1.183.01-1.44.373-.258.97-.025 1.35.507.368.545.368 1.19-.01 1.452zm3.261 3.361c-.33.365-1.036.267-1.552-.23-.527-.487-.674-1.18-.343-1.544.336-.366 1.045-.264 1.564.23.527.486.686 1.18.333 1.543zm4.5 1.951c-.147.473-.825.688-1.51.486-.683-.207-1.13-.76-.99-1.238.14-.477.823-.7 1.512-.485.683.206 1.13.756.988 1.237zm4.943.361c.017.498-.563.91-1.28.92-.723.017-1.308-.387-1.315-.877 0-.503.568-.91 1.29-.924.717-.013 1.306.387 1.306.88zm4.598-.782c.086.485-.413.984-1.126 1.117-.7.13-1.35-.172-1.44-.653-.086-.498.422-.997 1.122-1.126.714-.123 1.354.17 1.444.663zm0 0"/>
          </g>
        </svg>
      ),
      description: "Connect your GitHub repositories",
      color: "#24292e",
    },
    {
      id: "gitlab",
      name: "GitLab",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="24" height="24" fill="currentColor">
          <path d="m124.755 51.382-.177-.452L107.47 6.282a4.459 4.459 0 0 0-1.761-2.121 4.581 4.581 0 0 0-5.236.281 4.578 4.578 0 0 0-1.518 2.304L87.404 42.088H40.629L29.077 6.746a4.492 4.492 0 0 0-1.518-2.31 4.581 4.581 0 0 0-5.236-.281 4.502 4.502 0 0 0-1.761 2.121L3.422 50.904l-.17.452c-5.059 13.219-.763 28.192 10.537 36.716l.059.046.157.111 26.061 19.516 12.893 9.758 7.854 5.93a5.283 5.283 0 0 0 6.388 0l7.854-5.93 12.893-9.758 26.218-19.634.065-.052c11.273-8.526 15.562-23.472 10.524-36.677z"/>
        </svg>
      ),
      description: "Connect your GitLab repositories",
      color: "#f5f5f5",
    },
    {
      id: "bitbucket",
      name: "Bitbucket",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="24" height="24" fill="currentColor">
          <path d="M19.082 20c-1.918 0-3.355 1.758-3.039 3.516l12.95 79.289c.32 2.078 2.077 3.515 4.155 3.515h62.66c1.442 0 2.72-1.12 3.04-2.558l13.109-80.086c.316-1.918-1.121-3.516-3.039-3.516zM74.07 77.227H54.09l-5.278-28.293h30.215zm0 0M107.64 48.934H78.868L74.07 77.227H54.09l-23.5 27.972s1.12.961 2.719.961h62.66c1.441 0 2.719-1.12 3.039-2.558zm0 0"/>
        </svg>
      ),
      description: "Connect your Bitbucket repositories",
      color: "#f5f5f5",
    },
    {
      id: "azure-devops",
      name: "Azure DevOps",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="24" height="24" fill="currentColor">
          <path d="M17,4v9.74l-4,3.28-6.2-2.26V17L3.29,12.41l10.23.8V4.44Zm-3.41.49L7.85,1V3.29L2.58,4.84,1,6.87v4.61l2.26,1V6.57Z"/>
        </svg>
      ),
      description: "Connect your Azure DevOps repositories",
      color: "#f5f5f5",
    },
  ];

  // Spinner overlay for all OAuth providers
  if (isConnectingOAuth) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/minimized-logo.png"
            alt="Connecting"
            className="h-8 w-8 animate-logo-beat"
          />
          <span className="text-lg font-medium text-blue-700">
            Connecting repositories, please wait...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-background">
      {/* Header */}
      <header className="border-b border-border p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <img
          src="/stack-seek-high-resolution-logo-transparent.png"
          alt="Stack Seek Logo"
          className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-all duration-300 hover:scale-110"
          loading="lazy"
          decoding="async"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <span className="text-xs sm:text-sm text-muted-foreground text-center">
            Welcome, {userEmail}
          </span>
          <button
            onClick={handleSkip}
            className="px-3 sm:px-4 py-2 bg-muted text-muted-foreground border-none rounded-md text-xs sm:text-sm cursor-pointer hover:bg-muted/80 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {step === 1 && (
                      {/* Welcome Section */}
              <div className="bg-card rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg text-center border">
                <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground px-2">
                  Connect Your Repository
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed max-w-lg mx-auto px-2">
                  Let's get started by connecting your code repository.
                  StackSeek will analyze your code for errors and provide
                  AI-powered insights.
                </p>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  ⚡ Multi-Provider Support
                </div>
              </div>


              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Git Provider Column */}
                <div className="bg-card text-card-foreground border-border rounded-lg p-4 sm:p-6 shadow-lg border">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 text-foreground text-center">
                    Choose Your Git Provider
                  </h2>

                  <div className="flex flex-col gap-3">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => handleProviderSelect(provider.id)}
                        className="p-3 sm:p-4 border-2 border-border rounded-lg bg-background cursor-pointer text-left transition-all duration-200 flex items-center gap-3 w-full hover:border-primary hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <div
                          className="w-10 h-10 flex items-center justify-center bg-muted rounded-lg"
                          style={{ color: provider.id === "azure-devops" ? "#0078d4" : provider.color }}
                        >
                          {provider.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                            {provider.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground m-0">
                            {provider.description}
                          </p>
                        </div>
                        <div className="text-lg sm:text-xl text-muted-foreground">
                          →
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Private Repository Column */}
                <div className="bg-card text-card-foreground border-border rounded-lg p-4 sm:p-6 shadow-lg border">
                  <h2 className="text-lg sm:text-xl font-bold mb-4 text-foreground text-center">
                    Private Repository
                  </h2>

                  <button
                    onClick={() => handleProviderSelect("private")}
                    className="p-4 sm:p-6 border-2 border-border rounded-lg bg-background cursor-pointer text-center transition-all duration-200 flex flex-col items-center gap-3 sm:gap-4 w-full min-h-[180px] sm:min-h-[200px] justify-center hover:border-primary hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="sm:w-8 sm:h-8"
                      >
                        <path d="M6 10v2h3v-2c0-0.55 0.45-1 1-1s1 0.45 1 1v2h3v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3zM5 10c0-2.761 2.239-5 5-5s5 2.239 5 5v2h1c1.103 0 2 0.897 2 2v8c0 1.103-0.897 2-2 2H4c-1.103 0-2-0.897-2-2v-8c0-1.103 0.897-2 2-2h1v-2z" />
                      </svg>
                    </div>
                    <div className="px-2">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                        Connect with URL & Token
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground m-0 leading-relaxed">
                        Use repository URL and personal access token for private
                        repositories
                      </p>
                    </div>
                    <div className="text-xl sm:text-2xl text-primary">→</div>
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 2 && selectedProvider && selectedProvider !== "private" && (
            <div className="bg-card text-card-foreground border-border rounded-lg p-6 sm:p-8 md:p-12 shadow-lg text-center border relative">
              <button
                onClick={() => setStep(1)}
                className="absolute top-4 left-4 bg-none border-none text-xl sm:text-2xl cursor-pointer text-muted-foreground hover:text-foreground"
              >
                ←
              </button>

              <div
                className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                style={{
                  color: selectedProvider === "azure-devops" ? "#0078d4" : providers.find((p) => p.id === selectedProvider)?.color,
                }}
              >
                <div
                  style={{ transform: "scale(1.5)" }}
                  className="sm:scale-[2]"
                >
                  {providers.find((p) => p.id === selectedProvider)?.icon}
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground px-2">
                Connect to{" "}
                {providers.find((p) => p.id === selectedProvider)?.name}
              </h2>

              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed px-4">
                You'll be redirected to{" "}
                {providers.find((p) => p.id === selectedProvider)?.name} to
                authorize StackSeek to access your repositories.
              </p>

              <div className="bg-muted/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-left">
                <h3 className="text-sm sm:text-base font-semibold mb-2 text-foreground">
                  What we'll access:
                </h3>
                <ul className="list-none p-0 m-0 text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-2">
                  <li>✅ Read access to your repositories</li>
                  <li>✅ Access to commit history and issues</li>
                  <li>✅ Read repository metadata</li>
                  <li>🚫 No write access or code changes</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <button
                  onClick={handleConnect}
                  className="px-6 sm:px-8 py-3 text-white border-none rounded-lg text-sm sm:text-base font-medium cursor-pointer hover:opacity-90 transition-opacity w-full sm:w-auto"
                  style={{
                    backgroundColor: providers.find(
                      (p) => p.id === selectedProvider,
                    )?.color,
                  }}
                >
                  <span className="hidden sm:inline">
                    Connect to{" "}
                    {providers.find((p) => p.id === selectedProvider)?.name}
                  </span>
                  <span className="sm:hidden">Connect</span>
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="px-6 sm:px-8 py-3 bg-background text-muted-foreground border border-border rounded-lg text-sm sm:text-base font-medium cursor-pointer hover:bg-muted/50 transition-colors w-full sm:w-auto"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 2 && selectedProvider === "private" && (
            <div className="bg-card text-card-foreground border-border rounded-lg p-4 sm:p-6 md:p-8 shadow-lg border relative">
              <button
                onClick={() => setStep(1)}
                className="absolute top-4 left-4 bg-none border-none text-xl sm:text-2xl cursor-pointer text-muted-foreground hover:text-foreground"
              >
                ←
              </button>

              <div className="pt-4">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="sm:w-8 sm:h-8"
                    >
                      <path d="M6 10v2h3v-2c0-0.55 0.45-1 1-1s1 0.45 1 1v2h3v-2c0-1.657-1.343-3-3-3s-3 1.343-3 3zM5 10c0-2.761 2.239-5 5-5s5 2.239 5 5v2h1c1.103 0 2 0.897 2 2v8c0 1.103-0.897 2-2 2H4c-1.103 0-2-0.897-2-2v-8c0-1.103 0.897-2 2-2h1v-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground px-2">
                    Connect Private Repository
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-4">
                    Enter your repository URL and personal access token to
                    connect your private repository.
                  </p>
                </div>

                <form onSubmit={handlePrivateRepoConnect}>
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Repository URL
                    </label>
                    <input
                      type="url"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      required
                      placeholder="https://github.com/username/repository.git"
                      className="w-full p-2 sm:p-3 border-2 border-border rounded-lg text-sm outline-none transition-colors box-border bg-background text-foreground focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-2 px-1">
                      HTTPS URL to your Git repository (GitHub, GitLab,
                      Bitbucket, etc.)
                    </p>
                  </div>

                  <div className="mb-6 sm:mb-8">
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Personal Access Token
                    </label>
                    <input
                      type="password"
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      required
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      className="w-full p-2 sm:p-3 border-2 border-border rounded-lg text-sm outline-none transition-colors box-border bg-background text-foreground focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground mt-2 px-1">
                      Token with repository access permissions.{" "}
                      <a href="#" className="text-primary underline">
                        How to create a token?
                      </a>
                    </p>
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
                    <h3 className="text-xs sm:text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
                      🔒 Security Notice
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed m-0">
                      Your access token is encrypted and stored securely. We
                      only use it to read your repository for analysis purposes.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center px-2">
                    <button
                      type="submit"
                      disabled={isConnecting || !repoUrl || !accessToken}
                      className={cn(
                        "px-6 sm:px-8 py-3 border-none rounded-lg text-sm sm:text-base font-medium transition-colors w-full sm:w-auto",
                        isConnecting || !repoUrl || !accessToken
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90",
                      )}
                    >
                      {isConnecting ? "Connecting..." : "Connect Repository"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={isConnecting}
                      className="px-6 sm:px-8 py-3 bg-background text-muted-foreground border border-border rounded-lg text-sm sm:text-base font-medium cursor-pointer hover:bg-muted/50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                    >
                      Back
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>
      <Toaster />
    </>
  );
}