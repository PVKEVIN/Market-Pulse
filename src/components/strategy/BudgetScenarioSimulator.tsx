import React, { useState } from 'react';
import { Layers, ArrowRight, Check, AlertCircle, Info, ShieldAlert, Sliders } from 'lucide-react';
import { BudgetScenario, CampaignBrief } from '../../types';

interface BudgetScenarioSimulatorProps {
  brief: CampaignBrief;
  onApplyScenario: (allocations: { channel: string; percent: number; amount: number }[]) => void;
}

export const BudgetScenarioSimulator: React.FC<BudgetScenarioSimulatorProps> = ({
  brief,
  onApplyScenario,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan-c');
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  const total = brief.budget || 100000;

  const scenarios: BudgetScenario[] = [
    {
      id: 'plan-a',
      name: 'Plan A: Focused Core Channel',
      planType: 'Single Focus Channel',
      description: 'Invest 80% of your budget in the single highest-intent channel (e.g., Search Ads) and 20% in conversion landing page optimization.',
      allocations: [
        { channel: 'Search Engine Advertising (Google Ads)', percent: 80, amount: Math.round(total * 0.8) },
        { channel: 'Landing Page & Conversion Funnel', percent: 20, amount: Math.round(total * 0.2) },
      ],
      tradeOffs: {
        simplicity: 'Highest (Easiest to manage for a solo founder or small team).',
        reachPotential: 'Moderate (Limited strictly to people searching for keywords).',
        measurementEase: 'Very High (Direct cost per enquiry tracking).',
        executionEffort: 'Low (Only one ad account and one set of search copy).',
        mainRisk: 'Misses passive potential customers who do not yet know the product exists.',
      },
    },
    {
      id: 'plan-b',
      name: 'Plan B: Balanced Dual-Channel',
      planType: 'Split Across Two Channels',
      description: 'Split budget equally between Search (capturing active buyers) and Social Video (introducing the brand to new prospective audiences).',
      allocations: [
        { channel: 'Search Engine Intent Ads', percent: 50, amount: Math.round(total * 0.5) },
        { channel: 'Paid Social & Short-Form Video', percent: 50, amount: Math.round(total * 0.5) },
      ],
      tradeOffs: {
        simplicity: 'Moderate (Requires managing both Google Ads and Meta Ads).',
        reachPotential: 'High (Combines active search intent with algorithmic viral discovery).',
        measurementEase: 'Moderate (Need UTM tags to separate search from social leads).',
        executionEffort: 'Moderate (Requires both video creative assets and search text copy).',
        mainRisk: 'Spreads small budgets thinly across two platforms if budget is under ₹30,000.',
      },
    },
    {
      id: 'plan-c',
      name: 'Plan C: Test & Learn with Reserve',
      planType: 'Test & Learn Reserve',
      description: 'Allocate 60% to your proven channel, 25% to secondary social awareness, and hold 15% strictly in reserve for rapid experimentation.',
      allocations: [
        { channel: 'Primary Proven Channel (Search Intent)', percent: 60, amount: Math.round(total * 0.6) },
        { channel: 'Secondary Channel (Paid Social Reels)', percent: 25, amount: Math.round(total * 0.25) },
        { channel: 'Unallocated Experiment Reserve', percent: 15, amount: Math.round(total * 0.15) },
      ],
      tradeOffs: {
        simplicity: 'High (Protects cash flow; minimizes risk of overspending on unproven ads).',
        reachPotential: 'Balanced (Steady baseline enquiries with room to double down).',
        measurementEase: 'High (Compare the primary channel against the small experimental pilot).',
        executionEffort: 'Disciplined (Run the 15% reserve only when initial metrics look strong).',
        mainRisk: 'Slightly slower initial reach compared to spending 100% upfront.',
      },
    },
  ];

  const activeScenario = scenarios.find((s) => s.id === selectedPlanId) || scenarios[0];

  const handleApply = (scen: BudgetScenario) => {
    onApplyScenario(scen.allocations);
    setAppliedSuccess(`Applied "${scen.name}" allocations to your Strategy Planner!`);
    setTimeout(() => setAppliedSuccess(null), 3500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Scenario Simulator
            </span>
            <span className="text-xs text-slate-500">Feature D: Compare Budget Plans</span>
          </div>
          <h3 className="font-extrabold text-base text-slate-900 mt-1">
            Budget Scenario Simulator (₹{total.toLocaleString('en-IN')})
          </h3>
          <p className="text-xs text-slate-500">
            Compare alternative ways to divide your budget by simplicity, reach, and risk without fabricating unverified sales forecasts.
          </p>
        </div>

        {appliedSuccess && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
            ✓ {appliedSuccess}
          </span>
        )}
      </div>

      {/* Plan Selection Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {scenarios.map((scen) => {
          const isSelected = scen.id === selectedPlanId;
          return (
            <button
              key={scen.id}
              onClick={() => setSelectedPlanId(scen.id)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-indigo-50/60 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-slate-50 hover:bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                  {scen.planType}
                </span>
                {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{scen.name}</h4>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {scen.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detail Card */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
        {/* Allocations breakdown */}
        <div>
          <h5 className="font-bold text-slate-900 mb-2 flex items-center justify-between">
            <span>Proposed Allocation for {activeScenario.name}:</span>
            <span className="text-indigo-700 font-mono">Total: ₹{total.toLocaleString('en-IN')}</span>
          </h5>

          <div className="space-y-2">
            {activeScenario.allocations.map((alloc, idx) => (
              <div key={idx} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span className="font-semibold text-slate-800">{alloc.channel}</span>
                </div>
                <div className="font-mono font-bold text-slate-900">
                  ₹{alloc.amount.toLocaleString('en-IN')}{' '}
                  <span className="text-slate-400 font-normal">({alloc.percent}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trade-Off Comparison Grid (as requested: compare by cost, simplicity, reach, measurement, execution) */}
        <div>
          <h5 className="font-bold text-slate-900 mb-2">Trade-Off Analysis (No Fabricated Forecasts):</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Execution Simplicity</span>
              <p className="font-medium text-slate-800">{activeScenario.tradeOffs.simplicity}</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Reach Potential</span>
              <p className="font-medium text-slate-800">{activeScenario.tradeOffs.reachPotential}</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Measurement Ease</span>
              <p className="font-medium text-slate-800">{activeScenario.tradeOffs.measurementEase}</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Required Effort</span>
              <p className="font-medium text-slate-800">{activeScenario.tradeOffs.executionEffort}</p>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 space-y-0.5 sm:col-span-2">
              <span className="text-[10px] uppercase font-bold text-amber-900">Main Risk to Consider</span>
              <p className="font-medium text-amber-950">{activeScenario.tradeOffs.mainRisk}</p>
            </div>
          </div>
        </div>

        {/* Apply Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Clicking apply will adjust the strategy allocation sliders above.</span>
          </div>
          <button
            onClick={() => handleApply(activeScenario)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span>Apply {activeScenario.name}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
