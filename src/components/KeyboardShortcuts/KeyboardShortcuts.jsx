// src/components/KeyboardShortcuts/KeyboardShortcuts.jsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import ShortcutsPanel from './ShortcutsPanel.jsx';
import './KeyboardShortcuts.css';

export const ShortcutsButton = memo(({ onClick }) => {
  return (
    <motion.button
      type="button"
      className="shortcuts-trigger-btn"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Keyboard Shortcuts (?)"
    >
      <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 'bold' }}>
        ?
      </span>
    </motion.button>
  );
});

ShortcutsButton.displayName = 'ShortcutsButton';

export { ShortcutsPanel };
export default ShortcutsPanel;
