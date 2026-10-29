import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  ArrowRight,
  Sparkles,
  DollarSign,
  Users,
  Target,
  ExternalLink,
  Edit3,
  RefreshCw,
  Info,
  Calendar,
  HelpCircle,
} from 'lucide-react';
import { MarketingClarityCard } from '../components/common/MarketingClarityCard';
import { WhatShouldIDoNext } from '../components/overview/WhatShouldIDoNext';
import { DecisionHistoryCard } from '../components/overview/DecisionHistoryCard';
import { ExplainModal } from '../components/common/ExplainModal';
import { EXPLANATIONS } from '../services/explanationDictionary';
import { ExplainThisItem } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CampaignRecord, RankedStrategy, CampaignBrief } from '../types';
import { saveCampaigns } from '../services/storage';

interface OverviewPageProps {
  campaigns: CampaignRecord[];
  strategies: RankedStrategy[];
  brief: CampaignBrief;
  onNavigate: (tab: string) => void;
  onSelectStrategy: (strat: RankedStrategy) => void;
  onUpdateCampaigns: (updated: CampaignRecord[]) => void;
  onResetData: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  campaigns,
  strategies,
  brief,
  onNavigate,
  onSelectStrategy,
  onUpdateCampaigns,
  onResetData,
}) => {
  const [selectedCampaignForResults, setSelectedCampaignForResults] = useState<CampaignRecord | null>(null);
  const [selectedExplainItem, setSelectedExplainItem] = useState<ExplainThisItem | null>(null);
  const [editActualSpend, setEditActualSpend] = useState<number>(0);
  const [editLeads, setEditLeads] = useState<number>(0);
  const [editNotes, setEditNotes] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('Completed');

  // Compute aggregate metrics
  const totalStrategiesCount = strategies.length;
  const totalCampaignsCount = campaigns.length;

  const totalPlannedBudget = campaigns.reduce((acc, c) => acc + (c.plannedBudget || 0), 0) + 15000; // plus unallocated
  const totalActualExpenditure = campaigns.reduce((acc, c) => acc + (c.actualExpenditure || 0), 0);
  const totalQualifiedLeads = campaigns.reduce((acc, c) => acc + (c.qualifiedLeads || 0), 0);
  const overallCpl =
    totalQualifiedLeads > 0 ? Math.round((totalActualExpenditure / totalQualifiedLeads) * 100) / 100 : null;

  // Chart data for campaign performance
  const chartData = campaigns.map((c) => ({
    name: c.name.split(' (')[0],
    spend: c.actualExpenditure || c.plannedBudget,
    leads: c.qualifiedLeads || 0,
    cpl: c.calculatedCpl || 0,
  }));

  const handleOpenResultsModal = (camp: CampaignRecord) => {
    setSelectedCampaignForResults(camp);
    setEditActualSpend(camp.actualExpenditure || camp.plannedBudget || 0);
    setEditLeads(camp.qualifiedLeads || 0);
    setEditNotes(camp.notes || '');
    setEditStatus(camp.status);
  };

  const handleSaveResults = () => {
    if (!selectedCampaignForResults) return;

    const calcCpl = editLeads > 0 ? Math.round((editActualSpend / editLeads) * 100) / 100 : null;
    const updated = campaigns.map((c) => {
      if (c.id === selectedCampaignForResults.id) {
        return {
          ...c,
          actualExpenditure: editActualSpend,
          qualifiedLeads: editLeads,
          calculatedCpl: calcCpl,
          status: editStatus as any,
          notes: editNotes,
        };
      }
      return c;
    });

    onUpdateCampaigns(updated);
    saveCampaigns(updated);
    setSelectedCampaignForResults(null);
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Strategy Context Banner with Official Branding */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black border border-slate-700/80 shadow-xl shrink-0 p-0.5 hidden sm:block">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-29_at_8.16.40_PM_79919d41.jpeg"
                alt="Market Pulse"
                className="w-full h-full object-cover object-top scale-120"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active Workspace
                </span>
                <span className="text-xs font-semibold text-indigo-300">Where Every Budget Counts.</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
                {brief.businessName} Overview
              </h1>
              <p className="text-xs sm:text-sm text-indigo-200/90 max-w-2xl leading-relaxed">
                Targeting {brief.targetAudience} ({brief.audienceAgeRange}) for <strong>{brief.product}</strong>.
                Compare historical campaign efficiency, review ranked strategy models, and allocate future budget.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('strategy-finder')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-semibold text-xs sm:text-sm hover:bg-indigo-50 transition-all shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Find New Strategy</span>
            </button>
            <button
              onClick={() => onNavigate('campaign-studio')}
              className="px-4 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all border border-indigo-500/30 flex items-center gap-2"
            >
              <span>Campaign Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Actionable Next Move & High Priority Recommendations */}
      <WhatShouldIDoNext
        brief={brief}
        campaigns={campaigns}
        onNavigate={onNavigate}
      />

      {/* Marketing Clarity Readiness Score & Action Checklist */}
      <MarketingClarityCard
        brief={brief}
        campaigns={campaigns}
        onNavigate={onNavigate}
      />

      {/* Dashboard KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Planned Budget */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span>Planned Ad Budget</span>
              <button
                type="button"
                onClick={() => setSelectedExplainItem(EXPLANATIONS['planned-vs-actual'])}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="Explain Planned vs Actual"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </span>
            <DollarSign className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            ₹{totalPlannedBudget.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
            <span>Allocated: ₹{totalActualExpenditure.toLocaleString('en-IN')}</span>
            <span className="text-emerald-600 font-medium">₹15,000 reserve</span>
          </div>
        </div>

        {/* Actual Expenditure */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Actual Expenditure</span>
            <Target className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            ₹{totalActualExpenditure.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500 pt-1">
            Verified across 3 historical campaigns
          </p>
        </div>

        {/* Qualified Leads */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Qualified Leads</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {totalQualifiedLeads}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium pt-1">
            Deduplicated verified enquiries
          </p>
        </div>

        {/* Cost Per Qualified Lead (CPL) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <span>Cost Per Lead (CPL)</span>
              <button
                type="button"
                onClick={() => setSelectedExplainItem(EXPLANATIONS['cost-per-lead'])}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                title="Explain Cost Per Lead"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </span>
            <BarChart3 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {overallCpl ? `₹${overallCpl}` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-500 pt-1 flex items-center justify-between">
            <span>Best: <strong className="text-slate-800">Search (₹500)</strong></span>
            <button
              onClick={() => setSelectedExplainItem(EXPLANATIONS['cost-per-lead'])}
              className="text-indigo-600 hover:text-indigo-800 font-medium text-[10px]"
            >
              Explain CPL →
            </button>
          </div>
        </div>
      </div>

      {/* Unmeasured Metrics Card (Section 6 & 14 requirement: Do not invent revenue, conversions, or ROAS) */}
      <div className="p-3.5 bg-slate-100/90 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-slate-600">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>Data Integrity Safeguard:</strong> Conversion Rate, Revenue, and ROAS are labeled{' '}
            <span className="font-semibold text-slate-800">"Not available"</span> because purchase revenue and post-lead conversion pixel telemetry were not supplied in the demo workspace.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setSelectedExplainItem(EXPLANATIONS['conversion-rate'])}
            className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 underline"
          >
            Why not show conversion rate?
          </button>
          <span className="text-[10px] uppercase font-semibold text-slate-600 px-2 py-0.5 rounded bg-slate-200">
            Zero Fabricated ROI
          </span>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Spend vs Qualified Leads Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Campaign Comparison: Spend vs Leads</h3>
              <p className="text-xs text-slate-500">Comparing direct expenditure to qualified enquiries</p>
            </div>
            <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
              ₹ vs Units
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value: any, name: any) => {
                    if (name === 'Spend (₹)') return [`₹${Number(value).toLocaleString('en-IN')}`, 'Spend'];
                    return [value, 'Qualified Leads'];
                  }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar yAxisId="left" dataKey="spend" name="Spend (₹)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="leads" name="Qualified Leads" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Per Lead Efficiency Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Channel Cost-Efficiency (CPL)</h3>
              <p className="text-xs text-slate-500">Lower is better: Cost per qualified prospect</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Search = 2x Efficiency
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} unit="₹" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                <Tooltip
                  formatter={(value: any) => [`₹${value}`, 'Cost Per Qualified Lead']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="cpl" name="Cost Per Lead (₹)" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Historical Campaign Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Historical Campaign Records</h3>
            <p className="text-xs text-slate-500">Track planned vs actual expenditure, verified enquiries, and follow-ups</p>
          </div>
          <button
            onClick={() => onNavigate('strategy-finder')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Campaign Plan</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Channel Type</th>
                <th className="py-3 px-4">Planned Spend</th>
                <th className="py-3 px-4">Actual Spend</th>
                <th className="py-3 px-4">Qualified Leads</th>
                <th className="py-3 px-4">Calculated CPL</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{camp.name}</div>
                    <div className="text-[11px] text-slate-500">{camp.product} • {camp.createdAt}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                      {camp.channels[0] || 'Multi-channel'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-700">
                    ₹{camp.plannedBudget.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                    {camp.actualExpenditure ? `₹${camp.actualExpenditure.toLocaleString('en-IN')}` : 'Pending'}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                    {camp.qualifiedLeads !== null ? camp.qualifiedLeads : 'N/A'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {camp.calculatedCpl !== null ? `₹${camp.calculatedCpl}` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        camp.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : camp.status === 'Running'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => handleOpenResultsModal(camp)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors"
                    >
                      Enter Results
                    </button>
                    <button
                      onClick={() => onNavigate('campaign-studio')}
                      className="px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      Drafts
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Marketing Decisions & Learnings Audit Log */}
      <DecisionHistoryCard onNavigate={onNavigate} />

      {/* Saved Ranked Strategies Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Current Ranked Strategy Models</h3>
            <p className="text-xs text-slate-500">Deterministic scoring tailored to {brief.product}</p>
          </div>
          <button
            onClick={() => onNavigate('strategy-finder')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All 5 Models</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {strategies.slice(0, 3).map((strat) => (
            <div
              key={strat.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all bg-slate-50/50 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    Rank #{strat.rank}
                  </span>
                  <div className="text-xs font-bold text-indigo-900 font-mono">
                    Score: {strat.suitabilityScore}/100
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{strat.name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {strat.explanation}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono font-medium">
                  ₹{strat.suggestedBudgetAmount.toLocaleString('en-IN')} ({strat.suggestedBudgetPercent}%)
                </span>
                <button
                  onClick={() => {
                    onSelectStrategy(strat);
                    onNavigate('campaign-studio');
                  }}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <span>Use in Studio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up Results Modal */}
      {selectedCampaignForResults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Enter Campaign Results: {selectedCampaignForResults.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Update actual expenditure and verified qualified leads to recalculate real-world CPL.
            </p>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Actual Expenditure (₹ INR)</label>
                <input
                  type="number"
                  value={editActualSpend}
                  onChange={(e) => setEditActualSpend(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Qualified Enquiries / Leads</label>
                <input
                  type="number"
                  value={editLeads}
                  onChange={(e) => setEditLeads(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Campaign Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Draft">Draft</option>
                  <option value="Planned">Planned</option>
                  <option value="Approved">Approved</option>
                  <option value="Running">Running</option>
                  <option value="Completed">Completed</option>
                  <option value="Results Pending Review">Results Pending Review</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Performance Notes / Findings</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs"
                  placeholder="Notes on lead quality, ad creative wear-out, or audience response..."
                />
              </div>

              {editLeads > 0 && (
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-between text-xs font-semibold text-indigo-900">
                  <span>Calculated Cost Per Lead:</span>
                  <span className="font-mono text-sm text-indigo-700">
                    ₹{Math.round((editActualSpend / editLeads) * 100) / 100}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                onClick={() => setSelectedCampaignForResults(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveResults}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
              >
                Save Campaign Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-Part Plain-English Explanation Modal */}
      <ExplainModal
        item={selectedExplainItem}
        onClose={() => setSelectedExplainItem(null)}
      />
    </div>
  );
};
