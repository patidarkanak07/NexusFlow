// src/components/ControlPanel/LayoutToggle.jsx
import React, { memo } from 'react';

const LayoutToggle = memo(({ layout = {}, onToggle }) => {
  const options = [
    { key: 'showKPIStrip', label: 'KPIs' },
    { key: 'showGridWindow', label: 'Data Grid' },
    { key: 'showAnalyticsPanel', label: 'Analytics' },
    { key: 'showFilterPanel', label: 'Filters' },
  ];

  return (
    <div className="controls-right">
      <span className="layout-toggle-label">Workspace Modules:</span>
      <div className="flex gap-2">
        {options.map((opt) => {
          const isActive = layout[opt.key];
          return (
            <button
              key={opt.key}
              type="button"
              className={`panel-toggle-btn ${isActive ? 'active' : 'inactive'}`}
              onClick={() => onToggle(opt.key)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
});

LayoutToggle.displayName = 'LayoutToggle';
export default LayoutToggle;
