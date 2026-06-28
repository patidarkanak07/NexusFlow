// components/SnapshotExport/SnapshotTrigger.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import { SNAPSHOT_STATE } from '../../hooks/useSnapshotExport';
import './SnapshotExport.css';

export const SnapshotTrigger = ({
  snapshotState,
  onTrigger,
  onCancel,
  viewPoolSize,
  sortConfig = [],
  activeFilters = [],
  searchQuery
}) => {
  const { status, progress, error } = snapshotState;
  const isProcessing = status === SNAPSHOT_STATE.COMPILING ||
                       status === SNAPSHOT_STATE.CAPTURING ||
                       status === SNAPSHOT_STATE.DOWNLOADING;

  // Show what will be exported
  const exportDescription = () => {
    const parts = [];
    if (sortConfig?.length > 0) {
      parts.push(`sorted by ${sortConfig.length} col${
        sortConfig.length > 1 ? 's' : ''
      }`);
    }
    if (activeFilters?.length > 0) {
      parts.push(`${activeFilters.length} filter${
        activeFilters.length > 1 ? 's' : ''
      } active`);
    }
    if (searchQuery) {
      parts.push(`search: "${searchQuery}"`);
    }
    return parts.length > 0
      ? parts.join(' · ')
      : 'Full dataset';
  };

  return (
    <div className="snapshot-wrapper">
      <motion.button
        type="button"
        className={`snapshot-btn status-${status}`}
        onClick={isProcessing ? onCancel : onTrigger}
        whileHover={!isProcessing ? { scale: 1.04 } : {}}
        whileTap={!isProcessing ? { scale: 0.96 } : {}}
        disabled={status === SNAPSHOT_STATE.DOWNLOADING}
        title={`Snapshot Export — ${exportDescription()}`}
      >
        {/* Icon changes based on status */}
        <AnimatePresence mode="wait">
          {status === SNAPSHOT_STATE.IDLE && (
            <motion.span key="idle"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              className="snap-icon-wrapper"
            >
              <Camera size={14} />
            </motion.span>
          )}

          {isProcessing && (
            <motion.span key="processing"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="snap-icon-wrapper"
            >
              <motion.div
                className="snap-spinner"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </motion.span>
          )}

          {status === SNAPSHOT_STATE.SUCCESS && (
            <motion.span key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{
                type: 'spring',
                stiffness: 500,
                damping: 20
              }}
              className="snap-icon-wrapper"
            >
              <CheckCircle size={14} color="#22c55e" />
            </motion.span>
          )}

          {status === SNAPSHOT_STATE.ERROR && (
            <motion.span key="error"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -5, 5, 0] }}
              exit={{ scale: 0 }}
              className="snap-icon-wrapper"
            >
              <AlertCircle size={14} color="#ef4444" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Button label */}
        <span className="snap-label font-mono">
          {status === SNAPSHOT_STATE.IDLE && 'Snapshot Export'}
          {status === SNAPSHOT_STATE.CAPTURING && 'Capturing...'}
          {status === SNAPSHOT_STATE.COMPILING && `Compiling ${progress}%`}
          {status === SNAPSHOT_STATE.DOWNLOADING && 'Downloading...'}
          {status === SNAPSHOT_STATE.SUCCESS && 'Downloaded!'}
          {status === SNAPSHOT_STATE.ERROR && 'Failed'}
        </span>

        {/* Cancel X when processing */}
        {isProcessing && (
          <motion.span
            className="snap-cancel"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ color: '#ef4444' }}
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            <X size={10} />
          </motion.span>
        )}
      </motion.button>

      {/* Progress bar — shows during compilation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            className="snapshot-progress-bar"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="snapshot-progress-fill"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Row count tooltip on hover */}
      <div className="snapshot-tooltip">
        <div className="tooltip-title">
          📸 Snapshot Export
        </div>
        <div className="tooltip-rows">
          {viewPoolSize.toLocaleString('en-IN')} rows will be exported
        </div>
        <div className="tooltip-meta">
          {exportDescription()}
        </div>
        <div className="tooltip-hint">
          Press <kbd>Ctrl</kbd>+<kbd>S</kbd> to trigger
        </div>
      </div>
    </div>
  );
};

SnapshotTrigger.displayName = 'SnapshotTrigger';
export default SnapshotTrigger;
