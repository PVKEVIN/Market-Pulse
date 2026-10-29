import React, { useState } from 'react';
import {
  Compass,
  ExternalLink,
  Search,
  CheckCircle2,
  HelpCircle,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
  ShieldCheck,
  Check,
  Building,
  Target,
  DollarSign,
  TrendingUp,
  Sliders,
  Filter,
} from 'lucide-react';
import { MarketingToolComparison } from '../types';
import { MARKETING_TOOLS_CATALOG } from '../services/marketingToolsData';
import { INITIAL_COMPETITOR_INSIGHTS } from '../services/storage';

interface KnowYourToolsPageProps {
  onNavigate: (tab: string) => void;
}

export const CompetitorInsightsPage: React.FC<KnowYourToolsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'tools' | 'wizard' | 'workflow' | 'products'>('tools');
  const [selectedToolId, setSelectedToolId] = useState<string>('tool-google-ads');
  const [searchQuery, setSearchQuery] = useState('');

  // Wizard state
  const [wizardExperience, setWizardExperience] = useState('Beginner');
  const [wizardBusinessType, setWizardBusinessType] = useState('Small business');
  const [wizardGoal, setWizardGoal] = useState('Leads');
  const [wizardBudget, setWizardBudget] = useState('Limited');
  const [wizardDifficulty, setWizardDifficulty] = useState('Choosing a strategy');
  const [wizardResult, setWizardResult] = useState<string | null>(null);

  const filteredTools = MARKETING_TOOLS_CATALOG.filter((tool) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.bestFor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeTool = MARKETING_TOOLS_CATALOG.find((t) => t.id === selectedToolId) || MARKETING_TOOLS_CATALOG[0];

  const handleRunWizard = () => {
    let advice = '';
    let recommended = '';

    if (wizardGoal === 'Campaign planning' || wizardDifficulty === 'Choosing a strategy') {
      recommended = 'Market Pulse + Google Ads or Meta Ads';
      advice =
        'Start with Market Pulse to clarify your target audience, set your budget allocation, and draft your opening messages. Once your plan is ready, launch targeted search intent ads in Google Ads or visual reels in Meta Ads Manager.';
    } else if (wizardGoal === 'Leads' && wizardBudget === 'Limited') {
      recommended = 'Market Pulse + Google Local Search & Meta Instant Forms';
      advice =
        'Focus on high-intent Google Search terms (people already looking for your product) combined with Meta click-to-WhatsApp ads. Avoid expensive enterprise suites until your lead flow is steady.';
    } else if (wizardGoal === 'Reporting' || wizardDifficulty === 'Understanding data') {
      recommended = 'Looker Studio + Market Pulse';
      advice =
        'Looker Studio is free and lets you connect your Google Ads and website spreadsheets into one clean visual dashboard. Use Market Pulse to interpret what those numbers mean and what to improve next.';
    } else if (wizardBusinessType === 'Growing company' && wizardDifficulty === 'Managing campaigns') {
      recommended = 'HubSpot Starter + Google Ads';
      advice =
        'As your lead volume grows, HubSpot helps you follow up with automated welcome emails and contact timelines so no prospective customer falls through the cracks.';
    } else {
      recommended = 'Market Pulse (Planning) + Meta Ads Manager (Discovery)';
      advice =
        'Build community awareness with visual short-form video in Meta Ads, supported by Market Pulse to keep your creative hooks and budgets organized.';
    }

    setWizardResult(
      `🎯 **Recommended Starting Setup:** ${recommended}\n\n` +
      `💡 **Why this fits your situation:** ${advice}\n\n` +
      `📌 **Important reminder:** No single tool solves every marketing challenge. Advertising platforms run campaigns, analytics tools display reports, and Market Pulse helps you plan the strategy.`
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-indigo-600" />
              Marketing Tool Landscape
            </span>
            <span className="text-xs text-slate-500">Plain-Language Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 font-heading">
            Know Your Marketing Tools
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Understand what each tool does, when it helps, and which one suits your budget and goals.
          </p>
        </div>

        {/* Top Action */}
        <button
          onClick={() => {
            setActiveTab('wizard');
            handleRunWizard();
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span>Which Tool Should I Choose?</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'tools' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tool Catalog (Google, Meta, HubSpot, Looker, Adobe)
        </button>
        <button
          onClick={() => {
            setActiveTab('wizard');
            if (!wizardResult) handleRunWizard();
          }}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'wizard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Interactive Tool Selector</span>
        </button>
        <button
          onClick={() => setActiveTab('workflow')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'workflow' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          How Market Pulse Fits Alongside Them
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-lg transition-all ${
            activeTab === 'products' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Product Brand Competitors ({INITIAL_COMPETITOR_INSIGHTS.length})
        </button>
      </div>

      {/* TAB 1: Marketing Tools Catalog */}
      {activeTab === 'tools' && (
        <div className="space-y-5">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-600">
              Clear, verified strengths and trade-offs of the most widely used marketing and analytics products.
            </p>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tools (e.g. Google, Meta)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left List of Tools */}
            <div className="space-y-2.5">
              {filteredTools.map((tool) => {
                const isSelected = tool.id === selectedToolId;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedToolId(tool.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        {tool.vendor}
                      </span>
                      {isSelected && <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">Viewing</span>}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm font-heading">{tool.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {tool.whatItIs}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Active Tool Detail Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-7 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
                    {activeTool.vendor}
                  </span>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-heading mt-0.5">
                    {activeTool.name}
                  </h2>
                </div>

                <a
                  href={activeTool.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
                >
                  <span>Official Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* What It Is & Best For */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wide block">
                    What It Is:
                  </span>
                  <p className="text-slate-700">{activeTool.whatItIs}</p>
                </div>

                <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-200/70 space-y-1">
                  <span className="font-bold text-indigo-950 text-xs uppercase tracking-wide block">
                    Best For:
                  </span>
                  <p className="text-indigo-900 font-medium">{activeTool.bestFor}</p>
                </div>
              </div>

              {/* Strengths & Practical Uses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70 space-y-2">
                  <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    What It Does Well:
                  </h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {activeTool.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-indigo-600 shrink-0" />
                    Practical Examples:
                  </h4>
                  <ul className="space-y-1.5 text-slate-700">
                    {activeTool.practicalUses.map((use, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* What to Consider */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-2 text-xs">
                <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0" />
                  What to Consider (Learning Effort & Budget):
                </h4>
                <ul className="space-y-1.5 text-amber-900">
                  {activeTool.considerations.map((con, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* How Market Pulse Fits Alongside */}
              <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl space-y-2 text-xs leading-relaxed">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  How Market Pulse Fits Alongside It
                </span>
                <p className="text-slate-200">{activeTool.howMarketPulseFits}</p>
              </div>

              {/* Pricing & Last Checked Footer */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <span>
                  <strong>Pricing Model:</strong> {activeTool.pricingSummary}
                </span>
                <span className="font-mono">Audited: {activeTool.lastChecked}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: "Which Tool Should I Choose?" Helper Wizard */}
      {activeTab === 'wizard' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Interactive Marketing Helper
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              Which Tool Should I Choose?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Answer 5 simple questions about your business to get a plain-language recommendation on which tools to explore and why.
            </p>
          </div>

          {/* 5 Questions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* 1. Experience */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-900 block">1. My Marketing Experience</label>
              <div className="space-y-1.5">
                {['Beginner', 'Some experience', 'Experienced'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setWizardExperience(opt)}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      wizardExperience === opt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Business Type */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-900 block">2. My Business Type</label>
              <div className="space-y-1.5">
                {['Solo business', 'Small business', 'Growing company', 'Large organization'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setWizardBusinessType(opt)}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      wizardBusinessType === opt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Main Goal */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-900 block">3. My Main Goal</label>
              <div className="space-y-1.5">
                {['Awareness', 'Leads', 'Sales', 'Reporting', 'Campaign planning'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setWizardGoal(opt)}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      wizardGoal === opt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Budget Comfort */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <label className="font-bold text-slate-900 block">4. Budget Comfort</label>
              <div className="space-y-1.5">
                {['Limited (<₹25k)', 'Moderate (₹25k–₹1 Lakh)', 'Flexible (>₹1 Lakh)'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setWizardBudget(opt.split(' ')[0])}
                    className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      wizardBudget === opt.split(' ')[0]
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Biggest Difficulty */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 sm:col-span-2">
              <label className="font-bold text-slate-900 block">5. My Biggest Difficulty</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {['Choosing a strategy', 'Creating content', 'Understanding data', 'Managing campaigns'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setWizardDifficulty(opt)}
                    className={`text-left px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      wizardDifficulty === opt
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleRunWizard}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>Update Tool Recommendation</span>
            </button>
          </div>

          {/* Wizard Result Box */}
          {wizardResult && (
            <div className="p-6 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3 text-xs sm:text-sm leading-relaxed text-indigo-950 animate-in fade-in duration-150">
              <div className="whitespace-pre-wrap font-sans leading-relaxed">{wizardResult}</div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => onNavigate('strategy-finder')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  Start Strategy Planning in Market Pulse
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Workflow "Market Pulse vs Other Tools" */}
      {activeTab === 'workflow' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Cooperative Product Philosophy
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 font-heading">
              How Market Pulse Works Alongside Other Tools
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Market Pulse does not try to replace Google Ads or Meta Ads Manager. Instead, it provides the missing thinking and planning step before you run ads.
            </p>
          </div>

          {/* Workflow Steps Card */}
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">The 6-Step Decision Journey:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs space-y-1">
                <span className="font-bold block text-[11px] uppercase tracking-wide">Step 1: Market Pulse</span>
                <p className="text-[11px] text-indigo-100">Describe your product, budget, and goal in plain English.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">Step 2: Strategy</span>
                <p className="text-[11px] text-slate-600">Rank the 5 best channels with transparent scoring reasons.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">Step 3: Content</span>
                <p className="text-[11px] text-slate-600">Draft platform-specific hooks and captions in Campaign Studio.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">Step 4: Execute</span>
                <p className="text-[11px] text-slate-600">Paste your approved copy into Google Ads or Meta Ads Manager.</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">Step 5: Record</span>
                <p className="text-[11px] text-slate-600">Log actual spend and verified leads in the Overview dashboard.</p>
              </div>

              <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs space-y-1">
                <span className="font-bold block text-[11px] uppercase tracking-wide">Step 6: Improve</span>
                <p className="text-[11px] text-emerald-100">Review CPL efficiency and shift future budgets to what worked.</p>
              </div>
            </div>
          </div>

          {/* Transparent Comparison Table */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Role Comparison by Stage:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700 text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Stage in Journey</th>
                    <th className="py-2.5 px-3">Market Pulse</th>
                    <th className="py-2.5 px-3">Advertising Platforms (Google/Meta)</th>
                    <th className="py-2.5 px-3">Analytics & CRM (Looker/HubSpot)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-900">1. Budget & Channel Strategy</td>
                    <td className="py-3 px-3 font-semibold text-indigo-700 bg-indigo-50/50">Primary Focus (Transparent 5-Channel Ranking)</td>
                    <td className="py-3 px-3 text-slate-600">Executes bidding on its own network only</td>
                    <td className="py-3 px-3 text-slate-600">Reports historical records</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-900">2. Copywriting & Hooks</td>
                    <td className="py-3 px-3 font-semibold text-indigo-700 bg-indigo-50/50">Generates 5 platform drafts with tone control</td>
                    <td className="py-3 px-3 text-slate-600">Requires you to enter your own copy</td>
                    <td className="py-3 px-3 text-slate-600">Sends email templates</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-900">3. Running Ad Campaigns</td>
                    <td className="py-3 px-3 text-slate-500">Assisted manual links (No direct billing)</td>
                    <td className="py-3 px-3 font-semibold text-emerald-700 bg-emerald-50/50">Direct Execution & Auction Bidding</td>
                    <td className="py-3 px-3 text-slate-500">Not supported</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-bold text-slate-900">4. Reporting & Deep Dashboards</td>
                    <td className="py-3 px-3 text-slate-600">CPL and lead tracking overview</td>
                    <td className="py-3 px-3 text-slate-600">Ad performance tables</td>
                    <td className="py-3 px-3 font-semibold text-emerald-700 bg-emerald-50/50">Enterprise BI & Multi-touch CRM Dashboards</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Product Brand Competitors (Preserving the existing niche competitor cards) */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Product Competitor Positioning Audits
              </h3>
              <p className="text-xs text-slate-500">
                Publicly observed advertising hooks, visible offers, and differentiation opportunities for your product niche.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {INITIAL_COMPETITOR_INSIGHTS.length} Brands Monitored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_COMPETITOR_INSIGHTS.map((comp) => (
              <div key={comp.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 font-mono">
                      {comp.companyType}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{comp.competitorName}</h4>
                    <span className="text-[11px] text-slate-400">{comp.productCategory}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    {comp.nemesisType}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Observed Public Ad Message:</span>
                  <p className="font-semibold text-slate-800 italic mt-0.5">"{comp.message}"</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-red-50/60 rounded-lg border border-red-200 text-red-950">
                    <span className="font-bold block text-[10px] uppercase">Weakness / Gap:</span>
                    <p className="line-clamp-2">{comp.vulnerabilityWeakness}</p>
                  </div>
                  <div className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-200 text-emerald-950">
                    <span className="font-bold block text-[10px] uppercase">Counter-Offensive Angle:</span>
                    <p className="line-clamp-2">{comp.counterAttackAngle}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Pricing: {comp.pricingTier}</span>
                  <a
                    href={comp.publicSourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                  >
                    <span>Audit Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
