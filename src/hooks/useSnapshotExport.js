// src/hooks/useSnapshotExport.js
import { useState, useCallback, useRef } from 'react';
import { SnapshotEngine } from '../engine/snapshotEngine';
import {
  CSV_COLUMN_DEFINITIONS,
  compileCSVIdle
} from '../utils/csvCompiler';
import { stateEngine } from '../engine/stateEngine';

// Snapshot states
export const SNAPSHOT_STATE = {
  IDLE: 'idle',
  CAPTURING: 'capturing',
  COMPILING: 'compiling',
  DOWNLOADING: 'downloading',
  SUCCESS: 'success',
  ERROR: 'error'
};

const triggerDownload = (csvString, snapshot) => {
  // Generate descriptive filename
  const timestamp = new Date(snapshot.timestamp)
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);

  // Include filter/sort info in filename
  const sortSuffix = snapshot.sortConfig.length > 0
    ? `-sorted-${snapshot.sortConfig
        .map(s => s.column)
        .join('-')}`
    : '';

  const filterSuffix = snapshot.activeFilters.length > 0
    ? `-filtered`
    : '';

  const searchSuffix = snapshot.searchQuery
    ? `-searched`
    : '';

  const filename = [
    'nexusflow-snapshot',
    timestamp,
    `${snapshot.rowCount}rows`,
    sortSuffix,
    filterSuffix,
    searchSuffix
  ].filter(Boolean).join('') + '.csv';

  // Create Blob — client side only
  const blob = new Blob(
    ['\uFEFF' + csvString], // BOM for Excel UTF-8 compatibility
    { type: 'text/csv;charset=utf-8;' }
  );

  // Create temporary download URL
  const url = URL.createObjectURL(blob);

  // Create invisible link and click it
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // CRITICAL: Revoke URL to prevent memory leak
  // Must happen after download starts
  setTimeout(() => URL.revokeObjectURL(url), 500);

  return filename;
};

export const useSnapshotExport = () => {
  const [snapshotState, setSnapshotState] = useState({
    status: SNAPSHOT_STATE.IDLE,
    progress: 0,
    lastSnapshot: null,
    error: null,
    filename: null
  });

  const cancelRef = useRef(null);
  const workerRef = useRef(null);
  const snapshotEngineRef = useRef(
    new SnapshotEngine(stateEngine)
  );

  const triggerSnapshot = useCallback(async () => {
    // Prevent double-trigger
    if (snapshotState.status !== SNAPSHOT_STATE.IDLE &&
        snapshotState.status !== SNAPSHOT_STATE.SUCCESS &&
        snapshotState.status !== SNAPSHOT_STATE.ERROR) {
      return;
    }

    try {
      // ── PHASE 1: CAPTURE ──────────────────────────
      setSnapshotState(prev => ({
        ...prev,
        status: SNAPSHOT_STATE.CAPTURING,
        progress: 0,
        error: null
      }));

      // Capture snapshot synchronously
      // (just copies references — very fast)
      const snapshot = snapshotEngineRef.current.captureSnapshot();

      // Validate snapshot
      const validation = snapshotEngineRef.current
        .validateSnapshot(snapshot);

      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      // ── PHASE 2: COMPILE ──────────────────────────
      setSnapshotState(prev => ({
        ...prev,
        status: SNAPSHOT_STATE.COMPILING,
        progress: 5,
        lastSnapshot: {
          rowCount: snapshot.rowCount,
          sortConfig: snapshot.sortConfig,
          activeFilters: snapshot.activeFilters,
          searchQuery: snapshot.searchQuery,
          timestamp: snapshot.timestamp
        }
      }));

      // Choose compilation method:
      // Web Worker → if available (zero main thread impact)
      // IdleCallback → modern browsers without worker support
      // setTimeout chunks → universal fallback

      const csvString = await new Promise((resolve, reject) => {
        // Try Web Worker first
        try {
          const worker = new Worker(
            new URL('../workers/csvWorker.js', import.meta.url),
            { type: 'module' }
          );
          workerRef.current = worker;

          worker.onmessage = (e) => {
            if (e.data.type === 'progress') {
              setSnapshotState(prev => ({
                ...prev,
                progress: Math.max(5, e.data.progress)
              }));
            } else if (e.data.type === 'complete') {
              worker.terminate();
              workerRef.current = null;
              resolve(e.data.csv);
            } else if (e.data.type === 'error') {
              worker.terminate();
              workerRef.current = null;
              reject(new Error(e.data.message));
            }
          };

          worker.onerror = (err) => {
            worker.terminate();
            workerRef.current = null;
            // Fallback to idle callback
            fallbackCompile(snapshot, resolve, reject);
          };

          // Send data to worker
          worker.postMessage({
            data: snapshot.viewPool,
            columns: CSV_COLUMN_DEFINITIONS,
            snapshot: {
              timestamp: snapshot.timestamp,
              rowCount: snapshot.rowCount,
              totalMasterRows: snapshot.totalMasterRows,
              sortConfig: snapshot.sortConfig,
              activeFilters: snapshot.activeFilters,
              searchQuery: snapshot.searchQuery,
              isPaused: snapshot.isPaused
            }
          });

        } catch (workerError) {
          // Worker not available — use idle callback
          fallbackCompile(snapshot, resolve, reject);
        }

        // Fallback: requestIdleCallback / setTimeout
        function fallbackCompile(snap, res, rej) {
          cancelRef.current = compileCSVIdle(
            snap.viewPool,
            CSV_COLUMN_DEFINITIONS,
            snap,
            (progress) => {
              setSnapshotState(prev => ({
                ...prev,
                progress: Math.max(5, progress)
              }));
            },
            (csvString) => res(csvString)
          );
        }
      });

      // ── PHASE 3: DOWNLOAD ─────────────────────────
      setSnapshotState(prev => ({
        ...prev,
        status: SNAPSHOT_STATE.DOWNLOADING,
        progress: 100
      }));

      const filename = triggerDownload(csvString, snapshot);

      // ── PHASE 4: SUCCESS ──────────────────────────
      setSnapshotState(prev => ({
        ...prev,
        status: SNAPSHOT_STATE.SUCCESS,
        filename,
        progress: 100
      }));

      // Auto-reset to idle after 4 seconds
      setTimeout(() => {
        setSnapshotState(prev => ({
          ...prev,
          status: SNAPSHOT_STATE.IDLE,
          progress: 0
        }));
      }, 4000);

    } catch (error) {
      setSnapshotState(prev => ({
        ...prev,
        status: SNAPSHOT_STATE.ERROR,
        error: error.message,
        progress: 0
      }));

      // Auto-reset error after 5 seconds
      setTimeout(() => {
        setSnapshotState(prev => ({
          ...prev,
          status: SNAPSHOT_STATE.IDLE,
          error: null
        }));
      }, 5000);
    }
  }, [snapshotState.status]);

  // Cancel in-progress snapshot
  const cancelSnapshot = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current();
      cancelRef.current = null;
    }
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    setSnapshotState({
      status: SNAPSHOT_STATE.IDLE,
      progress: 0,
      lastSnapshot: null,
      error: null,
      filename: null
    });
  }, []);

  return {
    snapshotState,
    triggerSnapshot,
    cancelSnapshot
  };
};
