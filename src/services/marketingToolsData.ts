import { MarketingToolComparison } from '../types';

export const MARKETING_TOOLS_CATALOG: MarketingToolComparison[] = [
  {
    id: 'tool-google-ads',
    name: 'Google Ads',
    vendor: 'Google',
    whatItIs: 'An online advertising platform where businesses bid to display ads to people searching on Google or watching videos on YouTube.',
    bestFor: 'Businesses wanting to capture active customer buying intent right when people search for their specific products or services.',
    strengths: [
      'Captures high purchase intent ("near me" searches, product comparison terms).',
      'Massive global and local reach across Google Search, YouTube, Maps, and Display network.',
      'Robust automated bidding algorithms (Target CPA, Target ROAS).',
    ],
    practicalUses: [
      'Show text ads when someone searches "insulated water bottle chennai".',
      'Play 15-second skippable video ads before relevant YouTube product reviews.',
      'Promote your retail store pin when locals search on Google Maps.',
    ],
    considerations: [
      'Keyword auctions can be competitive and costly if bidding wars occur.',
      'Requires a clear understanding of match types, negative keywords, and landing page quality.',
      'Results are not guaranteed; you still need a compelling offer and fast mobile website.',
    ],
    howMarketPulseFits:
      'Market Pulse helps you define your budget, extract your positioning, and determine whether search intent is your #1 strategic channel before you spend money setting up Google Ads campaigns.',
    officialUrl: 'https://ads.google.com',
    lastChecked: 'October 2026',
    pricingSummary: 'Pay-per-click (PPC) model. No platform subscription fee; you pay only when someone clicks your ad based on your budget limit.',
  },
  {
    id: 'tool-meta-ads',
    name: 'Meta Ads Manager',
    vendor: 'Meta (Instagram & Facebook)',
    whatItIs: 'An advertising management platform for creating, targeting, and optimizing visual photo, carousel, and video campaigns across Instagram, Facebook, and Messenger.',
    bestFor: 'Consumer brands, lifestyle products, and visual goods looking to build discovery, community awareness, and instant message leads.',
    strengths: [
      'Exceptional visual discovery format (Reels, Stories, Carousels).',
      'Advantage+ machine learning audience finding based on creative engagement.',
      'Native instant lead forms and direct WhatsApp click-to-chat integration.',
    ],
    practicalUses: [
      'Show 9:16 vertical video Reels demonstrating how a product works.',
      'Run instant click-to-WhatsApp ads for local showroom enquiries.',
      'Retarget visitors who viewed your product page in the past 30 days.',
    ],
    considerations: [
      'Audience can experience creative wear-out (ad fatigue) within 10–14 days.',
      'High vanity metrics (likes, video views) do not automatically equal sales enquiries.',
      'Requires regular production of fresh, eye-catching visual and video assets.',
    ],
    howMarketPulseFits:
      'Market Pulse drafts platform-specific Instagram hooks, captions, and Reel concepts in Campaign Studio, ensuring your Meta ads have a clear value proposition before you launch them.',
    officialUrl: 'https://www.facebook.com/business/tools/ads-manager',
    lastChecked: 'October 2026',
    pricingSummary: 'Auction-based model (CPM / CPC). Set your own daily or lifetime budget (e.g. ₹500/day minimum feasible test).',
  },
  {
    id: 'tool-hubspot',
    name: 'HubSpot Marketing Hub',
    vendor: 'HubSpot',
    whatItIs: 'An inbound marketing, lead capture, email automation, and customer relationship management (CRM) platform.',
    bestFor: 'Growing businesses and B2B teams wanting to nurture captured leads into long-term paying customers through automated email and contact tracking.',
    strengths: [
      'All-in-one CRM integration connecting website forms, email workflows, and sales pipelines.',
      'Drag-and-drop landing page and email template builder.',
      'Clear contact timeline showing every email opened and page visited by a prospect.',
    ],
    practicalUses: [
      'Automatically send a 3-part welcome email sequence when someone downloads a buyer guide.',
      'Alert your sales team when a prospect visits the pricing page twice in 24 hours.',
      'Track which marketing source generated the highest lifetime customer value.',
    ],
    considerations: [
      'Pricing increases significantly as your contact database grows into higher tiers.',
      'Requires time and process discipline to keep contact records clean and updated.',
      'Does not replace ad spending; it manages leads after you acquire them.',
    ],
    howMarketPulseFits:
      'Market Pulse recommends when to invest in lifecycle nurturing and provides direct copy templates that you can paste into your HubSpot email drip sequences.',
    officialUrl: 'https://www.hubspot.com/products/marketing',
    lastChecked: 'October 2026',
    pricingSummary: 'Free tier with basic tools; paid Starter plans from ~$20/month; Professional tiers scale based on contact count.',
  },
  {
    id: 'tool-looker-studio',
    name: 'Looker Studio (formerly Data Studio)',
    vendor: 'Google Cloud',
    whatItIs: 'A free business intelligence and reporting tool that turns raw marketing spreadsheets and ad data into shareable visual dashboards.',
    bestFor: 'Marketers, agencies, and founders who need to combine data from Google Ads, Meta Ads, and spreadsheets into one executive report.',
    strengths: [
      'Free to use with native Google connectors (Google Ads, Analytics, Sheets, BigQuery).',
      'Highly customizable charts, date filters, and automated scheduled PDF email reports.',
      'Easy sharing and collaborative dashboard editing like Google Docs.',
    ],
    practicalUses: [
      'Build a single dashboard showing total ad spend and total leads across all platforms.',
      'Create an automated weekly email report for team members or investors.',
      'Compare this month\'s cost per lead against the same month last year.',
    ],
    considerations: [
      'Connecting non-Google platforms (like Meta Ads or Shopify) may require third-party paid partner connectors.',
      'Requires basic data fluency to blend multiple data sources accurately.',
      'Does not create campaigns or provide strategy recommendations; it only displays past data.',
    ],
    howMarketPulseFits:
      'Market Pulse provides the strategic reasoning and budget recommendations that you can track and review long-term inside Looker Studio reports.',
    officialUrl: 'https://lookerstudio.google.com',
    lastChecked: 'October 2026',
    pricingSummary: 'Core Looker Studio is free. Optional Looker Studio Pro enterprise add-ons are available for large organizations.',
  },
  {
    id: 'tool-adobe-campaign',
    name: 'Adobe Campaign (Adobe Experience Cloud)',
    vendor: 'Adobe',
    whatItIs: 'An enterprise-grade cross-channel campaign orchestration and customer journey automation software within Adobe Experience Cloud.',
    bestFor: 'Large enterprises and multinational organizations managing millions of customer profiles across mobile push, email, direct mail, and offline retail.',
    strengths: [
      'Enterprise scale capable of orchestrating complex omnichannel customer journeys.',
      'Deep integration with Adobe Experience Platform, Adobe Analytics, and Creative Cloud assets.',
      'Advanced enterprise governance, role-based permissions, and localized multi-country routing.',
    ],
    practicalUses: [
      'Coordinate personalized mobile app push notifications synchronized with retail store beacon check-ins.',
      'Manage multi-language marketing campaigns across 30+ countries from a central governance team.',
    ],
    considerations: [
      'Designed specifically for large enterprise IT environments; high implementation and licensing cost.',
      'Requires specialized technical administrators and extensive team training.',
      'Overkill for small businesses, solo founders, or early-stage startups.',
    ],
    howMarketPulseFits:
      'Market Pulse is built specifically for small businesses, startups, and lean teams who need simple, affordable, immediate marketing intelligence without enterprise software complexity.',
    officialUrl: 'https://business.adobe.com/products/campaign/adobe-campaign.html',
    lastChecked: 'October 2026',
    pricingSummary: 'Annual enterprise custom licensing tailored to organization size and profile volumes; quote-based.',
  },
];
