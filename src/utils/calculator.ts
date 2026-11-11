import type {
  SubjectDef,
  GradeState,
  SubjectResult,
  UEResult,
  SemesterResult,
  TargetAnalysis,
  UEId,
} from '../types';
import { SUBJECTS, UES, TOTAL_COEFFICIENTS, TOTAL_CREDITS, TOTAL_SUBJECTS } from '../data/curriculum';

export function isValidGrade(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val) && val >= 0 && val <= 20;
}

export function roundGrade(num: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Calculate grade for an individual subject.
 * Returns null if required inputs are missing or invalid (empty != 0).
 */
export function calculateSubjectGrade(
  subject: SubjectDef,
  cc?: number | null,
  exam?: number | null
): {
  grade: number | null;
  isCompleted: boolean;
  requiredExamFor10: number | null;
} {
  const validCC = isValidGrade(cc);
  const validExam = isValidGrade(exam);

  let requiredExamFor10: number | null = null;
  if (subject.assessmentType === 'CC_AND_EXAM' && validCC) {
    // Formula: Required Exam = (10 - 0.40 * CC) / 0.60
    requiredExamFor10 = roundGrade((10 - 0.4 * (cc as number)) / 0.6);
  }

  if (subject.assessmentType === 'CC_AND_EXAM') {
    if (validCC && validExam) {
      const grade = roundGrade((cc as number) * 0.4 + (exam as number) * 0.6);
      return { grade, isCompleted: true, requiredExamFor10 };
    }
    return { grade: null, isCompleted: false, requiredExamFor10 };
  }

  if (subject.assessmentType === 'CC_ONLY') {
    if (validCC) {
      return { grade: roundGrade(cc as number), isCompleted: true, requiredExamFor10: null };
    }
    return { grade: null, isCompleted: false, requiredExamFor10: null };
  }

  if (subject.assessmentType === 'EXAM_ONLY') {
    if (validExam) {
      return { grade: roundGrade(exam as number), isCompleted: true, requiredExamFor10: 10 };
    }
    return { grade: null, isCompleted: false, requiredExamFor10: 10 };
  }

  return { grade: null, isCompleted: false, requiredExamFor10: null };
}

/**
 * Calculates the required exam mark for a subject with CC to hit a specific subject target grade.
 * Returns { requiredExam, isPossible, isGuaranteed }
 */
export function calculateRequiredExam(
  cc: number,
  targetGrade = 10
): {
  requiredExam: number;
  isPossible: boolean;
  isGuaranteed: boolean;
} {
  if (!isValidGrade(cc)) {
    throw new Error('Invalid CC grade');
  }

  const rawRequired = (targetGrade - 0.4 * cc) / 0.6;
  const rounded = roundGrade(rawRequired);

  if (rounded > 20) {
    return { requiredExam: rounded, isPossible: false, isGuaranteed: false };
  }
  if (rounded <= 0) {
    return { requiredExam: 0, isPossible: true, isGuaranteed: true };
  }
  return { requiredExam: rounded, isPossible: true, isGuaranteed: false };
}

/**
 * Full Semester Calculation Engine
 */
export function calculateSemester(grades: GradeState): SemesterResult {
  const subjectsResults: Record<string, SubjectResult> = {};
  let completedSubjectsCount = 0;
  let completedCoeffs = 0;
  let completedCredits = 0;
  let totalWeightedSum = 0;

  // Calculate each subject
  for (const subject of SUBJECTS) {
    const input = grades[subject.id] || {};
    const { grade, isCompleted, requiredExamFor10 } = calculateSubjectGrade(
      subject,
      input.cc,
      input.exam
    );

    const weightedGrade = grade !== null ? roundGrade(grade * subject.coefficient) : null;
    const isPassing = grade !== null && grade >= 10;

    if (isCompleted && grade !== null) {
      completedSubjectsCount++;
      completedCoeffs += subject.coefficient;
      completedCredits += subject.credits;
      totalWeightedSum += grade * subject.coefficient;
    }

    subjectsResults[subject.id] = {
      subject,
      cc: input.cc ?? null,
      exam: input.exam ?? null,
      grade,
      weightedGrade,
      isCompleted,
      isPassing,
      requiredExamFor10,
    };
  }

  // Calculate each UE
  const uesResults = {} as Record<UEId, UEResult>;
  for (const ue of UES) {
    const ueSubjects = SUBJECTS.filter((s) => s.ueId === ue.id).map(
      (s) => subjectsResults[s.id]
    );

    let ueCompletedCoeffs = 0;
    let ueCompletedCredits = 0;
    let ueWeightedSum = 0;
    let ueAllCompleted = true;

    for (const subRes of ueSubjects) {
      if (subRes.isCompleted && subRes.grade !== null) {
        ueCompletedCoeffs += subRes.subject.coefficient;
        ueCompletedCredits += subRes.subject.credits;
        ueWeightedSum += subRes.grade * subRes.subject.coefficient;
      } else {
        ueAllCompleted = false;
      }
    }

    const ueAverage =
      ueCompletedCoeffs > 0 ? roundGrade(ueWeightedSum / ueCompletedCoeffs) : null;

    uesResults[ue.id] = {
      ue,
      subjects: ueSubjects,
      completedCoeffs: ueCompletedCoeffs,
      totalCoeffs: ue.coefficient,
      completedCredits: ueCompletedCredits,
      totalCredits: ue.credits,
      ueAverage,
      isCompleted: ueAllCompleted,
      isAcquired: ueAverage !== null && ueAverage >= 10,
    };
  }

  const isFullyCompleted = completedSubjectsCount === TOTAL_SUBJECTS;
  // IMPORTANT: The semester average is ALWAYS divided by 16 (the total coefficient sum)
  const semesterAverage = isFullyCompleted
    ? roundGrade(totalWeightedSum / TOTAL_COEFFICIENTS)
    : null;

  const partialAverage =
    completedCoeffs > 0 ? roundGrade(totalWeightedSum / completedCoeffs) : null;

  const pointsAccumulated = roundGrade(totalWeightedSum);
  const totalPossiblePoints = TOTAL_COEFFICIENTS * 20; // 320

  // Credits acquisition under Algerian LMD regulations:
  // 1. If overall semester average >= 10, all 29 credits acquired!
  // 2. If not, each UE with average >= 10 grants all its credits.
  // 3. For UEs with average < 10, individual subjects with grade >= 10 grant their credits.
  let creditsAcquired = 0;
  if (semesterAverage !== null && semesterAverage >= 10) {
    creditsAcquired = TOTAL_CREDITS;
  } else {
    for (const ueRes of Object.values(uesResults)) {
      if (ueRes.isAcquired) {
        creditsAcquired += ueRes.totalCredits;
      } else {
        for (const sub of ueRes.subjects) {
          if (sub.isPassing) {
            creditsAcquired += sub.subject.credits;
          }
        }
      }
    }
  }

  // Academic mention (Honors)
  let mention: SemesterResult['mention'] = null;
  const effectiveAverage = semesterAverage ?? partialAverage;
  if (effectiveAverage !== null) {
    if (effectiveAverage >= 16) {
      mention = { fr: 'Très Bien', ar: 'جيد جداً', en: 'Very Good / Honors' };
    } else if (effectiveAverage >= 14) {
      mention = { fr: 'Bien', ar: 'جيد', en: 'Good' };
    } else if (effectiveAverage >= 12) {
      mention = { fr: 'Assez Bien', ar: 'قريب من الجيد', en: 'Satisfactory' };
    } else if (effectiveAverage >= 10) {
      mention = { fr: 'Passable', ar: 'مقبول', en: 'Pass' };
    } else {
      mention = { fr: 'Ajourné', ar: 'مؤجل / استدراك', en: 'Remedial / Fail' };
    }
  }

  const isPassing = (semesterAverage ?? partialAverage ?? 0) >= 10;

  return {
    completedSubjectsCount,
    totalSubjectsCount: TOTAL_SUBJECTS,
    completedCoeffs,
    totalCoeffs: TOTAL_COEFFICIENTS,
    completedCredits,
    totalCredits: TOTAL_CREDITS,
    isFullyCompleted,
    semesterAverage,
    partialAverage,
    pointsAccumulated,
    totalPossiblePoints,
    creditsAcquired,
    isPassing,
    mention,
    subjects: subjectsResults,
    ues: uesResults,
  };
}

/**
 * Analyze remaining requirements to reach a target semester average.
 */
export function analyzeSemesterTarget(
  grades: GradeState,
  targetAverage = 10
): TargetAnalysis {
  const result = calculateSemester(grades);
  const targetPoints = roundGrade(targetAverage * TOTAL_COEFFICIENTS);
  const pointsNeeded = roundGrade(Math.max(0, targetPoints - result.pointsAccumulated));
  const remainingCoeffs = TOTAL_COEFFICIENTS - result.completedCoeffs;

  if (remainingCoeffs === 0) {
    return {
      targetAverage,
      targetPoints,
      currentPoints: result.pointsAccumulated,
      pointsNeeded: 0,
      remainingCoeffs: 0,
      uniformGradeNeeded: null,
      status: (result.semesterAverage ?? 0) >= targetAverage ? 'achieved' : 'impossible',
    };
  }

  const uniformGradeNeeded = roundGrade(pointsNeeded / remainingCoeffs);

  let status: TargetAnalysis['status'] = 'possible';
  if (pointsNeeded <= 0) {
    status = 'achieved';
  } else if (uniformGradeNeeded > 20) {
    status = 'impossible';
  }

  return {
    targetAverage,
    targetPoints,
    currentPoints: result.pointsAccumulated,
    pointsNeeded,
    remainingCoeffs,
    uniformGradeNeeded,
    status,
  };
}
