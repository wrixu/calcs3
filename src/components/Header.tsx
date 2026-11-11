import React from 'react';
import { RotateCcw, Sparkles, Globe, GraduationCap } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../data/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onResetClick: () => void;
  onLoadSampleClick: () => void;
  isCompleted: boolean;
  semesterAverage: number | null;
  partialAverage: number | null;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  onResetClick,
  onLoadSampleClick,
  isCompleted,
  semesterAverage,
  partialAverage,
}) => {
  const t = translations[language];
  const displayAverage = isCompleted ? semesterAverage : partialAverage;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-900/90 border-b border-slate-800 no-print transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo & Academic Title */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 font-bold text-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-white m-0">
                    {t.appName}
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-medium">
                    Blida 1
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium m-0">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Live Average Pill for mobile */}
            {displayAverage !== null && (
              <div className="sm:hidden flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                <span className="text-xs text-slate-400">
                  {isCompleted ? 'Moy:' : 'Prov:'}
                </span>
                <span
                  className={`text-sm font-bold ${
                    displayAverage >= 10 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {displayAverage.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Controls: Actions & Language */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            {/* Quick Sample Button */}
            <button
              onClick={onLoadSampleClick}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-all active:scale-95"
              title={t.labels.loadSample}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.labels.loadSample}</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onResetClick}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 transition-all active:scale-95"
              title={t.labels.reset}
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.labels.reset}</span>
            </button>

            {/* Language Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-800 border border-slate-700">
              <Globe className="w-3.5 h-3.5 mx-1.5 text-slate-400" />
              {(['fr', 'ar', 'en'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onLanguageChange(lang)}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                    language === lang
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'fr' ? 'FR' : lang === 'ar' ? 'عربي' : 'EN'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
