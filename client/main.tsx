// Apply ResizeObserver fix immediately before any other imports
import {
  suppressResizeObserverError,
  setupResizeObserverErrorHandler,
} from "./lib/resize-observer-fix";
suppressResizeObserverError();
setupResizeObserverErrorHandler();

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "./components/theme-provider";
import { TooltipProvider } from "./components/ui/tooltip";
import TopUsers from "./components/TopUsers";
import "./global.css";

import { AuthProvider } from "./hooks/use-auth";
import { SubscriptionProvider } from "./hooks/use-subscription";
import { SecurityProvider } from "./hooks/use-security";
import { NotificationProvider } from "./hooks/use-notifications";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="stackseek-ui-theme">
      <TooltipProvider delayDuration={100} skipDelayDuration={500}>
        {/* Provide global authentication context to all client pages. */}
        <AuthProvider>
          <SubscriptionProvider>
            <SecurityProvider>
              <NotificationProvider>
                <App />
                <TopUsers />
              </NotificationProvider>
            </SecurityProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
