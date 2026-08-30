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
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  studentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCaseId,
  onSelectCase,
  onReset,
  darkMode,
  setDarkMode,
  studentCount,
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & School Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-brand-400 text-white rounded-xl shadow-md flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  Bogura Result Engine
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  P08 • Tier 02
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Team LSH26-T024 • Board Rules R-10, R-11, R-12, R-13, R-29
              </p>
            </div>
          </div>

          {/* Dataset Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative hidden md:flex items-center">
              <Database className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={selectedCaseId}
                onChange={(e) => onSelectCase(e.target.value)}
                className="pl-9 pr-8 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 cursor-pointer appearance-none"
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
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-950/50 rounded-lg border border-slate-200 dark:border-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle Theme"
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 border-t border-slate-200/60 dark:border-slate-800/60 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              activeTab === 'results'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Master Results Table</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-white/20 text-white">
              {studentCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              activeTab === 'checklist'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ListCheck className="w-4 h-4" />
            <span>Office Pre-Publication Checklist</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              activeTab === 'analytics'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Class Summary & Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition ${
              activeTab === 'upload'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload & Validate</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> Bonus
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
