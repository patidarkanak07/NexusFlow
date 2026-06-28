// src/hooks/useRowInspector.js
import { useState, useCallback } from 'react';

export const useRowInspector = () => {
  const [inspectorState, setInspectorState] = useState({
    isOpen: false,
    selectedRow: null,
    openedAt: null,        // Timestamp when opened
    animationPhase: 'idle' // idle | entering | open | exiting
  });

  const openInspector = useCallback((rowData) => {
    setInspectorState({
      isOpen: true,
      selectedRow: structuredClone(rowData), // Deep copy — fully isolated
      openedAt: new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }),
      animationPhase: 'entering'
    });
  }, []);

  const closeInspector = useCallback(() => {
    setInspectorState(prev => ({
      ...prev,
      animationPhase: 'exiting'
    }));
    // Wait for exit animation then fully close
    setTimeout(() => {
      setInspectorState({
        isOpen: false,
        selectedRow: null,
        openedAt: null,
        animationPhase: 'idle'
      });
    }, 400);
  }, []);

  return { inspectorState, openInspector, closeInspector };
};
