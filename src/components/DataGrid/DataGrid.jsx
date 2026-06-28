// src/components/DataGrid/DataGrid.jsx
import React, { memo, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { VirtualScroller } from '../../engine/virtualScroller.js';
import ColumnHeader from './ColumnHeader.jsx';
import GridRow from './GridRow.jsx';
import { formatCurrency, formatPercent, formatInteger, formatDate, getRoiColor } from '../../utils/formatters.js';
import './DataGrid.css';

const DataGrid = memo(({
  viewPool = [],
  sortConfig = [],
  onSort,
  isPaused,
  onClearFilters,
  inspectorState = { isOpen: false, selectedRow: null },
  onRowClick,
  onShowPauseTip
}) => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const scrollerInstance = useRef(null);

  // Custom column state for column resizing
  const [columns, setColumns] = useState([
    { key: 'project_id',           label: 'Project ID',     width: 100, sortable: false, align: 'left',  mono: true },
    { key: 'project_name',         label: 'Project Name',   width: 160, sortable: false, align: 'left',  mono: false },
    { key: 'company_id',           label: 'Company',        width: 120, sortable: false, align: 'left',  mono: true },
    { key: 'project_status',       label: 'Status',         width: 100, sortable: false, align: 'center', mono: false },
    { key: 'automation_type',      label: 'Type',           width: 140, sortable: false, align: 'left',  mono: false },
    { key: 'department',           label: 'Department',     width: 120, sortable: false, align: 'left',  mono: false },
    { key: 'country',              label: 'Country',        width: 110, sortable: false, align: 'left',  mono: false },
    { key: 'robots_deployed',      label: 'Robots',         width: 75,  sortable: false, align: 'right', mono: true },
    { key: 'annual_savings_usd',   label: 'Annual Savings', width: 140, sortable: true,  align: 'right', mono: true },
    { key: 'budget_usd',           label: 'Budget',         width: 130, sortable: true,  align: 'right', mono: true },
    { key: 'roi_percent',          label: 'ROI %',          width: 90,  sortable: true,  align: 'right', mono: true },
    { key: 'employee_hours_saved', label: 'Hours Saved',    width: 110, sortable: true,  align: 'right', mono: true },
    { key: 'industry',             label: 'Industry',       width: 130, sortable: false, align: 'left',  mono: false },
    { key: 'start_date',           label: 'Start Date',     width: 110, sortable: false, align: 'left',  mono: true },
  ]);

  const rowHeight = 44;
  const [scrollRange, setScrollRange] = useState({ start: 0, end: 15, offset: 0 });
  const [tooltip, setTooltip] = useState(null);

  // Synchronize column widths from headers to cells
  const handleScrollX = useCallback(() => {
    if (containerRef.current && headerRef.current) {
      headerRef.current.scrollLeft = containerRef.current.scrollLeft;
    }
  }, []);

  // Update visible range upon viewport scroll
  const handleRenderRange = useCallback((startIndex, endIndex, scrollTop) => {
    setScrollRange({
      start: startIndex,
      end: endIndex,
      offset: startIndex * rowHeight
    });
  }, [rowHeight]);

  // Instantiate and bind virtual scroller
  useEffect(() => {
    if (containerRef.current) {
      const scroller = new VirtualScroller({
        container: containerRef.current,
        rowHeight,
        onRender: handleRenderRange
      });
      scrollerInstance.current = scroller;
      scroller.update(viewPool.length);
      scroller.recalculate();
    }
    return () => {
      scrollerInstance.current?.destroy();
    };
  }, [handleRenderRange, rowHeight]);

  // Update virtual scroller whenever view pool size changes
  useEffect(() => {
    if (scrollerInstance.current) {
      scrollerInstance.current.update(viewPool.length);
      scrollerInstance.current.recalculate();
    }
  }, [viewPool.length]);

  // Resizing columns implementation
  const handleResizeStart = useCallback((e, colKey) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidths = columns.reduce((acc, col) => {
      acc[col.key] = col.width;
      return acc;
    }, {});

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      setColumns((prevCols) =>
        prevCols.map((col) => {
          if (col.key === colKey) {
            const nextWidth = Math.max(50, startWidths[colKey] + deltaX);
            return { ...col, width: nextWidth };
          }
          return col;
        })
      );
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [columns]);

  // Tooltip tracking
  const handleRowHover = useCallback((e, row) => {
    if (!row) {
      setTooltip(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(window.innerWidth - 350, rect.left + 50);
    const y = Math.min(window.innerHeight - 300, rect.bottom + 10);

    setTooltip({
      x,
      y,
      data: row
    });
  }, []);

  const totalWidth = useMemo(() => columns.reduce((acc, c) => acc + c.width, 0), [columns]);

  // Slice virtual rows pool
  const visibleRows = useMemo(() => {
    return viewPool.slice(scrollRange.start, scrollRange.end).map((row, idx) => ({
      row,
      index: scrollRange.start + idx
    }));
  }, [viewPool, scrollRange.start, scrollRange.end]);

  return (
    <div className={`grid-wrapper ${isPaused ? 'grid-paused' : ''} ${inspectorState?.isOpen ? 'grid-dimmed' : ''}`}>
      {/* Table Header Wrapper */}
      <div className="grid-header-scroller" ref={headerRef}>
        <div className="grid-header-row" style={{ width: totalWidth }}>
          {columns.map((col) => (
            <ColumnHeader
              key={col.key}
              column={col}
              sortConfig={sortConfig}
              onSort={onSort}
              onResizeStart={handleResizeStart}
            />
          ))}
        </div>
      </div>

      {/* Main Scroller Area */}
      <div
        className="grid-viewport vscroll-container"
        ref={containerRef}
        onScroll={handleScrollX}
      >
        {/* Phantom spacer to enable native scrollbar height */}
        <div className="vscroll-phantom" />

        {/* Recycled row nodes rendering container */}
        <div
          className="vscroll-rows"
          style={{ transform: `translate3d(0, ${scrollRange.offset}px, 0)`, width: totalWidth }}
        >
          {visibleRows.map(({ row, index }) => (
            <GridRow
              key={row.project_id}
              row={row}
              index={index}
              columns={columns}
              style={{ height: rowHeight, top: (index - scrollRange.start) * rowHeight }}
              onRowHover={handleRowHover}
              isInspecting={inspectorState?.selectedRow?.project_id === row.project_id}
              isPaused={isPaused}
              onRowClick={onRowClick}
              onShowPauseTip={onShowPauseTip}
              className={isPaused ? 'grid-row-paused-hover' : ''}
            />
          ))}
        </div>

        {/* Empty State */}
        {viewPool.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary-bg bg-opacity-70">
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <Search size={48} className="text-gray-600 opacity-40" />
              </motion.div>
              <h3>No matching records</h3>
              <p>Try adjusting your search criteria or clearing filters.</p>
              <button type="button" onClick={onClearFilters}>
                Clear All Filters
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Detail Tooltip Hover Card */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="row-tooltip"
            style={{ left: tooltip.x, top: tooltip.y }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {tooltip.data.project_name}
                </h4>
                <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                  ID: {tooltip.data.project_id}
                </p>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded font-bold uppercase"
                style={{
                  color: getRoiColor(tooltip.data.roi_percent),
                  border: `1px solid ${getRoiColor(tooltip.data.roi_percent)}55`,
                  background: `${getRoiColor(tooltip.data.roi_percent)}11`,
                }}
              >
                ROI {formatPercent(tooltip.data.roi_percent)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-ui">
              <div>
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Company</span>
                <span className="text-white font-mono">{tooltip.data.company_id}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Partner</span>
                <span className="text-white">{tooltip.data.implementation_partner}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Industry</span>
                <span className="text-white">{tooltip.data.industry}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Country</span>
                <span className="text-white">{tooltip.data.country}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Budget</span>
                <span className="text-white font-mono">{formatCurrency(tooltip.data.budget_usd)}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Savings</span>
                <span className="text-white font-mono">{formatCurrency(tooltip.data.annual_savings_usd)}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Hours Saved</span>
                <span className="text-white font-mono">{formatInteger(tooltip.data.employee_hours_saved)} hrs</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[9px] uppercase font-bold">Start Date</span>
                <span className="text-white font-mono">{formatDate(tooltip.data.start_date)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

DataGrid.displayName = 'DataGrid';
export default DataGrid;
