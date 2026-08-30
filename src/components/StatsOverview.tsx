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
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
      {/* Total Students */}
      <div className="glass-card p-4 sm:p-5 flex items-center gap-3.5">
        <div className="p-3 bg-brand-950/70 text-brand-400 rounded-xl border border-brand-800/60 shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">Total Enrolled</p>
          <p className="text-xl sm:text-2xl font-bold text-white font-mono">{total}</p>
        </div>
      </div>

      {/* Passed */}
      <div className="glass-card p-4 sm:p-5 flex items-center gap-3.5">
        <div className="p-3 bg-emerald-950/70 text-emerald-400 rounded-xl border border-emerald-800/60 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">Passed (All 6)</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">{passed}</p>
        </div>
      </div>

      {/* Failed */}
      <div className="glass-card p-4 sm:p-5 flex items-center gap-3.5">
        <div className="p-3 bg-rose-950/70 text-rose-400 rounded-xl border border-rose-800/60 shrink-0">
          <XCircle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">Failed (Grade F)</p>
          <p className="text-xl sm:text-2xl font-bold text-rose-400 font-mono">{failed}</p>
        </div>
      </div>

      {/* Pass Rate */}
      <div className="glass-card p-4 sm:p-5 flex items-center gap-3.5">
        <div className="p-3 bg-indigo-950/70 text-indigo-400 rounded-xl border border-indigo-800/60 shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">Pass Rate</p>
          <p className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono">{passRate}%</p>
        </div>
      </div>

      {/* Average GPA */}
      <div className="glass-card p-4 sm:p-5 flex items-center gap-3.5">
        <div className="p-3 bg-amber-950/70 text-amber-400 rounded-xl border border-amber-800/60 shrink-0">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">Avg Passing GPA</p>
          <p className="text-xl sm:text-2xl font-bold text-white font-mono">{avgGpa}</p>
        </div>
      </div>

      {/* Audited Special Cases */}
      <div
        onClick={onFilterEdgeCases}
        className={`glass-card p-4 sm:p-5 flex items-center gap-3.5 cursor-pointer transition ${
          isEdgeFilterActive
            ? 'ring-2 ring-brand-500 bg-brand-950/60 border-brand-500'
            : 'hover:border-slate-700'
        }`}
      >
        <div className="p-3 bg-purple-950/70 text-purple-400 rounded-xl border border-purple-800/60 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 truncate">
            {edgeCount > 0 ? 'Special Audit Cases' : 'Office Checklist Flags'}
          </p>
          <div className="flex items-center gap-1.5">
            <p className="text-xl sm:text-2xl font-bold text-purple-400 font-mono">
              {edgeCount > 0 ? edgeCount : flaggedCount}
            </p>
            {edgeCount > 0 && (
              <span className="text-[10px] uppercase font-bold text-brand-400 px-1 py-0.2 rounded bg-brand-950/80 border border-brand-800">
                {isEdgeFilterActive ? 'Active' : 'Filter'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
