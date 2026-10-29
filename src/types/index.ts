export type CampaignObjective =
  | 'Lead Generation'
  | 'Brand Awareness'
  | 'Online Sales'
  | 'Store Visits'
  | 'Customer Retention'
  | 'Product Launch';

export type BrandTone =
  | 'Trendy and energetic'
  | 'Friendly and casual'
  | 'Professional'
  | 'Premium and elegant'
  | 'Funny and playful';

export type SocialPlatform = 'instagram' | 'youtube' | 'x' | 'facebook' | 'linkedin';

export interface CampaignBrief {
  businessName: string;
  product: string;
  productCategory: string;
  targetAudience: string;
  audienceAgeRange: string;
  geography: string;
  objective: CampaignObjective;
  budget: number; // in INR
  campaignDurationDays: number;
  preferredChannels: string[];
  excludedChannels: string[];
  productPositioning: string;
  constraints: string;
}

export interface ScoringFactors {
  audienceFit: number; // 0-100 (Weight: 30%)
  objectiveFit: number; // 0-100 (Weight: 25%)
  budgetFit: number; // 0-100 (Weight: 20%)
  evidenceStrength: number; // 0-100 (Weight: 15%)
  executionFeasibility: number; // 0-100 (Weight: 10%)
  datasetEmpiricalFit?: number; // 0-100 derived from the 45,000 records
}

export interface RankedStrategy {
  id: string;
  rank: number;
  name: string;
  channelType: string;
  suitabilityScore: number; // 0-100
  factors: ScoringFactors;
  explanation: string;
  audienceFitDesc: string;
  objectiveFitDesc: string;
  budgetSuitabilityDesc: string;
  evidenceStrengthDesc: string;
  executionFeasibilityDesc: string;
  datasetValidationNote?: string;
  evidenceConfidenceLevel?: 'Strong evidence' | 'Some evidence' | 'Limited evidence';
  evidenceConfidenceReason?: string;
  suggestedBudgetPercent: number;
  suggestedBudgetAmount: number;
  recommendedDurationDays: number;
  creativeFormat: string;
  primaryKpi: string;
  keyAssumptions: string[];
  limitationsAndRisks: string[];
  suggestedInitialTest: string;
  iconName: string;
}

export type CampaignStatus =
  | 'Draft'
  | 'Planned'
  | 'Approved'
  | 'Running'
  | 'Completed'
  | 'Results Pending Review';

export interface FollowUpResults {
  actualExpenditure: number;
  qualifiedLeads: number;
  calculatedCpl: number;
  conversions: number | null;
  revenue: number | null;
  roas: number | null;
  notes: string;
  goalStatus: 'Met' | 'Partially Met' | 'Exceeded' | 'Not Met' | 'Insufficient Data';
  updatedAt: string;
}

export interface CampaignRecord {
  id: string;
  name: string;
  product: string;
  objective: CampaignObjective;
  createdAt: string;
  plannedBudget: number;
  actualExpenditure: number | null;
  qualifiedLeads: number | null;
  calculatedCpl: number | null;
  conversions: number | null;
  revenue: number | null;
  roas: number | null;
  channels: string[];
  status: CampaignStatus;
  selectedStrategy: RankedStrategy | null;
  contentDrafts?: Record<string, any>;
  notes?: string;
  results?: FollowUpResults | null;
  isSynthetic: boolean;
}

export interface ContentDraft {
  instagram?: {
    hook: string;
    caption: string;
    hashtags: string[];
    cta: string;
    visualConcept: string;
  };
  youtube?: {
    title: string;
    description: string;
    hookScript: string;
    hashtags: string[];
    thumbnailConcept: string;
    cta: string;
  };
  x?: {
    post: string;
    hashtags: string[];
    alternative?: string;
    cta: string;
  };
  facebook?: {
    post: string;
    offerSummary: string;
    cta: string;
    visualConcept: string;
  };
  linkedin?: {
    post: string;
    hashtags: string[];
    businessAngle: string;
    cta: string;
  };
}

