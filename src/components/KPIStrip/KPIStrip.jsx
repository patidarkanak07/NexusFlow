// src/components/KPIStrip/KPIStrip.jsx
import React, { memo } from 'react';
import { Database, Bot, TrendingUp } from 'lucide-react';
import KPICard from './KPICard.jsx';
import './KPIStrip.css';

const KPIStrip = memo(({ kpiCounters, kpiHistory }) => {
  const cards = [
    {
      label: 'Total Streamed Rows Processed',
      value: kpiCounters.totalRowsProcessed,
      prefix: '',
      suffix: '',
      icon: Database,
      color: '#3b82f6',
      history: kpiHistory.totalRowsProcessed,
    },
    {
      label: 'Active Robots Deployed',
      value: kpiCounters.activeRobotsDeployed,
      prefix: '',
      suffix: '',
      icon: Bot,
      color: '#22c55e',
      history: kpiHistory.activeRobotsDeployed,
    },
    {
      label: 'Global Cumulative Savings (USD)',
      value: Math.floor(kpiCounters.globalCumulativeSavings / 1000),
      prefix: '$',
      suffix: 'K',
      icon: TrendingUp,
      color: '#06b6d4',
      history: kpiHistory.globalCumulativeSavings,
    },
  ];

  return (
    <div className="kpi-strip">
      {cards.map((card, idx) => (
        <KPICard
          key={card.label}
          index={idx}
          label={card.label}
          value={card.value}
          prefix={card.prefix}
          suffix={card.suffix}
          icon={card.icon}
          color={card.color}
          history={card.history}
        />
      ))}
    </div>
  );
});

KPIStrip.displayName = 'KPIStrip';
export default KPIStrip;
