// src/utils/formatters.js

/**
 * Format a numeric value as USD currency.
 * Returns '—' for null/undefined/NaN values.
 */
export const formatCurrency = (value, locale = 'en-IN') => {
  if (value === null || value === undefined || isNaN(Number(value))) return '—';
  const num = Number(value);
  if (Math.abs(num) >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (Math.abs(num) >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Format a value as percentage with 2 decimal places.
 * Clamped to ±9999.99%.
 */
export const formatPercent = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) return '0.00%';
  const clamped = Math.max(-9999.99, Math.min(9999.99, Number(value)));
  return `${clamped.toFixed(2)}%`;
};

/**
 * Format an integer with locale-aware thousand separators.
 * Returns '—' for null/undefined.
 */
export const formatInteger = (value) => {
  if (!value && value !== 0) return '—';
  return Number(value).toLocaleString('en-IN');
};

/**
 * Format a date string to a human-readable format.
 * Returns '—' for invalid/missing dates.
 */
export const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format bytes to MB with 1 decimal place.
 */
export const formatBytes = (bytes) => {
  if (!bytes) return '—';
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

/**
 * Abbreviate large numbers for KPI display.
 */
export const formatKpiNumber = (value) => {
  if (value === null || value === undefined || isNaN(Number(value))) return '0';
  const num = Number(value);
  if (Math.abs(num) >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(num) >= 1_000_000)     return `${(num / 1_000_000).toFixed(2)}M`;
  if (Math.abs(num) >= 1_000)         return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString('en-IN');
};

/**
 * Get ROI color based on value.
 */
export const getRoiColor = (value) => {
  const num = Number(value);
  if (isNaN(num)) return '#94a3b8';
  if (num >= 200)  return '#22c55e';
  if (num >= 100)  return '#06b6d4';
  if (num >= 0)    return '#f59e0b';
  return '#ef4444';
};

/**
 * Get timestamp string for status bar.
 */
export const getTimestamp = () => {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

/**
 * Get UTC timestamp string.
 */
export const getUTCTimestamp = () => {
  return new Date().toUTCString().split(' ').slice(4, 5).join(' ') + ' UTC';
};
