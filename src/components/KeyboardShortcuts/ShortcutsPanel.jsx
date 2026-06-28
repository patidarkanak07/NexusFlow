// src/components/KeyboardShortcuts/ShortcutsPanel.jsx
import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './KeyboardShortcuts.css';

export const ShortcutsPanel = memo(({ isOpen, onClose }) => {
  const shortcuts = [
    { keys: ['Space'], action: 'Pause / Resume Stream', category: 'Stream' },
    { keys: ['/'], action: 'Focus Search Bar', category: 'Navigation' },
    { keys: ['A'], action: 'Open Analytics View (paused only)', category: 'Views' },
    { keys: ['Esc'], action: 'Close All Panels', category: 'Navigation' },
    { keys: ['?'], action: 'Toggle This Help Panel', category: 'Help' },
    { keys: ['Ctrl', 'S'], action: 'Snapshot Export (sorted + filtered)', category: 'Export' },
    { keys: ['Ctrl', 'E'], action: 'Export as CSV', category: 'Export' },
    { keys: ['Ctrl', 'J'], action: 'Export as JSON', category: 'Export' },
    { keys: ['Ctrl', 'K'], action: 'Clear All Filters', category: 'Filters' },
    { keys: ['↑'], action: 'Previous Row (Inspector Open)', category: 'Navigation' },
    { keys: ['↓'], action: 'Next Row (Inspector Open)', category: 'Navigation' },
    { keys: ['1'], action: 'Toggle KPI Strip', category: 'Layout' },
    { keys: ['2'], action: 'Toggle Filter Panel', category: 'Layout' },
    { keys: ['3'], action: 'Toggle Grid Panel', category: 'Layout' },
    { keys: ['4'], action: 'Toggle Analytics Sidebar', category: 'Layout' },
  ];

  const categories = [...new Set(shortcuts.map(s => s.category))];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            className="shortcuts-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Shortcuts panel content */}
          <motion.div
            className="shortcuts-panel"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ 
              type: 'spring', 
              stiffness: 400, 
              damping: 30 
            }}
          >
            <div className="shortcuts-header font-mono">
              <span>⌨️ KEYBOARD SHORTCUTS</span>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 90 }}
                onClick={onClose}
              >
                <X size={14} />
              </motion.button>
            </div>

            {categories.map(category => (
              <div key={category} className="shortcuts-category">
                <div className="shortcuts-category-label">
                  {category}
                </div>
                {shortcuts
                  .filter(s => s.category === category)
                  .map((shortcut, idx) => (
                    <motion.div
                      key={idx}
                      className="shortcut-row"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(59,130,246,0.08)',
                        x: 4
                      }}
                    >
                      <div className="shortcut-keys font-mono">
                        {shortcut.keys.map((key, ki) => (
                          <span key={ki}>
                            <kbd className="kbd">{key}</kbd>
                            {ki < shortcut.keys.length - 1 && (
                              <span className="kbd-plus">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="shortcut-action">
                        {shortcut.action}
                      </span>
                    </motion.div>
                  ))
                }
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

ShortcutsPanel.displayName = 'ShortcutsPanel';
export default ShortcutsPanel;
