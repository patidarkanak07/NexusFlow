// src/engine/fuzzySearch.js

/**
 * Multi-field fuzzy search engine.
 * All terms must match (space-delimited split).
 * Searches across key fields without external dependencies.
 */
export const fuzzySearch = (data, query) => {
  if (!query || !query.trim()) return data;

  const terms = query.toLowerCase().trim().split(/\s+/);

  const searchFields = [
    'project_name',
    'company_id',
    'implementation_partner',
    'country',
    'project_id',
    'department',
    'industry',
    'automation_type',
  ];

  return data.filter((row) => {
    const rowText = searchFields
      .map((field) => String(row[field] || ''))
      .join(' ')
      .toLowerCase();

    // All terms must appear somewhere (order doesn't matter)
    return terms.every((term) => rowText.includes(term));
  });
};

/**
 * Creates a debounced version of the provided function.
 * Prevents blocking during rapid typing.
 */
export const createDebouncedSearch = (fn, delay = 120) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
