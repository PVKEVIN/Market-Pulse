import React, { useState } from 'react';
import { Sparkles, X, FlaskConical, CheckCircle2, AlertTriangle, ArrowRight, Lightbulb, ShieldAlert } from 'lucide-react';
import { CampaignBrief, MarketingExperiment } from '../../types';

interface ExperimentPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  brief: CampaignBrief;
  onUseExperimentInStudio?: (exp: MarketingExperiment) => void;
}

export const ExperimentPlannerModal: React.FC<ExperimentPlannerModalProps> = ({
  isOpen,
  onClose,
  brief,
  onUseExperimentInStudio,
}) => {
  if (!isOpen) return null;

  const testBudget = Math.min(10000, Math.round(brief.budget * 0.1));

  const [experiment, setExperiment] = useState<MarketingExperiment>({
    id: `exp-${Date.now()}`,
    title: `Test 2 Visual Hooks for ${brief.product}`,
    question: `Which opening message hook generates qualified enquiries at the lowest cost per lead?`,
    ideaOrChange: `Run two 15-second Instagram Reel ads with identical budget: Hook A focuses on 24-hour cold temperature retention; Hook B focuses on student campus discount & pastel styling.`,
    targetAudience: `${brief.targetAudience} (${brief.audienceAgeRange}) in ${brief.geography}`,
    plannedBudget: testBudget > 0 ? testBudget : 5000,
    durationDays: 7,
    mainSuccessMetric: `Cost Per Qualified Enquiry (CPL in ₹)`,
    minDataNeeded: `At least 300 link clicks and 15 completed WhatsApp or web form enquiries across both ad sets.`,
    continueCriteria: `If either hook delivers qualified leads under ₹600 CPL, scale that winning hook with 70% of the main budget.`,
    stopCriteria: `If both hooks cost over ₹1,500 CPL after 7 days, pause spending and rewrite the landing page offer before spending more money.`,
    channel: `Paid Social (Instagram & Meta Ads)`,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">
                Feature C: Marketing Experiment Planner
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                Test Before You Spend: 7-Day Low-Risk Pilot
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro */}
        <p className="text-xs text-slate-600 leading-relaxed">
          Instead of committing your entire <strong>₹{brief.budget.toLocaleString('en-IN')}</strong> budget immediately, test your message with a small <strong>₹{experiment.plannedBudget.toLocaleString('en-IN')}</strong> pilot. If the test succeeds, scale it. If it fails, you saved 90% of your money.
        </p>

        {/* Experiment Form Fields */}
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Experiment Name</label>
            <input
              type="text"
              value={experiment.title}
              onChange={(e) => setExperiment({ ...experiment, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Channel to Test</label>
              <input
                type="text"
                value={experiment.channel}
                onChange={(e) => setExperiment({ ...experiment, channel: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Test Budget (INR)</label>
              <input
                type="number"
                value={experiment.plannedBudget}
                onChange={(e) => setExperiment({ ...experiment, plannedBudget: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold text-indigo-700"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Duration</label>
              <input
                type="number"
                value={experiment.durationDays}
                onChange={(e) => setExperiment({ ...experiment, durationDays: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">The Question Being Tested</label>
            <textarea
              rows={2}
              value={experiment.question}
              onChange={(e) => setExperiment({ ...experiment, question: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">The Idea or Change to Test</label>
            <textarea
              rows={2}
              value={experiment.ideaOrChange}
              onChange={(e) => setExperiment({ ...experiment, ideaOrChange: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 leading-relaxed"
            />
          </div>

          {/* Success, Minimum Data, Scale and Stop Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px] uppercase">Main Success Metric:</span>
              <p className="text-slate-700 font-medium">{experiment.mainSuccessMetric}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block text-[11px] uppercase">Minimum Data to Decide:</span>
              <p className="text-slate-700">{experiment.minDataNeeded}</p>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-950 block text-[11px] uppercase">When to Scale (Pass Criteria):</span>
              <p className="text-emerald-900">{experiment.continueCriteria}</p>
            </div>

            <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1">
              <span className="font-bold text-red-950 block text-[11px] uppercase">When to Stop / Change (Fail Criteria):</span>
              <p className="text-red-900">{experiment.stopCriteria}</p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p>
            This experiment plan is a suggested framework to reduce financial risk. It is an educational tool and does not guarantee specific sales or enquiries.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (onUseExperimentInStudio) onUseExperimentInStudio(experiment);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <span>Save Experiment Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
