import React, { useState } from 'react';
import {
  Upload,
  FileCode,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Copy,
  ArrowRight
} from 'lucide-react';
import { StudentRaw, Subject, PublicFixtureCase } from '../types/school';
import { DEFAULT_SUBJECTS, DEFAULT_COMPULSORY_CODES } from '../data/defaultDataset';

interface MarksheetUploadProps {
  onLoadCustomCase: (customCase: PublicFixtureCase) => void;
}

interface ValidationIssue {
  row: number;
  studentId: string;
  studentName: string;
  field: string;
  value: string;
  reason: string;
  severity: 'error' | 'warning';
}

export const MarksheetUpload: React.FC<MarksheetUploadProps> = ({
  onLoadCustomCase,
}) => {
  const [pasteText, setPasteText] = useState('');
  const [inputFormat, setInputFormat] = useState<'json' | 'csv'>('json');
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [validStudents, setValidStudents] = useState<StudentRaw[]>([]);
  const [hasValidated, setHasValidated] = useState(false);

  const sampleJSON = JSON.stringify(
    {
      case_id: "CUSTOM-UPLOAD-01",
      subjects: DEFAULT_SUBJECTS,
      compulsory: DEFAULT_COMPULSORY_CODES,
      students: [
        {
          id: "U001",
          name: "Nasir Uddin",
          class: "Class 9",
          optional: "HMT",
          marks: {
            BAN: 82,
            ENG: 75,
            MAT: 88,
            PHY: { theory: 60, practical: 20 },
            CHE: { theory: 55, practical: 19 },
            BIO: { theory: 58, practical: 21 },
            HMT: { theory: 62, practical: 22 }
          }
        },
        {
          id: "U002",
          name: "Invalid Mark Sample (Will Be Rejected)",
          class: "Class 9",
          optional: "AGR",
          marks: {
            BAN: 120, // Error: > 100
            ENG: 75,
            MAT: "AB",
            PHY: { theory: 80, practical: 30 }, // Error: theory > 75, practical > 25
            CHE: { theory: 50, practical: 18 },
            BIO: { theory: 45, practical: 15 },
            AGR: { theory: 50, practical: 18 }
          }
        }
      ]
    },
    null,
    2
  );

  const handleValidate = () => {
    setHasValidated(true);
    const issues: ValidationIssue[] = [];
    const valid: StudentRaw[] = [];

    if (!pasteText.trim()) {
      setValidationIssues([
        {
          row: 0,
          studentId: 'N/A',
          studentName: 'N/A',
          field: 'Payload',
          value: 'Empty',
          reason: 'Please paste or upload JSON or CSV marksheet data to validate.',
          severity: 'error',
        },
      ]);
      setValidStudents([]);
      return;
    }

    if (inputFormat === 'json') {
      try {
        const parsed = JSON.parse(pasteText);
        const rawStudents: any[] = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.students)
          ? parsed.students
          : [];

        if (rawStudents.length === 0) {
          issues.push({
            row: 1,
            studentId: 'N/A',
            studentName: 'N/A',
            field: 'students',
            value: 'None',
            reason: 'No valid students array found in JSON payload.',
            severity: 'error',
          });
        }

        rawStudents.forEach((st, idx) => {
          const rowNum = idx + 1;
          const sId = st.id || `UNKNOWN_${rowNum}`;
          const sName = st.name || `Student ${rowNum}`;
          let rowHasError = false;

          if (!st.id) {
            issues.push({
              row: rowNum,
              studentId: sId,
              studentName: sName,
              field: 'id',
              value: 'missing',
              reason: 'Student ID is required.',
              severity: 'error',
            });
            rowHasError = true;
          }

          if (!st.optional) {
            issues.push({
              row: rowNum,
              studentId: sId,
              studentName: sName,
              field: 'optional',
              value: 'missing',
              reason: 'Optional 4th subject code is required.',
              severity: 'error',
            });
            rowHasError = true;
          }

          if (!st.marks || typeof st.marks !== 'object') {
            issues.push({
              row: rowNum,
              studentId: sId,
              studentName: sName,
              field: 'marks',
              value: 'missing',
              reason: 'Marks dictionary is missing or invalid.',
              severity: 'error',
            });
            rowHasError = true;
          } else {
            // Check each mark
            for (const [subCode, markVal] of Object.entries(st.marks)) {
              if (markVal === 'AB') continue;

              if (typeof markVal === 'number') {
                if (markVal < 0 || markVal > 100) {
                  issues.push({
                    row: rowNum,
                    studentId: sId,
                    studentName: sName,
                    field: `marks.${subCode}`,
                    value: String(markVal),
                    reason: `Mark must be between 0 and 100 (or "AB"). Found ${markVal}.`,
                    severity: 'error',
                  });
                  rowHasError = true;
                }
              } else if (typeof markVal === 'object' && markVal !== null) {
                const th = (markVal as any).theory;
                const pr = (markVal as any).practical;
                if (typeof th !== 'number' || th < 0 || th > 75) {
                  issues.push({
                    row: rowNum,
                    studentId: sId,
                    studentName: sName,
                    field: `marks.${subCode}.theory`,
                    value: String(th),
                    reason: `Theory mark must be between 0 and 75. Found ${th}.`,
                    severity: 'error',
                  });
                  rowHasError = true;
                }
                if (typeof pr !== 'number' || pr < 0 || pr > 25) {
                  issues.push({
                    row: rowNum,
                    studentId: sId,
                    studentName: sName,
                    field: `marks.${subCode}.practical`,
                    value: String(pr),
                    reason: `Practical mark must be between 0 and 25. Found ${pr}.`,
                    severity: 'error',
                  });
                  rowHasError = true;
                }
              } else {
                issues.push({
                  row: rowNum,
                  studentId: sId,
                  studentName: sName,
                  field: `marks.${subCode}`,
                  value: JSON.stringify(markVal),
                  reason: `Invalid mark format. Expected number, object {theory, practical}, or "AB".`,
                  severity: 'error',
                });
                rowHasError = true;
              }
            }
          }

          if (!rowHasError) {
            valid.push(st as StudentRaw);
          }
        });
      } catch (err: any) {
        issues.push({
          row: 0,
          studentId: 'N/A',
          studentName: 'N/A',
          field: 'Syntax',
          value: 'Malformed JSON',
          reason: `JSON parse error: ${err.message}`,
          severity: 'error',
        });
      }
    }

    setValidationIssues(issues);
    setValidStudents(valid);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPasteText(content);
    };
    reader.readAsText(file);
  };

  const handleLoadValid = () => {
    if (validStudents.length === 0) return;

    const customCase: PublicFixtureCase = {
      case_id: `CUSTOM-${Date.now().toString().slice(-4)}`,
      subjects: DEFAULT_SUBJECTS,
      compulsory: DEFAULT_COMPULSORY_CODES,
      students: validStudents,
    };

    onLoadCustomCase(customCase);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-amber-900/10 via-brand-900/5 to-transparent border-amber-200/80 dark:border-amber-800/80">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-600 text-white rounded-xl shadow-md">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Marksheet Paste & Upload Validator
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                Bonus Feature
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Upload or paste new batch marksheets to automatically validate data integrity and diagnose rejected records.
            </p>
          </div>
        </div>
      </div>

      {/* Editor & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Paste/Upload Box */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Marksheet Payload (JSON)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPasteText(sampleJSON)}
                className="px-2.5 py-1 text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 rounded-md border border-brand-200 dark:border-brand-800 flex items-center gap-1 hover:bg-brand-100 transition"
              >
                <Copy className="w-3 h-3" />
                <span>Load Sample with Valid & Error Rows</span>
              </button>
            </div>
          </div>

          <textarea
            rows={14}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your JSON marksheet here..."
            className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <label className="px-4 py-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 cursor-pointer flex items-center gap-2 transition">
              <Upload className="w-4 h-4" />
              <span>Choose File (.json)</span>
              <input
                type="file"
                accept=".json,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={handleValidate}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Validate & Diagnose Marks</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Summary */}
        <div className="glass-card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-brand-600" />
              <span>Validation Summary</span>
            </h3>

            {hasValidated ? (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
                    Valid Records Accepted:
                  </span>
                  <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                    {validStudents.length} Students
                  </p>
                </div>

                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl">
                  <span className="text-xs font-medium text-rose-800 dark:text-rose-300">
                    Rejected / Malformed Rows:
                  </span>
                  <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400 mt-1 font-mono">
                    {validationIssues.length} Issues
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                Click &quot;Validate &amp; Diagnose Marks&quot; to inspect your payload against official Board limits.
              </div>
            )}
          </div>

          {validStudents.length > 0 && (
            <button
              onClick={handleLoadValid}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Load {validStudents.length} Students Into Results Table</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Detailed Issues Table */}
      {hasValidated && validationIssues.length > 0 && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 bg-rose-50/80 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-800 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600" />
            <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
              Row Rejection Diagnostics ({validationIssues.length} Errors Found)
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2.5 px-4">Row #</th>
                  <th className="py-2.5 px-4">Student ID & Name</th>
                  <th className="py-2.5 px-4">Field</th>
                  <th className="py-2.5 px-4">Submitted Value</th>
                  <th className="py-2.5 px-4">Rejection Reason & Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {validationIssues.map((iss, i) => (
                  <tr key={i} className="hover:bg-rose-50/30 dark:hover:bg-rose-950/20">
                    <td className="py-2.5 px-4 font-mono font-bold text-rose-600">
                      Row {iss.row}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {iss.studentName} ({iss.studentId})
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {iss.field}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-rose-600 dark:text-rose-400 font-semibold">
                      {iss.value}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {iss.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
