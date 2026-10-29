import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  CheckSquare,
  Square,
  HelpCircle,
  Lightbulb,
  TrendingUp,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface GlossaryTerm {
  term: string;
  acronym?: string;
  definition: string;
  formula?: string;
  realWorldExample: string;
  category: 'Metrics' | 'Strategy' | 'Pitfalls';
}

const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Cost Per Qualified Lead',
    acronym: 'CPL',
    definition: 'The advertising spend required to acquire a verified, prospect enquiry with real purchasing interest.',
    formula: 'Total Campaign Expenditure ÷ Number of Qualified Leads',
    realWorldExample: 'In our demo workspace, Search Campaign B spent ₹35,000 for 70 leads = ₹500 CPL.',
    category: 'Metrics',
  },
  {
    term: 'Customer Acquisition Cost',
    acronym: 'CAC',
    definition: 'The total cost of marketing and sales to turn a lead into a paying, revenue-generating customer.',
    formula: 'Total Sales & Marketing Spend ÷ Number of New Customers Acquired',
    realWorldExample: 'If ₹500 CPL converts to paying customers at 20%, the CAC is ₹2,500.',
    category: 'Metrics',
  },
  {
    term: 'Return on Ad Spend',
    acronym: 'ROAS',
    definition: 'The gross revenue generated for every rupee spent on advertising campaigns.',
    formula: 'Total Attributed Revenue ÷ Direct Advertising Spend',
    realWorldExample: '₹3,00,000 revenue generated from ₹1,00,000 ad spend = 3.0x ROAS (or 300%).',
    category: 'Metrics',
  },
  {
    term: 'Click-Through Rate',
    acronym: 'CTR',
    definition: 'The percentage of people who see your advertisement and click through to your landing page.',
    formula: '(Total Clicks ÷ Total Impressions) × 100',
    realWorldExample: 'Social Campaign A achieved 2,000 clicks from ~80,000 impressions = 2.5% CTR.',
    category: 'Metrics',
  },
  {
    term: 'Intent-Based Search vs Interruption Social',
    definition: 'Search ads capture active demand from users actively looking for solutions right now. Social ads interrupt passive users browsing for entertainment.',
    realWorldExample: 'A user typing "buy insulated bottle chennai" has 5x higher purchase intent than someone casually viewing a reel.',
    category: 'Strategy',
  },
  {
    term: 'Creative Fatigue',
    definition: 'The drop in campaign performance when your target audience has seen the exact same ad creative too many times.',
    realWorldExample: 'After 10–14 days, Instagram ad frequency rises above 3.5, causing CPL to double if new creative hooks are not introduced.',
    category: 'Pitfalls',
  },
  {
    term: 'Vanity Metrics vs Commercial Pipeline',
    definition: 'Metrics like video views, page likes, and hearts feel rewarding but do not correlate with bank deposits or qualified leads.',
    realWorldExample: 'A viral video with 500,000 views can yield zero sales if the call-to-action is buried or the audience is outside your shipping radius.',
    category: 'Pitfalls',
  },
];

export const KnowledgeHubPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    'check-1': true,
    'check-2': true,
    'check-3': false,
    'check-4': false,
    'check-5': false,
    'check-6': false,
  });

  const toggleCheck = (id: string) => {
    setChecklist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredGlossary = GLOSSARY_TERMS.filter((g) => {
    const matchesSearch =
      g.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.acronym && g.acronym.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCat === 'All' || g.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
            Marketing Intelligence Library
          </span>
          <span className="text-xs text-slate-500">Formulas, Checklists, & Decision Frameworks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          Knowledge Hub & Explainable AI
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Understand why recommendations work, how metrics are calculated, and how to verify campaign success.
        </p>
      </div>

      {/* Featured Explainable Article */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold uppercase tracking-wider">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Core Marketing Philosophy</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          Why Likes and Views Do Not Equal Qualified Leads
        </h2>
        <div className="text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
          <p>
            One of the most frequent pitfalls for early-stage brands is spending their entire marketing budget on viral video views or Instagram likes, only to receive zero customer enquiries.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1">1. Intent Disconnect</span>
              <p className="text-xs text-slate-300">
                Liking a post is frictionless entertainment; submitting a phone number or email requires active, conscious intent.
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1">2. Post-Click Funnel Leaks</span>
              <p className="text-xs text-slate-300">
                Slow mobile load speeds (&gt;3s) or confusing checkout forms cause 80%+ drop-offs before an enquiry is logged.
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl border border-white/10">
              <span className="font-bold text-white block mb-1">3. Broad Demographic Waste</span>
              <p className="text-xs text-slate-300">
                Algorithmic viral reach exposes content to non-buying regions or age cohorts outside your service footprint.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Launch Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Pre-Flight Campaign Launch Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Essential verification steps before committing real ad budget
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Best Practice
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { id: 'check-1', title: 'Mobile Landing Page Speed (<2.5s)', desc: 'Test mobile load time on Google PageSpeed Insights.' },
            { id: 'check-2', title: 'Conversion Tracking & Pixel Verification', desc: 'Ensure pixel fires only on enquiry thank-you page.' },
            { id: 'check-3', title: 'Clear Value Proposition Above the Fold', desc: 'State exact offer, price, and guarantee before user scrolls.' },
            { id: 'check-4', title: 'WhatsApp / Instant Enquiry Fallback', desc: 'Provide 1-click WhatsApp chat for users who dislike web forms.' },
            { id: 'check-5', title: 'A/B Test 3 Distinct Creative Hooks', desc: 'Never run only one single video or image ad variant.' },
            { id: 'check-6', title: 'Explicit Exclusion Audiences', desc: 'Exclude existing buyers and past 30-day converts from prospecting.' },
          ].map((item) => {
            const isDone = checklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className={`font-bold ${isDone ? 'line-through text-emerald-900' : 'text-slate-900'}`}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Marketing Metrics Glossary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Marketing Intelligence Glossary
            </h3>
            <p className="text-xs text-slate-500">
              Plain-language definitions and exact calculation formulas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search metrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {['All', 'Metrics', 'Strategy', 'Pitfalls'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedCat === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Glossary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-200 transition-colors space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{item.term}</h4>
                  {item.acronym && (
                    <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">
                      {item.acronym}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold">
                  {item.category}
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed">{item.definition}</p>

              {item.formula && (
                <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-indigo-900 font-medium">
                  {item.formula}
                </div>
              )}

              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
                <strong>Benchmark Context:</strong> {item.realWorldExample}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
