import {
  MarkValue,
  Subject,
  SubjectResult,
  StudentRaw,
  StudentResult,
  CalculationTraceStep,
  ClassSummary,
} from "../types/school";

/**
 * Converts a numerical subject mark (0-100) to Grade Point and Letter Grade.
 * R-10: 80+ -> 5.0 (A+), 70-79 -> 4.0 (A), 60-69 -> 3.5 (A-), 50-59 -> 3.0 (B),
 *       40-49 -> 2.0 (C), 33-39 -> 1.0 (D), <33 -> 0.0 (F).
 */
export function markToGradePoint(mark: number): {
  gradePoint: number;
  letterGrade: string;
  ruleCode: string;
} {
  if (mark >= 80) return { gradePoint: 5.0, letterGrade: "A+", ruleCode: "R-10: Mark >= 80 (A+)" };
  if (mark >= 70) return { gradePoint: 4.0, letterGrade: "A", ruleCode: "R-10: Mark 70-79 (A)" };
  if (mark >= 60) return { gradePoint: 3.5, letterGrade: "A-", ruleCode: "R-10: Mark 60-69 (A-)" };
  if (mark >= 50) return { gradePoint: 3.0, letterGrade: "B", ruleCode: "R-10: Mark 50-59 (B)" };
  if (mark >= 40) return { gradePoint: 2.0, letterGrade: "C", ruleCode: "R-10: Mark 40-49 (C)" };
  if (mark >= 33) return { gradePoint: 1.0, letterGrade: "D", ruleCode: "R-10: Mark 33-39 (D)" };
  return { gradePoint: 0.0, letterGrade: "F", ruleCode: "R-10: Mark < 33 (Fail)" };
}

/**
 * Converts final GPA to overall Letter Grade.
 * R-10: A+ = 5.00, A = 4.00-4.99, A- = 3.50-3.99, B = 3.00-3.49, C = 2.00-2.99, D = 1.00-1.99, F = Fail
 */
export function gpaToLetterGrade(gpa: number, isCompulsoryFail: boolean): string {
  if (isCompulsoryFail || gpa === 0) return "F";
  if (gpa >= 5.0) return "A+";
  if (gpa >= 4.0) return "A";
  if (gpa >= 3.5) return "A-";
  if (gpa >= 3.0) return "B";
  if (gpa >= 2.0) return "C";
  if (gpa >= 1.0) return "D";
  return "F";
}

/**
 * Calculates result for a single subject for a student.
 * Handles Theory/Practical dual pass rule (R-11) and Absent rule (R-12).
 */
