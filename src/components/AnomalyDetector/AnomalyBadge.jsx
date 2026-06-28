// src/components/AnomalyDetector/AnomalyBadge.jsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import './AnomalyDetector.css';

export const AnomalyBadge = memo(({ count, onClick }) => {
  if (!count || count === 0) return null;
  return (
    <motion.button
      type="button"
      className="anomaly-badge-btn"
      onClick={onClick}
      animate={{ 
        boxShadow: [
          '0 0 0px rgba(239,68,68,0)',
          '0 0 12px rgba(239,68,68,0.6)',
          '0 0 0px rgba(239,68,68,0)'
        ]
      }}
      transition={{ duration: 1.5, repeat: Infinity }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      🚨 {count} Anomalies
    </motion.button>
  );
});

AnomalyBadge.displayName = 'AnomalyBadge';
export default AnomalyBadge;
