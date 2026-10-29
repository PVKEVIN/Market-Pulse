import React, { useState } from 'react';
import { X, Check, Lock, Mail, ArrowRight, ShieldCheck, User, Sparkles } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface AuthProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { name: string; email: string; business: string };
  onUpdateUser?: (user: { name: string; email: string; business: string }) => void;
}

export const AuthProfileModal: React.FC<AuthProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser = { name: 'Demo Founder', email: 'founder@ecosip.com', business: 'EcoSip Store' },
  onUpdateUser,
}) => {
  const [email, setEmail] = useState(currentUser.email);
  const [businessName, setBusinessName] = useState(currentUser.business);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        name: email.split('@')[0] || 'User',
        email,
        business: businessName || 'My Business',
      });
    }
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Clean Sign-In / Workspace Form (Horizon UI Reference Page 6) */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Workspace Access
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading">
              Sign In to Market Pulse
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Access your saved campaign strategies, data models, and platform drafts.
            </p>

            {/* Quick Demo Workspace Selector */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-slate-800">Current Workspace:</span>
                <span className="text-slate-600 truncate max-w-[140px] sm:max-w-none">{businessName}</span>
              </div>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                Active Session
              </span>
            </div>

            {/* Google Sign-in Mock Button */}
            <button
              type="button"
              onClick={() => {
                setEmail('founder@ecosip.com');
                setBusinessName('EcoSip Store');
              }}
              className="mt-4 w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-[11px] text-slate-400 font-medium">or email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business / Store Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g., EcoSip Reusable Bottles"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs text-slate-900 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 text-xs text-slate-900 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                  />
                  <span>Keep me signed in</span>
                </label>
                <span className="text-slate-400 text-[11px]">Demo Mode</span>
              </div>

              <button
                type="submit"
                disabled={isSuccess}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Workspace Updated!</span>
                  </>
                ) : (
                  <>
                    <span>Save & Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe local storage</span>
            </span>
            <span>Version 2.4</span>
          </div>
        </div>

        {/* Right Side: Strong Visual Brand Surface (Horizon UI Reference Page 6) */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white w-80 relative overflow-hidden shrink-0 border-l border-slate-800">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo Element */}
          <div className="relative z-10 space-y-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black border border-slate-700 shadow-2xl p-1">
              <img
                src="/assets/aistudio/WhatsApp_Image_2026-10-29_at_8.16.40_PM_79919d41.jpeg"
                alt="Market Pulse"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div>
              <h3 className="text-xl font-extrabold uppercase tracking-wide text-white font-heading">
                Market Pulse
              </h3>
              <p className="text-sm font-semibold text-indigo-300 mt-0.5">
                Where Every Budget Counts.
              </p>
            </div>
            <p className="text-xs text-slate-300/90 leading-relaxed pt-2">
              Empowering early-stage founders, creators, and small businesses with explainable marketing decision intelligence and budget clarity.
            </p>
          </div>

          {/* Bottom Trust Pillars */}
          <div className="relative z-10 pt-6 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Deterministic scoring engine</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>45,000+ row audience benchmark</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Zero fabricated ROI telemetry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
