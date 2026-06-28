// src/components/AnalyticsDashboard/charts/StatusDonut.jsx
import React, { memo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { aggregateByStatus } from '../aggregators/dataAggregator.js';

const StatusDonut = memo(({ data = [] }) => {
  const { labels, values } = aggregateByStatus(data);

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: [
        'rgba(34, 197, 94, 0.75)',   // Active - green
        'rgba(59, 130, 246, 0.75)',  // Completed - blue
        'rgba(239, 68, 68, 0.75)',   // Failed - red
        'rgba(245, 158, 11, 0.75)',  // Pending - amber
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(245, 158, 11, 1)',
      ],
      borderWidth: 2,
      hoverOffset: 8,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',     // Makes it a donut shape
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1200,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#94a3b8',
          padding: 12,
          font: { size: 10 },
          usePointStyle: true,
          pointStyleWidth: 8
        }
      },
      title: {
        display: true,
        text: 'PROJECT STATUS BREAKDOWN',
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
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const percent = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0;
            return ` ${ctx.parsed} projects (${percent}%)`;
          }
        }
      }
    }
  };

  // Center text plugin - shows total count in middle
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw(chart) {
      const { ctx, chartArea: { width, height, top } } = chart;
      ctx.save();
      ctx.font = 'bold 20px JetBrains Mono';
      ctx.fillStyle = '#f1f5f9';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const total = values.reduce((a, b) => a + b, 0);
      ctx.fillText(total.toLocaleString(), width / 2, top + height / 2 - 10);
      ctx.font = '9px Inter';
      ctx.fillStyle = '#64748b';
      ctx.fillText('TOTAL PROJECTS', width / 2, top + height / 2 + 10);
      ctx.restore();
    }
  };

  return (
    <div style={{ height: '240px', position: 'relative' }}>
      <Doughnut 
        data={chartData} 
        options={options} 
        plugins={[centerTextPlugin]}
      />
    </div>
  );
});

StatusDonut.displayName = 'StatusDonut';
export default StatusDonut;
