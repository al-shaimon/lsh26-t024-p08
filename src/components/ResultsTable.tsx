import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Printer,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Calculator,
  User,
  GraduationCap,
  CheckCircle2,
  XCircle,
  ArrowUpRight
} from 'lucide-react';
import { StudentResult, Subject } from '../types/school';

interface ResultsTableProps {
  students: StudentResult[];
  subjects: Subject[];
  onSelectStudent: (student: StudentResult) => void;
  onPrintStudent: (student: StudentResult) => void;
  selectedClassFilter: string;
  setSelectedClassFilter: (cls: string) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  students,
  subjects,
  onSelectStudent,
  onPrintStudent,
  selectedClassFilter,
  setSelectedClassFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultFilter, setResultFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [sortField, setSortField] = useState<'id' | 'name' | 'finalGPA' | 'rawGPA'>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Extract unique classes
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.class) set.add(s.class);
    });
    return Array.from(set).sort();
  }, [students]);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchName = s.name.toLowerCase().includes(term);
          const matchId = s.id.toLowerCase().includes(term);
          const matchClass = s.class.toLowerCase().includes(term);
          const matchEdge = s.edgeCaseTag?.toLowerCase().includes(term);
          if (!matchName && !matchId && !matchClass && !matchEdge) return false;
        }

        if (selectedClassFilter === 'edge') {
          if (!s.edgeCaseTag) return false;
        } else if (selectedClassFilter !== 'all' && s.class !== selectedClassFilter) {
          return false;
        }

        if (resultFilter === 'pass' && s.finalLetterGrade === 'F') return false;
        if (resultFilter === 'fail' && s.finalLetterGrade !== 'F') return false;

        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'id') cmp = a.id.localeCompare(b.id, undefined, { numeric: true });
        else if (sortField === 'name') cmp = a.name.localeCompare(b.name);
        else if (sortField === 'finalGPA') cmp = a.finalGPA - b.finalGPA;
        else if (sortField === 'rawGPA') cmp = a.rawUncancelledGPA - b.rawUncancelledGPA;

        return sortAsc ? cmp : -cmp;
      });
  }, [students, searchTerm, selectedClassFilter, resultFilter, sortField, sortAsc]);

  const handleSort = (field: 'id' | 'name' | 'finalGPA' | 'rawGPA') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Search and Filters Toolbar */}
      <div className="glass-card p-3 sm:p-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, roll ID (e.g. S001), or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-700/80 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Selector Pills */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/80 text-xs font-medium overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedClassFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                selectedClassFilter === 'all'
                  ? 'bg-slate-700 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Classes
            </button>
            {availableClasses.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClassFilter(cls)}
                className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                  selectedClassFilter === cls
                    ? 'bg-slate-700 text-white shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cls}
              </button>
            ))}
            <button
              onClick={() => setSelectedClassFilter('edge')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                selectedClassFilter === 'edge'
                  ? 'bg-purple-600 text-white shadow-sm font-semibold'
                  : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Cases (8)</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700/80 text-xs font-medium">
            <button
              onClick={() => setResultFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                resultFilter === 'all'
                  ? 'bg-slate-700 text-white shadow-sm font-semibold'
                  : 'text-slate-400'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setResultFilter('pass')}
              className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                resultFilter === 'pass'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" /> Pass
            </button>
            <button
              onClick={() => setResultFilter('fail')}
              className={`px-2.5 py-1.5 rounded-lg transition flex items-center gap-1 cursor-pointer ${
                resultFilter === 'fail'
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" /> Fail
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. DESKTOP VIEW: Full Multi-Column Master Table (hidden on mobile) */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden md:block glass-card overflow-hidden w-full border-slate-800">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800 select-none">
                <th className="py-3 px-3 text-center w-12 text-slate-400">SL</th>
                <th
                  onClick={() => handleSort('id')}
                  className="py-3 px-3.5 cursor-pointer hover:text-brand-400 transition w-24"
                >
                  <div className="flex items-center gap-1">
                    <span>Roll ID</span>
                    {sortField === 'id' && (sortAsc ? '▲' : '▼')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-3.5 cursor-pointer hover:text-brand-400 transition min-w-[170px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name &amp; Class</span>
                    {sortField === 'name' && (sortAsc ? '▲' : '▼')}
                  </div>
                </th>
                <th className="py-3 px-3 text-center">Compulsory Subjects (6)</th>
                <th className="py-3 px-3 text-center">4th Optional Subject</th>
                <th
                  onClick={() => handleSort('rawGPA')}
                  className="py-3 px-2.5 text-center cursor-pointer hover:text-brand-400 transition w-20"
                  title="Uncancelled raw average according to Board formula"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Raw Avg</span>
                    {sortField === 'rawGPA' && (sortAsc ? '▲' : '▼')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('finalGPA')}
                  className="py-3 px-2.5 text-center cursor-pointer hover:text-brand-400 transition w-24"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Final GPA</span>
                    {sortField === 'finalGPA' && (sortAsc ? '▲' : '▼')}
                  </div>
                </th>
                <th className="py-3 px-2 text-center w-16">Grade</th>
                <th className="py-3 px-3 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="font-medium text-base mb-1">No student records found</p>
                    <p className="text-xs text-slate-500">
                      Try clearing your search query or adjusting the class and status filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const isFail = s.finalLetterGrade === 'F';
                  const opt = s.subjectResults.find((sub) => sub.isOptional);

                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectStudent(s)}
                      className={`group hover:bg-slate-800/40 cursor-pointer transition ${
                        s.edgeCaseTag ? 'bg-purple-950/10' : ''
                      }`}
                    >
                      {/* SL */}
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500 font-medium">
                        {idx + 1}
                      </td>

                      {/* ID / Roll */}
                      <td className="py-2.5 px-3.5 font-mono font-bold text-slate-100 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{s.id}</span>
                          {s.edgeCaseTag && (
                            <span className="p-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800" title={s.edgeCaseTag}>
                              <Sparkles className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Name & Class */}
                      <td className="py-2.5 px-3.5 min-w-[170px]">
                        <div className="font-semibold text-white group-hover:text-brand-400 transition text-xs sm:text-sm">
                          {s.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400">
                            {s.class}
                          </span>
                          {s.edgeCaseTag && (
                            <span
                              className="px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-medium"
                              title={s.edgeCaseTag}
                            >
                              Special Case
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6 Compulsory Subjects Inline Strip */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1 items-center justify-center">
                          {s.subjectResults
                            .filter((sub) => !sub.isOptional)
                            .map((sub) => {
                              const subFail = sub.isSubjectFail;
                              return (
                                <div
                                  key={sub.code}
                                  title={`${sub.name} (${sub.code}): ${
                                    sub.isAbsent
                                      ? 'Absent (AB)'
                                      : sub.isPractical
                                      ? `Theory: ${sub.theoryMark}/75, Practical: ${sub.practicalMark}/25`
                                      : `Mark: ${sub.totalMark}/100`
                                  } → GP ${sub.gradePoint.toFixed(1)} [${sub.letterGrade}]`}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono flex items-center gap-1 border ${
                                    sub.isAbsent
                                      ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                                      : subFail
                                      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                                      : 'bg-slate-800/90 text-slate-300 border-slate-700'
                                  }`}
                                >
                                  <span className="font-bold text-slate-400">{sub.code}:</span>
                                  <span className="font-bold text-white">
                                    {sub.isAbsent
                                      ? 'AB'
                                      : sub.isPractical
                                      ? `${sub.theoryMark}+${sub.practicalMark}`
                                      : sub.totalMark}
                                  </span>
                                  <span
                                    className={`px-1 rounded text-[9px] font-bold ${
                                      subFail ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                                    }`}
                                  >
                                    {sub.gradePoint.toFixed(1)}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </td>

                      {/* 4th Optional Subject Badge */}
                      <td className="py-2.5 px-3 text-center">
                        {opt ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono bg-purple-950/60 text-purple-300 border-purple-800">
                            <span className="font-bold">{opt.code}:</span>
                            <span className="font-bold">{opt.isAbsent ? 'AB' : opt.totalMark}</span>
                            <span className="px-1 bg-purple-600 text-white rounded text-[9px] font-bold">
                              +{s.optionalBonusGradePoints.toFixed(1)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500">-</span>
                        )}
                      </td>

                      {/* Raw GPA */}
                      <td className="py-2.5 px-2.5 text-center font-mono font-medium text-slate-400 text-xs">
                        {s.rawUncancelledGPA.toFixed(2)}
                      </td>

                      {/* Final GPA */}
                      <td className="py-2.5 px-2.5 text-center font-mono font-bold text-sm text-white">
                        <span className={isFail ? 'text-rose-400 font-bold' : 'text-slate-100'}>
                          {s.finalGPA.toFixed(2)}
                        </span>
                      </td>

                      {/* Grade Badge */}
                      <td className="py-2.5 px-2 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-xs border ${
                            isFail
                              ? 'bg-rose-950 text-rose-300 border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {s.finalLetterGrade}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onPrintStudent(s)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                            title="Print Official Marksheet"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSelectStudent(s)}
                            className="px-2 py-1 text-xs font-semibold text-brand-400 hover:text-brand-300 hover:bg-brand-950/60 rounded-lg transition flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Trace</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MOBILE VIEW: Dedicated Card Per Student (hidden on desktop) */}
      {/* ------------------------------------------------------------- */}
      <div className="md:hidden space-y-3 w-full">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center glass-card text-slate-400">
            <p className="font-bold text-sm">No student records found</p>
            <p className="text-xs text-slate-500 mt-1">Adjust search or filters.</p>
          </div>
        ) : (
          filteredStudents.map((s) => {
            const isFail = s.finalLetterGrade === 'F';
            const opt = s.subjectResults.find((sub) => sub.isOptional);

            return (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900 shadow-md space-y-3"
              >
                {/* Mobile Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700">
                        {s.id}
                      </span>
                      <h4 className="font-bold text-white text-base">{s.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>{s.class}</span>
                      <span>•</span>
                      <span>4th: <strong className="text-purple-300 font-mono">{s.optionalSubjectCode}</strong></span>
                    </div>
                  </div>

                  {/* Standing Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-xl border text-right shrink-0 ${
                      isFail
                        ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                        : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-slate-400">Official Result</div>
                    <div className="text-sm font-black font-mono">GPA {s.finalGPA.toFixed(2)}</div>
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase mt-0.5 ${
                      isFail ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {s.finalLetterGrade} {isFail ? '(Fail)' : '(Pass)'}
                    </span>
                  </div>
                </div>

                {/* 6 Compulsory Subjects Grid */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                    Compulsory Subjects (6)
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {s.subjectResults
                      .filter((sub) => !sub.isOptional)
                      .map((sub) => {
                        const subFail = sub.isSubjectFail;
                        return (
                          <div
                            key={sub.code}
                            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-center"
                          >
                            <div className="text-[10px] text-slate-400 font-bold">{sub.code}</div>
                            <div className="text-xs font-mono font-bold text-white mt-0.5">
                              {sub.isAbsent ? 'AB' : sub.totalMark}
                            </div>
                            <span
                              className={`inline-block px-1 rounded text-[9px] font-bold mt-1 ${
                                subFail ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                              }`}
                            >
                              GP {sub.gradePoint.toFixed(1)}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* 4th Optional Row */}
                {opt && (
                  <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-purple-300 block">
                        4th Optional ({opt.name})
                      </span>
                      <span className="text-slate-300 font-mono text-xs mt-0.5 block">
                        {opt.isAbsent ? 'Absent (AB)' : `Score: ${opt.totalMark} • GP ${opt.gradePoint.toFixed(1)}`}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Bonus GP</span>
                      <span className="font-mono font-bold text-purple-300 text-xs">
                        +{s.optionalBonusGradePoints.toFixed(2)} GP
                      </span>
                    </div>
                  </div>
                )}

                {/* Mobile Action Buttons */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => onSelectStudent(s)}
                    className="flex-1 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <Calculator className="w-3.5 h-3.5 text-brand-400" />
                    <span>Audit Calculation Trace</span>
                  </button>
                  <button
                    onClick={() => onPrintStudent(s)}
                    className="p-2 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition active:scale-98"
                    title="Print Marksheet"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
