import { PublicFixtureCase, PublicFixtureFile } from "../types/school";
import {
  DEFAULT_COMPULSORY_CODES,
  DEFAULT_STUDENTS,
  DEFAULT_SUBJECTS,
} from "./defaultDataset";
import publicFixturesRaw from "./P08_school_results_public.json";

export interface CaseOption {
  id: string;
  label: string;
  description: string;
  studentCount: number;
  isDefault?: boolean;
}

export const DEFAULT_BOGURA_CASE: PublicFixtureCase = {
  case_id: "BOGURA-DEFAULT",
  subjects: DEFAULT_SUBJECTS,
  compulsory: DEFAULT_COMPULSORY_CODES,
  students: DEFAULT_STUDENTS,
};

const typedFixtures = publicFixturesRaw as unknown as PublicFixtureFile;

export const ALL_FIXTURE_CASES: PublicFixtureCase[] = [
  DEFAULT_BOGURA_CASE,
  ...(typedFixtures.cases || []),
];

export const CASE_OPTIONS: CaseOption[] = ALL_FIXTURE_CASES.map((c) => {
  if (c.case_id === "BOGURA-DEFAULT") {
    return {
      id: c.case_id,
      label: "Bogura Model High School (Current Cohort - 64 Students)",
      description: "Includes 64 students across Class 9 & Class 10 with audited edge cases",
      studentCount: c.students.length,
      isDefault: true,
    };
  }
  return {
    id: c.case_id,
    label: `Examination Batch: ${c.case_id} (${c.students.length} Students)`,
    description: `Published benchmark cohort ${c.case_id}`,
    studentCount: c.students.length,
  };
});

export function getCaseById(caseId: string): PublicFixtureCase {
  const found = ALL_FIXTURE_CASES.find((c) => c.case_id === caseId);
  return found || DEFAULT_BOGURA_CASE;
}
