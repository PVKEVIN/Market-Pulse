import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  PenTool,
  SlidersHorizontal,
  Layers,
  Check,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ArrowRight,
  FileText,
  DollarSign,
  Users,
  Target,
  Clock,
  Compass,
} from 'lucide-react';
import { CampaignBrief, CampaignObjective } from '../../types';

interface DualInputRequirementsProps {
  brief: CampaignBrief;
  onUpdateBrief: (brief: CampaignBrief) => void;
  onGenerateStrategies: (brief: CampaignBrief, source: 'prompt' | 'guided') => Promise<void>;
  isGenerating: boolean;
}

const SAMPLE_PROMPT_ECOSIP =
  "I'm launching a reusable water bottle for college students in Chennai. My budget is ₹1,00,000 for 30 days. I want to generate qualified enquiries using social media and other suitable channels. Recommend the best options and explain why.";

const SAMPLE_PROMPT_LICO23 =
  'I need to market my new phone model Lico23 to youngsters aged 19–20 in India. My total budget is ₹50 lakh. I want to build awareness and generate product enquiries over the next 30 days. Recommend suitable marketing channels, rank the best options, and explain how I should allocate my budget.';

const SAMPLE_PROMPT_FESTIVE =
  'I run a small clothing store and have ₹25,000 to promote a festive collection. I want more store visits and online enquiries from young adults in Chennai.';

const INDUSTRIES = [
  'Consumer Goods & Retail',
  'Fashion & Apparel',
  'Technology & Consumer Electronics',
  'Food, Beverage & Cafes',
  'Software & B2B SaaS',
  'Health, Wellness & Fitness',
  'Education & Coaching',
  'Professional Services',
  'Other',
];

const OBJECTIVES: CampaignObjective[] = [
  'Lead Generation',
  'Brand Awareness',
  'Online Sales',
  'Store Visits',
  'Customer Retention',
  'Product Launch',
];

const AGE_RANGES = [
  '18–24 (Young Adults / College)',
  '25–34 (Early Professionals)',
  '35–44 (Mid-Career / Families)',
  '45–54 (Mature Adults)',
  '55+ (Seniors / Retirees)',
  'All Ages',
];

const CHANNEL_OPTIONS = [
  { id: 'Google Search', label: 'Google Search (High Intent)' },
  { id: 'Instagram', label: 'Instagram (Visual / Reels)' },
  { id: 'YouTube', label: 'YouTube (Video / Shorts)' },
  { id: 'Facebook', label: 'Facebook (Broad Demographics)' },
  { id: 'LinkedIn', label: 'LinkedIn (B2B / Careers)' },
  { id: 'Email Newsletter', label: 'Email Newsletter (Retention)' },
  { id: 'Creator Partnerships', label: 'Micro-Creator Partnerships' },
];

const CONSTRAINT_OPTIONS = [
  'Limited budget (cost-sensitive)',
  'Organic marketing preferred',
  'Paid advertising allowed',
  'No influencer partnerships',
  'Limited design resources',
  'Small / solo team',
  'Need to launch quickly (within 7 days)',
  'Must use existing brand assets',
];

