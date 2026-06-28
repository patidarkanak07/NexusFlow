// src/hooks/useStreamData.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { stateEngine } from '../engine/stateEngine.js';

/**
 * React hook to subscribe to the StateEngine.
 * Returns the latest engine state snapshot.
 * Properly unsubscribes on unmount to prevent memory leaks.
 */
export const useStreamData = () => {
  const [state, setState] = useState(() => stateEngine.getState());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const unsubscribe = stateEngine.subscribe((newState) => {
      if (mountedRef.current) {
        setState(newState);
      }
    });

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, []);

  const togglePause = useCallback(() => {
    if (stateEngine.isPaused) {
      stateEngine.flush();
    } else {
      stateEngine.pause();
    }
  }, []);

  const setSort = useCallback((key, isMulti) => {
    stateEngine.setSort(key, isMulti);
  }, []);

  const setFilters = useCallback((filters) => {
    stateEngine.setFilters(filters);
  }, []);

  const setSearch = useCallback((query) => {
    stateEngine.setSearch(query);
  }, []);

  return {
    ...state,
    togglePause,
    setSort,
    setFilters,
    setSearch,
  };
};
