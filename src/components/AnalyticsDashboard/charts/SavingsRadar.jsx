// src/components/AnalyticsDashboard/charts/SavingsRadar.jsx
import React, { memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { aggregateSavingsByDepartment, CHART_COLORS, CHART_BORDERS } from '../aggregators/dataAggregator.js';

const SavingsByDept = memo(({ data = [] }) => {
  const { labels, values } = aggregateSavingsByDepartment(data);

  const chartData = {
    labels,
    datasets: [{
      label: 'Annual Savings (USD)',
      data: values,
      backgroundColor: CHART_COLORS,
      borderColor: CHART_BORDERS,
      borderWidth: 1,
      borderRadius: 6,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: 'easeOutBounce'
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'ANNUAL SAVINGS BY DEPARTMENT (TOP 8)',
        color: '#06b6d4',
        font: { size: 10, weight: 'bold', family: 'JetBrains Mono' },
        padding: { bottom: 12 }
      },
      tooltip: {
        backgroundColor: 'rgba(13,20,38,0.95)',
        borderColor: 'rgba(59,130,246,0.5)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y;
            return ` $${(val/1000000).toFixed(2)}M saved`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { 
          color: '#64748b', 
          font: { size: 8 },
          maxRotation: 35
        }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#64748b',
          font: { size: 9 },
          callback: (v) => `$${(v/1000000).toFixed(1)}M`
        },
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

SavingsByDept.displayName = 'SavingsByDept';
export default SavingsByDept;
