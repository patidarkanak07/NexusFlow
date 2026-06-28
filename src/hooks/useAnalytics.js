// src/hooks/useAnalytics.js
import { useState, useCallback } from 'react';

export const useAnalytics = () => {
  const [analyticsState, setAnalyticsState] = useState({
    isOpen: false,
    frozenData: [],      // Snapshot of data at open time
    frozenAt: null,      // Timestamp
  });

  const openAnalytics = useCallback((currentData) => {
    setAnalyticsState({
      isOpen: true,
      // Deep copy the data at THIS exact moment
      frozenData: currentData.map(row => ({ ...row })),
      frozenAt: new Date().toISOString(),
    });
  }, []);

  const closeAnalytics = useCallback(() => {
    setAnalyticsState(prev => ({
      ...prev,
      isOpen: false,
    }));
    // Small delay before clearing data
    // (allows exit animation to complete)
    setTimeout(() => {
      setAnalyticsState({
        isOpen: false,
        frozenData: [],
        frozenAt: null
      });
    }, 500);
  }, []);

  return { analyticsState, openAnalytics, closeAnalytics };
};
