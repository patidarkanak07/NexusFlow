// src/components/AnomalyDetector/AnomalyPanel.jsx
import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AnomalyDetector.css';

export const AnomalyPanel = memo(({ anomalies = [], onClear, onRowFocus }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const criticalCount = anomalies.filter(
    a => a.severity === 'critical'
  ).length;
  const recentAnomalies = anomalies.slice(-20); // Show last 20

  if (anomalies.length === 0) return null;

  return (
    <motion.div
      className="anomaly-panel"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div 
        className="anomaly-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="anomaly-title">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            🚨
          </motion.span>
          <span>ANOMALIES DETECTED</span>
          <motion.span
            key={anomalies.length}
            initial={{ scale: 1.5, color: '#ef4444' }}
            animate={{ scale: 1, color: '#f1f5f9' }}
            className="anomaly-count-badge"
          >
            {anomalies.length}
          </motion.span>
        </div>
        {criticalCount > 0 && (
          <span className="critical-badge">
            {criticalCount} CRITICAL
          </span>
        )}
      </div>

      {/* Anomaly List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="anomaly-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="max-h-[260px] overflow-y-auto pr-1">
              {recentAnomalies.map((anomaly, i) => (
                <motion.div
                  key={`${anomaly.projectId}-${anomaly.ruleId}-${i}`}
                  className={`anomaly-item severity-${anomaly.severity}`}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => onRowFocus?.(anomaly.projectId)}
                  whileHover={{ x: 4, cursor: 'pointer' }}
                >
                  <span className="anomaly-icon">{anomaly.icon}</span>
                  <div className="anomaly-content">
                    <div className="anomaly-label"
                      style={{ color: anomaly.color }}>
                      {anomaly.label}
                    </div>
                    <div className="anomaly-message">
                      {anomaly.message}
                    </div>
                    <div className="anomaly-project">
                      {anomaly.projectId} — {anomaly.projectName}
                    </div>
                  </div>
                  <span className="anomaly-time font-mono">
                    {new Date(anomaly.timestamp).toLocaleTimeString('en-IN')}
                  </span>
                </motion.div>
              ))}
            </div>

            <button type="button" className="anomaly-clear-btn" onClick={onClear}>
              Clear All Anomalies
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

AnomalyPanel.displayName = 'AnomalyPanel';
export default AnomalyPanel;
