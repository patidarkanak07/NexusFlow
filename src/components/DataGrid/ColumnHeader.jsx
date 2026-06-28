// src/components/DataGrid/ColumnHeader.jsx
import React, { memo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ColumnHeader = memo(({ column, sortConfig = [], onSort, onResizeStart }) => {
  const sortState = sortConfig.find((c) => c.key === column.key);
  const sortIndex = sortConfig.findIndex((c) => c.key === column.key);
  const isSorted = !!sortState;

  const handleHeaderClick = (e) => {
    if (!column.sortable) return;
    onSort(column.key, e.shiftKey);
  };

  return (
    <div
      className={`grid-column-header ${column.sortable ? 'sortable' : ''} ${isSorted ? 'column-sorted' : ''}`}
      style={{
        width: column.width,
        minWidth: column.width,
        maxWidth: column.width,
        justifyContent: column.align === 'right' ? 'flex-end' : column.align === 'center' ? 'center' : 'flex-start',
      }}
      onClick={handleHeaderClick}
    >
      <div
        className="grid-column-header-inner"
        style={{
          flexDirection: column.align === 'right' ? 'row-reverse' : 'row',
        }}
      >
        <span className="grid-column-label">{column.label}</span>

        {column.sortable && (
          <div className="grid-header-actions">
            <span className={`sort-arrow ${isSorted ? (sortState.direction === 'asc' ? 'sort-asc' : 'sort-desc') : 'sort-none'}`}>
              <ArrowUp size={12} className="sort-arrow-icon" />
            </span>

            <AnimatePresence>
              {sortIndex !== -1 && (
                <motion.span
                  className="sort-priority-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {sortIndex + 1}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div
        className="col-resize-handle"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => onResizeStart(e, column.key)}
      />
    </div>
  );
});

ColumnHeader.displayName = 'ColumnHeader';
export default ColumnHeader;
