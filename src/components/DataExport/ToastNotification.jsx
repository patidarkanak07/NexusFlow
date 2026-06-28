// src/components/DataExport/ToastNotification.jsx
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import './DataExport.css';

export const ToastNotification = memo(({ message, sub, show, onClose }) => {
  React.useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose?.();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="export-toast"
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className="export-toast-title">
            <Check size={14} strokeWidth={3} />
            <span>{message}</span>
          </div>
          {sub && <div className="export-toast-desc">{sub}</div>}
        </motion.div>
      )}
    </AnimatePresence>
  );
});

ToastNotification.displayName = 'ToastNotification';
export default ToastNotification;
