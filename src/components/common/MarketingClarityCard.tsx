import React from 'react';
import { CheckCircle2, Circle, ArrowRight, ShieldAlert, Sparkles, Info } from 'lucide-react';
import { CampaignBrief, CampaignRecord, ClarityCheckItem, MarketingClaritySummary } from '../../types';

interface MarketingClarityCardProps {
  brief: CampaignBrief;
  campaigns: CampaignRecord[];
  onNavigate: (tab: string) => void;
}

export function computeClarityScore(brief: CampaignBrief, campaigns: CampaignRecord[]): MarketingClaritySummary {
  const hasObjective = !!brief.objective && brief.objective.length > 0;
  const hasAudience = !!brief.targetAudience && brief.targetAudience.trim().length > 3;
  const hasBudget = brief.budget > 0;
  const hasChannel = (brief.preferredChannels && brief.preferredChannels.length > 0) || campaigns.length > 0;
  const hasContentDrafts = campaigns.some((c) => c.contentDrafts && Object.keys(c.contentDrafts).length > 0);
  const hasSuccessMetric = campaigns.some((c) => c.selectedStrategy?.primaryKpi || c.objective === 'Lead Generation');
  const hasMeasurementMethod = campaigns.some((c) => c.actualExpenditure !== null || c.qualifiedLeads !== null);

  const items: ClarityCheckItem[] = [
    {
      id: 'item-obj',
      label: 'Clear Marketing Objective',
      status: hasObjective ? 'complete' : 'incomplete',
      plainAction: hasObjective ? `Focused on: ${brief.objective}` : 'Choose the main result you want (e.g., enquiries, sales, or awareness).',
      category: 'Objective',
    },
    {
      id: 'item-aud',
      label: 'Defined Target Audience',
      status: hasAudience ? 'complete' : 'incomplete',
      plainAction: hasAudience ? `Targeting: ${brief.targetAudience} (${brief.audienceAgeRange})` : 'Tell us who you want to reach with your product.',
      category: 'Audience',
    },
    {
      id: 'item-bud',
      label: 'Campaign Budget Entered',
      status: hasBudget ? 'complete' : 'incomplete',
      plainAction: hasBudget ? `Planned budget: ₹${brief.budget.toLocaleString('en-IN')}` : 'Set how much money you want to spend.',
      category: 'Budget',
    },
    {
      id: 'item-chan',
      label: 'Suitable Channel Shortlisted',
      status: hasChannel ? 'complete' : 'incomplete',
      plainAction: hasChannel ? 'Ranked strategies evaluated in Strategy Finder' : 'Select at least one suitable marketing channel.',
      category: 'Channel',
    },
    {
      id: 'item-content',
      label: 'Platform Content Prepared',
      status: hasContentDrafts ? 'complete' : 'incomplete',
      plainAction: hasContentDrafts ? 'Platform-specific drafts prepared in Campaign Studio' : 'Create your opening message and captions in Campaign Studio.',
      category: 'Content',
    },
    {
      id: 'item-metric',
      label: 'Success Metric Selected',
      status: hasSuccessMetric ? 'complete' : 'incomplete',
      plainAction: hasSuccessMetric ? 'Primary KPI chosen (e.g., Cost Per Qualified Lead)' : 'Decide how you will tell whether the campaign worked.',
      category: 'Metric',
    },
    {
      id: 'item-track',
      label: 'Measurement Method Available',
      status: hasMeasurementMethod ? 'complete' : 'incomplete',
      plainAction: hasMeasurementMethod ? 'Lead tracking or enquiry follow-up recorded' : 'Plan how you will count enquiries, calls, or store visits.',
      category: 'Tracking',
    },
  ];

  const completedCount = items.filter((i) => i.status === 'complete').length;
  const score = Math.round((completedCount / items.length) * 100);

  return {
    score,
    completedCount,
    totalCount: items.length,
    items,
    scoringMethodExplanation:
      'This score is based on whether your marketing plan has the essential building blocks in place: an objective, an audience, a budget, a channel, creative copy, a success metric, and a way to measure results. Each item contributes equally (~14.3 points).',
  };
}

export const MarketingClarityCard: React.FC<MarketingClarityCardProps> = ({
  brief,
  campaigns,
  onNavigate,
}) => {
  const clarity = computeClarityScore(brief, campaigns);
  const incompleteItems = clarity.items.filter((i) => i.status === 'incomplete');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Plan Readiness Check
            </span>
            <span className="text-xs text-slate-500">Feature A</span>
          </div>
          <h3 className="font-extrabold text-base text-slate-900 mt-1">
            Marketing Clarity Score
          </h3>
          <p className="text-xs text-slate-500">
            Shows whether your campaign plan has the key details ready before you spend money.
          </p>
        </div>

        {/* Score Ring */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 px-4 rounded-xl border border-slate-200">
          <div className="text-right">
            <div className="text-2xl font-black text-indigo-900 font-mono">
              {clarity.score}
              <span className="text-xs text-slate-400 font-sans font-normal"> / 100</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              {clarity.completedCount} of {clarity.totalCount} Complete
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
            {clarity.score >= 80 ? '🟢' : clarity.score >= 50 ? '🟡' : '🟠'}
          </div>
        </div>
      </div>

      {/* Explanatory Scoring Note */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
        <p className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          How This Score is Calculated:
        </p>
        <p className="text-[11px] leading-relaxed text-slate-600">
          {clarity.scoringMethodExplanation}
        </p>
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {clarity.items.map((item) => {
          const isDone = item.status === 'complete';
          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200/70 text-emerald-950'
                  : 'bg-amber-50/50 border-amber-200/70 text-amber-950'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 min-w-0">
                <div className="font-bold text-xs truncate">{item.label}</div>
                <div className={`text-[11px] leading-tight ${isDone ? 'text-emerald-800' : 'text-amber-800'}`}>
                  {item.plainAction}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Important Disclaimer as required by Part 2 Feature A */}
      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Important distinction:</strong> A high Clarity Score means your plan is organized and complete—<strong>not</strong> that success is guaranteed. Every campaign should be tested on a small budget first.
        </p>
      </div>

      {/* Quick Action if incomplete */}
      {incompleteItems.length > 0 && (
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-600">
            Next recommended action: <strong>{incompleteItems[0].plainAction}</strong>
          </span>
          <button
            onClick={() => {
              if (incompleteItems[0].category === 'Content') onNavigate('campaign-studio');
              else if (incompleteItems[0].category === 'Channel') onNavigate('strategy-finder');
              else onNavigate('strategy-finder');
            }}
            className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
          >
            <span>Complete this step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
