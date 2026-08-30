import React from 'react';
import {
  X,
  Printer,
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  FileDown,
  ShieldCheck,
  Building2
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
  const regNo = `26108490${student.id.replace(/\D/g, '').padStart(3, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto marksheet-modal-overlay">
      <div className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 marksheet-print-card">
        {/* Actions Bar (Screen Only - Hidden in Print) */}
        <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-100 text-slate-900 no-print">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-700" />
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                Official Academic Transcript Preview
              </span>
              <span className="text-[11px] text-slate-600">
                Full-Page A4 Printable Format (Ctrl + P / Save as PDF)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Save as PDF / Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Body (Full A4 Layout) */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-white font-sans text-slate-900 marksheet-sheet flex flex-col justify-between">
          {/* Certificate Double Border Container (Fills Full Height in Print) */}
          <div className="border-4 border-double border-slate-800 p-4 sm:p-6 rounded-lg bg-white marksheet-certificate-border flex flex-col justify-between space-y-4">
            
            {/* 1. Header: Board Name & Institution */}
            <div className="flex items-start justify-between border-b-2 border-slate-800 pb-3">
              {/* Left School Monogram */}
              <div className="w-20 hidden sm:flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 border-2 border-slate-800 rounded-full flex flex-col items-center justify-center p-1 bg-slate-50">
                  <GraduationCap className="w-7 h-7 text-slate-900" />
                  <span className="text-[7px] font-black tracking-tighter">ESTD 1974</span>
                </div>
                <span className="text-[8px] font-bold text-slate-600 mt-1 uppercase">CODE: 8490</span>
              </div>

              {/* Center Title & Institution */}
              <div className="flex-1 text-center px-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-600">
                  Board of Intermediate &amp; Secondary Education, Rajshahi
                </p>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-slate-950 font-serif leading-tight mt-0.5">
                  Bogura Secondary Model High School
                </h1>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                  Bogura Sadar, Bogura, Bangladesh • EIIN: 119842 • Center Code: 320
                </p>
                <div className="mt-1.5">
                  <span className="inline-block px-3.5 py-0.5 bg-slate-900 text-white rounded text-[11px] sm:text-[12px] font-black uppercase tracking-widest">
                    Academic Transcript &amp; Grade Report
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 font-semibold uppercase mt-1">
                  Secondary School Certificate (SSC) Standard Examination - 2026
                </p>
              </div>

              {/* Right Grading Scale Table */}
              <div className="w-36 hidden sm:block border border-slate-800 text-[8px] rounded overflow-hidden">
                <div className="bg-slate-900 text-white text-center font-bold py-0.5 uppercase tracking-wider text-[7px]">
                  Grading Scale Key
                </div>
                <table className="w-full text-center border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-200"><td className="px-1 py-0.2">80 - 100</td><td className="font-bold">A+</td><td>5.0</td></tr>
                    <tr className="border-b border-slate-200"><td className="px-1 py-0.2">70 - 79</td><td className="font-bold">A</td><td>4.0</td></tr>
                    <tr className="border-b border-slate-200"><td className="px-1 py-0.2">60 - 69</td><td className="font-bold">A-</td><td>3.5</td></tr>
                    <tr className="border-b border-slate-200"><td className="px-1 py-0.2">50 - 59</td><td className="font-bold">B</td><td>3.0</td></tr>
                    <tr className="border-b border-slate-200"><td className="px-1 py-0.2">40 - 49</td><td className="font-bold">C</td><td>2.0</td></tr>
                    <tr className="border-b border-slate-200"><td className="px-1 py-0.2">33 - 39</td><td className="font-bold">D</td><td>1.0</td></tr>
                    <tr><td className="px-1 py-0.2 text-rose-700 font-semibold">00 - 32</td><td className="font-bold text-rose-700">F</td><td className="text-rose-700">0.0</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Student Particulars Table */}
            <div className="border border-slate-800 rounded bg-slate-50/50 p-2.5 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 gap-x-4 text-[11px]">
                <div>
                  <span className="text-slate-500 font-medium">Student's Name:</span>
                  <p className="font-bold text-slate-950 uppercase">{student.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Student / Roll ID:</span>
                  <p className="font-bold font-mono text-slate-950">{student.id}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Class &amp; Section:</span>
                  <p className="font-bold text-slate-950">{student.class} (Section A)</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Registration No:</span>
                  <p className="font-bold font-mono text-slate-950">{regNo}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Group:</span>
                  <p className="font-bold text-slate-950">Science</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Student Type:</span>
                  <p className="font-bold text-slate-950">Regular</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Academic Session:</span>
                  <p className="font-bold text-slate-950">2025 - 2026</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">4th Optional Subject:</span>
                  <p className="font-bold text-slate-950">{student.optionalSubjectCode}</p>
                </div>
              </div>
            </div>

            {/* 3. Marks & Subject Breakdown Table */}
            <div className="border border-slate-800 rounded overflow-hidden flex-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold border-b border-slate-800 text-[11px]">
                    <th className="py-2 px-2 text-center w-8">SL</th>
                    <th className="py-2 px-3">Subject Name &amp; Code</th>
                    <th className="py-2 px-2 text-center">Type</th>
                    <th className="py-2 px-2 text-center">Theory (75)</th>
                    <th className="py-2 px-2 text-center">Practical (25)</th>
                    <th className="py-2 px-2 text-center">Total (100)</th>
                    <th className="py-2 px-2 text-center">Letter Grade</th>
                    <th className="py-2 px-2 text-center">Grade Point</th>
                    <th className="py-2 px-3 text-left">Remark / Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-[11px]">
                  {student.subjectResults.map((sub, idx) => {
                    const subFail = sub.isSubjectFail;
                    return (
                      <tr key={sub.code} className={subFail ? 'bg-rose-50/70' : 'hover:bg-slate-50'}>
                        <td className="py-2 px-2 text-center font-mono text-slate-600">{idx + 1}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {sub.name} <span className="font-mono text-slate-500 text-[10px]">({sub.code})</span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            sub.isOptional ? 'bg-purple-100 text-purple-800 border border-purple-300' : 'text-slate-600'
                          }`}>
                            {sub.isOptional ? 'Optional' : 'Compulsory'}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-medium">
                          {sub.isAbsent ? 'AB' : sub.isPractical ? sub.theoryMark : '-'}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-medium">
                          {sub.isAbsent ? 'AB' : sub.isPractical ? sub.practicalMark : '-'}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold">
                          {sub.isAbsent ? 'AB' : sub.totalMark}
                        </td>
                        <td className="py-2 px-2 text-center font-bold">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${
                            subFail ? 'bg-rose-200 text-rose-900 border border-rose-400 font-extrabold' : 'text-slate-900'
                          }`}>
                            {sub.letterGrade}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold">
                          {sub.gradePoint.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-[10px] text-slate-600 truncate max-w-[200px]">
                          {sub.ruleApplied}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 4. GPA Calculation Summary & Official Result Standing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-slate-800 p-3 rounded bg-slate-50/50">
              {/* Arithmetic Summary */}
              <div className="space-y-1.5 text-[11px] border-r-0 sm:border-r border-slate-300 pr-0 sm:pr-3">
                <div className="flex justify-between text-slate-700">
                  <span>Sum of 6 Compulsory Subject Grade Points:</span>
                  <span className="font-mono font-bold text-slate-950">
                    {student.compulsoryGradePointsSum.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>4th Subject Additional Bonus (GP &gt; 2.00):</span>
                  <span className="font-mono font-bold text-slate-950">
                    +{student.optionalBonusGradePoints.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Divisor (Constant 6-Subject Rule):</span>
                  <span className="font-mono font-bold text-slate-950">6</span>
                </div>
                <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-300">
                  <span>Uncancelled Raw Average GPA:</span>
                  <span className="font-mono font-bold text-slate-950">
                    {student.rawUncancelledGPA.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Final Result Standing Box */}
              <div className="flex flex-col justify-center items-center text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                  Final Official Result Standing
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-mono text-slate-950">
                    GPA {student.finalGPA.toFixed(2)}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                    isFail ? 'bg-rose-100 text-rose-900 border border-rose-400' : 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                  }`}>
                    Grade: {student.finalLetterGrade} ({isFail ? 'FAILED' : 'PASSED'})
                  </span>
                </div>
                {isFail && (
                  <p className="text-[10px] text-rose-700 font-bold mt-1">
                    * Overall result cancelled due to failure in compulsory subject(s) (Rule R-13)
                  </p>
                )}
              </div>
            </div>

            {/* 5. Verification Signatures Block */}
            <div className="pt-8 pb-2 grid grid-cols-3 gap-6 text-center text-xs">
              <div className="border-t-2 border-slate-800 pt-1.5">
                <p className="font-bold text-slate-950">Assistant Teacher</p>
                <p className="text-[10px] text-slate-500">Tabulator / Checked by</p>
              </div>

              <div className="border-t-2 border-slate-800 pt-1.5 flex flex-col items-center">
                <p className="font-bold text-slate-950">Controller of Examinations</p>
                <p className="text-[10px] text-slate-500">Verified by Committee</p>
              </div>

              <div className="border-t-2 border-slate-800 pt-1.5 flex flex-col items-center relative">
                {/* Official Circular Seal Graphic */}
                <div className="w-12 h-12 border border-slate-400 rounded-full flex items-center justify-center text-[7px] font-black uppercase text-slate-600 -mt-10 mb-1 bg-white shadow-sm">
                  Official Seal
                </div>
                <p className="font-bold text-slate-950">Headmaster</p>
                <p className="text-[10px] text-slate-500">Bogura Model High School</p>
              </div>
            </div>

            {/* 6. Bottom Footer Note */}
            <div className="text-center pt-2 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between">
              <span>Date of Publication: 30 August, 2026</span>
              <span>Bogura Secondary Model High School • Result Verification Engine</span>
              <span>Page 1 of 1 (Official Record)</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
