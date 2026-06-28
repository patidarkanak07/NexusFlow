// src/hooks/useKeyboardShortcuts.js
import { useEffect } from 'react';

export const useKeyboardShortcuts = ({
  onPauseToggle,
  onSearchFocus,
  onAnalyticsOpen,
  onCloseAll,
  onExportCSV,
  onExportJSON,
  onClearFilters,
  onNavigateRow,
  onLayoutToggle,
  onSnapshotExport,
  isPaused,
  hasOpenPanel
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in input
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT']
        .includes(e.target.tagName);

      // Space → Pause/Play (not when typing)
      if (e.code === 'Space' && !isTyping) {
        e.preventDefault();
        onPauseToggle();
        return;
      }

      // Ctrl+S → Snapshot Export
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        onSnapshotExport();
        return;
      }

      // / → Focus search
      if (e.key === '/' && !isTyping) {
        e.preventDefault();
        onSearchFocus();
        return;
      }

      // A → Analytics (only when paused)
      if (e.key === 'a' && !isTyping && isPaused) {
        onAnalyticsOpen();
        return;
      }

      // Escape → Close panels
      if (e.key === 'Escape') {
        onCloseAll();
        return;
      }

      // Ctrl+E → Export CSV
      if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        onExportCSV();
        return;
      }

      // Ctrl+J → Export JSON
      if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        onExportJSON();
        return;
      }

      // Ctrl+K → Clear filters
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        onClearFilters();
        return;
      }

      // Arrow navigation (when panel open)
      if (e.key === 'ArrowUp' && hasOpenPanel) {
        e.preventDefault();
        onNavigateRow('prev');
        return;
      }
      if (e.key === 'ArrowDown' && hasOpenPanel) {
        e.preventDefault();
        onNavigateRow('next');
        return;
      }

      // Number keys → Layout toggles
      if (['1','2','3','4'].includes(e.key) && !isTyping) {
        onLayoutToggle(parseInt(e.key));
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onPauseToggle,
    onSearchFocus,
    onAnalyticsOpen,
    onCloseAll,
    onExportCSV,
    onExportJSON,
    onClearFilters,
    onNavigateRow,
    onLayoutToggle,
    onSnapshotExport,
    isPaused,
    hasOpenPanel
  ]);
};
