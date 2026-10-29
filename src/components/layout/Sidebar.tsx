import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  PenTool,
  Database,
  Crosshair,
  BookOpen,
  CreditCard,
  Settings,
  Cpu,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Award,
  Compass,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const [aiStatus, setAiStatus] = useState<{ enabled: boolean; model: string }>({
    enabled: true,
    model: 'gemini-3.8-flash',
  });

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status === 'ok') {
          setAiStatus({
            enabled: data.aiEnabled,
            model: data.model || 'gemini-3.8-flash',
          });
        }
      })
      .catch(() => {
        // graceful offline fallback
        setAiStatus({ enabled: false, model: 'deterministic-fallback' });
      });
  }, []);

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: '3 Runs',
      description: 'Saved strategies & analytics',
    },
    {
      id: 'strategy-finder',
      label: 'Strategy Finder',
      icon: Sparkles,
      badge: 'Core AI',
      badgeColor: 'bg-indigo-100 text-indigo-700 font-semibold',
      description: 'Ranked channel models',
    },
    {
      id: 'campaign-studio',
      label: 'Campaign Studio',
      icon: PenTool,
      badge: '5 Platforms',
      description: 'Platform content generator',
    },
    {
      id: 'data-sources',
      label: 'Data Sources',
      icon: Database,
      badge: '45k Rows',
      description: 'Customer dataset & CSVs',
    },
    {
      id: 'competitor-insights',
      label: 'Marketing Tools',
      icon: Compass,
      badge: 'Compare',
      description: 'Tool guide & selector',
    },
    {
      id: 'success-stories',
      label: 'Success Stories',
      icon: Award,
      badge: 'Real & Demos',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold',
      description: 'Verified lessons & demos',
    },
    {
      id: 'knowledge-hub',
      label: 'Knowledge Hub',
      icon: BookOpen,
      description: 'Metrics glossary & guides',
    },
    {
      id: 'pricing',
      label: 'Pricing & Plans',
      icon: CreditCard,
      description: 'Tiers & fee calculator',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Workspace preferences',
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800 hidden md:flex">
      {/* Official Brand Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80">
        <BrandLogo variant="sidebar" showTagline={true} />
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Marketing Intelligence</span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs sm:text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <div className="truncate">
                  <div className="leading-tight">{item.label}</div>
                  <div className={`text-[10px] truncate ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {item.description}
                  </div>
                </div>
              </div>
              {item.badge && (
                <span
                  className={`ml-2 text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                    isActive
                      ? 'bg-indigo-700/80 text-indigo-100'
                      : item.badgeColor || 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Workspace Health & Strategy Quick Summary */}
      <div className="p-3 mx-3 my-2 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-2">
        <div className="flex items-center justify-between font-medium text-slate-200">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Decision Engine
          </span>
          <span className="text-emerald-400 text-[11px] font-semibold">Ready</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          Every recommendation has a transparent mathematical reason.
        </p>
        <div className="pt-1 flex items-center gap-1 text-[10px] text-indigo-300">
          <ShieldCheck className="w-3 h-3 text-indigo-400" />
          <span>No unmeasured ROI fabricated</span>
        </div>
      </div>

      {/* Footer Status */}
      <div className="p-3 border-t border-slate-800 text-xs bg-slate-950/40">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-indigo-400" />
            AI Intelligence Core
          </span>
          {aiStatus.enabled ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Online
            </span>
          ) : (
            <span className="text-amber-400 text-[10px] font-medium">Deterministic</span>
          )}
        </div>
        <div className="text-[10px] text-slate-400 truncate">
          Model: <span className="text-slate-300 font-mono">{aiStatus.model}</span>
        </div>
      </div>
    </aside>
  );
};
