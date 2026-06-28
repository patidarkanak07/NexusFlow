// src/engine/sorter.js

/**
 * Multi-column sorter with type-aware comparison.
 * Accepts sortConfig: Array<{ key: string, direction: 'asc' | 'desc' }>
 */
export const multiSort = (data, sortConfig) => {
  if (!sortConfig || sortConfig.length === 0) return data;

  return [...data].sort((a, b) => {
    for (const { key, direction } of sortConfig) {
      let aVal = a[key];
      let bVal = b[key];

      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      const isNumeric = !isNaN(aNum) && !isNaN(bNum);

      let comparison = 0;
      if (isNumeric) {
        comparison = aNum - bNum;
      } else {
        comparison = String(aVal ?? '').localeCompare(String(bVal ?? ''));
      }

      if (comparison !== 0) {
        return direction === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
};

/**
 * Toggle sort state for a column key.
 * Cycle: none → asc → desc → none
 * With Shift, appends to multi-sort config.
 *
 * @param {Array} currentConfig - existing sort config array
 * @param {string} key - column key being clicked
 * @param {boolean} isMulti - whether Shift is held
 * @returns {Array} new sort config
 */
export const toggleSort = (currentConfig, key, isMulti) => {
  if (!isMulti) {
    // Single sort: find existing or create new
    const existing = currentConfig.find((c) => c.key === key);
    if (!existing) {
      return [{ key, direction: 'asc' }];
    } else if (existing.direction === 'asc') {
      return [{ key, direction: 'desc' }];
    } else {
      return []; // clear
    }
  } else {
    // Multi sort: append/toggle/remove
    const idx = currentConfig.findIndex((c) => c.key === key);
    if (idx === -1) {
      return [...currentConfig, { key, direction: 'asc' }];
    } else if (currentConfig[idx].direction === 'asc') {
      const next = [...currentConfig];
      next[idx] = { key, direction: 'desc' };
      return next;
    } else {
      return currentConfig.filter((c) => c.key !== key);
    }
  }
};
