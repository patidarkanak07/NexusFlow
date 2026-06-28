// src/components/PerformanceMonitor/PerformanceMonitor.jsx
import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFPSMonitor } from '../../hooks/useFPSMonitor.js';
import { useMemoryMonitor } from '../../hooks/useMemoryMonitor.js';
import { getDOMNodeCount, getHealthStatus } from '../../utils/performanceHelpers.js';
import './PerformanceMonitor.css';

const PerformanceMonitor = memo(({ viewPoolSize = 0 }) => {
  const fps = useFPSMonitor();
  const memory = useMemoryMonitor();
  const [isExpanded, setIsExpanded] = useState(false);
  const [framesRendered, setFramesRendered] = useState(0);
  const [framesDropped, setFramesDropped] = useState(0);
  const [domNodes, setDomNodes] = useState(0);
  
  // Simulated render time and batch processing time
  const [renderTime, setRenderTime] = useState(1.8);
  const [batchTime, setBatchTime] = useState(0.6);

  // Track frame renders
  useEffect(() => {
    if (fps < 55) {
      setFramesDropped(prev => prev + (60 - fps));
    }
    setFramesRendered(prev => prev + fps);
  }, [fps]);

  // Sample DOM nodes and simulate render time variance
  useEffect(() => {
    const interval = setInterval(() => {
      setDomNodes(getDOMNodeCount());
      setRenderTime(1.2 + Math.random() * 1.5);
      setBatchTime(0.3 + Math.random() * 0.8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const healthStatus = getHealthStatus(fps, memory.percentUsed);

  const fpsColor = fps >= 55 
    ? '#22c55e' 
    : fps >= 30 
    ? '#f59e0b' 
    : '#ef4444';

  const memColor = memory.percentUsed < 60 
    ? '#22c55e' 
    : memory.percentUsed < 80 
    ? '#f59e0b' 
    : '#ef4444';

  const healthColor = {
    'HEALTHY': '#22c55e',
    'WARNING': '#f59e0b',
    'CRITICAL': '#ef4444'
  }[healthStatus];

  return (
    <motion.div
      className="performance-monitor"
      initial={false}
      animate={{ 
        width: isExpanded ? 260 : 120,
        height: isExpanded ? 'auto' : 36
      }}
      transition={{ 
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }}
    >
      {/* Collapsed Header - Always Visible */}
      <div 
        className="perf-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <motion.span
          key={fps}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          style={{ color: fpsColor }}
          className="fps-display"
        >
          ⚡ {fps} FPS
        </motion.span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▲
        </motion.span>
      </div>

      {/* Expanded Metrics */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="perf-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <MetricRow 
              label="FPS" 
              value={fps} 
              max={60}
              rawValue={fps}
              color={fpsColor}
              showBar
            />
            <MetricRow 
              label="MEMORY" 
              value={`${memory.usedMB}MB`}
              max={memory.limitMB || 2048}
              rawValue={memory.usedMB}
              color={memColor}
              showBar
            />
            <MetricRow 
              label="RENDER TIME"
              value={`${renderTime.toFixed(1)}ms`}
              color="#94a3b8"
            />
            <MetricRow 
              label="BATCH TIME"
              value={`${batchTime.toFixed(1)}ms`}
              color="#94a3b8"
            />
            <MetricRow 
              label="FRAMES RENDERED"
              value={framesRendered.toLocaleString()}
              color="#94a3b8"
            />
            <MetricRow 
              label="FRAMES DROPPED"
              value={framesDropped}
              color={framesDropped > 0 ? '#f59e0b' : '#22c55e'}
            />
            <MetricRow 
              label="DOM NODES"
              value={domNodes.toLocaleString()}
              color="#94a3b8"
            />
            <MetricRow 
              label="VIEW POOL"
              value={viewPoolSize.toLocaleString()}
              color="#94a3b8"
            />
            
            <div className="perf-status" style={{
              borderColor: healthColor,
              color: healthColor
            }}>
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ●
              </motion.span>
              STATUS: {healthStatus}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// MetricRow sub-component
const MetricRow = memo(({ label, value, max, rawValue, color, showBar }) => (
  <div className="metric-row">
    <span className="metric-label">{label}</span>
    <div className="metric-right">
      {showBar && (
        <div className="metric-bar-track">
          <motion.div
            className="metric-bar-fill"
            initial={{ width: 0 }}
            animate={{ 
              width: `${Math.min((rawValue / (max || 1)) * 100, 100)}%` 
            }}
            transition={{ duration: 0.5 }}
            style={{ background: color }}
          />
        </div>
      )}
      <span className="metric-value" style={{ color }}>
        {value}
      </span>
    </div>
  </div>
));

MetricRow.displayName = 'MetricRow';
PerformanceMonitor.displayName = 'PerformanceMonitor';
export default PerformanceMonitor;
