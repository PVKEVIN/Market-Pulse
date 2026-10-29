import React from 'react';
import { History, Calendar, CheckCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { DecisionHistoryRecord } from '../../types';

interface DecisionHistoryCardProps {
  onNavigate: (tab: string) => void;
}

const DEFAULT_DECISION_HISTORY: DecisionHistoryRecord[] = [
  {
    id: 'dec-1',
    date: '2026-09-15',
    originalObjective: 'Lead Generation',
    recommendedStrategy: 'Paid Social Campaigns (Instagram & Meta)',
    reasonForSelection: 'Large daily active college student population in Chennai.',
    plannedBudget: 40000,
    actualBudget: 40000,
    recordedResults: '40 qualified leads, ₹1,000 cost per lead, 2,000 clicks.',
    whatToChangeNext: 'Lead qualification filter needed on forms; test Search Intent ads to compare lead intent.',
    status: 'Reviewed',
  },
  {
    id: 'dec-2',
    date: '2026-09-20',
    originalObjective: 'Lead Generation',
    recommendedStrategy: 'Search Engine Intent Ads (Google Ads)',
    reasonForSelection: 'Tested whether people actively searching "insulated bottle" convert faster.',
    plannedBudget: 35000,
    actualBudget: 35000,
    recordedResults: '70 qualified leads, ₹500 cost per lead (2x more efficient than Social).',
    whatToChangeNext: 'Double search keyword budget next month and keep brand keywords protected.',
    status: 'Reviewed',
  },
  {
    id: 'dec-3',
    date: '2026-09-28',
    originalObjective: 'Customer Retention',
    recommendedStrategy: 'Email & WhatsApp Lifecycle Nurturing',
    reasonForSelection: 'Re-engage existing workshop leads with limited-time discount.',
    plannedBudget: 10000,
    actualBudget: 10000,
    recordedResults: '20 repeat enquiries, ₹500 cost per lead.',
    whatToChangeNext: 'Set up an automated welcome message for all new website enquiries.',
    status: 'Reviewed',
  },
];

export const DecisionHistoryCard: React.FC<DecisionHistoryCardProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
              Audit Trail
            </span>
            <span className="text-xs text-slate-500">Feature G: Decision History</span>
          </div>
          <h3 className="font-extrabold text-base text-slate-900 mt-1">
            Marketing Decision & Learning History
          </h3>
          <p className="text-xs text-slate-500">
            A simple record of what you planned, why you chose it, what actually happened, and what you improved next.
          </p>
        </div>
      </div>

      {/* Decision Timeline List */}
      <div className="space-y-4">
        {DEFAULT_DECISION_HISTORY.map((dec, idx) => (
          <div
            key={dec.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="font-bold text-slate-900 text-sm">{dec.recommendedStrategy}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  {dec.status}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {dec.date}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Goal & Rationale</span>
                <p className="font-medium text-slate-800 mt-0.5">{dec.reasonForSelection}</p>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Planned vs Actual Spend</span>
                <p className="font-mono font-bold text-slate-900 mt-0.5">
                  ₹{dec.plannedBudget.toLocaleString('en-IN')}{' '}
                  <span className="text-slate-500 font-normal">/ ₹{(dec.actualBudget || 0).toLocaleString('en-IN')}</span>
                </p>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Recorded Results</span>
                <p className="font-medium text-emerald-900 mt-0.5">{dec.recordedResults}</p>
              </div>

              <div className="p-2.5 bg-indigo-50/70 rounded-lg border border-indigo-200">
                <span className="text-indigo-900 block text-[10px] uppercase font-bold">What Was Decided Next</span>
                <p className="font-medium text-indigo-950 mt-0.5">{dec.whatToChangeNext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Honesty note on machine learning claims */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2 leading-relaxed">
        <ShieldAlert className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong>Product honesty notice:</strong> This history records human decisions and observed results. It reflects your business's manual learning process rather than an automated autonomous retraining loop.
        </p>
      </div>
    </div>
  );
};
