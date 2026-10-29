import { ExplainThisItem } from '../types';

export const EXPLANATIONS: Record<string, ExplainThisItem> = {
  cpl: {
    id: 'cpl',
    term: 'CPL — Cost Per Qualified Lead / Enquiry',
    plainTitle: 'How much you spent to get one interested potential customer',
    whatItMeans:
      'Cost per qualified lead measures the advertising money spent divided by the number of genuine, reachable enquiries you received.',
    whyItMatters:
      'Clicks and views do not pay bills. CPL tells you whether you are acquiring real potential customers at a cost your business can actually afford.',
    simpleExample:
      'If you spent ₹5,000 on Search Ads and received 10 verified phone enquiries, your cost per lead is ₹500 (₹5,000 ÷ 10).',
    whatYouCanDoNext:
      'Compare your channels. If Search delivers ₹500 CPL while Social delivers ₹1,000 CPL, consider shifting more of your budget to Search.',
  },
  suitabilityScore: {
    id: 'suitabilityScore',
    term: 'Suitability Score (0–100)',
    plainTitle: 'How closely a marketing strategy fits your specific constraints',
    whatItMeans:
      'A combined rating calculated from five clear factors: Audience fit (30%), Objective fit (25%), Budget suitability (20%), Evidence strength (15%), and Feasibility (10%).',
    whyItMatters:
      'It prevents wasting money on marketing channels that do not match your product price point, target age cohort, or available budget.',
    simpleExample:
      'A ₹25,000 budget for a local store in Chennai scores 94/100 on Local Geo-marketing, but only 55/100 on TV commercials or national PR.',
    whatYouCanDoNext:
      'Use the score as a shortlist guide. It shows strategic fit, but you should still run a small test before committing your entire budget.',
  },
  evidenceConfidence: {
    id: 'evidenceConfidence',
    term: 'Recommendation Evidence Strength',
    plainTitle: 'How much real data supports this recommendation',
    whatItMeans:
      'We divide recommendations into three transparent tiers: Strong Evidence (verified historical campaign numbers), Some Evidence (aggregated customer research), and Limited Evidence (early suggestion needing a test).',
    whyItMatters:
      'Many marketing tools promise guaranteed results. Market Pulse separates verified facts from planning assumptions so you know your true risk.',
    simpleExample:
      'Search Ads has "Strong Evidence" because your previous campaign recorded 70 leads at ₹500. Creator partnerships has "Limited Evidence" until you test it.',
    whatYouCanDoNext:
      'Start with small tests on Limited Evidence channels before allocating large budget shares.',
  },
  plannedVsActual: {
    id: 'plannedVsActual',
    term: 'Planned Budget vs Actual Expenditure',
    plainTitle: 'The difference between what you planned to spend and what you actually spent',
    whatItMeans:
      'Planned budget is your intended marketing ceiling. Actual expenditure is the verified money spent according to ad platform receipts.',
    whyItMatters:
      'Keeping planned and actual separate prevents confusing future hopes with money already spent. We never invent actual spend.',
    simpleExample:
      'You set a planned budget of ₹1,00,000. Your completed campaigns spent ₹85,000. Your remaining unallocated reserve is ₹15,000.',
    whatYouCanDoNext:
      'Check your reserve. If unallocated money remains, save it for testing your next best campaign idea.',
  },
  ctr: {
    id: 'ctr',
    term: 'CTR — Click-Through Rate',
    plainTitle: 'The percentage of people who saw your ad and clicked it',
    whatItMeans:
      'Total clicks divided by total views (impressions), multiplied by 100.',
    whyItMatters:
      'A high CTR means your hook and image caught people\'s interest. A low CTR suggests the message was not attractive or relevant.',
    simpleExample:
      'If 1,000 people saw your Instagram Reel and 25 clicked the link, your CTR is 2.5% (25 ÷ 1,000).',
    whatYouCanDoNext:
      'If CTR is below 1%, try rewriting your opening 3-second hook or using a clearer product photo.',
  },
  conversionRate: {
    id: 'conversionRate',
    term: 'Conversion Rate',
    plainTitle: 'The percentage of website visitors who took the action you wanted',
    whatItMeans:
      'The number of people who filled out your form or bought your product divided by total visits to your page.',
    whyItMatters:
      'If you send 1,000 people to a website but the form is broken or confusing, zero sales occur regardless of how good the ads were.',
    simpleExample:
      'If 200 people visit your product page and 10 submit an enquiry, your conversion rate is 5% (10 ÷ 200).',
    whatYouCanDoNext:
      'Test your mobile page speed and shorten your enquiry form to improve conversion rates.',
  },
  creativeFatigue: {
    id: 'creativeFatigue',
    term: 'Creative Fatigue',
    plainTitle: 'When an audience gets tired of seeing the exact same ad',
    whatItMeans:
      'After an ad runs for 10–14 days, the same people see it multiple times. Clicks decline and cost per lead rises.',
    whyItMatters:
      'Ad performance drops not because the product is bad, but because the audience has seen the exact video or banner too many times.',
    simpleExample:
      'In week 1, your ad gets 20 leads at ₹400 each. By week 3, the same ad costs ₹1,100 per lead because everyone has scrolled past it.',
    whatYouCanDoNext:
      'Prepare 2 or 3 alternative visual angles or headlines in Campaign Studio and rotate them every 10 days.',
  },
  intentVsInterruption: {
    id: 'intentVsInterruption',
    term: 'Intent-Based Search vs Interruption Social',
    plainTitle: 'The difference between active buyers and casual scrollers',
    whatItMeans:
      'Search ads reach people actively typing what they want right now. Social ads reach people casually browsing for entertainment.',
    whyItMatters:
      'Search ads usually produce higher enquiry rates because the buyer already knows what they want. Social ads build awareness among people who did not know you existed.',
    simpleExample:
      'Someone typing "insulated water bottle chennai" has buying intent. Someone scrolling reels is relaxing and may only "like" your post without buying.',
    whatYouCanDoNext:
      'Use Search Ads to capture existing demand. Use Social Ads to introduce your product to new people.',
  },
};
