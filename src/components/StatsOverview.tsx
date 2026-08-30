import React from 'react';
import { Users, CheckCircle2, XCircle, Award, AlertTriangle, FileSpreadsheet, Sparkles } from 'lucide-react';
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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3.5 mb-6">
      {/* Total Students */}
      <div className="glass-card p-3 sm:p-4 flex items-center gap-3 border-slate-800">
        <div className="p-2.5 sm:p-3 bg-brand-950/70 text-brand-400 rounded-xl border border-brand-800/60 shrink-0">
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-slate-400">Total Enrolled</p>
          <p className="text-lg sm:text-2xl font-bold text-white font-mono">{total}</p>
        </div>
      </div>

      {/* Passed */}
      <div className="glass-card p-3 sm:p-4 flex items-center gap-3 border-slate-800">
        <div className="p-2.5 sm:p-3 bg-emerald-950/70 text-emerald-400 rounded-xl border border-emerald-800/60 shrink-0">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-slate-400">Passed (All 6)</p>
          <p className="text-lg sm:text-2xl font-bold text-emerald-400 font-mono">{passed}</p>
        </div>
      </div>

      {/* Failed */}
      <div className="glass-card p-3 sm:p-4 flex items-center gap-3 border-slate-800">
        <div className="p-2.5 sm:p-3 bg-rose-950/70 text-rose-400 rounded-xl border border-rose-800/60 shrink-0">
          <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-slate-400">Failed (Grade F)</p>
          <p className="text-lg sm:text-2xl font-bold text-rose-400 font-mono">{failed}</p>
        </div>
      </div>

      {/* Pass Rate */}
      <div className="glass-card p-3 sm:p-4 flex items-center gap-3 border-slate-800">
        <div className="p-2.5 sm:p-3 bg-indigo-950/70 text-indigo-400 rounded-xl border border-indigo-800/60 shrink-0">
          <Award className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-slate-400">Pass Rate</p>
          <p className="text-lg sm:text-2xl font-bold text-indigo-400 font-mono">{passRate}%</p>
        </div>
      </div>

      {/* Average GPA */}
      <div className="glass-card p-3 sm:p-4 flex items-center gap-3 border-slate-800">
        <div className="p-2.5 sm:p-3 bg-amber-950/70 text-amber-400 rounded-xl border border-amber-800/60 shrink-0">
          <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs font-medium text-slate-400">Avg Passing GPA</p>
          <p className="text-lg sm:text-2xl font-bold text-white font-mono">{avgGpa}</p>
        </div>
      </div>

      {/* Audited Special Cases */}
      <div
        onClick={onFilterEdgeCases}
        className={`glass-card p-3 sm:p-4 flex items-center gap-3 cursor-pointer transition ${
          isEdgeFilterActive
            ? 'ring-2 ring-purple-500 bg-purple-950/60 border-purple-500'
            : 'hover:border-slate-700 border-slate-800'
        }`}
      >
        <div className="p-2.5 sm:p-3 bg-purple-950/70 text-purple-400 rounded-xl border border-purple-800/60 shrink-0">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-[11px] sm:text-xs font-medium text-purple-300">Special Cases</p>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-lg sm:text-2xl font-bold text-purple-300 font-mono">{edgeCount}</p>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-900/80 text-purple-200 border border-purple-700">
              Filter
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
