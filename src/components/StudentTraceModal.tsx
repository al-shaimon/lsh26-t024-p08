import React from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  ArrowRight,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { StudentResult } from '../types/school';

interface StudentTraceModalProps {
  student: StudentResult | null;
  onClose: () => void;
  onPrint: (student: StudentResult) => void;
}

export const StudentTraceModal: React.FC<StudentTraceModalProps> = ({
  student,
  onClose,
  onPrint,
}) => {
  if (!student) return null;

  const isFail = student.finalLetterGrade === 'F';
  const hasCompulsoryFail = student.isCompulsoryFail;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 overflow-y-auto no-print overscroll-contain">
      <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl w-full max-w-5xl xl:max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900 gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-brand-600 text-white rounded-xl shadow-md flex items-center justify-center shrink-0">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                  Calculation &amp; Grade Audit Trace
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Step-by-step arithmetic verification &amp; rule audit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onPrint(student)}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-xl flex items-center gap-1.5 shadow-md transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Official Marksheet</span>
              <span className="sm:hidden">Marksheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body - Optimized for smooth 60fps scrolling */}
        <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 overscroll-contain">
          
          {/* Student Profile & Result Banner */}
          <div className="p-3.5 sm:p-4 rounded-xl border border-slate-800 bg-slate-850 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold text-base sm:text-lg font-mono shrink-0">
                {student.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base sm:text-lg font-bold text-white truncate">{student.name}</h4>
                  <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {student.id}
                  </span>
                  {student.edgeCaseTag && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Special Case
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 mt-1 flex-wrap">
                  <span>Class: <strong className="text-slate-200">{student.class}</strong></span>
                  <span>•</span>
                  <span>4th Optional: <strong className="text-purple-300 font-mono">{student.optionalSubjectCode}</strong></span>
                </div>
              </div>
            </div>

            {/* Result Badge */}
            <div className={`px-3.5 py-2 rounded-xl border flex items-center justify-between sm:justify-end gap-3 shrink-0 ${
              isFail
                ? 'bg-rose-950/60 border-rose-800/80 text-rose-300'
                : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
            }`}>
              <div className="text-left sm:text-right">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Official Standing</span>
                <span className="text-xl sm:text-2xl font-black font-mono tracking-tight">GPA {student.finalGPA.toFixed(2)}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                isFail
                  ? 'bg-rose-600 text-white'
                  : 'bg-emerald-600 text-white'
              }`}>
                Grade: {student.finalLetterGrade}
              </span>
            </div>
          </div>

          {/* Compulsory Subject Failure Cancellation Alert */}
          {hasCompulsoryFail && (
            <div className="p-3.5 sm:p-4 bg-rose-950/40 border border-rose-800/80 rounded-xl flex items-start gap-3">
              <div className="p-2 bg-rose-900/60 text-rose-300 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h5 className="text-sm font-bold text-rose-200">
                    Result Cancellation: Compulsory Subject Failure
                  </h5>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-rose-900 text-rose-200 font-bold border border-rose-700">
                    Raw Average: {student.rawUncancelledGPA.toFixed(2)}
                  </span>
                </div>
                <p className="text-rose-300/90 mt-1 leading-relaxed text-xs">
                  Even though the student achieved a raw uncancelled average of{' '}
                  <strong className="underline text-white">{student.rawUncancelledGPA.toFixed(2)}</strong>,
                  failing in compulsory subject(s) cancels the overall final result to <strong className="text-white">GPA 0.00 (Grade F)</strong>:
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {student.failingCompulsorySubjects.map((f) => (
                    <div
                      key={f.code}
                      className="px-2.5 py-1 bg-slate-900 border border-rose-700 rounded-lg text-xs text-rose-200 font-medium flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span><strong>{f.name} ({f.code}):</strong> {f.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3-Stage Arithmetic Calculation Pipeline */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-brand-400" />
                <span>GPA Calculation Pipeline</span>
              </h4>
              <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">Formula: (Compulsory GP + Optional Bonus) ÷ 6</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
              {/* Card 1: Compulsory Sum */}
              <div className="p-3 sm:p-4 rounded-xl border border-slate-800 bg-slate-850 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 text-xs">1. 6 Compulsory Subjects</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60">
                    6 Sub
                  </span>
                </div>
                <div className="my-1.5">
                  <div className="text-xl sm:text-2xl font-black font-mono text-white">
                    {student.compulsoryGradePointsSum.toFixed(2)} <span className="text-xs text-slate-400 font-normal">GP</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Total GP earned across all 6 compulsory subjects.
                </p>
              </div>

              {/* Card 2: 4th Optional Bonus */}
              <div className="p-3 sm:p-4 rounded-xl border border-slate-800 bg-slate-850 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 text-xs">2. 4th Optional Bonus</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
                    {student.optionalSubjectCode}
                  </span>
                </div>
                <div className="my-1.5">
                  <div className="text-xl sm:text-2xl font-black font-mono text-purple-400">
                    +{student.optionalBonusGradePoints.toFixed(2)} <span className="text-xs text-purple-300/70 font-normal">GP</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Points above 2.0 (Formula: max(0, GP − 2.0)).
                </p>
              </div>

              {/* Card 3: Final Division */}
              <div className="p-3 sm:p-4 rounded-xl border border-slate-800 bg-slate-850 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300 text-xs">3. Divisor &amp; Average</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                    Div: 6
                  </span>
                </div>
                <div className="my-1.5">
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                    {student.rawUncancelledGPA.toFixed(2)} <span className="text-xs text-emerald-300/70 font-normal">Raw GPA</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  ({student.compulsoryGradePointsSum.toFixed(1)} + {student.optionalBonusGradePoints.toFixed(1)}) ÷ 6 = {student.rawUncancelledGPA.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Subject by Subject Evaluation Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Subject-by-Subject Marks &amp; Rule Audit
              </h4>
              <span className="text-[11px] text-slate-500">7 Subjects</span>
            </div>

            {/* Desktop View: Multi-Column Table (hidden on mobile) */}
            <div className="hidden md:block rounded-xl border border-slate-800 overflow-hidden bg-slate-850">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-slate-300 font-bold border-b border-slate-700 text-[11px]">
                    <th className="py-2.5 px-4">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">Category</th>
                    <th className="py-2.5 px-3 text-center">Marks Breakdown</th>
                    <th className="py-2.5 px-3 text-center">Total (100)</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-4">Evaluation Audit Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {student.subjectResults.map((sub) => {
                    const subFail = sub.isSubjectFail;
                    return (
                      <tr
                        key={sub.code}
                        className={subFail ? 'bg-rose-950/20' : 'hover:bg-slate-800/40'}
                      >
                        <td className="py-2.5 px-4 font-semibold text-white">
                          <div className="flex items-center gap-2">
                            <span>{sub.name}</span>
                            <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700">
                              {sub.code}
                            </span>
                          </div>
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              sub.isOptional
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {sub.isOptional ? '4th Optional' : 'Compulsory'}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono text-[11px]">
                          {sub.isAbsent ? (
                            <span className="px-2.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded font-bold">
                              Absent (AB)
                            </span>
                          ) : sub.isPractical ? (
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                              <span className={sub.isTheoryFail ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                                Th: {sub.theoryMark}/75
                              </span>
                              <span className="text-slate-600">+</span>
                              <span className={sub.isPracticalFail ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                                Pr: {sub.practicalMark}/25
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 font-medium">Mark: {sub.totalMark}/100</span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono font-bold text-white">
                          {sub.isAbsent ? 'AB' : sub.totalMark}
                        </td>

                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          <span className={`text-sm ${subFail ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {sub.gradePoint.toFixed(2)}
                          </span>
                        </td>

                        <td className="py-2.5 px-3 text-center font-bold">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                              subFail
                                ? 'bg-rose-950 text-rose-300 border-rose-800'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            }`}
                          >
                            {sub.letterGrade}
                          </span>
                        </td>

                        <td className="py-2.5 px-4 text-slate-300">
                          {sub.isAbsent ? (
                            <span className="text-rose-400 font-medium flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Student Absent from Examination (GP: 0.00)</span>
                            </span>
                          ) : sub.isTheoryFail ? (
                            <span className="text-rose-400 font-medium flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Theory score ({sub.theoryMark}/75) below 25 pass mark → Fail</span>
                            </span>
                          ) : sub.isPracticalFail ? (
                            <span className="text-rose-400 font-medium flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Practical score ({sub.practicalMark}/25) below 8 pass mark → Fail</span>
                            </span>
                          ) : subFail ? (
                            <span className="text-rose-400 font-medium flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 shrink-0" />
                              <span>Subject score ({sub.totalMark}) below 33 pass mark</span>
                            </span>
                          ) : sub.isOptional ? (
                            <span className="text-purple-300 font-medium flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                              <span>Passed • GP {sub.gradePoint.toFixed(1)} adds +{student.optionalBonusGradePoints.toFixed(2)} Bonus GP</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>Passed ({sub.isPractical ? `Total ${sub.totalMark}/100` : `${sub.totalMark}/100`}) → GP {sub.gradePoint.toFixed(1)}</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile View: Clean Subject Cards (hidden on desktop) */}
            <div className="md:hidden space-y-2.5">
              {student.subjectResults.map((sub) => {
                const subFail = sub.isSubjectFail;
                return (
                  <div
                    key={sub.code}
                    className={`p-3 rounded-xl border ${
                      subFail
                        ? 'bg-rose-950/20 border-rose-800/60'
                        : 'bg-slate-850 border-slate-800'
                    } space-y-2`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-sm">{sub.name}</span>
                        <span className="font-mono text-[10px] text-slate-400 px-1 rounded bg-slate-800">
                          {sub.code}
                        </span>
                        <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                          sub.isOptional ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'text-slate-400'
                        }`}>
                          {sub.isOptional ? 'Optional' : 'Compulsory'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          subFail ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {sub.letterGrade}
                        </span>
                        <span className="font-mono font-bold text-xs text-white">
                          GP {sub.gradePoint.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* Marks Row */}
                    <div className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400">
                        {sub.isAbsent
                          ? 'Status: Absent (AB)'
                          : sub.isPractical
                          ? `Theory: ${sub.theoryMark}/75 • Practical: ${sub.practicalMark}/25`
                          : `Score: ${sub.totalMark}/100`}
                      </span>
                      <span className="font-mono font-bold text-white">
                        Total: {sub.isAbsent ? 'AB' : sub.totalMark}
                      </span>
                    </div>

                    {/* Audit Note */}
                    <div className="text-[11px]">
                      {sub.isAbsent ? (
                        <span className="text-rose-400 font-medium">Absent from examination (GP: 0.00)</span>
                      ) : sub.isTheoryFail ? (
                        <span className="text-rose-400 font-medium">Theory score ({sub.theoryMark}/75) below 25 pass mark</span>
                      ) : sub.isPracticalFail ? (
                        <span className="text-rose-400 font-medium">Practical score ({sub.practicalMark}/25) below 8 pass mark</span>
                      ) : subFail ? (
                        <span className="text-rose-400 font-medium">Subject total ({sub.totalMark}) below 33 pass mark</span>
                      ) : sub.isOptional ? (
                        <span className="text-purple-300 font-medium">Passed • Adds +{student.optionalBonusGradePoints.toFixed(2)} Bonus GP</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">Passed • Grade Point {sub.gradePoint.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Modal Bottom Status Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-slate-900 gap-3 shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Raw Average:</span>
              <span className="font-bold font-mono text-white text-sm">
                {student.rawUncancelledGPA.toFixed(2)}
              </span>
            </div>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Standing:</span>
              <span className={`font-bold font-mono text-sm ${isFail ? 'text-rose-400' : 'text-emerald-400'}`}>
                GPA {student.finalGPA.toFixed(2)} [{student.finalLetterGrade}]
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition active:scale-95 cursor-pointer shadow-sm text-center"
          >
            Close Trace
          </button>
        </div>

      </div>
    </div>
  );
};
