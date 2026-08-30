import React, { useState } from 'react';
import {
  ListCheck,
  AlertTriangle,
  UserX,
  FileCheck,
  ChevronRight,
  Download,
  Search,
  CheckCircle2
} from 'lucide-react';
import { StudentResult } from '../types/school';
import { evaluateCheckingLists } from '../engine/gpaEngine';

interface OfficeChecklistProps {
  students: StudentResult[];
  onSelectStudent: (student: StudentResult) => void;
}

export const OfficeChecklist: React.FC<OfficeChecklistProps> = ({
  students,
  onSelectStudent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'optional' | 'practical' | 'absent'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { optionalList, practicalFailList, absentList } = evaluateCheckingLists(students);

  // All unique flagged students
  const allFlagged = students.filter(
    (s) => s.flags.optionalFlagged || s.flags.practicalFailFlagged || s.flags.absentFlagged
  );

  const currentList = (() => {
    let list: StudentResult[] = [];
    if (activeSubTab === 'all') list = allFlagged;
    else if (activeSubTab === 'optional') list = optionalList;
    else if (activeSubTab === 'practical') list = practicalFailList;
    else if (activeSubTab === 'absent') list = absentList;

    if (!searchTerm) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term) ||
        s.class.toLowerCase().includes(term)
    );
  })();

  const exportCSV = () => {
    const headers = [
      'Student ID',
      'Name',
      'Class',
      'Optional Rule Flagged',
      'Practical Fail Flagged',
      'Absent Flagged',
      'Raw GPA',
      'Final GPA',
      'Final Grade',
    ];
    const rows = allFlagged.map((s) => [
      s.id,
      `"${s.name}"`,
      s.class,
      s.flags.optionalFlagged ? 'YES' : 'NO',
      s.flags.practicalFailFlagged ? 'YES' : 'NO',
      s.flags.absentFlagged ? 'YES' : 'NO',
      s.rawUncancelledGPA.toFixed(2),
      s.finalGPA.toFixed(2),
      s.finalLetterGrade,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bogura_office_checklist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-brand-900/10 via-brand-800/5 to-transparent border-brand-200/80 dark:border-brand-800/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-600 text-white rounded-xl shadow-md shrink-0">
              <ListCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Office Pre-Publication Verification Lists (Rule R-29)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Before publishing official results, teachers and headmasters must verify all student cases altered by the optional 4th subject threshold (GP ≤ 2.0), practical component failures (marks &lt; 8), or absent records.
              </p>
            </div>
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export Verification Sheet (CSV)</span>
          </button>
        </div>
      </div>

      {/* Checklist Subtabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Subtabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('all')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>All Flagged Cases</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200">
              {allFlagged.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('optional')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'optional'
                ? 'bg-purple-600 text-white shadow-sm font-semibold'
                : 'text-purple-600 dark:text-purple-400'
            }`}
          >
            <span>1. Optional Rule (GP ≤ 2.0 / AB)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-200">
              {optionalList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('practical')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'practical'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>2. Practical Fail (&lt; 8)</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
              {practicalFailList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('absent')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'absent'
                ? 'bg-rose-600 text-white shadow-sm font-semibold'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            <UserX className="w-3.5 h-3.5" />
            <span>3. Absent Record ('AB')</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
              {absentList.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search flagged cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Flagged Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <th className="py-3 px-4">Student ID & Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Flagged Verification Triggers</th>
                <th className="py-3 px-3 text-center">Raw GPA</th>
                <th className="py-3 px-3 text-center">Final Result</th>
                <th className="py-3 px-4 text-right">Office Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {currentList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      No flagged cases under this category
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      All student marks under this filter adhere to standard passing thresholds.
                    </p>
                  </td>
                </tr>
              ) : (
                currentList.map((s) => {
                  const opt = s.subjectResults.find((r) => r.isOptional);
                  const practicalFails = s.subjectResults.filter(
                    (r) => r.isPractical && typeof r.practicalMark === 'number' && r.practicalMark < 8
                  );
                  const absentSubs = s.subjectResults.filter((r) => r.isAbsent);

                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectStudent(s)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition"
                    >
                      {/* ID & Name */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="font-mono text-brand-600 dark:text-brand-400 font-bold">
                            {s.id}
                          </span>
                          <span>{s.name}</span>
                        </div>
                        {s.edgeCaseTag && (
                          <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5 truncate max-w-sm">
                            {s.edgeCaseTag}
                          </p>
                        )}
                      </td>

                      {/* Class */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {s.class}
                      </td>

                      {/* Trigger Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {/* Optional Flag */}
                          {s.flags.optionalFlagged && opt && (
                            <span
                              title={`Optional subject ${opt.name} (${opt.code}) GP is ${opt.gradePoint.toFixed(1)} <= 2.0. Adds 0 bonus points.`}
                              className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded text-[11px] font-medium"
                            >
                              Optional {opt.code} GP {opt.gradePoint.toFixed(1)} (Bonus: 0.0)
                            </span>
                          )}

                          {/* Practical Fail Flag */}
                          {practicalFails.map((p) => (
                            <span
                              key={p.code}
                              title={`Failed Practical in ${p.name} (${p.code}): scored ${p.practicalMark}/25 < 8 pass mark.`}
                              className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded text-[11px] font-medium flex items-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {p.code} Practical: {p.practicalMark}/25 (&lt; 8)
                            </span>
                          ))}

                          {/* Absent Flag */}
                          {absentSubs.map((a) => (
                            <span
                              key={a.code}
                              title={`Marked Absent in ${a.name} (${a.code}).`}
                              className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded text-[11px] font-medium flex items-center gap-1"
                            >
                              <UserX className="w-3 h-3" />
                              Absent in {a.code}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Raw GPA */}
                      <td className="py-3 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                        {s.rawUncancelledGPA.toFixed(2)}
                      </td>

                      {/* Final Result */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`font-mono font-bold ${
                            s.finalLetterGrade === 'F'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          GPA {s.finalGPA.toFixed(2)} [{s.finalLetterGrade}]
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectStudent(s)}
                          className="px-2.5 py-1 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900 text-xs font-semibold rounded-lg flex items-center gap-1 ml-auto transition"
                        >
                          <span>Verify Trace</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
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
