import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { ResultsTable } from './components/ResultsTable';
import { StudentTraceModal } from './components/StudentTraceModal';
import { OfficeChecklist } from './components/OfficeChecklist';
import { ClassAnalytics } from './components/ClassAnalytics';
import { MarksheetUpload } from './components/MarksheetUpload';
import { StudentMarksheet } from './components/StudentMarksheet';
import {
  PublicFixtureCase,
  StudentResult,
  Subject,
} from './types/school';
import {
  DEFAULT_BOGURA_CASE,
  getCaseById,
} from './data/fixtureLoader';
import { calculateStudentGPA } from './engine/gpaEngine';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'results' | 'checklist' | 'analytics' | 'upload'>('results');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('BOGURA-DEFAULT');
  const [currentCase, setCurrentCase] = useState<PublicFixtureCase>(DEFAULT_BOGURA_CASE);
  const [selectedStudentForTrace, setSelectedStudentForTrace] = useState<StudentResult | null>(null);
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState<StudentResult | null>(null);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');

  // Handle case switcher change
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    const loadedCase = getCaseById(caseId);
    setCurrentCase(loadedCase);
    setSelectedClassFilter('all');
  };

  // Reset to default
  const handleReset = () => {
    setSelectedCaseId('BOGURA-DEFAULT');
    setCurrentCase(DEFAULT_BOGURA_CASE);
    setSelectedClassFilter('all');
    setActiveTab('results');
  };

  // Handle custom upload case load
  const handleLoadCustomCase = (customCase: PublicFixtureCase) => {
    setCurrentCase(customCase);
    setSelectedCaseId(customCase.case_id);
    setActiveTab('results');
    setSelectedClassFilter('all');
  };

  // Map of subjects for fast lookup
  const subjectsMap = useMemo(() => {
    return new Map<string, Subject>(currentCase.subjects.map((s) => [s.code, s]));
  }, [currentCase.subjects]);

  // Compute student results deterministically through the GPA Engine
  const studentResults: StudentResult[] = useMemo(() => {
    return currentCase.students.map((student) =>
      calculateStudentGPA(student, subjectsMap, currentCase.compulsory)
    );
  }, [currentCase.students, subjectsMap, currentCase.compulsory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCaseId={selectedCaseId}
        onSelectCase={handleSelectCase}
        onReset={handleReset}
        studentCount={studentResults.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* KPI Stats Overview */}
        <div className="no-print">
          <StatsOverview
            students={studentResults}
            onFilterEdgeCases={() => {
              setActiveTab('results');
              setSelectedClassFilter((prev) => (prev === 'edge' ? 'all' : 'edge'));
            }}
            isEdgeFilterActive={selectedClassFilter === 'edge'}
          />
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'results' && (
          <ResultsTable
            students={studentResults}
            subjects={currentCase.subjects}
            onSelectStudent={(student) => setSelectedStudentForTrace(student)}
            onPrintStudent={(student) => setSelectedStudentForPrint(student)}
            selectedClassFilter={selectedClassFilter}
            setSelectedClassFilter={setSelectedClassFilter}
          />
        )}

        {activeTab === 'checklist' && (
          <OfficeChecklist
            students={studentResults}
            onSelectStudent={(student) => setSelectedStudentForTrace(student)}
          />
        )}

        {activeTab === 'analytics' && (
          <ClassAnalytics
            students={studentResults}
            subjects={currentCase.subjects}
          />
        )}

        {activeTab === 'upload' && (
          <MarksheetUpload
            onLoadCustomCase={handleLoadCustomCase}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-5 text-center text-xs text-slate-400 no-print mt-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2026 Bogura Secondary Model High School • Result Processing &amp; Academic Records
          </p>
          <p className="text-[11px] text-slate-500">
            Board of Intermediate &amp; Secondary Education, Rajshahi
          </p>
        </div>
      </footer>

      {/* Per-Student Rule Trace Modal (Bullet 3) */}
      <StudentTraceModal
        student={selectedStudentForTrace}
        onClose={() => setSelectedStudentForTrace(null)}
        onPrint={(s) => {
          setSelectedStudentForTrace(null);
          setSelectedStudentForPrint(s);
        }}
      />

      {/* Printable Individual Student Marksheet (Bonus 3) */}
      <StudentMarksheet
        student={selectedStudentForPrint}
        onClose={() => setSelectedStudentForPrint(null)}
      />
    </div>
  );
};

export default App;
