import React from 'react';
import {
  X,
  Printer,
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  FileDown
} from 'lucide-react';
import { StudentResult } from '../types/school';

interface StudentMarksheetProps {
  student: StudentResult | null;
  onClose: () => void;
}

export const StudentMarksheet: React.FC<StudentMarksheetProps> = ({
  student,
  onClose,
}) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const isFail = student.finalLetterGrade === 'F';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto marksheet-modal-overlay">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 marksheet-print-card">
        {/* Actions Bar (Hidden in Print) */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Official Academic Transcript Preview
              </span>
              <span className="text-[11px] text-slate-500">
                Optimized for Single-Page A4 Printing &amp; PDF Export
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Save as PDF / Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Sheet (Fits Perfectly on Single A4 Page) */}
        <div className="p-6 sm:p-8 overflow-y-auto bg-white font-sans text-slate-900 space-y-4 marksheet-sheet">
          {/* Institution Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3 space-y-0.5">
            <div className="inline-flex items-center justify-center p-2 bg-slate-900 text-white rounded-lg mb-1 no-print">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900">
              Bogura Secondary Model High School
            </h1>
            <p className="text-[11px] text-slate-600 font-medium">
              Bogura Sadar, Bogura, Bangladesh • Established 1974 • School Code: BOG-8490
            </p>
            <div className="pt-1">
              <span className="inline-block px-3 py-0.5 bg-slate-100 border border-slate-400 rounded-full text-[11px] font-extrabold uppercase tracking-widest text-slate-900">
                Official Academic Transcript &amp; Grade Report
              </span>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Student Name</span>
              <p className="font-bold text-slate-900 text-sm truncate">{student.name}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Roll / ID</span>
              <p className="font-bold font-mono text-slate-900 text-sm">{student.id}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">Class / Grade</span>
              <p className="font-bold text-slate-900 text-sm">{student.class}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold block">4th Optional</span>
              <p className="font-bold text-slate-900 text-sm">{student.optionalSubjectCode}</p>
            </div>
          </div>

          {/* Marks & Subject Breakdown Table */}
          <div className="border border-slate-900 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold border-b border-slate-900 text-[11px]">
                  <th className="py-2 px-3">Subject Name &amp; Code</th>
                  <th className="py-2 px-2 text-center">Type</th>
                  <th className="py-2 px-2 text-center">Theory (75)</th>
                  <th className="py-2 px-2 text-center">Practical (25)</th>
                  <th className="py-2 px-2 text-center">Total (100)</th>
                  <th className="py-2 px-2 text-center">GP</th>
                  <th className="py-2 px-2 text-center">Grade</th>
                  <th className="py-2 px-3">Status / Applied Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-[11px]">
                {student.subjectResults.map((sub) => {
                  const subFail = sub.isSubjectFail;
                  return (
                    <tr key={sub.code} className="hover:bg-slate-50">
                      <td className="py-1.5 px-3 font-semibold">
                        {sub.name} <span className="font-mono text-slate-500">({sub.code})</span>
                      </td>
                      <td className="py-1.5 px-2 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-600">
                          {sub.isOptional ? 'Optional' : 'Compulsory'}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-center font-mono">
                        {sub.isAbsent
                          ? 'AB'
                          : sub.isPractical
                          ? sub.theoryMark
                          : '-'}
                      </td>
                      <td className="py-1.5 px-2 text-center font-mono">
                        {sub.isAbsent
                          ? 'AB'
                          : sub.isPractical
                          ? sub.practicalMark
                          : '-'}
                      </td>
                      <td className="py-1.5 px-2 text-center font-mono font-bold">
                        {sub.isAbsent ? 'AB' : sub.totalMark}
                      </td>
                      <td className="py-1.5 px-2 text-center font-mono font-bold">
                        {sub.gradePoint.toFixed(2)}
                      </td>
                      <td className="py-1.5 px-2 text-center font-bold">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] ${
                            subFail ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          {sub.letterGrade}
                        </span>
                      </td>
                      <td className="py-1.5 px-3 text-[10px] text-slate-700 truncate max-w-[200px]">
                        {sub.ruleApplied}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Final GPA & Summary Calculation Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-slate-900 p-3 rounded-lg bg-slate-50">
            {/* Calculation Arithmetic */}
            <div className="space-y-1 text-[11px]">
              <h4 className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-0.5 text-xs">
                GPA Calculation Formula (Rules R-10, R-13)
              </h4>
              <div className="flex justify-between text-slate-600">
                <span>Sum of 6 Compulsory Grade Points:</span>
                <span className="font-mono font-bold text-slate-900">
                  {student.compulsoryGradePointsSum.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>4th Subject Bonus (Points above 2.0):</span>
                <span className="font-mono font-bold text-slate-900">
                  +{student.optionalBonusGradePoints.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Divisor:</span>
                <span className="font-mono font-bold text-slate-900">6 (Fixed)</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-0.5 border-t border-slate-300">
                <span>Uncancelled Average GPA:</span>
                <span className="font-mono font-bold text-slate-900">
                  {student.rawUncancelledGPA.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Final Standing Banner */}
            <div
              className={`p-3 rounded-lg border flex flex-col justify-center items-center text-center ${
                isFail
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Final Result Standing
              </span>
              <div className="text-2xl font-black font-mono mt-0.5">
                GPA {student.finalGPA.toFixed(2)}
              </div>
              <div className="text-xs font-extrabold mt-0.5">
                Grade: {student.finalLetterGrade} • {isFail ? 'FAILED' : 'PASSED'}
              </div>
              {isFail && (
                <span className="text-[10px] text-rose-700 font-medium mt-0.5">
                  (Cancelled due to compulsory subject failure)
                </span>
              )}
            </div>
          </div>

          {/* Verification & Signatures Block */}
          <div className="pt-6 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="border-t border-slate-900 pt-1.5">
              <p className="font-bold text-slate-900">Class Teacher</p>
              <p className="text-[10px] text-slate-500">Signature &amp; Date</p>
            </div>
            <div className="border-t border-slate-900 pt-1.5">
              <p className="font-bold text-slate-900">Exam Controller</p>
              <p className="text-[10px] text-slate-500">Verified by Committee</p>
            </div>
            <div className="border-t border-slate-900 pt-1.5">
              <p className="font-bold text-slate-900">Headmaster</p>
              <p className="text-[10px] text-slate-500">Official Seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