export interface CompetitorInsight {
  id: string;
  competitorName: string;
  productCategory: string;
  companyType: 'D2C Brand' | 'Retail Giant' | 'Regional Specialist' | 'Budget Manufacturer' | 'Tech Startup';
  nemesisType: 'Direct Market Rival' | 'Low-Cost Disrupter' | 'Legacy Incumbent' | 'Fast-Following Clone';
  threatLevel: 'Critical' | 'High' | 'Moderate';
  publicSourceUrl: string;
  dateObserved: string;
  message: string;
  creativeFormat: string;
  visibleOffer: string;
  publicCta: string;
  landingPageMessaging: string;
  vulnerabilityWeakness: string;
  counterAttackAngle: string;
  differentiationOpportunity: string;
  pricingTier: string;
  confidenceNotes: string;
  isSynthetic: boolean;
}

export interface DatasetColumnMeta {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  missingCount: number;
  sampleValue: string;
}

export interface CustomerDatasetSummary {
  fileName: string;
  totalRecords: number;
  totalColumns: number;
  columns: DatasetColumnMeta[];
  duplicateCount: number;
  validationWarnings: string[];
  platformDistribution: { platform: string; count: number; percentage: number }[];
  ageCohortDistribution: { cohort: string; count: number; topPlatform: string; avgEngagementRate: number }[];
  isSynthetic: boolean;
  uploadedAt: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextTag?: string;
}

export interface ClarityCheckItem {
  id: string;
  label: string;
  status: 'complete' | 'incomplete';
  plainAction: string;
  category: 'Objective' | 'Audience' | 'Budget' | 'Channel' | 'Content' | 'Metric' | 'Tracking';
}

export interface MarketingClaritySummary {
  score: number; // 0-100
  completedCount: number;
  totalCount: number;
  items: ClarityCheckItem[];
  scoringMethodExplanation: string;
}

export interface ActionableRecommendation {
  id: string;
  title: string;
  whatNeedsAttention: string;
  whyItMatters: string;
  simpleNextStep: string;
  linkTab: string;
  badge: string;
  isDemo?: boolean;
}

export interface MarketingExperiment {
  id: string;
  title: string;
  question: string;
  ideaOrChange: string;
  targetAudience: string;
  plannedBudget: number;
  durationDays: number;
  mainSuccessMetric: string;
  minDataNeeded: string;
  continueCriteria: string;
  stopCriteria: string;
  channel: string;
}

export interface BudgetScenario {
  id: string;
  name: string;
  planType: 'Single Focus Channel' | 'Split Across Two Channels' | 'Test & Learn Reserve';
  description: string;
  allocations: { channel: string; percent: number; amount: number }[];
  tradeOffs: {
    simplicity: string;
    reachPotential: string;
    measurementEase: string;
    executionEffort: string;
    mainRisk: string;
  };
}

export interface ExplainThisItem {
  id: string;
  term: string;
  plainTitle: string;
  whatItMeans: string;
  whyItMatters: string;
  simpleExample: string;
  whatYouCanDoNext: string;
}

export interface DecisionHistoryRecord {
  id: string;
  date: string;
  originalObjective: string;
  recommendedStrategy: string;
  reasonForSelection: string;
  plannedBudget: number;
  actualBudget: number | null;
  recordedResults: string;
  whatToChangeNext: string;
  status: 'In Progress' | 'Reviewed' | 'Archived';
}

export interface SuccessStory {
  id: string;
  brand: string;
  campaignName: string;
  category: string;
  dateOrYear: string;
  challenge: string;
  bigIdea: string;
  whereItAppeared: string;
  whyItWorked: string;
  reportedResults: { metric: string; context: string; source: string }[];
  smallBusinessLessons: string[];
  tryItInMarketPulse: string;
  sources: { title: string; url: string }[];
  isShowcaseDemo?: boolean;
  tagline: string;
}

export interface MarketingToolComparison {
  id: string;
  name: string;
  vendor: string;
  whatItIs: string;
  bestFor: string;
  strengths: string[];
  practicalUses: string[];
  considerations: string[];
  howMarketPulseFits: string;
  officialUrl: string;
  lastChecked: string;
  pricingSummary: string;
}

