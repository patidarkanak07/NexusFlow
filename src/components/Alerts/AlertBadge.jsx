// src/components/Alerts/AlertBadge.jsx
import React, { memo } from 'react';
import './Alerts.css';

const STATUS_CONFIG = {
  Active: {
    color: '#22c55e',
    glow: 'rgba(34,197,94,0.4)',
    pulse: true,
    label: 'Active',
  },
  Failed: {
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.4)',
    pulse: true,
    label: 'Failed',
  },
  Completed: {
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.3)',
    pulse: false,
    label: 'Done',
  },
  Pending: {
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    pulse: false,
    label: 'Pending',
  },
};

const AlertBadge = memo(({ status }) => {
  const config = STATUS_CONFIG[status] || {
    color: '#94a3b8',
    glow: 'transparent',
    pulse: false,
    label: status || '—',
  };

  return (
    <span
      className={`status-badge ${config.pulse ? 'pulsing' : ''}`}
      style={{
        color: config.color,
        borderColor: `${config.color}55`,
        background: `${config.color}0f`,
        boxShadow: `0 0 8px ${config.glow}`,
      }}
    >
      <span className="status-dot" style={{ background: config.color }} />
      {config.label}
    </span>
  );
});

AlertBadge.displayName = 'AlertBadge';
export default AlertBadge;