export function calculateSubjectResult(
  code: string,
  subjectInfo: Subject,
  rawMark: MarkValue,
  isOptional: boolean
): SubjectResult {
  const name = subjectInfo?.name || code;
  const isPractical = Boolean(subjectInfo?.practical);

  // Rule R-12: Absent Handling
  if (rawMark === "AB") {
    return {
      code,
      name,
      isPractical,
      isOptional,
      rawMark: "AB",
      totalMark: "AB",
      isAbsent: true,
      isTheoryFail: false,
      isPracticalFail: false,
      isSubjectFail: true,
      gradePoint: 0.0,
      letterGrade: "F",
      ruleApplied: "R-12: Student Absent ('AB')",
      explanation: isOptional
        ? "Absent in optional subject -> GP 0.0, adds 0 bonus points (Flagged on Checklist)"
        : "Absent in compulsory subject -> GP 0.0, causes overall result F",
    };
  }

  // Practical Subject Handling (R-11)
  if (isPractical && typeof rawMark === "object" && rawMark !== null) {
    const theory = Number(rawMark.theory ?? 0);
    const practical = Number(rawMark.practical ?? 0);
    const total = theory + practical;

    const isTheoryFail = theory < 25; // Theory pass mark = 25 / 75
    const isPracticalFail = practical < 8; // Practical pass mark = 8 / 25

    if (isTheoryFail || isPracticalFail) {
      let failReason = "";
      if (isTheoryFail && isPracticalFail) {
        failReason = `R-11: Failed both Theory (${theory}/75 < 25) and Practical (${practical}/25 < 8)`;
      } else if (isTheoryFail) {
        failReason = `R-11: Theory Fail (${theory}/75 < 25, Practical passed: ${practical}/25)`;
      } else {
        failReason = `R-11: Practical Fail (${practical}/25 < 8, Theory passed: ${theory}/75)`;
      }

      return {
        code,
        name,
        isPractical: true,
        isOptional,
        rawMark,
        theoryMark: theory,
        practicalMark: practical,
        totalMark: total,
        isAbsent: false,
        isTheoryFail,
        isPracticalFail,
        isSubjectFail: true,
        gradePoint: 0.0,
        letterGrade: "F",
        ruleApplied: failReason,
        explanation: `Total mark ${total}/100, but failed component pass requirement (Theory >= 25, Practical >= 8). Subject GP = 0.00 (F).`,
      };
    }

    // Both passed -> Apply R-10 scale on total sum
    const scale = markToGradePoint(total);
    return {
      code,
      name,
      isPractical: true,
      isOptional,
      rawMark,
      theoryMark: theory,
      practicalMark: practical,
      totalMark: total,
      isAbsent: false,
      isTheoryFail: false,
      isPracticalFail: false,
      isSubjectFail: false,
      gradePoint: scale.gradePoint,
      letterGrade: scale.letterGrade,
      ruleApplied: `R-11 & ${scale.ruleCode}`,
      explanation: `Theory (${theory}/75 >= 25) & Practical (${practical}/25 >= 8) passed. Total ${total}/100 -> GP ${scale.gradePoint.toFixed(2)} (${scale.letterGrade}).`,
    };
  }

  // Non-Practical Subject Handling (R-10)
  const numericMark = typeof rawMark === "number" ? rawMark : 0;
  const scale = markToGradePoint(numericMark);
  const isFail = scale.gradePoint === 0.0;

  return {
    code,
    name,
    isPractical: false,
    isOptional,
    rawMark: numericMark,
    totalMark: numericMark,
    isAbsent: false,
    isTheoryFail: false,
    isPracticalFail: false,
    isSubjectFail: isFail,
    gradePoint: scale.gradePoint,
    letterGrade: scale.letterGrade,
    ruleApplied: scale.ruleCode,
    explanation: isFail
      ? `Mark ${numericMark}/100 is below pass mark 33 -> GP 0.00 (F).`
      : `Mark ${numericMark}/100 -> GP ${scale.gradePoint.toFixed(2)} (${scale.letterGrade}).`,
  };
}

/**
 * Calculates complete student result, GPA, audit trace, and office flags.
 * Implements R-10, R-11, R-12, R-13, R-29.
 */
