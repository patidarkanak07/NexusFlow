// src/components/DataGrid/GridRow.jsx
import React, { memo, useRef, useEffect, useState, useMemo } from 'react';
import {
  formatCurrency,
  formatPercent,
  formatInteger,
  formatDate
} from '../../utils/formatters.js';
import AlertBadge from '../Alerts/AlertBadge.jsx';
import { detectAnomalies } from '../../utils/anomalyRules.js';

const GridRow = memo(({ row, index, columns, style, onRowHover, isInspecting, isPaused, onRowClick, onShowPauseTip }) => {
  const rowRef = useRef(null);
  const prevMetrics = useRef({});
  const [flashingCells, setFlashingCells] = useState({});

  const rowAnomalies = useMemo(() => detectAnomalies(row), [row]);
  const hasAnomaly = rowAnomalies.length > 0;
  const isCritical = rowAnomalies.some(a => a.severity === 'critical');

  // Detect which numeric values have changed since last tick to trigger numberFlash animation
  useEffect(() => {
    const flashInfo = {};
    let hasFlash = false;
    const trackedKeys = ['robots_deployed', 'annual_savings_usd', 'roi_percent', 'employee_hours_saved'];

    trackedKeys.forEach((key) => {
      const prevVal = prevMetrics.current[key];
      const curVal = row[key];
      if (prevVal !== undefined && prevVal !== curVal) {
        flashInfo[key] = true;
        hasFlash = true;
      }
      prevMetrics.current[key] = curVal;
    });

    if (hasFlash) {
      setFlashingCells(flashInfo);
      const timer = setTimeout(() => {
        setFlashingCells({});
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [row]);

  // Determine special status warning classes
  let statusClass = '';
  if (row.project_status === 'Failed') {
    statusClass = 'row-alert-failed';
  } else if (Number(row.roi_percent) < 0) {
    statusClass = 'row-alert-warning';
  } else if (row.project_status === 'Active') {
    statusClass = 'row-alert-active';
  } else if (row.project_status === 'Completed') {
    statusClass = 'row-alert-completed';
  }

  // Row entrance class
  const entryClass = row._isNew ? 'grid-row-new' : '';

  const handleClick = () => {
    if (!isPaused) {
      onShowPauseTip?.(row.project_name);
      return;
    }
    onRowClick?.(row);
  };

  return (
    <div
      ref={rowRef}
      className={`grid-row ${statusClass} ${entryClass} ${isInspecting ? 'grid-row-inspecting' : ''} ${isPaused ? 'grid-row-paused-hover' : ''} ${isCritical ? 'row-critical-anomaly' : ''} ${hasAnomaly && !isCritical ? 'row-warning-anomaly' : ''}`}
      style={{
        ...style,
        backgroundColor: index % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
        cursor: isPaused ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => onRowHover(e, row)}
      onMouseLeave={(e) => onRowHover(e, null)}
      onClick={handleClick}
    >
      {hasAnomaly && (
        <span 
          className="absolute left-[3px] z-10 text-[9px]"
          title={rowAnomalies.map(a => a.message).join(', ')}
        >
          {isCritical ? '🚨' : '⚠️'}
        </span>
      )}
      {columns.map((col) => {
        let content = row[col.key];

        // Format rules based on keys
        if (col.key === 'project_status') {
          content = <AlertBadge status={row[col.key]} />;
        } else if (col.key === 'annual_savings_usd' || col.key === 'budget_usd') {
          content = formatCurrency(row[col.key]);
        } else if (col.key === 'roi_percent') {
          content = formatPercent(row[col.key]);
        } else if (col.key === 'robots_deployed' || col.key === 'employee_hours_saved') {
          content = formatInteger(row[col.key]);
        } else if (col.key === 'start_date') {
          content = formatDate(row[col.key]);
        }

        const isFlashing = flashingCells[col.key];

        return (
          <div
            key={col.key}
            className={`grid-cell ${col.align === 'right' ? 'align-right text-right-mono' : col.align === 'center' ? 'align-center' : 'align-left'} ${col.mono ? 'font-mono' : ''}`}
            style={{
              width: col.width,
              minWidth: col.width,
              maxWidth: col.width,
            }}
          >
            <span className={isFlashing ? 'number-updated' : ''}>
              {content}
            </span>
          </div>
        );
      })}
    </div>
  );
});

GridRow.displayName = 'GridRow';
export default GridRow;
