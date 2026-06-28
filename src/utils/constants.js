// src/utils/constants.js

export const COLUMNS = [
  { key: 'project_id',           label: 'Project ID',     width: 110, sortable: false, align: 'left',  mono: true },
  { key: 'project_name',         label: 'Project Name',   width: 180, sortable: false, align: 'left',  mono: false },
  { key: 'company_id',           label: 'Company',        width: 130, sortable: false, align: 'left',  mono: true },
  { key: 'project_status',       label: 'Status',         width: 100, sortable: false, align: 'center', mono: false },
  { key: 'automation_type',      label: 'Type',           width: 130, sortable: false, align: 'left',  mono: false },
  { key: 'department',           label: 'Department',     width: 130, sortable: false, align: 'left',  mono: false },
  { key: 'country',              label: 'Country',        width: 110, sortable: false, align: 'left',  mono: false },
  { key: 'robots_deployed',      label: 'Robots',         width: 75,  sortable: false, align: 'right', mono: true },
  { key: 'annual_savings_usd',   label: 'Annual Savings', width: 140, sortable: true,  align: 'right', mono: true },
  { key: 'budget_usd',           label: 'Budget',         width: 130, sortable: true,  align: 'right', mono: true },
  { key: 'roi_percent',          label: 'ROI %',          width: 90,  sortable: true,  align: 'right', mono: true },
  { key: 'employee_hours_saved', label: 'Hours Saved',    width: 110, sortable: true,  align: 'right', mono: true },
  { key: 'industry',             label: 'Industry',       width: 130, sortable: false, align: 'left',  mono: false },
  { key: 'start_date',           label: 'Start',          width: 110, sortable: false, align: 'left',  mono: true },
];

export const FILTER_FIELDS = [
  { key: 'project_status',  label: 'Status' },
  { key: 'automation_type', label: 'Automation Type' },
  { key: 'department',      label: 'Department' },
  { key: 'industry',        label: 'Industry' },
  { key: 'country',         label: 'Country' },
];

export const ROW_HEIGHT = 44;
export const MASTER_DATA_CAP = 10000;
export const MASTER_DATA_TRIM = 5000;
export const STREAM_INTERVAL_MS = 200;
export const SEARCH_DEBOUNCE_MS = 120;
export const COUNTER_DURATION_MS = 300;

export const AUTOMATION_TYPES = [
  'Cognitive Automation', 'Process Discovery', 'RPA', 'IPA', 'Machine Learning',
  'NLP Processing', 'Document AI', 'Computer Vision', 'Decision Automation',
  'Chatbot Integration', 'API Orchestration', 'ETL Automation',
];

export const DEPARTMENTS = [
  'Finance', 'HR', 'Operations', 'IT', 'Supply Chain', 'Marketing',
  'Legal', 'Compliance', 'Customer Service', 'Procurement', 'Sales',
  'R&D', 'Manufacturing', 'Logistics', 'Data Analytics',
];

export const INDUSTRIES = [
  'Banking', 'Healthcare', 'Insurance', 'Manufacturing', 'Retail',
  'Telecommunications', 'Energy', 'Government', 'Education', 'Logistics',
  'Pharmaceutical', 'Financial Services', 'Technology', 'Media', 'Real Estate',
];

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Germany', 'India', 'Australia',
  'Canada', 'Japan', 'Singapore', 'France', 'Netherlands',
  'Brazil', 'UAE', 'Sweden', 'Switzerland', 'South Korea',
];

export const PROJECT_STATUSES = ['Active', 'Completed', 'Failed', 'Pending'];

export const PARTNERS = [
  'Deloitte Digital', 'Accenture RPA', 'IBM Automation', 'Infosys BPM',
  'Cognizant', 'Wipro Automation', 'TCS Innovation', 'Capgemini RPA',
  'EY Advisory', 'KPMG Intelligent', 'PwC Digital', 'DXC Technology',
  'HCL Technologies', 'Mphasis', 'Tech Mahindra',
];
