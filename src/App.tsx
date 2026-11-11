import React, { useState, useEffect, useRef } from 'react';
import type { Language, GradeState } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTelegramWebApp } from './hooks/useTelegramWebApp';
import { calculateSemester } from './utils/calculator';
import { SAMPLE_GRADES } from './data/sampleData';
import { translations } from './data/translations';
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
  const [grades, setGrades] = useLocalStorage<GradeState>('l2_atm_s3_grades_v1', {});
  const [language, setLanguage] = useLocalStorage<Language>('l2_atm_s3_lang_v1', 'fr');
  const [activeTab, setActiveTab] = useState<TabId>('calculator');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Telegram Mini App integration hook
  const tg = useTelegramWebApp();
  const t = translations[language];

  // Ref to hold the latest simulated grades for Telegram MainButton callback
  const latestSimGradesRef = useRef<GradeState | null>(null);
  const exportResultsFnRef = useRef<(() => void) | null>(null);

  // Synchronize document dir and lang for accessibility and Arabic RTL
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Synchronize Telegram color scheme
  useEffect(() => {
    if (tg.isTelegram && tg.colorScheme === 'light') {
      document.documentElement.classList.add('tg-light');
    } else {
      document.documentElement.classList.remove('tg-light');
    }
  }, [tg.isTelegram, tg.colorScheme]);

  const semesterResult = calculateSemester(grades);

  const handleGradeChange = (
    subjectId: string,
    field: 'cc' | 'exam',
    value: number | null
  ) => {
    tg.haptic('light');
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
    tg.haptic('warning');
    setGrades({});
    setIsResetModalOpen(false);
  };

  const handleLoadSample = () => {
    tg.haptic('success');
    setGrades(SAMPLE_GRADES);
  };

  const handleApplySimulatedGrades = (newGrades: GradeState) => {
    tg.haptic('success');
    setGrades(newGrades);
    setActiveTab('calculator');
  };

  const handleTabChange = (tab: TabId) => {
    tg.haptic('selection');
    setActiveTab(tab);
  };

  // Telegram BackButton management
  useEffect(() => {
    if (!tg.isTelegram) return;

    if (activeTab !== 'calculator') {
      tg.configureBackButton({
        isVisible: true,
        onClick: () => {
          tg.haptic('selection');
          setActiveTab('calculator');
        },
      });
    } else {
      tg.configureBackButton({ isVisible: false });
    }
  }, [activeTab, tg]);

  // Telegram MainButton management (contextual & non-disruptive)
  useEffect(() => {
    if (!tg.isTelegram) return;

    if (activeTab === 'results') {
      // On Results tab: offer direct PDF / print trigger
      tg.configureMainButton({
        text: `🖨️ ${t.labels.print}`,
        isVisible: true,
        color: '#0ea5e9',
        textColor: '#ffffff',
        onClick: () => {
          tg.haptic('light');
          if (exportResultsFnRef.current) {
            exportResultsFnRef.current();
          } else {
            try {
              window.print();
            } catch {
              // fallback
            }
          }
        },
      });
    } else if (activeTab === 'simulator') {
      // On Simulator tab: offer to apply simulated marks
      tg.configureMainButton({
        text: `💾 ${t.simulator.applyToMain}`,
        isVisible: true,
        color: '#0d9488',
        textColor: '#ffffff',
        onClick: () => {
          if (latestSimGradesRef.current) {
            handleApplySimulatedGrades(latestSimGradesRef.current);
          }
        },
      });
    } else if (activeTab === 'calculator' && semesterResult.isFullyCompleted) {
      // On Calculator when completed: offer quick navigation to official report
      tg.configureMainButton({
        text: `📜 ${t.tabs.results}`,
        isVisible: true,
        color: '#0ea5e9',
        textColor: '#ffffff',
        onClick: () => {
          tg.haptic('selection');
          setActiveTab('results');
        },
      });
    } else {
      // Keep hidden during manual input on calculator to avoid blocking virtual keyboard
      tg.configureMainButton({ isVisible: false, text: '' });
    }
  }, [activeTab, tg, semesterResult.isFullyCompleted, t]);

  const telegramStudentName = tg.user
    ? [tg.user.first_name, tg.user.last_name].filter(Boolean).join(' ')
    : '';

  return (
    <div
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* Header */}
      <Header
        language={language}
        onLanguageChange={(lang) => {
          tg.haptic('selection');
          setLanguage(lang);
        }}
        onResetClick={() => {
          tg.haptic('warning');
          setIsResetModalOpen(true);
        }}
        onLoadSampleClick={handleLoadSample}
        isCompleted={semesterResult.isFullyCompleted}
        semesterAverage={semesterResult.semesterAverage}
        partialAverage={semesterResult.partialAverage}
      />

      {/* Tabs Navigation */}
      <TabNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
            onSimGradesChange={(sim) => {
              latestSimGradesRef.current = sim;
            }}
          />
        )}

        {/* Tab 4: Results & Export */}
        {activeTab === 'results' && (
          <ResultsTab
            result={semesterResult}
            language={language}
            defaultStudentName={telegramStudentName}
            onExportReady={(fn) => {
              exportResultsFnRef.current = fn;
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Reset Confirmation Dialog */}
      <ResetModal
        isOpen={isResetModalOpen}
        language={language}
        onConfirm={handleResetConfirm}
        onCancel={() => {
          tg.haptic('light');
          setIsResetModalOpen(false);
        }}
      />
    </div>
  );
};

export default App;
