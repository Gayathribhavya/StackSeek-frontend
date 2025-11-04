'use client';
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
// Removed mock API dependency
import { createNavigationItems } from "@/lib/navigation";
import { BASE_URL } from "../../client/config";
import {
  AlertTriangle,
  GitBranch,
  BarChart3,
  Settings,
  History,
  Copy,
  Save,
  X,
  Lightbulb,
  ArrowLeft,
  Terminal,
  Folder,
  Star,
  Users,
  Calendar,
  Code,
  Lock,
  RotateCcw,
  Wrench,
  Search,
  Bug,
  Database,
  Plus,
  LayoutDashboard,
  ChevronDown,
  Eye,
  Code2,
  FileText,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";

// Provider icon components
const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);


const GitLabIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263c-.135-.423-.73-.423-.867 0L1.388 9.452.045 13.587a.896.896 0 00.325 1.005L12 23.054l11.63-8.462a.896.896 0 00.325-1.005z" />
  </svg>
);

const BitbucketIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M.778 1.213a.768.768 0 00-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 00.77-.646l3.27-20.03a.768.768 0 00-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z" />
  </svg>
);

const AzureDevOpsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M24 8.617L16.52.014 5.535 2.633v5.728L0 6.728l5.535 9.928v5.625L16.52 24 24 15.406v-6.79zM5.535 17.22V6.975L15.56 2.32v19.36L5.535 17.22z" />
  </svg>
);

// Function to get provider icon component
const getProviderIcon = (provider: string) => {
  switch (provider?.toLowerCase()) {
    case "github":
      return GitHubIcon;
    case "gitlab":
      return GitLabIcon;
    case "bitbucket":
      return BitbucketIcon;
    case "azure":
    case "azure_devops":
      return AzureDevOpsIcon;
    default:
      return ({ className }: { className?: string }) => <Database className={className} />;
  }
};

 


// Component that uses sidebar context to show appropriate tooltip
function SidebarToggleWithTooltip() {
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

  return (
    <Tooltip delayDuration={300} skipDelayDuration={0}>
      <TooltipTrigger asChild>
        <SidebarTrigger className="enhanced-button group-data-[collapsible=icon]:ml-2 group-data-[collapsible=icon]:macos-dock-icon" />
      </TooltipTrigger>
      <TooltipContent
        side={isExpanded ? "bottom" : "right"}
        className="sidebar-toggle-tooltip sidebar-menu-tooltip"
        sideOffset={12}
        avoidCollisions={true}
      >
        {isExpanded ? "Minimize Sidebar" : "Expand Sidebar"}
      </TooltipContent>
    </Tooltip>
  );
}

