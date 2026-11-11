import React, { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import type { SemesterResult, Language } from '../types';
import { UES } from '../data/curriculum';
import { translations } from '../data/translations';

interface ResultsTabProps {
  result: SemesterResult;
  language: Language;
  defaultStudentName?: string;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({
  result,
  language,
  defaultStudentName = '',
}) => {
  const t = translations[language];
  const [studentName, setStudentName] = useState<string>(defaultStudentName);
  const [matricule, setMatricule] = useState<string>('');

  useEffect(() => {
    if (defaultStudentName && !studentName) {
      setStudentName(defaultStudentName);
    }
  }, [defaultStudentName, studentName]);

  const handlePrint = () => {
    window.print();
  };

  const displayAverage = result.isFullyCompleted
    ? result.semesterAverage
    : result.partialAverage;

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white m-0">
            {t.resultsSummary.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 m-0">
            {t.resultsSummary.printInstruction}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>{t.labels.print}</span>
        </button>
      </div>

      {/* Printable Academic Transcript Paper Container */}
      <div className="print-container p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-slate-200 print-card shadow-xl space-y-6">
        {/* University Official Header */}
        <div className="border-b border-slate-800 pb-5 text-center space-y-1.5 print:border-slate-300">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400 print:text-black">
            {t.university}
          </p>
          <p className="text-xs text-slate-400 print:text-slate-700">
            {t.faculty}
          </p>
          <h1 className="text-lg sm:text-xl font-extrabold text-white print:text-black mt-2">
            {t.resultsSummary.officialTranscript}
          </h1>
          <p className="text-xs text-slate-400 print:text-slate-600">
            {t.resultsSummary.academicYear} • Programme LMD
          </p>
        </div>

        {/* Student Metadata Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 print:border-slate-300 print:bg-white text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 print:text-slate-700 font-medium block">
              {t.resultsSummary.studentNamePlaceholder}:
            </label>
            <input
              type="text"
              placeholder="Ex: BENALI Mohammed"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-semibold print:border-none print:p-0 print:text-black print:text-sm focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 print:text-slate-700 font-medium block">
              {t.resultsSummary.matriculePlaceholder}:
            </label>
            <input
              type="text"
              placeholder="Ex: 232331000000"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-semibold print:border-none print:p-0 print:text-black print:text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Global Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 print:border-slate-300">
            <span className="text-xs text-slate-400 print:text-slate-600 block">
              {result.isFullyCompleted
                ? t.labels.semesterAverage
                : t.labels.provisionalAverage}
            </span>
            <span
              className={`text-xl sm:text-2xl font-black ${
                displayAverage === null
                  ? 'text-slate-500'
                  : displayAverage >= 10
                  ? 'text-emerald-400 print:text-black'
                  : 'text-rose-400 print:text-black'
              }`}
            >
              {displayAverage !== null ? displayAverage.toFixed(2) : '--'}/20
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 print:border-slate-300">
            <span className="text-xs text-slate-400 print:text-slate-600 block">
              {t.labels.creditsAcquired}
            </span>
            <span className="text-xl sm:text-2xl font-black text-white print:text-black">
              {result.creditsAcquired} / 29
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 print:border-slate-300">
            <span className="text-xs text-slate-400 print:text-slate-600 block">
              {t.labels.totalCoeffs}
            </span>
            <span className="text-xl sm:text-2xl font-black text-white print:text-black">
              {result.completedCoeffs} / 16
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 print:border-slate-300">
            <span className="text-xs text-slate-400 print:text-slate-600 block">
              {t.labels.status}
            </span>
            <span
              className={`text-sm sm:text-base font-extrabold block mt-1 ${
                result.isFullyCompleted
                  ? result.isPassing
                    ? 'text-emerald-400 print:text-black'
                    : 'text-rose-400 print:text-black'
                  : 'text-amber-400 print:text-black'
              }`}
            >
              {result.isFullyCompleted
                ? result.isPassing
                  ? t.labels.admis
                  : t.labels.ajourne
                : `${t.labels.inProgress} (${result.completedSubjectsCount}/10)`}
            </span>
          </div>
        </div>

        {/* Comprehensive Transcript Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-start print-table border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 print:bg-slate-100 print:text-black print:border-slate-400">
                <th className="py-2.5 px-3 font-bold text-start">Matière</th>
                <th className="py-2.5 px-2 font-bold text-center">Coeff</th>
                <th className="py-2.5 px-2 font-bold text-center">Crédits</th>
                <th className="py-2.5 px-2 font-bold text-center">CC</th>
                <th className="py-2.5 px-2 font-bold text-center">Exam</th>
                <th className="py-2.5 px-2 font-bold text-center">Note /20</th>
                <th className="py-2.5 px-2 font-bold text-center">Pondérée</th>
                <th className="py-2.5 px-3 font-bold text-center">Statut</th>
              </tr>
            </thead>
            <tbody>
              {UES.map((ue) => {
                const ueRes = result.ues[ue.id];
                return (
                  <React.Fragment key={ue.id}>
                    {/* UE Sub-header row */}
                    <tr className="bg-slate-950/80 font-bold text-cyan-300 border-t border-b border-slate-800 print:bg-slate-200 print:text-black print:border-slate-300">
                      <td colSpan={5} className="py-2 px-3">
                        {ue.code} — {ue.name[language]} (Coeff: {ue.coefficient}, Crédits: {ue.credits})
                      </td>
                      <td className="py-2 px-2 text-center">
                        {ueRes.ueAverage !== null ? `${ueRes.ueAverage.toFixed(2)}` : '--'}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {ueRes.completedCoeffs} c.
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            ueRes.isAcquired
                              ? 'bg-emerald-950/80 text-emerald-300 print:bg-transparent print:text-black'
                              : 'bg-slate-800 text-slate-400 print:bg-transparent print:text-black'
                          }`}
                        >
                          {ueRes.isAcquired ? 'UE Validée' : 'Non validée'}
                        </span>
                      </td>
                    </tr>

                    {/* Subject rows for this UE */}
                    {ueRes.subjects.map((subRes) => {
                      const { subject, cc, exam, grade, weightedGrade, isCompleted, isPassing } =
                        subRes;
                      return (
                        <tr
                          key={subject.id}
                          className="border-b border-slate-800/60 hover:bg-slate-800/30 print:border-slate-300 print:hover:bg-transparent"
                        >
                          <td className="py-2.5 px-3 font-medium text-white print:text-black">
                            {subject.name[language]}
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-300 print:text-black font-semibold">
                            {subject.coefficient}
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-300 print:text-black">
                            {subject.credits}
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-300 print:text-black">
                            {subject.assessmentType === 'EXAM_ONLY'
                              ? '—'
                              : cc !== null
                              ? cc.toFixed(2)
                              : '--'}
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-300 print:text-black">
                            {subject.assessmentType === 'CC_ONLY'
                              ? '—'
                              : exam !== null
                              ? exam.toFixed(2)
                              : '--'}
                          </td>
                          <td className="py-2.5 px-2 text-center font-bold">
                            {isCompleted && grade !== null ? (
                              <span
                                className={
                                  isPassing
                                    ? 'text-emerald-400 print:text-black'
                                    : 'text-rose-400 print:text-black'
                                }
                              >
                                {grade.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">--</span>
                            )}
                          </td>
                          <td className="py-2.5 px-2 text-center text-slate-300 print:text-black font-semibold">
                            {weightedGrade !== null ? weightedGrade.toFixed(2) : '--'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isCompleted ? (
                              <span
                                className={`text-xs font-semibold ${
                                  isPassing
                                    ? 'text-emerald-400 print:text-black'
                                    : 'text-rose-400 print:text-black'
                                }`}
                              >
                                {isPassing ? t.labels.passed : t.labels.failed}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-500 italic">
                                {t.labels.inProgress}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Algerian LMD Official Decision & Notes */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 print:border-slate-300 print:bg-white text-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-white print:text-black">
                {t.resultsSummary.decision}:
              </span>{' '}
              <span
                className={`font-black text-sm uppercase ${
                  result.isFullyCompleted
                    ? result.isPassing
                      ? 'text-emerald-400 print:text-black'
                      : 'text-rose-400 print:text-black'
                    : 'text-amber-400 print:text-black'
                }`}
              >
                {result.isFullyCompleted
                  ? result.isPassing
                    ? `${t.labels.admis} (Admis par compensation semestrielle)`
                    : `${t.labels.ajourne} (Session de rattrapage)`
                  : 'Saisie partielle des notes'}
              </span>
            </div>

            {result.mention && (
              <div>
                <span className="font-bold text-white print:text-black">
                  {t.resultsSummary.mention}:
                </span>{' '}
                <span className="font-bold text-cyan-300 print:text-black">
                  {result.mention[language]}
                </span>
              </div>
            )}
          </div>

          <p className="text-slate-400 print:text-slate-600 text-xs">
            Règle LMD : La moyenne générale est calculée en divisant la somme pondérée des notes par 16 (total des coefficients). Si la moyenne semestrielle est ≥ 10.00/20, les 29 crédits sont intégralement acquis par compensation.
          </p>
        </div>

        {/* Signature Area (Visible on Print) */}
        <div className="hidden print:flex justify-between items-center pt-8 text-xs text-black">
          <div>
            <p>Fait à Blida, le: _____________________</p>
          </div>
          <div className="text-center">
            <p className="font-bold">Le Président du Jury de Délibération</p>
            <div className="h-16"></div>
            <p>Signature et Cachet</p>
          </div>
        </div>
      </div>
    </div>
  );
};
