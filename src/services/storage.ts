import { CampaignBrief, CampaignRecord, CompetitorInsight, RankedStrategy } from '../types';
import { calculateStrategyRankings } from './rankingEngine';

const STORAGE_KEY_CAMPAIGNS = 'market_pulse_campaigns_v1';
const STORAGE_KEY_STRATEGIES = 'market_pulse_strategies_v1';
const STORAGE_KEY_BRIEF = 'market_pulse_active_brief_v1';
const STORAGE_KEY_SETTINGS = 'market_pulse_settings_v1';

export const INITIAL_DEMO_BRIEF: CampaignBrief = {
  businessName: 'EcoSip Demo Store',
  product: 'EcoSip Reusable Stainless Bottles',
  productCategory: 'Sustainable Lifestyle & Drinkware',
  targetAudience: 'College students and young professionals',
  audienceAgeRange: '19–25',
  geography: 'Chennai, India',
  objective: 'Lead Generation',
  budget: 100000, // ₹1,00,000
  campaignDurationDays: 30,
  preferredChannels: ['Paid Social Campaigns', 'Search Advertising', 'Short-Form Video'],
  excludedChannels: [],
  productPositioning: 'Insulated 24hr cold temperature retention with sleek ergonomic design for campus and office',
  constraints: '₹1,00,000 total planned budget across 30 days; priority on qualified product enquiries over passive views',
};

export const INITIAL_DEMO_CAMPAIGNS: CampaignRecord[] = [
  {
    id: 'camp-demo-1',
    name: 'Social Campaign A (Instagram & Meta)',
    product: 'EcoSip Reusable Bottles',
    objective: 'Lead Generation',
    createdAt: '2026-09-15',
    plannedBudget: 40000,
    actualExpenditure: 40000,
    qualifiedLeads: 40,
    calculatedCpl: 1000, // ₹40,000 / 40
    conversions: null, // "Do not invent impressions, revenue, conversions, or actual sales"
    revenue: null,
    roas: null,
    channels: ['Paid Social (Instagram & Meta Ads)'],
    status: 'Completed',
    selectedStrategy: null,
    isSynthetic: true,
    notes: 'Clicks: 2,000. Qualified leads: 40. High top-funnel engagement with ₹1,000 CPL. Requires tighter lead form qualification questions.',
  },
  {
    id: 'camp-demo-2',
    name: 'Search Campaign B (Google Intent Ads)',
    product: 'EcoSip Reusable Bottles',
    objective: 'Lead Generation',
    createdAt: '2026-09-20',
    plannedBudget: 35000,
    actualExpenditure: 35000,
    qualifiedLeads: 70,
    calculatedCpl: 500, // ₹35,000 / 70
    conversions: null,
    revenue: null,
    roas: null,
    channels: ['Search Engine Advertising (Google Ads)'],
    status: 'Completed',
    selectedStrategy: null,
    isSynthetic: true,
    notes: 'Clicks: 1,000. Qualified leads: 70. Outstanding conversion efficiency at ₹500 CPL on high-intent terms ("insulated water bottle chennai").',
  },
  {
    id: 'camp-demo-3',
    name: 'Email Campaign C (Subscriber Nurturing)',
    product: 'EcoSip Reusable Bottles',
    objective: 'Lead Generation',
    createdAt: '2026-09-28',
    plannedBudget: 10000,
    actualExpenditure: 10000,
    qualifiedLeads: 20,
    calculatedCpl: 500, // ₹10,000 / 20
    conversions: null,
    revenue: null,
    roas: null,
    channels: ['Email Marketing & Lifecycle Nurturing'],
    status: 'Completed',
    selectedStrategy: null,
    isSynthetic: true,
    notes: 'Clicks: 500. Qualified leads: 20. Efficient ₹500 CPL; excellent retention among past workshop attendees and newsletter signups.',
  },
];

