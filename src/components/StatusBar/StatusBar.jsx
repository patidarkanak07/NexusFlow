// src/components/StatusBar/StatusBar.jsx
import React, { useState, useEffect, memo } from 'react';
import { useFPSMonitor } from '../../hooks/useFPSMonitor.js';
import { useMemoryMonitor } from '../../hooks/useMemoryMonitor.js';
import { getTimestamp } from '../../utils/formatters.js';
import './StatusBar.css';

const StatusBar = memo(({ totalRows = 0, filteredRows = 0, isPaused, activeFiltersCount = 0, sortCount = 0 }) => {
  const fps = useFPSMonitor();
  const memory = useMemoryMonitor();
  const [lastUpdate, setLastUpdate] = useState('');

  useEffect(() => {
    setLastUpdate(getTimestamp());
  }, [totalRows, filteredRows, isPaused]);

  const memMb = memory ? (memory.usedJSHeapSize / 1048576).toFixed(0) : '—';
  const fpsColor = fps >= 55 ? '#22c55e' : fps >= 30 ? '#f59e0b' : '#ef4444';

  return (
    <div className="statusbar">
      <div className="statusbar-left">
        <span className="statusbar-item text-accent-blue font-bold">⬡ NEXUSFLOW</span>
        <span className="statusbar-divider">|</span>
        <span className="statusbar-item">
          ROWS: <span className="text-white font-bold">{totalRows.toLocaleString('en-IN')}</span>
        </span>
        <span className="statusbar-divider">|</span>
        <span className="statusbar-item">
          FILTERED: <span className="text-accent-cyan font-bold">{filteredRows.toLocaleString('en-IN')}</span>
        </span>
      </div>

      <div className="statusbar-right">
        <div className="statusbar-item">
          STREAM: 
          <span className={`statusbar-status-indicator ${isPaused ? 'paused' : 'active'}`} />
          <span className={isPaused ? 'text-accent-amber font-bold' : 'text-accent-green font-bold'}>
            {isPaused ? 'PAUSED' : 'ACTIVE'}
          </span>
        </div>
        <span className="statusbar-divider">|</span>
        <span className="statusbar-item">
          FPS: <span style={{ color: fpsColor, fontWeight: 'bold' }}>{fps}</span>
        </span>
        <span className="statusbar-divider">|</span>
        <span className="statusbar-item">
          MEM: <span className="text-white font-bold">{memMb}MB</span>
        </span>
        <span className="statusbar-divider">|</span>
        <span className="statusbar-item">
          SORT: <span className="text-accent-cyan font-bold">{sortCount} COLS</span>
        </span>
        <span className="statusbar-divider">|</span>
        <span className="statusbar-item">
          FILTERS: <span className="text-accent-blue font-bold">{activeFiltersCount} ACTIVE</span>
        </span>
        <span className="statusbar-divider">|</span>
        <span className="statusbar-item text-[10px]">
          LAST UPDATE: <span className="text-white">{lastUpdate}</span>
        </span>
      </div>
    </div>
  );
});

StatusBar.displayName = 'StatusBar';
export default StatusBar;
