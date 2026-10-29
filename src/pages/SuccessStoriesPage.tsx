import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  ShieldAlert,
  X,
  Tag,
  Building,
  GraduationCap,
} from 'lucide-react';
import { SuccessStory } from '../types';
import { REAL_SUCCESS_STORIES, SHOWCASE_DEMO_STORIES } from '../services/successStoriesData';

interface SuccessStoriesPageProps {
  onNavigate: (tab: string) => void;
}

export const SuccessStoriesPage: React.FC<SuccessStoriesPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'all' | 'real' | 'showcase'>('all');
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);

  const allStories: SuccessStory[] = [...REAL_SUCCESS_STORIES, ...SHOWCASE_DEMO_STORIES];

  const categories = [
    'All',
    'Personalisation & Customer Engagement',
    'Purpose-Driven & Brand Awareness',
    'Social Media & Brand Awareness',
    'Budget-Friendly Marketing Ideas & Mobile',
  ];

  const filteredStories = allStories.filter((s) => {
    const matchesSearch =
      s.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.bigIdea.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || s.category.includes(selectedCategory);

    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'real'
        ? !s.isShowcaseDemo
        : s.isShowcaseDemo;

    return matchesSearch && matchesCategory && matchesTab;
  });

  const featuredStory = REAL_SUCCESS_STORIES[0]; // Coca-Cola

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Editorial Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
              Marketing Wisdom Library
            </span>
            <span className="text-xs text-indigo-200/80 hidden sm:inline">• Public Knowledge Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
            Marketing Lessons From Real Campaigns
          </h1>
          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-sans">
            Study how both global brands and local startups solved marketing challenges. Every story highlights verified facts, plain-language principles, and practical ideas you can test in your own business.
          </p>

          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium">
              ✓ Verified Public Sources
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium">
              ✓ 3 Actionable Small Business Lessons Per Story
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-medium">
              ✓ Zero Fabricated Statistics
            </span>
          </div>
        </div>
      </div>

      {/* Featured Story Banner */}
      <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-md p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                Featured Classic Study
              </span>
              <span className="text-xs text-slate-400 font-mono">{featuredStory.dateOrYear}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              {featuredStory.brand} — {featuredStory.campaignName}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>The Big Idea:</strong> {featuredStory.bigIdea}
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
              <span>Why it worked: {featuredStory.whyItWorked.slice(0, 110)}...</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedStory(featuredStory)}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <span>Read Full Case Study</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Tabs: All vs Real vs Market Pulse Showcases */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold w-fit">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Stories ({allStories.length})
            </button>
            <button
              onClick={() => setActiveTab('real')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeTab === 'real' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Real Brand Campaigns ({REAL_SUCCESS_STORIES.length})
            </button>
            <button
              onClick={() => setActiveTab('showcase')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === 'showcase' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Market Pulse Showcases ({SHOWCASE_DEMO_STORIES.length})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by brand, idea, or challenge..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="font-bold text-slate-500 shrink-0">Filter Topic:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className={`rounded-2xl border transition-all p-5 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md ${
              story.isShowcaseDemo
                ? 'bg-gradient-to-b from-indigo-50/40 to-white border-indigo-200/90 hover:border-indigo-400'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                    {story.category.split(' & ')[0]}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 font-heading mt-0.5">
                    {story.brand}
                  </h3>
                  <div className="text-xs font-semibold text-slate-700">{story.campaignName}</div>
                </div>

                {story.isShowcaseDemo ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                    Demo Showcase
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0 font-mono">
                    Verified Study
                  </span>
                )}
              </div>

              {/* Tagline */}
              <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                "{story.tagline}"
              </p>

              {/* The Big Idea Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                <span className="font-bold text-slate-900 block text-[11px] mb-0.5">The Big Idea:</span>
                <p className="text-slate-600 leading-relaxed line-clamp-3">{story.bigIdea}</p>
              </div>

              {/* 3 Lessons Preview */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                  What Small Businesses Can Learn:
                </span>
                <ul className="space-y-1 text-slate-600 text-[11px]">
                  {story.smallBusinessLessons.slice(0, 2).map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">{story.dateOrYear}</span>
              <button
                onClick={() => setSelectedStory(story)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
              >
                <span>Read Story & Action</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {selectedStory.category}
                  </span>
                  {selectedStory.isShowcaseDemo ? (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      Illustrative Demo Showcase
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      Verified Case Study
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">{selectedStory.dateOrYear}</span>
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 font-heading mt-1.5">
                  {selectedStory.brand} — {selectedStory.campaignName}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5 italic">
                  "{selectedStory.tagline}"
                </p>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Illustrative Disclaimer if Demo */}
            {selectedStory.isShowcaseDemo && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2 leading-relaxed">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Illustrative demo note:</strong> Created to demonstrate how Market Pulse connects marketing problems to campaign plans. This is not a real customer testimonial or proven commercial result.
                </p>
              </div>
            )}

            {/* Narrative Sections */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              {/* Challenge */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  1. The Business Challenge
                </h4>
                <p className="text-slate-700">{selectedStory.challenge}</p>
              </div>

              {/* Big Idea */}
              <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200/70 space-y-1">
                <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wide">
                  2. The Big Campaign Idea
                </h4>
                <p className="text-indigo-900 font-medium">{selectedStory.bigIdea}</p>
                <div className="pt-1.5 text-xs text-indigo-800">
                  <strong>Where it appeared:</strong> {selectedStory.whereItAppeared}
                </div>
              </div>

              {/* Why it worked */}
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  3. Why It Worked (Marketing Psychology in Plain English)
                </h4>
                <p className="text-slate-700">{selectedStory.whyItWorked}</p>
              </div>

              {/* Reported Results */}
              <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/70 space-y-2">
                <h4 className="font-bold text-emerald-950 text-xs uppercase tracking-wide">
                  4. Reported Results & Evidence
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedStory.reportedResults.map((res, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-xl border border-emerald-200/80 space-y-0.5">
                      <span className="font-bold text-emerald-800 block text-sm">{res.metric}</span>
                      <p className="text-slate-700 text-[11px]">{res.context}</p>
                      <span className="text-[10px] text-slate-400 block pt-0.5 font-mono">Source: {res.source}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Lessons for Small Businesses */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  What Small Businesses Can Learn (3 Practical Lessons)
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {selectedStory.smallBusinessLessons.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Try this in Market Pulse Action */}
              <div className="p-4 bg-indigo-950 text-white rounded-2xl space-y-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Try This Idea in Market Pulse
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedStory.tryItInMarketPulse}
                  </p>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedStory(null);
                      onNavigate('strategy-finder');
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <span>Launch Strategy Finder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Source Verification Links */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-600">Verified Sources:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedStory.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium underline"
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
