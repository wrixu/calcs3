import React from 'react';
import { Award, BookOpen, CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';
import type { SemesterResult, Language } from '../types';
import { translations } from '../data/translations';

interface SummaryCardsProps {
  result: SemesterResult;
  language: Language;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ result, language }) => {
  const t = translations[language];

  const displayAverage = result.isFullyCompleted
    ? result.semesterAverage
    : result.partialAverage;

  const progressPercent = Math.round((result.completedCoeffs / result.totalCoeffs) * 100);

  return (
    <div className="w-full space-y-4 no-print">
      {/* Official S3 Info Banner */}
      <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200/90 text-xs sm:text-sm flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-cyan-300">{t.officialNotice}</p>
          <div className="flex items-center gap-4 mt-1 text-xs text-cyan-400/80">
            <span>{result.totalSubjectsCount} {t.labels.completedSubjects.toLowerCase()}</span>
            <span>•</span>
            <span>{result.totalCoeffs} {t.labels.totalCoeffs.toLowerCase()}</span>
            <span>•</span>
            <span>{result.totalCredits} {t.labels.totalCredits.toLowerCase()}</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Main Average Card */}
        <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400">
              {result.isFullyCompleted
                ? t.labels.semesterAverage
                : t.labels.provisionalAverage}
            </span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                displayAverage === null
                  ? 'text-slate-500'
                  : displayAverage >= 10
                  ? 'text-emerald-400'
                  : 'text-rose-400'
              }`}
            >
              {displayAverage !== null ? displayAverage.toFixed(2) : '--.--'}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{t.labels.outOf20}</span>
          </div>

          {/* Status Chip */}
          <div className="mt-2.5 flex items-center gap-1.5">
            {result.isFullyCompleted ? (
              result.isPassing ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/70 text-emerald-400 border border-emerald-800/50">
                  <CheckCircle2 className="w-3 h-3" />
                  {t.labels.admis}
                  {result.mention && ` • ${result.mention[language]}`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-950/70 text-rose-400 border border-rose-800/50">
                  <AlertCircle className="w-3 h-3" />
                  {t.labels.ajourne}
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {t.labels.inProgress} ({result.completedSubjectsCount}/{result.totalSubjectsCount})
              </span>
            )}
          </div>
        </div>

        {/* Acquired Credits Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400">
              {t.labels.creditsAcquired}
            </span>
            <BookOpen className="w-4 h-4 text-teal-400" />
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {result.creditsAcquired}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{t.labels.outOf29}</span>
          </div>

          <p className="mt-2 text-xs text-slate-400 truncate">
            {result.semesterAverage !== null && result.semesterAverage >= 10
              ? `${t.labels.passed} (${t.labels.compensation})`
              : `${result.completedCredits} / 29 ${t.labels.credits.toLowerCase()}`}
          </p>
        </div>

        {/* Points Accumulated */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400">
              {t.labels.pointsAccumulated}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {result.completedCoeffs} / 16 {t.labels.coefficient}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {result.pointsAccumulated.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-semibold">{t.labels.outOf320}</span>
          </div>

          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (result.pointsAccumulated / 160) * 100)}%` }}
            />
          </div>
        </div>

        {/* Completion Progress Card */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-slate-400">
              {t.labels.completedSubjects}
            </span>
            <span className="text-xs font-bold text-cyan-400">{progressPercent}%</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {result.completedSubjectsCount}
            </span>
            <span className="text-xs text-slate-500 font-semibold">/ 10</span>
          </div>

          <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
