import React from 'react';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';
import type { SemesterResult, Language } from '../types';
import { UES } from '../data/curriculum';
import { SubjectCard } from './SubjectCard';
import { translations } from '../data/translations';

interface CalculatorTabProps {
  result: SemesterResult;
  language: Language;
  onGradeChange: (subjectId: string, field: 'cc' | 'exam', value: number | null) => void;
}

export const CalculatorTab: React.FC<CalculatorTabProps> = ({
  result,
  language,
  onGradeChange,
}) => {
  const t = translations[language];

  return (
    <div className="space-y-6">
      {UES.map((ue) => {
        const ueRes = result.ues[ue.id];
        const isAcquired = ueRes && ueRes.isAcquired;

        return (
          <section
            key={ue.id}
            className="p-4 sm:p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-lg space-y-4"
          >
            {/* UE Header Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      {ue.code}
                    </span>
                    <h2 className="text-sm sm:text-base font-bold text-white m-0">
                      {ue.name[language]}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 m-0">
                    {t.labels.totalCoeffs}: {ue.coefficient} • {t.labels.totalCredits}: {ue.credits}
                  </p>
                </div>
              </div>

              {/* UE Average & Validation Badge */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                {ueRes && ueRes.ueAverage !== null ? (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400 font-medium">
                      {t.labels.ueAverage}:
                    </span>
                    <span
                      className={`text-sm font-extrabold ${
                        isAcquired ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {ueRes.ueAverage.toFixed(2)}
                      <span className="text-xs font-semibold text-slate-500 ms-1">/ 20</span>
                    </span>
                    {isAcquired ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 font-medium px-2 py-1 rounded-lg bg-slate-950 border border-slate-800/80">
                    {t.labels.inProgress}
                  </span>
                )}
              </div>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {ueRes.subjects.map((subRes) => (
                <SubjectCard
                  key={subRes.subject.id}
                  result={subRes}
                  language={language}
                  onGradeChange={onGradeChange}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