export const DualInputRequirements: React.FC<DualInputRequirementsProps> = ({
  brief,
  onUpdateBrief,
  onGenerateStrategies,
  isGenerating,
}) => {
  // Input mode: 'prompt' (Mode A) or 'guided' (Mode B)
  const [inputMode, setInputMode] = useState<'prompt' | 'guided'>('prompt');

  // Mode A: Prompt state (empty by default; loaded explicitly by user)
  const [promptText, setPromptText] = useState('');
  const [promptError, setPromptError] = useState<string | null>(null);

  // Mode B: Guided Form state initialized from current brief
  const [formData, setFormData] = useState({
    businessName: brief.businessName || '',
    industry: 'Consumer Goods & Retail',
    product: brief.product || '',
    productDescription: brief.productPositioning || '',
    objective: brief.objective || 'Lead Generation',
    targetAudience: brief.targetAudience || '',
    audienceAgeRange: brief.audienceAgeRange || '18–24',
    geography: brief.geography || '',
    budget: brief.budget || 100000,
    currency: 'INR (₹)',
    durationDays: brief.campaignDurationDays || 30,
    preferredChannels: brief.preferredChannels || ['Instagram', 'Google Search'],
    constraints: brief.constraints
      ? brief.constraints.split(',').map((s) => s.trim())
      : ['Limited budget (cost-sensitive)', 'Paid advertising allowed'],
    additionalInstructions: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showBriefPreview, setShowBriefPreview] = useState(false);

  // Convert guided form to readable prompt string
  const generatePromptFromGuidedForm = (data: typeof formData): string => {
    const prod = data.product || data.businessName || 'my product';
    const aud = data.targetAudience ? `${data.targetAudience} (${data.audienceAgeRange})` : 'my target audience';
    const geo = data.geography ? `in ${data.geography}` : '';
    const channels = data.preferredChannels.length > 0 ? ` Preferred channels: ${data.preferredChannels.join(', ')}.` : '';
    const constrs = data.constraints.length > 0 ? ` Constraints: ${data.constraints.join(', ')}.` : '';
    const extra = data.additionalInstructions ? ` Note: ${data.additionalInstructions}.` : '';

    return `I want to market ${prod} to ${aud} ${geo}. My primary objective is ${data.objective} with a total budget of ₹${data.budget.toLocaleString('en-IN')} over ${data.durationDays} days.${channels}${constrs}${extra} Recommend the best marketing channels and explain how I should allocate my budget.`;
  };

  // Synchronize state when switching modes (Section 8 Requirement)
  const handleSwitchMode = (newMode: 'prompt' | 'guided') => {
    if (newMode === inputMode) return;

    if (newMode === 'prompt') {
      // Switching to prompt: if prompt is empty, synthesize from guided form
      if (!promptText.trim()) {
        const synthesized = generatePromptFromGuidedForm(formData);
        setPromptText(synthesized);
      }
    } else {
      // Switching to guided form: ensure formData reflects current brief
      setFormData((prev) => ({
        ...prev,
        businessName: brief.businessName || prev.businessName,
        product: brief.product || prev.product,
        targetAudience: brief.targetAudience || prev.targetAudience,
        audienceAgeRange: brief.audienceAgeRange || prev.audienceAgeRange,
        geography: brief.geography || prev.geography,
        objective: brief.objective || prev.objective,
        budget: brief.budget || prev.budget,
        durationDays: brief.campaignDurationDays || prev.durationDays,
      }));
    }

    setInputMode(newMode);
  };

  // Mode A: Submit Prompt
  const handlePromptSubmit = async () => {
    if (!promptText.trim()) {
      setPromptError('Please describe your product and marketing requirements before generating a strategy.');
      return;
    }
    setPromptError(null);

    // Call extraction endpoint or deterministic mapper
    await onGenerateStrategies(
      {
        ...brief,
        product: formData.product || brief.product,
      },
      'prompt'
    );
  };

  // Mode B: Toggle Multi-Select Channels
  const handleToggleChannel = (channelId: string) => {
    setFormData((prev) => {
      const exists = prev.preferredChannels.includes(channelId);
      const updated = exists
        ? prev.preferredChannels.filter((c) => c !== channelId)
        : [...prev.preferredChannels, channelId];
      return { ...prev, preferredChannels: updated };
    });
  };

  // Mode B: Toggle Multi-Select Constraints
  const handleToggleConstraint = (constraintText: string) => {
    setFormData((prev) => {
      const exists = prev.constraints.includes(constraintText);
      const updated = exists
        ? prev.constraints.filter((c) => c !== constraintText)
        : [...prev.constraints, constraintText];
      return { ...prev, constraints: updated };
    });
  };

  // Mode B: Validate & Submit Guided Form
  const handleGuidedSubmit = async () => {
    const errors: Record<string, string> = {};
    if (!formData.product.trim() && !formData.businessName.trim()) {
      errors.product = 'Please enter your product or business name.';
    }
    if (!formData.targetAudience.trim()) {
      errors.targetAudience = 'Please specify who you want to reach.';
    }
    if (!formData.budget || formData.budget <= 0) {
      errors.budget = 'Please enter a valid budget amount.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // Build complete updated brief
    const updatedBrief: CampaignBrief = {
      ...brief,
      businessName: formData.businessName || formData.product,
      product: formData.product || formData.businessName,
      productCategory: formData.industry,
      targetAudience: formData.targetAudience,
      audienceAgeRange: formData.audienceAgeRange,
      geography: formData.geography || 'India',
      objective: formData.objective as CampaignObjective,
      budget: Number(formData.budget),
      campaignDurationDays: Number(formData.durationDays),
      preferredChannels: formData.preferredChannels,
      excludedChannels: [],
      productPositioning: formData.productDescription,
      constraints: formData.constraints.join(', '),
    };

    onUpdateBrief(updatedBrief);
    await onGenerateStrategies(updatedBrief, 'guided');
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_18px_40px_rgba(112,144,176,0.08)] overflow-hidden">
      {/* Top Header: Mode Segmented Switcher (Section 7 Requirement) */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-indigo-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                Dual-Input Engine
              </span>
              <span className="text-xs text-slate-500">Choose your preferred way to describe goals</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 font-heading">
              How would you like to describe your campaign?
            </h2>
          </div>

          {/* Segmented Control Buttons */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 self-start sm:self-auto shrink-0 shadow-inner">
            <button
              type="button"
              onClick={() => handleSwitchMode('prompt')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                inputMode === 'prompt'
                  ? 'bg-white text-indigo-900 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PenTool className="w-3.5 h-3.5 text-indigo-600" />
              <span>Write a Prompt</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('guided')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                inputMode === 'guided'
                  ? 'bg-white text-indigo-900 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>Guided Form</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode A: Write a Prompt */}
      {inputMode === 'prompt' && (
        <div className="p-5 sm:p-7 space-y-5 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Describe your product, audience, objective, and budget:
              </label>
              <span className="text-[11px] text-slate-400">
                {promptText.length} characters
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Describe in plain English. Market Pulse extracts your structured parameters and applies deterministic scoring to rank the 5 best channels.
            </p>

            <div className="relative">
              <textarea
                value={promptText}
                onChange={(e) => {
                  setPromptText(e.target.value);
                  if (promptError) setPromptError(null);
                }}
                rows={4}
                placeholder="I'm launching a reusable water bottle for college students in Chennai. My budget is ₹1,00,000 for 30 days. I want to generate qualified enquiries using social media and other suitable channels. Recommend the best options and explain why."
                className={`w-full p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 transition-all ${
                  promptError
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600 bg-slate-50/30'
                }`}
              />
            </div>
            {promptError && (
              <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{promptError}</span>
              </p>
            )}
          </div>

          {/* Optional "Load Example" Actions (Section 6 & 7: Loading must be an intentional action) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 mr-1">Load Example:</span>
              <button
                type="button"
                onClick={() => setPromptText(SAMPLE_PROMPT_ECOSIP)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                💧 EcoSip Bottle (₹1L / Students)
              </button>
              <button
                type="button"
                onClick={() => setPromptText(SAMPLE_PROMPT_LICO23)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                📱 Lico23 Smartphone (₹50L / India)
              </button>
              <button
                type="button"
                onClick={() => setPromptText(SAMPLE_PROMPT_FESTIVE)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                👗 Festive Store (₹25k / Chennai)
              </button>
            </div>

            <button
              type="button"
              onClick={handlePromptSubmit}
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-98 transition-all shrink-0"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
                  <span>Analyzing & Ranking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Extract & Generate Strategy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Mode B: Guided Form */}
      {inputMode === 'guided' && (
        <div className="p-5 sm:p-7 space-y-6 animate-in fade-in duration-150">
          {/* Section 1: Product & Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs flex items-center justify-center font-bold">1</span>
              <span>Product & Business Identity</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product or Business Name <span className="text-indigo-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  placeholder="e.g., EcoSip Reusable Bottles"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 ${
                    formErrors.product ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600'
                  }`}
                />
                {formErrors.product && <p className="text-[11px] text-red-600 mt-1">{formErrors.product}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Industry / Category
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Description / Value Proposition
                </label>
                <textarea
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                  rows={2}
                  placeholder="e.g., Double-wall vacuum insulated stainless steel bottle that keeps drinks cold for 24 hours. Targeted at college students seeking sustainability and style."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Audience & Objective */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs flex items-center justify-center font-bold">2</span>
              <span>Target Audience & Goal</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Main Objective <span className="text-indigo-600">*</span>
                </label>
                <select
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value as CampaignObjective })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {OBJECTIVES.map((obj) => (
                    <option key={obj} value={obj}>
                      {obj}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Audience <span className="text-indigo-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g., College students & young professionals"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 ${
                    formErrors.targetAudience ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600'
                  }`}
                />
                {formErrors.targetAudience && <p className="text-[11px] text-red-600 mt-1">{formErrors.targetAudience}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age Range
                </label>
                <select
                  value={formData.audienceAgeRange}
                  onChange={(e) => setFormData({ ...formData, audienceAgeRange: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  {AGE_RANGES.map((age) => (
                    <option key={age} value={age.split(' ')[0]}>
                      {age}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Geographic Location
                </label>
                <input
                  type="text"
                  value={formData.geography}
                  onChange={(e) => setFormData({ ...formData, geography: e.target.value })}
                  placeholder="e.g., Chennai, Tamil Nadu (or India nationwide)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Budget & Timeline */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs flex items-center justify-center font-bold">3</span>
              <span>Budget & Timeline</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Budget Amount <span className="text-indigo-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-sm">₹</span>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    placeholder="Enter total budget, e.g., 100000"
                    className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-mono font-bold text-indigo-900 focus:outline-none focus:ring-2 ${
                      formErrors.budget ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-600'
                    }`}
                  />
                </div>
                {formErrors.budget && <p className="text-[11px] text-red-600 mt-1">{formErrors.budget}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
                  <option value="USD ($)">USD ($ - US Dollar)</option>
                  <option value="EUR (€)">EUR (€ - Euro)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campaign Duration
                </label>
                <select
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
                >
                  <option value={7}>7 Days (Pilot / Fast Test)</option>
                  <option value={14}>14 Days (Two-Week Push)</option>
                  <option value={30}>30 Days (Standard Monthly Plan)</option>
                  <option value={60}>60 Days (Mid-Term Scale)</option>
                  <option value={90}>90 Days (Quarterly Campaign)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Channel Preferences & Constraints */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs flex items-center justify-center font-bold">4</span>
              <span>Preferred Channels & Constraints</span>
            </h3>

            {/* Channels Multi-Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Preferred Marketing Channels (Select channels you are interested in)
              </label>
              <div className="flex flex-wrap gap-2">
                {CHANNEL_OPTIONS.map((ch) => {
                  const isSelected = formData.preferredChannels.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => handleToggleChannel(ch.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      <span>{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Constraints Multi-Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Team & Budget Constraints
              </label>
              <div className="flex flex-wrap gap-2">
                {CONSTRAINT_OPTIONS.map((c) => {
                  const isSelected = formData.constraints.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleToggleConstraint(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-violet-700 text-white border-violet-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      <span>{c}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Instructions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Additional Instructions (Optional)
              </label>
              <textarea
                value={formData.additionalInstructions}
                onChange={(e) => setFormData({ ...formData, additionalInstructions: e.target.value })}
                rows={2}
                placeholder="e.g., Focus on student campus discounts, keep production costs low, prefer video over static imagery."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Submit Action for Guided Form */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                // Populate sample guided form
                setFormData({
                  businessName: 'EcoSip Store',
                  industry: 'Consumer Goods & Retail',
                  product: 'Reusable Stainless Bottles',
                  productDescription: '24-hour cold insulated eco bottles for college hydration.',
                  objective: 'Lead Generation',
                  targetAudience: 'College students & eco-conscious youth',
                  audienceAgeRange: '18–24',
                  geography: 'Chennai, Tamil Nadu',
                  budget: 100000,
                  currency: 'INR (₹)',
                  durationDays: 30,
                  preferredChannels: ['Instagram', 'Google Search', 'Creator Partnerships'],
                  constraints: ['Limited budget (cost-sensitive)', 'Paid advertising allowed'],
                  additionalInstructions: 'Focus on student campus discount hooks.',
                });
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline font-medium"
            >
              Fill with EcoSip Demo Defaults
            </button>

            <button
              type="button"
              onClick={handleGuidedSubmit}
              disabled={isGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 active:scale-98 transition-all shrink-0"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-200" />
                  <span>Calculating Deterministic Scores...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Generate Strategy Recommendations</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
