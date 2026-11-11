import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  Send,
  ExternalLink,
  Share2,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { SemesterResult, Language, GradeState } from '../types';
import { UES } from '../data/curriculum';
import { translations } from '../data/translations';

interface ResultsTabProps {
  result: SemesterResult;
  language: Language;
  defaultStudentName?: string;
  isTelegram?: boolean;
  grades?: GradeState;
  onOpenExternalPrint?: (url: string) => void;
  onShareTelegram?: (text: string) => void;
  onExportReady?: (exportFn: () => void) => void;
}

export const ResultsTab: React.FC<ResultsTabProps> = ({
  result,
  language,
  defaultStudentName = '',
  isTelegram = false,
  grades = {},
  onOpenExternalPrint,
  onShareTelegram,
  onExportReady,
}) => {
  const t = translations[language];
  const [studentName, setStudentName] = useState<string>(defaultStudentName);
  const [matricule, setMatricule] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showFullText, setShowFullText] = useState<boolean>(false);

  useEffect(() => {
    if (defaultStudentName && !studentName) {
      setStudentName(defaultStudentName);
    }
  }, [defaultStudentName, studentName]);

  const displayAverage = result.isFullyCompleted
    ? result.semesterAverage
    : result.partialAverage;

  // Build clean text summary for Telegram sharing or clipboard
  const buildSummaryText = (): string => {
    const avgStr = displayAverage !== null ? displayAverage.toFixed(2) : '--';
    const statusText = result.isFullyCompleted
      ? result.isPassing
        ? '✅ ADMIS(E) (Par compensation)'
        : '⚠️ AJOURNÉ(E) (Rattrapage)'
      : '⏳ Saisie en cours';

    let modulesList = '';
    for (const ue of UES) {
      const ueRes = result.ues[ue.id];
      const ueAvgStr = ueRes.ueAverage !== null ? ueRes.ueAverage.toFixed(2) : '--';
      modulesList += `\n📌 ${ue.code} (Moy: ${ueAvgStr}/20):\n`;
      for (const s of ueRes.subjects) {
        const gradeStr = s.grade !== null ? `${s.grade.toFixed(2)}/20` : 'En attente';
        const passMark = s.isPassing ? '✓' : '✗';
        modulesList += `  • ${s.subject.name[language]}: ${gradeStr} [Coeff ${s.subject.coefficient}] (${passMark})\n`;
      }
    }

    return `🎓 RELEVÉ DE NOTES PRÉVISIONNEL — S3
🏛️ ${t.university} — ${t.faculty}
📚 Licence L2 Automatique — Semestre 3 (S3)

👤 Étudiant(e): ${studentName || 'Non renseigné'}
🆔 Matricule: ${matricule || 'N/A'}

📊 Moyenne Semestrielle: ${avgStr} / 20
🏆 Crédits Acquis: ${result.creditsAcquired} / 29
⚖️ Coefficients Validés: ${result.completedCoeffs} / 16
🎯 Décision: ${statusText}
${result.mention ? `🏅 Mention: ${result.mention[language]}\n` : ''}
${modulesList}
Calculé via L2 ATM — Université de Blida 1`;
  };

  // Generate self-contained standalone HTML report for offline printing / saving
  const generateStandaloneHtml = (): string => {
    const isAr = language === 'ar';
    const title = `${t.appName} — ${t.resultsSummary.officialTranscript}`;

    let rowsHtml = '';
    for (const ue of UES) {
      const ueRes = result.ues[ue.id];
      rowsHtml += `
        <tr style="background:#f1f5f9; font-weight:bold; color:#0f172a;">
          <td colspan="5" style="padding:8px 12px; border:1px solid #cbd5e1;">
            ${ue.code} — ${ue.name[language]} (Coeff: ${ue.coefficient}, Crédits: ${ue.credits})
          </td>
          <td style="padding:8px; text-align:center; border:1px solid #cbd5e1;">
            ${ueRes.ueAverage !== null ? ueRes.ueAverage.toFixed(2) : '--'}
          </td>
          <td style="padding:8px; text-align:center; border:1px solid #cbd5e1;">
            ${ueRes.completedCoeffs} c.
          </td>
          <td style="padding:8px; text-align:center; border:1px solid #cbd5e1;">
            ${ueRes.isAcquired ? 'UE Validée' : 'Non validée'}
          </td>
        </tr>
      `;

      for (const subRes of ueRes.subjects) {
        const { subject, cc, exam, grade, weightedGrade, isCompleted, isPassing } = subRes;
        rowsHtml += `
          <tr>
            <td style="padding:8px 12px; border:1px solid #cbd5e1;">${subject.name[language]}</td>
            <td style="padding:8px; text-align:center; border:1px solid #cbd5e1; font-weight:600;">${subject.coefficient}</td>
            <td style="padding:8px; text-align:center; border:1px solid #cbd5e1;">${subject.credits}</td>
            <td style="padding:8px; text-align:center; border:1px solid #cbd5e1;">${subject.assessmentType === 'EXAM_ONLY' ? '—' : cc !== null ? cc.toFixed(2) : '--'}</td>
            <td style="padding:8px; text-align:center; border:1px solid #cbd5e1;">${subject.assessmentType === 'CC_ONLY' ? '—' : exam !== null ? exam.toFixed(2) : '--'}</td>
            <td style="padding:8px; text-align:center; border:1px solid #cbd5e1; font-weight:bold; color:${isPassing ? '#15803d' : '#b91c1c'};">${isCompleted && grade !== null ? grade.toFixed(2) : '--'}</td>
            <td style="padding:8px; text-align:center; border:1px solid #cbd5e1; font-weight:600;">${weightedGrade !== null ? weightedGrade.toFixed(2) : '--'}</td>
            <td style="padding:8px; text-align:center; border:1px solid #cbd5e1; font-size:12px; font-weight:bold; color:${isPassing ? '#15803d' : '#b91c1c'};">${isCompleted ? (isPassing ? t.labels.passed : t.labels.failed) : t.labels.inProgress}</td>
          </tr>
        `;
      }
    }

    return `<!DOCTYPE html>
<html lang="${language}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; margin: 20px; color: #0f172a; background: #fff; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; }
    .header h1 { margin: 8px 0 4px; font-size: 20px; }
    .meta { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 13px; }
    .kpis { display: flex; gap: 12px; margin-bottom: 16px; }
    .kpi { flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center; background: #f8fafc; }
    .kpi-val { font-size: 20px; font-weight: bold; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
    .decision { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; background: #f8fafc; font-size: 13px; margin-bottom: 24px; }
    .footer { display: flex; justify-content: space-between; margin-top: 30px; font-size: 12px; }
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="font-size:12px; text-transform:uppercase; font-weight:bold; color:#0284c7;">${t.university}</div>
    <div style="font-size:11px; color:#64748b;">${t.faculty}</div>
    <h1>${t.resultsSummary.officialTranscript}</h1>
    <div style="font-size:11px; color:#64748b;">${t.resultsSummary.academicYear} • Licence L2 Automatique (S3)</div>
  </div>

  <div class="meta">
    <div><strong>${t.resultsSummary.studentNamePlaceholder}:</strong> ${studentName || '—'}</div>
    <div><strong>${t.resultsSummary.matriculePlaceholder}:</strong> ${matricule || '—'}</div>
  </div>

  <div class="kpis">
    <div class="kpi">
      <div style="font-size:11px; color:#64748b;">${t.labels.semesterAverage}</div>
      <div class="kpi-val" style="color:${displayAverage !== null && displayAverage >= 10 ? '#15803d' : '#b91c1c'};">${displayAverage !== null ? displayAverage.toFixed(2) : '--'} / 20</div>
    </div>
    <div class="kpi">
      <div style="font-size:11px; color:#64748b;">${t.labels.creditsAcquired}</div>
      <div class="kpi-val">${result.creditsAcquired} / 29</div>
    </div>
    <div class="kpi">
      <div style="font-size:11px; color:#64748b;">${t.labels.totalCoeffs}</div>
      <div class="kpi-val">${result.completedCoeffs} / 16</div>
    </div>
    <div class="kpi">
      <div style="font-size:11px; color:#64748b;">${t.labels.status}</div>
      <div class="kpi-val" style="font-size:14px; color:${result.isFullyCompleted && result.isPassing ? '#15803d' : '#b91c1c'};">
        ${result.isFullyCompleted ? (result.isPassing ? t.labels.admis : t.labels.ajourne) : t.labels.inProgress}
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr style="background:#0f172a; color:#fff;">
        <th style="padding:8px 12px; text-align:start; border:1px solid #0f172a;">Matière</th>
        <th style="padding:8px; text-align:center; border:1px solid #0f172a;">Coeff</th>
        <th style="padding:8px; text-align:center; border:1px solid #0f172a;">Crédits</th>
        <th style="padding:8px; text-align:center; border:1px solid #0f172a;">CC</th>
        <th style="padding:8px; text-align:center; border:1px solid #0f172a;">Exam</th>
        <th style="padding:8px; text-align:center; border:1px solid #0f172a;">Note /20</th>
        <th style="padding:8px; text-align:center; border:1px solid #0f172a;">Pondérée</th>
        <th style="padding:8px; text-align:center; border:1px solid #0f172a;">Statut</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="decision">
    <strong>${t.resultsSummary.decision}:</strong>
    <span style="font-weight:bold; text-transform:uppercase; color:${result.isFullyCompleted && result.isPassing ? '#15803d' : '#b91c1c'};">
      ${result.isFullyCompleted ? (result.isPassing ? `${t.labels.admis} (Par compensation semestrielle)` : `${t.labels.ajourne} (Session de rattrapage)`) : 'Saisie en cours'}
    </span>
    ${result.mention ? ` • <strong>${t.resultsSummary.mention}:</strong> ${result.mention[language]}` : ''}
    <div style="font-size:11px; color:#64748b; margin-top:4px;">
      Moyenne semestrielle calculée en divisant la somme pondérée par 16 (total des coefficients). Si moyenne &ge; 10.00/20, les 29 crédits sont acquis.
    </div>
  </div>

  <div class="footer">
    <div>Fait à Blida, le: ${new Date().toLocaleDateString('fr-FR')}</div>
    <div style="text-align:center;">
      <strong>Le Président du Jury de Délibération</strong><br><br><br>
      Signature et Cachet
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 250);
    };
  </script>
</body>
</html>`;
  };

  // Telegram native share action
  const handleShareTelegram = () => {
    const text = buildSummaryText();
    if (onShareTelegram) {
      onShareTelegram(text);
    } else {
      const tgUrl = `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
      window.open(tgUrl, '_blank');
    }
  };

  // Open in external system browser (Chrome/Safari) with auto-print
  const handleOpenExternalBrowser = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const dataHash = encodeURIComponent(JSON.stringify(grades));
    const exportUrl = `${origin}${pathname}?tab=results&print=1#data=${dataHash}`;

    if (onOpenExternalPrint) {
      onOpenExternalPrint(exportUrl);
    } else {
      window.open(exportUrl, '_blank');
    }
  };

  const handlePrint = () => {
    if (isTelegram) {
      // In Telegram webview, window.print() is disabled by Chromium WebView.
      // Redirect to external browser or share!
      handleOpenExternalBrowser();
      return;
    }

    try {
      window.print();
    } catch {
      handleOpenInNewTab();
    }
  };

  const handleOpenInNewTab = () => {
    const html = generateStandaloneHtml();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
    } else {
      handleDownloadHtml();
    }
  };

  const handleDownloadHtml = () => {
    if (isTelegram) {
      handleOpenExternalBrowser();
      return;
    }
    const html = generateStandaloneHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanName = (studentName || 'Etudiant').replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
    a.download = `Releve_Notes_L2_ATM_S3_${cleanName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = async () => {
    const text = buildSummaryText();

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Failed to copy summary:', err);
    }
  };

  useEffect(() => {
    onExportReady?.(handleShareTelegram);
  }, [onExportReady, grades, studentName, matricule, displayAverage]);

  // Reusable Export Action Buttons Bar
  const renderActionButtons = () => (
    <div className="flex items-center gap-2 flex-wrap">
      {/* 1. Main Print / PDF Button */}
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        title="Imprimer directement ou sauvegarder en PDF"
      >
        <Printer className="w-4 h-4" />
        <span>{t.labels.print}</span>
      </button>

      {/* 2. Telegram Native Share Button */}
      <button
        type="button"
        onClick={handleShareTelegram}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:brightness-110 shadow-lg shadow-sky-500/25 active:scale-95 transition-all"
        title="Envoyer le relevé dans vos Messages Enregistrés sur Telegram"
      >
        <Send className="w-4 h-4" />
        <span>{t.labels.shareTelegram}</span>
      </button>

      {/* 3. External Browser Print Button (Opens Chrome/Safari) */}
      <button
        type="button"
        onClick={handleOpenExternalBrowser}
        className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 active:scale-95 transition-all"
        title="Ouvre dans Chrome/Safari pour sauvegarder en PDF ou imprimer"
      >
        <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
        <span>{t.labels.openInBrowser}</span>
      </button>

      {/* 4. Copy Summary Text */}
      <button
        type="button"
        onClick={handleCopySummary}
        className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all active:scale-95"
        title="Copier le texte du relevé pour le coller"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-bold">{t.labels.copied}</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.labels.copySummary}</span>
          </>
        )}
      </button>

      {/* 5. Download HTML (for non-Telegram / desktop) */}
      {!isTelegram && (
        <button
          type="button"
          onClick={handleDownloadHtml}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-all active:scale-95"
          title="Télécharger le fichier HTML"
        >
          <Download className="w-3.5 h-3.5 text-teal-400" />
          <span>{t.labels.downloadHtml}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Telegram Notice Banner if inside Telegram */}
      {isTelegram && (
        <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-800/60 text-sky-200 text-xs sm:text-sm flex items-start gap-2.5 no-print">
          <Share2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-sky-300">
              {t.resultsSummary.telegramNoticeTitle}
            </p>
            <p className="text-xs text-sky-200/80 mt-0.5">
              {t.resultsSummary.telegramNoticeDesc}
            </p>
          </div>
        </div>
      )}

      {/* Top Action Bar (Hidden in Print) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white m-0">
              {t.resultsSummary.title}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              L2 ATM — S3
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 m-0 mt-0.5">
            {t.resultsSummary.printInstruction}
          </p>
        </div>

        {renderActionButtons()}
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
          <p className="text-xs text-slate-400 print:text-slate-600 font-medium">
            {t.resultsSummary.academicYear} • Licence L2 Automatique — Semestre 3 (S3)
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
            Règle LMD : La moyenne générale est calculée en divisant la somme pondérée des notes par 16 (total des coefficients). Si la moyenne semestrielle est &ge; 10.00/20, les 29 crédits sont intégralement acquis par compensation.
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

      {/* Expandable Transcript Text View (100% accessible on any mobile device) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md no-print">
        <button
          type="button"
          onClick={() => setShowFullText(!showFullText)}
          className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-300 hover:text-white"
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>{t.resultsSummary.rawTextSection}</span>
          </div>
          {showFullText ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showFullText && (
          <div className="mt-3 space-y-2">
            <textarea
              readOnly
              rows={8}
              value={buildSummaryText()}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 selection:bg-cyan-500"
            />
            <button
              type="button"
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              {copied ? `✓ ${t.labels.copied}` : t.resultsSummary.copyAllText}
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR (Directly under transcript for mobile & Telegram) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="text-center sm:text-start">
          <p className="text-xs sm:text-sm font-bold text-white m-0">
            {t.resultsSummary.exportSectionTitle}
          </p>
          <p className="text-xs text-slate-400 m-0">
            {isTelegram
              ? t.resultsSummary.exportSectionDescTelegram
              : t.resultsSummary.exportSectionDesc}
          </p>
        </div>

        {renderActionButtons()}
      </div>
    </div>
  );
};
