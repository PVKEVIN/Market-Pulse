import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle2, Target, DollarSign, Users, Sparkles } from 'lucide-react';
import { ActionableRecommendation, CampaignBrief, CampaignRecord } from '../../types';

interface WhatShouldIDoNextProps {
  brief: CampaignBrief;
  campaigns: CampaignRecord[];
  onNavigate: (tab: string) => void;
  onOpenResultsModal?: (camp: CampaignRecord) => void;
}

export const WhatShouldIDoNext: React.FC<WhatShouldIDoNextProps> = ({
  brief,
  campaigns,
  onNavigate,
  onOpenResultsModal,
}) => {
  // Build actionable recommendations based on actual workspace state
  const recommendations: ActionableRecommendation[] = [];

  // Check 1: Search vs Social CPL efficiency
  const searchCamp = campaigns.find((c) => c.channels.some((ch) => ch.toLowerCase().includes('search')));
  const socialCamp = campaigns.find((c) => c.channels.some((ch) => ch.toLowerCase().includes('social')));

  if (searchCamp && socialCamp && searchCamp.calculatedCpl && socialCamp.calculatedCpl) {
    if (searchCamp.calculatedCpl < socialCamp.calculatedCpl) {
      recommendations.push({
        id: 'rec-cpl-shift',
        title: 'Shift Budget Toward High-Intent Search Ads',
        whatNeedsAttention: `Search Campaign B produced leads at ₹${searchCamp.calculatedCpl} CPL compared to ₹${socialCamp.calculatedCpl} CPL on Social.`,
        whyItMatters: 'Search reaches people who are actively looking for water bottles right now, while social reaches casual scrollers.',
        simpleNextStep: 'Shift ₹10,000 to ₹15,000 from top-funnel social into search intent to lower your overall cost per lead.',
        linkTab: 'strategy-finder',
        badge: 'Cost Efficiency',
        isDemo: true,
      });
    }
  }

  // Check 2: Content drafts preparation
  const hasDrafts = campaigns.some((c) => c.contentDrafts && Object.keys(c.contentDrafts).length > 0);
  if (!hasDrafts) {
    recommendations.push({
      id: 'rec-prepare-content',
      title: 'Prepare Your Platform Marketing Drafts',
      whatNeedsAttention: 'You have a planned budget and target audience, but no marketing copy is drafted yet.',
      whyItMatters: 'Having clear, platform-specific hooks and captions prepared in advance keeps your messaging consistent.',
      simpleNextStep: 'Visit Campaign Studio to generate tailored drafts for Instagram, YouTube, and X.',
      linkTab: 'campaign-studio',
      badge: 'Creative Ready',
      isDemo: false,
    });
  }

  // Check 3: Audience specificity
  if (brief.targetAudience.toLowerCase().includes('everyone') || brief.targetAudience.toLowerCase().includes('general')) {
    recommendations.push({
      id: 'rec-narrow-audience',
      title: 'Define a More Specific Customer Group',
      whatNeedsAttention: `Your target audience is set broadly as "${brief.targetAudience}".`,
      whyItMatters: 'Broad audiences make ads more expensive because you show them to people who may never need your product.',
      simpleNextStep: 'Narrow your focus to a specific group, such as "college students and young professionals in Chennai".',
      linkTab: 'strategy-finder',
      badge: 'Audience Focus',
      isDemo: false,
    });
  }

  // Check 4: Unallocated reserve check
  const totalSpent = campaigns.reduce((acc, c) => acc + (c.actualExpenditure || 0), 0);
  const unallocated = brief.budget - totalSpent;
  if (unallocated > 0) {
    recommendations.push({
      id: 'rec-unallocated-test',
      title: 'Run a Small Test with Your ₹' + unallocated.toLocaleString('en-IN') + ' Reserve',
      whatNeedsAttention: `You have ₹${unallocated.toLocaleString('en-IN')} in reserve that has not been committed yet.`,
      whyItMatters: 'Reserve funds are ideal for testing a new channel (like micro-creators or local geo-ads) before spending large amounts.',
      simpleNextStep: 'Open the Experiment Planner in Strategy Finder to set up a 7-day test.',
      linkTab: 'strategy-finder',
      badge: 'Budget Reserve',
      isDemo: true,
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Action Center
            </span>
            <span className="text-xs text-slate-500">Feature B: What Should I Do Next?</span>
          </div>
          <h3 className="font-extrabold text-base text-slate-900 mt-1">
            Personalized Next Steps for Your Business
          </h3>
          <p className="text-xs text-slate-500">
            Clear, prioritized actions based on your current budget, audience, and campaign results.
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500 hidden sm:inline">
          {recommendations.length} Action{recommendations.length === 1 ? '' : 's'} Ready
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50/50 hover:bg-white transition-all space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                <h4 className="font-bold text-slate-900 text-sm">{rec.title}</h4>
                {rec.isDemo && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    Demo Insight
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 shrink-0">
                {rec.badge}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                <span className="font-bold text-slate-900 block text-[11px] mb-0.5">What needs attention:</span>
                <p className="leading-relaxed">{rec.whatNeedsAttention}</p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200/80">
                <span className="font-bold text-slate-900 block text-[11px] mb-0.5">Why it matters:</span>
                <p className="leading-relaxed">{rec.whyItMatters}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <div className="text-slate-800 font-medium">
                👉 <strong>Simple Next Step:</strong> {rec.simpleNextStep}
              </div>
              <button
                onClick={() => onNavigate(rec.linkTab)}
                className="shrink-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 ml-3 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <span>Take Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
