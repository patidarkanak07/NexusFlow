// src/components/Filters/FilterPanel.jsx
import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, RotateCcw, X } from 'lucide-react';
import MultiSelect from './MultiSelect.jsx';
import {
  AUTOMATION_TYPES,
  DEPARTMENTS,
  INDUSTRIES,
  COUNTRIES,
  PROJECT_STATUSES
} from '../../utils/constants.js';
import './Filters.css';

const FilterPanel = memo(({ filters = {}, onFilterChange }) => {
  const handleSelectChange = useCallback((key, selectedValues) => {
    onFilterChange({
      ...filters,
      [key]: selectedValues
    });
  }, [filters, onFilterChange]);

  const handleClearField = useCallback((key) => {
    const nextFilters = { ...filters };
    delete nextFilters[key];
    onFilterChange(nextFilters);
  }, [filters, onFilterChange]);

  const handleClearAll = useCallback(() => {
    onFilterChange({});
  }, [onFilterChange]);

  // Compute total active filter tags
  const activeChips = [];
  Object.entries(filters).forEach(([key, values]) => {
    if (values && values.length > 0) {
      values.forEach((val) => {
        activeChips.push({ key, val });
      });
    }
  });

  return (
    <div className="flex flex-col flex-shrink-0">
      <div className="filter-bar">
        <div className="filters-label">
          <Filter size={13} className="text-accent-blue" />
          <span>Filters</span>
        </div>

        <MultiSelect
          label="Automation Type"
          options={AUTOMATION_TYPES}
          selected={filters.automation_type || []}
          onChange={(vals) => handleSelectChange('automation_type', vals)}
          onClear={() => handleClearField('automation_type')}
        />

        <MultiSelect
          label="Department"
          options={DEPARTMENTS}
          selected={filters.department || []}
          onChange={(vals) => handleSelectChange('department', vals)}
          onClear={() => handleClearField('department')}
        />

        <MultiSelect
          label="Industry"
          options={INDUSTRIES}
          selected={filters.industry || []}
          onChange={(vals) => handleSelectChange('industry', vals)}
          onClear={() => handleClearField('industry')}
        />

        <MultiSelect
          label="Country"
          options={COUNTRIES}
          selected={filters.country || []}
          onChange={(vals) => handleSelectChange('country', vals)}
          onClear={() => handleClearField('country')}
        />

        <MultiSelect
          label="Status"
          options={PROJECT_STATUSES}
          selected={filters.project_status || []}
          onChange={(vals) => handleSelectChange('project_status', vals)}
          onClear={() => handleClearField('project_status')}
        />

        {activeChips.length > 0 && (
          <button
            type="button"
            className="clear-all-filters-btn ml-auto"
            onClick={handleClearAll}
          >
            <RotateCcw size={11} /> Clear All
          </button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="filter-chips-container">
          <span className="text-[10px] uppercase font-bold text-gray-500 mr-2">Active:</span>
          <AnimatePresence>
            {activeChips.map(({ key, val }) => (
              <motion.div
                key={`${key}-${val}`}
                className="filter-chip"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                layout
              >
                <span>{val}</span>
                <X
                  size={12}
                  className="hover:text-accent-red cursor-pointer"
                  onClick={() => {
                    const currentVals = filters[key] || [];
                    handleSelectChange(key, currentVals.filter((v) => v !== val));
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
});

FilterPanel.displayName = 'FilterPanel';
export default FilterPanel;
