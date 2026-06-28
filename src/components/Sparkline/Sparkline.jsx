// src/components/Sparkline/Sparkline.jsx
import React, { memo, useMemo } from 'react';

const Sparkline = memo(({ data = [], color = '#3b82f6', width = 80, height = 30 }) => {
  const path = useMemo(() => {
    if (!data || data.length < 2) return '';

    const validData = data.filter((v) => typeof v === 'number' && isFinite(v));
    if (validData.length < 2) return '';

    const min = Math.min(...validData);
    const max = Math.max(...validData);
    const range = max - min || 1;

    const pts = validData.map((v, i) => {
      const x = (i / (validData.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${pts.join(' L ')}`;
  }, [data, width, height]);

  const fillPath = useMemo(() => {
    if (!path) return '';
    return `${path} L ${width},${height} L 0,${height} Z`;
  }, [path, width, height]);

  if (!path) return null;

  const gradId = `spark-grad-${color.replace('#', '')}`;

  return (
    <svg
      className="sparkline-svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradId})`} stroke="none" />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

Sparkline.displayName = 'Sparkline';
export default Sparkline;
