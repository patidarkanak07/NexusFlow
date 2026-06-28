// src/App.jsx
import React, { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header/Header.jsx';
import KPIStrip from './components/KPIStrip/KPIStrip.jsx';
import FilterPanel from './components/Filters/FilterPanel.jsx';
import SearchBar from './components/SearchBar/SearchBar.jsx';
import PausePlay from './components/ControlPanel/PausePlay.jsx';
import LayoutToggle from './components/ControlPanel/LayoutToggle.jsx';
import DataGrid from './components/DataGrid/DataGrid.jsx';
import StatusBar from './components/StatusBar/StatusBar.jsx';

import { useStreamData } from './hooks/useStreamData.js';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { stateEngine } from './engine/stateEngine.js';
import { useRowInspector } from './hooks/useRowInspector.js';

const RowInspector = React.lazy(() => import('./components/RowInspector/RowInspector.jsx'));


export default function App() {
  const {
    viewPool,
    kpiCounters,
    kpiHistory,
    pauseQueueSize,
    isPaused,
    sortConfig,
    filters,
    totalRows,
    filteredRows,
    togglePause,
    setSort,
    setFilters,
    setSearch,
  } = useStreamData();

  const { inspectorState, openInspector, closeInspector } = useRowInspector();
  const [toastMessage, setToastMessage] = React.useState('');

  const handleShowPauseTip = useCallback((projectName) => {
    setToastMessage(`⏸ Pause stream to inspect "${projectName}"`);
    const timer = setTimeout(() => setToastMessage(''), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handlePrevRow = useCallback(() => {
    if (!inspectorState.selectedRow) return;
    const currentIndex = viewPool.findIndex(row => row.project_id === inspectorState.selectedRow.project_id);
    if (currentIndex > 0) {
      openInspector(viewPool[currentIndex - 1]);
    }
  }, [viewPool, inspectorState.selectedRow, openInspector]);

  const handleNextRow = useCallback(() => {
    if (!inspectorState.selectedRow) return;
    const currentIndex = viewPool.findIndex(row => row.project_id === inspectorState.selectedRow.project_id);
    if (currentIndex !== -1 && currentIndex < viewPool.length - 1) {
      openInspector(viewPool[currentIndex + 1]);
    }
  }, [viewPool, inspectorState.selectedRow, openInspector]);


  // Layout persistence toggle states
  const [layout, setLayout] = useLocalStorage('nexusflow-layout-v1', {
    showKPIStrip: true,
    showGridWindow: true,
    showAnalyticsPanel: true,
    showFilterPanel: true,
  });

  // Start data stream pipeline trigger
  useEffect(() => {
    if (window.initializeRpaStream) {
      const stopStream = window.initializeRpaStream((incomingBatch) => {
        stateEngine.process(incomingBatch);
      });
      return () => stopStream();
    }
  }, []);

  const handleToggleLayout = useCallback((key) => {
    setLayout((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, [setLayout]);

  // Compute active filters metric count
  const activeFiltersCount = Object.values(filters || {}).reduce(
    (acc, val) => acc + (val?.length || 0),
    0
  );

  // Compute Analytics variables dynamically
  const departmentSavings = React.useMemo(() => {
    const savingsMap = {};
    viewPool.forEach((row) => {
      const dept = row.department || 'Unknown';
      savingsMap[dept] = (savingsMap[dept] || 0) + (parseFloat(row.annual_savings_usd) || 0);
    });
    return Object.entries(savingsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [viewPool]);

  const maxSavings = React.useMemo(() => {
    if (departmentSavings.length === 0) return 1;
    return Math.max(...departmentSavings.map(([_, val]) => val));
  }, [departmentSavings]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-primary-bg relative bg-grid">
      {/* Cinematic entrance marquee scanline and logo pulse details */}
      <Header totalRows={totalRows} viewPool={viewPool} />

      {/* KPI strip layout Persistence */}
      <AnimatePresence initial={false}>
        {layout.showKPIStrip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <KPIStrip kpiCounters={kpiCounters} kpiHistory={kpiHistory} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controller modules strip */}
      <div className="control-panel border-t border-b border-blue-900 border-opacity-30">
        <div className="controls-left">
          <PausePlay
            isPaused={isPaused}
            togglePause={togglePause}
            queueSize={pauseQueueSize}
          />
        </div>
        <LayoutToggle layout={layout} onToggle={handleToggleLayout} />
      </div>

      {/* Filters layout Persistence */}
      <AnimatePresence initial={false}>
        {layout.showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: layout.showFilterPanel ? 'visible' : 'hidden', zIndex: 40, position: 'relative' }}
          >
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Frame container */}
      <div className="flex flex-1 overflow-hidden p-4 gap-4">
        {/* Main interactive grid window */}
        <AnimatePresence initial={false}>
          {layout.showGridWindow && (
            <motion.div
              className="flex flex-col flex-1 min-w-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
            >
              {/* Search bar section */}
              <div className="mb-3 flex gap-4">
                <SearchBar onSearch={setSearch} resultCount={filteredRows} />
              </div>

              {/* Recycled row node custom grid */}
              <DataGrid
                viewPool={viewPool}
                sortConfig={sortConfig}
                onSort={setSort}
                isPaused={isPaused}
                onClearFilters={() => setFilters({})}
                inspectorState={inspectorState}
                onRowClick={openInspector}
                onShowPauseTip={handleShowPauseTip}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Live Analytics Sidebar panel */}
        <AnimatePresence initial={false}>
          {layout.showAnalyticsPanel && (
            <motion.div
              className="w-80 panel-glow p-4 flex flex-col gap-4 overflow-y-auto flex-shrink-0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.35 }}
            >
              <div className="border-b border-gray-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-accent-cyan">
                  Department Savings Leaderboard
                </h3>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Live metrics updating dynamically
                </p>
              </div>

              <div className="flex flex-col gap-3 flex-1 justify-start">
                {departmentSavings.map(([dept, savings]) => {
                  const percent = (savings / maxSavings) * 100;
                  return (
                    <div key={dept} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-ui">
                        <span className="text-gray-300 font-bold">{dept}</span>
                        <span className="text-accent-green font-mono">
                          ${Math.round(savings / 1000).toLocaleString('en-IN')}K
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-900 rounded overflow-hidden">
                        <motion.div
                          className="h-full bg-accent-blue rounded"
                          style={{
                            background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  );
                })}

                {departmentSavings.length === 0 && (
                  <p className="text-xs text-gray-500 text-center py-8">
                    No data captured yet
                  </p>
                )}
              </div>

              <div className="border-t border-gray-800 pt-4 flex flex-col gap-2 mt-auto">
                <h4 className="text-[10px] uppercase font-bold text-gray-500">
                  Infrastructure Telemetry
                </h4>
                <div className="flex justify-between text-xs font-mono">
                  <span>Stream rate:</span>
                  <span className="text-accent-green">5 batches/sec</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span>Network latency:</span>
                  <span className="text-accent-green">24ms (sim)</span>
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span>Renderer status:</span>
                  <span className="text-accent-cyan">Gated (RAF)</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed bottom dashboard status bar */}
      <StatusBar
        totalRows={totalRows}
        filteredRows={filteredRows}
        isPaused={isPaused}
        activeFiltersCount={activeFiltersCount}
        sortCount={sortConfig.length}
      />

      {/* Row Inspector — rendered at App level */}
      <AnimatePresence>
        {inspectorState.isOpen && (
          <React.Suspense fallback={null}>
            <RowInspector
              key="row-inspector"
              rowData={inspectorState.selectedRow}
              openedAt={inspectorState.openedAt}
              pauseQueueSize={pauseQueueSize}
              onClose={closeInspector}
              onPrevRow={handlePrevRow}
              onNextRow={handleNextRow}
            />
          </React.Suspense>
        )}
      </AnimatePresence>

      {/* Non-blocking toast warning when stream is live */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="fixed bottom-12 right-6 bg-accent-amber bg-opacity-95 text-primary-bg px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2 border border-accent-amber font-ui text-xs font-bold z-[2000]"
            style={{ color: '#0a0f1e' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span>⏸</span> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
