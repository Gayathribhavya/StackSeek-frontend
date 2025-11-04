/**
 * Immediate ResizeObserver error suppression
 * This script runs before any React components load to catch ResizeObserver errors
 */

(function () {
  "use strict";

  if (typeof window === "undefined") return;

  const resizeObserverPatterns = [
    "ResizeObserver loop completed with undelivered notifications",
    "ResizeObserver loop limit exceeded",
    "ResizeObserver maximum depth exceeded",
    "Cannot execute 'observe' on 'ResizeObserver'",
    "ResizeObserver",
  ];

  function isResizeObserverError(message) {
    if (typeof message !== "string") return false;
    return resizeObserverPatterns.some(function (pattern) {
      return message.toLowerCase().indexOf(pattern.toLowerCase()) !== -1;
    });
  }

  // Store original console methods
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalLog = console.log;

  // Override console methods immediately
  console.error = function () {
    if (arguments.length > 0 && isResizeObserverError(arguments[0])) {
      return; // Suppress ResizeObserver errors
    }
    originalError.apply(console, arguments);
  };

  console.warn = function () {
    if (arguments.length > 0 && isResizeObserverError(arguments[0])) {
      return; // Suppress ResizeObserver warnings
    }
    originalWarn.apply(console, arguments);
  };

  // Global error event handler with immediate effect
  window.addEventListener(
    "error",
    function (event) {
      const message =
        event.message || (event.error && event.error.message) || "";
      if (isResizeObserverError(message)) {
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) {
          event.stopImmediatePropagation();
        }
        return false;
      }
    },
    true,
  );

  // Unhandled promise rejection handler
  window.addEventListener(
    "unhandledrejection",
    function (event) {
      const message =
        (event.reason && event.reason.message) || String(event.reason || "");
      if (isResizeObserverError(message)) {
        event.preventDefault();
        return false;
      }
    },
    true,
  );

  // Try to suppress at the source if ResizeObserver exists
  if (window.ResizeObserver) {
    const OriginalResizeObserver = window.ResizeObserver;

    window.ResizeObserver = function (callback) {
      const wrappedCallback = function (entries, observer) {
        try {
          callback(entries, observer);
        } catch (error) {
          if (!isResizeObserverError(error.message)) {
            throw error; // Re-throw non-ResizeObserver errors
          }
          // Silently catch ResizeObserver errors
        }
      };

      return new OriginalResizeObserver(wrappedCallback);
    };

    // Copy static properties
    Object.setPrototypeOf(window.ResizeObserver, OriginalResizeObserver);
    Object.defineProperty(window.ResizeObserver, "prototype", {
      value: OriginalResizeObserver.prototype,
      writable: false,
    });
  }

  // Mark as applied
  window.__resizeObserverErrorSuppressed = true;
})();
