// src/hooks/useMemoryMonitor.js
import { useState, useEffect, useRef } from 'react';

/**
 * Monitors JS heap memory usage via performance.memory API.
 * Falls back to null on browsers that don't support it.
 * Samples every 2 seconds to avoid performance overhead.
 */
export const useMemoryMonitor = () => {
  const [memory, setMemory] = useState(null);
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const sample = () => {
      if (!mountedRef.current) return;
      try {
        if (performance.memory) {
          setMemory({
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
          });
        }
      } catch {
        // performance.memory not available
      }
    };

    sample();
    intervalRef.current = setInterval(sample, 2000);

    return () => {
      mountedRef.current = false;
      clearInterval(intervalRef.current);
    };
  }, []);

  return memory;
};
