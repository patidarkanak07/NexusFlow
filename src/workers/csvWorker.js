// src/workers/csvWorker.js
// Runs in separate thread — completely isolated
// Main thread (stream, grid, KPIs) unaffected

self.onmessage = (event) => {
  const { data, columns, snapshot } = event.data;

  try {
    // Build header with metadata
    const metaLines = [
      '# NexusFlow Snapshot Export',
      `# Generated: ${new Date(snapshot.timestamp).toLocaleString('en-IN')}`,
      `# Total Rows: ${snapshot.rowCount}`,
      `# From Master Dataset: ${snapshot.totalMasterRows} rows`,
      snapshot.sortConfig.length > 0
        ? `# Sort Applied: ${snapshot.sortConfig
            .map(s => `${s.priority}. ${s.label}`)
            .join(' | ')}`
        : '# Sort Applied: None',
      snapshot.activeFilters.length > 0
        ? `# Filters Applied: ${snapshot.activeFilters
            .map(f => `${f.column}(${f.selectedValues.join('/')})`)
            .join(' + ')}`
        : '# Filters Applied: None',
      snapshot.searchQuery
        ? `# Search Query: "${snapshot.searchQuery}"`
        : '# Search Query: None',
      `# Stream Status: ${snapshot.isPaused ? 'PAUSED' : 'LIVE'}`,
      '#',
    ];

    const headerRow = columns
      .map(col => escapeCell(col.label))
      .join(',');

    const lines = [...metaLines, headerRow];

    // Process all rows in worker thread
    // Main thread completely unaffected
    const CHUNK = 1000;
    for (let i = 0; i < data.length; i += CHUNK) {
      const chunk = data.slice(i, i + CHUNK);
      chunk.forEach(row => {
        lines.push(
          columns
            .map(col => escapeCell(row[col.key]))
            .join(',')
        );
      });

      // Report progress back to main thread
      const progress = Math.round(
        (Math.min(i + CHUNK, data.length) / data.length) * 100
      );
      self.postMessage({ type: 'progress', progress });
    }

    // Send completed CSV back to main thread
    self.postMessage({
      type: 'complete',
      csv: lines.join('\n'),
      rowCount: data.length
    });

  } catch (error) {
    self.postMessage({
      type: 'error',
      message: error.message
    });
  }
};

// Cell escaper (duplicated in worker — workers are isolated)
function escapeCell(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (
    str.includes(',') ||
    str.includes('"') ||
    str.includes('\n')
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
