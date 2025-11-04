"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { SubscriptionProvider } from "../client/hooks/use-subscription";
import { SecurityProvider } from "@/hooks/use-security";
import { NotificationProvider } from "@/hooks/use-notifications";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <SubscriptionProvider>
          <SecurityProvider>
            <NotificationProvider>
              {children}
              <Toaster position="top-right" />
            </NotificationProvider>
          </SecurityProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
