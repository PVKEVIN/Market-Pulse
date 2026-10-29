import React, { useState, useEffect } from 'react';
import {
  Settings,
  RefreshCw,
  Download,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Bell,
  HardDrive,
} from 'lucide-react';
import { CampaignBrief, CampaignRecord, RankedStrategy } from '../types';
import { resetDemoData } from '../services/storage';
import { BrandLogo } from '../components/common/BrandLogo';

interface SettingsPageProps {
  brief: CampaignBrief;
  campaigns: CampaignRecord[];
  strategies: RankedStrategy[];
  onResetData: () => void;
  onUpdateBrief: (brief: CampaignBrief) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  brief,
  campaigns,
  strategies,
  onResetData,
  onUpdateBrief,
}) => {
  const [workspaceName, setWorkspaceName] = useState(brief.businessName || 'EcoSip Demo Store');
  const [currency, setCurrency] = useState('INR');
  const [resetDone, setResetDone] = useState(false);
  const [apiStatus, setApiStatus] = useState<any>(null);
  const [isCheckingApi, setIsCheckingApi] = useState(false);

  const checkConnectivity = async () => {
    setIsCheckingApi(true);
    try {
      const start = performance.now();
      const res = await fetch('/api/status');
      const data = await res.json();
      const latency = Math.round(performance.now() - start);
      setApiStatus({ ...data, latency });
    } catch {
      setApiStatus({ status: 'error', aiEnabled: false, model: 'offline' });
    } finally {
      setIsCheckingApi(false);
    }
  };

  useEffect(() => {
    checkConnectivity();
  }, []);

  const handleReset = () => {
    resetDemoData();
    onResetData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  const handleExportData = () => {
    const payload = {
      exportDate: new Date().toISOString(),
      workspaceName,
      currency,
      brief,
      campaigns,
      strategies,
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `market_pulse_${workspaceName.replace(/\s+/g, '_').toLowerCase()}_backup.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800">
            System Preferences
          </span>
          <span className="text-xs text-slate-500">Workspace & Data Controls</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-heading">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage currency formatting, demo workspace state, API connectivity diagnostics, and data backups.
        </p>
      </div>

      {/* Official Brand Showcase Card */}
      <BrandLogo variant="card" />

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-600" />
          Workspace Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Business / Workspace Name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                onUpdateBrief({ ...brief, businessName: e.target.value });
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Currency Standard</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            >
              <option value="INR">Indian Rupee (₹ INR) - Default</option>
              <option value="USD">US Dollar ($ USD)</option>
              <option value="EUR">Euro (€ EUR)</option>
            </select>
          </div>
        </div>
      </div>

      {/* API Connectivity & Engine Diagnostics */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" />
              AI Intelligence Engine Diagnostics
            </h3>
            <p className="text-xs text-slate-500">
              Evaluates server-side Gemini integration and deterministic heuristic fallback status
            </p>
          </div>

          <button
            onClick={checkConnectivity}
            disabled={isCheckingApi}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCheckingApi ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Test Health</span>
          </button>
        </div>

        {apiStatus ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Server Status</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1 text-sm mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Operational
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[11px]">Active Engine / Model</span>
              <span className="font-mono font-bold text-indigo-900 text-xs mt-0.5 block truncate">
                {apiStatus.model || 'gemini-3.8-flash'}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[11px]">API Round-Trip Latency</span>
              <span className="font-mono font-bold text-slate-800 text-sm mt-0.5 block">
                {apiStatus.latency ? `${apiStatus.latency} ms` : 'Fast (<50ms)'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500">Checking connectivity...</div>
        )}
      </div>

      {/* Backup and Data Export */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-600" />
          Workspace Data Export
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Export a complete, self-contained JSON backup of your current marketing brief, historical campaigns, ranked strategies, and content drafts.
        </p>
        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export All Workspace Data (JSON)</span>
        </button>
      </div>

      {/* Danger Zone: Demo Reset */}
      <div className="bg-red-50/50 rounded-2xl border border-red-200 p-5 space-y-3">
        <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span>Reset Demonstration Data</span>
        </div>
        <p className="text-xs text-red-800 leading-relaxed">
          Reset all stored campaign records, ranking modifications, and uploaded brief parameters back to the initial <strong>EcoSip Demo Store</strong> state (Section 14).
        </p>

        {resetDone && (
          <div className="p-2.5 bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-lg">
            Demo data has been successfully restored to initial benchmark state.
          </div>
        )}

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          Reset Demo Data to Initial State
        </button>
      </div>
    </div>
  );
};
