import { PublicFixtureCase, PublicFixtureFile } from "../types/school";
import {
  DEFAULT_COMPULSORY_CODES,
  DEFAULT_STUDENTS,
  DEFAULT_SUBJECTS,
} from "./defaultDataset";
import publicFixturesRaw from "../../public/P08_school_results_public.json";

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
      label: "Bogura High School (Default 64 Students - All 8 Hard Edge Cases)",
      description: "Includes 64 students across Class 9 & Class 10 with 8 hard edge cases",
      studentCount: c.students.length,
      isDefault: true,
    };
  }
  return {
    id: c.case_id,
    label: `Official Fixture: ${c.case_id} (${c.students.length} Students)`,
    description: `Published benchmark case ${c.case_id} from official problem release`,
    studentCount: c.students.length,
  };
});

export function getCaseById(caseId: string): PublicFixtureCase {
  const found = ALL_FIXTURE_CASES.find((c) => c.case_id === caseId);
  return found || DEFAULT_BOGURA_CASE;
}
