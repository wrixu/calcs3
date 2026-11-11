import type { Language } from '../types';

export interface TranslationSchema {
  appName: string;
  appFullName: string;
  subtitle: string;
  university: string;
  faculty: string;
  officialNotice: string;
  tabs: {
    calculator: string;
    target: string;
    simulator: string;
    results: string;
  };
  labels: {
    cc: string;
    exam: string;
    grade: string;
    coefficient: string;
    credits: string;
    passed: string;
    failed: string;
    inProgress: string;
    status: string;
    admis: string;
    ajourne: string;
    incomplete: string;
    semesterAverage: string;
    provisionalAverage: string;
    totalCoeffs: string;
    totalCredits: string;
    creditsAcquired: string;
    completedSubjects: string;
    pointsAccumulated: string;
    outOf20: string;
    outOf320: string;
    outOf29: string;
    outOf16: string;
    reset: string;
    loadSample: string;
    print: string;
    assessmentType: string;
    ccAndExam: string;
    ccOnly: string;
    examOnly: string;
    enterGrade: string;
    ueAverage: string;
    ueAcquired: string;
    ueNotAcquired: string;
    compensation: string;
    neededFor10: string;
    minExamNeeded: string;
    impossible: string;
    guaranteed: string;
    downloadHtml: string;
    copySummary: string;
    copied: string;
  };
  targetCalc: {
    title: string;
    description: string;
    targetLabel: string;
    pointsTarget: string;
    pointsCurrent: string;
    pointsRemaining: string;
    uniformAverageNeeded: string;
    statusAchieved: string;
    statusPossible: string;
    statusImpossible: string;
    subjectTargetsTitle: string;
    subjectTargetDesc: string;
  };
  simulator: {
    title: string;
    description: string;
    applyToMain: string;
    resetSim: string;
    simulatedAverage: string;
    comparisonWithCurrent: string;
    examSlider: string;
  };
  resultsSummary: {
    title: string;
    officialTranscript: string;
    studentNamePlaceholder: string;
    matriculePlaceholder: string;
    academicYear: string;
    summaryStats: string;
    decision: string;
    mention: string;
    ueDetails: string;
    printInstruction: string;
  };
  modal: {
    resetTitle: string;
    resetMessage: string;
    confirm: string;
    cancel: string;
  };
  footer: {
    devNotice: string;
    autoSave: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  fr: {
    appName: 'L2 ATM',
    appFullName: 'L2 ATM — Calculateur de Moyenne (S3)',
    subtitle: 'L2 Automatique — Semestre 3 (S3)',
    university: 'Université Saad Dahlab Blida 1',
    faculty: 'Institut d’Aéronautique et des Études Spatiales / Faculté de Technologie',
    officialNotice:
      'Programme officiel S3 Automatique (Blida 1). L’anglais technique est supprimé cette année.',
    tabs: {
      calculator: 'Calculateur',
      target: 'Objectif',
      simulator: 'Simulateur',
      results: 'Résultats & Export',
    },
    labels: {
      cc: 'Contrôle Continu (CC)',
      exam: 'Examen',
      grade: 'Note finale',
      coefficient: 'Coeff',
      credits: 'Crédits',
      passed: 'Validé',
      failed: 'Non validé',
      inProgress: 'En cours',
      status: 'Statut',
      admis: 'Admis(e)',
      ajourne: 'Ajourné(e) / Rattrapage',
      incomplete: 'Saisie incomplète',
      semesterAverage: 'Moyenne Semestrielle',
      provisionalAverage: 'Moyenne Provisoire',
      totalCoeffs: 'Total Coefficients',
      totalCredits: 'Total Crédits',
      creditsAcquired: 'Crédits Acquis',
      completedSubjects: 'Matières Complétées',
      pointsAccumulated: 'Points Accumulés',
      outOf20: '/ 20',
      outOf320: '/ 320',
      outOf29: '/ 29',
      outOf16: '/ 16',
      reset: 'Réinitialiser',
      loadSample: 'Exemple Réussi',
      print: 'Imprimer / PDF',
      assessmentType: 'Mode d’évaluation',
      ccAndExam: '40% CC + 60% Examen',
      ccOnly: '100% CC',
      examOnly: '100% Examen',
      enterGrade: 'Note (0 - 20)',
      ueAverage: 'Moyenne UE',
      ueAcquired: 'UE Acquise',
      ueNotAcquired: 'UE Non Acquise',
      compensation: 'Compensée',
      neededFor10: 'Exam min pour 10/20:',
      minExamNeeded: 'Exam requis:',
      impossible: 'Impossible (> 20)',
      guaranteed: 'Déjà garanti (0/20 suffit)',
      downloadHtml: 'Télécharger le Relevé (HTML / PDF)',
      copySummary: 'Copier le Résumé',
      copied: 'Copié !',
    },
    targetCalc: {
      title: 'Calculateur d’Objectif de Moyenne',
      description:
        'Calculez exactement les notes d’examen nécessaires pour obtenir la moyenne souhaitée au semestre.',
      targetLabel: 'Moyenne semestrielle visée',
      pointsTarget: 'Points totaux requis (sur 320)',
      pointsCurrent: 'Points actuellement acquis',
      pointsRemaining: 'Points restants à acquérir',
      uniformAverageNeeded: 'Note moyenne requise sur les épreuves restantes',
      statusAchieved: 'Félicitations ! Votre objectif est déjà atteint ou garanti.',
      statusPossible: 'Objectif accessible ! Visez les notes indiquées ci-dessous.',
      statusImpossible:
        'Mathématiquement impossible : la moyenne requise dépasse 20/20 avec les notes actuelles.',
      subjectTargetsTitle: 'Notes d’examen requises par matière (pour valider à 10/20)',
      subjectTargetDesc:
        'Pour les matières avec CC déjà renseigné, voici la note d’examen minimale nécessaire :',
    },
    simulator: {
      title: 'Simulateur "What-If" (Hypothèses)',
      description:
        'Testez différents scénarios d’examens en temps réel sans modifier vos notes réelles enregistrées.',
      applyToMain: 'Appliquer ces notes au calculateur',
      resetSim: 'Réinitialiser le simulateur',
      simulatedAverage: 'Moyenne Simulée',
      comparisonWithCurrent: 'Écart avec la moyenne actuelle',
      examSlider: 'Note d’examen estimée',
    },
    resultsSummary: {
      title: 'Relevé de Notes Prévisionnel',
      officialTranscript: 'Relevé Officiel Prévisionnel — S3 Automatique',
      studentNamePlaceholder: 'Nom et Prénom de l’étudiant(e)',
      matriculePlaceholder: 'Matricule',
      academicYear: 'Année Universitaire 2024/2025 - 2025/2026',
      summaryStats: 'Statistiques Globales',
      decision: 'Décision du Jury',
      mention: 'Mention',
      ueDetails: 'Détail par Unité d’Enseignement (UE)',
      printInstruction:
        'Cliquez sur "Imprimer / PDF" pour générer une version papier ou sauvegarder en PDF.',
    },
    modal: {
      resetTitle: 'Confirmer la réinitialisation',
      resetMessage:
        'Êtes-vous sûr de vouloir effacer toutes les notes saisies ? Cette action est irréversible.',
      confirm: 'Oui, tout effacer',
      cancel: 'Annuler',
    },
    footer: {
      devNotice: 'Conçu avec précision pour les étudiants de L2 Automatique — Université de Blida 1.',
      autoSave: 'Sauvegarde automatique activée (LocalStorage).',
    },
  },
  ar: {
    appName: 'L2 ATM',
    appFullName: 'L2 ATM — حاسبة معدل السداسي 3',
    subtitle: 'السنة الثانية أوتوماتيك — السداسي 3 (S3)',
    university: 'جامعة سعد دحلب البليدة 1',
    faculty: 'معهد علوم الطيران ودراسات الفضاء / كلية التكنولوجيا',
    officialNotice:
      'البرنامج الرسمي للسداسي 3 أوتوماتيك (البليدة 1). تم حذف الإنجليزية التقنية لهذا الموسم.',
    tabs: {
      calculator: 'الحاسبة',
      target: 'الهدف',
      simulator: 'المحاكي',
      results: 'النتائج والطباعة',
    },
    labels: {
      cc: 'المراقبة المستمرة (CC)',
      exam: 'الامتحان',
      grade: 'العلامة النهائية',
      coefficient: 'المعامل',
      credits: 'الأرصدة',
      passed: 'مكتسب',
      failed: 'غير مكتسب',
      inProgress: 'قيد الإنجاز',
      status: 'الحالة',
      admis: 'ناجح(ة)',
      ajourne: 'مؤجل(ة) / استدراك',
      incomplete: 'الحساب غير مكتمل',
      semesterAverage: 'المعدل السداسي',
      provisionalAverage: 'المعدل المؤقت',
      totalCoeffs: 'مجموع المعاملات',
      totalCredits: 'مجموع الأرصدة',
      creditsAcquired: 'الأرصدة المكتسبة',
      completedSubjects: 'المواد المكتملة',
      pointsAccumulated: 'النقاط المحصلة',
      outOf20: '/ 20',
      outOf320: '/ 320',
      outOf29: '/ 29',
      outOf16: '/ 16',
      reset: 'إعادة ضبط',
      loadSample: 'تحميل مثال ناجح',
      print: 'طباعة / تصدير PDF',
      assessmentType: 'نظام التقييم',
      ccAndExam: '40% مراقبة مستمرة + 60% امتحان',
      ccOnly: '100% مراقبة مستمرة',
      examOnly: '100% امتحان',
      enterGrade: 'العلامة (0 - 20)',
      ueAverage: 'معدل الوحدة',
      ueAcquired: 'وحدة مكتسبة',
      ueNotAcquired: 'وحدة غير مكتسبة',
      compensation: 'بالتعويض',
      neededFor10: 'الامتحان الأدنى للحصول على 10/20:',
      minExamNeeded: 'الامتحان المطلوب:',
      impossible: 'مستحيل (> 20)',
      guaranteed: 'مضمون بالفعل (يكفي 0/20)',
      downloadHtml: 'تحميل كشف النقاط (HTML / PDF)',
      copySummary: 'نسخ الملخص',
      copied: 'تم النسخ بنجاح !',
    },
    targetCalc: {
      title: 'حاسبة المعدل المستهدف',
      description:
        'احسب بدقة علامات الامتحانات الضرورية لتحقيق المعدل السداسي المطلوب.',
      targetLabel: 'المعدل السداسي المستهدف',
      pointsTarget: 'مجموع النقاط المطلوبة (من 320)',
      pointsCurrent: 'النقاط المحصلة حالياً',
      pointsRemaining: 'النقاط المتبقية للوصول للهدف',
      uniformAverageNeeded: 'المعدل المطلوب في المواد والامتحانات المتبقية',
      statusAchieved: 'تهانينا! الهدف محقق بالفعل أو مضمون.',
      statusPossible: 'الهدف ممكن ومتاح! ركز على تحقيق العلامات الموضحة أدناه.',
      statusImpossible:
        'مستحيل رياضياً: المعدل المطلوب يتجاوز 20/20 بناءً على العلامات الحالية.',
      subjectTargetsTitle: 'علامات الامتحان المطلوبة في كل مادة (لاستيفاء 10/20)',
      subjectTargetDesc:
        'بالنسبة للمواد التي تم إدخال علامة المراقبة المستمرة لها، إليك علامة الامتحان الدنيا المطلوبة :',
    },
    simulator: {
      title: 'محاكي الفرضيات (What-If)',
      description:
        'جرب سيناريوهات مختلفة لعلامات الامتحانات بشكل فوري ومباشر دون التأثير على بياناتك المحفوظة.',
      applyToMain: 'تطبيق هذه العلامات في الحاسبة',
      resetSim: 'إعادة تعيين المحاكي',
      simulatedAverage: 'المعدل التقديري',
      comparisonWithCurrent: 'الفارق عن المعدل الحالي',
      examSlider: 'علامة الامتحان التقديرية',
    },
    resultsSummary: {
      title: 'كشف النقاط التقديري',
      officialTranscript: 'كشف نقاط رسمي تقديري — السداسي 3 أوتوماتيك',
      studentNamePlaceholder: 'اسم ولقب الطالب(ة)',
      matriculePlaceholder: 'رقم التسجيل',
      academicYear: 'السنة الجامعية 2024/2025 - 2025/2026',
      summaryStats: 'إحصائيات شاملة',
      decision: 'قرار لجنة المداولات',
      mention: 'الملاحظة',
      ueDetails: 'التفاصيل حسب الوحدات التعليمية (UE)',
      printInstruction:
        'اضغط على "طباعة / تصدير PDF" لطباعة كشف النقاط بتنسيق ورقي احترافي.',
    },
    modal: {
      resetTitle: 'تأكيد إعادة الضبط',
      resetMessage:
        'هل أنت متأكد من رغبتك في مسح جميع العلامات المدخلة؟ لا يمكن التراجع عن هذا الإجراء.',
      confirm: 'نعم، مسح الكل',
      cancel: 'إلغاء',
    },
    footer: {
      devNotice: 'تم التطوير بدقة لطلبة السنة الثانية ليسانس أوتوماتيك — جامعة البليدة 1.',
      autoSave: 'الحفظ التلقائي مفعّل (LocalStorage).',
    },
  },
  en: {
    appName: 'L2 ATM',
    appFullName: 'L2 ATM — S3 Grade Calculator',
    subtitle: 'L2 Automatique — Semester 3 (S3)',
    university: 'University Saad Dahlab Blida 1',
    faculty: 'Aeronautics & Space Studies Institute / Faculty of Technology',
    officialNotice:
      'Official S3 Automatique curriculum (Blida 1). English Technical has been removed for the current year.',
    tabs: {
      calculator: 'Calculator',
      target: 'Target',
      simulator: 'Simulator',
      results: 'Results & Export',
    },
    labels: {
      cc: 'Continuous Assessment (CC)',
      exam: 'Exam',
      grade: 'Final Grade',
      coefficient: 'Coeff',
      credits: 'Credits',
      passed: 'Passed',
      failed: 'Failed',
      inProgress: 'In Progress',
      status: 'Status',
      admis: 'Passed (Admis)',
      ajourne: 'Remedial (Ajourné)',
      incomplete: 'Incomplete',
      semesterAverage: 'Semester Average',
      provisionalAverage: 'Provisional Average',
      totalCoeffs: 'Total Coefficients',
      totalCredits: 'Total Credits',
      creditsAcquired: 'Acquired Credits',
      completedSubjects: 'Completed Subjects',
      pointsAccumulated: 'Accumulated Points',
      outOf20: '/ 20',
      outOf320: '/ 320',
      outOf29: '/ 29',
      outOf16: '/ 16',
      reset: 'Reset All',
      loadSample: 'Load Sample',
      print: 'Print / Export PDF',
      assessmentType: 'Assessment Type',
      ccAndExam: '40% CC + 60% Exam',
      ccOnly: '100% CC',
      examOnly: '100% Exam',
      enterGrade: 'Grade (0 - 20)',
      ueAverage: 'UE Average',
      ueAcquired: 'UE Acquired',
      ueNotAcquired: 'UE Not Acquired',
      compensation: 'Compensated',
      neededFor10: 'Min Exam for 10/20:',
      minExamNeeded: 'Required Exam:',
      impossible: 'Impossible (> 20)',
      guaranteed: 'Guaranteed (0/20 suffices)',
      downloadHtml: 'Download Report (HTML / PDF)',
      copySummary: 'Copy Summary',
      copied: 'Copied!',
    },
    targetCalc: {
      title: 'Target Grade Calculator',
      description:
        'Calculate the exact exam grades required to achieve your desired semester average.',
      targetLabel: 'Target Semester Average',
      pointsTarget: 'Total Points Needed (out of 320)',
      pointsCurrent: 'Points Currently Acquired',
      pointsRemaining: 'Remaining Points Needed',
      uniformAverageNeeded: 'Average grade needed on remaining subjects',
      statusAchieved: 'Congratulations! Your target is already achieved or guaranteed.',
      statusPossible: 'Target is achievable! Aim for the grades listed below.',
      statusImpossible:
        'Mathematically impossible: Required average exceeds 20/20 with current grades.',
      subjectTargetsTitle: 'Required Exam Grades per Subject (to pass at 10/20)',
      subjectTargetDesc:
        'For subjects with entered CC grades, here is the minimum exam score needed:',
    },
    simulator: {
      title: 'What-If Simulator',
      description:
        'Test various exam grade scenarios in real time without altering your saved real grades.',
      applyToMain: 'Apply these grades to calculator',
      resetSim: 'Reset Simulator',
      simulatedAverage: 'Simulated Average',
      comparisonWithCurrent: 'Difference from current average',
      examSlider: 'Estimated exam mark',
    },
    resultsSummary: {
      title: 'Projected Academic Transcript',
      officialTranscript: 'Official Projected Grade Report — S3 Automatique',
      studentNamePlaceholder: 'Student Full Name',
      matriculePlaceholder: 'Student ID / Matricule',
      academicYear: 'Academic Year 2024/2025 - 2025/2026',
      summaryStats: 'Overall Statistics',
      decision: 'Jury Decision',
      mention: 'Honors / Mention',
      ueDetails: 'Details by Teaching Unit (UE)',
      printInstruction:
        'Click "Print / Export PDF" to generate a clean, printable transcript or save as PDF.',
    },
    modal: {
      resetTitle: 'Confirm Reset',
      resetMessage:
        'Are you sure you want to clear all entered grades? This action cannot be undone.',
      confirm: 'Yes, clear all',
      cancel: 'Cancel',
    },
    footer: {
      devNotice: 'Engineered specifically for L2 Automatique students — University of Blida 1.',
      autoSave: 'Auto-save enabled (LocalStorage).',
    },
  },
};
