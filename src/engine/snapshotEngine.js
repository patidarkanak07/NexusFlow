// src/engine/snapshotEngine.js
// This is the brain of Snapshot Export
// It captures the EXACT operator view state

export class SnapshotEngine {
  constructor(stateEngine) {
    this.stateEngine = stateEngine;
  }

  // Capture complete operator state at this moment
  captureSnapshot() {
    const timestamp = new Date().toISOString();

    // Step 1: Get the EXACT viewPool
    // This is already sorted + filtered + searched
    // by StateEngine._computeViewPool()
    const viewPool = [...this.stateEngine.viewPool];

    // Step 2: Capture active sort configuration
    const sortConfig = this.stateEngine.sortConfig.map(
      (sort, index) => ({
        priority: index + 1,      // ① ② ③
        column: sort.key,
        direction: sort.direction, // asc or desc
        label: this._formatSortLabel(sort)
      })
    );

    // Step 3: Capture active filters
    const activeFilters = Object.entries(
      this.stateEngine.filters
    )
    .filter(([, values]) => values && values.length > 0)
    .map(([key, values]) => ({
      column: key,
      selectedValues: values,
      count: values.length
    }));

    // Step 4: Capture active search query
    const searchQuery = this.stateEngine.searchQuery || '';

    // Step 5: Capture KPI state at snapshot time
    const kpiState = { ...this.stateEngine.kpiCounters };

    return {
      timestamp,
      viewPool,           // Sorted + filtered + searched data
      rowCount: viewPool.length,
      sortConfig,         // Active multi-column sort
      activeFilters,      // Active categorical filters
      searchQuery,        // Active search query
      kpiState,           // KPI values at snapshot time
      totalMasterRows: this.stateEngine.masterData.length,
      isPaused: this.stateEngine.isPaused,
    };
  }

  _formatSortLabel({ key, direction }) {
    return `${key} ${direction === 'asc' ? '↑' : '↓'}`;
  }

  // Verify snapshot data integrity
  validateSnapshot(snapshot) {
    if (!snapshot.viewPool || !Array.isArray(snapshot.viewPool)) {
      throw new Error('Invalid snapshot: viewPool is not array');
    }
    if (snapshot.rowCount === 0) {
      return { valid: false, reason: 'No rows match current filters' };
    }
    return { valid: true };
  }
}

export const createSnapshotEngine = (stateEngine) => {
  return new SnapshotEngine(stateEngine);
};
