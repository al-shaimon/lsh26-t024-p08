import React from 'react';
import {
  X,
  Printer,
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  QrCode
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 print-container">
        {/* Actions Bar (Screen Only) */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Official Academic Marksheet View (Print Ready)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Marksheet (Ctrl + P)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Sheet */}
        <div className="p-8 sm:p-10 overflow-y-auto bg-white font-sans text-slate-900 space-y-6">
          {/* Institution Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
            <div className="inline-flex items-center justify-center p-2.5 bg-slate-900 text-white rounded-xl mb-2">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-900">
              Bogura Secondary Model High School
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Bogura Sadar, Bogura, Bangladesh • Established 1974 • School Code: BOG-8490
            </p>
            <div className="pt-2">
              <span className="inline-block px-4 py-1 bg-slate-100 border border-slate-400 rounded-full text-xs font-extrabold uppercase tracking-widest text-slate-900">
                Official Academic Transcript &amp; Grade Report
              </span>
            </div>
          </div>

          {/* Student Info Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 font-medium">Student Name:</span>
              <p className="font-bold text-slate-900 text-sm">{student.name}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Roll / Student ID:</span>
              <p className="font-bold font-mono text-slate-900 text-sm">{student.id}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Class / Grade:</span>
              <p className="font-bold text-slate-900 text-sm">{student.class}</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">4th Optional Subject:</span>
              <p className="font-bold text-slate-900 text-sm">{student.optionalSubjectCode}</p>
            </div>
          </div>

          {/* Marks & Subject Breakdown Table */}
          <div className="border border-slate-900 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white font-bold border-b border-slate-900">
                  <th className="py-2.5 px-3">Subject Name &amp; Code</th>
                  <th className="py-2.5 px-2 text-center">Type</th>
                  <th className="py-2.5 px-2 text-center">Theory (75)</th>
                  <th className="py-2.5 px-2 text-center">Practical (25)</th>
                  <th className="py-2.5 px-2 text-center">Total (100)</th>
                  <th className="py-2.5 px-2 text-center">Grade Point</th>
                  <th className="py-2.5 px-2 text-center">Letter Grade</th>
                  <th className="py-2.5 px-3">Status / Rule Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {student.subjectResults.map((sub) => {
                  const subFail = sub.isSubjectFail;
                  return (
                    <tr key={sub.code} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold">
                        {sub.name} <span className="font-mono text-slate-500">({sub.code})</span>
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <span className="text-[10px] uppercase font-bold text-slate-600">
                          {sub.isOptional ? 'Optional' : 'Compulsory'}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">
                        {sub.isAbsent
                          ? 'AB'
                          : sub.isPractical
                          ? sub.theoryMark
                          : '-'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono">
                        {sub.isAbsent
                          ? 'AB'
                          : sub.isPractical
                          ? sub.practicalMark
                          : '-'}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">
                        {sub.isAbsent ? 'AB' : sub.totalMark}
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold">
                        {sub.gradePoint.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[11px] ${
                            subFail ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          {sub.letterGrade}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-700">
                        {sub.ruleApplied}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Final GPA & Summary Calculation Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-900 p-4 rounded-xl bg-slate-50">
            {/* Calculation Arithmetic */}
            <div className="space-y-1.5 text-xs">
              <h4 className="font-bold uppercase text-slate-900 border-b border-slate-300 pb-1">
                GPA Calculation Summary
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
              <div className="flex justify-between text-slate-600 pt-1 border-t border-slate-300">
                <span>Uncancelled Average GPA:</span>
                <span className="font-mono font-bold text-slate-900">
                  {student.rawUncancelledGPA.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Final Standing Banner */}
            <div
              className={`p-4 rounded-xl border flex flex-col justify-center items-center text-center ${
                isFail
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}
            >
              <span className="text-xs font-bold uppercase tracking-wider">
                Final Result Status
              </span>
              <div className="text-3xl font-black font-mono mt-1">
                GPA {student.finalGPA.toFixed(2)}
              </div>
              <div className="text-sm font-extrabold mt-0.5">
                Grade: {student.finalLetterGrade} • {isFail ? 'FAILED' : 'PASSED'}
              </div>
              {isFail && (
                <span className="text-[10px] text-rose-700 mt-1 font-medium">
                  (Cancelled due to compulsory subject failure)
                </span>
              )}
            </div>
          </div>

          {/* Verification & Signatures Block */}
          <div className="pt-8 grid grid-cols-3 gap-8 text-center text-xs">
            <div className="border-t border-slate-900 pt-2">
              <p className="font-bold text-slate-900">Class Teacher</p>
              <p className="text-[10px] text-slate-500">Signature &amp; Date</p>
            </div>
            <div className="border-t border-slate-900 pt-2">
              <p className="font-bold text-slate-900">Exam Controller</p>
              <p className="text-[10px] text-slate-500">Verified by Committee</p>
            </div>
            <div className="border-t border-slate-900 pt-2">
              <p className="font-bold text-slate-900">Headmaster</p>
              <p className="text-[10px] text-slate-500">Official Seal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
