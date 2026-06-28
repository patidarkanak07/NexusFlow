// src/hooks/useExport.js
import { useState, useCallback } from 'react';
import { arrayToCSV, downloadFile, getExportTimestamp } from '../utils/exportHelpers.js';
import { detectAnomalies } from '../utils/anomalyRules.js';

export const useExport = ({ viewPool = [], anomalies = [] }) => {
  const [lastExport, setLastExport] = useState(null);

  const exportCSV = useCallback(() => {
    const csv = arrayToCSV(viewPool);
    const filename = `nexusflow-export-${getExportTimestamp()}.csv`;
    downloadFile(csv, filename, 'text/csv;charset=utf-8;');
    setLastExport({ type: 'CSV', count: viewPool.length, filename });
  }, [viewPool]);

  const exportJSON = useCallback(() => {
    const json = JSON.stringify(viewPool, null, 2);
    const filename = `nexusflow-export-${getExportTimestamp()}.json`;
    downloadFile(json, filename, 'application/json');
    setLastExport({ type: 'JSON', count: viewPool.length, filename });
  }, [viewPool]);

  const exportAnomalies = useCallback(() => {
    const anomalyRows = viewPool.filter(row => 
      detectAnomalies(row).length > 0
    );
    const csv = arrayToCSV(anomalyRows);
    const filename = `nexusflow-anomalies-${getExportTimestamp()}.csv`;
    downloadFile(csv, filename, 'text/csv;charset=utf-8;');
    setLastExport({ 
      type: 'Anomalies CSV', 
      count: anomalyRows.length, 
      filename 
    });
  }, [viewPool]);

  const clearLastExport = useCallback(() => {
    setLastExport(null);
  }, []);

  return { exportCSV, exportJSON, exportAnomalies, lastExport, clearLastExport };
};
