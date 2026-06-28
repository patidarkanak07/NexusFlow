// src/components/StreamHeartbeat/StreamHeartbeat.jsx
import React, { useRef, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import './StreamHeartbeat.css';

const StreamHeartbeat = memo(({ 
  batchHistory = [],    // Array of {timestamp, rowCount, hasAnomaly}
  isPaused 
}) => {
  const svgRef = useRef();
  const WIDTH = 800;
  const HEIGHT = 40;
  const MAX_POINTS = 60;

  // Compute SVG polyline path from batch history
  const computePath = useCallback((history) => {
    if (!history || !history.length) return '';
    
    const maxVal = Math.max(...history.map(b => b.rowCount), 1);
    const points = history.slice(-MAX_POINTS).map((batch, i) => {
      const x = (i / (MAX_POINTS - 1)) * WIDTH;
      const y = HEIGHT - ((batch.rowCount / maxVal) * (HEIGHT - 8)) - 4;
      return `${x},${y}`;
    });
    
    return points.join(' ');
  }, []);

  const path = computePath(batchHistory);

  // Stats from recent batches
  const recentBatches = batchHistory.slice(-60);
  const avgRows = recentBatches.length
    ? Math.round(
        recentBatches.reduce((s, b) => s + b.rowCount, 0) 
        / recentBatches.length
      )
    : 0;
  const peakRows = recentBatches.length
    ? Math.max(...recentBatches.map(b => b.rowCount))
    : 0;
  const lastBatch = batchHistory[batchHistory.length - 1];

  return (
    <div className={`heartbeat-strip ${isPaused ? 'paused' : ''}`}>
      <div className="heartbeat-label">
        <motion.span
          animate={{ opacity: isPaused ? [1, 0.3, 1] : 1 }}
          transition={{ duration: 1, repeat: isPaused ? Infinity : 0 }}
          style={{ color: isPaused ? '#f59e0b' : '#22c55e' }}
        >
          {isPaused ? '⏸ PAUSED' : '● STREAM HEALTH'}
        </motion.span>
      </div>

      {/* SVG Heartbeat Line */}
      <div className="heartbeat-svg-wrapper">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="heartbeat-svg"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient 
              id="heartbeatGrad" 
              x1="0%" y1="0%" x2="100%" y2="0%"
            >
              <stop offset="0%" stopColor="rgba(59,130,246,0)" />
              <stop offset="50%" stopColor="rgba(34,197,94,0.8)" />
              <stop offset="100%" stopColor="rgba(6,182,212,1)" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="heartbeatGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background grid lines */}
          {[0.25, 0.5, 0.75].map(y => (
            <line
              key={y}
              x1="0" y1={HEIGHT * y}
              x2={WIDTH} y2={HEIGHT * y}
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          ))}

          {/* Baseline */}
          <line
            x1="0" y1={HEIGHT - 2}
            x2={WIDTH} y2={HEIGHT - 2}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />

          {/* Main heartbeat polyline */}
          {path && (
            <motion.polyline
              points={path}
              fill="none"
              stroke="url(#heartbeatGrad)"
              strokeWidth="1.5"
              filter="url(#heartbeatGlow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Latest point pulse dot */}
          {batchHistory.length > 0 && lastBatch && (
            <motion.circle
              cx={WIDTH}
              cy={(() => {
                const maxVal = Math.max(
                  ...batchHistory.slice(-60).map(b => b.rowCount), 1
                );
                return HEIGHT - 
                  ((lastBatch.rowCount / maxVal) * (HEIGHT - 8)) - 4;
              })()}
              r="3"
              fill="#22c55e"
              filter="url(#heartbeatGlow)"
              animate={{ 
                r: [3, 5, 3],
                opacity: [1, 0.6, 1]
              }}
              transition={{ 
                duration: 0.4,
                repeat: Infinity
              }}
            />
          )}
        </svg>
      </div>

      {/* Stats strip */}
      <div className="heartbeat-stats">
        <span>LAST: {lastBatch?.rowCount || 0} rows</span>
        <span>AVG: {avgRows} rows</span>
        <span>PEAK: {peakRows} rows</span>
        <span>BATCHES: {batchHistory.length.toLocaleString()}</span>
      </div>
    </div>
  );
});

StreamHeartbeat.displayName = 'StreamHeartbeat';
export default StreamHeartbeat;
