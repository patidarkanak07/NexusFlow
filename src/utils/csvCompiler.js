// src/utils/csvCompiler.js
// Compiles data array into CSV string
// WITHOUT blocking the main thread

// All CSV column definitions with display labels
export const CSV_COLUMN_DEFINITIONS = [
  { key: 'project_id',             label: 'Project ID' },
  { key: 'project_name',           label: 'Project Name' },
  { key: 'company_id',             label: 'Company ID' },
  { key: 'project_status',         label: 'Project Status' },
  { key: 'automation_type',        label: 'Automation Type' },
  { key: 'department',             label: 'Department' },
  { key: 'industry',               label: 'Industry' },
  { key: 'country',                label: 'Country' },
  { key: 'implementation_partner', label: 'Implementation Partner' },
  { key: 'robots_deployed',        label: 'Robots Deployed' },
  { key: 'annual_savings_usd',     label: 'Annual Savings (USD)' },
  { key: 'budget_usd',             label: 'Budget (USD)' },
  { key: 'roi_percent',            label: 'ROI (%)' },
  { key: 'employee_hours_saved',   label: 'Employee Hours Saved' },
  { key: 'start_date',             label: 'Start Date' },
  { key: 'end_date',               label: 'End Date' },
];

// Escape a single CSV cell value
export const escapeCSVCell = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // If contains comma, quote, or newline → wrap in quotes
  if (
    str.includes(',') ||
    str.includes('"') ||
    str.includes('\n') ||
    str.includes('\r')
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Build the CSV header row
export const buildCSVHeader = (columns, snapshot) => {
  // Main header row with column names
  const headerRow = columns
    .map(col => escapeCSVCell(col.label))
    .join(',');

  // Metadata rows at top of CSV
  const metaRows = [
    `# NexusFlow Snapshot Export`,
    `# Generated: ${new Date(snapshot.timestamp).toLocaleString('en-IN')}`,
    `# Total Rows: ${snapshot.rowCount}`,
    `# From Master Dataset: ${snapshot.totalMasterRows} rows`,
    snapshot.sortConfig.length > 0
      ? `# Sort Applied: ${snapshot.sortConfig
          .map(s => `${s.priority}. ${s.label}`)
          .join(' | ')}`
      : `# Sort Applied: None`,
    snapshot.activeFilters.length > 0
      ? `# Filters Applied: ${snapshot.activeFilters
          .map(f => `${f.column}(${f.selectedValues.join('/')})`)
          .join(' + ')}`
      : `# Filters Applied: None`,
    snapshot.searchQuery
      ? `# Search Query: "${snapshot.searchQuery}"`
      : `# Search Query: None`,
    `# Stream Status: ${snapshot.isPaused ? 'PAUSED' : 'LIVE'}`,
    `#`,  // Empty separator line
  ].join('\n');

  return metaRows + '\n' + headerRow;
};

// Convert single row to CSV line
export const rowToCSVLine = (row, columns) => {
  return columns
    .map(col => escapeCSVCell(row[col.key]))
    .join(',');
};

// NON-BLOCKING chunked CSV compilation
// Uses setTimeout to yield to event loop
// This prevents freezing the stream
export const compileCSVNonBlocking = (
  data,
  columns,
  snapshot,
  onProgress,
  onComplete
) => {
  const CHUNK_SIZE = 500; // Process 500 rows per chunk
  const lines = [buildCSVHeader(columns, snapshot)];
  let currentIndex = 0;
  let cancelled = false;

  const processChunk = () => {
    if (cancelled) return;

    const endIndex = Math.min(
      currentIndex + CHUNK_SIZE,
      data.length
    );

    // Process this chunk
    for (let i = currentIndex; i < endIndex; i++) {
      lines.push(rowToCSVLine(data[i], columns));
    }

    currentIndex = endIndex;

    // Report progress (0 to 100)
    const progress = Math.round((currentIndex / data.length) * 100);
    onProgress(progress);

    if (currentIndex < data.length) {
      // Yield to event loop before next chunk
      // This is what prevents freezing!
      setTimeout(processChunk, 0);
    } else {
      // All chunks done — compile final string
      const csvString = lines.join('\n');
      onComplete(csvString);
    }
  };

  // Start processing
  processChunk();

  // Return cancel function
  return () => { cancelled = true; };
};

// requestIdleCallback version for modern browsers
// Even better — only runs when browser is idle
export const compileCSVIdle = (
  data,
  columns,
  snapshot,
  onProgress,
  onComplete
) => {
  const CHUNK_SIZE = 1000;
  const lines = [buildCSVHeader(columns, snapshot)];
  let currentIndex = 0;
  let idleId = null;
  let cancelled = false;

  const processChunk = (deadline) => {
    if (cancelled) return;

    // Process chunks while browser has idle time
    while (
      currentIndex < data.length &&
      (deadline.timeRemaining() > 1 || deadline.didTimeout)
    ) {
      const endIndex = Math.min(
        currentIndex + CHUNK_SIZE,
        data.length
      );

      for (let i = currentIndex; i < endIndex; i++) {
        lines.push(rowToCSVLine(data[i], columns));
      }

      currentIndex = endIndex;
    }

    const progress = Math.round((currentIndex / data.length) * 100);
    onProgress(progress);

    if (currentIndex < data.length) {
      // Schedule next idle chunk
      idleId = requestIdleCallback(processChunk, { timeout: 100 });
    } else {
      const csvString = lines.join('\n');
      onComplete(csvString);
    }
  };

  // Check if browser supports requestIdleCallback
  if ('requestIdleCallback' in window) {
    idleId = requestIdleCallback(processChunk, { timeout: 100 });
  } else {
    // Fallback to setTimeout version
    return compileCSVNonBlocking(
      data, columns, snapshot, onProgress, onComplete
    );
  }

  return () => {
    cancelled = true;
    if (idleId) cancelIdleCallback(idleId);
  };
};
