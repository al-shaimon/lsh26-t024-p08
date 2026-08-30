import React from 'react';
import {
  X,
  Printer,
  GraduationCap
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
  const serialNo = `TR-2026-${student.id.replace(/\D/g, '').padStart(4, '0')}`;
  const regNo = `26108490${student.id.replace(/\D/g, '').padStart(3, '0')}`;

  // Find optional and compulsory subjects
  const optionalSubject = student.subjectResults.find((s) => s.isOptional);
  const compulsorySubjects = student.subjectResults.filter((s) => !s.isOptional);

  // Raw GPA without optional subject
  const gpaWithoutOptional = Number((student.compulsoryGradePointsSum / 6.0).toFixed(2));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 overflow-y-auto marksheet-modal-overlay overscroll-contain">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden marksheet-print-card">
        
        {/* Actions Bar (Screen Only - Hidden in Print) */}
        <div className="px-3.5 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 flex items-center justify-between bg-slate-100 text-slate-900 gap-2 shrink-0 no-print">
          <div className="flex items-center gap-2 min-w-0">
            <GraduationCap className="w-5 h-5 text-slate-800 shrink-0" />
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider block truncate">
                Academic Transcript Preview
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-600 block truncate">
                Official Single-Page A4 Format
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Save as PDF / Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Body */}
        <div className="p-2 sm:p-5 overflow-y-auto overflow-x-auto bg-white font-serif text-slate-950 marksheet-sheet w-full overscroll-contain">
          {/* Certificate Double Border */}
          <div className="min-w-[580px] sm:min-w-0 border-[3px] border-double border-slate-900 p-3 sm:p-5 rounded bg-white marksheet-certificate-border space-y-3 sm:space-y-3.5">
            
            {/* Top Serial & School Header */}
            <div>
              <div className="flex items-center justify-between text-[10px] text-slate-700 font-sans border-b border-slate-300 pb-1 mb-2">
                <span>Transcript No: <strong className="font-mono text-slate-900">{serialNo}</strong></span>
                <span className="font-bold uppercase tracking-wider">OFFICIAL ACADEMIC RECORD</span>
                <span>School Code: <strong>8490</strong></span>
              </div>

              <div className="flex items-start justify-between gap-2 sm:gap-3">
                {/* Left School Monogram */}
                <div className="w-14 hidden sm:flex flex-col items-center justify-center text-center shrink-0">
                  <div className="w-11 h-11 border border-slate-900 rounded-full flex flex-col items-center justify-center p-1 bg-slate-50">
                    <GraduationCap className="w-5 h-5 text-slate-900" />
                    <span className="text-[6px] font-sans font-bold tracking-tighter">ESTD 1974</span>
                  </div>
                </div>

                {/* Center School Name & Subtitle */}
                <div className="flex-1 text-center px-1">
                  <h1 className="text-lg sm:text-2xl font-bold uppercase tracking-wide text-slate-950 font-serif leading-tight">
                    Bogura Secondary Model High School
                  </h1>
                  <p className="text-[10px] text-slate-700 font-sans mt-0.5">
                    Bogura Sadar, Bogura, Bangladesh • Established 1974 • EIIN: 119842
                  </p>
                  <div className="mt-1">
                    <span className="inline-block px-3 py-0.5 bg-slate-900 text-white rounded text-[10px] sm:text-[11px] font-bold uppercase tracking-widest font-sans">
                      Academic Transcript &amp; Grade Report
                    </span>
                  </div>
                  <p className="text-[9px] text-slate-600 font-semibold uppercase mt-0.5 font-sans">
                    Annual Examination &amp; Secondary Assessment - 2026
                  </p>
                </div>

                {/* Right Grading Scale Key Table */}
                <div className="w-32 sm:w-36 border border-slate-900 text-[8px] font-sans rounded overflow-hidden shrink-0">
                  <div className="bg-slate-900 text-white text-center font-bold py-0.5 uppercase tracking-wider text-[7px]">
                    Grading Scale
                  </div>
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 font-bold text-[7px]">
                        <th className="py-0.2">Grade</th>
                        <th className="py-0.2">Marks</th>
                        <th className="py-0.2">Point</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 font-medium"><td>A+</td><td>80 - 100</td><td>5.0</td></tr>
                      <tr className="border-b border-slate-200 font-medium"><td>A</td><td>70 - 79</td><td>4.0</td></tr>
                      <tr className="border-b border-slate-200 font-medium"><td>A-</td><td>60 - 69</td><td>3.5</td></tr>
                      <tr className="border-b border-slate-200 font-medium"><td>B</td><td>50 - 59</td><td>3.0</td></tr>
                      <tr className="border-b border-slate-200 font-medium"><td>C</td><td>40 - 49</td><td>2.0</td></tr>
                      <tr className="border-b border-slate-200 font-medium"><td>D</td><td>33 - 39</td><td>1.0</td></tr>
                      <tr className="font-bold text-rose-800"><td>F</td><td>00 - 32</td><td>0.0</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Student Particulars Table */}
            <div className="border border-slate-900 rounded font-sans text-xs bg-slate-50/50 p-2 sm:p-2.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-1.5 gap-x-3 sm:gap-x-4 text-[10px] sm:text-[11px]">
                <div className="col-span-2">
                  <span className="text-slate-600">Student Name:</span>
                  <p className="font-bold text-slate-950 uppercase font-serif text-xs sm:text-sm">{student.name}</p>
                </div>
                <div>
                  <span className="text-slate-600">Student / Roll ID:</span>
                  <p className="font-bold font-mono text-slate-950">{student.id}</p>
                </div>
                <div>
                  <span className="text-slate-600">Registration No:</span>
                  <p className="font-bold font-mono text-slate-950">{regNo}</p>
                </div>

                <div>
                  <span className="text-slate-600">Class &amp; Section:</span>
                  <p className="font-bold text-slate-950">{student.class} (Section A)</p>
                </div>
                <div>
                  <span className="text-slate-600">Group:</span>
                  <p className="font-bold text-slate-950 uppercase">Science</p>
                </div>
                <div>
                  <span className="text-slate-600">Student Type:</span>
                  <p className="font-bold text-slate-950 uppercase">Regular</p>
                </div>
                <div>
                  <span className="text-slate-600">Academic Session:</span>
                  <p className="font-bold text-slate-950 font-mono">2025 - 2026</p>
                </div>
              </div>
            </div>

            {/* Subject Marks & Grade Table */}
            <div className="border border-slate-900 rounded overflow-hidden font-sans">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white font-bold border-b border-slate-900 text-[10px] sm:text-[11px]">
                    <th className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center w-7 border-r border-slate-700">SI.</th>
                    <th className="py-1.5 sm:py-2 px-2 sm:px-3 border-r border-slate-700">Name of Subjects</th>
                    <th className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center border-r border-slate-700">Full</th>
                    <th className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center border-r border-slate-700">Theory (75)</th>
                    <th className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center border-r border-slate-700">Practical (25)</th>
                    <th className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center border-r border-slate-700">Total Marks</th>
                    <th className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center border-r border-slate-700">Grade</th>
                    <th className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center border-r border-slate-700">Point</th>
                    <th className="py-1.5 sm:py-2 px-1.5 sm:px-2 text-center">GPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 text-[10px] sm:text-[11px]">
                  {compulsorySubjects.map((sub, idx) => {
                    const isSubjectFailed = sub.isSubjectFail;
                    return (
                      <tr key={sub.code} className="hover:bg-slate-50">
                        <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono text-slate-700 border-r border-slate-300">{idx + 1}</td>
                        <td className="py-1.5 px-2 sm:px-3 font-semibold text-slate-900 border-r border-slate-300">
                          {sub.name} <span className="text-slate-500 font-mono text-[9px] sm:text-[10px]">({sub.code})</span>
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono text-slate-600 border-r border-slate-300">100</td>
                        <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono border-r border-slate-300">
                          {sub.isAbsent ? 'AB' : sub.isPractical ? sub.theoryMark : '—'}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono border-r border-slate-300">
                          {sub.isAbsent ? 'AB' : sub.isPractical ? sub.practicalMark : '—'}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono font-bold border-r border-slate-300">
                          {sub.isAbsent ? 'AB' : sub.totalMark}
                        </td>
                        <td className={`py-1.5 px-1.5 sm:px-2 text-center font-bold border-r border-slate-300 ${isSubjectFailed ? 'text-rose-700' : 'text-slate-950'}`}>
                          {sub.letterGrade}
                        </td>
                        <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono font-bold border-r border-slate-300">
                          {sub.gradePoint.toFixed(2)}
                        </td>
                        {idx === 0 && (
                          <td rowSpan={compulsorySubjects.length} className="py-2 px-1.5 sm:px-2 text-center font-mono font-bold text-slate-950 bg-slate-50/50 align-middle">
                            <div>
                              <span className="text-[9px] text-slate-500 font-normal block font-sans">Compulsory GPA</span>
                              <span className="text-sm sm:text-base">{gpaWithoutOptional.toFixed(2)}</span>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}

                  {/* 4th Optional Subject Section */}
                  {optionalSubject && (
                    <tr className="bg-slate-50/70 border-t-2 border-slate-800">
                      <td className="py-1.5 px-1.5 sm:px-2 text-center font-bold font-mono border-r border-slate-300">4th</td>
                      <td className="py-1.5 px-2 sm:px-3 font-bold text-slate-950 border-r border-slate-300">
                        {optionalSubject.name} <span className="text-slate-500 font-mono text-[9px] sm:text-[10px]">({optionalSubject.code}) [Optional]</span>
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono text-slate-600 border-r border-slate-300">100</td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono border-r border-slate-300">
                        {optionalSubject.isAbsent ? 'AB' : optionalSubject.isPractical ? optionalSubject.theoryMark : '—'}
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono border-r border-slate-300">
                        {optionalSubject.isAbsent ? 'AB' : optionalSubject.isPractical ? optionalSubject.practicalMark : '—'}
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono font-bold border-r border-slate-300">
                        {optionalSubject.isAbsent ? 'AB' : optionalSubject.totalMark}
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-center font-bold border-r border-slate-300">
                        {optionalSubject.letterGrade}
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono font-bold border-r border-slate-300">
                        {optionalSubject.gradePoint.toFixed(2)}
                      </td>
                      <td className="py-1.5 px-1.5 sm:px-2 text-center font-mono font-bold text-slate-900 bg-slate-100/70">
                        <div>
                          <span className="text-[8px] sm:text-[9px] text-slate-500 font-normal block font-sans">Bonus (GP &gt; 2)</span>
                          <span>+{student.optionalBonusGradePoints.toFixed(2)}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* GPA & Final Result Standing Summary */}
            <div className="border border-slate-900 rounded font-sans p-2 sm:p-2.5 bg-slate-50/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
              <div className="space-y-0.5 sm:space-y-1 text-[10px] sm:text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <span>Sum of 6 Compulsory Grade Points:</span>
                  <strong className="font-mono text-slate-950">{student.compulsoryGradePointsSum.toFixed(2)}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span>4th Subject Additional Bonus GP:</span>
                  <strong className="font-mono text-slate-950">+{student.optionalBonusGradePoints.toFixed(2)}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span>Divisor:</span>
                  <strong className="font-mono text-slate-950">6 (Fixed)</strong>
                </div>
              </div>

              {/* Official Standing Banner */}
              <div className="border-t sm:border-t-0 sm:border-l border-slate-300 pt-1.5 sm:pt-0 sm:pl-5 text-center sm:text-right">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-600 block">
                  Final Result Standing
                </span>
                <div className="flex items-baseline justify-center sm:justify-end gap-2 mt-0.5">
                  <span className="text-xl sm:text-2xl font-black font-mono text-slate-950">
                    GPA {student.finalGPA.toFixed(2)}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-bold uppercase ${
                    isFail
                      ? 'bg-rose-100 text-rose-900 border border-rose-400'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                  }`}>
                    Grade: {student.finalLetterGrade} ({isFail ? 'FAILED' : 'PASSED'})
                  </span>
                </div>
                {isFail && (
                  <p className="text-[9px] text-rose-700 font-semibold mt-0.5">
                    * Result cancelled due to failure in compulsory subject(s)
                  </p>
                )}
              </div>
            </div>

            {/* Official Authentication & Signatures Block */}
            <div className="pt-4 sm:pt-5 pb-1 grid grid-cols-3 gap-3 sm:gap-6 text-center text-[10px] sm:text-xs font-sans">
              <div className="border-t border-slate-900 pt-1">
                <p className="font-bold text-slate-950">Class Teacher</p>
                <p className="text-[8px] sm:text-[9px] text-slate-500">Prepared &amp; Checked</p>
              </div>

              <div className="border-t border-slate-900 pt-1 flex flex-col items-center">
                <p className="font-bold text-slate-950">Exam Controller</p>
                <p className="text-[8px] sm:text-[9px] text-slate-500">Verified by Committee</p>
              </div>

              <div className="border-t border-slate-900 pt-1 flex flex-col items-center relative">
                {/* Official Circular Seal Graphic */}
                <div className="w-9 h-9 sm:w-11 sm:h-11 border border-slate-400 rounded-full flex items-center justify-center text-[6px] sm:text-[7px] font-bold uppercase text-slate-600 -mt-7 sm:-mt-9 mb-0.5 bg-white shadow-sm">
                  Seal
                </div>
                <p className="font-bold text-slate-950">Headmaster</p>
                <p className="text-[8px] sm:text-[9px] text-slate-500">Bogura Model High School</p>
              </div>
            </div>

            {/* Bottom Official Timestamp & Footer */}
            <div className="border-t border-slate-300 pt-1 text-[8px] sm:text-[9px] text-slate-500 font-sans flex justify-between">
              <span>Date of Issue: <strong>30 August, 2026</strong></span>
              <span>Bogura Secondary Model High School</span>
              <span>Page 1 of 1</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
