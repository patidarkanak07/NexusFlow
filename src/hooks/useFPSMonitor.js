// src/hooks/useFPSMonitor.js
import { useState, useEffect, useRef } from 'react';

/**
 * Measures real-time FPS using requestAnimationFrame timestamps.
 * Returns smoothed FPS integer (60-sample rolling average).
 */
export const useFPSMonitor = () => {
  const [fps, setFps] = useState(60);
  const frameTimesRef = useRef([]);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const measure = (now) => {
      if (!mountedRef.current) return;

      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (delta > 0) {
        frameTimesRef.current.push(delta);
        if (frameTimesRef.current.length > 60) {
          frameTimesRef.current.shift();
        }
      }

      // Update display every ~15 frames
      if (frameTimesRef.current.length % 15 === 0) {
        const avg =
          frameTimesRef.current.reduce((a, b) => a + b, 0) /
          frameTimesRef.current.length;
        const currentFps = Math.min(60, Math.round(1000 / avg));
        setFps(currentFps);
      }

      rafRef.current = requestAnimationFrame(measure);
    };

    rafRef.current = requestAnimationFrame(measure);

    return () => {
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return fps;
};
