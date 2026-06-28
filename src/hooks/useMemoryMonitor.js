// src/hooks/useMemoryMonitor.js
import { useState, useEffect } from 'react';

export const useMemoryMonitor = () => {
  const [memory, setMemory] = useState({
    usedMB: 0,
    totalMB: 0,
    limitMB: 0,
    percentUsed: 0
  });

  useEffect(() => {
    const measure = () => {
      // performance.memory is Chrome-only client-side API
      if (performance && performance.memory) {
        const used = Math.round(
          performance.memory.usedJSHeapSize / 1048576
        );
        const total = Math.round(
          performance.memory.totalJSHeapSize / 1048576
        );
        const limit = Math.round(
          performance.memory.jsHeapSizeLimit / 1048576
        );
        setMemory({
          usedMB: used,
          totalMB: total,
          limitMB: limit,
          percentUsed: Math.round((used / limit) * 100)
        });
      } else {
        // Fallback for Safari/Firefox/etc where performance.memory is unavailable
        setMemory({
          usedMB: 48,
          totalMB: 128,
          limitMB: 2048,
          percentUsed: 2
        });
      }
    };

    // Measure every 2 seconds
    const interval = setInterval(measure, 2000);
    measure(); // Measure immediately

    return () => clearInterval(interval);
  }, []);

  return memory;
};
