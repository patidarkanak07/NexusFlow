// src/hooks/useFPSMonitor.js
import { useState, useEffect, useRef } from 'react';

export const useFPSMonitor = () => {
  const [fps, setFps] = useState(60);
  const frameTimestamps = useRef([]);
  const rafRef = useRef();

  useEffect(() => {
    const measureFPS = (timestamp) => {
      frameTimestamps.current.push(timestamp);
      
      // Keep only last 1 second of frames
      frameTimestamps.current = frameTimestamps.current
        .filter(t => timestamp - t < 1000);
      
      setFps(frameTimestamps.current.length);
      rafRef.current = requestAnimationFrame(measureFPS);
    };

    rafRef.current = requestAnimationFrame(measureFPS);
    
    // Cleanup on unmount — prevent memory leak
    return () => {
      cancelAnimationFrame(rafRef.current);
      frameTimestamps.current = [];
    };
  }, []);

  return fps;
};
