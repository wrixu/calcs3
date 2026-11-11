import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, ArrowRight, RotateCcw, Check, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SemesterResult, Language, GradeState } from '../types';
import { calculateSemester } from '../utils/calculator';
import { SUBJECTS } from '../data/curriculum';
import { translations } from '../data/translations';

interface SimulatorTabProps {
  realGrades: GradeState;
  realResult: SemesterResult;
  language: Language;
  onApplySimulatedGrades: (newGrades: GradeState) => void;
  onSimGradesChange?: (grades: GradeState) => void;
}

export const SimulatorTab: React.FC<SimulatorTabProps> = ({
  realGrades,
  realResult,
  language,
  onApplySimulatedGrades,
  onSimGradesChange,
}) => {
  const t = translations[language];

  // Initialize simulated grades with real grades or default estimates
  const [simGrades, setSimGrades] = useState<GradeState>(() => {
    const initial: GradeState = {};
    for (const sub of SUBJECTS) {
      const real = realGrades[sub.id] || {};
      initial[sub.id] = {
        cc: real.cc ?? 12,
        exam: real.exam ?? 10,
      };
    }
    return initial;
  });

  const [appliedToast, setAppliedToast] = useState(false);

  useEffect(() => {
    onSimGradesChange?.(simGrades);
  }, [simGrades, onSimGradesChange]);

  const simResult = calculateSemester(simGrades);

  const realAvg = realResult.semesterAverage ?? realResult.partialAverage ?? 0;
  const simAvg = simResult.semesterAverage ?? 0;
  const delta = simAvg - realAvg;

  const handleSimGradeChange = (
    subjectId: string,
    field: 'cc' | 'exam',
    value: number
  ) => {
    setSimGrades((prev) => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: value,
      },
    }));
  };

  const handleResetToReal = () => {
    const reset: GradeState = {};
    for (const sub of SUBJECTS) {
      const real = realGrades[sub.id] || {};
      reset[sub.id] = {
        cc: real.cc ?? 12,
        exam: real.exam ?? 10,
      };
    }
    setSimGrades(reset);
  };

  const handleApplyToMain = () => {
    onApplySimulatedGrades(simGrades);
    setAppliedToast(true);
    setTimeout(() => setAppliedToast(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Simulator Header & Comparison Banner */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-950/80 border border-teal-800/60 flex items-center justify-center text-teal-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white m-0">
                {t.simulator.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 m-0">
                {t.simulator.description}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToReal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.simulator.resetSim}</span>
            </button>

            <button
              type="button"
              onClick={handleApplyToMain}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-teal-400 hover:bg-teal-300 transition-colors shadow-md"
            >
              {appliedToast ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Appliqué !</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{t.simulator.applyToMain}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Simulation KPI Bar */}
        <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Simulated Average */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">
                {t.simulator.simulatedAverage}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  className={`text-2xl font-extrabold ${
                    simAvg >= 10 ? 'text-teal-400' : 'text-rose-400'
                  }`}
                >
                  {simAvg.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ 20</span>
              </div>
            </div>
            <div className="text-end">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                  simAvg >= 10
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {simAvg >= 10 ? t.labels.admis : t.labels.ajourne}
              </span>
            </div>
          </div>

          {/* Comparison Delta */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">
                {t.simulator.comparisonWithCurrent}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {delta > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : delta < 0 ? (
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                ) : (
                  <Minus className="w-4 h-4 text-slate-400" />
                )}
                <span
                  className={`text-lg font-bold ${
                    delta > 0
                      ? 'text-emerald-400'
                      : delta < 0
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {delta > 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2)}
                </span>
                <span className="text-xs text-slate-500 font-medium">pts</span>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Actuel: {realAvg > 0 ? realAvg.toFixed(2) : '--'}
            </span>
          </div>

          {/* Acquired Credits in simulation */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">
                {t.labels.creditsAcquired}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-extrabold text-white">
                  {simResult.creditsAcquired}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ 29</span>
              </div>
            </div>
            <span className="text-xs text-teal-400 font-semibold">
              {simAvg >= 10 ? t.labels.compensation : `${simResult.creditsAcquired} cr.`}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Sliders for each Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {SUBJECTS.map((sub) => {
          const simSub = simResult.subjects[sub.id];
          const currInput = simGrades[sub.id] || { cc: 12, exam: 10 };
          const activeField = sub.assessmentType === 'CC_ONLY' ? 'cc' : 'exam';
          const activeValue = currInput[activeField] ?? 10;

          return (
            <div
              key={sub.id}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                    {sub.name[language]}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span>Coeff {sub.coefficient}</span>
                    <span>•</span>
                    <span>{sub.credits} Crédits</span>
                    {sub.assessmentType === 'CC_AND_EXAM' && (
                      <>
                        <span>•</span>
                        <span className="text-slate-300">
                          CC: {(currInput.cc ?? 0).toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-end shrink-0">
                  <span className="text-xs text-slate-500 block">Note finale</span>
                  <span
                    className={`text-sm font-extrabold ${
                      simSub.grade !== null && simSub.grade >= 10
                        ? 'text-teal-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {simSub.grade !== null ? simSub.grade.toFixed(2) : '--'}/20
                  </span>
                </div>
              </div>

              {/* Slider & Value control */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {activeField === 'exam' ? t.labels.exam : t.labels.cc}:
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={activeValue}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          handleSimGradeChange(
                            sub.id,
                            activeField,
                            Math.max(0, Math.min(20, val))
                          );
                        }
                      }}
                      className="w-16 px-2 py-0.5 text-xs font-bold text-white bg-slate-950 border border-slate-800 rounded-lg text-center"
                    />
                    <span className="text-slate-500 font-semibold">/ 20</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.25"
                  value={activeValue}
                  onChange={(e) =>
                    handleSimGradeChange(sub.id, activeField, parseFloat(e.target.value))
                  }
                  className="w-full accent-teal-400 h-2 bg-slate-950 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
