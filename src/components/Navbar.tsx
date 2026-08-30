import React from 'react';
import {
  GraduationCap,
  Database,
  RotateCcw,
  Sun,
  Moon,
  ListCheck,
  BarChart3,
  Upload,
  Table as TableIcon,
  Sparkles
} from 'lucide-react';
import { CASE_OPTIONS } from '../data/fixtureLoader';

interface NavbarProps {
  activeTab: 'results' | 'checklist' | 'analytics' | 'upload';
  setActiveTab: (tab: 'results' | 'checklist' | 'analytics' | 'upload') => void;
  selectedCaseId: string;
  onSelectCase: (caseId: string) => void;
  onReset: () => void;
  studentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCaseId,
  onSelectCase,
  onReset,
  studentCount,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 transition-colors duration-200 no-print">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between py-3 sm:h-16 gap-3 sm:gap-4">
          {/* Logo & School Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-brand-400 text-white rounded-xl shadow-md flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white">
                  Bogura Result Engine
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-brand-950 text-brand-300 border border-brand-800 shrink-0">
                  P08 • Tier 02
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate">
                Team LSH26-T024 • Board Rules R-10, R-11, R-12, R-13, R-29
              </p>
            </div>
          </div>

          {/* Dataset Switcher & Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none flex items-center min-w-0">
              <Database className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedCaseId}
                onChange={(e) => onSelectCase(e.target.value)}
                className="w-full sm:w-auto pl-9 pr-8 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-900 text-slate-100 shadow-sm hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer appearance-none truncate"
              >
                {CASE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={onReset}
              title="Reset to Initial Data"
              className="p-2 text-slate-300 hover:text-brand-400 bg-slate-800 hover:bg-brand-950/50 rounded-lg border border-slate-700 transition shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-t border-slate-800/60 overflow-x-auto py-2.5 no-scrollbar">
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              activeTab === 'results'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Master Results Table</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white font-mono">
              {studentCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              activeTab === 'checklist'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ListCheck className="w-4 h-4" />
            <span>Office Pre-Publication Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              activeTab === 'analytics'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Class Summary &amp; Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition ${
              activeTab === 'upload'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload &amp; Validate</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 font-bold flex items-center gap-0.5 border border-amber-800/60">
              <Sparkles className="w-2.5 h-2.5" /> Bonus
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
