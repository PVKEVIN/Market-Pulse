import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Video,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  AlertCircle,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { BrandTone, CampaignBrief, RankedStrategy, SocialPlatform } from '../types';
import { saveCampaigns, getSavedCampaigns } from '../services/storage';

interface CampaignStudioPageProps {
  brief: CampaignBrief;
  selectedStrategy: RankedStrategy | null;
  onNavigate: (tab: string) => void;
}

const TONES: BrandTone[] = [
  'Trendy and energetic',
  'Friendly and casual',
  'Professional',
  'Premium and elegant',
  'Funny and playful',
];

export const CampaignStudioPage: React.FC<CampaignStudioPageProps> = ({
  brief,
  selectedStrategy,
  onNavigate,
}) => {
  // Input brief fields
  const [brandName, setBrandName] = useState(brief.businessName || 'EcoSip Store');
  const [productOffer, setProductOffer] = useState(brief.product || 'Reusable Stainless Bottles');
  const [discountDetails, setDiscountDetails] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [tone, setTone] = useState<BrandTone>('Friendly and casual');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([
    'instagram',
    'youtube',
    'x',
    'facebook',
    'linkedin',
  ]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, any> | null>(null);
  const [activePlatformTab, setActivePlatformTab] = useState<SocialPlatform>('instagram');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedDraftSuccess, setSavedDraftSuccess] = useState(false);

  // Generate drafts on initial load or user trigger
  const handleGenerateContent = async (overrideTone?: BrandTone) => {
    setIsGenerating(true);
    setSavedDraftSuccess(false);

    try {
      const res = await fetch('/api/gemini/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief: {
            ...brief,
            businessName: brandName,
            product: productOffer,
          },
          platforms: selectedPlatforms,
          tone: overrideTone || tone,
          discountDetails,
          websiteUrl: storeUrl,
        }),
      });

      const data = await res.json();
      if (data && data.drafts) {
        setDrafts(data.drafts);
      }
    } catch (err) {
      console.error('Failed to generate drafts:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    // Generate initial drafts if not already present
    if (!drafts) {
      handleGenerateContent();
    }
  }, []);

  const handleCopyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveDraftToCampaign = () => {
    if (!drafts) return;
    const currentCamps = getSavedCampaigns();
    const updated = currentCamps.map((camp, idx) => {
      if (idx === 0) {
        return {
          ...camp,
          contentDrafts: drafts,
        };
      }
      return camp;
    });

    saveCampaigns(updated);
    setSavedDraftSuccess(true);
    setTimeout(() => setSavedDraftSuccess(false), 3500);
  };

  const handleMakeShorter = () => {
    if (!drafts || !drafts[activePlatformTab]) return;
    const current = drafts[activePlatformTab];

    if (activePlatformTab === 'instagram' && current.caption) {
      const short = current.caption.split('\n\n')[0] + '\n\nTap link in bio to claim!';
      setDrafts({
        ...drafts,
        instagram: { ...current, caption: short },
      });
    } else if (activePlatformTab === 'x' && current.post) {
      const shortX = `${productOffer}: ${discountDetails}. Check link: ${storeUrl}`;
      setDrafts({
        ...drafts,
        x: { ...current, post: shortX },
      });
    }
  };

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const platformPublishUrls: Record<SocialPlatform, { name: string; url: string }> = {
    instagram: { name: 'Instagram Web', url: 'https://www.instagram.com/' },
    youtube: { name: 'YouTube Studio', url: 'https://studio.youtube.com/' },
    x: { name: 'X / Twitter Post', url: 'https://twitter.com/compose/tweet' },
    facebook: { name: 'Facebook Creator Studio', url: 'https://www.facebook.com/' },
    linkedin: { name: 'LinkedIn Feed', url: 'https://www.linkedin.com/feed/' },
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              Content Studio
            </span>
            <span className="text-xs text-slate-500">Platform-Specific Copywriting Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Campaign Content Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Generate customized, high-converting marketing drafts for Instagram, YouTube, X, Facebook, and LinkedIn.
          </p>
        </div>

        {/* Selected Strategy Indicator */}
        {selectedStrategy && (
          <div className="p-2.5 px-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs flex items-center gap-2 text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Connected Strategy: <strong>{selectedStrategy.name}</strong> (#{selectedStrategy.rank})
            </span>
          </div>
        )}
      </div>

      {/* Campaign Brief Form Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <PenTool className="w-4 h-4 text-indigo-600" />
          Campaign Brief & Offer Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Brand Name</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Product / Promotion Offer</label>
            <input
              type="text"
              value={productOffer}
              onChange={(e) => setProductOffer(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-600 font-medium">Discount / Offer Specifics (Optional)</label>
              <button
                type="button"
                onClick={() => {
                  setDiscountDetails('20% student discount with code CAMPUS20 on pre-orders');
                  setStoreUrl('https://ecosip.example.com/student-offer');
                }}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                Load Sample Offer
              </button>
            </div>
            <input
              type="text"
              value={discountDetails}
              onChange={(e) => setDiscountDetails(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs sm:text-sm"
              placeholder="e.g., 20% off pre-orders, free shipping above ₹999, or student campus discount"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Landing / Store URL (Optional)</label>
            <input
              type="url"
              value={storeUrl}
              onChange={(e) => setStoreUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono text-xs sm:text-sm"
              placeholder="e.g., https://yourbrand.com/offer"
            />
          </div>
        </div>

        {/* Tone and Platforms Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
          {/* Brand Tone Selector */}
          <div>
            <label className="block text-slate-600 font-medium mb-1.5">Brand Tone & Voice</label>
            <div className="flex flex-wrap gap-1.5">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    tone === t
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Social Platforms Selection */}
          <div>
            <label className="block text-slate-600 font-medium mb-1.5">Target Platforms</label>
            <div className="flex flex-wrap gap-2">
              {(['instagram', 'youtube', 'x', 'facebook', 'linkedin'] as SocialPlatform[]).map((p) => {
                const isChecked = selectedPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold capitalize flex items-center gap-1.5 transition-all ${
                      isChecked
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{p === 'x' ? 'X (Twitter)' : p}</span>
                    {isChecked && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => handleGenerateContent()}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 active:scale-98 transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-200" />
                <span>Crafting Platform Drafts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Generate Platform-Specific Drafts</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {savedDraftSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>All drafts saved successfully to your active campaign overview!</span>
        </div>
      )}

      {/* Platform Drafts Editor Workspace */}
      {drafts && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Platform Tabs Header */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 pt-3 flex gap-2 overflow-x-auto">
            {selectedPlatforms.map((p) => {
              const isActive = activePlatformTab === p;
              return (
                <button
                  key={p}
                  onClick={() => setActivePlatformTab(p)}
                  className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold capitalize transition-all border-t border-x -mb-px flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-indigo-700 border-slate-200 border-b-white shadow-xs'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  {p === 'instagram' && <Instagram className="w-4 h-4 text-pink-600" />}
                  {p === 'youtube' && <Youtube className="w-4 h-4 text-red-600" />}
                  {p === 'x' && <Twitter className="w-4 h-4 text-slate-800" />}
                  {p === 'facebook' && <Facebook className="w-4 h-4 text-blue-600" />}
                  {p === 'linkedin' && <Linkedin className="w-4 h-4 text-sky-700" />}
                  <span>{p === 'x' ? 'X / Twitter' : p}</span>
                </button>
              );
            })}
          </div>

          {/* Active Platform Content Box */}
          <div className="p-6 space-y-6">
            {/* Top Toolbar Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 capitalize">
                  {activePlatformTab} Marketing Draft
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">Tone: {tone}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMakeShorter}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  Make Shorter
                </button>
                <button
                  onClick={() => handleGenerateContent()}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                  <span>Regenerate</span>
                </button>
                <button
                  onClick={handleSaveDraftToCampaign}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save Draft to Campaign</span>
                </button>
              </div>
            </div>

            {/* Platform Details Render */}
            {activePlatformTab === 'instagram' && drafts.instagram && (
              <div className="space-y-4">
                {/* Visual / Reel Concept */}
                <div className="p-3.5 rounded-xl bg-pink-50/70 border border-pink-200/80 text-xs space-y-1">
                  <span className="font-bold text-pink-900 block flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-pink-700" />
                    Suggested 9:16 Reel & Visual Concept:
                  </span>
                  <p className="text-pink-950 leading-relaxed">{drafts.instagram.visualConcept}</p>
                </div>

                {/* Opening Hook */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <label className="font-bold text-slate-700">Opening Hook (First 2.5s)</label>
                    <button
                      onClick={() => handleCopyToClipboard(drafts.instagram.hook, 'ig-hook')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      {copiedKey === 'ig-hook' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'ig-hook' ? 'Copied!' : 'Copy Hook'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={drafts.instagram.hook}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        instagram: { ...drafts.instagram, hook: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium text-xs sm:text-sm text-slate-900"
                  />
                </div>

                {/* Full Caption */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <label className="font-bold text-slate-700">Instagram Caption</label>
                    <button
                      onClick={() => handleCopyToClipboard(drafts.instagram.caption, 'ig-caption')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      {copiedKey === 'ig-caption' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'ig-caption' ? 'Copied!' : 'Copy Caption'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={drafts.instagram.caption}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        instagram: { ...drafts.instagram, caption: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-sans text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1.5">
                    Recommended Hashtags (Click chip to copy)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {drafts.instagram.hashtags?.map((tag: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleCopyToClipboard(tag, `tag-${i}`)}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 text-xs font-mono transition-colors"
                      >
                        {tag} {copiedKey === `tag-${i}` && '✓'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* YouTube */}
            {activePlatformTab === 'youtube' && drafts.youtube && (
              <div className="space-y-4">
                {/* Thumbnail Concept */}
                <div className="p-3.5 rounded-xl bg-red-50/70 border border-red-200/80 text-xs space-y-1">
                  <span className="font-bold text-red-900 block flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-red-700" />
                    High-CTR Thumbnail Concept:
                  </span>
                  <p className="text-red-950 leading-relaxed">{drafts.youtube.thumbnailConcept}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <label className="font-bold text-slate-700">Video Title (Under 70 chars)</label>
                    <button
                      onClick={() => handleCopyToClipboard(drafts.youtube.title, 'yt-title')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      {copiedKey === 'yt-title' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'yt-title' ? 'Copied!' : 'Copy Title'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={drafts.youtube.title}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        youtube: { ...drafts.youtube, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-xs sm:text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 text-xs mb-1">
                    First 15-Second Video Hook Script
                  </label>
                  <textarea
                    rows={3}
                    value={drafts.youtube.hookScript}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        youtube: { ...drafts.youtube, hookScript: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono text-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <label className="font-bold text-slate-700">Video Description & Timestamps</label>
                    <button
                      onClick={() => handleCopyToClipboard(drafts.youtube.description, 'yt-desc')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      {copiedKey === 'yt-desc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'yt-desc' ? 'Copied!' : 'Copy Description'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={drafts.youtube.description}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        youtube: { ...drafts.youtube, description: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* X / Twitter */}
            {activePlatformTab === 'x' && drafts.x && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-700">X Post Copy</label>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {(drafts.x.post || '').length}/280 chars
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyToClipboard(drafts.x.post, 'x-post')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      {copiedKey === 'x-post' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'x-post' ? 'Copied!' : 'Copy Post'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={drafts.x.post}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        x: { ...drafts.x, post: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                {drafts.x.alternative && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-700">Alternative Variation:</span>
                      <button
                        onClick={() => handleCopyToClipboard(drafts.x.alternative, 'x-alt')}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        {copiedKey === 'x-alt' ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <p className="text-slate-800 italic leading-relaxed">{drafts.x.alternative}</p>
                  </div>
                )}
              </div>
            )}

            {/* Facebook */}
            {activePlatformTab === 'facebook' && drafts.facebook && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <label className="font-bold text-slate-700">Facebook Community Post</label>
                    <button
                      onClick={() => handleCopyToClipboard(drafts.facebook.post, 'fb-post')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      {copiedKey === 'fb-post' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'fb-post' ? 'Copied!' : 'Copy Post'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={drafts.facebook.post}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        facebook: { ...drafts.facebook, post: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-blue-900 block">Offer Highlights / Bullet Points:</span>
                  <p className="text-blue-950 whitespace-pre-wrap leading-relaxed">
                    {drafts.facebook.offerSummary}
                  </p>
                </div>
              </div>
            )}

            {/* LinkedIn */}
            {activePlatformTab === 'linkedin' && drafts.linkedin && (
              <div className="space-y-4">
                <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-sky-900 block">Professional Business Angle:</span>
                  <p className="text-sky-950 leading-relaxed">{drafts.linkedin.businessAngle}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <label className="font-bold text-slate-700">LinkedIn Thought Leadership Post</label>
                    <button
                      onClick={() => handleCopyToClipboard(drafts.linkedin.post, 'li-post')}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      {copiedKey === 'li-post' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'li-post' ? 'Copied!' : 'Copy Post'}</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={drafts.linkedin.post}
                    onChange={(e) =>
                      setDrafts({
                        ...drafts,
                        linkedin: { ...drafts.linkedin, post: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* Direct Publishing External Action & Disclaimer */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <ExternalLink className="w-4 h-4 text-indigo-600" />
                  <span>Manual Publishing Workflow</span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Click below to open {platformPublishUrls[activePlatformTab].name} in a new tab. Paste your copied draft into the platform's editor. (Market Pulse does not auto-post without explicit API credentials).
                </p>
              </div>

              <a
                href={platformPublishUrls[activePlatformTab].url}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <span>Open {platformPublishUrls[activePlatformTab].name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
