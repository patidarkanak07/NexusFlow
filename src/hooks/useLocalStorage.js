// src/hooks/useLocalStorage.js
import { useState, useCallback } from 'react';

/**
 * Hook to persist state in localStorage.
 * Survives hard refreshes.
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setAndPersist = useCallback(
    (newValue) => {
      try {
        const valueToStore =
          newValue instanceof Function ? newValue(value) : newValue;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error('[useLocalStorage]', error);
      }
    },
    [key, value]
  );

  return [value, setAndPersist];
};