export const INITIAL_COMPETITOR_INSIGHTS: CompetitorInsight[] = [
  {
    id: 'comp-1',
    competitorName: 'HydroVibe India',
    productCategory: 'Drinkware & Insulated Flasks',
    companyType: 'D2C Brand',
    nemesisType: 'Direct Market Rival',
    threatLevel: 'Critical',
    pricingTier: 'Mid-Market (₹999 - ₹1,499)',
    publicSourceUrl: 'https://hydrovibe.example.com/festive-sale',
    dateObserved: '2026-10-18',
    message: '"Stay Hydrated, Stay Active — 100% Leakproof Gym Flasks"',
    creativeFormat: 'Influencer gym workout reels & static pastel product collages',
    visibleOffer: 'Flat 20% off with coupon VIBE20 + Free Sipper Straw',
    publicCta: 'Shop Gym Flasks Now',
    landingPageMessaging: 'Heavy fitness and athlete endorsements; focus on 1-liter capacity',
    vulnerabilityWeakness: 'Heavy single-piece design creates metallic taste complaints; bulky 1-liter bottles do not fit into standard university or laptop backpacks.',
    counterAttackAngle: 'Launch the "Campus & Commute" campaign showing EcoSip fitting snugly in laptop backpacks, 24-hour ice test, and zero metallic odor.',
    differentiationOpportunity: 'Position EcoSip on sleek student/workplace aesthetics, all-day 24hr temperature retention, and eco-friendly zero-plastic packaging rather than gym bodybuilding.',
    confidenceNotes: 'Publicly observed website promotion and Instagram public sponsored posts. No internal spend or conversion data fabricated.',
    isSynthetic: true,
  },
  {
    id: 'comp-2',
    competitorName: 'PureSteel Lifestyle',
    productCategory: 'Stainless Steel Homeware',
    companyType: 'Retail Giant',
    nemesisType: 'Legacy Incumbent',
    threatLevel: 'Moderate',
    pricingTier: 'Budget (₹499 - ₹799)',
    publicSourceUrl: 'https://puresteel.example.in/campus-edition',
    dateObserved: '2026-10-22',
    message: '"Ditch Single-Use Plastic — The Bottle That Lasts a Decade"',
    creativeFormat: 'Carousel infographics on ocean plastic statistics + Student unboxing videos',
    visibleOffer: 'Buy 2 Get 1 Free for College Dorms',
    publicCta: 'Order Campus Bundle',
    landingPageMessaging: 'Environmental activism angle; campus ambassador recruitment',
    vulnerabilityWeakness: 'Single-wall construction does not keep water cold in Indian summer; sweat condensation damages notebooks and laptop sleeves.',
    counterAttackAngle: 'Create side-by-side condensation ice test: Show PureSteel sweating all over textbooks vs EcoSip double-vacuum cold insulation completely dry.',
    differentiationOpportunity: 'PureSteel bottles are bulky and plain silver. EcoSip differentiates on ergonomic pastel colorways, customized engraving, and lightweight double-wall technology.',
    confidenceNotes: 'Public social campaign audit. Illustrative benchmark for student pricing and bundle mechanics.',
    isSynthetic: true,
  },
  {
    id: 'comp-3',
    competitorName: 'Apex Mobile (Competitor to Lico23)',
    productCategory: 'Consumer Electronics / Smartphones',
    companyType: 'Tech Startup',
    nemesisType: 'Fast-Following Clone',
    threatLevel: 'High',
    pricingTier: 'Mid-Market (₹21,999 - ₹25,999)',
    publicSourceUrl: 'https://apexmobile.example.in/flagship-killer',
    dateObserved: '2026-10-25',
    message: '"Flagship Performance at Mid-Range Price — Ultra 120Hz Display"',
    creativeFormat: 'Tech YouTuber benchmark teardowns & fast-paced gaming challenge reels',
    visibleOffer: '₹3,000 instant bank discount + 6 months no-cost EMI',
    publicCta: 'Pre-book Now with ₹999 Deposit',
    landingPageMessaging: 'Heavy emphasis on processor clock speed, battery mAh, and camera sensor specs',
    vulnerabilityWeakness: 'High thermal throttling during 20+ min outdoor video capture; poor after-sales repair support outside major metro centers.',
    counterAttackAngle: 'Run real-life creator stability and heat camera tests showing Lico23 staying cool while vlogging in Indian outdoor heat.',
    differentiationOpportunity: 'Lico23 can win by highlighting real-world creator camera stability, sleek lightweight build, and localized customer service support across Tier 1 & 2 cities.',
    confidenceNotes: 'Public ecommerce listing and press release highlights. Illustrative tech market benchmark.',
    isSynthetic: true,
  },
  {
    id: 'comp-4',
    competitorName: 'QuickDrop Homeware',
    productCategory: 'Drinkware & Insulated Flasks',
    companyType: 'Budget Manufacturer',
    nemesisType: 'Low-Cost Disrupter',
    threatLevel: 'Moderate',
    pricingTier: 'Ultra-Budget (₹299 - ₹399)',
    publicSourceUrl: 'https://quickdrop.example.in/flash-sale',
    dateObserved: '2026-10-27',
    message: '"Stainless Bottles at Plastic Prices — Free Cash on Delivery"',
    creativeFormat: 'High-energy discount countdown banners & WhatsApp flash sales',
    visibleOffer: '₹349 Flash Sale + Free Shipping on Prepaid UPI',
    publicCta: 'Order via WhatsApp Instantly',
    landingPageMessaging: 'Extreme discount focus; low-resolution imported photos',
    vulnerabilityWeakness: 'Uses inferior grade 201 steel that rusts within 3 weeks; hazardous chemical plastic lids with zero food-grade certification.',
    counterAttackAngle: 'Run a "Safe Hydration" PSA campaign demonstrating 304 food-grade stainless steel vs cheap industrial alloys.',
    differentiationOpportunity: 'Offer lifetime leakproof warranty, certified BPA-free food-grade build, and luxury unboxing experience.',
    confidenceNotes: 'Observed social ads on Meta feed and marketplace listings.',
    isSynthetic: true,
  },
];

