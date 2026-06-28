// src/components/AnalyticsDashboard/charts/BudgetBubble.jsx
import React, { memo } from 'react';
import { Bubble } from 'react-chartjs-2';
import { aggregateBudgetVsSavings } from '../aggregators/dataAggregator.js';

const BudgetBubble = memo(({ data = [] }) => {
  const bubbleData = aggregateBudgetVsSavings(data);

  const chartData = {
    datasets: [{
      label: 'Budget vs Savings',
      data: bubbleData,
      backgroundColor: 'rgba(59, 130, 246, 0.4)',
      borderColor: 'rgba(6, 182, 212, 0.75)',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(6, 182, 212, 0.65)',
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'BUDGET vs SAVINGS vs ROI (bubble size = ROI%)',
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
          label: (ctx) => [
            ` Project: ${ctx.raw.label || 'Unknown'}`,
            ` Budget: $${ctx.raw.x.toFixed(0)}K`,
            ` Savings: $${ctx.raw.y.toFixed(0)}K`,
            ` ROI: ~${(ctx.raw.r * 10).toFixed(0)}%`
          ]
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Budget (USD thousands)',
          color: '#64748b',
          font: { size: 9 }
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { 
          color: '#64748b',
          callback: (v) => `$${v}K`
        }
      },
      y: {
        title: {
          display: true,
          text: 'Annual Savings (USD thousands)',
          color: '#64748b',
          font: { size: 9 }
        },
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { 
          color: '#64748b',
          callback: (v) => `$${v}K`
        }
      }
    }
  };

  return (
    <div style={{ height: '240px', position: 'relative' }}>
      <Bubble data={chartData} options={options} />
    </div>
  );
});

BudgetBubble.displayName = 'BudgetBubble';
export default BudgetBubble;
