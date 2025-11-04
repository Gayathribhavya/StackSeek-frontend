import { LogOut, User } from "lucide-react";
// Removed mock API dependency
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BASE_URL } from "../../client/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";

export function UserProfile() {
  const { user, isAuthenticated, logout, getIdToken } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.email);
    }
  }, [user]);

  // If there's no authenticated user, render nothing. This replaces the
  // previous localStorage check with a real auth state check.
  if (!isAuthenticated && !isLoggingOut) return null;

  const handleLogout = async () => {
  setIsLoggingOut(true); // show popup immediately

  try {
    console.log("User profile logout initiated");

    const token = await getIdToken().catch(() => null);

    // 🔑 Delay calling logout until after popup is visible
    setTimeout(async () => {
      const logoutPromise = logout();

      if (token) {
        fetch(
          "${BASE_URL}/api/repository/delete-user-data",
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        ).catch(err => console.log("Cleanup failed:", err));
      }

      await logoutPromise;
      console.log("Logout successful. Redirecting...");
      window.location.href = "/login";
    }, 1000); // wait 1s so popup shows
  } catch (err) {
    console.error("Logout error:", err);
    setIsLoggingOut(false);
  }
};


  const handleProfile = () => {
    // Navigate to profile/settings page
    window.location.href = "/settings";
  };

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full transition-all duration-200 hover:scale-105 enhanced-button"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 animate-in slide-in-from-top-2 duration-200"
        align="end"
        forceMount
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium text-sm">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleProfile}
          className="cursor-pointer transition-colors duration-200"
        >
          <User className="mr-2 h-4 w-4" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive transition-colors duration-200"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    {isLoggingOut &&
  createPortal(
    <div
      className="fixed top-0 left-0 w-screen h-screen 
                 flex items-center justify-center 
                 bg-background/80 backdrop-blur-sm z-[999999]"
    >
      <Card className="w-96 shadow-2xl">
        <CardContent className="flex flex-col items-center gap-4 p-8">
          <img
            src="/sidebar-minimized-logo.png"
            alt="Loading"
            className="h-12 w-12 object-contain animate-pulse"
          />
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <div className="text-center">
            <h3 className="font-semibold">Logging out...</h3>
            <p className="text-sm text-muted-foreground">Please wait a moment</p>
          </div>
        </CardContent>
      </Card>
    </div>,
    document.body
  )
}

    </>
  );
}
