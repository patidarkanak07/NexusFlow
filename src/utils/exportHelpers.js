// src/utils/exportHelpers.js

// Convert array of objects to CSV string
export const arrayToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(',');
  
  const dataRows = data.map(row => 
    headers.map(header => {
      const val = row[header];
      // Escape commas and quotes in values
      if (typeof val === 'string' && 
          (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val ?? '';
    }).join(',')
  );
  
  return [headerRow, ...dataRows].join('\n');
};

// Trigger browser download
export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoke URL to free memory
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

// Generate timestamp for filename
export const getExportTimestamp = () => {
  return new Date().toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19);
};
