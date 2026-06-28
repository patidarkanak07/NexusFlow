// src/components/RowInspector/InspectorSection.jsx
import React, { memo } from 'react';

const InspectorSection = memo(({ title, icon: Icon, children }) => {
  return (
    <div className="inspector-section">
      <div className="inspector-section-title">
        {Icon && <Icon size={12} className="text-accent-blue" />}
        <span>{title}</span>
      </div>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  );
});

InspectorSection.displayName = 'InspectorSection';
export default InspectorSection;