export function getSavedCampaigns(): CampaignRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CAMPAIGNS);
    if (!raw) {
      saveCampaigns(INITIAL_DEMO_CAMPAIGNS);
      return INITIAL_DEMO_CAMPAIGNS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_CAMPAIGNS;
  }
}

export function saveCampaigns(campaigns: CampaignRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns));
  } catch (err) {
    console.error('Failed to save campaigns:', err);
  }
}

export function getSavedBrief(): CampaignBrief {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BRIEF);
    if (!raw) {
      saveBrief(INITIAL_DEMO_BRIEF);
      return INITIAL_DEMO_BRIEF;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DEMO_BRIEF;
  }
}

export function saveBrief(brief: CampaignBrief): void {
  try {
    localStorage.setItem(STORAGE_KEY_BRIEF, JSON.stringify(brief));
  } catch (err) {
    console.error('Failed to save brief:', err);
  }
}

export function getSavedStrategies(): RankedStrategy[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STRATEGIES);
    if (!raw) {
      const defaultStrats = calculateStrategyRankings(INITIAL_DEMO_BRIEF);
      saveStrategies(defaultStrats);
      return defaultStrats;
    }
    return JSON.parse(raw);
  } catch {
    return calculateStrategyRankings(INITIAL_DEMO_BRIEF);
  }
}

export function saveStrategies(strategies: RankedStrategy[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_STRATEGIES, JSON.stringify(strategies));
  } catch (err) {
    console.error('Failed to save strategies:', err);
  }
}

export function resetDemoData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_CAMPAIGNS);
    localStorage.removeItem(STORAGE_KEY_STRATEGIES);
    localStorage.removeItem(STORAGE_KEY_BRIEF);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);

    saveCampaigns(INITIAL_DEMO_CAMPAIGNS);
    saveBrief(INITIAL_DEMO_BRIEF);
    saveStrategies(calculateStrategyRankings(INITIAL_DEMO_BRIEF));
  } catch (err) {
    console.error('Failed to reset demo data:', err);
  }
}
