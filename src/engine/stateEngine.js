// src/engine/stateEngine.js
import { fuzzySearch } from './fuzzySearch.js';
import { multiSort } from './sorter.js';
import { MASTER_DATA_CAP, MASTER_DATA_TRIM } from '../utils/constants.js';

/**
 * Singleton StateEngine — central hub for all data flow.
 * No React dependencies — pure JS for max performance.
 */
class StateEngine {
  constructor() {
    this.masterData = [];
    this.viewPool = [];
    this.pauseQueue = [];
    this.isPaused = false;
    this.sortConfig = [];
    this.filters = {};
    this.searchQuery = '';
    this.subscribers = new Set();
    this.kpiCounters = {
      totalRowsProcessed: 0,
      activeRobotsDeployed: 0,
      globalCumulativeSavings: 0,
    };
    this.kpiHistory = {
      totalRowsProcessed: [],
      activeRobotsDeployed: [],
      globalCumulativeSavings: [],
    };
    this.updateScheduled = false;
    this.lastUpdateTime = 0;
  }

  // ─── Public API ─────────────────────────────────────────

  process(incomingBatch) {
    if (!Array.isArray(incomingBatch) || incomingBatch.length === 0) return;
    if (this.isPaused) {
      this.pauseQueue.push(...incomingBatch);
      // Still notify subscribers to update queue counter
      this._scheduleUpdate(true);
      return;
    }
    this._mergeBatch(incomingBatch);
    this._scheduleUpdate();
  }

  flush() {
    if (this.pauseQueue.length > 0) {
      this._mergeBatch(this.pauseQueue);
      this.pauseQueue = [];
    }
    this.isPaused = false;
    this._scheduleUpdate();
  }

  pause() {
    this.isPaused = true;
  }

  setSort(key, isMulti) {
    const { toggleSort } = require('./sorter.js');
    // dynamic import to avoid circular — use inline logic instead
    if (!isMulti) {
      const existing = this.sortConfig.find((c) => c.key === key);
      if (!existing) {
        this.sortConfig = [{ key, direction: 'asc' }];
      } else if (existing.direction === 'asc') {
        this.sortConfig = [{ key, direction: 'desc' }];
      } else {
        this.sortConfig = [];
      }
    } else {
      const idx = this.sortConfig.findIndex((c) => c.key === key);
      if (idx === -1) {
        this.sortConfig = [...this.sortConfig, { key, direction: 'asc' }];
      } else if (this.sortConfig[idx].direction === 'asc') {
        const next = [...this.sortConfig];
        next[idx] = { key, direction: 'desc' };
        this.sortConfig = next;
      } else {
        this.sortConfig = this.sortConfig.filter((c) => c.key !== key);
      }
    }
    this._computeViewPool();
    this._notifySubscribers();
  }

  setFilters(filters) {
    this.filters = { ...filters };
    this._computeViewPool();
    this._notifySubscribers();
  }

  setSearch(query) {
    this.searchQuery = query;
    this._computeViewPool();
    this._notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getState() {
    return {
      viewPool: this.viewPool,
      kpiCounters: { ...this.kpiCounters },
      kpiHistory: {
        totalRowsProcessed: [...this.kpiHistory.totalRowsProcessed],
        activeRobotsDeployed: [...this.kpiHistory.activeRobotsDeployed],
        globalCumulativeSavings: [...this.kpiHistory.globalCumulativeSavings],
      },
      pauseQueueSize: this.pauseQueue.length,
      isPaused: this.isPaused,
      sortConfig: [...this.sortConfig],
      totalRows: this.masterData.length,
      filteredRows: this.viewPool.length,
    };
  }

  // ─── Internal Methods ────────────────────────────────────

  _mergeBatch(batch) {
    // Update KPI counters
    batch.forEach((row) => {
      this.kpiCounters.totalRowsProcessed++;
      this.kpiCounters.activeRobotsDeployed += parseInt(row.robots_deployed) || 0;
      this.kpiCounters.globalCumulativeSavings += parseFloat(row.annual_savings_usd) || 0;
    });

    // Track sparkline history (last 20 snapshots)
    const pushHistory = (key) => {
      const hist = this.kpiHistory[key];
      hist.push(this.kpiCounters[key]);
      if (hist.length > 20) hist.shift();
    };
    pushHistory('totalRowsProcessed');
    pushHistory('activeRobotsDeployed');
    pushHistory('globalCumulativeSavings');

    // Merge by project_id (upsert)
    const map = new Map(this.masterData.map((r) => [r.project_id, r]));
    batch.forEach((row) => map.set(row.project_id, { ...map.get(row.project_id), ...row }));
    this.masterData = Array.from(map.values());

    // Memory cap — prevent heap bloat
    if (this.masterData.length > MASTER_DATA_CAP) {
      this.masterData = this.masterData.slice(-MASTER_DATA_TRIM);
    }
  }

  _scheduleUpdate(queueOnly = false) {
    if (this.updateScheduled) return;
    this.updateScheduled = true;
    requestAnimationFrame(() => {
      if (!queueOnly) {
        this._computeViewPool();
      }
      this._notifySubscribers();
      this.updateScheduled = false;
      this.lastUpdateTime = performance.now();
    });
  }

  _computeViewPool() {
    let result = [...this.masterData];

    // Apply categorical filters
    Object.entries(this.filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        result = result.filter((row) => values.includes(row[key]));
      }
    });

    // Apply fuzzy search
    if (this.searchQuery.trim()) {
      result = fuzzySearch(result, this.searchQuery);
    }

    // Apply multi-column sort
    if (this.sortConfig.length > 0) {
      result = multiSort(result, this.sortConfig);
    }

    this.viewPool = result;
  }

  _notifySubscribers() {
    if (this.subscribers.size === 0) return;
    const state = this.getState();
    this.subscribers.forEach((callback) => {
      try {
        callback(state);
      } catch (e) {
        // Prevent one bad subscriber from breaking others
        console.error('[StateEngine] Subscriber error:', e);
      }
    });
  }
}

// Singleton export
export const stateEngine = new StateEngine();
