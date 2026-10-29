import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  Sparkles,
  Calculator,
  ShieldAlert,
  Info,
  HelpCircle,
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [hypotheticalBudget, setHypotheticalBudget] = useState<number>(1000000); // ₹10 Lakh default
  const feeRatePercent = 1.5; // 1.5%
  const feeCap = 25000; // max cap ₹25,000

  const calculatedFeeUncapped = (hypotheticalBudget * feeRatePercent) / 100;
  const effectiveFee = Math.min(calculatedFeeUncapped, feeCap);
  const isCapped = calculatedFeeUncapped > feeCap;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto py-4 space-y-2">
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 uppercase tracking-wider">
          Transparent Commercial Architecture
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pricing & Intelligence Plans
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          From early-stage bootstrapped founders to high-growth multi-brand operators. Clear distinction between currently implemented capabilities and roadmap features.
        </p>
      </div>

      {/* 3 Tier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Free */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tier 1
              </span>
              <h3 className="text-xl font-bold text-slate-900">Explore</h3>
              <p className="text-xs text-slate-500">For learning marketing fundamentals & planning benchmarks</p>
            </div>

            <div className="pt-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">₹0</span>
              <span className="text-xs text-slate-500 ml-1">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Marketing education articles & guides</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Successful campaign case studies</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Comprehensive marketing metrics glossary</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>General campaign guidance heuristics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Interactive pre-launch checklists</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors">
            Current Tier (Demo Mode)
          </button>
        </div>

        {/* Tier 2: Premium (Featured) */}
        <div className="bg-white rounded-2xl border-2 border-indigo-600 shadow-xl p-6 flex flex-col justify-between space-y-4 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
            Core Recommended
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Tier 2
              </span>
              <h3 className="text-xl font-bold text-slate-900">Plan</h3>
              <p className="text-xs text-slate-500">For founders and small businesses running active ad campaigns</p>
            </div>

            <div className="pt-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">₹2,499</span>
              <span className="text-xs text-slate-500 ml-1">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-700 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><strong>Personalized 5-strategy ranking engine</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Budget-aware allocation planning</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>CSV upload & audience segment validation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Platform content generator (5 channels)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Evidence-backed ranking explanations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Follow-up CPL and lead tracking</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all">
            Fully Implemented in Prototype
          </button>
        </div>

        {/* Tier 3: Pro */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tier 3
              </span>
              <h3 className="text-xl font-bold text-slate-900">Optimize</h3>
              <p className="text-xs text-slate-500">For agencies & growth teams managing multi-client portfolios</p>
            </div>

            <div className="pt-2">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">₹7,999</span>
              <span className="text-xs text-slate-500 ml-1">/ month</span>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Multi-campaign portfolio comparison</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Live automated competitor scrapers <span className="text-[10px] text-amber-600 font-semibold">(Roadmap)</span></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Direct Meta & Google Ads API syncing <span className="text-[10px] text-amber-600 font-semibold">(Roadmap)</span></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Multi-user team permissions & audit logs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Dedicated strategy mentorship hour</span>
              </li>
            </ul>
          </div>

          <button className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors">
            Roadmap Tier
          </button>
        </div>
      </div>

      {/* Interactive Pay-As-You-Go Concept Calculator */}
      <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              Hypothetical Pay-As-You-Go Fee Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Illustrative simulation of a usage-based fee tied to planned ad expenditure (Section 13 Concept)
            </p>
          </div>

          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-indigo-100 text-indigo-800">
            Rate: 1.5% (Max Cap: ₹25,000)
          </span>
        </div>

        {/* Budget Slider */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Planned Advertising Spend:</span>
            <span className="font-mono font-extrabold text-base text-indigo-700">
              ₹{hypotheticalBudget.toLocaleString('en-IN')}
            </span>
          </div>

          <input
            type="range"
            min={25000}
            max={5000000}
            step={25000}
            value={hypotheticalBudget}
            onChange={(e) => setHypotheticalBudget(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>₹25,000 (Small test)</span>
            <span>₹10,00,000 (Medium brand)</span>
            <span>₹50,00,000 (Lico23 Scale)</span>
          </div>
        </div>

        {/* Calculation Result Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Uncapped Fee (1.5%)</span>
            <span className="text-base font-bold text-slate-800 font-mono">
              ₹{calculatedFeeUncapped.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Maximum Fee Cap</span>
            <span className="text-base font-bold text-slate-800 font-mono">₹25,000</span>
          </div>

          <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200">
            <span className="text-indigo-600 block text-[11px] font-semibold">Effective Intelligence Fee</span>
            <span className="text-lg font-extrabold text-indigo-950 font-mono">
              ₹{effectiveFee.toLocaleString('en-IN')}
            </span>
            {isCapped && (
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                (Savings of ₹{(calculatedFeeUncapped - feeCap).toLocaleString('en-IN')} due to cap!)
              </span>
            )}
          </div>
        </div>

        {/* Mandatory Ethical Disclaimer from Section 13 */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Demonstration Simulation Only:</strong> No real payments are processed. This calculator illustrates potential commercial unit economics. Market Pulse will never bill ad spend without transparent, verified billing agreements and explicit user confirmation.
          </p>
        </div>
      </div>
    </div>
  );
};
