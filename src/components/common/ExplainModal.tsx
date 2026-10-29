import React from 'react';
import { HelpCircle, X, Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ExplainThisItem } from '../../types';

interface ExplainModalProps {
  item: ExplainThisItem | null;
  onClose: () => void;
}

export const ExplainModal: React.FC<ExplainModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Explain This to Me
              </span>
              <h3 className="font-bold text-base text-slate-900 leading-tight">
                {item.term}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plain title */}
        <p className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          💡 {item.plainTitle}
        </p>

        {/* 4 Essential Sections */}
        <div className="space-y-3 text-xs leading-relaxed">
          {/* 1. What it means */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 inline-flex items-center justify-center font-bold text-[10px]">1</span>
              What It Means
            </h4>
            <p className="text-slate-600 pl-5.5">{item.whatItMeans}</p>
          </div>

          {/* 2. Why it matters */}
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 inline-flex items-center justify-center font-bold text-[10px]">2</span>
              Why It Matters
            </h4>
            <p className="text-slate-600 pl-5.5">{item.whyItMatters}</p>
          </div>

          {/* 3. Simple example */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 space-y-1">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Simple Example (Illustrative)
            </h4>
            <p className="text-amber-900 text-xs leading-relaxed">{item.simpleExample}</p>
          </div>

          {/* 4. What you can do next */}
          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 space-y-1">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              What You Can Do Next
            </h4>
            <p className="text-emerald-900 text-xs leading-relaxed">{item.whatYouCanDoNext}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            Got It, Thanks
          </button>
        </div>
      </div>
    </div>
  );
};
