import React, { useState, useEffect } from 'react';
import type { Language, GradeState } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { calculateSemester } from './utils/calculator';
import { SAMPLE_GRADES } from './data/sampleData';
import { Header } from './components/Header';
import { TabNav, type TabId } from './components/TabNav';
import { SummaryCards } from './components/SummaryCards';
import { CalculatorTab } from './components/CalculatorTab';
import { TargetTab } from './components/TargetTab';
import { SimulatorTab } from './components/SimulatorTab';
import { ResultsTab } from './components/ResultsTab';
import { ResetModal } from './components/ResetModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [grades, setGrades] = useLocalStorage<GradeState>('g2_atm_s3_grades_v1', {});
  const [language, setLanguage] = useLocalStorage<Language>('g2_atm_s3_lang_v1', 'fr');
  const [activeTab, setActiveTab] = useState<TabId>('calculator');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Synchronize document dir and lang for accessibility and Arabic RTL
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const semesterResult = calculateSemester(grades);

  const handleGradeChange = (
    subjectId: string,
    field: 'cc' | 'exam',
    value: number | null
  ) => {
    setGrades((prev) => {
      const existing = prev[subjectId] || {};
      return {
        ...prev,
        [subjectId]: {
          ...existing,
          [field]: value,
        },
      };
    });
  };

  const handleResetConfirm = () => {
    setGrades({});
    setIsResetModalOpen(false);
  };

  const handleLoadSample = () => {
    setGrades(SAMPLE_GRADES);
  };

  const handleApplySimulatedGrades = (newGrades: GradeState) => {
    setGrades(newGrades);
    setActiveTab('calculator');
  };

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onResetClick={() => setIsResetModalOpen(true)}
        onLoadSampleClick={handleLoadSample}
        isCompleted={semesterResult.isFullyCompleted}
        semesterAverage={semesterResult.semesterAverage}
        partialAverage={semesterResult.partialAverage}
      />

      {/* Tabs Navigation */}
      <TabNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Global Summary Cards (shown on Calculator, Target, and Simulator tabs) */}
        {activeTab !== 'results' && (
          <SummaryCards result={semesterResult} language={language} />
        )}

        {/* Tab 1: Semester Calculator */}
        {activeTab === 'calculator' && (
          <CalculatorTab
            result={semesterResult}
            language={language}
            onGradeChange={handleGradeChange}
          />
        )}

        {/* Tab 2: Target Grade Calculator */}
        {activeTab === 'target' && (
          <TargetTab
            grades={grades}
            result={semesterResult}
            language={language}
          />
        )}

        {/* Tab 3: What-If Simulator */}
        {activeTab === 'simulator' && (
          <SimulatorTab
            realGrades={grades}
            realResult={semesterResult}
            language={language}
            onApplySimulatedGrades={handleApplySimulatedGrades}
          />
        )}

        {/* Tab 4: Results & Export */}
        {activeTab === 'results' && (
          <ResultsTab result={semesterResult} language={language} />
        )}
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Reset Confirmation Dialog */}
      <ResetModal
        isOpen={isResetModalOpen}
        language={language}
        onConfirm={handleResetConfirm}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};

export default App;
