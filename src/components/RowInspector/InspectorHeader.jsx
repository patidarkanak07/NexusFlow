// src/components/RowInspector/InspectorHeader.jsx
import React, { memo } from 'react';
import { X, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const InspectorHeader = memo(({ projectId, openedAt, pauseQueueSize, onClose }) => {
  return (
    <div className="inspector-header">
      {/* Laser Scan line effect */}
      <div className="inspector-scan" />

      <div className="flex justify-between items-start">
        <div>
          <div className="inspector-title flex items-center gap-1.5">
            <Search size={11} className="text-accent-cyan" />
            <span>PROJECT DOSSIER</span>
          </div>
          <h2 className="inspector-project-id font-mono">
            {projectId}
          </h2>
          <div className="inspector-meta">
            Captured at: <span className="text-gray-300 font-bold">{openedAt}</span>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={onClose}
          className="inspector-close-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close Inspector [ESC]"
        >
          <X size={16} />
        </motion.button>
      </div>

      <div className="flex items-center justify-between mt-3 text-[11px] font-mono border-t border-gray-800 pt-3">
        <div className="flex items-center gap-1.5">
          <div className="paused-dot" />
          <span className="text-accent-amber uppercase font-bold tracking-wider">STREAM PAUSED</span>
        </div>
        <span className="text-gray-500">
          Queue: <span className="text-accent-cyan font-bold">{pauseQueueSize} pending</span>
        </span>
      </div>
    </div>
  );
});

InspectorHeader.displayName = 'InspectorHeader';
export default InspectorHeader;
