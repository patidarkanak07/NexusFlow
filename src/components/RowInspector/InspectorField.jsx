// src/components/RowInspector/InspectorField.jsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '../KPIStrip/AnimatedCounter.jsx';
import { formatDate } from '../../utils/formatters.js';
import InspectorBadge from './InspectorBadge.jsx';

const InspectorField = memo(({ label, value, type }) => {
  const renderValue = () => {
    switch (type) {
      case 'currency':
        return (
          <span className="text-white font-mono font-bold">
            <AnimatedCounter
              value={parseFloat(value)}
              prefix="$"
            />
          </span>
        );

      case 'percent':
        const num = parseFloat(value);
        return (
          <span className="font-mono font-bold" style={{ color: num >= 0 ? '#22c55e' : '#ef4444' }}>
            {num >= 0 ? '▲' : '▼'} {Math.abs(num).toFixed(2)}%
          </span>
        );

      case 'status':
        return <InspectorBadge value={value} />;

      case 'date':
        return (
          <span className="text-white font-mono">
            {formatDate(value)}
          </span>
        );

      case 'number':
        return (
          <span className="text-white font-mono font-bold">
            <AnimatedCounter value={parseInt(value)} />
          </span>
        );

      case 'text':
      default:
        return <span className="text-white font-mono">{value || '—'}</span>;
    }
  };

  return (
    <motion.div
      className="inspector-field"
      whileHover={{
        backgroundColor: 'rgba(59,130,246,0.05)',
        x: 4
      }}
      transition={{ duration: 0.15 }}
    >
      <span className="field-label">{label}</span>
      <span className="field-value">{renderValue()}</span>
    </motion.div>
  );
});

InspectorField.displayName = 'InspectorField';
export default InspectorField;
