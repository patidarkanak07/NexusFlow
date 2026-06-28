// src/hooks/useAnomalyDetector.js
import { useState, useCallback } from 'react';
import { detectAnomalies } from '../utils/anomalyRules.js';

export const useAnomalyDetector = () => {
  const [anomalies, setAnomalies] = useState([]);

  const scanRow = useCallback((row) => {
    const rowAnomalies = detectAnomalies(row);
    if (rowAnomalies.length > 0) {
      setAnomalies(prev => {
        const next = [...prev, ...rowAnomalies];
        // Cap anomalies list size to prevent memory leaks
        return next.slice(-200);
      });
    }
  }, []);

  const clearAnomalies = useCallback(() => {
    setAnomalies([]);
  }, []);

  return { anomalies, scanRow, clearAnomalies, setAnomalies };
};
