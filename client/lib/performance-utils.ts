/**
 * Performance utilities to help prevent ResizeObserver loops and layout thrashing
 */
import React from 'react';

// Throttle utility for expensive operations
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Debounce utility for rapid events
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null;
  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

// Performance-aware ResizeObserver wrapper
export function createOptimizedResizeObserver(
  callback: ResizeObserverCallback,
  options?: {
    throttleMs?: number;
    debounceMs?: number;
  }
) {
  const { throttleMs = 16, debounceMs = 10 } = options || {};
  
  // Create throttled and debounced version of the callback
  const optimizedCallback = debounce(
    throttle(callback, throttleMs),
    debounceMs
  );

  return new ResizeObserver(optimizedCallback);
}

// React hook for optimized resize observation
export function useOptimizedResizeObserver(
  callback: ResizeObserverCallback,
  options?: {
    throttleMs?: number;
    debounceMs?: number;
  }
) {
  const [observer] = React.useState(() => 
    createOptimizedResizeObserver(callback, options)
  );

  React.useEffect(() => {
    return () => {
      observer.disconnect();
    };
  }, [observer]);

  return observer;
}

// Layout stability utilities
export const layoutOptimizations = {
  // CSS properties that help prevent layout thrashing
  containment: {
    contain: 'layout style paint',
    willChange: 'transform, opacity, width, height',
  },
  
  // Hardware acceleration
  hardwareAcceleration: {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden' as const,
    perspective: 1000,
  },
  
  // Smooth transitions that reduce layout recalculation
  smoothTransitions: {
    transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
    transitionProperty: 'transform, opacity',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease-out',
  },
} as const;

// Debug utility to track ResizeObserver performance
export function trackResizeObserverPerformance(name: string) {
  if (process.env.NODE_ENV !== 'development') return () => {};
  
  let count = 0;
  let lastTime = performance.now();
  
  return () => {
    count++;
    const now = performance.now();
    const timeSinceLastCall = now - lastTime;
    
    if (timeSinceLastCall < 16) { // Less than 1 frame (60fps)
      console.warn(
        `[ResizeObserver] ${name}: Rapid resize events detected (${count} calls in ${timeSinceLastCall.toFixed(2)}ms)`
      );
    }
    
    lastTime = now;
  };
}
