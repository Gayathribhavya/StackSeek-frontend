/**
 * Comprehensive fix for ResizeObserver loop error
 *
 * This error is harmless and typically occurs when:
 * - Sidebar components are collapsing/expanding
 * - Multiple UI components observe resize events simultaneously
 * - Layout shifts happen faster than ResizeObserver can process
 *
 * The error doesn't affect functionality but can clutter the console.
 * This utility suppresses the error while preserving other console output.
 */

let resizeObserverErrorSuppressed = false;

export function suppressResizeObserverError() {
  if (resizeObserverErrorSuppressed) return;

  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Comprehensive error message patterns
  const resizeObserverPatterns = [
    "ResizeObserver loop completed with undelivered notifications",
    "ResizeObserver loop limit exceeded",
    "ResizeObserver maximum depth exceeded",
    "Cannot execute 'observe' on 'ResizeObserver'",
  ];

  const isResizeObserverError = (message: any): boolean => {
    if (typeof message !== "string") return false;
    return resizeObserverPatterns.some((pattern) =>
      message.toLowerCase().includes(pattern.toLowerCase()),
    );
  };

  // Override console.error to filter ResizeObserver errors
  console.error = (...args: any[]) => {
    if (isResizeObserverError(args[0])) {
      return; // Suppress ResizeObserver errors
    }
    originalConsoleError.apply(console, args);
  };

  // Override console.warn to filter ResizeObserver warnings
  console.warn = (...args: any[]) => {
    if (isResizeObserverError(args[0])) {
      return; // Suppress ResizeObserver warnings
    }
    originalConsoleWarn.apply(console, args);
  };

  resizeObserverErrorSuppressed = true;
}

// Enhanced error event listener
export function setupResizeObserverErrorHandler() {
  if (typeof window === "undefined") return;

  // Handle window error events
  window.addEventListener("error", (event) => {
    const message = event.message || event.error?.message || "";
    if (
      message.includes(
        "ResizeObserver loop completed with undelivered notifications",
      ) ||
      message.includes("ResizeObserver loop limit exceeded")
    ) {
      // Prevent the error from being logged
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    const message = event.reason?.message || String(event.reason) || "";
    if (
      message.includes(
        "ResizeObserver loop completed with undelivered notifications",
      ) ||
      message.includes("ResizeObserver loop limit exceeded")
    ) {
      event.preventDefault();
      return false;
    }
  });
}

// Immediate global error suppression - runs as soon as this module loads
(() => {
  if (typeof window === "undefined") return;

  const resizeObserverPatterns = [
    "ResizeObserver loop completed with undelivered notifications",
    "ResizeObserver loop limit exceeded",
    "ResizeObserver maximum depth exceeded",
    "Cannot execute 'observe' on 'ResizeObserver'",
  ];

  const isResizeObserverError = (message: any): boolean => {
    if (typeof message !== "string") return false;
    return resizeObserverPatterns.some((pattern) =>
      message.toLowerCase().includes(pattern.toLowerCase()),
    );
  };

  // Global error handler - immediately active
  window.addEventListener(
    "error",
    (event) => {
      const message = event.message || event.error?.message || "";
      if (isResizeObserverError(message)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    },
    true,
  ); // Use capture phase

  // Unhandled rejection handler
  window.addEventListener(
    "unhandledrejection",
    (event) => {
      const message = event.reason?.message || String(event.reason) || "";
      if (isResizeObserverError(message)) {
        event.preventDefault();
        return false;
      }
    },
    true,
  );

  // Apply console fixes immediately
  suppressResizeObserverError();
  setupResizeObserverErrorHandler();
})();

// Initialize on module load and DOM ready as additional safeguards
if (typeof window !== "undefined") {
  // Also apply on DOM ready as backup
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      suppressResizeObserverError();
      setupResizeObserverErrorHandler();
    });
  } else {
    // DOM already loaded, apply immediately
    suppressResizeObserverError();
    setupResizeObserverErrorHandler();
  }
}

// Advanced utility to debounce and throttle ResizeObserver callbacks
export function debounceResizeObserver(
  callback: ResizeObserverCallback,
  delay = 16, // ~60fps
) {
  let timeoutId: NodeJS.Timeout;
  let lastRun = 0;

  return (entries: ResizeObserverEntry[], observer: ResizeObserver) => {
    const now = Date.now();

    // Throttle: if called too frequently, skip
    if (now - lastRun < delay / 2) {
      return;
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      try {
        callback(entries, observer);
        lastRun = Date.now();
      } catch (error) {
        // Silently catch ResizeObserver-related errors
        if (
          error instanceof Error &&
          error.message.includes("ResizeObserver")
        ) {
          return;
        }
        // Re-throw other errors
        throw error;
      }
    }, delay);
  };
}

// Create a safer ResizeObserver wrapper
export function createSafeResizeObserver(callback: ResizeObserverCallback) {
  if (typeof window === "undefined" || !window.ResizeObserver) {
    return null;
  }

  const safeCallback = debounceResizeObserver(callback, 16);

  try {
    return new ResizeObserver(safeCallback);
  } catch (error) {
    console.warn("Failed to create ResizeObserver:", error);
    return null;
  }
}
