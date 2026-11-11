import { describe, it, expect } from 'vitest';
import {
  calculateSubjectGrade,
  calculateSemester,
  calculateRequiredExam,
  analyzeSemesterTarget,
  isValidGrade,
  roundGrade,
} from './calculator';
import {
  SUBJECTS,
  UES,
  TOTAL_COEFFICIENTS,
  TOTAL_CREDITS,
  TOTAL_SUBJECTS,
} from '../data/curriculum';
import { translations } from '../data/translations';
import type { GradeState } from '../types';

describe('G2 ATM - S3 Grade Calculator Comprehensive Audit', () => {
  // Audit Item 1: Exactly 10 subjects
  it('Audit 1: There are exactly 10 subjects', () => {
    expect(SUBJECTS.length).toBe(10);
    expect(TOTAL_SUBJECTS).toBe(10);
    const uniqueIds = new Set(SUBJECTS.map((s) => s.id));
    expect(uniqueIds.size).toBe(10);
  });

  // Audit Item 2: Total coefficients = 16
  it('Audit 2: Total coefficients = 16', () => {
    const sumCoefficients = SUBJECTS.reduce((acc, s) => acc + s.coefficient, 0);
    expect(sumCoefficients).toBe(16);
    expect(TOTAL_COEFFICIENTS).toBe(16);

    const ueCoeffSum = UES.reduce((acc, u) => acc + u.coefficient, 0);
    expect(ueCoeffSum).toBe(16);
  });

  // Audit Item 3: Total credits = 29
  it('Audit 3: Total credits = 29', () => {
    const sumCredits = SUBJECTS.reduce((acc, s) => acc + s.credits, 0);
    expect(sumCredits).toBe(29);
    expect(TOTAL_CREDITS).toBe(29);

    const ueCreditsSum = UES.reduce((acc, u) => acc + u.credits, 0);
    expect(ueCreditsSum).toBe(29);
  });

  // Audit Item 4: English Technical is not included
  it('Audit 4: English Technical is not included', () => {
    const englishSubject = SUBJECTS.find(
      (s) =>
        s.id.toLowerCase().includes('anglais') ||
        s.id.toLowerCase().includes('english') ||
        s.name.fr.toLowerCase().includes('anglais') ||
        s.name.en.toLowerCase().includes('english')
    );
    expect(englishSubject).toBeUndefined();
  });

  // Audit Item 5: First five subjects use 40% CC + 60% Exam
  it('Audit 5: First five subjects use 40% CC + 60% Exam', () => {
    const firstFive = SUBJECTS.slice(0, 5);
    expect(firstFive.length).toBe(5);

    const expectedFirstFiveIds = [
      'math3',
      'ondes_vibrations',
      'elec_fond1',
      'electrotech_fond1',
      'proba_stat',
    ];
    expect(firstFive.map((s) => s.id)).toEqual(expectedFirstFiveIds);

    for (const sub of firstFive) {
      expect(sub.assessmentType).toBe('CC_AND_EXAM');

      // Test formula: (CC * 0.40) + (Exam * 0.60)
      const res = calculateSubjectGrade(sub, 14, 12);
      expect(res.grade).toBe(12.8); // 14*0.4 + 12*0.6 = 5.6 + 7.2 = 12.8

      const res2 = calculateSubjectGrade(sub, 10, 15);
      expect(res2.grade).toBe(13.0); // 10*0.4 + 15*0.6 = 4 + 9 = 13.0
    }
  });

  // Audit Item 6: Informatique 3 and both TP subjects use 100% CC
  it('Audit 6: Informatique 3 and both TP subjects use 100% CC', () => {
    const info3 = SUBJECTS.find((s) => s.id === 'info3')!;
    const tpElec = SUBJECTS.find((s) => s.id === 'tp_elec_electrotech')!;
    const tpOndes = SUBJECTS.find((s) => s.id === 'tp_ondes')!;

    expect(info3).toBeDefined();
    expect(tpElec).toBeDefined();
    expect(tpOndes).toBeDefined();

    expect(info3.assessmentType).toBe('CC_ONLY');
    expect(tpElec.assessmentType).toBe('CC_ONLY');
    expect(tpOndes.assessmentType).toBe('CC_ONLY');

    // Test 100% CC grade equality
    expect(calculateSubjectGrade(info3, 16.5, null).grade).toBe(16.5);
    expect(calculateSubjectGrade(tpElec, 14.25, null).grade).toBe(14.25);
    expect(calculateSubjectGrade(tpOndes, 15.0, null).grade).toBe(15.0);
  });

  // Audit Item 7: État de l'art and Énergies et environnement use 100% Exam
  it('Audit 7: État de l\'art and Énergies et environnement use 100% Exam', () => {
    const etatArt = SUBJECTS.find((s) => s.id === 'etat_art')!;
    const energies = SUBJECTS.find((s) => s.id === 'energies_env')!;

    expect(etatArt).toBeDefined();
    expect(energies).toBeDefined();

    expect(etatArt.assessmentType).toBe('EXAM_ONLY');
    expect(energies.assessmentType).toBe('EXAM_ONLY');

    // Test 100% Exam grade equality
    expect(calculateSubjectGrade(etatArt, null, 13.5).grade).toBe(13.5);
    expect(calculateSubjectGrade(energies, null, 17.0).grade).toBe(17.0);
  });

  // Audit Item 8: Semester average is calculated using coefficients, divided by 16
  it('Audit 8: Semester average is calculated using coefficients, divided by 16', () => {
    // Populate all 10 subjects with uniform 12.00
    const gradesUniform: GradeState = {};
    for (const sub of SUBJECTS) {
      if (sub.assessmentType === 'CC_AND_EXAM') gradesUniform[sub.id] = { cc: 12, exam: 12 };
      else if (sub.assessmentType === 'CC_ONLY') gradesUniform[sub.id] = { cc: 12 };
      else gradesUniform[sub.id] = { exam: 12 };
    }
    const resUniform = calculateSemester(gradesUniform);
    expect(resUniform.isFullyCompleted).toBe(true);
    expect(resUniform.pointsAccumulated).toBe(192); // 12 * 16 = 192
    expect(resUniform.semesterAverage).toBe(12.0); // 192 / 16 = 12

    // Check with varied weights: Math3 (coeff 3) = 15, Ondes (coeff 2) = 10, all others = 10
    // Weighted sum = 3*15 + 2*10 + 11*10 = 45 + 20 + 110 = 175
    // 175 / 16 = 10.9375 -> rounded to 10.94
    // (If divided by 29 credits it would be 175 / 29 = 6.03)
    const gradesVar: GradeState = { ...gradesUniform };
    gradesVar['math3'] = { cc: 15, exam: 15 };
    gradesVar['ondes_vibrations'] = { cc: 10, exam: 10 };
    for (const sub of SUBJECTS.slice(2)) {
      if (sub.assessmentType === 'CC_AND_EXAM') gradesVar[sub.id] = { cc: 10, exam: 10 };
      else if (sub.assessmentType === 'CC_ONLY') gradesVar[sub.id] = { cc: 10 };
      else gradesVar[sub.id] = { exam: 10 };
    }
    const resVar = calculateSemester(gradesVar);
    expect(resVar.pointsAccumulated).toBe(175);
    expect(resVar.semesterAverage).toBe(10.94);
    expect(resVar.semesterAverage).not.toBe(6.03);
  });

  // Audit Item 9: Missing grades are never treated as zero
  it('Audit 9: Missing grades are never treated as zero', () => {
    // Enter only 1 subject
    const singleGrade: GradeState = {
      math3: { cc: 15, exam: 15 }, // grade 15, coeff 3
    };
    const res = calculateSemester(singleGrade);
    expect(res.isFullyCompleted).toBe(false);
    expect(res.completedSubjectsCount).toBe(1);
    expect(res.completedCoeffs).toBe(3);
    // semesterAverage must be null (not completed), not (15*3 + 0)/16 = 2.81!
    expect(res.semesterAverage).toBeNull();
    // partialAverage is 15.00
    expect(res.partialAverage).toBe(15.0);
    // Unentered subjects must have null grade and completed = false
    expect(res.subjects['elec_fond1'].grade).toBeNull();
    expect(res.subjects['elec_fond1'].isCompleted).toBe(false);

    // Subject with partial inputs (only CC entered for CC_AND_EXAM)
    const partialSubject: GradeState = {
      math3: { cc: 15, exam: null },
    };
    const resSub = calculateSemester(partialSubject);
    expect(resSub.subjects['math3'].grade).toBeNull();
    expect(resSub.subjects['math3'].isCompleted).toBe(false);
    expect(resSub.completedSubjectsCount).toBe(0);
    expect(resSub.partialAverage).toBeNull();
  });

  // Audit Item 10: LocalStorage data structure and round-trip
  it('Audit 10: LocalStorage serialization and structure integrity', () => {
    const testState: GradeState = {
      math3: { cc: 13.5, exam: 11.5 },
      info3: { cc: 16 },
      etat_art: { exam: 14 },
    };
    const serialized = JSON.stringify(testState);
    const deserialized = JSON.parse(serialized) as GradeState;

    expect(deserialized.math3?.cc).toBe(13.5);
    expect(deserialized.math3?.exam).toBe(11.5);
    expect(deserialized.info3?.cc).toBe(16);
    expect(deserialized.etat_art?.exam).toBe(14);

    const calcResult = calculateSemester(deserialized);
    expect(calcResult.completedSubjectsCount).toBe(3);
    expect(calcResult.completedCoeffs).toBe(5); // 3 (math3) + 1 (info3) + 1 (etat_art) = 5
  });

  // Audit Item 11: Multilingual completeness (French, Arabic RTL, English)
  it('Audit 11: Multilingual translations completeness for fr, ar, en', () => {
    const languages = ['fr', 'ar', 'en'] as const;

    for (const lang of languages) {
      const t = translations[lang];
      expect(t).toBeDefined();
      expect(t.appName).toBe('G2 ATM');
      expect(t.tabs.calculator).toBeTruthy();
      expect(t.tabs.target).toBeTruthy();
      expect(t.tabs.simulator).toBeTruthy();
      expect(t.tabs.results).toBeTruthy();
      expect(t.labels.semesterAverage).toBeTruthy();
      expect(t.labels.admis).toBeTruthy();
      expect(t.labels.ajourne).toBeTruthy();
    }

    // All subjects must have fr, ar, en names
    for (const sub of SUBJECTS) {
      expect(sub.name.fr).toBeTruthy();
      expect(sub.name.ar).toBeTruthy();
      expect(sub.name.en).toBeTruthy();
    }

    // All UEs must have fr, ar, en names
    for (const ue of UES) {
      expect(ue.name.fr).toBeTruthy();
      expect(ue.name.ar).toBeTruthy();
      expect(ue.name.en).toBeTruthy();
    }
  });

  // Target and What-If Calculation Integrity
  it('Target Calculator: Required Exam formula & impossible target handling', () => {
    // Formula: (Target - 0.40 * CC) / 0.60
    // CC = 10, Target = 10 -> (10 - 4)/0.6 = 10
    const req1 = calculateRequiredExam(10, 10);
    expect(req1.requiredExam).toBe(10);
    expect(req1.isPossible).toBe(true);

    // CC = 4, Target = 16 -> (16 - 1.6)/0.6 = 14.4/0.6 = 24.00 > 20 -> impossible!
    const req2 = calculateRequiredExam(4, 16);
    expect(req2.requiredExam).toBe(24.0);
    expect(req2.isPossible).toBe(false);

    // CC = 18, Target = 7 -> (7 - 7.2)/0.6 = -0.33 -> guaranteed with 0
    const req3 = calculateRequiredExam(18, 7);
    expect(req3.isPossible).toBe(true);
    expect(req3.isGuaranteed).toBe(true);
    expect(req3.requiredExam).toBe(0);

    // analyzeSemesterTarget test
    const gradesLow: GradeState = {};
    for (const s of SUBJECTS.slice(0, 9)) {
      if (s.assessmentType === 'CC_AND_EXAM') gradesLow[s.id] = { cc: 0, exam: 0 };
      else if (s.assessmentType === 'CC_ONLY') gradesLow[s.id] = { cc: 0 };
      else gradesLow[s.id] = { exam: 0 };
    }
    const semesterTarget = analyzeSemesterTarget(gradesLow, 10);
    expect(semesterTarget.status).toBe('impossible');
    expect(semesterTarget.uniformGradeNeeded).toBeGreaterThan(20);

    // Helper checks
    expect(isValidGrade(15.5)).toBe(true);
    expect(isValidGrade(-2)).toBe(false);
    expect(roundGrade(10.555)).toBe(10.56);
  });
});
