// src/components/KPIStrip/KPICard.jsx
import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter.jsx';
import Sparkline from '../Sparkline/Sparkline.jsx';

const KPICard = memo(({
  label,
  value,
  prefix = '',
  suffix = '',
  icon: Icon,
  color,
  history = [],
  index = 0,
}) => {
  const bgGradient = useMemo(() => ({
    background: `linear-gradient(135deg, ${color}22, transparent)`,
  }), [color]);

  const iconBg = useMemo(() => ({
    background: `${color}22`,
    color,
  }), [color]);

  const borderStyle = useMemo(() => ({
    borderColor: `${color}44`,
  }), [color]);

  const accentStyle = useMemo(() => ({
    background: `linear-gradient(90deg, ${color}, ${color}66)`,
  }), [color]);

  return (
    <motion.div
      className="kpi-card card-glow"
      style={borderStyle}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -2 }}
    >
      {/* Gradient background overlay */}
      <div className="kpi-gradient-overlay" style={bgGradient} />

      {/* Header row */}
      <div className="kpi-card-header">
        <div className="kpi-icon-wrap" style={iconBg}>
          <Icon size={16} />
        </div>
        <div className="kpi-label">{label}</div>
      </div>

      {/* Value + sparkline */}
      <div className="kpi-value-row">
        <div className="kpi-value" style={{ color }}>
          <AnimatedCounter value={value} prefix={prefix} suffix={suffix} />
        </div>
        <div className="kpi-sparkline">
          <Sparkline data={history} color={color} width={72} height={28} />
        </div>
      </div>

      {/* Footer */}
      <div className="kpi-footer">
        <div className="kpi-trend" style={{ color: `${color}cc` }}>
          <span>▲</span>
          <span>Live</span>
        </div>
        <div
          className="kpi-update-dot"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
        />
      </div>

      {/* Bottom accent bar */}
      <div className="kpi-accent-bar" style={accentStyle} />
    </motion.div>
  );
});

KPICard.displayName = 'KPICard';
export default KPICard;