export function calculateStudentGPA(
  student: StudentRaw,
  subjectsMap: Map<string, Subject>,
  compulsoryCodes: string[]
): StudentResult {
  const subjectResults: SubjectResult[] = [];
  const failingCompulsorySubjects: { code: string; name: string; reason: string }[] = [];
  let compulsoryGPSum = 0;

  // Process compulsory subjects
  for (const code of compulsoryCodes) {
    const subjectInfo = subjectsMap.get(code) || {
      code,
      name: code,
      practical: false,
    };
    const rawMark = student.marks[code];
    const res = calculateSubjectResult(code, subjectInfo, rawMark, false);
    subjectResults.push(res);

    compulsoryGPSum += res.gradePoint;
    if (res.isSubjectFail) {
      failingCompulsorySubjects.push({
        code: res.code,
        name: res.name,
        reason: res.ruleApplied,
      });
    }
  }

  // Process optional 4th subject
  const optionalCode = student.optional;
  const optionalSubjectInfo = subjectsMap.get(optionalCode) || {
    code: optionalCode,
    name: optionalCode,
    practical: true,
  };
  const optionalRawMark = student.marks[optionalCode];
  const optionalResult = calculateSubjectResult(
    optionalCode,
    optionalSubjectInfo,
    optionalRawMark,
    true
  );
  subjectResults.push(optionalResult);

  const optionalGP = optionalResult.gradePoint;
  // R-13: optional adds only the amount of its grade point above 2.0
  const optionalBonus = Math.max(0.0, optionalGP - 2.0);

  const rawTotalGP = compulsoryGPSum + optionalBonus;
  // R-13: GPA = (sum of compulsory GP + max(0, opt GP - 2)) / 6, capped at 5.00
  const calculatedRawGPA = Number((rawTotalGP / 6.0).toFixed(2));
  const rawUncancelledGPA = Math.min(5.0, calculatedRawGPA);

  // R-13: Any compulsory failure gives GPA 0.00 and letter F
  const isCompulsoryFail = failingCompulsorySubjects.length > 0;
  const finalGPA = isCompulsoryFail ? 0.0 : rawUncancelledGPA;
  const finalLetterGrade = gpaToLetterGrade(finalGPA, isCompulsoryFail);

  // Rule R-29: Pre-publication checking list flags
  // 1. Optional List: optional GP <= 2.0 or absent
  const optionalFlagged = optionalResult.gradePoint <= 2.0 || optionalResult.isAbsent;
  // 2. Practical Fail List: practical part < 8 in ANY subject
  const practicalFailFlagged = subjectResults.some(
    (s) => s.isPractical && typeof s.practicalMark === "number" && s.practicalMark < 8
  );
  // 3. Absent List: any subject has "AB"
  const absentFlagged = subjectResults.some((s) => s.isAbsent);

  // Build calculation trace steps (R-13 & R-29 audit log)
  const trace: CalculationTraceStep[] = [
    {
      step: 1,
      label: "Compulsory Subjects GP Sum",
      formula: compulsoryCodes
        .map((c) => {
          const s = subjectResults.find((r) => r.code === c);
          return `${c}(${s?.gradePoint.toFixed(1) ?? "0.0"})`;
        })
        .join(" + "),
      value: compulsoryGPSum.toFixed(2),
      ruleCode: "R-10 / R-11: Compulsory GP Accumulation",
    },
    {
      step: 2,
      label: "4th Optional Subject Contribution",
      formula: optionalResult.isAbsent
        ? `${optionalCode} is Absent ('AB') -> max(0, 0.0 - 2.0)`
        : `max(0, ${optionalCode} GP (${optionalGP.toFixed(1)}) - 2.0)`,
      value: `+${optionalBonus.toFixed(2)} GP`,
      ruleCode: "R-13: Optional 4th Subject Rule (> 2.0 delta)",
    },
    {
      step: 3,
      label: "Raw Uncancelled GPA",
      formula: `(${compulsoryGPSum.toFixed(2)} + ${optionalBonus.toFixed(2)}) / 6.00 [Divisor = 6]`,
      value: `${rawUncancelledGPA.toFixed(2)} (Raw Grade: ${gpaToLetterGrade(rawUncancelledGPA, false)})`,
      ruleCode: "R-13: Constant 6-Subject Divisor",
    },
  ];

  if (isCompulsoryFail) {
    trace.push({
      step: 4,
      label: "Compulsory Failure Cancellation",
      formula: `OVERRIDE: Failed in ${failingCompulsorySubjects.map((f) => `${f.name} (${f.code})`).join(", ")}`,
      value: "GPA 0.00 / Letter F",
      ruleCode: "R-13: Any Compulsory Fail Cancels Overall Result",
      isCancellation: true,
    });
  } else {
    trace.push({
      step: 4,
      label: "Final Result Evaluation",
      formula: `All 6 compulsory subjects passed. Capped at 5.00.`,
      value: `GPA ${finalGPA.toFixed(2)} [Grade ${finalLetterGrade}]`,
      ruleCode: "R-10 / R-13: Final Result Confirmed",
    });
  }

  return {
    id: student.id,
    name: student.name,
    class: student.class,
    optionalSubjectCode: optionalCode,
    subjectResults,
    compulsoryGradePointsSum: compulsoryGPSum,
    optionalGradePoint: optionalGP,
    optionalBonusGradePoints: optionalBonus,
    rawTotalGradePoints: rawTotalGP,
    rawUncancelledGPA,
    isCompulsoryFail,
    failingCompulsorySubjects,
    finalGPA,
    finalLetterGrade,
    trace,
    flags: {
      optionalFlagged,
      practicalFailFlagged,
      absentFlagged,
    },
    edgeCaseTag: student.edgeCaseTag,
  };
}

