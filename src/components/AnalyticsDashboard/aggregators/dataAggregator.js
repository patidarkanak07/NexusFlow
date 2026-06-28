// src/components/AnalyticsDashboard/aggregators/dataAggregator.js

export const CHART_COLORS = [
  'rgba(59, 130, 246, 0.75)',    // Blue
  'rgba(6, 182, 212, 0.75)',     // Cyan
  'rgba(34, 197, 94, 0.75)',     // Green
  'rgba(139, 92, 246, 0.75)',    // Purple
  'rgba(245, 158, 11, 0.75)',    // Amber
  'rgba(239, 68, 68, 0.75)',     // Red
  'rgba(236, 72, 153, 0.75)',    // Pink
  'rgba(16, 185, 129, 0.75)',    // Emerald
];

export const CHART_BORDERS = [
  'rgba(59, 130, 246, 1)',
  'rgba(6, 182, 212, 1)',
  'rgba(34, 197, 94, 1)',
  'rgba(139, 92, 246, 1)',
  'rgba(245, 158, 11, 1)',
  'rgba(239, 68, 68, 1)',
  'rgba(236, 72, 153, 1)',
  'rgba(16, 185, 129, 1)',
];

const formatMetricLabel = (metric) => {
  const labels = {
    roi_percent: 'Avg ROI %',
    robots_deployed: 'Avg Robots Deployed',
    employee_hours_saved: 'Avg Hours Saved',
    annual_savings_usd: 'Avg Savings (USD)',
    budget_usd: 'Avg Budget (USD)',
  };
  return labels[metric] || metric;
};

// Count rows by industry
export const aggregateByIndustry = (data) => {
  const counts = {};
  data.forEach(row => {
    const industry = row.industry || 'Unknown';
    counts[industry] = (counts[industry] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return {
    labels: sorted.map(([k]) => k),
    values: sorted.map(([, v]) => v)
  };
};

// Aggregate 1: Count rows by automation_type
export const aggregateByAutomationType = (data) => {
  const counts = {};
  data.forEach(row => {
    const type = row.automation_type || 'Unknown';
    counts[type] = (counts[type] || 0) + 1;
  });
  return {
    labels: Object.keys(counts),
    values: Object.values(counts)
  };
};

// Aggregate 2: Count rows by project_status
export const aggregateByStatus = (data) => {
  const counts = { Active: 0, Completed: 0, Failed: 0, Pending: 0 };
  data.forEach(row => {
    const status = row.project_status || 'Unknown';
    if (status in counts) {
      counts[status] = (counts[status] || 0) + 1;
    }
  });
  return {
    labels: Object.keys(counts),
    values: Object.values(counts)
  };
};

// Aggregate 3: Average ROI by industry
export const aggregateROIByIndustry = (data) => {
  const totals = {};
  const counts = {};
  data.forEach(row => {
    const industry = row.industry || 'Unknown';
    const roi = parseFloat(row.roi_percent) || 0;
    totals[industry] = (totals[industry] || 0) + roi;
    counts[industry] = (counts[industry] || 0) + 1;
  });
  const labels = Object.keys(totals);
  const averages = labels.map(l => 
    parseFloat((totals[l] / counts[l]).toFixed(2))
  );
  return { labels, values: averages };
};

// Aggregate 4: Total savings by department
export const aggregateSavingsByDepartment = (data) => {
  const totals = {};
  data.forEach(row => {
    const dept = row.department || 'Unknown';
    const savings = parseFloat(row.annual_savings_usd) || 0;
    totals[dept] = (totals[dept] || 0) + savings;
  });
  // Sort by value descending, take top 8
  const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  return {
    labels: sorted.map(([k]) => k),
    values: sorted.map(([, v]) => Math.round(v))
  };
};

// Aggregate 5: Robots deployed over time (by start_date month)
export const aggregateRobotsOverTime = (data) => {
  const monthly = {};
  data.forEach(row => {
    if (!row.start_date) return;
    const month = new Date(row.start_date)
      .toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    const robots = parseInt(row.robots_deployed) || 0;
    monthly[month] = (monthly[month] || 0) + robots;
  });
  const sorted = Object.entries(monthly)
    .sort((a, b) => new Date('01 ' + a[0]) - new Date('01 ' + b[0]))
    .slice(-12); // Last 12 months
  return {
    labels: sorted.map(([k]) => k),
    values: sorted.map(([, v]) => v)
  };
};

// Aggregate 6: Budget vs Savings bubble data
export const aggregateBudgetVsSavings = (data) => {
  return data
    .filter(row => row.budget_usd && row.annual_savings_usd)
    .slice(0, 30) // Top 30 for bubble clarity
    .map(row => ({
      x: parseFloat(row.budget_usd) / 1000,      // In thousands
      y: parseFloat(row.annual_savings_usd) / 1000,
      r: Math.max(4, Math.min(20, Math.abs(parseFloat(row.roi_percent) || 1) / 10)),
      label: row.project_name
    }));
};

// Aggregate 7: Radar — avg metrics by automation_type
export const aggregateRadarByType = (data) => {
  // Pick top 5 automation types
  const typeCounts = {};
  data.forEach(row => {
    typeCounts[row.automation_type] = 
      (typeCounts[row.automation_type] || 0) + 1;
  });
  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([k]) => k);

  const metrics = ['roi_percent', 'robots_deployed', 
                   'employee_hours_saved', 'annual_savings_usd',
                   'budget_usd'];
  
  const datasets = topTypes.map((type, i) => {
    const rows = data.filter(r => r.automation_type === type);
    const avgValues = metrics.map(metric => {
      const avg = rows.reduce((sum, r) => 
        sum + (parseFloat(r[metric]) || 0), 0) / rows.length;
      return parseFloat(avg.toFixed(2));
    });
    return {
      label: type,
      data: avgValues,
      color: CHART_COLORS[i]
    };
  });

  return { labels: metrics.map(formatMetricLabel), datasets };
};

// Summary statistics for header cards
export const computeSummaryStats = (data) => {
  const totalRows = data.length || 1;
  const avgROI = data.reduce((sum, r) => 
    sum + (parseFloat(r.roi_percent) || 0), 0) / totalRows;
  const totalSavings = data.reduce((sum, r) => 
    sum + (parseFloat(r.annual_savings_usd) || 0), 0);
  const failedCount = data.filter(r => 
    r.project_status === 'Failed').length;
  const totalRobots = data.reduce((sum, r) => 
    sum + (parseInt(r.robots_deployed) || 0), 0);
  
  const indAgg = aggregateByIndustry(data);
  const topIndustry = indAgg && indAgg.labels && indAgg.labels[0] ? indAgg.labels[0] : 'Unknown';

  return {
    totalRows,
    avgROI: avgROI.toFixed(2),
    totalSavings,
    failedCount,
    failedPercent: ((failedCount / totalRows) * 100).toFixed(1),
    totalRobots,
    topIndustry
  };
};
