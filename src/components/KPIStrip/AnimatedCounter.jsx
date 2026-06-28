// src/components/KPIStrip/AnimatedCounter.jsx
import React, { useState, useEffect, useRef, memo } from 'react';
import { COUNTER_DURATION_MS } from '../../utils/constants.js';

/**
 * Animated number counter using requestAnimationFrame.
 * Smoothly tweens from old value to new value using cubic ease-out.
 */
const AnimatedCounter = memo(({ value = 0, prefix = '', suffix = '', className = '' }) => {
  const [display, setDisplay] = useState(0);
  const animRef = useRef(null);
  const prevValue = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const startTime = performance.now();

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const animate = (currentTime) => {
      if (!mountedRef.current) return;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / COUNTER_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out

      setDisplay(Math.floor(start + (end - start) * eased));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        prevValue.current = end;
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [value]);

  return (
    <span className={`counter font-mono ${className}`}>
      {prefix}
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
});

AnimatedCounter.displayName = 'AnimatedCounter';
export default AnimatedCounter;
