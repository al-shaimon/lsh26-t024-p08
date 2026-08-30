import React from 'react';
import { Users, CheckCircle2, XCircle, Award, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { StudentResult } from '../types/school';

interface StatsOverviewProps {
  students: StudentResult[];
  onFilterEdgeCases?: () => void;
  isEdgeFilterActive?: boolean;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  students,
  onFilterEdgeCases,
  isEdgeFilterActive,
}) => {
  const total = students.length;
  const passed = students.filter((s) => s.finalLetterGrade !== 'F').length;
  const failed = total - passed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';

  const passingStudents = students.filter((s) => s.finalLetterGrade !== 'F');
  const avgGpa =
    passingStudents.length > 0
      ? (
          passingStudents.reduce((sum, s) => sum + s.finalGPA, 0) /
          passingStudents.length
        ).toFixed(2)
      : '0.00';

  const edgeCount = students.filter((s) => Boolean(s.edgeCaseTag)).length;
  const flaggedCount = students.filter(
    (s) => s.flags.optionalFlagged || s.flags.practicalFailFlagged || s.flags.absentFlagged
  ).length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {/* Total Students */}
      <div className="glass-card p-4 flex items-center gap-3">
        <div className="p-3 bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 rounded-xl">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Enrolled</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{total}</p>
        </div>
      </div>

      {/* Passed */}
      <div className="glass-card p-4 flex items-center gap-3">
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Passed (All 6)</p>
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{passed}</p>
        </div>
      </div>

      {/* Failed */}
      <div className="glass-card p-4 flex items-center gap-3">
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl">
          <XCircle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Failed (Grade F)</p>
          <p className="text-xl font-bold text-rose-600 dark:text-rose-400">{failed}</p>
        </div>
      </div>

      {/* Pass Rate */}
      <div className="glass-card p-4 flex items-center gap-3">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Pass Rate</p>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{passRate}%</p>
        </div>
      </div>

      {/* Average GPA */}
      <div className="glass-card p-4 flex items-center gap-3">
        <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Avg Passing GPA</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{avgGpa}</p>
        </div>
      </div>

      {/* Hard Edge Cases / Flagged */}
      <div
        onClick={onFilterEdgeCases}
        className={`glass-card p-4 flex items-center gap-3 cursor-pointer transition ${
          isEdgeFilterActive
            ? 'ring-2 ring-brand-500 bg-brand-50/50 dark:bg-brand-950/50'
            : 'hover:border-brand-300 dark:hover:border-brand-700'
        }`}
      >
        <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {edgeCount > 0 ? 'Hard Edge Cases' : 'Office Flags'}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
              {edgeCount > 0 ? edgeCount : flaggedCount}
            </p>
            {edgeCount > 0 && (
              <span className="text-[10px] uppercase font-semibold text-brand-600 dark:text-brand-400">
                {isEdgeFilterActive ? 'Active' : 'Filter'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