export default function Dashboard() {
  const [selectedRepo, setSelectedRepo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [nsMenuTrigger, setNsMenuTrigger] = useState(false);
  const [repoSearchOpen, setRepoSearchOpen] = useState(false);
  const [repoSearchValue, setRepoSearchValue] = useState("");
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [currentPayload, setCurrentPayload] = useState<any>(null);

  // Save report dialog state
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"txt" | "json">("txt");

  // Authentication context for retrieving ID tokens and auth state
  const { user, isAuthenticated, getIdToken, logout } = useAuth();

  // List of connected repositories fetched from the backend
  const [repositories, setRepositories] = useState<
    { id: string; url: string; isPrivate?: boolean; provider?: string }[]
  >([]);
  const [isLoadingRepositories, setIsLoadingRepositories] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCopied, setIsCopied] = useState(false);


  const parseRepoInfo = (url: string) => {
    const parts = url.split("/");
    const repoName = parts[parts.length - 1] || url;
    const owner = parts[parts.length - 2] || "";
    return { owner, repoName };
  };

  const filteredRepositories = repositories.filter((repo) => {
    const { owner, repoName } = parseRepoInfo(repo.url);
    const searchTerm = repoSearchValue.toLowerCase();
    return (
      owner.toLowerCase().includes(searchTerm) ||
      repoName.toLowerCase().includes(searchTerm) ||
      repo.url.toLowerCase().includes(searchTerm)
    );
  });

  // Fetch repositories once the user is authenticated
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setIsLoadingRepositories(true);
        const idToken = await getIdToken();
        if (!idToken) {
          // Not authenticated - no repositories available
          setRepositories([]);
          setIsLoadingRepositories(false);
          return;
        }
        const response = await fetch(
          "${BASE_URL}/api/repository/user",
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          setRepositories(data || []);
        } else {
          console.error("Failed to fetch repositories:", response.status);
          setRepositories([]);
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setRepositories([]);
      } finally {
        setIsLoadingRepositories(false);
      }
    };

    if (isAuthenticated) {
      fetchRepositories();
    } else {
      // Not authenticated - no repositories available
      setRepositories([]);
      setIsLoadingRepositories(false);
    }
  }, [isAuthenticated, getIdToken]);

  // NSMenu animation trigger effect
  useEffect(() => {
    setNsMenuTrigger(true);
    const timer = setTimeout(() => {
      setNsMenuTrigger(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAnalyzeError = async () => {
    if (!selectedRepo) {
      toast.error("Repository Required", {
        description: "Please select a repository first to start the analysis.",
        action: {
          label: "Select Repository",
          onClick: () => {
            const repoSelector = document.querySelector('[data-testid="repository-selector"]');
            if (repoSelector) {
              (repoSelector as HTMLElement).focus();
            }
          },
        },
      });
      return;
    }
    if (!errorMessage.trim()) {
      toast.error("Error Message Required", {
        description: "Please enter an error message or stack trace to analyze.",
        action: {
          label: "Focus Input",
          onClick: () => {
            const errorInput = document.querySelector('#error-message');
            if (errorInput) {
              (errorInput as HTMLElement).focus();
            }
          },
        },
      });
      return;
    }
    setIsLoading(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error("You must be logged in to analyze errors");
      }

      // First try to get provider from repository data, then fall back to URL detection
      const repo = repositories.find(r => r.url === selectedRepo);
      let provider = repo?.provider || "github";
      
      // Handle legacy "azure" provider name first
      if (provider === "azure") {
        provider = "azure_devops";
      }
      
      // If no provider in repo data or if it's still github (default fallback), detect from URL
      if (!repo?.provider || provider === "github") {
        if (selectedRepo.includes("gitlab.com")) provider = "gitlab";
        else if (selectedRepo.includes("bitbucket.org")) provider = "bitbucket";
        else if (
          selectedRepo.includes("dev.azure.com") ||
          selectedRepo.includes("visualstudio.com")
        )
          provider = "azure_devops";
      }

      // Retrieve the stored access token from the backend for the correct provider
      let tokenEndpoint = `${provider}-token`;
      if (provider === "azure_devops") {
        tokenEndpoint = "azure-token"; // Backend still uses "azure-token" endpoint
      }
      
      const tokenRes = await fetch(
        `${BASE_URL}/api/repository/${tokenEndpoint}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      if (!tokenRes.ok) {
        throw new Error(
          `Failed to retrieve ${provider} token. Make sure you have connected a repository via OAuth or provided a personal access token.`
        );
      }
      const tokenJson = await tokenRes.json();
      const accessToken = tokenJson.token;

      // Build the payload for the analysis service (provider-agnostic)
      const payload = {
        stack_trace: errorMessage.trim(),
        repo_url: selectedRepo,
        auth_token: accessToken,
        provider,
        output_file_name: "analysis_report_from_api_gitlab.json",
        force_index: true,
      };

      // Show payload preview modal immediately
      setIsLoading(false);
      setCurrentPayload(payload);
      setShowPayloadModal(true);
      return;
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while processing your request.");
      setIsLoading(false);
    }
  };

  const handleSendPayload = async () => {
    if (!currentPayload) return;
    
    setShowPayloadModal(false);
    setIsLoading(true);
    
    try {
      // Send the payload only if user confirms
      const response = await fetch("https://tbnqzvymar.ap-south-1.awsapprunner.com/analyze-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentPayload),
      });
      if (!response.ok) {
        throw new Error(
          `Analysis failed: ${response.status} ${response.statusText}`
        );
      }
      const results = await response.json();
      setAnalysisResults(results);
    } catch (error: any) {
      console.error("Error analyzing error:", error);
      alert(`Failed to analyze error: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = async (url: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setIsNavigating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    window.location.href = url;
  };

  const handleCopyAnalysis = async () => {
    if (!analysisResults) return;

    const parts = selectedRepo.split("/");
    const repoName = parts[parts.length - 1] || "Unknown";
    const ownerName = parts[parts.length - 2] || "Unknown";

    const analysisText = `
=== ERROR ANALYSIS REPORT ===

REPOSITORY DETAILS:
- Repository: ${ownerName}/${repoName}
- URL: ${selectedRepo}

ROOT CAUSE ANALYSIS:
${analysisResults.analysis.root_cause_analysis}

ERROR LOCATION:
${analysisResults.analysis.error_location}

EXECUTION PATH:
${analysisResults.analysis.execution_path}

REPLICATION STEPS:
${analysisResults.analysis.replication_steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}

SUGGESTED FIX:
${analysisResults.analysis.suggested_fix}

Generated on: ${new Date().toLocaleString()}
    `.trim();

    const isIframe = window.self !== window.top;

    if (!isIframe && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(analysisText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
      } catch (clipboardError) {
        console.log(
          "Clipboard API failed, falling back to legacy method:",
          clipboardError,
        );
      }
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = analysisText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.style.zIndex = "-1000";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        throw new Error("Legacy copy command failed");
      }
    } catch (error) {
      console.error("Failed to copy analysis:", error);
      const userChoice = confirm(
        "Automatic copy failed. Would you like to see the analysis text to copy manually?",
      );

      if (userChoice) {
        const modal = document.createElement("div");
        modal.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        `;

        const content = document.createElement("div");
        content.style.cssText = `
          background: white;
          border-radius: 8px;
          padding: 20px;
          max-width: 90%;
          max-height: 90%;
          overflow: auto;
          position: relative;
        `;

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✕ Close";
        closeBtn.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: #f0f0f0;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
        `;
        closeBtn.onclick = () => document.body.removeChild(modal);

        const textarea = document.createElement("textarea");
        textarea.value = analysisText;
        textarea.style.cssText = `
          width: 100%;
          height: 400px;
          font-family: monospace;
          font-size: 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 10px;
          resize: vertical;
        `;
        textarea.readOnly = true;
        textarea.onclick = () => textarea.select();

        const instruction = document.createElement("p");
        instruction.textContent =
          "Click in the text area and press Ctrl+A to select all, then Ctrl+C to copy:";
        instruction.style.marginBottom = "10px";

        content.appendChild(closeBtn);
        content.appendChild(instruction);
        content.appendChild(textarea);
        modal.appendChild(content);
        document.body.appendChild(modal);

        setTimeout(() => textarea.select(), 100);
      }
    }
  };

  const handleSaveReport = () => {
    if (!analysisResults) return;
    setIsSaveDialogOpen(true);
  };

  const handleDownloadReport = () => {
    if (!analysisResults) return;

    const parts = selectedRepo.split("/");
    const repoName = parts[parts.length - 1] || "Unknown";
    const ownerName = parts[parts.length - 2] || "Unknown";
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const generatedOn = now.toLocaleString();

    const downloadFile = (
      content: string | Blob,
      filename: string,
      type: string,
    ) => {
      const blob =
        typeof content === "string" ? new Blob([content], { type }) : content;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    if (selectedFormat === "txt") {
      const txtContent = `
=== StackSeek ERROR ANALYSIS REPORT ===

REPOSITORY DETAILS:
- Repository: ${ownerName}/${repoName}
- URL: ${selectedRepo}

ROOT CAUSE ANALYSIS:
${analysisResults.analysis.root_cause_analysis}

ERROR LOCATION:
${analysisResults.analysis.error_location}

EXECUTION PATH:
${analysisResults.analysis.execution_path}

REPLICATION STEPS:
${analysisResults.analysis.replication_steps.map((step: string, index: number) => `${index + 1}. ${step}`).join("\n")}

SUGGESTED FIX:
${analysisResults.analysis.suggested_fix}

Generated on: ${generatedOn}
      `.trim();

      const txtFileName = `stackseek-${repoName}-error-analysis-${dateStr}.txt`;
      downloadFile(txtContent, txtFileName, "text/plain");
    } else {
      const jsonData = {
        metadata: {
          generatedBy: "StackSeek",
          reportType: "Error Analysis",
          generatedOn: generatedOn,
          version: "1.0",
        },
        repository: {
          name: repoName,
          owner: ownerName,
          url: selectedRepo,
        },
        analysis: {
          rootCauseAnalysis: analysisResults.analysis.root_cause_analysis,
          errorLocation: analysisResults.analysis.error_location,
          executionPath: analysisResults.analysis.execution_path,
          replicationSteps: analysisResults.analysis.replication_steps,
          suggestedFix: analysisResults.analysis.suggested_fix,
        },
        originalData: analysisResults,
      };

      const jsonFileName = `stackseek-${repoName}-error-analysis-${dateStr}.json`;
      downloadFile(
        JSON.stringify(jsonData, null, 2),
        jsonFileName,
        "application/json",
      );
    }

    setIsSaveDialogOpen(false);
    toast.success("Report Downloaded Successfully!", {
      description: `Your analysis report has been saved as a ${selectedFormat.toUpperCase()} file.`,
    });
  };

  const menuItems = createNavigationItems("/dashboard", handleNavigation);

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
      <SidebarProvider defaultOpen={false}>
        <div className="flex min-h-screen w-full">
        <Sidebar
          collapsible="icon"
          className="border-r border-border sidebar-optimized sidebar-transition group"
          style={{
            contain: "layout style paint size",
            willChange: "transform, width",
            isolation: "isolate",
            backfaceVisibility: "hidden",
            perspective: "1000px",
          }}
        >
          <SidebarHeader className="border-b border-border h-16 px-4 flex items-center justify-center group-data-[collapsible=icon]:px-2">
            <div className="relative flex items-center justify-center w-full">
              <img 
              src="/stack-seek-high-resolution-logo-transparent (6).png"
              alt="Stack Seek Logo"
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain transition-all duration-300 hover:scale-110 group-data-[collapsible=icon]:hidden"
              />
              <div className="h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 opacity-0 scale-0 group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:scale-100 absolute inset-0 m-auto object-contain hover:scale-110 cursor-pointer">
                <img
                  src="/minimized-logo.png"
                  alt="Stack Seek Minimized Logo"
                  className="h-[18px] w-[18px] object-contain animate-logo-beat"
                />
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent
            className={cn(
              "px-2 pt-4 group-data-[collapsible=icon]:pt-6",
              nsMenuTrigger && "nsmenu-trigger",
            )}
          >
            <SidebarMenu className="space-y-2 group-data-[collapsible=icon]:space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Tooltip delayDuration={300} skipDelayDuration={0}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        className={`transition-all duration-300 hover:scale-[1.02] group-data-[collapsible=icon]:justify-center ${item.hoverBg || ""}`}
                      >
                        <a
                          href={item.href}
                          onClick={item.onClick}
                          className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center relative"
                        >
                          <div
                            className={`p-1.5 rounded-lg ${item.iconBg} transition-all duration-300 hover:scale-[1.05] hover:shadow-md hover:shadow-black/5 dark:hover:shadow-white/5 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:macos-dock-icon flex items-center justify-center`}
                            data-active={item.isActive}
                          >
                            <item.icon
                              className={`h-3 w-3 sm:h-4 sm:w-4 group-data-[collapsible=icon]:h-4 group-data-[collapsible=icon]:w-4 sm:group-data-[collapsible=icon]:h-5 sm:group-data-[collapsible=icon]:w-5 ${item.iconColor} transition-all duration-300`}
                            />
                          </div>
                          <span className="group-data-[collapsible=icon]:hidden font-medium transition-all duration-300 group-hover:translate-x-1 group-hover:font-semibold">
                            {item.label}
                          </span>
                        </a>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="sidebar-menu-tooltip bg-popover text-popover-foreground border shadow-md px-3 py-2 text-sm font-medium rounded-md"
                      sideOffset={15}
                      avoidCollisions={true}
                    >
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-border">
            <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
              <Tooltip delayDuration={300} skipDelayDuration={0}>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-accent rounded-md p-2 transition-colors group-data-[collapsible=icon]:macos-dock-icon">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarFallback className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-xs sm:text-sm font-medium">
                            {(() => {
                              const displayName =
                                user?.displayName || user?.email || "U";
                              return displayName.charAt(0).toUpperCase();
                            })()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="group-data-[collapsible=icon]:hidden flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-medium text-foreground truncate">
                            {user?.displayName ||
                              user?.email?.split("@")[0] ||
                              "User"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            View profile
                          </div>
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 animate-in slide-in-from-bottom-2 duration-200"
                      align="end"
                      side="top"
                    >
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm">
                            {user?.displayName ||
                              user?.email?.split("@")[0] ||
                              "User"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user?.email || "user@example.com"}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          window.history.pushState({}, "", "/settings");
                          window.location.reload();
                        }}
                        className="cursor-pointer enhanced-button transition-colors duration-200"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          setIsLoggingOut(true);
    try {
      // 1. Get the ID token
      const idToken = await getIdToken();
      if (idToken) {
        // 2. Delete user data from backend
        await fetch("${BASE_URL}/api/repository/delete-user-data", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      }
      // 3. Sign out from Firebase/auth context
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }finally {
        // Add a slight delay to allow the pop-up to show
        setTimeout(() => {
          setIsLoggingOut(false);
          window.location.href = "/login";
        }, 1500); // 1.5 seconds delay
      }
  }}
  className="cursor-pointer enhanced-button text-destructive focus:text-destructive transition-colors duration-200"
>
  <Lock className="mr-2 h-4 w-4" />
  Log out
</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="sidebar-menu-tooltip"
                  sideOffset={12}
                  avoidCollisions={true}
                >
                  {user?.displayName || user?.email?.split("@")[0] || "Profile"}
                </TooltipContent>
              </Tooltip>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset
          className="flex-1"
          style={{
            contain: "layout style paint",
            transform: "translateZ(0)",
            isolation: "isolate",
            willChange: "transform",
          }}
        >
          {/* Header */}
          
          <header className="flex h-16 items-center gap-2 sm:gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 group-data-[collapsible=icon]:px-4">
            <SidebarToggleWithTooltip />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold truncate">
                <span className="hidden sm:inline">
                  Error Analysis Dashboard
                </span>
                <span className="sm:hidden">Dashboard</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Transform errors into insights with AI-powered analysis
              </p>
            </div>
            <div className="flex items-center gap-2">
              
              <ThemeToggle />
              <div className="flex items-center gap-2">
</div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 sm:p-6 animate-fade-in">
            <div className="space-y-4 sm:space-y-6">
              {/* Back Button - Only show when analysis results exist */}
              {analysisResults && (
                <Button
                  onClick={() => setAnalysisResults(null)}
                  variant="outline"
                  className="mb-4 enhanced-button text-xs sm:text-sm"
                  size="sm"
                >
                  <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-icon" />
                  <span className="hidden sm:inline">Back to Analysis</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              )}

              {/* Error Analysis Form - Only show when no analysis results */}
              {!analysisResults && (
                <div className="space-y-4 sm:space-y-6 animate-slide-up">
                  <Card className="group transition-all duration-300 hover:shadow-md hover:scale-[1.02] border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/5 animate-scale-in hover:shadow-primary/3">
                    <CardHeader className="px-4 sm:px-6">
  <div className="flex items-center justify-between">
    <div className="min-w-0">
      <CardTitle className="text-lg sm:text-xl leading-tight">
        Error Analysis
      </CardTitle>
      <CardDescription className="text-sm mt-1">
        Analyze your error messages and stack traces
      </CardDescription>
    </div>
    {/* Bulb dialog trigger - NOT another CardHeader here! */}
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex items-center">
          <Lightbulb className="mr-2 w-5 h-5 text-yellow-400" />
          Pro Tips
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold mb-2">
            Pro Tips for Error Analysis
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Master the art of error debugging with these expert tips
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-2 max-h-[60vh]">
          {/* Tip 1 */}
          <Card className="group transition-all duration-300 hover:shadow-md hover:scale-[1.01] border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/5 hover:shadow-primary/3">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-base font-bold text-green-700 dark:text-green-300">
                    Share Complete Error Details
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Include the full error message, complete stack trace, and any relevant warnings. More details lead to better AI analysis!
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Code2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                      Example: TypeError: Cannot read property 'map' of undefined
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tip 2 */}
          <Card className="group transition-all duration-300 hover:shadow-md hover:scale-[1.01] border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/5 hover:shadow-primary/3">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300">
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-base font-bold text-orange-700 dark:text-orange-300">
                    Provide Stack Trace Context
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Include recent stack traces with file paths, line numbers, and function names. This helps pinpoint the exact error location.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Folder className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                      at /src/components/Button.tsx:42
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group transition-all duration-300 hover:shadow-md hover:scale-[1.01] border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/5 hover:shadow-primary/3">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-pink-600 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-base font-bold text-red-700 dark:text-red-300">
                    Add Contextual Information
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Describe what you were trying to do, expected vs actual behavior, and any recent code changes. Context is key!
                  </p>
                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1 mt-2 ml-4 list-disc">
                    <li>What action triggered the error?</li>
                    <li>Was this working before?</li>
                    <li>Any dependencies or environment changes?</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tip 4 */}
          <Card className="group transition-all duration-300 hover:shadow-md hover:scale-[1.01] border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/5 hover:shadow-primary/3">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300">
                    <Database className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <h3 className="text-base font-bold text-blue-700 dark:text-blue-300">
                    Include Relevant Metadata
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Mention framework version, Node version, OS, and any relevant configuration. These details help identify environment-specific issues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


      </DialogContent>
    </Dialog>
  </div>
</CardHeader>

                    
                    <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                      
                      {/* Repository Selector */}
                      <div className="space-y-2">
                        <Label htmlFor="repository" className="text-sm">
                          Select Repository {repositories.length > 0 && `(${repositories.length} available)`}
                        </Label>
                        {isLoadingRepositories ? (
                          <div className="flex items-center justify-center p-2 border rounded-lg h-9">
                            <div className="relative flex items-center justify-center h-5 w-5">
                              <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-5 w-5"></div>
                              <img
                                src="/minimized-logo.png"
                                alt="Loading"
                                className="h-3 w-3 object-contain animate-logo-beat"
                              />
                            </div>
                          </div>
                        ) : repositories.length > 0 ? (
                          <Popover open={repoSearchOpen} onOpenChange={setRepoSearchOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={repoSearchOpen}
                                className="w-full justify-between h-9 px-3 py-1.5 text-left font-normal text-sm bg-white dark:bg-background border-gray-200 dark:border-slate-700"
                              >
                                {selectedRepo ? (
                                  (() => {
                                    const repo = repositories.find((r) => r.url === selectedRepo);
                                    if (repo) {
                                      const { owner, repoName } = parseRepoInfo(repo.url);
                                      return (
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/30 flex-shrink-0">
                                            {(() => {
                                              const IconComponent = getProviderIcon(repo.provider || "");
                                              return <IconComponent className="h-3.5 w-3.5 text-foreground" />;
                                            })()}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <span className="font-medium text-xs truncate">
                                              {owner}/{repoName}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return "Select repository...";
                                  })()
                                ) : (
                                  <span className="text-muted-foreground">Select repository...</span>
                                )}
                                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white dark:bg-background border-gray-200 dark:border-slate-700" align="start">
                              <div className="border-b border-border/50 p-2">
                                <div className="relative">
                                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <input
                                    type="text"
                                    placeholder="Search repositories..."
                                    value={repoSearchValue}
                                    onChange={(e) => setRepoSearchValue(e.target.value)}
                                    className="w-full pl-8 pr-3 py-1.5 text-sm border-0 bg-white dark:bg-background focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
                                  />
                                </div>
                              </div>
                              
                              <div className="max-h-72 overflow-y-auto">
                                {filteredRepositories.length === 0 ? (
                                  <div className="p-6 text-center text-sm text-muted-foreground">
                                    <Search className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                                    <div className="font-medium">No repositories found</div>
                                    <div className="text-xs mt-1">Try different search terms</div>
                                  </div>
                                ) : (
                                  <div className="p-1">
                                    {filteredRepositories.map((repo) => {
                                      const { owner, repoName } = parseRepoInfo(repo.url);
                                      const isSelected = selectedRepo === repo.url;
                                      return (
                                        <div
                                          key={repo.id}
                                          onClick={() => {
                                            setSelectedRepo(repo.url);
                                            setRepoSearchOpen(false);
                                            setRepoSearchValue("");
                                          }}
                                          className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent ${
                                            isSelected ? "bg-primary/5 dark:bg-background ring-1 ring-primary/20 dark:ring-slate-700" : ""
                                          }`}
                                        >
                                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-background to-muted/50 border border-border/50 flex-shrink-0 shadow-sm">
                                            {(() => {
                                              const IconComponent = getProviderIcon(repo.provider || "");
                                              return <IconComponent className="h-5 w-5 text-foreground" />;
                                            })()}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-xs text-foreground truncate mb-0.5">
                                              {owner} / {repoName}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                              <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border">
                                                {(() => {
                                                  const providerName = repo.provider === "azure" ? "Azure DevOps" : 
                                                    repo.provider === "azure_devops" ? "Azure DevOps" :
                                                    repo.provider?.charAt(0).toUpperCase() + repo.provider?.slice(1) || 'Unknown';
                                                  return providerName;
                                                })()}
                                              </span>
                                              <span>•</span>
                                              <div className="flex items-center gap-1">
                                                {repo.isPrivate ? (
                                                  <>
                                                    <Lock className="h-2.5 w-2.5" />
                                                    <span>Private</span>
                                                  </>
                                                ) : (
                                                  <>
                                                    <Users className="h-2.5 w-2.5" />
                                                    <span>Public</span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <div className="flex-shrink-0">
                                            {repo.isPrivate ? (
                                              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 min-w-[60px] justify-center">
                                                <Lock className="h-2.5 w-2.5 mr-1" />
                                                Private
                                              </div>
                                            ) : (
                                              <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 min-w-[60px] justify-center">
                                                <Users className="h-2.5 w-2.5 mr-1" />
                                                Public
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <Card className="border-warning bg-warning/5 bg-white dark:bg-background border-gray-200 dark:border-slate-700">
                            <CardContent className="flex items-center gap-2 p-2">
                              <AlertTriangle className="h-4 w-4 text-warning" />
                              <span className="text-sm font-medium text-black dark:text-white">
                                Connect a repository to unlock AI error analysis
                              </span>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      {/* Error Message */}
                      <div className="space-y-2">
                        <Label htmlFor="error-message" className="text-sm">
                          Error Message or Stack Trace
                        </Label>
                        <div className="relative">
                          <div className="absolute left-2 sm:left-3 top-2 sm:top-3 flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                            <Terminal className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span className="text-xs">error.log</span>
                          </div>
                          <Textarea
                          id="error-message"
                          value={errorMessage}
                          onChange={e => setErrorMessage(e.target.value)}
                          placeholder="Paste your error message or stack trace here..."
                          className="min-h-56 pt-6 sm:pt-8 font-mono text-xs sm:text-sm bg-slate-900 border-gray-200 dark:border-slate-700 text-cyan-400 border-2 transition-all duration-300 hover:border-cyan-500 focus:border-cyan-400 resize-none placeholder:text-cyan-400/50 hover:shadow-md hover:shadow-cyan-500/10 focus:shadow-lg focus:shadow-cyan-400/15 hover:scale-[1.01]"
                          />
                        </div>
                      </div>

                      {/* Code Snippet */}
                      <div className="space-y-2">
                        <Label htmlFor="code-snippet" className="text-sm">
                          Code Snippet (Optional)
                        </Label>
                        <div className="relative">
                          <div className="absolute left-2 sm:left-3 top-2 sm:top-3 flex items-center gap-1 sm:gap-2 text-xs text-gray-500">
                            <Terminal className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </div>
                          <Textarea
                          id="code-snippet"
                          value={codeSnippet}
                          onChange={e => setCodeSnippet(e.target.value)}
                          placeholder="Paste the code that's causing the error..."
                          className="min-h-56 pt-6 sm:pt-8 font-mono text-xs sm:text-sm bg-slate-900 border-gray-200 dark:border-slate-700 text-purple-400 border-2 transition-all duration-300 hover:border-purple-500 focus:border-purple-400 resize-none placeholder:text-purple-400/50 hover:shadow-md hover:shadow-purple-500/10 focus:shadow-lg focus:shadow-purple-400/15 hover:scale-[1.01]"
                          />
                        </div>
                      </div>

                      {/* Analyze Button */}
                                                                  <Button
                                                                    onClick={handleAnalyzeError}
                                                                    disabled={isLoading}
                                                                    className="w-full enhanced-button primary-gradient text-white font-medium border-0 text-sm sm:text-base"
                                                                    size="lg"
                                                                  >
                                                                    {isLoading ? (
                                                                      <>
                                                                        <div className="relative flex items-center justify-center mr-2 h-[30px] w-[30px]">
                                                                          <div className="absolute animate-spin rounded-full border-2 border-white border-t-transparent h-[30px] w-[30px]"></div>
                                                                                  <div className="relative flex items-center justify-center h-[30px] w-[30px]">
                                                                                    <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[30px] w-[30px]"></div>
                                                                                    <img
                                                                                      src="/minimized-logo.png"
                                                                                      alt="Loading"
                                                                                      className="h-[18px] w-[18px] object-contain animate-logo-beat"
                                                                                    />
                                                                                  </div>
                                                                        </div>
                                                                        <span className="font-semibold tracking-wide">Analyzing...</span>
                                                                      </>
                                                                    ) : (
                                                                      <>
                                                                        <Terminal className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-icon" />
                                                                        <span className="font-semibold tracking-wide">
                                                                          <span className="hidden sm:inline">
                                                                            Analyze Error
                                                                          </span>
                                                                          <span className="sm:hidden">Analyze</span>
                                                                        </span>
                                                                      </>
                                                                    )}
                                                                  </Button>                    </CardContent>
                  </Card>

                  {!analysisResults && (
                    <div
                      className="space-y-4 animate-fade-in"
                      style={{ animationDelay: "200ms" }}
                    >

                    </div>
                  )}
                </div>
              )}

              {/* Analysis Results */}
              {analysisResults && (
                <div className="space-y-4 sm:space-y-6 animate-in slide-in-from-right duration-700 animate-fade-in">
                  <Card className="group transition-all duration-300 hover:shadow-md hover:scale-[1.02] border-2 hover:border-primary/30 bg-gradient-to-br from-background to-muted/5 animate-scale-in hover:shadow-primary/3">
                    <CardHeader className="pb-4 px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative">
                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md hover:shadow-lg hover:shadow-green-300/15 transition-all duration-300">
                              <span className="text-lg sm:text-2xl animate-pulse">
                                🧠
                              </span>
                            </div>
                            <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-green-500 rounded-full animate-ping" />
                            <div className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-green-400 rounded-full" />
                          </div>
                          <div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white leading-tight">
                              <span className="hidden sm:inline">
                                Analysis Results
                              </span>
                              <span className="sm:hidden">Results</span>
                            </h2>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                      {/* Root Cause Analysis */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-pink-600 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300">
                            <Search className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-pulse hover:animate-ping" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-red-700 dark:text-red-300">
                            Root Cause Analysis
                          </h3>
                        </div>
                        <Card className="bg-white dark:bg-background border-red-200 dark:border-red-800 shadow-md shadow-red-500/10 hover:shadow-lg hover:shadow-red-500/15 transition-shadow duration-300">
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                  <span className="text-[10px] text-red-600 dark:text-red-400 font-bold">
                                    !
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded-full">
                                  DIAGNOSIS
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed text-gray-800 dark:text-gray-200 font-semibold pl-6">
                                {analysisResults.analysis.root_cause_analysis}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Error Location */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-600 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300">
                            <Terminal className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-pulse hover:animate-bounce" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-orange-700 dark:text-orange-300">
                            Error Location
                          </h3>
                        </div>
                        <div className="relative">
                          <div className="absolute left-3 top-3 flex items-center gap-2 text-xs">
                            <Terminal className="h-3 w-3 text-gray-500 dark:text-gray-400 animate-pulse" />
                            <span className="text-gray-500 dark:text-gray-400 font-mono font-semibold">
                              error.log
                            </span>
                          </div>
                          <Card className="bg-slate-900 border-orange-200 dark:border-orange-800 pt-10 shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/15 transition-shadow duration-300">
                            <CardContent className="p-4">
                              <p className="font-mono text-sm leading-relaxed">
                                <span className="text-green-400 dark:text-green-400">
                                  $
                                </span>{" "}
                                <span className="text-orange-400 dark:text-orange-300 font-semibold">
                                  location:
                                </span>{" "}
                                <span className="text-red-400 dark:text-red-300 font-medium">
                                  {analysisResults.analysis.error_location}
                                </span>
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Execution Path */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300">
                            <Terminal className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-pulse hover:animate-spin" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-blue-700 dark:text-blue-300">
                            Execution Path
                          </h3>
                        </div>
                        <div className="relative">
                          <div className="absolute left-3 top-3 flex items-center gap-2 text-xs">
                            <Terminal className="h-3 w-3 text-gray-500 dark:text-gray-400 animate-pulse" />
                            <span className="text-gray-500 dark:text-gray-400 font-mono font-semibold">
                              trace.log
                            </span>
                          </div>
                          <Card className="bg-slate-900 border-blue-200 dark:border-blue-800 pt-10 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 transition-shadow duration-300">
                            <CardContent className="p-4">
                              <p className="font-mono text-sm leading-relaxed">
                                <span className="text-green-400 dark:text-green-400">
                                  $
                                </span>{" "}
                                <span className="text-cyan-400 dark:text-cyan-300 font-semibold">
                                  trace:
                                </span>{" "}
                                <span className="text-blue-400 dark:text-blue-300 font-medium">
                                  {analysisResults.analysis.execution_path}
                                </span>
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      {/* Replication Steps */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300">
                            <RotateCcw
                              className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-spin"
                              style={{ animationDuration: "3s" }}
                            />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-purple-700 dark:text-purple-300">
                            Replication Steps
                          </h3>
                        </div>
                        <Card className="bg-white dark:bg-background border-purple-200 dark:border-purple-800 shadow-md shadow-purple-500/10 hover:shadow-lg hover:shadow-purple-500/15 transition-shadow duration-300">
                          <CardContent className="p-3">
                            <ol className="space-y-1.5">
                              {analysisResults.analysis.replication_steps.map(
                                (step, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-xs leading-relaxed"
                                  >
                                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mt-0.5">
                                      <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400">
                                        {index + 1}
                                      </span>
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                      {step}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ol>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Suggested Fix */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300">
                            <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-white animate-pulse hover:animate-bounce" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-green-700 dark:text-green-300">
                            Suggested Fix
                          </h3>
                        </div>
                        <Card className="bg-white dark:bg-background border-green-200 dark:border-green-800 shadow-md shadow-green-500/10 hover:shadow-lg hover:shadow-green-500/15 transition-shadow duration-300">
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                                  <span className="text-[10px] text-green-600 dark:text-green-400">
                                    💡
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-1.5 py-0.5 rounded-full">
                                  SOLUTION
                                </span>
                              </div>
                              <div className="bg-green-50/40 dark:bg-green-950/20 rounded-md p-2 border border-green-200/30 dark:border-green-800/30">
                                <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                                  {analysisResults.analysis.suggested_fix}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-primary/20 dark:border-primary/30">
                        <Button
                          onClick={handleCopyAnalysis}
                          className="flex-1 enhanced-button primary-gradient text-white font-semibold border-0 text-sm sm:text-base"
                        >
                          <Copy className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-icon" />
                          <span className="hidden sm:inline">
                            {isCopied ? "Copied!" : "Copy Analysis"}
                          </span>
                          <span className="sm:hidden">{isCopied ? "Copied!" : "Copy"}</span>
                        </Button>
                        <Button
                          onClick={handleSaveReport}
                          variant="outline"
                          className="flex-1 enhanced-button border-2 border-blue-500/50 hover:border-blue-500/70 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 text-blue-600 hover:text-blue-500/80 font-semibold text-sm sm:text-base"
                        >
                          <Save className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-icon" />
                          <span className="hidden sm:inline">Save Report</span>
                          <span className="sm:hidden">Save</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>

      {/* File Format Selection Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-primary" />
              Save Analysis Report
            </DialogTitle>
            <DialogDescription>
              Choose the file format for your error analysis report.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup
              value={selectedFormat}
              onValueChange={(value: "txt" | "json") =>
                setSelectedFormat(value)
              }
              className="space-y-4"
            >
              <div
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:border-primary/30 ${
                  selectedFormat === "txt" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedFormat("txt")}
              >
                <RadioGroupItem value="txt" id="txt" className="mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="txt" className="font-medium cursor-pointer">
                    Text File (.txt)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Human-readable format perfect for viewing and sharing. Easy
                    to read in any text editor.
                  </p>
                </div>
              </div>

              <div
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-muted/50 hover:border-primary/30 ${
                  selectedFormat === "json" ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => setSelectedFormat("json")}
              >
                <RadioGroupItem value="json" id="json" className="mt-1" />
                <div className="space-y-1 flex-1">
                  <Label htmlFor="json" className="font-medium cursor-pointer">
                    JSON File (.json)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Structured data format ideal for programmatic processing and
                    API integration.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsSaveDialogOpen(false)}
              className="enhanced-button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownloadReport}
              className="enhanced-button primary-gradient text-white font-medium border-0"
            >
              <Save className="mr-2 h-4 w-4" />
              Download {selectedFormat.toUpperCase()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navigation Overlay - Simple logo only */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative flex items-center justify-center h-[30px] w-[30px]">
            <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[30px] w-[30px]"></div>
            <img
              src="/minimized-logo.png"
              alt="StackSeek Logo"
              className="h-[18px] w-[18px] object-contain animate-logo-beat"
            />
          </div>
        </div>
      )}

      {/* Analyzing Overlay - Full card for analysis operations */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-96">
            <CardContent className="flex flex-col items-center gap-4 p-8">
              <div className="relative flex items-center justify-center h-[30px] w-[30px]">
                <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[30px] w-[30px]"></div>
                <img
                  src="/minimized-logo.png"
                  alt="StackSeek Logo"
                  className="h-[18px] w-[18px] object-contain animate-logo-beat"
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold">Analyzing...</h3>
                <p className="text-sm text-muted-foreground">
                  Please wait a moment!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                    alert("Payload copied to clipboard!");
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
        <div className="relative flex items-center justify-center h-[30px] w-[30px]">
          <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[30px] w-[30px]"></div>
          <img
            src="/minimized-logo.png"
            alt="Loading"
            className="h-[18px] w-[18px] object-contain animate-logo-beat"
          />
        </div>
        <div className="text-center">
          <h3 className="font-semibold">Logging out...</h3>
          <p className="text-sm text-muted-foreground">Please wait a moment</p>
        </div>
      </CardContent>
    </Card>
  </div>
)}
      </SidebarProvider>
    </>
  );
}
