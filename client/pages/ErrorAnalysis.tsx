import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription, trackAnalysisUsage } from "@/hooks/use-subscription";
import { createNavigationItems } from "@/lib/navigation";
import { BASE_URL } from "../../client/config";
import {
  Search,
  RefreshCw,
  Copy,
  Check,
  Download,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
  Code,
  FileText,
  Zap,
  Settings as SettingsIcon,
  Lock,
  Plus,
  LayoutDashboard,
  Database,
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast, Toaster } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
// Authentication context for retrieving ID tokens and auth state


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

export default function ErrorAnalysis() {
  const { user, isAuthenticated, getIdToken, logout } = useAuth();
  const { subscription, getRemainingAnalyses, incrementAnalysisUsage } =
    useSubscription();
  const [errorInput, setErrorInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {},
  );

  const analysisCount = useRef(0);

  const handleNavigation = async (url: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.location.href = url;
  };

  const menuItems = createNavigationItems("/error-analysis", handleNavigation);

  const handleAnalyze = async () => {
    if (!errorInput.trim()) return;

    // Check if user has remaining analyses
    const remaining = getRemainingAnalyses();
    if (remaining <= 0) {
      alert(
        "You've reached your analysis limit. Please upgrade your plan to continue.",
      );
      return;
    }

    setIsAnalyzing(true);
    analysisCount.current += 1;

    try {
      // Track the analysis usage
      incrementAnalysisUsage("error_analysis", "manual_input");

      // TODO: Implement real AI analysis service integration
      throw new Error(
        "Analysis service not yet implemented. Please connect to a real analysis API.",
      );
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [key]: true });
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleClearAll = () => {
    setErrorInput("");
    setAnalysisResult(null);
    setCopiedStates({});
  };

  const handleExportResult = () => {
    if (!analysisResult) return;

    const exportData = {
      analysis: analysisResult,
      timestamp: new Date().toISOString(),
      user: user?.email,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `error-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Analysis Report Downloaded!", {
      description: "Your error analysis report has been saved as a JSON file.",
    });
  };

  // Listen for analysis tracking events from other components
  useEffect(() => {
    const handleTrackAnalysis = (event: CustomEvent) => {
      const { type, repositoryId } = event.detail;
      incrementAnalysisUsage(type, repositoryId);
    };

    window.addEventListener(
      "trackAnalysis",
      handleTrackAnalysis as EventListener,
    );
    return () => {
      window.removeEventListener(
        "trackAnalysis",
        handleTrackAnalysis as EventListener,
      );
    };
  }, [incrementAnalysisUsage]);

  const remainingAnalyses = getRemainingAnalyses();

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
                src="/final-transparent-logo.png"
                alt="Stack Seek Logo"
                className="h-12 sm:h-16 w-auto max-w-[200px] transition-all duration-300 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:scale-0 group-data-[collapsible=icon]:w-0 hover:scale-110 cursor-pointer"
              />
              
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 pt-4 group-data-[collapsible=icon]:pt-6">
            <SidebarMenu className="space-y-2 group-data-[collapsible=icon]:space-y-3">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Tooltip delayDuration={50} skipDelayDuration={0}>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        className={`transition-all duration-300 hover:scale-105 group-data-[collapsible=icon]:justify-center ${item.hoverBg || ""}`}
                      >
                        <a
                          href={item.href}
                          onClick={item.onClick}
                          className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center"
                        >
                          <div
                            className={`p-1.5 rounded-lg ${item.iconBg} transition-all duration-300 hover:scale-110 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:macos-dock-icon`}
                            data-active={item.isActive}
                          >
                            <item.icon
                              className={`h-4 w-4 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5 ${item.iconColor} transition-colors duration-300`}
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
                      className="sidebar-menu-tooltip"
                      sideOffset={12}
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
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                   <DropdownMenuItem
                        onClick={async () => {
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
    }
  }}
  className="cursor-pointer enhanced-button text-destructive focus:text-destructive transition-colors duration-200"
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
          <header className="flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 group-data-[collapsible=icon]:px-4">
            <SidebarToggleWithTooltip />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">AI Error Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Analyze errors and get instant AI-powered solutions
              </p>
            </div>
            <div className="flex items-center gap-2">
              {subscription && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">{remainingAnalyses}</span>{" "}
                  analyses remaining
                </div>
              )}
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-auto animate-fade-in">
            <div className="container mx-auto max-w-7xl p-3 space-y-3">
              {remainingAnalyses <= 3 && (
                <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800 dark:text-orange-200">
                    You have {remainingAnalyses} analyses remaining. Consider
                    upgrading your plan for unlimited analyses.
                  </AlertDescription>
                </Alert>
              )}

              {/* Input Section */}
              <Card className="shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700 hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Search className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Error Input</CardTitle>
                      <CardDescription className="text-sm">
                        Paste your error message, stack trace, or code
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 space-y-3">
                  <Textarea
                    placeholder="Paste your error message or stack trace here..."
                    value={errorInput}
                    onChange={(e) => setErrorInput(e.target.value)}
                    className="min-h-[100px] resize-y"
                    disabled={isAnalyzing}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleAnalyze}
                      disabled={
                        !errorInput.trim() ||
                        isAnalyzing ||
                        remainingAnalyses <= 0
                      }
                      className="professional-button enhanced-button"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="relative flex items-center justify-center mr-2 h-[30px] w-[30px]">
                            <div className="absolute animate-spin rounded-full border-2 border-white border-t-transparent h-[30px] w-[30px]"></div>
                            <img
                              src="/minimized-logo.png"
                              alt="Analyzing"
                              className="h-[18px] w-[18px] object-contain animate-logo-beat"
                            />
                          </div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Analyze Error
                        </>
                      )}
                    </Button>
                    {(errorInput || analysisResult) && (
                      <Button
                        variant="outline"
                        onClick={handleClearAll}
                        disabled={isAnalyzing}
                        className="enhanced-button"
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Result */}
              {analysisResult && (
                <Card className="shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <Lightbulb className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            Analysis Result
                          </CardTitle>
                          <CardDescription className="text-sm">
                            AI-powered solution for your error
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            analysisResult.severity === "high"
                              ? "destructive"
                              : analysisResult.severity === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {analysisResult.severity} severity
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportResult}
                          className="enhanced-button"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="solution">Solution</TabsTrigger>
                        <TabsTrigger value="code">Code Example</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">
                              Error Type
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {analysisResult.errorType}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-1">
                              Summary
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {analysisResult.summary}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-1">
                              Description
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {analysisResult.description}
                            </p>
                          </div>
                          {analysisResult.relatedFiles.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-sm mb-2">
                                Related Files
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {analysisResult.relatedFiles.map(
                                  (file: string, index: number) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <FileText className="h-3 w-3 mr-1" />
                                      {file}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="solution" className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-2">
                            Suggested Solutions
                          </h4>
                          <div className="space-y-2">
                            {analysisResult.suggestions.map(
                              (suggestion: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                                >
                                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-medium text-primary">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {suggestion}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="code" className="space-y-4">
                        {analysisResult.codeExample && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-sm">
                                Code Example
                              </h4>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleCopy(analysisResult.codeExample, "code")
                                }
                                className="enhanced-button"
                              >
                                {copiedStates.code ? (
                                  <Check className="h-3 w-3 mr-1 text-green-600" />
                                ) : (
                                  <Copy className="h-3 w-3 mr-1" />
                                )}
                                {copiedStates.code ? "Copied!" : "Copy"}
                              </Button>
                            </div>
                            <pre className="bg-muted p-3 rounded-lg text-sm overflow-x-auto">
                              <code>{analysisResult.codeExample}</code>
                            </pre>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
