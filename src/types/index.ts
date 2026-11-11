export type AssessmentType = 'CC_AND_EXAM' | 'CC_ONLY' | 'EXAM_ONLY';

export type Language = 'fr' | 'ar' | 'en';

export type UEId = 'uef1' | 'uef2' | 'uem' | 'ued';

export interface LocalizedString {
  fr: string;
  ar: string;
  en: string;
}

export interface SubjectDef {
  id: string;
  name: LocalizedString;
  shortName: LocalizedString;
  ueId: UEId;
  coefficient: number;
  credits: number;
  assessmentType: AssessmentType;
}

export interface UEDef {
  id: UEId;
  name: LocalizedString;
  code: string;
  coefficient: number;
  credits: number;
}

export interface GradeInput {
  cc?: number | null;
  exam?: number | null;
}

export type GradeState = Record<string, GradeInput>;

export interface SubjectResult {
  subject: SubjectDef;
  cc: number | null;
  exam: number | null;
  grade: number | null; // Grade out of 20
  weightedGrade: number | null; // grade * coefficient
  isCompleted: boolean;
  isPassing: boolean; // grade >= 10
  requiredExamFor10: number | null; // Exam needed to get 10 in this subject (if CC known)
}

export interface UEResult {
  ue: UEDef;
  subjects: SubjectResult[];
  completedCoeffs: number;
  totalCoeffs: number;
  completedCredits: number;
  totalCredits: number;
  ueAverage: number | null;
  isCompleted: boolean;
  isAcquired: boolean; // UE average >= 10
}

export interface SemesterResult {
  completedSubjectsCount: number;
  totalSubjectsCount: number; // 10
  completedCoeffs: number;
  totalCoeffs: number; // 16
  completedCredits: number;
  totalCredits: number; // 29
  isFullyCompleted: boolean;
  semesterAverage: number | null; // Final average when complete (Sum(grade * coeff) / 16)
  partialAverage: number | null; // Sum(grade * coeff) / completedCoeffs (when incomplete)
  pointsAccumulated: number; // Sum(grade * coeff)
  totalPossiblePoints: number; // 16 * 20 = 320
  creditsAcquired: number; // Calculated with Algerian LMD compensation rules
  isPassing: boolean; // semesterAverage >= 10 (or partialAverage >= 10)
  mention: LocalizedString | null;
  subjects: Record<string, SubjectResult>;
  ues: Record<UEId, UEResult>;
}

export interface TargetAnalysis {
  targetAverage: number;
  targetPoints: number;
  currentPoints: number;
  pointsNeeded: number;
  remainingCoeffs: number;
  uniformGradeNeeded: number | null;
  status: 'achieved' | 'possible' | 'impossible';
}
