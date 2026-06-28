// src/components/AnalyticsDashboard/AnalyticsHeader.jsx
import React, { memo, useCallback } from 'react';
import { BarChart2, Download, X } from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsHeader = memo(({ frozenAt, rowCount, pauseQueueSize, onClose }) => {
  
  const handleExport = useCallback(() => {
    // Finds the first canvas or combine chart canvases in dashboard overlay
    const canvas = document.querySelector('.analytics-overlay canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `nexusflow-analytics-snapshot-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } else {
      alert('Exporter: No active analytics chart canvas found to export.');
    }
  }, []);

  return (
    <div className="analytics-header">
      {/* Moving scan line */}
      <div className="analytics-scanline" />

      <div className="analytics-header-left">
        <div className="analytics-title">
          <BarChart2 size={18} className="text-accent-cyan" />
          <span>NEXUSFLOW ANALYTICS</span>
          <span className="analytics-subtitle">Data Intelligence Terminal</span>
        </div>
        <div className="analytics-meta">
          <span>📊 Snapshot: {rowCount.toLocaleString('en-IN')} rows</span>
          <span>🕐 Frozen at: {new Date(frozenAt).toLocaleTimeString('en-IN')}</span>
          <span>📥 Buffer: {pauseQueueSize} pending records</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          type="button"
          className="export-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleExport}
        >
          <Download size={13} />
          <span>Export PNG</span>
        </motion.button>

        <motion.button
          type="button"
          className="analytics-close-btn"
          whileHover={{ 
            scale: 1.1,
            backgroundColor: 'rgba(239,68,68,0.2)',
            borderColor: 'rgba(239,68,68,0.5)'
          }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          aria-label="Close Analytics [ESC]"
        >
          <X size={15} />
        </motion.button>
      </div>
    </div>
  );
});

AnalyticsHeader.displayName = 'AnalyticsHeader';
export default AnalyticsHeader;
