import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import type { SemesterResult, Language, GradeState } from '../types';
import { analyzeSemesterTarget, calculateRequiredExam } from '../utils/calculator';
import { SUBJECTS } from '../data/curriculum';
import { translations } from '../data/translations';

interface TargetTabProps {
  grades: GradeState;
  result: SemesterResult;
  language: Language;
}

export const TargetTab: React.FC<TargetTabProps> = ({ grades, result, language }) => {
  const [targetAverage, setTargetAverage] = useState<number>(10.0);
  const t = translations[language];

  const analysis = analyzeSemesterTarget(grades, targetAverage);

  const presets = [10.0, 11.0, 12.0, 13.0, 14.0, 15.0];

  // Incomplete subjects that require an exam
  const incompleteSubjects = SUBJECTS.map((s) => result.subjects[s.id]).filter(
    (sRes) => !sRes.isCompleted
  );

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white m-0">
              {t.targetCalc.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 m-0">
              {t.targetCalc.description}
            </p>
          </div>
        </div>

        {/* Target Average Selector */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs sm:text-sm font-semibold text-slate-300">
              {t.targetCalc.targetLabel}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="10"
                max="20"
                step="0.1"
                value={targetAverage}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setTargetAverage(Math.max(0, Math.min(20, val)));
                }}
                className="w-24 px-3 py-1.5 text-base font-extrabold text-cyan-400 bg-slate-950 border border-slate-800 rounded-xl text-center focus:outline-none focus:border-cyan-500"
              />
              <span className="text-sm font-bold text-slate-500">/ 20</span>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {presets.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setTargetAverage(val)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  targetAverage === val
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {val.toFixed(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Status KPI Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Points Needed */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            {t.targetCalc.pointsTarget}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">
              {analysis.targetPoints.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">{t.labels.outOf320}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {t.targetCalc.pointsCurrent}:{' '}
            <span className="font-semibold text-cyan-400">
              {analysis.currentPoints.toFixed(1)}
            </span>
          </p>
        </div>

        {/* Points Remaining */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <span className="text-xs font-medium text-slate-400 block mb-1">
            {t.targetCalc.pointsRemaining}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white">
              {analysis.pointsNeeded.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">
              ({analysis.remainingCoeffs} {t.labels.coefficient})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {t.targetCalc.uniformAverageNeeded}:{' '}
            <span className="font-bold text-amber-300">
              {analysis.uniformGradeNeeded !== null
                ? `${analysis.uniformGradeNeeded.toFixed(2)}/20`
                : '--'}
            </span>
          </p>
        </div>

        {/* Status Verdict */}
        <div
          className={`p-4 rounded-2xl border shadow-md flex flex-col justify-between ${
            analysis.status === 'achieved'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
              : analysis.status === 'possible'
              ? 'bg-cyan-950/40 border-cyan-800/60 text-cyan-300'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {analysis.status === 'achieved' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {analysis.status === 'possible' && (
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
            )}
            {analysis.status === 'impossible' && (
              <XCircle className="w-5 h-5 text-rose-400" />
            )}
            <span className="text-sm font-bold uppercase tracking-wider">
              {analysis.status === 'achieved'
                ? t.labels.passed
                : analysis.status === 'possible'
                ? 'Accessible'
                : t.labels.impossible}
            </span>
          </div>
          <p className="text-xs font-medium leading-relaxed">
            {analysis.status === 'achieved' && t.targetCalc.statusAchieved}
            {analysis.status === 'possible' && t.targetCalc.statusPossible}
            {analysis.status === 'impossible' && t.targetCalc.statusImpossible}
          </p>
        </div>
      </div>

      {/* Per-Subject Exam Requirements */}
      <section className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white m-0">
            {t.targetCalc.subjectTargetsTitle}
          </h3>
          <p className="text-xs text-slate-400 mt-1 m-0">
            {t.targetCalc.subjectTargetDesc}
          </p>
        </div>

        {incompleteSubjects.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
            {t.labels.admis} — Toutes les matières sont déjà complétées !
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incompleteSubjects.map((subRes) => {
              const sub = subRes.subject;
              const hasCC = subRes.cc !== null;
              let examReqText = '--';
              let isImpossible = false;
              let isGuaranteed = false;

              if (sub.assessmentType === 'CC_AND_EXAM' && hasCC) {
                const req = calculateRequiredExam(subRes.cc as number, 10);
                isImpossible = !req.isPossible;
                isGuaranteed = req.isGuaranteed;
                examReqText = isImpossible
                  ? t.labels.impossible
                  : isGuaranteed
                  ? t.labels.guaranteed
                  : `${req.requiredExam.toFixed(2)} / 20`;
              } else if (sub.assessmentType === 'EXAM_ONLY') {
                examReqText = '10.00 / 20';
              } else if (sub.assessmentType === 'CC_ONLY') {
                examReqText = '10.00 / 20 (Note de CC)';
              } else {
                examReqText = 'Saisir la note de CC d’abord';
              }

              return (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {sub.name[language]}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <span>Coeff {sub.coefficient}</span>
                      <span>•</span>
                      {hasCC ? (
                        <span>CC: {subRes.cc?.toFixed(2)}</span>
                      ) : (
                        <span className="text-amber-400">CC manquant</span>
                      )}
                    </div>
                  </div>

                  <div className="text-end shrink-0">
                    <span className="text-xs text-slate-400 block mb-0.5">
                      {t.labels.minExamNeeded}
                    </span>
                    <span
                      className={`text-sm font-extrabold ${
                        isImpossible
                          ? 'text-rose-400'
                          : isGuaranteed
                          ? 'text-emerald-400'
                          : 'text-cyan-300'
                      }`}
                    >
                      {examReqText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
