'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production and on client side
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') {
      return;
    }

    const metrics: Partial<PerformanceMetrics> = {};

    // Measure Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              metrics.fcp = entry.startTime;
            }
            break;
          case 'largest-contentful-paint':
            metrics.lcp = entry.startTime;
            break;
          case 'first-input':
            metrics.fid = (entry as any).processingStart - entry.startTime;
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value;
            }
            break;
        }
      }
    });

    // Observe performance entries
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.warn('Performance monitoring not fully supported');
    }

    // Measure TTFB
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
    }

    // Log performance metrics after page load
    const logMetrics = () => {
      console.group('🚀 Performance Metrics');
      console.log('First Contentful Paint (FCP):', metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'Not measured');
      console.log('Largest Contentful Paint (LCP):', metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'Not measured');
      console.log('First Input Delay (FID):', metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'Not measured');
      console.log('Cumulative Layout Shift (CLS):', metrics.cls ? metrics.cls.toFixed(4) : 'Not measured');
      console.log('Time to First Byte (TTFB):', metrics.ttfb ? `${metrics.ttfb.toFixed(2)}ms` : 'Not measured');
      
      // Performance recommendations
      if (metrics.lcp && metrics.lcp > 2500) {
        console.warn('⚠️ LCP is slow (>2.5s). Consider optimizing images and reducing server response time.');
      }
      if (metrics.fid && metrics.fid > 100) {
        console.warn('⚠️ FID is slow (>100ms). Consider reducing JavaScript execution time.');
      }
      if (metrics.cls && metrics.cls > 0.1) {
        console.warn('⚠️ CLS is high (>0.1). Consider setting dimensions for images and avoiding dynamic content insertion.');
      }
      console.groupEnd();
    };

    // Log metrics after a delay to ensure all measurements are captured
    setTimeout(logMetrics, 3000);

    return () => {
      observer.disconnect();
    };
  }, []);

  // This component doesn't render anything
  return null;
}

// Hook for measuring custom performance metrics
export function usePerformanceMetric(name: string) {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      }
      
      // Mark the performance for potential analysis
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    };
  }, [name]);

  // Mark the start of the metric
  useEffect(() => {
    performance.mark(`${name}-start`);
  }, [name]);
}
