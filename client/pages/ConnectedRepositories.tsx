'use client';
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { createNavigationItems } from "@/lib/navigation";
import { BASE_URL } from "../../client/config";
import {
  Trash2,
  GitBranch,
  ExternalLink,
  Plus,
  Lock,
  Globe,
  Users,
  Calendar,
  Settings,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";

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

// Function to detect provider from URL
const getProviderInfo = (url: string) => {
  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes("github.com")) {
    return {
      provider: "github",
      icon: GitHubIcon,
      color: "text-gray-900 dark:text-white",
      bgColor: "bg-gray-100 dark:bg-gray-800",
    };
  }

  if (lowerUrl.includes("gitlab.com") || lowerUrl.includes("gitlab.")) {
    return {
      provider: "gitlab",
      icon: GitLabIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    };
  }

  if (lowerUrl.includes("bitbucket.org") || lowerUrl.includes("bitbucket.")) {
    return {
      provider: "bitbucket",
      icon: BitbucketIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    };
  }

  if (
    lowerUrl.includes("dev.azure.com") ||
    lowerUrl.includes("visualstudio.com")
  ) {
    return {
      provider: "azure_devops",
      icon: AzureDevOpsIcon,
      color: "text-blue-700",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    };
  }

  // Default fallback
  return {
    provider: "git",
    icon: GitBranch,
    color: "text-primary",
    bgColor: "bg-primary/10",
  };
};

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

interface Repository {
  id: string;
  url: string;
  isPrivate?: boolean;
  provider?: string;
}

