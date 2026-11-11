import type { SubjectDef, UEDef } from '../types';

export const TOTAL_COEFFICIENTS = 16;
export const TOTAL_CREDITS = 29;
export const TOTAL_SUBJECTS = 10;

export const UES: UEDef[] = [
  {
    id: 'uef1',
    code: 'UEF 1',
    name: {
      fr: 'UE Fondamentale 1',
      ar: 'الوحدة الأساسية 1',
      en: 'Fundamental UE 1',
    },
    coefficient: 5,
    credits: 10,
  },
  {
    id: 'uef2',
    code: 'UEF 2',
    name: {
      fr: 'UE Fondamentale 2',
      ar: 'الوحدة الأساسية 2',
      en: 'Fundamental UE 2',
    },
    coefficient: 4,
    credits: 8,
  },
  {
    id: 'uem',
    code: 'UEM',
    name: {
      fr: 'UE Méthodologique',
      ar: 'الوحدة المنهجية',
      en: 'Methodological UE',
    },
    coefficient: 5,
    credits: 9,
  },
  {
    id: 'ued',
    code: 'UED',
    name: {
      fr: 'UE Découverte',
      ar: 'الوحدة الاستكشافية',
      en: 'Discovery UE',
    },
    coefficient: 2,
    credits: 2,
  },
];

export const SUBJECTS: SubjectDef[] = [
  // UE Fondamentale 1
  {
    id: 'math3',
    ueId: 'uef1',
    name: {
      fr: 'Mathématiques 3',
      ar: 'الرياضيات 3',
      en: 'Mathematics 3',
    },
    shortName: {
      fr: 'Math 3',
      ar: 'رياضيات 3',
      en: 'Math 3',
    },
    coefficient: 3,
    credits: 6,
    assessmentType: 'CC_AND_EXAM',
  },
  {
    id: 'ondes_vibrations',
    ueId: 'uef1',
    name: {
      fr: 'Ondes et vibrations',
      ar: 'الموجات والاهتزازات',
      en: 'Waves and Vibrations',
    },
    shortName: {
      fr: 'Ondes & Vib',
      ar: 'موجات واهتزازات',
      en: 'Waves & Vib',
    },
    coefficient: 2,
    credits: 4,
    assessmentType: 'CC_AND_EXAM',
  },

  // UE Fondamentale 2
  {
    id: 'elec_fond1',
    ueId: 'uef2',
    name: {
      fr: 'Électronique fondamentale 1',
      ar: 'الإلكترونيات الأساسية 1',
      en: 'Fundamental Electronics 1',
    },
    shortName: {
      fr: 'Électronique 1',
      ar: 'إلكترونيك 1',
      en: 'Electronics 1',
    },
    coefficient: 2,
    credits: 4,
    assessmentType: 'CC_AND_EXAM',
  },
  {
    id: 'electrotech_fond1',
    ueId: 'uef2',
    name: {
      fr: 'Électrotechnique fondamentale 1',
      ar: 'الهندسة الكهربائية الأساسية 1',
      en: 'Fundamental Electrotechnics 1',
    },
    shortName: {
      fr: 'Électrotechnique 1',
      ar: 'كهروتقني 1',
      en: 'Electrotechnics 1',
    },
    coefficient: 2,
    credits: 4,
    assessmentType: 'CC_AND_EXAM',
  },

  // UE Méthodologique
  {
    id: 'proba_stat',
    ueId: 'uem',
    name: {
      fr: 'Probabilités et statistiques',
      ar: 'الاحتمالات والإحصاء',
      en: 'Probability and Statistics',
    },
    shortName: {
      fr: 'Proba & Stat',
      ar: 'احتمالات وإحصاء',
      en: 'Prob & Stat',
    },
    coefficient: 2,
    credits: 4,
    assessmentType: 'CC_AND_EXAM',
  },
  {
    id: 'info3',
    ueId: 'uem',
    name: {
      fr: 'Informatique 3',
      ar: 'الإعلام الآلي 3',
      en: 'Computer Science 3',
    },
    shortName: {
      fr: 'Info 3',
      ar: 'إعلام آلي 3',
      en: 'Info 3',
    },
    coefficient: 1,
    credits: 2,
    assessmentType: 'CC_ONLY',
  },
  {
    id: 'tp_elec_electrotech',
    ueId: 'uem',
    name: {
      fr: 'TP Électronique 1 et Électrotechnique 1',
      ar: 'أعمال تطبيقية إلكترونيك 1 وكهروتقني 1',
      en: 'Lab: Electronics 1 & Electrotechnics 1',
    },
    shortName: {
      fr: 'TP Élec & Électrotech',
      ar: 'أ.ت إلكترونيك وكهروتقني',
      en: 'TP Elec & Electrotech',
    },
    coefficient: 1,
    credits: 2,
    assessmentType: 'CC_ONLY',
  },
  {
    id: 'tp_ondes',
    ueId: 'uem',
    name: {
      fr: 'TP Ondes et vibrations',
      ar: 'أعمال تطبيقية موجات واهتزازات',
      en: 'Lab: Waves and Vibrations',
    },
    shortName: {
      fr: 'TP Ondes & Vib',
      ar: 'أ.ت موجات واهتزازات',
      en: 'TP Waves & Vib',
    },
    coefficient: 1,
    credits: 1,
    assessmentType: 'CC_ONLY',
  },

  // UE Découverte
  {
    id: 'etat_art',
    ueId: 'ued',
    name: {
      fr: "État de l'art du Génie électrique",
      ar: 'أحدث تطورات الهندسة الكهربائية',
      en: 'State of the Art in Electrical Engineering',
    },
    shortName: {
      fr: 'État de l’art GE',
      ar: 'حالة الفن هـ.ك',
      en: 'State of Art EE',
    },
    coefficient: 1,
    credits: 1,
    assessmentType: 'EXAM_ONLY',
  },
  {
    id: 'energies_env',
    ueId: 'ued',
    name: {
      fr: 'Énergies et environnement',
      ar: 'الطاقات والبيئة',
      en: 'Energies and Environment',
    },
    shortName: {
      fr: 'Énergies & Env',
      ar: 'طاقات وبيئة',
      en: 'Energies & Env',
    },
    coefficient: 1,
    credits: 1,
    assessmentType: 'EXAM_ONLY',
  },
];
