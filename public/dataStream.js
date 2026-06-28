// public/dataStream.js
// NexusFlow Real-Time RPA Data Stream Simulator
// Fires every 200ms with batches of rows, injecting real-time anomalies

(function () {
  'use strict';

  const AUTOMATION_TYPES = [
    'Cognitive Automation', 'Process Discovery', 'RPA', 'IPA', 'Machine Learning',
    'NLP Processing', 'Document AI', 'Computer Vision', 'Decision Automation',
    'Chatbot Integration', 'API Orchestration', 'ETL Automation',
  ];

  const DEPARTMENTS = [
    'Finance', 'HR', 'Operations', 'IT', 'Supply Chain', 'Marketing',
    'Legal', 'Compliance', 'Customer Service', 'Procurement', 'Sales',
    'R&D', 'Manufacturing', 'Logistics', 'Data Analytics',
  ];

  const INDUSTRIES = [
    'Banking', 'Healthcare', 'Insurance', 'Manufacturing', 'Retail',
    'Telecommunications', 'Energy', 'Government', 'Education', 'Logistics',
    'Pharmaceutical', 'Financial Services', 'Technology', 'Media', 'Real Estate',
  ];

  const COUNTRIES = [
    'United States', 'United Kingdom', 'Germany', 'India', 'Australia',
    'Canada', 'Japan', 'Singapore', 'France', 'Netherlands',
    'Brazil', 'UAE', 'Sweden', 'Switzerland', 'South Korea',
  ];

  const PROJECT_STATUSES = ['Active', 'Completed', 'Failed', 'Pending'];

  const PARTNERS = [
    'Deloitte Digital', 'Accenture RPA', 'IBM Automation', 'Infosys BPM',
    'Cognizant', 'Wipro Automation', 'TCS Innovation', 'Capgemini RPA',
    'EY Advisory', 'KPMG Intelligent', 'PwC Digital', 'DXC Technology',
    'HCL Technologies', 'Mphasis', 'Tech Mahindra',
  ];

  const PROJECT_NAMES = [
    'AutoFinance', 'HRBot Pro', 'SupplySync', 'InvoiceAI', 'ClaimsDroid',
    'TaxBot Elite', 'PayrollFlow', 'KYC Automator', 'TradeBot', 'RiskAI',
    'ComplianceBot', 'AuditFlow', 'ProcureBot', 'LogisticsAI', 'SalesOrch',
    'CustomerXBot', 'ContractAI', 'BudgetBot', 'ReportDroid', 'DataPulse',
    'NexaBot', 'FlowEngine', 'OmniProcess', 'ClearBot', 'VisionaryAI',
    'QuantumRPA', 'HyperFlow', 'NeuralBot', 'CogniBot', 'SwiftProcess',
    'AlphaAuto', 'BetaBot', 'GammaFlow', 'DeltaAI', 'EpsilonRPA',
    'ZetaProcess', 'EtaBot', 'ThetaFlow', 'IotaAI', 'KappaBot',
  ];

  const COMPANY_PREFIXES = [
    'TechCorp', 'GlobalSys', 'NexaEnt', 'OmniTech', 'FusionCo',
    'AlphaNet', 'BetaSys', 'GammaCorp', 'DeltaInc', 'ZetaLabs',
    'QuantumInc', 'HyperCorp', 'NeuralSys', 'CogniBiz', 'SwiftEntp',
  ];

  const rand = (min, max) => Math.random() * (max - min) + min;
  const randInt = (min, max) => Math.floor(rand(min, max + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const generateDate = (yearStart = 2020, yearEnd = 2025) => {
    const start = new Date(yearStart, 0, 1).getTime();
    const end = new Date(yearEnd, 11, 31).getTime();
    return new Date(start + Math.random() * (end - start)).toISOString().split('T')[0];
  };

  // Generate initial static dataset (1000 rows)
  const generateStaticData = (count = 1000) => {
    const rows = [];
    for (let i = 1; i <= count; i++) {
      const budgetUsd = Math.floor(rand(50000, 5000000));
      const annualSavings = Math.floor(rand(10000, budgetUsd * 3.5));
      const roiPercent = ((annualSavings - budgetUsd) / budgetUsd * 100);
      const startDate = generateDate(2020, 2024);
      const endDate = generateDate(2024, 2026);

      rows.push({
        project_id: `RPA-${String(i).padStart(5, '0')}`,
        company_id: `${pick(COMPANY_PREFIXES)}-${String(randInt(100, 999))}`,
        project_name: `${pick(PROJECT_NAMES)} ${String.fromCharCode(65 + (i % 26))}${randInt(1, 99)}`,
        project_status: pick(PROJECT_STATUSES),
        automation_type: pick(AUTOMATION_TYPES),
        department: pick(DEPARTMENTS),
        industry: pick(INDUSTRIES),
        country: pick(COUNTRIES),
        implementation_partner: pick(PARTNERS),
        robots_deployed: randInt(1, 250),
        annual_savings_usd: annualSavings,
        budget_usd: budgetUsd,
        roi_percent: parseFloat(roiPercent.toFixed(2)),
        employee_hours_saved: randInt(500, 150000),
        start_date: startDate,
        end_date: endDate,
        _isNew: false,
      });
    }
    return rows;
  };

  let staticData = generateStaticData(1000);
  let streamCallback = null;
  let streamInterval = null;
  let batchCounter = 0;

  const injectAnomalies = (row) => {
    const clone = { ...row };
    const r = Math.random();

    // Inject random status flips (~15% chance)
    if (r < 0.08) {
      clone.project_status = 'Failed';
    } else if (r < 0.15) {
      clone.project_status = 'Active';
    }

    // Inject ROI anomalies (~20% chance)
    if (Math.random() < 0.12) {
      clone.roi_percent = parseFloat((rand(-50, -1)).toFixed(2));
      clone.project_status = Math.random() < 0.5 ? 'Failed' : 'Pending';
    }

    // Random metric fluctuations
    clone.robots_deployed = Math.max(1, parseInt(clone.robots_deployed) + randInt(-5, 10));
    clone.annual_savings_usd = Math.max(0, parseFloat(clone.annual_savings_usd) * rand(0.95, 1.05));
    clone.roi_percent = parseFloat((parseFloat(clone.roi_percent) * rand(0.9, 1.1)).toFixed(2));
    clone.employee_hours_saved = Math.max(0, parseInt(clone.employee_hours_saved) + randInt(-100, 200));

    clone._isNew = true;
    clone._timestamp = Date.now();
    return clone;
  };

  const generateNewRow = () => {
    const budgetUsd = Math.floor(rand(50000, 5000000));
    const annualSavings = Math.floor(rand(10000, budgetUsd * 3.5));
    const roiPercent = ((annualSavings - budgetUsd) / budgetUsd * 100);
    batchCounter++;
    const id = 1000 + batchCounter;
    return {
      project_id: `RPA-${String(id).padStart(5, '0')}`,
      company_id: `${pick(COMPANY_PREFIXES)}-${String(randInt(100, 999))}`,
      project_name: `${pick(PROJECT_NAMES)} ${String.fromCharCode(65 + (id % 26))}${randInt(1, 99)}`,
      project_status: pick(PROJECT_STATUSES),
      automation_type: pick(AUTOMATION_TYPES),
      department: pick(DEPARTMENTS),
      industry: pick(INDUSTRIES),
      country: pick(COUNTRIES),
      implementation_partner: pick(PARTNERS),
      robots_deployed: randInt(1, 250),
      annual_savings_usd: annualSavings,
      budget_usd: budgetUsd,
      roi_percent: parseFloat(roiPercent.toFixed(2)),
      employee_hours_saved: randInt(500, 150000),
      start_date: generateDate(2024, 2026),
      end_date: generateDate(2025, 2027),
      _isNew: true,
      _timestamp: Date.now(),
    };
  };

  const generateBatch = () => {
    const batchSize = randInt(3, 12);
    const batch = [];

    for (let i = 0; i < batchSize; i++) {
      if (Math.random() < 0.7 && staticData.length > 0) {
        // Update existing row with anomalies
        const idx = randInt(0, staticData.length - 1);
        batch.push(injectAnomalies(staticData[idx]));
      } else {
        // Inject new row
        batch.push(generateNewRow());
      }
    }
    return batch;
  };

  // ─── Public API ─────────────────────────────────────────

  window.initializeRpaStream = function (callback) {
    if (typeof callback !== 'function') {
      console.error('[NexusFlow DataStream] callback must be a function');
      return;
    }

    streamCallback = callback;

    // Feed initial static data in first batch
    setTimeout(() => {
      if (streamCallback) {
        const initialBatches = [];
        const batchSize = 50;
        for (let i = 0; i < staticData.length; i += batchSize) {
          initialBatches.push(staticData.slice(i, i + batchSize));
        }
        initialBatches.forEach((batch, idx) => {
          setTimeout(() => {
            if (streamCallback) streamCallback(batch);
          }, idx * 30);
        });
      }
    }, 500);

    // Start live stream
    streamInterval = setInterval(() => {
      if (streamCallback) {
        try {
          streamCallback(generateBatch());
        } catch (e) {
          console.error('[NexusFlow DataStream] Error in callback:', e);
        }
      }
    }, 200);

    console.log('[NexusFlow DataStream] ✅ Stream initialized — firing every 200ms');

    return function stopStream() {
      if (streamInterval) {
        clearInterval(streamInterval);
        streamInterval = null;
      }
      streamCallback = null;
      console.log('[NexusFlow DataStream] Stream stopped');
    };
  };

  window.getRpaStreamStatus = function () {
    return {
      active: streamInterval !== null,
      staticDataSize: staticData.length,
      batchesGenerated: batchCounter,
    };
  };
})();
