// src/components/AnalyticsDashboard/charts/ROITrendLine.jsx
import React, { memo } from 'react';
import { Line } from 'react-chartjs-2';
import { aggregateRobotsOverTime } from '../aggregators/dataAggregator.js';

const ROITrendLine = memo(({ data = [] }) => {
  const { labels, values } = aggregateRobotsOverTime(data);

  const chartData = {
    labels,
    datasets: [{
      label: 'Robots Deployed',
      data: values,
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.08)',
      pointBackgroundColor: 'rgba(6, 182, 212, 1)',
      pointBorderColor: 'rgba(6, 182, 212, 1)',
      pointRadius: 4,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#ffffff',
      borderWidth: 2,
      tension: 0.4,     // Curved line
      fill: true,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
      x: { duration: 1500 }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'ROBOTS DEPLOYED OVER TIME',
        color: '#06b6d4',
        font: { size: 10, weight: 'bold', family: 'JetBrains Mono' },
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
          label: (ctx) => ` ${ctx.parsed.y.toLocaleString()} robots`
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 9 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { 
          color: '#64748b', 
          font: { size: 9 },
          callback: (v) => v.toLocaleString()
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ height: '240px', position: 'relative' }}>
      <Line data={chartData} options={options} />
    </div>
  );
});

ROITrendLine.displayName = 'ROITrendLine';
export default ROITrendLine;
