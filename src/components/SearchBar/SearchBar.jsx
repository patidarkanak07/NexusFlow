// src/components/SearchBar/SearchBar.jsx
import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { createDebouncedSearch } from '../../engine/fuzzySearch.js';
import { SEARCH_DEBOUNCE_MS } from '../../utils/constants.js';
import './SearchBar.css';

const SearchBar = memo(({ onSearch, resultCount = 0 }) => {
  const [query, setQuery] = useState('');
  const debouncedRef = useRef(null);

  useEffect(() => {
    debouncedRef.current = createDebouncedSearch((q) => onSearch(q), SEARCH_DEBOUNCE_MS);
  }, [onSearch]);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setQuery(val);
    debouncedRef.current?.(val);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="search-wrapper">
      <Search className="search-icon" size={14} />
      <input
        id="nexusflow-search"
        className="search-input"
        placeholder="Search projects, companies, partners, countries..."
        value={query}
        onChange={handleChange}
        autoComplete="off"
        spellCheck={false}
      />
      <AnimatePresence>
        {query && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={clearSearch}
            className="clear-btn"
            aria-label="Clear search"
          >
            <X size={11} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.span
          key={resultCount}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 5, opacity: 0 }}
          className="result-count"
        >
          {resultCount.toLocaleString('en-IN')}
        </motion.span>
      </AnimatePresence>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;
