import React, { useState } from 'react';
import { Activity, Sparkles, RefreshCw, MessageSquare, AlertTriangle, Menu, X, Check, ExternalLink, User, Lock } from 'lucide-react';
import { resetDemoData } from '../../services/storage';
import { BrandLogo } from '../common/BrandLogo';
import { AuthProfileModal } from '../common/AuthProfileModal';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAssistant: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAssistant,
  onResetData,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleResetConfirm = () => {
    resetDemoData();
    onResetData();
    setShowResetConfirm(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Official Market Pulse Logo and Wordmark */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onTabChange('overview')}
                className="focus:outline-none"
                title="Go to Overview"
              >
                <BrandLogo variant="navbar" showTagline={true} />
              </button>
            </div>

            {/* Center: Demo Badge & Workspace Switcher */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="font-semibold">DEMO WORKSPACE</span>
                <span className="text-amber-700">| Synthetic Benchmark Data</span>
                <button
                  onClick={() => setShowDemoInfo(true)}
                  className="ml-1 text-amber-600 hover:text-amber-800 underline font-medium"
                >
                  Details
                </button>
              </div>

              <div className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>EcoSip Demo Store</span>
              </div>

              <button
                onClick={() => onTabChange('success-stories')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  currentTab === 'success-stories'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Success Stories</span>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Reset Demo Data Button */}
              <button
                onClick={() => setShowResetConfirm(true)}
                title="Reset all campaign and brief data to initial state"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>

              {/* Pulse Assistant Button */}
              <button
                onClick={onOpenAssistant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pulse Assistant</span>
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              </button>

              {/* Workspace Profile / Sign In Button (Horizon UI Page 1 & 6) */}
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shadow-xs"
                title="Manage Workspace & Sign In"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-[10px] font-bold">
                  MP
                </div>
                <span className="hidden lg:inline font-medium">EcoSip</span>
              </button>

              {/* Primary Strategy CTA */}
              <button
                onClick={() => onTabChange('strategy-finder')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-98 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Create Strategy</span>
              </button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
            <div className="p-2 bg-amber-50 rounded text-xs text-amber-800 border border-amber-200 mb-2">
              <span className="font-semibold">DEMO WORKSPACE:</span> Synthetic benchmark data.
            </div>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'strategy-finder', label: 'Strategy Finder' },
              { id: 'campaign-studio', label: 'Campaign Studio' },
              { id: 'data-sources', label: 'Data Sources (45k)' },
              { id: 'competitor-insights', label: 'Know Your Marketing Tools' },
              { id: 'success-stories', label: '🌟 Success Stories & Lessons' },
              { id: 'knowledge-hub', label: 'Knowledge Hub' },
              { id: 'pricing', label: 'Pricing & Plans' },
              { id: 'settings', label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  currentTab === item.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                setShowResetConfirm(true);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 font-medium"
            >
              Reset Demo Data
            </button>
          </div>
        )}
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Reset Demo Data?</h3>
            </div>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              This will restore the <strong>EcoSip Demo Store</strong> baseline dataset, resetting all campaign metrics (Social Campaign A, Search Campaign B, Email Campaign C) and initial strategy plans to their default values.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
              >
                Yes, Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Info Modal */}
      {showDemoInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  MP
                </div>
                <h3 className="text-base font-bold text-slate-900">Demo Workspace Transparency Note</h3>
              </div>
              <button
                onClick={() => setShowDemoInfo(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Synthetic Demo Workspace:</strong> All historical campaigns (Social A, Search B, Email C) and customer dataset records are synthetic benchmarks created for hackathon evaluation and interactive demonstration.
              </p>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-800">Demo Store Parameters:</p>
                <p>• <strong>Business:</strong> EcoSip Demo Store (Reusable Bottles)</p>
                <p>• <strong>Audience:</strong> College students & young professionals in Chennai, India</p>
                <p>• <strong>Planned Budget:</strong> ₹1,00,000 (₹85,000 spent across 3 historical campaigns, ₹15,000 unallocated)</p>
                <p>• <strong>Lead Benchmarks:</strong> Search ₹500 CPL, Social ₹1,000 CPL</p>
              </div>
              <p className="text-slate-500 italic">
                * Note on unmeasured metrics: Revenue, conversions, and impressions are displayed as "Not available" when not provided, preventing fabricated ROI numbers.
              </p>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDemoInfo(false)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Workspace Authentication & Profile Modal (Page 6 Reference) */}
      <AuthProfileModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
