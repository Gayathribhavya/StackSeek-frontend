import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Check if this is a Firebase network error
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("Firebase") ||
      error.message?.includes("auth/network-request-failed")
    ) {
      console.warn(
        "🛡️ Error boundary caught Firebase network error:",
        error.message,
      );
      // Firebase error handling
    }

    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 Error boundary caught error:", error, errorInfo);

    // Log Firebase-specific errors differently
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("Firebase")
    ) {
      console.warn("🔥 Firebase network error detected");
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            reset={() => this.setState({ hasError: false, error: null })}
          />
        );
      }

      // Default fallback for Firebase errors
      if (
        this.state.error?.message?.includes("Failed to fetch") ||
        this.state.error?.message?.includes("Firebase")
      ) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-6 max-w-md">
              <h2 className="text-xl font-semibold mb-4">Connection Issue</h2>
              <p className="text-muted-foreground mb-4">
                We're having trouble connecting to our authentication service.
                Please check your internet connection and try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 enhanced-button primary-gradient text-white rounded border-0"
              >
                Try Again
              </button>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-6 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 enhanced-button primary-gradient text-white rounded border-0"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handler for unhandled promises
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason?.message?.includes("Failed to fetch") ||
      event.reason?.message?.includes("Firebase") ||
      event.reason?.code === "auth/network-request-failed"
    ) {
      console.warn("🛡️ Caught unhandled Firebase network error:", event.reason);
      // Firebase network error logged
      event.preventDefault(); // Prevent the error from showing in console
    }
  });
}
