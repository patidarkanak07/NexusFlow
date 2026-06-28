// src/components/ControlPanel/PausePlay.jsx
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

const PausePlay = memo(({ isPaused, togglePause, queueSize }) => {
  return (
    <div className="flex items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`pause-btn ${isPaused ? 'paused' : 'playing'}`}
        onClick={togglePause}
        type="button"
      >
        <AnimatePresence mode="wait">
          {isPaused ? (
            <motion.div
              key="play"
              className="flex items-center gap-2"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Play size={14} fill="currentColor" />
              <span>Resume Stream</span>
            </motion.div>
          ) : (
            <motion.div
              key="pause"
              className="flex items-center gap-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Pause size={14} fill="currentColor" />
              <span>Pause Stream</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-2"
          >
            <span className="queue-badge">
              {queueSize} buffered
            </span>
            <div className="flex gap-1 items-center">
              <span className="buffering-dot" />
              <span className="buffering-dot" />
              <span className="buffering-dot" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PausePlay.displayName = 'PausePlay';
export default PausePlay;
