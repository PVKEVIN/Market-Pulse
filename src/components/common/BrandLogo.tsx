import React from 'react';

interface BrandLogoProps {
  variant?: 'navbar' | 'sidebar' | 'card' | 'footer' | 'icon-only';
  className?: string;
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'navbar',
  className = '',
  showTagline = true,
}) => {
  const logoSrc = '/assets/aistudio/WhatsApp_Image_2026-10-29_at_8.16.40_PM_79919d41.jpeg';

  if (variant === 'icon-only') {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-sm shrink-0 flex items-center justify-center ${className || 'w-10 h-10'}`}>
        <img
          src={logoSrc}
          alt="Market Pulse"
          className="w-full h-full object-cover object-top scale-125"
        />
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/90 shrink-0 shadow-lg p-0.5 flex items-center justify-center">
          <img
            src={logoSrc}
            alt="Market Pulse"
            className="w-full h-full object-cover object-top scale-120"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base text-white tracking-wide uppercase leading-tight font-heading">
              Market Pulse
            </span>
          </div>
          {showTagline && (
            <p className="text-[11px] text-indigo-300 font-medium truncate mt-0.5">
              Where Every Budget Counts.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 text-white shadow-xl ${className}`}>
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-black border border-slate-700/80 shadow-2xl shrink-0 p-1">
            <img
              src={logoSrc}
              alt="Market Pulse Official Logo"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="text-center sm:text-left space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Official Brand Identity
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-heading">
              Market Pulse
            </h3>
            <p className="text-sm font-semibold text-indigo-200">
              Where Every Budget Counts.
            </p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed pt-1">
              AI-assisted marketing decision support, deterministic strategy ranking, and campaign intelligence built for startups and growing businesses.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 shrink-0 shadow-xs">
          <img
            src={logoSrc}
            alt="Market Pulse"
            className="w-full h-full object-cover object-top scale-125"
          />
        </div>
        <div>
          <span className="font-bold text-xs text-slate-900 tracking-tight block">
            Market Pulse
          </span>
          <span className="text-[10px] text-slate-500 block">
            Where Every Budget Counts.
          </span>
        </div>
      </div>
    );
  }

  // Default: navbar
  return (
    <div className={`flex items-center gap-3 text-left group ${className}`}>
      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-sm flex items-center justify-center p-0.5 group-hover:scale-105 transition-transform shrink-0">
        <img
          src={logoSrc}
          alt="Market Pulse Logo"
          className="w-full h-full object-cover object-top scale-125"
        />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight font-heading">
            Market Pulse
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            Intelligence
          </span>
        </div>
        {showTagline && (
          <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
            Where Every Budget Counts.
          </p>
        )}
      </div>
    </div>
  );
};
