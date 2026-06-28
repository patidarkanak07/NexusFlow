// src/utils/anomalyRules.js

export const ANOMALY_RULES = [
  {
    id: 'negative_roi',
    label: 'Negative ROI',
    severity: 'critical',
    color: '#ef4444',
    icon: '📉',
    detect: (row) => parseFloat(row.roi_percent) < -10,
    message: (row) => 
      `ROI collapsed to ${parseFloat(row.roi_percent).toFixed(2)}%`
  },
  {
    id: 'robot_surge',
    label: 'Robot Surge',
    severity: 'warning',
    color: '#f59e0b',
    icon: '🤖',
    detect: (row) => parseInt(row.robots_deployed) > 500,
    message: (row) => 
      `Unusual robot spike: ${row.robots_deployed} deployed`
  },
  {
    id: 'zero_budget',
    label: 'Zero Budget',
    severity: 'critical',
    color: '#ef4444',
    icon: '💸',
    detect: (row) => parseFloat(row.budget_usd) === 0 || 
                     !row.budget_usd,
    message: (row) => `Budget is zero for ${row.project_name}`
  },
  {
    id: 'savings_exceed_budget',
    label: 'Savings Exceed Budget',
    severity: 'info',
    color: '#06b6d4',
    icon: '💰',
    detect: (row) => 
      parseFloat(row.annual_savings_usd) > 
      parseFloat(row.budget_usd) * 2,
    message: (row) => 
      `Savings 2x budget: $${
        parseFloat(row.annual_savings_usd).toLocaleString()
      }`
  },
  {
    id: 'extreme_hours',
    label: 'Extreme Hours Saved',
    severity: 'warning',
    color: '#f59e0b',
    icon: '⏱️',
    detect: (row) => parseInt(row.employee_hours_saved) > 100000,
    message: (row) => 
      `Unusual hours saved: ${
        parseInt(row.employee_hours_saved).toLocaleString()
      }`
  },
  {
    id: 'failed_high_budget',
    label: 'Failed High-Budget Project',
    severity: 'critical',
    color: '#ef4444',
    icon: '🚨',
    detect: (row) => 
      row.project_status === 'Failed' && 
      parseFloat(row.budget_usd) > 500000,
    message: (row) => 
      `$${(parseFloat(row.budget_usd)/1000000).toFixed(1)}M project failed`
  }
];

// Check a single row against all rules
export const detectAnomalies = (row) => {
  return ANOMALY_RULES
    .filter(rule => {
      try { return rule.detect(row); } 
      catch { return false; }
    })
    .map(rule => ({
      ruleId: rule.id,
      label: rule.label,
      severity: rule.severity,
      color: rule.color,
      icon: rule.icon,
      message: rule.message(row),
      projectId: row.project_id,
      projectName: row.project_name,
      timestamp: Date.now()
    }));
};
