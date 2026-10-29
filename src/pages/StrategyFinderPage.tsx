import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Layers,
  Sliders,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  Search,
  Share2,
  PlayCircle,
  Users,
  Mail,
  MapPin,
  Zap,
  FileText,
  Bookmark,
  Check,
  Database,
  FlaskConical,
  Shield,
  Clock,
} from 'lucide-react';
import { CampaignBrief, RankedStrategy, ScoringFactors, ExplainThisItem } from '../types';
import { calculateStrategyRankings, DEFAULT_WEIGHTS, RankingWeights } from '../services/rankingEngine';
import { saveBrief, saveStrategies, saveCampaigns, getSavedCampaigns } from '../services/storage';
import { BudgetScenarioSimulator } from '../components/strategy/BudgetScenarioSimulator';
import { ExperimentPlannerModal } from '../components/strategy/ExperimentPlannerModal';
import { ExplainModal } from '../components/common/ExplainModal';
import { EXPLANATIONS } from '../services/explanationDictionary';
import { DualInputRequirements } from '../components/strategy/DualInputRequirements';

interface StrategyFinderPageProps {
  brief: CampaignBrief;
  onUpdateBrief: (brief: CampaignBrief) => void;
  strategies: RankedStrategy[];
  onUpdateStrategies: (strategies: RankedStrategy[]) => void;
  onSelectStrategyForStudio: (strat: RankedStrategy) => void;
  onNavigate: (tab: string) => void;
}

const SAMPLE_PROMPT_PHONE =
  'I need to market my new phone model Lico23 to youngsters aged 19–20 in India. My total budget is ₹50 lakh. I want to build awareness and generate product enquiries over the next 30 days. Recommend suitable marketing channels, rank the best options, and explain how I should allocate my budget.';

const SAMPLE_PROMPT_FESTIVE =
  'I run a small clothing store and have ₹25,000 to promote a festive collection. I want more store visits and online enquiries from young adults in Chennai.';

