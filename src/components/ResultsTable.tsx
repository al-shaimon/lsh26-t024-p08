import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ChevronRight,
  Printer,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
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

  // Extract unique classes from student list
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
        // Search filter
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          const matchName = s.name.toLowerCase().includes(term);
          const matchId = s.id.toLowerCase().includes(term);
          const matchClass = s.class.toLowerCase().includes(term);
          const matchEdge = s.edgeCaseTag?.toLowerCase().includes(term);
          if (!matchName && !matchId && !matchClass && !matchEdge) return false;
        }

        // Class filter
        if (selectedClassFilter === 'edge') {
          if (!s.edgeCaseTag) return false;
        } else if (selectedClassFilter !== 'all' && s.class !== selectedClassFilter) {
          return false;
        }

        // Result status filter
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

  const getGradeBadgeClass = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'A':
        return 'bg-green-950 text-green-300 border-green-800';
      case 'A-':
        return 'bg-teal-950 text-teal-300 border-teal-800';
      case 'B':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'C':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'D':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      default:
        return 'bg-rose-950 text-rose-300 border-rose-800';
    }
  };

  return (
    <div className="space-y-4 w-full">
      {/* Search and Filters Toolbar */}
      <div className="glass-card p-4 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name, roll ID (e.g. S001), class, or edge case tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-slate-700 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Selector Pills */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs font-medium overflow-x-auto">
            <button
              onClick={() => setSelectedClassFilter('all')}
              className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
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
                className={`px-3 py-1.5 rounded-md transition whitespace-nowrap ${
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
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1 whitespace-nowrap cursor-pointer ${
                selectedClassFilter === 'edge'
                  ? 'bg-purple-600 text-white shadow-sm font-semibold'
                  : 'text-purple-400 hover:text-purple-300'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Audited Special Cases (8)</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs font-medium">
            <button
              onClick={() => setResultFilter('all')}
              className={`px-2.5 py-1.5 rounded-md transition ${
                resultFilter === 'all'
                  ? 'bg-slate-700 text-white shadow-sm font-semibold'
                  : 'text-slate-400'
              }`}
            >
              All Results
            </button>
            <button
              onClick={() => setResultFilter('pass')}
              className={`px-2.5 py-1.5 rounded-md transition flex items-center gap-1 ${
                resultFilter === 'pass'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <CheckCircle className="w-3 h-3" /> Pass
            </button>
            <button
              onClick={() => setResultFilter('fail')}
              className={`px-2.5 py-1.5 rounded-md transition flex items-center gap-1 ${
                resultFilter === 'fail'
                  ? 'bg-rose-600 text-white shadow-sm font-semibold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <AlertCircle className="w-3 h-3" /> Fail
            </button>
          </div>
        </div>
      </div>

      {/* Results Table Container */}
      <div className="glass-card overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 text-slate-300 font-semibold border-b border-slate-800 select-none">
                <th
                  onClick={() => handleSort('id')}
                  className="py-3.5 px-4 cursor-pointer hover:text-brand-400 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>ID / Roll</span>
                    {sortField === 'id' && (sortAsc ? '▲' : '▼')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-4 cursor-pointer hover:text-brand-400 transition min-w-[200px]"
                >
                  <div className="flex items-center gap-1">
                    <span>Student Name & Class</span>
                    {sortField === 'name' && (sortAsc ? '▲' : '▼')}
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">Compulsory Subjects (6)</th>
                <th className="py-3.5 px-4 text-center">4th Optional Subject</th>
                <th
                  onClick={() => handleSort('rawGPA')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-brand-400 transition"
                  title="Uncancelled raw average according to R-13 formula"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Raw GPA</span>
                    {sortField === 'rawGPA' && (sortAsc ? '▲' : '▼')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('finalGPA')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-brand-400 transition"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Final GPA</span>
                    {sortField === 'finalGPA' && (sortAsc ? '▲' : '▼')}
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center">Grade</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <p className="font-medium text-base mb-1">No student records found</p>
                    <p className="text-xs text-slate-500">
                      Try clearing your search query or adjusting the class and status filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const isFail = s.finalLetterGrade === 'F';
                  const hasCompulsoryFail = s.isCompulsoryFail;

                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectStudent(s)}
                      className={`group hover:bg-brand-950/20 cursor-pointer transition ${
                        s.edgeCaseTag
                          ? 'bg-purple-950/10'
                          : ''
                      }`}
                    >
                      {/* ID / Roll */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-100 whitespace-nowrap">
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
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <div className="font-semibold text-white group-hover:text-brand-400 transition">
                          {s.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400">
                            {s.class}
                          </span>
                          {s.edgeCaseTag && (
                            <span className="text-[10px] font-medium text-purple-400 truncate max-w-[320px]">
                              {s.edgeCaseTag}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 6 Compulsory Subjects Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5 items-center justify-center">
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
                                      ? `Theory: ${sub.theoryMark}/75, Practical: ${sub.practicalMark}/25 (Total: ${sub.totalMark})`
                                      : `Mark: ${sub.totalMark}/100`
                                  } -> GP ${sub.gradePoint.toFixed(1)} [${sub.letterGrade}]. ${sub.ruleApplied}`}
                                  className={`px-2 py-0.5 rounded border text-[10px] font-mono flex items-center gap-1.5 ${
                                    sub.isAbsent
                                      ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                                      : subFail
                                      ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                                      : 'bg-slate-800 text-slate-300 border-slate-700'
                                  }`}
                                >
                                  <span className="font-bold">{sub.code}:</span>
                                  <span>
                                    {sub.isAbsent
                                      ? 'AB'
                                      : sub.isPractical
                                      ? `${sub.theoryMark}+${sub.practicalMark}`
                                      : sub.totalMark}
                                  </span>
                                  <span
                                    className={`px-1 rounded text-[9px] font-bold ${
                                      subFail
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-emerald-600 text-white'
                                    }`}
                                  >
                                    {sub.gradePoint.toFixed(1)}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </td>

                      {/* 4th Optional Subject */}
                      <td className="py-3.5 px-4 text-center">
                        {(() => {
                          const opt = s.subjectResults.find((r) => r.isOptional);
                          if (!opt) return <span className="text-slate-400">None</span>;
                          return (
                            <div className="inline-flex flex-col items-center">
                              <div
                                title={`${opt.name} (${opt.code}): Mark ${
                                  opt.isAbsent
                                    ? 'AB'
                                    : opt.isPractical
                                    ? `${opt.theoryMark}+${opt.practicalMark}=${opt.totalMark}`
                                    : opt.totalMark
                                } -> GP ${opt.gradePoint.toFixed(1)}. Bonus added: +${s.optionalBonusGradePoints.toFixed(1)} GP`}
                                className="px-2 py-0.5 rounded border border-purple-800 bg-purple-950/40 text-purple-300 font-mono text-[10px] flex items-center gap-1.5"
                              >
                                <span className="font-bold">{opt.code}:</span>
                                <span>{opt.isAbsent ? 'AB' : opt.totalMark}</span>
                                <span className="px-1 rounded bg-purple-600 text-white font-bold text-[9px]">
                                  {opt.gradePoint.toFixed(1)}
                                </span>
                              </div>
                              <span className="text-[9px] font-medium text-slate-400 mt-0.5">
                                Bonus: +{s.optionalBonusGradePoints.toFixed(1)} GP
                              </span>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Raw Uncancelled GPA */}
                      <td className="py-3.5 px-3 text-center font-mono">
                        <span
                          className={`text-xs font-semibold ${
                            hasCompulsoryFail
                              ? 'line-through text-slate-500'
                              : 'text-slate-300'
                          }`}
                          title={`Uncancelled Raw GPA: ${s.rawUncancelledGPA.toFixed(2)}`}
                        >
                          {s.rawUncancelledGPA.toFixed(2)}
                        </span>
                      </td>

                      {/* Final GPA */}
                      <td className="py-3.5 px-3 text-center font-mono">
                        <span
                          className={`text-sm font-bold ${
                            isFail
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {s.finalGPA.toFixed(2)}
                        </span>
                      </td>

                      {/* Grade Badge */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getGradeBadgeClass(
                            s.finalLetterGrade
                          )}`}
                        >
                          {s.finalLetterGrade}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPrintStudent(s);
                            }}
                            title="Print Official Marksheet"
                            className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-950 rounded-lg transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectStudent(s)}
                            className="px-2.5 py-1 text-xs font-medium text-brand-400 hover:bg-brand-950 rounded-lg flex items-center gap-0.5 transition"
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
    </div>
  );
};
