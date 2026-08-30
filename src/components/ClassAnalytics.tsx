import React from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertOctagon,
  Award,
  Users,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { StudentResult, Subject } from '../types/school';
import { calculateClassSummary } from '../engine/gpaEngine';

interface ClassAnalyticsProps {
  students: StudentResult[];
  subjects: Subject[];
}

export const ClassAnalytics: React.FC<ClassAnalyticsProps> = ({
  students,
  subjects,
}) => {
  const summary = calculateClassSummary(students, subjects);

  const gradeKeys: (keyof typeof summary.gradeDistribution)[] = [
    'A+',
    'A',
    'A-',
    'B',
    'C',
    'D',
    'F',
  ];

  const maxGradeCount = Math.max(...Object.values(summary.gradeDistribution), 1);

  const getBarColor = (grade: string) => {
    switch (grade) {
      case 'A+':
        return 'bg-emerald-500';
      case 'A':
        return 'bg-green-500';
      case 'A-':
        return 'bg-teal-500';
      case 'B':
        return 'bg-blue-500';
      case 'C':
        return 'bg-amber-500';
      case 'D':
        return 'bg-orange-500';
      default:
        return 'bg-rose-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-brand-900/10 via-indigo-900/5 to-transparent border-brand-200 dark:border-brand-800">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-brand-600 text-white rounded-xl shadow-md">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Class Summary & Performance Analytics
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                Bonus Feature
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Comprehensive institutional summary metrics, grade distribution curve, and hardest subject diagnostics.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pass Rate */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Overall Pass Rate
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary.passRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({summary.passedStudents}/{summary.totalStudents} passed)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${summary.passRate}%` }}
            />
          </div>
        </div>

        {/* Average Passing GPA */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Average Passing GPA
            </span>
            <Award className="w-5 h-5 text-brand-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {summary.averageGPA.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">/ 5.00</span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Average across all successful candidates
          </p>
        </div>

        {/* Failed Candidates */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Failed Candidates
            </span>
            <XCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400">
              {summary.failedStudents}
            </span>
            <span className="text-xs text-slate-500">
              ({((summary.failedStudents / (summary.totalStudents || 1)) * 100).toFixed(1)}%)
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Received Grade F due to compulsory fails
          </p>
        </div>

        {/* Hardest Subject */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Highest Failing Subject
            </span>
            <AlertOctagon className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {summary.hardestSubject.name} ({summary.hardestSubject.code})
            </span>
          </div>
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
            {summary.hardestSubject.failCount} students failed ({summary.hardestSubject.failRate}% fail rate)
          </p>
        </div>
      </div>

      {/* Grade Distribution Curve & Subject Failure Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grade Distribution Curve */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-brand-600" />
            <span>Grade Distribution Breakdown</span>
          </h3>

          <div className="space-y-3">
            {gradeKeys.map((grade) => {
              const count = summary.gradeDistribution[grade];
              const pct = ((count / (summary.totalStudents || 1)) * 100).toFixed(1);
              const barWidth = ((count / maxGradeCount) * 100).toFixed(1);

              return (
                <div key={grade} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-bold text-slate-700 dark:text-slate-300 font-mono">
                    {grade}
                  </span>
                  <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-5 rounded-md overflow-hidden flex items-center">
                    <div
                      className={`h-full ${getBarColor(grade)} transition-all duration-500`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="w-20 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Failure Ranking Matrix */}
        <div className="glass-card p-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-600" />
            <span>Subject-Wise Failure & Average Ranking</span>
          </h3>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3 text-center">Enrolled</th>
                  <th className="py-2.5 px-3 text-center">Fails</th>
                  <th className="py-2.5 px-3 text-center">Fail Rate</th>
                  <th className="py-2.5 px-3 text-center">Avg Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {summary.subjectStats.map((sub, idx) => (
                  <tr
                    key={sub.code}
                    className={
                      idx === 0 && sub.failCount > 0
                        ? 'bg-amber-50/40 dark:bg-amber-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }
                  >
                    <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">
                      {sub.name} <span className="font-mono text-slate-400">({sub.code})</span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                      {sub.totalEnrolled}
                    </td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-rose-600 dark:text-rose-400">
                      {sub.failCount}
                    </td>
                    <td className="py-2 px-3 text-center font-mono">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          sub.failRate > 20
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : 'text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {sub.failRate}%
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-slate-700 dark:text-slate-300">
                      {sub.averageMarks.toFixed(1)}/100
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
