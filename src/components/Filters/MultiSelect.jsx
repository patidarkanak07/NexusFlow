// src/components/Filters/MultiSelect.jsx
import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

const MultiSelect = memo(({ label, options = [], selected = [], onChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (option) => {
    const isSelected = selected.includes(option);
    const nextSelected = isSelected
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    onChange(nextSelected);
  };

  return (
    <div className="filter-select-wrapper" ref={containerRef}>
      <button
        type="button"
        className={`filter-btn ${isOpen ? 'open' : ''} ${selected.length > 0 ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        {selected.length > 0 && (
          <span className="filter-count-badge">{selected.length}</span>
        )}
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="dropdown-menu"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {selected.length > 0 && (
              <div className="flex justify-between items-center px-2 py-1 border-b border-gray-800 mb-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Filter Options</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <X size={10} /> Clear
                </button>
              </div>
            )}
            <div className="max-h-[200px] overflow-y-auto">
              {options.map((option) => {
                const isChecked = selected.includes(option);
                return (
                  <motion.label
                    key={option}
                    whileHover={{ backgroundColor: 'rgba(59,130,246,0.1)', x: 4 }}
                    transition={{ duration: 0.1 }}
                    className="dropdown-option"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleOption(option)}
                    />
                    <span>{option}</span>
                  </motion.label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

MultiSelect.displayName = 'MultiSelect';
export default MultiSelect;
