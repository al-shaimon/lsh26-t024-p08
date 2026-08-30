// Types for School Result Processing & GPA Engine (Problem P08)

export type MarkValue =
  | number
  | { theory: number; practical: number }
  | "AB";

export interface Subject {
  code: string;
  name: string;
  practical: boolean;
}

export interface StudentRaw {
  id: string;
  name: string;
  class: string;
  optional: string;
  marks: Record<string, MarkValue>;
  edgeCaseTag?: string; // Optional tag for showcasing specific edge case
}

export interface SubjectResult {
  code: string;
  name: string;
  isPractical: boolean;
  isOptional: boolean;
  rawMark: MarkValue;
  theoryMark?: number;
  practicalMark?: number;
  totalMark: number | "AB";
  isAbsent: boolean;
  isTheoryFail: boolean;
  isPracticalFail: boolean;
  isSubjectFail: boolean;
  gradePoint: number;
  letterGrade: string;
  ruleApplied: string;
  explanation: string;
}

export interface CalculationTraceStep {
  step: number;
  label: string;
  formula: string;
  value: string;
  ruleCode: string;
  isCancellation?: boolean;
}

export interface StudentResult {
  id: string;
  name: string;
  class: string;
  optionalSubjectCode: string;
  subjectResults: SubjectResult[];
  compulsoryGradePointsSum: number;
  optionalGradePoint: number;
  optionalBonusGradePoints: number;
  rawTotalGradePoints: number;
  rawUncancelledGPA: number;
  isCompulsoryFail: boolean;
  failingCompulsorySubjects: { code: string; name: string; reason: string }[];
  finalGPA: number;
  finalLetterGrade: string;
  trace: CalculationTraceStep[];
  flags: {
    optionalFlagged: boolean; // Optional GP <= 2.0 or Absent (R-29)
    practicalFailFlagged: boolean; // Any practical mark < 8 (R-29)
    absentFlagged: boolean; // Any mark == "AB" (R-29)
  };
  edgeCaseTag?: string;
}

export interface PublicFixtureCase {
  case_id: string;
  subjects: Subject[];
  compulsory: string[];
  students: StudentRaw[];
}

export interface PublicFixtureFile {
  schema_version: string;
  problem_id: string;
  format_note: string;
  cases: PublicFixtureCase[];
}

export interface ClassSummary {
  totalStudents: number;
  passedStudents: number;
  failedStudents: number;
  passRate: number;
  averageGPA: number;
  gradeDistribution: {
    "A+": number;
    A: number;
    "A-": number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  subjectStats: {
    code: string;
    name: string;
    totalEnrolled: number;
    failCount: number;
    failRate: number;
    averageMarks: number;
  }[];
  hardestSubject: {
    code: string;
    name: string;
    failCount: number;
    failRate: number;
  };
}
