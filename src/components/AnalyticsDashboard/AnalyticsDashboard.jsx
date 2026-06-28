// src/components/AnalyticsDashboard/AnalyticsDashboard.jsx
import React, { useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import {
  computeSummaryStats,
  aggregateByAutomationType,
  aggregateByStatus,
  aggregateROIByIndustry,
  aggregateRobotsOverTime,
  aggregateSavingsByDepartment,
  aggregateBudgetVsSavings
} from './aggregators/dataAggregator.js';

import AnalyticsHeader from './AnalyticsHeader.jsx';
import ChartCard from './ChartCard.jsx';
import AnimatedCounter from '../KPIStrip/AnimatedCounter.jsx';

import AutomationTypeBar from './charts/AutomationTypeBar.jsx';
import StatusDonut from './charts/StatusDonut.jsx';
import IndustryHorizontal from './charts/IndustryHorizontal.jsx';
import ROITrendLine from './charts/ROITrendLine.jsx';
import SavingsByDept from './charts/SavingsRadar.jsx';
import BudgetBubble from './charts/BudgetBubble.jsx';

import './AnalyticsDashboard.css';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Global defaults for dark theme
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.borderColor = 'rgba(255,255,255,0.06)';
ChartJS.defaults.font.family = "'JetBrains Mono', monospace";

const SummaryCard = memo(({ icon, label, value, sub, color, delay = 0, isCurrency = false, isPercent = false }) => {
  const accentColor = color === 'green' ? '#22c55e' : color === 'blue' ? '#3b82f6' : color === 'cyan' ? '#06b6d4' : '#ef4444';

  const numVal = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  const hasNumber = !isNaN(numVal);

  return (
    <motion.div
      className="summary-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 20,
        delay: delay * 0.08
      }}
      whileHover={{
        borderColor: `${accentColor}55`,
        backgroundColor: `${accentColor}08`
      }}
    >
      <div className="summary-card-header">
        <span className="summary-card-label">{label}</span>
        <span className="summary-card-icon">{icon}</span>
      </div>
      <div>
        <div className="summary-card-value font-mono" style={{ color: accentColor }}>
          {hasNumber ? (
            <AnimatedCounter
              value={numVal}
              prefix={isCurrency ? '$' : ''}
              suffix={isPercent ? '%' : ''}
            />
          ) : (
            <span>{value}</span>
          )}
        </div>
        {sub && <div className="summary-card-sub">{sub}</div>}
      </div>
    </motion.div>
  );
});

SummaryCard.displayName = 'SummaryCard';

export const AnalyticsDashboard = memo(({ 
  isOpen, 
  onClose, 
  frozenData = [], 
  frozenAt, 
  pauseQueueSize 
}) => {

  // Escape key close handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Compute all aggregations ONCE on mount from the frozen snapshot
  const analytics = useMemo(() => {
    return {
      summaryStats: computeSummaryStats(frozenData),
      automationType: aggregateByAutomationType(frozenData),
      statusBreakdown: aggregateByStatus(frozenData),
      roiByIndustry: aggregateROIByIndustry(frozenData),
      robotsOverTime: aggregateRobotsOverTime(frozenData),
      savingsByDept: aggregateSavingsByDepartment(frozenData),
      budgetBubble: aggregateBudgetVsSavings(frozenData),
    };
  }, [frozenData]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop blur overlay */}
          <motion.div
            className="analytics-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          
          {/* Main Fullscreen Dashboard Overlay Panel */}
          <motion.div
            className="analytics-overlay"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
          >
            <AnalyticsHeader
              frozenAt={frozenAt}
              rowCount={frozenData.length}
              pauseQueueSize={pauseQueueSize}
              onClose={onClose}
            />
            
            {/* Summary Stat Cards */}
            <motion.div
              className="analytics-summary-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <SummaryCard 
                icon="📈" 
                label="AVG ROI"
                value={`${analytics.summaryStats.avgROI}`}
                isPercent
                color="green"
                delay={0}
              />
              <SummaryCard 
                icon="🤖" 
                label="TOTAL ROBOTS"
                value={analytics.summaryStats.totalRobots}
                color="blue"
                delay={1}
              />
              <SummaryCard 
                icon="💰" 
                label="TOTAL SAVINGS"
                value={Math.floor(analytics.summaryStats.totalSavings)}
                isCurrency
                color="cyan"
                delay={2}
              />
              <SummaryCard 
                icon="⚠️" 
                label="FAILED RATE"
                value={`${analytics.summaryStats.failedPercent}`}
                isPercent
                sub={`${analytics.summaryStats.failedCount} projects failed`}
                color="red"
                delay={3}
              />
            </motion.div>

            {/* Charts Grid */}
            <div className="charts-grid">
              <ChartCard title="Automation Distribution" delay={0.1}>
                <AutomationTypeBar data={frozenData} />
              </ChartCard>
              <ChartCard title="Status Breakdown" delay={0.2}>
                <StatusDonut data={frozenData} />
              </ChartCard>
              <ChartCard title="ROI by Industry" delay={0.3}>
                <IndustryHorizontal data={frozenData} />
              </ChartCard>
              <ChartCard title="Robots Over Time" delay={0.4}>
                <ROITrendLine data={frozenData} />
              </ChartCard>
              <ChartCard title="Savings by Department" delay={0.5}>
                <SavingsByDept data={frozenData} />
              </ChartCard>
              <ChartCard title="Budget vs Savings vs ROI" delay={0.6}>
                <BudgetBubble data={frozenData} />
              </ChartCard>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';
export default AnalyticsDashboard;
