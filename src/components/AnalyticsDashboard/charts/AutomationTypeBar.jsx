// src/components/AnalyticsDashboard/charts/AutomationTypeBar.jsx
import React, { memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { aggregateByAutomationType, CHART_COLORS, CHART_BORDERS } from '../aggregators/dataAggregator.js';

const AutomationTypeBar = memo(({ data = [] }) => {
  const { labels, values } = aggregateByAutomationType(data);

  const chartData = {
    labels,
    datasets: [{
      label: 'Projects by Automation Type',
      data: values,
      backgroundColor: CHART_COLORS,
      borderColor: CHART_BORDERS,
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeOutQuart',
      y: {
        from: (ctx) => ctx.chart.scales.y.getPixelForValue(0)
      }
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'AUTOMATION TYPE DISTRIBUTION',
        color: '#06b6d4',
        font: { size: 10, weight: 'bold', family: 'JetBrains Mono' },
        letterSpacing: '2px',
        padding: { bottom: 12 }
      },
      tooltip: {
        backgroundColor: 'rgba(13,20,38,0.95)',
        borderColor: 'rgba(59,130,246,0.5)',
        borderWidth: 1,
        titleColor: '#06b6d4',
        bodyColor: '#f1f5f9',
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} projects`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { 
          color: '#64748b', 
          font: { size: 8 },
          maxRotation: 30
        }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 9 } },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ height: '240px', position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
});

AutomationTypeBar.displayName = 'AutomationTypeBar';
export default AutomationTypeBar;
