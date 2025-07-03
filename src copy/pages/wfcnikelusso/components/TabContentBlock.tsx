import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface TabType {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabContentBlockProps {
  title: string;
  tabs: TabType[];
  defaultTab?: string;
  className?: string;
}

const TabContentBlock: React.FC<TabContentBlockProps> = ({
  title,
  tabs,
  defaultTab,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : ''));

  if (tabs.length === 0) return null;

  return (
    <div className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-heading mb-8">{title}</h2>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 focus:outline-none`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Active Tab Content */}
        <div className="transition-opacity duration-300">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};

export default TabContentBlock;