export default function ConnectedRepositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { isAuthenticated, getIdToken, user, logout } = useAuth();


  // Fetch connected repositories
  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setIsLoading(true);
        const idToken = await getIdToken();
        if (!idToken) {
          // Not authenticated - no repositories available
          setRepositories([]);
          setIsLoading(false);
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
          // Debug log: See what IDs you get from backend
          console.log("Fetched repositories:", data);
          setRepositories(data || []);
        } else {
          console.error("Failed to fetch repositories:", response.status);
          setRepositories([]);
        }
      } catch (error) {
        console.error("Error fetching repositories:", error);
        setRepositories([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Always fetch repositories (will use mock data if not authenticated)
    fetchRepositories();
  }, [isAuthenticated, getIdToken]);

  // --- CORRECT DELETE LOGIC ---
  const handleDeleteRepository = async (repoId: string) => {
    try {
      setIsDeleting(repoId);
      const idToken = await getIdToken();
      if (!idToken) {
        alert("You must be logged in to delete repositories");
        setIsDeleting(null);
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/repository/${encodeURIComponent(repoId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response.status === 401) {
        alert("Unauthorized: Please log in again.");
      } else if (response.status === 403) {
        alert("You do not have permission to delete this repository.");
      } else if (response.status === 404) {
        alert("Repository not found or already deleted.");
      } else if (!response.ok) {
        let msg = "Failed to delete repository";
        try {
          const err = await response.json();
          if (err?.message) msg = err.message;
        } catch {}
        alert(msg);
      } else {
        setRepositories((prev) => prev.filter((repo) => repo.id !== repoId));
        // Optionally: alert("Repository deleted successfully.");
      }
    } catch (error: any) {
      console.error("Error deleting repository:", error);
      alert(`Failed to delete repository: ${error?.message || error}`);
    } finally {
      setIsDeleting(null);
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

  const menuItems = createNavigationItems(
    "/connected-repositories",
    handleNavigation,
  );

  const parseRepoInfo = (url: string) => {
    const parts = url.split("/");
    const repoName = parts[parts.length - 1] || url;
    const owner = parts[parts.length - 2] || "";
    return { owner, repoName };
  };

  // Filter repositories based on search query
  const filteredRepositories = repositories.filter((repo) => {
    const { owner, repoName } = parseRepoInfo(repo.url);
    const searchTerm = searchQuery.toLowerCase();
    return (
      owner.toLowerCase().includes(searchTerm) ||
      repoName.toLowerCase().includes(searchTerm) ||
      repo.url.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full">
        <Sidebar
          collapsible="icon"
          className="border-r border-border sidebar-optimized sidebar-transition"
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

          <SidebarContent className="px-2 pt-4 group-data-[collapsible=icon]:pt-6 group-data-[collapsible=icon]:sidebar-collapsed">
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
                            className={`p-1.5 rounded-lg ${item.iconBg} transition-all duration-300 hover:scale-[1.05] hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-white/10 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:macos-dock-icon flex items-center justify-center`}
                            data-active={item.isActive}
                          >
                            <item.icon
                              className={`h-4 w-4 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 ${item.iconColor} transition-all duration-300`}
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
                      className="sidebar-menu-tooltip bg-popover text-popover-foreground border shadow-lg px-3 py-2 text-sm font-medium rounded-md"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-accent rounded-md p-2 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm font-medium">
                        {(() => {
                          const displayName =
                            user?.displayName || user?.email || "U";
                          return displayName.charAt(0).toUpperCase();
                        })()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="group-data-[collapsible=icon]:hidden flex-1">
                      <div className="text-sm font-medium text-foreground">
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
                    className="cursor-pointer transition-colors duration-200"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      setIsLoggingOut(true);
                      try {
                        console.log("Connected repositories logout initiated");
                        await logout();
                        console.log("Logout completed, redirecting...");
                        window.location.replace("/");
                      } catch (error) {
                        console.error("Logout failed:", error);
                        // Force redirect even if there was an error
                        window.location.replace("/");
                      } finally {
                        // Add a slight delay to allow the spinner to show
                        setTimeout(() => {
                          setIsLoggingOut(false);
                        }, 1000);
                      }
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive transition-colors duration-200"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="flex h-16 items-center gap-2 sm:gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 group-data-[collapsible=icon]:px-4">
            <SidebarToggleWithTooltip />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl font-semibold truncate">
                Connected Repositories
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Manage your connected repositories
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
                    Your Repositories
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {filteredRepositories.length} of {repositories.length} repositories
                    {searchQuery && " (filtered)"}
                  </p>
                </div>
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search repositories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-full sm:w-64 h-9"
                    />
                  </div>
                  <Button
                    onClick={(e) => handleNavigation("/connect-repository", e)}
                    className="bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 text-xs sm:text-sm flex-shrink-0 enhanced-button"
                    size="sm"
                  >
                    <Plus className="mr-1 sm:mr-2 h-3 w-3" />
                    <span className="hidden sm:inline">
                      Connect New Repository
                    </span>
                    <span className="sm:hidden">Connect</span>
                  </Button>
                </div>
              </div>

              {/* Repositories List */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="relative flex items-center justify-center h-[24px] w-[24px]">
                    <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[30px] w-[30px]"></div>
                    <img
                      src="/minimized-logo.png"
                      alt="Loading"
                      className="h-[18px] w-[18px] animate-logo-beat"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ) : repositories.length === 0 ? (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="flex flex-col items-center gap-3 p-6 sm:p-8">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-primary/10">
                      <GitBranch className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                        No repositories connected
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                        Connect your first repository to start analyzing errors
                        with AI
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : filteredRepositories.length === 0 ? (
                <Card className="border-muted/20 bg-muted/5">
                  <CardContent className="flex flex-col items-center gap-3 p-6 sm:p-8">
                    <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted/20">
                      <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">
                        No repositories found
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 sm:mb-4">
                        No repositories match "{searchQuery}". Try a different search term.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="enhanced-button"
                      >
                        Clear search
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-3 auto-rows-fr">
                  {filteredRepositories.map((repo) => {
                    const { owner, repoName } = parseRepoInfo(repo.url);
                    const providerInfo = getProviderInfo(repo.url);
                    const ProviderIcon = providerInfo.icon;

                    return (
                      <Card
                        key={repo.id}
                        className="transition-all duration-300 hover:shadow-lg min-h-[48px] sm:min-h-[52px] flex flex-col"
                      >
                        <CardContent className="p-3 sm:p-3 flex-1 flex flex-col justify-center">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                              <div
                                className={`flex h-5 w-5 sm:h-7 sm:w-7 items-center justify-center rounded-lg ${providerInfo.bgColor}`}
                              >
                                <ProviderIcon
                                  className={`h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 ${providerInfo.color}`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 sm:gap-2">
                                  <h3 className="text-sm sm:text-base font-bold truncate">
                                    {owner}/{repoName}
                                  </h3>
                                  <Badge
                                    variant={
                                      repo.isPrivate ? "secondary" : "outline"
                                    }
                                    className="flex items-center gap-0.5 text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 h-4 sm:h-5 flex-shrink-0"
                                  >
                                    {repo.isPrivate ? (
                                      <>
                                        <Lock className="h-1.5 w-1.5 sm:h-2 sm:w-2" />
                                        Private
                                      </>
                                    ) : (
                                      <>
                                        <Globe className="h-1.5 w-1.5 sm:h-2 sm:w-2" />
                                        Public
                                      </>
                                    )}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1 sm:gap-1.5 font-medium">
                                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                                    <span className="truncate">{owner}</span>
                                  </span>
                                  <span className="flex items-center gap-1 sm:gap-1.5 font-medium text-green-600 dark:text-green-400">
                                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Connected
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-muted-foreground hover:text-foreground h-6 w-6 sm:h-8 sm:w-8 p-0 enhanced-button"
                              >
                                <a
                                  href={repo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                                </a>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 w-6 sm:h-8 sm:w-8 p-0 enhanced-button"
                                    disabled={isDeleting === repo.id}
                                  >
                                    {isDeleting === repo.id ? (
                                      <div className="relative flex items-center justify-center h-[24px] w-[24px]">
                                        <div className="absolute animate-spin rounded-full border-2 border-destructive border-t-transparent h-[30px] w-[30px]"></div>
                                        <img
                                          src="/minimized-logo.png"
                                          alt="Deleting"
                                          className="h-[18px] w-[18px] animate-logo-beat"
                                        />
                                      </div>
                                    ) : (
                                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Remove Repository
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to remove{" "}
                                      <strong>
                                        {owner}/{repoName}
                                      </strong>
                                      ? This action cannot be undone and you'll
                                      need to reconnect to analyze errors.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteRepository(repo.id)
                                      }
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Remove
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
      
      {/* Navigation Overlay - Simple logo only */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm animate-in fade-in duration-150">
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
        </div>
      )}

      {/* Logout Loading Overlay */}
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
  );
}