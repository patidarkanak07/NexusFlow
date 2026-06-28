// src/utils/performanceHelpers.js

export const measureRenderTime = (callback) => {
  const start = performance.now();
  callback();
  return performance.now() - start;
};

export const getDOMNodeCount = () => {
  return document.querySelectorAll('*').length;
};

export const getHealthStatus = (fps, memoryPercent) => {
  if (fps >= 55 && memoryPercent < 60) return 'HEALTHY';
  if (fps >= 30 && memoryPercent < 80) return 'WARNING';
  return 'CRITICAL';
};