export const StrategyFinderPage: React.FC<StrategyFinderPageProps> = ({
  brief,
  onUpdateBrief,
  strategies,
  onUpdateStrategies,
  onSelectStrategyForStudio,
  onNavigate,
}) => {
  const [promptText, setPromptText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionSource, setExtractionSource] = useState<string | null>(null);
  const [showWeightsConfig, setShowWeightsConfig] = useState(false);
  const [weights, setWeights] = useState<RankingWeights>(DEFAULT_WEIGHTS);
  const [expandedStrategyId, setExpandedStrategyId] = useState<string | null>(strategies[0]?.id || null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);
  const [isExperimentModalOpen, setIsExperimentModalOpen] = useState(false);
  const [selectedStrategyForExperiment, setSelectedStrategyForExperiment] = useState<RankedStrategy | null>(null);
  const [selectedExplainItem, setSelectedExplainItem] = useState<ExplainThisItem | null>(null);

  // Editable brief fields
  const [editableBrief, setEditableBrief] = useState<CampaignBrief>(brief);
  const [isEditingBrief, setIsEditingBrief] = useState(false);

  // Budget allocations state (keyed by strategy ID)
  const [budgetAllocations, setBudgetAllocations] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    strategies.forEach((s) => {
      initial[s.id] = s.suggestedBudgetAmount;
    });
    return initial;
  });

  const totalAllocatedBudget = Object.values(budgetAllocations).reduce((a, b) => a + (b || 0), 0);
  const unallocatedBudget = editableBrief.budget - totalAllocatedBudget;

  // Handle Dual-Input Generation (Mode A: Prompt or Mode B: Guided Form)
  const handleDualInputGenerate = async (targetBrief: CampaignBrief, source: 'prompt' | 'guided') => {
    setIsExtracting(true);
    setExtractionSource(source === 'prompt' ? 'Natural Language Prompt' : 'Guided Requirements Form');

    try {
      let finalBrief = { ...targetBrief };

      if (source === 'prompt' && promptText.trim()) {
        const res = await fetch('/api/gemini/extract-brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptText }),
        });

        const data = await res.json();
        if (data && data.brief) {
          finalBrief = {
            ...targetBrief,
            ...data.brief,
            budget: Number(data.brief.budget) || targetBrief.budget || 100000,
            campaignDurationDays: Number(data.brief.campaignDurationDays) || targetBrief.campaignDurationDays || 30,
          };
        }
      }

      setEditableBrief(finalBrief);
      onUpdateBrief(finalBrief);
      saveBrief(finalBrief);

      // Recalculate deterministic rankings
      const ranked = calculateStrategyRankings(finalBrief, weights);
      onUpdateStrategies(ranked);
      saveStrategies(ranked);

      // Update allocations
      const newAlloc: Record<string, number> = {};
      ranked.forEach((s) => {
        newAlloc[s.id] = s.suggestedBudgetAmount;
      });
      setBudgetAllocations(newAlloc);
      setExpandedStrategyId(ranked[0]?.id || null);

      setSavedSuccessMsg(`Successfully ranked 5 marketing strategies for ${finalBrief.product || 'your product'}!`);
      setTimeout(() => setSavedSuccessMsg(null), 4500);
    } catch (err) {
      console.error('Failed to generate strategy:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  // Re-run rankings whenever brief is updated manually
  const handleUpdateBriefField = (field: keyof CampaignBrief, value: any) => {
    const updated = { ...editableBrief, [field]: value };
    setEditableBrief(updated);
    onUpdateBrief(updated);
    saveBrief(updated);

    const ranked = calculateStrategyRankings(updated, weights);
    onUpdateStrategies(ranked);
    saveStrategies(ranked);

    const newAlloc: Record<string, number> = {};
    ranked.forEach((s) => {
      newAlloc[s.id] = s.suggestedBudgetAmount;
    });
    setBudgetAllocations(newAlloc);
  };

  // Handle allocation slider change
  const handleAllocationChange = (stratId: string, newAmount: number) => {
    const sanitized = Math.max(0, Math.round(newAmount));
    setBudgetAllocations((prev) => ({
      ...prev,
      [stratId]: sanitized,
    }));
  };

  // Save current strategy to Overview campaign history
  const handleSaveStrategyToCampaigns = (strat: RankedStrategy) => {
    const currentCamps = getSavedCampaigns();
    const allocated = budgetAllocations[strat.id] || strat.suggestedBudgetAmount;

    const newCamp = {
      id: `camp-${Date.now()}`,
      name: `${strat.name} Plan`,
      product: editableBrief.product,
      objective: editableBrief.objective,
      createdAt: new Date().toISOString().split('T')[0],
      plannedBudget: allocated,
      actualExpenditure: null,
      qualifiedLeads: null,
      calculatedCpl: null,
      conversions: null,
      revenue: null,
      roas: null,
      channels: [strat.channelType],
      status: 'Planned' as const,
      selectedStrategy: strat,
      isSynthetic: false,
      notes: `Planned via Strategy Finder with suitability score ${strat.suitabilityScore}/100. Target: ${editableBrief.targetAudience} (${editableBrief.geography}).`,
    };

    const updated = [newCamp, ...currentCamps];
    saveCampaigns(updated);
    setSavedSuccessMsg(`"${strat.name}" saved to your Overview campaign plans!`);
    setTimeout(() => setSavedSuccessMsg(null), 4000);
  };

  const getChannelIcon = (name: string) => {
    switch (name) {
      case 'Search':
        return <Search className="w-5 h-5" />;
      case 'Share2':
        return <Share2 className="w-5 h-5" />;
      case 'PlayCircle':
        return <PlayCircle className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Mail':
        return <Mail className="w-5 h-5" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              Deterministic Intelligence Engine
            </span>
            <span className="text-xs text-slate-500">Every recommendation has a reason</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            AI Strategy Finder
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Describe your marketing goals in plain language. Market Pulse analyzes requirements and ranks the 5 best campaign strategies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* 7-Day Experiment Quick Launch */}
          <button
            onClick={() => {
              setSelectedStrategyForExperiment(strategies[0] || null);
              setIsExperimentModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 shadow-xs transition-colors"
          >
            <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
            <span>Plan 7-Day Experiment</span>
          </button>

          {/* Weights Configuration Toggle */}
          <button
            onClick={() => setShowWeightsConfig(!showWeightsConfig)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Scoring Formula</span>
          </button>
        </div>
      </div>

      {/* Scoring Weights Modal/Accordion */}
      {showWeightsConfig && (
        <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-700" />
              <h4 className="font-bold text-xs sm:text-sm text-indigo-950">
                Transparent Scoring Engine Formula (0–100 Scale)
              </h4>
            </div>
            <span className="text-[11px] text-indigo-700 font-mono">
              Score = 0.30×Audience + 0.25×Objective + 0.20×Budget + 0.15×Evidence + 0.10×Feasibility
            </span>
          </div>
          <p className="text-xs text-indigo-900 leading-relaxed">
            These weights represent initial product assumptions documented in Section 7. Identical inputs always produce identical baseline rankings. Scores represent strategic suitability for your constraints, <em>not a guaranteed probability of sales</em>.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded-lg border border-indigo-100">
              <span className="font-bold text-slate-900 block">30%</span>
              <span className="text-slate-500 text-[11px]">Audience Fit</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-indigo-100">
              <span className="font-bold text-slate-900 block">25%</span>
              <span className="text-slate-500 text-[11px]">Objective Fit</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-indigo-100">
              <span className="font-bold text-slate-900 block">20%</span>
              <span className="text-slate-500 text-[11px]">Budget Fit</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-indigo-100">
              <span className="font-bold text-slate-900 block">15%</span>
              <span className="text-slate-500 text-[11px]">Evidence Strength</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-indigo-100">
              <span className="font-bold text-slate-900 block">10%</span>
              <span className="text-slate-500 text-[11px]">Execution Feasibility</span>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {savedSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {savedSuccessMsg}
          </span>
          <button
            onClick={() => onNavigate('overview')}
            className="underline text-emerald-900 hover:text-emerald-950 font-bold"
          >
            Go to Overview
          </button>
        </div>
      )}

      {/* Dual-Input Marketing Requirements Engine (Mode A: Write a Prompt, Mode B: Guided Form) */}
      <DualInputRequirements
        brief={editableBrief}
        onUpdateBrief={(updated) => {
          setEditableBrief(updated);
          onUpdateBrief(updated);
          saveBrief(updated);
        }}
        onGenerateStrategies={handleDualInputGenerate}
        isGenerating={isExtracting}
      />

      {/* Extracted Structured Requirements (Editable) */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Extracted Campaign Parameters</h3>
            {extractionSource && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                Source: {extractionSource}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsEditingBrief(!isEditingBrief)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            {isEditingBrief ? 'Done Adjusting' : 'Edit Parameters'}
          </button>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {/* Business / Product */}
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Product</span>
            {isEditingBrief ? (
              <input
                type="text"
                value={editableBrief.product}
                onChange={(e) => handleUpdateBriefField('product', e.target.value)}
                className="w-full font-semibold text-slate-900 border-b border-indigo-500 focus:outline-none"
              />
            ) : (
              <span className="font-semibold text-slate-900 truncate block">
                {editableBrief.product}
              </span>
            )}
          </div>

          {/* Objective */}
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Objective</span>
            {isEditingBrief ? (
              <select
                value={editableBrief.objective}
                onChange={(e) => handleUpdateBriefField('objective', e.target.value)}
                className="w-full font-semibold text-slate-900 focus:outline-none"
              >
                <option value="Lead Generation">Lead Generation</option>
                <option value="Brand Awareness">Brand Awareness</option>
                <option value="Online Sales">Online Sales</option>
                <option value="Store Visits">Store Visits</option>
                <option value="Product Launch">Product Launch</option>
                <option value="Customer Retention">Customer Retention</option>
              </select>
            ) : (
              <span className="font-semibold text-slate-900 block truncate">
                {editableBrief.objective}
              </span>
            )}
          </div>

          {/* Target Audience */}
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Audience ({editableBrief.audienceAgeRange})</span>
            {isEditingBrief ? (
              <input
                type="text"
                value={editableBrief.targetAudience}
                onChange={(e) => handleUpdateBriefField('targetAudience', e.target.value)}
                className="w-full font-semibold text-slate-900 border-b border-indigo-500 focus:outline-none"
              />
            ) : (
              <span className="font-semibold text-slate-900 truncate block">
                {editableBrief.targetAudience}
              </span>
            )}
          </div>

          {/* Geography */}
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Geography</span>
            {isEditingBrief ? (
              <input
                type="text"
                value={editableBrief.geography}
                onChange={(e) => handleUpdateBriefField('geography', e.target.value)}
                className="w-full font-semibold text-slate-900 border-b border-indigo-500 focus:outline-none"
              />
            ) : (
              <span className="font-semibold text-slate-900 truncate block">
                {editableBrief.geography}
              </span>
            )}
          </div>

          {/* Total Budget */}
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Total Budget (INR)</span>
            {isEditingBrief ? (
              <input
                type="number"
                value={editableBrief.budget}
                onChange={(e) => handleUpdateBriefField('budget', Number(e.target.value))}
                className="w-full font-mono font-bold text-indigo-700 border-b border-indigo-500 focus:outline-none"
              />
            ) : (
              <span className="font-mono font-bold text-indigo-700 block truncate">
                ₹{editableBrief.budget.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Duration */}
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Duration</span>
            {isEditingBrief ? (
              <input
                type="number"
                value={editableBrief.campaignDurationDays}
                onChange={(e) => handleUpdateBriefField('campaignDurationDays', Number(e.target.value))}
                className="w-full font-semibold text-slate-900 border-b border-indigo-500 focus:outline-none"
              />
            ) : (
              <span className="font-semibold text-slate-900 block truncate">
                {editableBrief.campaignDurationDays} Days
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 5 Ranked Strategy Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Top 5 Ranked Marketing Strategies
            </h2>
            <p className="text-xs text-slate-500">
              Sorted in descending rank order based on objective, audience fit, budget scale, and historical benchmarks
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            5 Candidates Evaluated
          </span>
        </div>

        {/* Suitability Score Meaning & Integrity Note (Section 9) */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-950">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>How to read Suitability Scores:</strong> A score of 80–100 represents strong strategic alignment with your marketing objective, target audience, and budget constraints. <em>Suitability is not a guaranteed probability of sales or promised revenue.</em> Always start with a 7-day small experiment before deploying full capital.
          </div>
        </div>

        <div className="space-y-3">
          {strategies.map((strat) => {
            const isRankOne = strat.rank === 1;
            const isExpanded = expandedStrategyId === strat.id;
            const currentAlloc = budgetAllocations[strat.id] || strat.suggestedBudgetAmount;

            return (
              <div
                key={strat.id}
                className={`rounded-2xl transition-all border ${
                  isRankOne
                    ? 'bg-white border-indigo-300 ring-2 ring-indigo-500/10 shadow-md'
                    : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Strategy Header Card */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      {/* Rank Indicator */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                          isRankOne
                            ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        #{strat.rank}
                      </div>

                      {/* Title & Channel */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                            {strat.name}
                          </h3>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {strat.channelType}
                          </span>
                          {isRankOne && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Highest Strategic Fit
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {strat.explanation}
                        </p>

                        {strat.datasetValidationNote && (
                          <div className="mt-2 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between gap-2">
                            <span className="flex items-center gap-1.5 truncate">
                              <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <strong className="shrink-0">45k Dataset Evidence:</strong>
                              <span className="truncate">{strat.datasetValidationNote}</span>
                            </span>
                            {strat.factors.datasetEmpiricalFit && (
                              <span className="font-mono font-bold text-emerald-700 shrink-0 text-[10px] bg-emerald-100/70 px-1.5 py-0.5 rounded">
                                Fit: {strat.factors.datasetEmpiricalFit}/100
                              </span>
                            )}
                          </div>
                        )}

                        {/* Evidence Confidence Level Badge */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          {strat.rank === 1 ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Strong Evidence
                            </span>
                          ) : strat.rank === 2 ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Some Evidence
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              Limited Evidence
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500">
                            {strat.rank === 1
                              ? 'Verified historical enquiries at ₹500 CPL in workspace'
                              : strat.rank === 2
                              ? 'Supported by 45,000-user youth platform benchmark'
                              : 'Rule-based heuristic; test with small budget first'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedExplainItem(EXPLANATIONS['evidence-confidence'])}
                            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold underline"
                          >
                            Explain
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Suitability Score Badge */}
                    <div className="flex items-center sm:flex-col items-end shrink-0 pl-13 sm:pl-0">
                      <div className="text-right">
                        <span className="text-2xl font-black text-indigo-950 font-mono">
                          {strat.suitabilityScore}
                        </span>
                        <span className="text-xs text-slate-400">/100</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedExplainItem(EXPLANATIONS['suitability-score'])}
                        className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide flex items-center gap-0.5 mt-0.5 group"
                      >
                        <span>Suitability Score</span>
                        <HelpCircle className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600" />
                      </button>
                    </div>
                  </div>

                  {/* Factor Scoring Breakdown Bars (Always Visible for Transparency) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Audience (30%)</span>
                        <span className="font-semibold text-slate-800">{strat.factors.audienceFit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${strat.factors.audienceFit}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Objective (25%)</span>
                        <span className="font-semibold text-slate-800">{strat.factors.objectiveFit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-600 rounded-full"
                          style={{ width: `${strat.factors.objectiveFit}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Budget (20%)</span>
                        <span className="font-semibold text-slate-800">{strat.factors.budgetFit}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${strat.factors.budgetFit}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Evidence (15%)</span>
                        <span className="font-semibold text-slate-800">{strat.factors.evidenceStrength}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${strat.factors.evidenceStrength}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-500">Feasibility (10%)</span>
                        <span className="font-semibold text-slate-800">{strat.factors.executionFeasibility}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-600 rounded-full"
                          style={{ width: `${strat.factors.executionFeasibility}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions & Allocation Quick Row */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="font-mono font-semibold text-slate-900">
                        Allocated:{' '}
                        <span className="text-indigo-700">₹{currentAlloc.toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-500">
                        Duration: <strong>{strat.recommendedDurationDays}d</strong>
                      </span>
                      <span className="text-slate-400">|</span>
                      <span className="text-slate-500">
                        KPI: <strong>{strat.primaryKpi}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedStrategyId(isExpanded ? null : strat.id)}
                        className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1 font-medium"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleSaveStrategyToCampaigns(strat)}
                        className="px-3 py-1.5 rounded-lg text-indigo-700 hover:bg-indigo-50 border border-indigo-200 transition-colors flex items-center gap-1 font-medium"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedStrategyForExperiment(strat);
                          setIsExperimentModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors flex items-center gap-1 font-semibold text-xs"
                        title="Set up a 7-day low-risk trial test"
                      >
                        <FlaskConical className="w-3.5 h-3.5 text-emerald-600" />
                        <span>7-Day Test</span>
                      </button>

                      <button
                        onClick={() => {
                          onSelectStrategyForStudio(strat);
                          onNavigate('campaign-studio');
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold transition-all shadow-xs flex items-center gap-1.5"
                      >
                        <span>Use In Campaign Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Deep-Dive Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200 rounded-b-2xl space-y-4 text-xs">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Creative & Test */}
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 block">Recommended Creative Format:</span>
                          <p className="text-slate-600 leading-relaxed">{strat.creativeFormat}</p>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                          <span className="font-bold text-slate-900 block">Suggested Initial Test (Proof of Concept):</span>
                          <p className="text-slate-600 leading-relaxed">{strat.suggestedInitialTest}</p>
                        </div>
                      </div>

                      {/* Right: Assumptions & Risks */}
                      <div className="space-y-3">
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                          <span className="font-bold text-slate-900 block">Key Strategic Assumptions:</span>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                            {strat.keyAssumptions.map((assump, i) => (
                              <li key={i}>{assump}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 space-y-1.5">
                          <span className="font-bold text-amber-950 block">Limitations and Risks:</span>
                          <ul className="list-disc list-inside text-amber-900 space-y-0.5">
                            {strat.limitationsAndRisks.map((risk, i) => (
                              <li key={i}>{risk}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Budget Allocation Scenarios Comparison Simulator */}
      <BudgetScenarioSimulator
        brief={editableBrief}
        onApplyScenario={(scenarioAllocs) => {
          const newAllocs: Record<string, number> = {};
          strategies.forEach((strat, idx) => {
            if (scenarioAllocs[idx]) {
              newAllocs[strat.id] = scenarioAllocs[idx].amount;
            } else {
              newAllocs[strat.id] = 0;
            }
          });
          setBudgetAllocations(newAllocs);
        }}
      />

      {/* Interactive Budget Planning & Allocation Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Custom Budget Allocation Planner</h3>
            <p className="text-xs text-slate-500">
              Customize the distribution of your ₹{editableBrief.budget.toLocaleString('en-IN')} marketing budget
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-slate-500">Allocated: </span>
              <span className="font-mono font-bold text-slate-900">
                ₹{totalAllocatedBudget.toLocaleString('en-IN')}
              </span>
            </div>

            <div
              className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold border ${
                unallocatedBudget < 0
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : unallocatedBudget === 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {unallocatedBudget < 0
                ? `Exceeded by ₹${Math.abs(unallocatedBudget).toLocaleString('en-IN')}`
                : `₹${unallocatedBudget.toLocaleString('en-IN')} Reserve`}
            </div>
          </div>
        </div>

        {/* Sliders for Each Strategy */}
        <div className="space-y-3">
          {strategies.map((strat) => {
            const currentAmount = budgetAllocations[strat.id] || strat.suggestedBudgetAmount;
            const percentage =
              editableBrief.budget > 0
                ? Math.round((currentAmount / editableBrief.budget) * 100)
                : 0;

            return (
              <div key={strat.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-700">#{strat.rank}</span>
                    <span className="font-medium text-slate-900">{strat.name}</span>
                  </div>
                  <div className="font-mono font-semibold text-slate-900">
                    ₹{currentAmount.toLocaleString('en-IN')} ({percentage}%)
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={editableBrief.budget}
                    step={1000}
                    value={currentAmount}
                    onChange={(e) => handleAllocationChange(strat.id, Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                  <input
                    type="number"
                    min={0}
                    max={editableBrief.budget}
                    value={currentAmount}
                    onChange={(e) => handleAllocationChange(strat.id, Number(e.target.value))}
                    className="w-28 px-2 py-1 bg-white rounded border border-slate-300 font-mono text-right text-xs"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation Warning if Over-Allocated */}
        {unallocatedBudget < 0 && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Budget Over-allocated:</strong> Your current strategy distribution exceeds your planned total budget by{' '}
              <strong>₹{Math.abs(unallocatedBudget).toLocaleString('en-IN')}</strong>. Please reduce individual channel amounts before approving spend.
            </span>
          </div>
        )}
      </div>

      {/* 7-Day Marketing Experiment Planner Modal */}
      <ExperimentPlannerModal
        isOpen={isExperimentModalOpen}
        onClose={() => setIsExperimentModalOpen(false)}
        brief={editableBrief}
        onUseExperimentInStudio={(exp) => {
          setIsExperimentModalOpen(false);
          onNavigate('campaign-studio');
        }}
      />

      {/* 4-Part Plain-English Explanation Modal */}
      <ExplainModal
        item={selectedExplainItem}
        onClose={() => setSelectedExplainItem(null)}
      />
    </div>
  );
};
