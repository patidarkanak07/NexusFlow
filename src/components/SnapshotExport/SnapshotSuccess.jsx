// components/SnapshotExport/SnapshotSuccess.jsx
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SNAPSHOT_STATE } from '../../hooks/useSnapshotExport';
import './SnapshotExport.css';

export const SnapshotSuccess = memo(({ snapshotState }) => {
  const { status, lastSnapshot, filename } = snapshotState;
  const isSuccess = status === SNAPSHOT_STATE.SUCCESS;

  return (
    <AnimatePresence>
      {isSuccess && lastSnapshot && (
        <motion.div
          className="snapshot-success-toast"
          initial={{ opacity: 0, y: 60, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.85 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 28
          }}
        >
          {/* Success icon with animation */}
          <motion.div
            className="success-icon"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.1,
              type: 'spring',
              stiffness: 500,
              damping: 20
            }}
          >
            📸
          </motion.div>

          <div className="success-content">
            <div className="success-title">
              Snapshot Exported Successfully
            </div>

            {/* Exported state summary */}
            <div className="success-summary">
              <span className="success-stat">
                ✅ {lastSnapshot.rowCount.toLocaleString('en-IN')} rows
              </span>

              {lastSnapshot.sortConfig && lastSnapshot.sortConfig.length > 0 && (
                <span className="success-stat">
                  🔢 Sorted by:{' '}
                  {lastSnapshot.sortConfig
                    .map(s => `${s.priority}. ${s.label}`)
                    .join(', ')}
                </span>
              )}

              {lastSnapshot.activeFilters && lastSnapshot.activeFilters.length > 0 && (
                <span className="success-stat">
                  🔽 {lastSnapshot.activeFilters.length} filter
                  {lastSnapshot.activeFilters.length > 1 ? 's' : ''} applied
                </span>
              )}

              {lastSnapshot.searchQuery && (
                <span className="success-stat">
                  🔍 Search: "{lastSnapshot.searchQuery}"
                </span>
              )}
            </div>

            <div className="success-filename">
              {filename}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

SnapshotSuccess.displayName = 'SnapshotSuccess';
export default SnapshotSuccess;
