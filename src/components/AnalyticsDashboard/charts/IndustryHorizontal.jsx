// src/components/AnalyticsDashboard/charts/IndustryHorizontal.jsx
import React, { memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { aggregateROIByIndustry } from '../aggregators/dataAggregator.js';

const IndustryHorizontal = memo(({ data = [] }) => {
  const { labels, values } = aggregateROIByIndustry(data);

  const chartData = {
    labels,
    datasets: [{
      label: 'Average ROI %',
      data: values,
      backgroundColor: values.map(v => 
        v >= 0 
          ? 'rgba(34, 197, 94, 0.7)' 
          : 'rgba(239, 68, 68, 0.7)'
      ),
      borderColor: values.map(v => 
        v >= 0 ? 'rgba(34,197,94,1)' : 'rgba(239,68,68,1)'
      ),
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  const options = {
    indexAxis: 'y',     // Makes it HORIZONTAL
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
      x: {
        from: (ctx) => ctx.chart.scales.x.getPixelForValue(0)
      }
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'AVERAGE ROI % BY INDUSTRY',
        color: '#06b6d4',
        font: { size: 10, weight: 'bold', family: 'JetBrains Mono' },
        padding: { bottom: 12 }
      },
      tooltip: {
        backgroundColor: 'rgba(13,20,38,0.95)',
        borderColor: 'rgba(59,130,246,0.5)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ROI: ${ctx.parsed.x.toFixed(2)}%`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { 
          color: '#64748b', 
          font: { size: 9 },
          callback: (v) => `${v}%`
        }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { size: 8 } }
      }
    }
  };

  return (
    <div style={{ height: '240px', position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
});

IndustryHorizontal.displayName = 'IndustryHorizontal';
export default IndustryHorizontal;
