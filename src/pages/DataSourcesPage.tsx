import React, { useState } from 'react';
import {
  Database,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Download,
  Search,
  Filter,
  BarChart2,
  PieChart as PieIcon,
  ShieldAlert,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { CustomerDatasetSummary, DatasetColumnMeta } from '../types';
import {
  SYNTHETIC_DATASET_SUMMARY,
  generateSampleCsvContent,
  parseUserCsv,
} from '../services/sampleDataset';

export const DataSourcesPage: React.FC = () => {
  const [dataset, setDataset] = useState<CustomerDatasetSummary>(SYNTHETIC_DATASET_SUMMARY);
  const [columnSearch, setColumnSearch] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const filteredColumns = dataset.columns.filter((c) =>
    c.name.toLowerCase().includes(columnSearch.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseUserCsv(text, file.name);
        setDataset(parsed);
        setUploadSuccess(`Successfully imported ${file.name} (${parsed.totalRecords} records, ${parsed.totalColumns} columns)`);
      } catch (err: any) {
        setUploadError(err.message || 'Failed to parse CSV file.');
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read the file.');
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleCsv = () => {
    const csvContent = generateSampleCsvContent();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'india_youth_consumer_sample_50cols.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
              Customer Analytics & Data Validation
            </span>
            <span className="text-xs text-slate-500">First-Party & Benchmark Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Data Sources & Audience Validation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Accepts CSV uploads, validates schemas across 50 customer attributes, and summarizes platform adoption patterns.
          </p>
        </div>

        <button
          onClick={handleDownloadSampleCsv}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Download Sample CSV (50 Cols)</span>
        </button>
      </div>

      {/* Dataset Safety & Integrity Banner */}
      <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-950">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Section 8 Compliance: Dataset Integrity & Responsible AI Protocol</span>
        </div>
        <p className="text-amber-900 leading-relaxed">
          {dataset.isSynthetic ? (
            <>
              <strong>Synthetic Benchmark Label:</strong> The pre-loaded 45,000 record dataset is an illustrative demographic benchmark for urban Indian consumers. It is <strong>not</strong> verified real-world survey research. Customer attributes support aggregated audience insights; they do not, by themselves, prove which ad channel yields the highest ROI.
            </>
          ) : (
            <>
              <strong>User File Ingested:</strong> First-party CSV parsed with privacy-safe in-browser aggregation. No personally identifiable information (PII) is exposed or sent to public AI prompts.
            </>
          )}
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-indigo-400 transition-colors">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Upload Campaign or Audience CSV</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag and drop your customer research or campaign exports (CSV format, max 25MB).
            </p>
          </div>
          <label className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-sm transition-all">
            <span>Browse CSV File</span>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {uploadError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs text-left max-w-lg mx-auto flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs text-left max-w-lg mx-auto flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>

      {/* Active Dataset Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Dataset File</span>
          <div className="font-bold text-slate-900 text-sm truncate" title={dataset.fileName}>
            {dataset.fileName}
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold">{dataset.uploadedAt}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Total Records</span>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {dataset.totalRecords.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Validated rows</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Total Attributes</span>
          <div className="text-xl font-bold text-slate-900 font-mono">
            {dataset.totalColumns} Columns
          </div>
          <span className="text-[10px] text-slate-400">Demographic & behavioral</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] text-slate-500 font-medium">Duplicates Detected</span>
          <div className="text-xl font-bold text-amber-700 font-mono">
            {dataset.duplicateCount}
          </div>
          <span className="text-[10px] text-slate-400">Deduplication applied</span>
        </div>
      </div>

      {/* Validation Warnings List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-2">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-600" />
          Data Validation Diagnostic Log
        </h3>
        <div className="space-y-1.5 text-xs text-slate-600">
          {dataset.validationWarnings.map((warn, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
              <span className="text-indigo-600 font-bold">•</span>
              <span>{warn}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Aggregated Audience Segment Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Declared Platform Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Declared Social Platform Preference</h3>
              <p className="text-xs text-slate-500">Distribution across 45,000 customer records</p>
            </div>
            <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
              Instagram #1
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataset.platformDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="platform" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any) => [`${val} respondents`, 'Count']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Cohorts & Engagement Rates */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Age Cohort Distribution</h3>
              <p className="text-xs text-slate-500">Dominant segments & top platform match</p>
            </div>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
              18–24 = 45%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataset.ageCohortDistribution} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis type="category" dataKey="cohort" tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} consumers (Top: ${item.payload.topPlatform})`,
                    'Cohort Size',
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 50 Attributes Schema Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Dataset Attributes Schema ({dataset.columns.length} Columns)
            </h3>
            <p className="text-xs text-slate-500">
              Data type verification, null counts, and representative values
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search column names..."
              value={columnSearch}
              onChange={(e) => setColumnSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
              <tr>
                <th className="py-2.5 px-4">#</th>
                <th className="py-2.5 px-4">Column Name</th>
                <th className="py-2.5 px-4">Inferred Type</th>
                <th className="py-2.5 px-4">Missing / Nulls</th>
                <th className="py-2.5 px-4">Sample Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredColumns.map((col, idx) => (
                <tr key={col.name} className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-2.5 px-4 font-mono font-medium text-slate-800">{col.name}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                      {col.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-mono">
                    {col.missingCount > 0 ? (
                      <span className="text-amber-700 font-semibold">{col.missingCount}</span>
                    ) : (
                      <span className="text-emerald-700">0</span>
                    )}
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 font-mono truncate max-w-xs">
                    {col.sampleValue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
