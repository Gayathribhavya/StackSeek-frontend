import {
  LayoutDashboard,
  Database,
  Link,
  Settings as SettingsIcon,
} from "lucide-react";

export interface NavigationItem {
  icon: any;
  label: string;
  href: string;
  onClick?: (e: React.MouseEvent) => void;
  isActive?: boolean;
  iconBg: string;
  iconColor: string;
  hoverBg: string;
}

export const createNavigationItems = (
  currentPath: string,
  handleNavigation?: (url: string, event?: React.MouseEvent) => void,
): NavigationItem[] => {
  return [
    {
      icon: LayoutDashboard,
      label: "Error Analysis",
      href: "/dashboard",
      onClick: handleNavigation
        ? (e: React.MouseEvent) => handleNavigation("/dashboard", e)
        : undefined,
      isActive: currentPath === "/dashboard",
      iconBg: "bg-gradient-to-br from-gray-500/10 to-slate-500/10",
      iconColor: "text-black dark:text-blue-500",
      hoverBg: "hover:bg-gray-50 dark:hover:bg-gray-950/30",
    },
    {
      icon: Database,
      label: "Connected Repositories",
      href: "/connected-repositories",
      onClick: handleNavigation
        ? (e: React.MouseEvent) =>
            handleNavigation("/connected-repositories", e)
        : undefined,
      isActive: currentPath === "/connected-repositories",
      iconBg: "bg-gradient-to-br from-gray-500/10 to-slate-500/10",
      iconColor: "text-black dark:text-blue-500",
      hoverBg: "hover:bg-gray-50 dark:hover:bg-gray-950/30",
    },
    {
      icon: Link,
      label: "Connect Repository",
      href: "/connect-repository",
      onClick: handleNavigation
        ? (e: React.MouseEvent) => handleNavigation("/connect-repository", e)
        : undefined,
      isActive: currentPath === "/connect-repository",
      iconBg: "bg-gradient-to-br from-gray-500/10 to-slate-500/10",
      iconColor: "text-black dark:text-blue-500",
      hoverBg: "hover:bg-gray-50 dark:hover:bg-gray-950/30",
    },
    {
      icon: SettingsIcon,
      label: "Settings",
      href: "/settings",
      onClick: handleNavigation
        ? (e: React.MouseEvent) => handleNavigation("/settings", e)
        : undefined,
      isActive: currentPath === "/settings",
      iconBg: "bg-gradient-to-br from-gray-500/10 to-slate-500/10",
      iconColor: "text-black dark:text-blue-500",
      hoverBg: "hover:bg-gray-50 dark:hover:bg-gray-950/30",
    },
  ];
};
