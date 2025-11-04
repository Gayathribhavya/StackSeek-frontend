import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { useSecurity } from "@/hooks/use-security";
import { useNotifications } from "@/hooks/use-notifications";
import { createNavigationItems } from "@/lib/navigation";
import { BASE_URL } from "../../client/config";
import { getAuth, signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { Loader2 } from "lucide-react"; // <-- Add this import with your other lucide-react imports

// ...rest of your imports...
import {
  User,
  Settings as SettingsIcon,
  Mail,
  UserPlus,
  Lock,
  Shield,
  Trash2,
  ArrowLeft,
  LogOut,
  Edit2,
  Check,
  X,
  Eye,
  EyeOff,
  QrCode,
  CheckCircle,
  CreditCard,
  TrendingUp,
  Zap,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
import { LayoutDashboard, Database, Plus } from "lucide-react";

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

export default function Settings() {
  // Handler to start 2FA setup and show QR code
  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    try {
      const { qrCodeImage, secret, otpauthUri } = await setup2FA();
      setQrCode(qrCodeImage);
      setOtpauthUri(otpauthUri);
      // Optionally store secret if needed
    } catch (error) {
      alert("Failed to setup 2FA");
    } finally {
      setIsEnabling2FA(false);
    }
  };
  const { user, logout, updateProfile } = useAuth();
  // ...existing code...
  const {
    subscription,
    loading: subscriptionLoading,
    getRemainingAnalyses,
    getTrialDaysRemaining,
    canUseFeature,
  } = useSubscription();
  const {
    security,
    loading: securityLoading,
    updatePassword,
    enable2FA,
    disable2FA,
    getPasswordAge,
    getSecurityScore,
    refreshSecurity,
    setup2FA, // <-- add this here
  } = useSecurity();
  const {
    notifications,
    loading: notificationsLoading,
    updateEmailPreferences,
    updatePushPreferences,
    requestPushPermission,
    sendTestNotification,
    getUnreadCount,
  } = useNotifications();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isEditingName, setIsEditingName] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Password change state
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
// 2FA state
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [otpauthUri, setOtpauthUri] = useState("");

  // Get real security data
  const is2FAEnabled = security?.twoFactorEnabled || false;
  const passwordAge = getPasswordAge();
  const securityScore = getSecurityScore();


  // Get real subscription data
  const currentPlan = subscription?.plan?.name || "Free Trial";
  const analysisUsed = subscription?.analysisUsed || 0;
  const analysisLimit = subscription?.plan?.analysisLimit || 10;
  const remainingAnalyses = getRemainingAnalyses();
  const trialDaysRemaining = getTrialDaysRemaining();
  const usagePercentage = Math.min((analysisUsed / analysisLimit) * 100, 100);

  // Add after your other useState hooks:
const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
const [deleteConfirmText, setDeleteConfirmText] = useState("");
const [isDeletingAccount, setIsDeletingAccount] = useState(false);
const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
const [isLoggingOut, setIsLoggingOut] = useState(false);
const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);


  // Sync displayName state with user data changes
  useEffect(() => {
    setDisplayName(user?.displayName || "");
  }, [user?.displayName]);

  const handleBack = () => {
    window.location.href = "/dashboard";
  };

  const handleEditName = () => {
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    try {
      // Update the user profile with the new display name
      await updateProfile({ displayName: displayName });
      setIsEditingName(false);
      setSaveMessage("Display name updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error updating display name:", error);
      setSaveMessage("Failed to update display name");
      setTimeout(() => setSaveMessage(""), 3000);
      // Reset the display name to the original value if update failed
      setDisplayName(user?.displayName || "");
    }
  };

  const handleCancelEditName = () => {
    setDisplayName(user?.displayName || "");
    setIsEditingName(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      await updatePassword(currentPassword, newPassword);
      setIsPasswordDialogOpen(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSaveMessage("Password changed successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error: any) {
      console.error("Password change error:", error);
      alert(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Handler to verify 2FA code
  const handleVerify2FA = async () => {
    if (verificationCode.length !== 6) {
      alert("Please enter a 6-digit verification code");
      return;
    }
    try {
      await enable2FA(verificationCode);
      await refreshSecurity(); // This updates the UI state
      setIs2FADialogOpen(false);
      setVerificationCode("");
      setQrCode("");
      setOtpauthUri("");
      setSaveMessage("Two-factor authentication enabled successfully!");
      window.alert("Two-factor authentication has been enabled!");
      setTimeout(() => setSaveMessage(""), 1000);
    } catch (error: any) {
      alert(error.message || "Invalid verification code");
    }
  };

  // Handler to disable 2FA
  const handleDisable2FA = async () => {
    if (confirm("Are you sure you want to disable two-factor authentication?")) {
      try {
        await disable2FA();
        setSaveMessage("Two-factor authentication disabled successfully!");
        window.alert("Two-factor authentication has been disabled!");
        setTimeout(() => setSaveMessage(""), 1000);
      } catch (error: any) {
        alert(error.message || "Failed to disable 2FA");
      }
    }
  };
const handleEmailNotificationChange = async (enabled: boolean) => {
  setIsSaving(true);
  try {
    await updateEmailPreferences({ enabled });
    if (enabled) {
      await sendTestNotification("email"); // <- triggers a test email notification
    }
    setSaveMessage("Email notification preferences updated!");
    setTimeout(() => setSaveMessage(""), 3000);
  } catch (error: any) {
    console.error("Error updating email notifications:", error);
    setSaveMessage("Failed to update email notifications");
    setTimeout(() => setSaveMessage(""), 3000);
  } finally {
    setIsSaving(false);
  }
};

const handlePushNotificationChange = async (enabled: boolean) => {
  setIsSaving(true);
  try {
    if (enabled) {
      const granted = await requestPushPermission();
      if (!granted) {
        setSaveMessage("Push notification permission denied");
        setTimeout(() => setSaveMessage(""), 3000);
        setIsSaving(false);
        return;
      }
      await sendTestNotification("push"); // <- triggers a local push test
    }

    await updatePushPreferences({ enabled });
    setSaveMessage("Push notification preferences updated!");
    setTimeout(() => setSaveMessage(""), 3000);
  } catch (error: any) {
    console.error("Error updating push notifications:", error);
    setSaveMessage(error.message || "Failed to update push notifications");
    setTimeout(() => setSaveMessage(""), 3000);
  } finally {
    setIsSaving(false);
  }
};


  const handleLogout = async () => {
    setIsLoggingOut(true); 
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      // Delete backend data (Firestore, etc.)
      await fetch(
        "${BASE_URL}/api/repository/delete-user-data",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Sign out of Firebase
      await firebaseSignOut(auth);
    }
   
  } catch (error) {
    console.error("Sign out failed:", error);
    // Optionally show a toast or alert here
  }finally {
    // Add a slight delay to allow the pop-up to show
    setTimeout(() => {
      setIsLoggingOut(false);
      window.location.href = "/login";
    }, 1500); // 1.5 seconds delay
  }
};


  // ...existing code...
const handleDeleteAccount = () => {
  setIsDeleteDialogOpen(true);
  setDeleteConfirmText("");
};

const confirmDeleteAccount = async () => {
  if (deleteConfirmText.trim().toLowerCase() !== "delete") return;
  setIsDeletingAccount(true);
  try {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      const res = await fetch(
        "${BASE_URL}/api/repository/delete-account",
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.message || "Failed to delete account");
      }
      await firebaseSignOut(auth);
    }
    setDeleteSuccessMessage("Account deleted successfully!");
    setTimeout(() => {
      setIsDeleteDialogOpen(false);
      window.location.href = "https://stackseek.io";
    }, 1000); // 1 second before redirect
  } catch (error: any) {
    alert(error.message || "Failed to delete account");
  } finally {
    setIsDeletingAccount(false);
  }
};
// ...existing code...

  const handleNavigation = async (url: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.location.href = url;
  };

  const menuItems = createNavigationItems("/settings", handleNavigation);

  return (
    <>
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

          <SidebarContent className="px-2 pt-4 group-data-[collapsible=icon]:pt-6">
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
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
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
          <header className="flex h-16 items-center gap-2 sm:gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6 group-data-[collapsible=icon]:px-4">
            <SidebarToggleWithTooltip />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold truncate">
                Account Settings
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Manage your account preferences and security settings
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-auto animate-fade-in">
            <div className="w-full p-3 sm:p-6 space-y-3 sm:space-y-6">
              {saveMessage && (
                <Alert className="mb-3 sm:mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
                  <AlertDescription className="text-sm">
                    {saveMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Profile Information */}
              <Card
                className="shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group animate-scale-in"
                style={{ animationDelay: "100ms" }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <User className="h-4 w-4 text-primary animate-icon" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Profile Settings
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Manage your profile information and preferences
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 px-4 sm:px-6">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Profile Information */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium mb-4">
                        Profile Information
                      </h4>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-r from-blue-700 to-blue-500 text-white text-sm">
                            {(user?.displayName || user?.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            {isEditingName ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={displayName}
                                  onChange={(e) =>
                                    setDisplayName(e.target.value)
                                  }
                                  className="text-sm font-medium w-full max-w-[200px]"
                                  autoFocus
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleSaveName}
                                  className="enhanced-button transition-all duration-200 hover:scale-[1.03] h-8 w-8 p-0 flex-shrink-0"
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEditName}
                                  className="enhanced-button h-8 w-8 p-0 flex-shrink-0"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-semibold truncate">
                                  {user?.displayName ||
                                    user?.email?.split("@")[0] ||
                                    "User"}
                                </h3>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleEditName}
                                  className="enhanced-button transition-all duration-200 hover:scale-[1.03] h-7 w-7 p-0"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <p className="text-sm text-muted-foreground truncate">
                              {user?.email}
                            </p>
                            {user?.emailVerified && (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs px-2 py-1 self-start"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card
                className="shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group animate-scale-in"
                style={{ animationDelay: "200ms" }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Shield className="h-4 w-4 text-primary animate-icon" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Security Settings</CardTitle>
                      <CardDescription className="text-sm">
                        Manage your account security and authentication
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2 px-4 sm:px-6 space-y-6">
                  {/* Password Section */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Label className="text-sm">Password</Label>
                      <p className="text-xs text-muted-foreground">
                        {securityLoading
                          ? "Loading..."
                          : security
                            ? `Last changed ${passwordAge} days ago`
                            : "Not available"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPasswordDialogOpen(true)}
                      className="enhanced-button transition-all duration-300 hover:scale-[1.02] w-full sm:w-[100px]"
                    >
                      <Lock className="h-3 w-3 mr-1 animate-icon" />
                      Change
                    </Button>
                  </div>

                  {/* Two-Factor Authentication Section */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Label className="text-sm">Two-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">
                        {securityLoading
                          ? "Loading..."
                          : is2FAEnabled
                            ? `Enabled${
                                security?.twoFactorSetupDate
                                  ? ` on ${new Date(security.twoFactorSetupDate).toLocaleDateString()}`
                                  : ""
                              }`
                            : "Add extra security"}
                      </p>
                    </div>
                    {is2FAEnabled ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <span className="text-green-600 font-semibold text-center sm:text-left">
                          Enabled
                          {security?.twoFactorSetupDate
                            ? ` (${new Date(security.twoFactorSetupDate).toLocaleDateString()})`
                            : ""}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDisable2FA}
                          className="enhanced-button transition-all duration-300 hover:scale-[1.02] w-full sm:w-[100px]"
                        >
                          <Shield className="h-3 w-3 mr-1 animate-icon" />
                          Disable
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIs2FADialogOpen(true);
                          handleEnable2FA();
                        }}
                        disabled={isEnabling2FA}
                        className="enhanced-button transition-all duration-300 hover:scale-[1.02] w-full sm:w-[100px]"
                      >
                        {isEnabling2FA ? (
                          <div className="relative flex items-center justify-center h-5 w-5">
                            <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-5 w-5"></div>
                            <img
                              src="/minimized-logo.png"
                              alt="Loading"
                              className="h-3 w-3 object-contain animate-logo-beat"
                            />
                          </div>
                        ) : (
                          <Shield className="h-3 w-3 mr-1 animate-icon" />
                        )}
                        {isEnabling2FA ? "Loading..." : "Enable"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Plan */}
              <Card
                className="shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-700 hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group animate-scale-in"
                style={{ animationDelay: "300ms" }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <UserPlus className="h-4 w-4 text-primary animate-icon" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Subscription Plan
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Plan and usage details
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-2">
                  {subscriptionLoading ? (
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-2 bg-muted rounded animate-pulse" />
                      <div className="h-8 bg-muted rounded animate-pulse" />
                    </div>
                  ) : subscription ? (
                    <div className="space-y-3">
                      {/* Current Plan */}
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <h3 className="text-lg font-semibold text-primary">
                            {currentPlan}
                          </h3>
                        </div>

                        {/* Plan Details */}
                        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                          <h4 className="font-medium text-sm">Plan Details</h4>

                          {subscription.plan.type === "free_trial" ? (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Error Analyses</span>
                                <span>{subscription.usage?.analyses_used || 0} / {subscription.plan.limits?.analyses || 15} used</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Repositories</span>
                                <span>{subscription.usage?.repositories_connected || 0} / {subscription.plan.limits?.repositories || 10} connected</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Repository Type</span>
                                <span>{subscription.plan.features?.repository_types || "Public only"}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Trial Period</span>
                                <span>{trialDaysRemaining} days remaining</span>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Error Analyses</span>
                                <span>{subscription.plan.limits?.analyses || "Unlimited"}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Repositories</span>
                                <span>{subscription.usage?.repositories_connected || 0} connected{subscription.plan.limits?.repositories ? ` / ${subscription.plan.limits.repositories}` : " (Unlimited)"}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Repository Type</span>
                                <span>{subscription.plan.features?.repository_types || "Public & Private"}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Advanced Features</span>
                                <span>{subscription.plan.features?.advanced_features ? "Included" : "Not included"}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {subscription.plan.type === "free_trial" && (
                          <Button
                            onClick={() => setIsPricingDialogOpen(true)}
                            className="bg-blue-600 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 ease-in-out hover:bg-blue-700 hover:scale-[1.03] hover:shadow-lg w-fit enhanced-button"
                          >
                            Upgrade Plan
                          </Button>
                        )}
                      </div>

                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No subscription data available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Password Change Dialog */}
              <Dialog
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showPasswords.current ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              current: !prev.current,
                            }))
                          }
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPasswords.new ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              new: !prev.new,
                            }))
                          }
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsPasswordDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* 2FA Setup Dialog */}
              <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                      Scan the QR code with your authenticator app and enter the verification code.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-white rounded-lg border flex items-center justify-center">
                        {isEnabling2FA ? (
                          <div className="flex items-center justify-center">
                            <div className="relative flex items-center justify-center h-[24px] w-[24px]">
                              <div className="absolute animate-spin rounded-full border-2 border-primary border-t-transparent h-[24px] w-[24px]"></div>
                              <img
                                src="/minimized-logo.png"
                                alt="Loading"
                                className="h-[18px] w-[18px] animate-logo-beat"
                              />
                            </div>
                          </div>
                        ) : qrCode ? (
                          <img
                            src={`data:image/png;base64,${qrCode}`}
                            alt="Scan QR for 2FA"
                            className="h-32 w-32"
                          />
                        ) : (
                          <QrCode className="h-32 w-32 text-black" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {isEnabling2FA 
                          ? "Please wait while we generate your QR code..."
                          : "Scan this QR code with Google Authenticator, Authy, or similar apps"
                        }
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="verification-code">Verification Code</Label>
                      <Input
                        id="verification-code"
                        value={verificationCode}
                        onChange={e =>
                          setVerificationCode(
                            e.target.value.replace(/\D/g, "").slice(0, 6)
                          )
                        }
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIs2FADialogOpen(false)} className="enhanced-button">
                      Cancel
                    </Button>
                    <Button
                      onClick={handleVerify2FA}
                      disabled={verificationCode.length !== 6}
                      className="enhanced-button"
                    >
                      Enable 2FA
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Actions */}
              <div
                className="flex flex-col sm:flex-row justify-center sm:justify-between gap-4 pt-2 animate-in fade-in slide-in-from-bottom-1 duration-700"
                style={{ animationDelay: "400ms" }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="transition-all duration-300 hover:scale-[1.02] hover:-translate-y-[2px] w-full sm:w-auto"
                >
                  <LogOut className="h-4 w-4 mr-2 animate-icon" />
                  Logout
                </Button>
    
<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogTrigger asChild>
    <Button
      variant="destructive"
      size="sm"
      className="transition-all duration-300 hover:scale-[1.02] hover:-translate-y-[2px] w-full sm:w-auto"
      onClick={handleDeleteAccount}
    >
      <Trash2 className="h-4 w-4 mr-2 animate-icon" />
      Delete Account
    </Button>
  </DialogTrigger>
  <DialogContent>
  <DialogHeader>
    <DialogTitle>Delete Account</DialogTitle>
    <DialogDescription>
      This action will permanently delete your account and all associated data.<br />
      Please type <b>delete</b> to confirm.
    </DialogDescription>
  </DialogHeader>
  {deleteSuccessMessage ? (
    <div className="text-green-600 text-center py-4">{deleteSuccessMessage}</div>
  ) : (
    <>
      <Input
        autoFocus
        value={deleteConfirmText}
        onChange={e => setDeleteConfirmText(e.target.value)}
        placeholder="Type 'delete' to confirm"
        className="my-2"
        disabled={isDeletingAccount}
      />
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setIsDeleteDialogOpen(false)}
          disabled={isDeletingAccount}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={confirmDeleteAccount}
          disabled={deleteConfirmText.trim().toLowerCase() !== "delete" || isDeletingAccount}
        >
          {isDeletingAccount ? (
            <>
              <div className="relative flex items-center justify-center mr-2 h-[24px] w-[24px]">
                <div className="absolute animate-spin rounded-full border-2 border-destructive border-t-transparent h-[24px] w-[24px]"></div>
                <img
                  src="/minimized-logo.png"
                  alt="Deleting"
                  className="h-[18px] w-[18px] animate-logo-beat"
                />
              </div>
              Deleting...
            </>
          ) : (
            "Delete Account"
          )}
        </Button>
      </DialogFooter>
    </>
  )}
</DialogContent>
</Dialog>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>

    {/* Pricing Dialog */}
    <Dialog open={isPricingDialogOpen} onOpenChange={setIsPricingDialogOpen}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 transition-all duration-300 ease-in-out transform scale-100 opacity-100">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold text-center">Choose Your Plan</DialogTitle>
          <DialogDescription className="text-center text-sm">
            Start free, upgrade when you need more
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto px-6 pb-6 max-h-[calc(85vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Pro Plan */}
            <Card className="relative border-blue-200 dark:border-indigo-700/70 shadow-lg flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-xl animate-scale-in" style={{ animationDelay: "100ms" }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-700 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-10">
                Most Popular
              </div>
              <CardContent className="p-5 flex flex-col h-full">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold mb-2">Pro</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold">$99</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-5 text-sm flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>500 analyses/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Up to 25 repos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Exportable error reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Private repositories</span>
                  </li>
                </ul>
                <a
                  href="mailto:contact@stackseek.io?subject=Pro%20Plan%20Upgrade%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-sm h-9 mt-auto">
                    <Mail className="w-3 h-3 mr-1" />
                    Choose Pro
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className="border-gray-100 dark:border-slate-700/60 flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-xl animate-scale-in" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-5 flex flex-col h-full">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold mb-2">Team</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold">$399</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-5 text-sm flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>5,000 analyses/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Up to 150 repos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Priority email support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Exportable reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Advanced replication steps</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Integrations</span>
                  </li>
                </ul>
                <a
                  href="mailto:contact@stackseek.io?subject=Team%20Plan%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full text-sm h-9 mt-auto">
                    <Mail className="w-3 h-3 mr-1" />
                    Contact Sales
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-gray-100 dark:border-slate-700/60 flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-xl animate-scale-in" style={{ animationDelay: "300ms" }}>
              <CardContent className="p-5 flex flex-col h-full">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold mb-2">Enterprise</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold">Custom</span>
                    <span className="text-muted-foreground text-sm"> Plan</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-5 text-sm flex-grow">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited analyses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Unlimited repos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>On-prem / private cloud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Dedicated success manager</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>SSO, audit logs, compliance</span>
                  </li>
                </ul>
                <a
                  href="mailto:contact@stackseek.io?subject=Enterprise%20Plan%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full text-sm h-9 mt-auto">
                    <Mail className="w-3 h-3 mr-1" />
                    Contact Sales
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-4 text-xs text-muted-foreground">
            No credit card required • Free forever for personal use
          </div>
        </div>
      </DialogContent>
    </Dialog>
    
{isLoggingOut && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
    <Card className="w-96">
      <CardContent className="flex flex-col items-center gap-4 p-8">
        <img
          src="/minimized-logo.png"
          alt="Loading"
                          className="h-[18px] w-[18px] object-contain animate-logo-beat"
          
        />
        <div className="text-center">
          <h3 className="font-semibold">Logging out...</h3>
          <p className="text-sm text-muted-foreground">Please wait a moment</p>
        </div>
      </CardContent>
    </Card>
  </div>
)}
</>
  );
}
