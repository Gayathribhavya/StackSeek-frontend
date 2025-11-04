import { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "./use-auth";

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: "free_trial" | "pro" | "enterprise";
  analysisLimit: number;
  features: {
    aiSolutions: boolean;
    prioritySupport: boolean;
    exportReports: boolean;
    customIntegrations: boolean;
  };
  price?: {
    monthly: number;
    yearly: number;
  };
}

export interface UserSubscription {
  plan: SubscriptionPlan;
  analysisUsed: number;
  trialStartDate?: string;
  trialEndDate?: string;
  subscriptionDate?: string;
  lastAnalysisDate?: string;
  analysisHistory: Array<{
    date: string;
    type: string;
    repositoryId?: string;
  }>;
}

interface SubscriptionContextValue {
  subscription: UserSubscription | null;
  loading: boolean;
  incrementAnalysisUsage: (type: string, repositoryId?: string) => void;
  getRemainingAnalyses: () => number;
  canUseFeature: (feature: keyof SubscriptionPlan["features"]) => boolean;
  getTrialDaysRemaining: () => number;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined,
);

// Available subscription plans
const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free_trial: {
    id: "free_trial",
    name: "Free Trial",
    type: "free_trial",
    analysisLimit: 10,
    features: {
      aiSolutions: true,
      prioritySupport: false,
      exportReports: false,
      customIntegrations: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    type: "pro",
    analysisLimit: 100,
    features: {
      aiSolutions: true,
      prioritySupport: true,
      exportReports: true,
      customIntegrations: false,
    },
    price: {
      monthly: 29,
      yearly: 299,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    type: "enterprise",
    analysisLimit: 1000,
    features: {
      aiSolutions: true,
      prioritySupport: true,
      exportReports: true,
      customIntegrations: true,
    },
    price: {
      monthly: 99,
      yearly: 999,
    },
  },
};

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // Load user subscription data
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const getUserStorageKey = () => {
    if (!user) return null;
    return `subscription_${user.uid || user.email?.replace(/[@.]/g, "_")}`;
  };

  const loadUserSubscription = async () => {
    try {
      setLoading(true);
      const storageKey = getUserStorageKey();
      if (!storageKey) return;

      // Load from localStorage first
      const stored = localStorage.getItem(storageKey);
      let userData: Partial<UserSubscription> = {};

      if (stored) {
        try {
          userData = JSON.parse(stored);
        } catch (e) {
          console.warn("Failed to parse stored subscription data");
        }
      }

      // Initialize new user subscription if not exists
      if (!userData.plan) {
        const trialStart = new Date();
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 14); // 14-day trial

        userData = {
          plan: SUBSCRIPTION_PLANS.free_trial,
          analysisUsed: 0,
          trialStartDate: trialStart.toISOString(),
          trialEndDate: trialEnd.toISOString(),
          analysisHistory: [],
        };

        // Save to storage
        localStorage.setItem(storageKey, JSON.stringify(userData));
      }

      // Ensure plan object is complete (in case of stored data with old structure)
      const planId = userData.plan?.id || "free_trial";
      userData.plan = SUBSCRIPTION_PLANS[planId];

      setSubscription(userData as UserSubscription);
    } catch (error) {
      console.error("Failed to load subscription data:", error);
      // Fallback to default free trial
      setSubscription({
        plan: SUBSCRIPTION_PLANS.free_trial,
        analysisUsed: 0,
        trialStartDate: new Date().toISOString(),
        trialEndDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        analysisHistory: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSubscription = (updatedSubscription: UserSubscription) => {
    const storageKey = getUserStorageKey();
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updatedSubscription));
    }
    setSubscription(updatedSubscription);
  };

  const incrementAnalysisUsage = (type: string, repositoryId?: string) => {
    if (!subscription) return;

    const analysisEntry = {
      date: new Date().toISOString(),
      type,
      repositoryId,
    };

    const updatedSubscription: UserSubscription = {
      ...subscription,
      analysisUsed: subscription.analysisUsed + 1,
      lastAnalysisDate: analysisEntry.date,
      analysisHistory: [...subscription.analysisHistory, analysisEntry],
    };

    saveSubscription(updatedSubscription);
  };

  const getRemainingAnalyses = (): number => {
    if (!subscription) return 0;
    return Math.max(
      0,
      subscription.plan.analysisLimit - subscription.analysisUsed,
    );
  };

  const canUseFeature = (
    feature: keyof SubscriptionPlan["features"],
  ): boolean => {
    if (!subscription) return false;
    return subscription.plan.features[feature];
  };

  const getTrialDaysRemaining = (): number => {
    if (!subscription?.trialEndDate) return 0;
    const endDate = new Date(subscription.trialEndDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const refreshSubscription = async () => {
    await loadUserSubscription();
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        incrementAnalysisUsage,
        getRemainingAnalyses,
        canUseFeature,
        getTrialDaysRemaining,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider",
    );
  }
  return context;
}

// Utility function to track analysis usage from anywhere in the app
export function trackAnalysisUsage(type: string, repositoryId?: string) {
  // This can be called from components that don't have access to the hook
  const event = new CustomEvent("trackAnalysis", {
    detail: { type, repositoryId },
  });
  window.dispatchEvent(event);
}
