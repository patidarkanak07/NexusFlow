// src/components/RowInspector/InspectorBadge.jsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  Active: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  Failed: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  Completed: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)' },
  Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
};

const InspectorBadge = memo(({ value }) => {
  const cfg = STATUS_CONFIG[value] || { color: '#94a3b8', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };

  return (
    <motion.div
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider"
      style={{
        color: cfg.color,
        backgroundColor: cfg.bg,
        border: `1px solid ${cfg.border}`,
      }}
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 20,
        delay: 0.2
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
      {value}
    </motion.div>
  );
});

InspectorBadge.displayName = 'InspectorBadge';
export default InspectorBadge;