/**
 * Generates the 3 official pre-publication checking lists (R-29).
 */
export function evaluateCheckingLists(students: StudentResult[]) {
  const optionalList = students.filter((s) => s.flags.optionalFlagged);
  const practicalFailList = students.filter((s) => s.flags.practicalFailFlagged);
  const absentList = students.filter((s) => s.flags.absentFlagged);

  return {
    optionalList,
    practicalFailList,
    absentList,
  };
}

/**
 * Calculates comprehensive class statistics and analytics.
 */
export function calculateClassSummary(
  students: StudentResult[],
  subjects: Subject[]
): ClassSummary {
  const totalStudents = students.length;
  if (totalStudents === 0) {
    return {
      totalStudents: 0,
      passedStudents: 0,
      failedStudents: 0,
      passRate: 0,
      averageGPA: 0,
      gradeDistribution: { "A+": 0, A: 0, "A-": 0, B: 0, C: 0, D: 0, F: 0 },
      subjectStats: [],
      hardestSubject: { code: "N/A", name: "None", failCount: 0, failRate: 0 },
    };
  }

  const passedStudents = students.filter((s) => s.finalLetterGrade !== "F").length;
  const failedStudents = totalStudents - passedStudents;
  const passRate = Number(((passedStudents / totalStudents) * 100).toFixed(1));

  const totalPassingGPA = students
    .filter((s) => s.finalLetterGrade !== "F")
    .reduce((sum, s) => sum + s.finalGPA, 0);
  const averageGPA = passedStudents > 0 ? Number((totalPassingGPA / passedStudents).toFixed(2)) : 0;

  const gradeDistribution = {
    "A+": students.filter((s) => s.finalLetterGrade === "A+").length,
    A: students.filter((s) => s.finalLetterGrade === "A").length,
    "A-": students.filter((s) => s.finalLetterGrade === "A-").length,
    B: students.filter((s) => s.finalLetterGrade === "B").length,
    C: students.filter((s) => s.finalLetterGrade === "C").length,
    D: students.filter((s) => s.finalLetterGrade === "D").length,
    F: students.filter((s) => s.finalLetterGrade === "F").length,
  };

  const subjectStatsMap = new Map<
    string,
    { code: string; name: string; enrolled: number; fails: number; marksSum: number }
  >();

  for (const s of subjects) {
    subjectStatsMap.set(s.code, {
      code: s.code,
      name: s.name,
      enrolled: 0,
      fails: 0,
      marksSum: 0,
    });
  }

  for (const student of students) {
    for (const sub of student.subjectResults) {
      let stat = subjectStatsMap.get(sub.code);
      if (!stat) {
        stat = { code: sub.code, name: sub.name, enrolled: 0, fails: 0, marksSum: 0 };
        subjectStatsMap.set(sub.code, stat);
      }
      stat.enrolled += 1;
      if (sub.isSubjectFail) {
        stat.fails += 1;
      }
      if (typeof sub.totalMark === "number") {
        stat.marksSum += sub.totalMark;
      }
    }
  }

  const subjectStats = Array.from(subjectStatsMap.values())
    .filter((s) => s.enrolled > 0)
    .map((s) => ({
      code: s.code,
      name: s.name,
      totalEnrolled: s.enrolled,
      failCount: s.fails,
      failRate: Number(((s.fails / s.enrolled) * 100).toFixed(1)),
      averageMarks: Number((s.marksSum / s.enrolled).toFixed(1)),
    }))
    .sort((a, b) => b.failCount - a.failCount);

  const hardestSubject = subjectStats[0] || {
    code: "N/A",
    name: "None",
    failCount: 0,
    failRate: 0,
  };

  return {
    totalStudents,
    passedStudents,
    failedStudents,
    passRate,
    averageGPA,
    gradeDistribution,
    subjectStats,
    hardestSubject,
  };
}
