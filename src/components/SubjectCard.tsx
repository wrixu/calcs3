import React from 'react';
import { CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import type { SubjectResult, Language } from '../types';
import { translations } from '../data/translations';

interface SubjectCardProps {
  result: SubjectResult;
  language: Language;
  onGradeChange: (subjectId: string, field: 'cc' | 'exam', value: number | null) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  result,
  language,
  onGradeChange,
}) => {
  const { subject, cc, exam, grade, isCompleted, isPassing, requiredExamFor10 } = result;
  const t = translations[language];

  const handleInputChange = (
    field: 'cc' | 'exam',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const valStr = e.target.value.trim();
    if (valStr === '') {
      onGradeChange(subject.id, field, null);
      return;
    }
    const parsed = parseFloat(valStr);
    if (!isNaN(parsed)) {
      // Clamp between 0 and 20 or allow user typing
      const clamped = Math.max(0, Math.min(20, parsed));
      onGradeChange(subject.id, field, clamped);
    }
  };

  const getAssessmentBadgeText = () => {
    switch (subject.assessmentType) {
      case 'CC_AND_EXAM':
        return t.labels.ccAndExam;
      case 'CC_ONLY':
        return t.labels.ccOnly;
      case 'EXAM_ONLY':
        return t.labels.examOnly;
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-md hover:border-slate-700/80 transition-all flex flex-col justify-between gap-3">
      {/* Subject Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
              {subject.name[language]}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {getAssessmentBadgeText()}
            </p>
          </div>

          {/* Badges: Coeff & Credits */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
              {t.labels.coefficient} {subject.coefficient}
            </span>
            <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
              {subject.credits} {t.labels.credits}
            </span>
          </div>
        </div>
      </div>

      {/* Grade Inputs Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* CC Input (shown for CC_AND_EXAM and CC_ONLY) */}
        {subject.assessmentType !== 'EXAM_ONLY' && (
          <div className={subject.assessmentType === 'CC_ONLY' ? 'col-span-2' : ''}>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {t.labels.cc}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="20"
                step="0.25"
                placeholder="-- / 20"
                value={cc !== null && cc !== undefined ? cc : ''}
                onChange={(e) => handleInputChange('cc', e)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              <span className="absolute end-2.5 top-2.5 text-xs text-slate-600 pointer-events-none">
                /20
              </span>
            </div>
          </div>
        )}

        {/* Exam Input (shown for CC_AND_EXAM and EXAM_ONLY) */}
        {subject.assessmentType !== 'CC_ONLY' && (
          <div className={subject.assessmentType === 'EXAM_ONLY' ? 'col-span-2' : ''}>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              {t.labels.exam}
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="20"
                step="0.25"
                placeholder="-- / 20"
                value={exam !== null && exam !== undefined ? exam : ''}
                onChange={(e) => handleInputChange('exam', e)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              <span className="absolute end-2.5 top-2.5 text-xs text-slate-600 pointer-events-none">
                /20
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Target Exam Hint if CC is known but Exam is empty */}
      {subject.assessmentType === 'CC_AND_EXAM' &&
        cc !== null &&
        (exam === null || exam === undefined) &&
        requiredExamFor10 !== null && (
          <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex items-center justify-between text-slate-400">
            <span className="inline-flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.labels.neededFor10}</span>
            </span>
            <span
              className={`font-bold ${
                requiredExamFor10 > 20
                  ? 'text-rose-400'
                  : requiredExamFor10 <= 0
                  ? 'text-emerald-400'
                  : 'text-cyan-300'
              }`}
            >
              {requiredExamFor10 > 20
                ? t.labels.impossible
                : requiredExamFor10 <= 0
                ? t.labels.guaranteed
                : `${requiredExamFor10.toFixed(2)} / 20`}
            </span>
          </div>
        )}

      {/* Final Grade Footer */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">
          {t.labels.grade}
        </span>

        {isCompleted && grade !== null ? (
          <div className="flex items-center gap-2">
            <span
              className={`text-base font-extrabold ${
                isPassing ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {grade.toFixed(2)}
              <span className="text-xs font-semibold text-slate-500 ms-1">/ 20</span>
            </span>
            {isPassing ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400" />
            )}
          </div>
        ) : (
          <span className="text-xs font-medium text-slate-500 italic">
            {t.labels.incomplete}
          </span>
        )}
      </div>
    </div>
  );
};
