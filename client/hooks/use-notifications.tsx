import { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./use-auth";

export interface NotificationSettings {
  email: {
    enabled: boolean;
    analysisResults: boolean;
    securityAlerts: boolean;
    accountUpdates: boolean;
    marketing: boolean;
    lastUpdated: string;
  };
  push: {
    enabled: boolean;
    permission: "default" | "granted" | "denied";
    analysisComplete: boolean;
    securityAlerts: boolean;
    systemUpdates: boolean;
    lastUpdated: string;
  };
  preferences: {
    frequency: "immediate" | "daily" | "weekly";
    quietHours: {
      enabled: boolean;
      start: string; // "22:00"
      end: string; // "08:00"
    };
    timezone: string;
  };
  history: Array<{
    id: string;
    type: "email" | "push";
    category: string;
    title: string;
    message: string;
    sent: string;
    delivered: boolean;
    read: boolean;
  }>;
  stats: {
    totalSent: number;
    totalDelivered: number;
    totalRead: number;
    lastNotification: string;
  };
}

interface NotificationContextValue {
  notifications: NotificationSettings | null;
  loading: boolean;
  updateEmailPreferences: (
    preferences: Partial<NotificationSettings["email"]>,
  ) => Promise<void>;
  updatePushPreferences: (
    preferences: Partial<NotificationSettings["push"]>,
  ) => Promise<void>;
  requestPushPermission: () => Promise<boolean>;
  sendTestNotification: (type: "email" | "push") => Promise<void>;
  markAsRead: (notificationId: string) => void;
  getUnreadCount: () => number;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] =
    useState<NotificationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user notification settings
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserNotifications();
    } else {
      setNotifications(null);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const getUserStorageKey = () => {
    if (!user) return null;
    return `notifications_${user.uid || user.email?.replace(/[@.]/g, "_")}`;
  };

  const loadUserNotifications = async () => {
    try {
      setLoading(true);
      const storageKey = getUserStorageKey();
      if (!storageKey) return;

      // Load from localStorage first
      const stored = localStorage.getItem(storageKey);
      let userData: Partial<NotificationSettings> = {};

      if (stored) {
        try {
          userData = JSON.parse(stored);
        } catch (e) {
          console.warn("Failed to parse stored notification data");
        }
      }

      // Initialize new user notifications if not exists
      if (!userData.email || !userData.push) {
        const now = new Date().toISOString();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        userData = {
          email: {
            enabled: true,
            analysisResults: true,
            securityAlerts: true,
            accountUpdates: true,
            marketing: false,
            lastUpdated: now,
          },
          push: {
            enabled: false,
            permission: "default",
            analysisComplete: true,
            securityAlerts: true,
            systemUpdates: false,
            lastUpdated: now,
          },
          preferences: {
            frequency: "immediate",
            quietHours: {
              enabled: false,
              start: "22:00",
              end: "08:00",
            },
            timezone,
          },
          history: [
            {
              id: "welcome_" + Date.now(),
              type: "email",
              category: "account",
              title: "Welcome to StackSeek!",
              message: "Your account has been created successfully.",
              sent: now,
              delivered: true,
              read: false,
            },
          ],
          stats: {
            totalSent: 1,
            totalDelivered: 1,
            totalRead: 0,
            lastNotification: now,
          },
        };

        // Save to storage
        localStorage.setItem(storageKey, JSON.stringify(userData));
      }

      // Check current browser push permission
      if ("Notification" in window) {
        userData.push = {
          ...userData.push!,
          permission: Notification.permission,
        };
      }

      setNotifications(userData as NotificationSettings);
    } catch (error) {
      console.error("Failed to load notification data:", error);
      // Fallback to default settings
      const now = new Date().toISOString();
      setNotifications({
        email: {
          enabled: true,
          analysisResults: true,
          securityAlerts: true,
          accountUpdates: true,
          marketing: false,
          lastUpdated: now,
        },
        push: {
          enabled: false,
          permission: "default",
          analysisComplete: true,
          securityAlerts: true,
          systemUpdates: false,
          lastUpdated: now,
        },
        preferences: {
          frequency: "immediate",
          quietHours: {
            enabled: false,
            start: "22:00",
            end: "08:00",
          },
          timezone: "UTC",
        },
        history: [],
        stats: {
          totalSent: 0,
          totalDelivered: 0,
          totalRead: 0,
          lastNotification: now,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = (updatedNotifications: NotificationSettings) => {
    const storageKey = getUserStorageKey();
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updatedNotifications));
    }
    setNotifications(updatedNotifications);
  };

  const addNotificationToHistory = (
    type: "email" | "push",
    category: string,
    title: string,
    message: string,
  ) => {
    if (!notifications) return notifications;

    const newNotification = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      category,
      title,
      message,
      sent: new Date().toISOString(),
      delivered: true,
      read: false,
    };

    return {
      ...notifications,
      history: [newNotification, ...notifications.history.slice(0, 49)], // Keep last 50
      stats: {
        ...notifications.stats,
        totalSent: notifications.stats.totalSent + 1,
        totalDelivered: notifications.stats.totalDelivered + 1,
        lastNotification: newNotification.sent,
      },
    };
  };

  const updateEmailPreferences = async (
    preferences: Partial<NotificationSettings["email"]>,
  ) => {
    if (!notifications) throw new Error("Notification data not loaded");

    const updatedNotifications = {
      ...notifications,
      email: {
        ...notifications.email,
        ...preferences,
        lastUpdated: new Date().toISOString(),
      },
    };

    saveNotifications(updatedNotifications);

    // Add event to history
    const eventNotifications = addNotificationToHistory(
      "email",
      "settings",
      "Email preferences updated",
      "Your email notification preferences have been updated.",
    );

    if (eventNotifications) {
      saveNotifications(eventNotifications);
    }
  };

  const updatePushPreferences = async (
    preferences: Partial<NotificationSettings["push"]>,
  ) => {
    if (!notifications) throw new Error("Notification data not loaded");

    const updatedNotifications = {
      ...notifications,
      push: {
        ...notifications.push,
        ...preferences,
        lastUpdated: new Date().toISOString(),
      },
    };

    saveNotifications(updatedNotifications);

    // Add event to history
    const eventNotifications = addNotificationToHistory(
      "push",
      "settings",
      "Push preferences updated",
      "Your push notification preferences have been updated.",
    );

    if (eventNotifications) {
      saveNotifications(eventNotifications);
    }
  };

  const requestPushPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      throw new Error("This browser does not support notifications");
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied") {
      throw new Error(
        "Notifications are blocked. Please enable them in your browser settings.",
      );
    }

    try {
      const permission = await Notification.requestPermission();

      if (notifications) {
        const updatedNotifications = {
          ...notifications,
          push: {
            ...notifications.push,
            permission,
            enabled: permission === "granted",
            lastUpdated: new Date().toISOString(),
          },
        };

        saveNotifications(updatedNotifications);

        if (permission === "granted") {
          // Add success notification to history
          const eventNotifications = addNotificationToHistory(
            "push",
            "settings",
            "Push notifications enabled",
            "Browser push notifications have been enabled successfully.",
          );

          if (eventNotifications) {
            saveNotifications(eventNotifications);
          }
        }
      }

      return permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      throw new Error("Failed to request notification permission");
    }
  };

  const sendTestNotification = async (type: "email" | "push") => {
    if (!notifications) throw new Error("Notification data not loaded");

    if (type === "push") {
      if (!("Notification" in window)) {
        throw new Error("This browser does not support push notifications");
      }

      if (Notification.permission !== "granted") {
        throw new Error("Push notifications are not enabled");
      }

      // Send browser notification
      new Notification("StackSeek Test Notification", {
        body: "This is a test push notification from StackSeek.",
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }

    // Add to history
    const eventNotifications = addNotificationToHistory(
      type,
      "test",
      `Test ${type} notification`,
      `This is a test ${type} notification from StackSeek.`,
    );

    if (eventNotifications) {
      saveNotifications(eventNotifications);
    }
  };

  const markAsRead = (notificationId: string) => {
    if (!notifications) return;

    const updatedHistory = notifications.history.map((notif) =>
      notif.id === notificationId ? { ...notif, read: true } : notif,
    );

    const updatedNotifications = {
      ...notifications,
      history: updatedHistory,
      stats: {
        ...notifications.stats,
        totalRead: updatedHistory.filter((n) => n.read).length,
      },
    };

    saveNotifications(updatedNotifications);
  };

  const getUnreadCount = (): number => {
    if (!notifications) return 0;
    return notifications.history.filter((notif) => !notif.read).length;
  };

  const refreshNotifications = async () => {
    await loadUserNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        updateEmailPreferences,
        updatePushPreferences,
        requestPushPermission,
        sendTestNotification,
        markAsRead,
        getUnreadCount,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
