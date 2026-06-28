// src/components/DataExport/ExportMenu.jsx
import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import './DataExport.css';

export const ExportMenu = memo(({ 
  viewPool = [], 
  anomalyCount = 0,
  onExportCSV,
  onExportJSON, 
  onExportAnomalies
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="export-wrapper">
      <motion.button
        type="button"
        className="export-trigger-btn font-ui"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <Download size={13} />
        <span>Export</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="export-backdrop"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="export-menu font-mono"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              <div className="export-menu-header">
                <span>EXPORT DATA</span>
                <span className="export-row-count">
                  {viewPool.length.toLocaleString('en-IN')} rows
                </span>
              </div>

              <ExportOption
                icon="📄"
                label="Export as CSV"
                description="Download filtered data as spreadsheet"
                onClick={() => { 
                  onExportCSV(); 
                  setIsOpen(false); 
                }}
              />
              <ExportOption
                icon="🗄️"
                label="Export as JSON"
                description="Download filtered data as JSON file"
                onClick={() => { 
                  onExportJSON(); 
                  setIsOpen(false); 
                }}
              />
              <ExportOption
                icon="🚨"
                label={`Export Anomalies (${anomalyCount})`}
                description="Download only anomaly rows as CSV"
                onClick={() => { 
                  onExportAnomalies(); 
                  setIsOpen(false); 
                }}
                disabled={anomalyCount === 0}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

const ExportOption = memo(({ icon, label, description, onClick, disabled }) => (
  <motion.button
    type="button"
    className={`export-option ${disabled ? 'disabled' : ''}`}
    onClick={disabled ? undefined : onClick}
    whileHover={!disabled ? { 
      backgroundColor: 'rgba(59,130,246,0.1)',
      x: 4
    } : {}}
    transition={{ duration: 0.1 }}
  >
    <span className="export-option-icon">{icon}</span>
    <div className="export-option-content">
      <span className="export-option-label">{label}</span>
      <span className="export-option-desc">{description}</span>
    </div>
  </motion.button>
));

ExportOption.displayName = 'ExportOption';
ExportMenu.displayName = 'ExportMenu';
export default ExportMenu;
