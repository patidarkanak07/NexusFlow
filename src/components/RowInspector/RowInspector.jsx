// src/components/RowInspector/RowInspector.jsx
import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Landmark, Gauge, FolderGit2, FileJson, Copy, Check } from 'lucide-react';
import InspectorHeader from './InspectorHeader.jsx';
import InspectorSection from './InspectorSection.jsx';
import InspectorField from './InspectorField.jsx';
import { formatCurrency, formatPercent } from '../../utils/formatters.js';
import './RowInspector.css';

// Simple typewriter component for titles
const TypewriterText = memo(({ text = '', delay = 0 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [text, delay]);

  return (
    <span className="typewriter">
      {displayed}
      <span className="cursor">|</span>
    </span>
  );
});

TypewriterText.displayName = 'TypewriterText';

// Flag mapping helper
const getCountryFlag = (country = '') => {
  const flags = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Germany': '🇩🇪',
    'India': '🇮🇳',
    'Australia': '🇦🇺',
    'Canada': '🇨🇦',
    'Japan': '🇯🇵',
    'Singapore': '🇸🇬',
    'France': '🇫🇷',
    'Netherlands': '🇳🇱',
    'Brazil': '🇧🇷',
    'UAE': '🇦🇪',
    'Sweden': '🇸🇪',
    'Switzerland': '🇨🇭',
    'South Korea': '🇰🇷',
  };
  return flags[country] ? `${flags[country]} ${country}` : country;
};

export const RowInspector = memo(({ rowData = {}, openedAt, pauseQueueSize, onClose, onPrevRow, onNextRow }) => {
  const [copied, setCopied] = useState(false);

  // Close panel on pressing Escape, or page with Arrow Up/Down
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onPrevRow?.();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onNextRow?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevRow, onNextRow]);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(rowData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = useMemo(() => {
    if (!rowData) return [];

    const roi = parseFloat(rowData.roi_percent) || 0;
    const savingsRatio = Math.min(100, Math.max(0, (parseFloat(rowData.annual_savings_usd) / (parseFloat(rowData.budget_usd) || 1)) * 100));

    return [
      {
        id: 'identity',
        title: 'Project Identity',
        icon: Shield,
        content: (
          <div className="flex flex-col gap-1">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider pl-2.5 mt-1">Inspecting CodeName</div>
            <div className="text-md pl-2.5 mb-2 font-bold font-mono text-accent-cyan">
              <TypewriterText text={rowData.project_name} delay={100} />
            </div>
            <InspectorField label="Company ID" value={rowData.company_id} type="text" />
            <InspectorField label="Status" value={rowData.project_status} type="status" />
            <InspectorField label="Start Date" value={rowData.start_date} type="date" />
            <InspectorField label="End Date" value={rowData.end_date} type="date" />
          </div>
        )
      },
      {
        id: 'profile',
        title: 'Automation Profile',
        icon: Cpu,
        content: (
          <div className="flex flex-col gap-1">
            <InspectorField label="Automation Type" value={rowData.automation_type} type="text" />
            <InspectorField label="Robots Deployed" value={rowData.robots_deployed} type="number" />
            <InspectorField label="Implementation Partner" value={rowData.implementation_partner} type="text" />
            <InspectorField label="Country" value={getCountryFlag(rowData.country)} type="text" />
          </div>
        )
      },
      {
        id: 'financial',
        title: 'Financial Breakdown',
        icon: Landmark,
        content: (
          <div className="flex flex-col gap-2 p-2.5 bg-black bg-opacity-20 rounded-lg">
            <InspectorField label="Total Budget" value={rowData.budget_usd} type="currency" />
            <InspectorField label="Annual Savings" value={rowData.annual_savings_usd} type="currency" />
            <InspectorField label="ROI %" value={rowData.roi_percent} type="percent" />

            {/* Savings Ratio Progress Bar */}
            <div className="mt-2 text-[10px] text-gray-500 uppercase tracking-wider flex justify-between">
              <span>Savings to Budget ratio</span>
              <span className="font-mono text-white font-bold">{savingsRatio.toFixed(1)}%</span>
            </div>
            <div className="progress-bar-wrapper">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${savingsRatio}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  background: 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                }}
              />
            </div>

            {/* ROI Easing Progress Bar */}
            <div className="mt-1 text-[10px] text-gray-500 uppercase tracking-wider flex justify-between">
              <span>ROI Return Rate</span>
              <span className="font-mono text-white font-bold">{formatPercent(roi)}</span>
            </div>
            <div className="progress-bar-wrapper">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, Math.abs(roi) / 2))}%` }} // Scales up to 200% ROI
                transition={{ duration: 0.8, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  background: roi >= 0
                    ? 'linear-gradient(90deg, #22c55e, #06b6d4)'
                    : 'linear-gradient(90deg, #ef4444, #f59e0b)'
                }}
              />
            </div>
          </div>
        )
      },
      {
        id: 'performance',
        title: 'Performance Metrics',
        icon: Gauge,
        content: (
          <div className="flex flex-col gap-2">
            <div className="inspector-stat-grid">
              <div className="inspector-stat-card">
                <span className="inspector-stat-val text-accent-green">
                  ⏱️ {Number(rowData.employee_hours_saved || 0).toLocaleString('en-IN')}
                </span>
                <span className="inspector-stat-lbl">Hours Saved</span>
              </div>
              <div className="inspector-stat-card">
                <span className="inspector-stat-val text-accent-cyan">
                  ⚡ {rowData.robots_deployed} Units
                </span>
                <span className="inspector-stat-lbl">Deployed bots</span>
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'organization',
        title: 'Organization',
        icon: FolderGit2,
        content: (
          <div className="flex flex-col gap-1">
            <InspectorField label="Department" value={rowData.department} type="text" />
            <InspectorField label="Industry" value={rowData.industry} type="text" />
          </div>
        )
      },
      {
        id: 'raw',
        title: 'Dossier JSON Dump',
        icon: FileJson,
        content: (
          <div className="flex flex-col gap-2 mt-1">
            <pre className="raw-data-block">
              {JSON.stringify(rowData, null, 2)}
            </pre>

            <motion.button
              type="button"
              className="copy-raw-btn"
              onClick={handleCopy}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="copied"
                    className="flex items-center gap-1.5 justify-center text-accent-green"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Check size={13} />
                    <span>✓ Copied!</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    className="flex items-center gap-1.5 justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Copy size={13} />
                    <span>Copy Raw Dossier</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        )
      }
    ];
  }, [rowData, copied]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <div className="inspector-overlay">
      {/* Dim backdrop covering grid */}
      <motion.div
        className="inspector-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      {/* Slide-in sidebar drawer dossier panel */}
      <motion.div
        className="inspector-panel"
        initial={{
          x: '100%',
          opacity: 0,
          boxShadow: 'none',
        }}
        animate={{
          x: 0,
          opacity: 1,
          boxShadow: '-20px 0 60px rgba(59,130,246,0.3)',
        }}
        exit={{
          x: '100%',
          opacity: 0,
          boxShadow: 'none',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
      >
        <InspectorHeader
          projectId={rowData.project_id}
          openedAt={openedAt}
          pauseQueueSize={pauseQueueSize}
          onClose={onClose}
        />

        <div className="flex flex-col">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              custom={idx}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <InspectorSection title={section.title} icon={section.icon}>
                {section.content}
              </InspectorSection>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
});

RowInspector.displayName = 'RowInspector';
export default RowInspector;
