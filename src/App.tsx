import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { StrategyFinderPage } from './pages/StrategyFinderPage';
import { CampaignStudioPage } from './pages/CampaignStudioPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { CompetitorInsightsPage } from './pages/CompetitorInsightsPage';
import { SuccessStoriesPage } from './pages/SuccessStoriesPage';
import { KnowledgeHubPage } from './pages/KnowledgeHubPage';
import { PricingPage } from './pages/PricingPage';
import { SettingsPage } from './pages/SettingsPage';
import { PulseAssistantModal } from './components/assistant/PulseAssistantModal';
import {
  getSavedBrief,
  getSavedCampaigns,
  getSavedStrategies,
  saveBrief,
  saveCampaigns,
  saveStrategies,
} from './services/storage';
import { CampaignBrief, CampaignRecord, RankedStrategy } from './types';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [brief, setBrief] = useState<CampaignBrief>(() => getSavedBrief());
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(() => getSavedCampaigns());
  const [strategies, setStrategies] = useState<RankedStrategy[]>(() => getSavedStrategies());
  const [selectedStrategyForStudio, setSelectedStrategyForStudio] = useState<RankedStrategy | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Sync state whenever demo data is reset
  const handleResetData = () => {
    const refreshedBrief = getSavedBrief();
    const refreshedCamps = getSavedCampaigns();
    const refreshedStrats = getSavedStrategies();

    setBrief(refreshedBrief);
    setCampaigns(refreshedCamps);
    setStrategies(refreshedStrats);
    setSelectedStrategyForStudio(refreshedStrats[0] || null);
  };

  const handleUpdateBrief = (newBrief: CampaignBrief) => {
    setBrief(newBrief);
    saveBrief(newBrief);
  };

  const handleUpdateStrategies = (newStrategies: RankedStrategy[]) => {
    setStrategies(newStrategies);
    saveStrategies(newStrategies);
  };

  const handleUpdateCampaigns = (newCampaigns: CampaignRecord[]) => {
    setCampaigns(newCampaigns);
    saveCampaigns(newCampaigns);
  };

  const handleSelectStrategyForStudio = (strat: RankedStrategy) => {
    setSelectedStrategyForStudio(strat);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onResetData={handleResetData}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Persistent Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
        />

        {/* Main Page Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'overview' && (
            <OverviewPage
              campaigns={campaigns}
              strategies={strategies}
              brief={brief}
              onNavigate={(tab) => setCurrentTab(tab)}
              onSelectStrategy={handleSelectStrategyForStudio}
              onUpdateCampaigns={handleUpdateCampaigns}
              onResetData={handleResetData}
            />
          )}

          {currentTab === 'strategy-finder' && (
            <StrategyFinderPage
              brief={brief}
              onUpdateBrief={handleUpdateBrief}
              strategies={strategies}
              onUpdateStrategies={handleUpdateStrategies}
              onSelectStrategyForStudio={handleSelectStrategyForStudio}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'campaign-studio' && (
            <CampaignStudioPage
              brief={brief}
              selectedStrategy={selectedStrategyForStudio || strategies[0] || null}
              onNavigate={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'data-sources' && <DataSourcesPage />}

          {currentTab === 'competitor-insights' && (
            <CompetitorInsightsPage onNavigate={(tab) => setCurrentTab(tab)} />
          )}
          {currentTab === 'success-stories' && (
            <SuccessStoriesPage onNavigate={(tab) => setCurrentTab(tab)} />
          )}

          {currentTab === 'knowledge-hub' && <KnowledgeHubPage />}

          {currentTab === 'pricing' && <PricingPage />}

          {currentTab === 'settings' && (
            <SettingsPage
              brief={brief}
              campaigns={campaigns}
              strategies={strategies}
              onResetData={handleResetData}
              onUpdateBrief={handleUpdateBrief}
            />
          )}
        </main>
      </div>

      {/* Floating Pulse Assistant Trigger Button (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white shadow-xl shadow-slate-900/20 hover:shadow-indigo-600/30 transition-all active:scale-95 border border-slate-700 hover:border-indigo-500"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-indigo-400 group-hover:text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">Pulse Assistant</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse hidden sm:inline" />
        </button>
      </div>

      {/* Contextual Pulse Assistant Chat Drawer */}
      <PulseAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        activeBrief={brief}
        activeStrategy={selectedStrategyForStudio || strategies[0] || null}
        currentTab={currentTab}
      />
    </div>
  );
}
