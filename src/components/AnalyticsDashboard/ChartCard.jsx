// src/components/AnalyticsDashboard/ChartCard.jsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';

const ChartCard = memo(({ title, children, delay = 0 }) => {
  return (
    <motion.div
      className="chart-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{
        boxShadow: '0 0 30px rgba(59,130,246,0.15)',
        borderColor: 'rgba(59,130,246,0.4)',
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      <div className="chart-card-header">
        <span className="chart-card-dot" />
        <span className="chart-card-title">{title}</span>
      </div>
      <div className="chart-card-body">
        {children}
      </div>
    </motion.div>
  );
});

ChartCard.displayName = 'ChartCard';
export default ChartCard;
