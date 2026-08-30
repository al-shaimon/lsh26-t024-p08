import React from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Calculator,
  ArrowRight,
  BookOpen,
  Sparkles,
  Printer
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Calculation & Rule Audit Trace
                </h3>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  {student.id}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  • {student.class}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Student: <span className="font-semibold text-slate-700 dark:text-slate-200">{student.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrint(student)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Marksheet</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Edge Case Callout (if applicable) */}
          {student.edgeCaseTag && (
            <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-purple-800 dark:text-purple-300">
                  Documented Hard Edge Case
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-400 mt-0.5">
                  {student.edgeCaseTag}
                </p>
              </div>
            </div>
          )}

          {/* Cancellation Alert Banner (Bullet 3 Core Requirement) */}
          {hasCompulsoryFail && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-3.5">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 rounded-lg shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">
                    Compulsory Subject Failure Triggered (Rule R-13)
                  </h4>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200 rounded">
                    Overall GPA: 0.00 (F)
                  </span>
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 leading-relaxed">
                  Even though the student achieved an uncancelled average GPA of{' '}
                  <span className="font-bold underline">{student.rawUncancelledGPA.toFixed(2)}</span>,
                  the overall result is cancelled to <span className="font-bold">0.00 (Grade F)</span> due to failure in the following compulsory subject(s):
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {student.failingCompulsorySubjects.map((f) => (
                    <div
                      key={f.code}
                      className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 rounded-md text-xs text-rose-800 dark:text-rose-300 font-medium"
                    >
                      <span className="font-bold">{f.name} ({f.code}):</span> {f.reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Arithmetic Formula Steps Trace (R-13) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Step-by-Step Calculation Engine Trace (R-13)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {student.trace.map((t) => (
                <div
                  key={t.step}
                  className={`p-3 rounded-xl border transition ${
                    t.isCancellation
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    <span>Step {t.step}: {t.label}</span>
                  </div>
                  <div className="text-xs font-mono text-slate-600 dark:text-slate-300 mb-1.5 break-words">
                    {t.formula}
                  </div>
                  <div
                    className={`text-sm font-bold font-mono ${
                      t.isCancellation
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {t.value}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {t.ruleCode}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject by Subject Detailed Trace Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Subject-Level Rule Evaluation (R-10, R-11, R-12)
            </h4>

            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-center">Marks Breakdown</th>
                    <th className="py-2.5 px-3 text-center">Total</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3">Rule Applied & Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {student.subjectResults.map((sub) => {
                    const subFail = sub.isSubjectFail;
                    return (
                      <tr
                        key={sub.code}
                        className={
                          subFail
                            ? 'bg-rose-50/40 dark:bg-rose-950/20'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                        }
                      >
                        {/* Subject Name & Code */}
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            <span>{sub.name}</span>
                            <span className="font-mono text-[10px] text-slate-500">({sub.code})</span>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              sub.isOptional
                                ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {sub.isOptional ? '4th Optional' : 'Compulsory'}
                          </span>
                        </td>

                        {/* Marks Breakdown */}
                        <td className="py-2.5 px-3 text-center font-mono text-[11px]">
                          {sub.isAbsent ? (
                            <span className="px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded font-bold">
                              Absent ('AB')
                            </span>
                          ) : sub.isPractical ? (
                            <div className="inline-flex items-center gap-1">
                              <span className={sub.isTheoryFail ? 'text-rose-600 font-bold' : ''}>
                                Th: {sub.theoryMark}/75
                              </span>
                              <span>+</span>
                              <span className={sub.isPracticalFail ? 'text-rose-600 font-bold' : ''}>
                                Pr: {sub.practicalMark}/25
                              </span>
                            </div>
                          ) : (
                            <span>{sub.totalMark}/100</span>
                          )}
                        </td>

                        {/* Total */}
                        <td className="py-2.5 px-3 text-center font-mono font-semibold">
                          {sub.isAbsent ? 'AB' : `${sub.totalMark}`}
                        </td>

                        {/* Grade Point */}
                        <td className="py-2.5 px-3 text-center font-mono font-bold">
                          <span
                            className={
                              subFail
                                ? 'text-rose-600 dark:text-rose-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }
                          >
                            {sub.gradePoint.toFixed(1)}
                          </span>
                        </td>

                        {/* Grade */}
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                              subFail
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            }`}
                          >
                            {sub.letterGrade}
                          </span>
                        </td>

                        {/* Rule Applied */}
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {sub.ruleApplied}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {sub.explanation}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500">Uncancelled GPA:</span>{' '}
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                {student.rawUncancelledGPA.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Final Result:</span>{' '}
              <span
                className={`font-bold font-mono ${
                  isFail ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                GPA {student.finalGPA.toFixed(2)} [{student.finalLetterGrade}]
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 hover:opacity-90 transition"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
