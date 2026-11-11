import React from 'react';
import { Calculator, Target, SlidersHorizontal, FileText } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

export type TabId = 'calculator' | 'target' | 'simulator' | 'results';

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  language: Language;
}

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onTabChange, language }) => {
  const t = translations[language];

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'calculator',
      label: t.tabs.calculator,
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      id: 'target',
      label: t.tabs.target,
      icon: <Target className="w-4 h-4" />,
    },
    {
      id: 'simulator',
      label: t.tabs.simulator,
      icon: <SlidersHorizontal className="w-4 h-4" />,
    },
    {
      id: 'results',
      label: t.tabs.results,
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="w-full bg-slate-900/60 border-b border-slate-800/80 sticky top-[61px] z-30 backdrop-blur-md no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                  {tab.icon}
                </span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
