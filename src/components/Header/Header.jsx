// src/components/Header/Header.jsx
import React, { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { useFPSMonitor } from '../../hooks/useFPSMonitor.js';
import { useMemoryMonitor } from '../../hooks/useMemoryMonitor.js';
import './Header.css';

const TickerContent = memo(({ viewPool }) => {
  const items = viewPool.slice(0, 30);
  const content = items.map((row, i) => (
    <span key={row.project_id + i} className="ticker-item">
      <span className="ticker-name">{row.project_name}</span>
      <span className="ticker-separator">◆</span>
      <span className="ticker-value">
        ${Number(row.annual_savings_usd || 0).toLocaleString('en-IN')}
      </span>
      <span className="ticker-separator">|</span>
      <span style={{ color: row.project_status === 'Failed' ? '#ef4444' : row.project_status === 'Active' ? '#22c55e' : '#94a3b8' }}>
        {row.project_status}
      </span>
    </span>
  ));

  return (
    <div className="ticker-track">
      {content}
      {content}
    </div>
  );
});

TickerContent.displayName = 'TickerContent';

const Header = memo(({ totalRows, viewPool = [] }) => {
  const fps = useFPSMonitor();
  const memory = useMemoryMonitor();
  const [utcTime, setUtcTime] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    const update = () => {
      setUtcTime(new Date().toUTCString().replace('GMT', 'UTC'));
    };
    update();
    timerRef.current = setInterval(update, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const fpsColor = fps >= 55 ? '#22c55e' : fps >= 30 ? '#f59e0b' : '#ef4444';
  const memMb = memory ? (memory.usedJSHeapSize / 1048576).toFixed(0) : '—';

  return (
    <motion.header
      className="header"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Scanline effect */}
      <div className="scanline" />

      {/* ─── Left: Logo + Brand ─── */}
      <div className="header-left">
        <div className="nexusflow-logo-wrap">
          <svg
            className="nexusflow-hex nexusflow-logo"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon
              points="22,2 40,12 40,32 22,42 4,32 4,12"
              fill="rgba(59,130,246,0.12)"
              stroke="#3b82f6"
              strokeWidth="1.5"
            />
            <polygon
              points="22,8 35,15.5 35,28.5 22,36 9,28.5 9,15.5"
              fill="rgba(6,182,212,0.08)"
              stroke="#06b6d4"
              strokeWidth="1"
            />
            <text
              x="22"
              y="27"
              textAnchor="middle"
              fontFamily="JetBrains Mono"
              fontSize="12"
              fontWeight="700"
              fill="#3b82f6"
            >
              NF
            </text>
          </svg>
        </div>
        <div className="header-brand">
          <div className="header-title">NEXUSFLOW</div>
          <div className="header-subtitle">Enterprise RPA Control Terminal</div>
          <span className="version-badge">v2026.1</span>
        </div>
      </div>

      {/* ─── Center: Ticker + Timestamp ─── */}
      <div className="header-center">
        <div className="ticker-container">
          <TickerContent viewPool={viewPool} />
        </div>
        <div className="header-timestamp">{utcTime}</div>
      </div>

      {/* ─── Right: Stats ─── */}
      <div className="header-right">
        <div className="header-stat">
          <div className="header-stat-label">Nodes</div>
          <motion.div
            className="header-stat-value"
            key={totalRows}
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {Number(totalRows).toLocaleString('en-IN')}
          </motion.div>
        </div>

        <div className="header-stat">
          <div className="header-stat-label">Memory</div>
          <div className="header-stat-value">{memMb} MB</div>
        </div>

        <div className="header-stat">
          <div className="header-stat-label">FPS</div>
          <motion.div
            key={fps}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="header-stat-value"
            style={{ color: fpsColor, fontFamily: 'JetBrains Mono' }}
          >
            {fps}
          </motion.div>
        </div>

        <div className="live-indicator">
          <div className="live-dot" style={{ position: 'relative' }}>
            <div className="live-ring" />
          </div>
          <span className="live-indicator-text">LIVE</span>
        </div>
      </div>
    </motion.header>
  );
});

Header.displayName = 'Header';
export default Header;
