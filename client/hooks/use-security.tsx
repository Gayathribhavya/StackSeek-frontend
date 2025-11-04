import { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./use-auth";
import { BASE_URL } from "../../client/config";

export interface SecuritySettings {
  passwordLastChanged: string;
  twoFactorEnabled: boolean;
  twoFactorSetupDate?: string;
  lastLogin: string;
  loginHistory: Array<{
    date: string;
    device: string;
    location: string;
    success: boolean;
  }>;
  securityEvents: Array<{
    date: string;
    type:
      | "password_change"
      | "2fa_enabled"
      | "2fa_disabled"
      | "login_failed"
      | "login_success";
    description: string;
  }>;
  accountCreated: string;
}

interface SecurityContextValue {
  security: SecuritySettings | null;
  loading: boolean;
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  enable2FA: (verificationCode: string) => Promise<void>;
  disable2FA: () => Promise<void>;
  getPasswordAge: () => number;
  getSecurityScore: () => number;
  refreshSecurity: () => Promise<void>;
  setup2FA: () => Promise<{ qrCodeImage: string; secret: string; otpauthUri: string }>;
}

const SecurityContext = createContext<SecurityContextValue | undefined>(
  undefined,
);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [security, setSecurity] = useState<SecuritySettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user security data
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserSecurity();
    } else {
      setSecurity(null);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const getUserStorageKey = () => {
    if (!user) return null;
    return `security_${user.uid || user.email?.replace(/[@.]/g, "_")}`;
  };

  // Fetch security state from backend
  const fetchSecurityFromBackend = async () => {
    try {
      setLoading(true);
      const token = await user.getIdToken();
      const res = await fetch("${BASE_URL}/api/repository/user-security", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch security state from backend");
      const backendSecurity = await res.json();
      setSecurity(backendSecurity as SecuritySettings);
    } catch (error) {
      console.error("Failed to fetch security from backend:", error);
      // fallback to localStorage
      const storageKey = getUserStorageKey();
      if (storageKey) {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          try {
            setSecurity(JSON.parse(stored));
          } catch (e) {
            setSecurity(null);
          }
        } else {
          setSecurity(null);
        }
      } else {
        setSecurity(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserSecurity = async () => {
    await fetchSecurityFromBackend();
  };

  const getDeviceInfo = (): string => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) return "Chrome Browser";
    if (userAgent.includes("Firefox")) return "Firefox Browser";
    if (userAgent.includes("Safari")) return "Safari Browser";
    if (userAgent.includes("Edge")) return "Edge Browser";
    if (userAgent.includes("Mobile")) return "Mobile Device";
    return "Unknown Device";
  };

  const saveSecurity = (updatedSecurity: SecuritySettings) => {
    const storageKey = getUserStorageKey();
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updatedSecurity));
    }
    setSecurity(updatedSecurity);
  };

  const addSecurityEvent = (
    type: SecuritySettings["securityEvents"][0]["type"],
    description: string,
  ) => {
    if (!security) return security;

    const newEvent = {
      date: new Date().toISOString(),
      type,
      description,
    };

    return {
      ...security,
      securityEvents: [newEvent, ...security.securityEvents.slice(0, 19)],
    };
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    if (!security) throw new Error("Security data not loaded");

    // Simulate password validation and update
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const now = new Date().toISOString();
    const updatedSecurity = addSecurityEvent(
      "password_change",
      "Password changed successfully",
    );

    if (updatedSecurity) {
      const finalSecurity = {
        ...updatedSecurity,
        passwordLastChanged: now,
      };
      saveSecurity(finalSecurity);
    }
  };

    // 2FA: Setup (get QR code and secret from backend)
  const setup2FA = async (): Promise<{ qrCodeImage: string; secret: string; otpauthUri: string }> => {
    const token = await user.getIdToken();
    const res = await fetch("${BASE_URL}/api/repository/2fa/setup", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to setup 2FA");
    return await res.json();
  };


   // 2FA: Verify code
  const enable2FA = async (verificationCode: string) => {
    const token = await user.getIdToken();
    const res = await fetch("${BASE_URL}/api/repository/2fa/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: verificationCode }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.message || "Invalid verification code");
    }
    await fetchSecurityFromBackend();
  };

  // 2FA: Disable
  const disable2FA = async () => {
    const token = await user.getIdToken();
    const res = await fetch("${BASE_URL}/api/repository/2fa/disable", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to disable 2FA");
    await fetchSecurityFromBackend();
  };
  const getPasswordAge = (): number => {
    if (!security?.passwordLastChanged) return 0;
    const lastChanged = new Date(security.passwordLastChanged);
    const now = new Date();
    const diffTime = now.getTime() - lastChanged.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Days
  };

  const getSecurityScore = (): number => {
    if (!security) return 0;

    let score = 50; // Base score

    // Password age factor
    const passwordAge = getPasswordAge();
    if (passwordAge < 30) score += 20;
    else if (passwordAge < 90) score += 10;
    else score -= 10;

    // 2FA factor
    if (security.twoFactorEnabled) score += 30;

    // Recent security events (negative events reduce score)
    const events = Array.isArray(security.securityEvents) ? security.securityEvents : [];
    const recentEvents = events.slice(0, 5);
    const failedLogins = recentEvents.filter(
      (e) => e.type === "login_failed",
    ).length;
    score -= failedLogins * 5;

    return Math.max(0, Math.min(100, score));
  };

  const refreshSecurity = async () => {
    await fetchSecurityFromBackend();
  };

 return (
    <SecurityContext.Provider
      value={{
        security,
        loading,
        updatePassword,
        enable2FA,
        disable2FA,
        getPasswordAge,
        getSecurityScore,
        refreshSecurity,
        setup2FA, // <-- add this
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurity must be used within a SecurityProvider");
  }
  return context;
}
