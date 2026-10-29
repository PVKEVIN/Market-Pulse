import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '20mb' }));

// Initialize Gemini SDK if API key is provided
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
} else {
  console.log('GEMINI_API_KEY not configured or placeholder detected. Operating in deterministic heuristic fallback mode.');
}

// Status endpoint
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiEnabled: !!aiClient,
    model: aiClient ? 'gemini-3.8-flash' : 'deterministic-fallback',
    timestamp: new Date().toISOString(),
  });
});

// Natural Language Brief Extraction Endpoint
app.post('/api/gemini/extract-brief', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  // If Gemini API is available, ask model with strict JSON response
  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an expert marketing intelligence analyst. Extract the structured campaign requirements from the following marketing brief:

"${prompt}"

Return ONLY a JSON object with this exact shape:
{
  "businessName": "extracted business name or empty string if not mentioned",
  "product": "name of product or service",
  "productCategory": "category like Electronics, Apparel, F&B, SaaS, Retail, etc.",
  "targetAudience": "description of audience",
  "audienceAgeRange": "e.g. 19-25 or All Ages",
  "geography": "target city, state, or country",
  "objective": "one of: Lead Generation, Brand Awareness, Online Sales, Store Visits, Customer Retention, Product Launch",
  "budget": number in Indian Rupees (INR) - e.g. 5000000 for 50 lakh, 25000 for 25k, or 100000 default if not specified,
  "campaignDurationDays": number of days (e.g. 30, 14, 60),
  "preferredChannels": ["Channel 1", "Channel 2"],
  "excludedChannels": [],
  "productPositioning": "summary of key angle or USP",
  "constraints": "any stated budget, timing, or creative constraints"
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, brief: parsed, source: 'gemini' });
      }
    } catch (apiErr) {
      console.warn('Gemini extraction failed, falling back to deterministic heuristic:', apiErr);
    }
  }

  // Deterministic NLP fallback parser
  const lower = prompt.toLowerCase();
  
  // Extract budget
  let budget = 100000; // default ₹1,00,000
  const lakhMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)/i);
  const kMatch = prompt.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand)/i);
  const rupeeMatch = prompt.match(/[₹Rs\.]\s*([\d,]+)/i);

  if (lakhMatch) {
    budget = parseFloat(lakhMatch[1]) * 100000;
  } else if (kMatch) {
    budget = parseFloat(kMatch[1]) * 1000;
  } else if (rupeeMatch) {
    budget = parseInt(rupeeMatch[1].replace(/,/g, ''), 10) || 100000;
  }

  // Extract duration
  let duration = 30;
  const daysMatch = prompt.match(/(\d+)\s*(?:days|day)/i);
  const weeksMatch = prompt.match(/(\d+)\s*(?:weeks|week)/i);
  const monthsMatch = prompt.match(/(\d+)\s*(?:months|month)/i);
  if (daysMatch) duration = parseInt(daysMatch[1], 10);
  else if (weeksMatch) duration = parseInt(weeksMatch[1], 10) * 7;
  else if (monthsMatch) duration = parseInt(monthsMatch[1], 10) * 30;

  // Extract age
  let ageRange = '18–35';
  const ageMatch = prompt.match(/(\d{2}\s*[-–to]+\s*\d{2})/i) || prompt.match(/(?:youngsters|youth|teens|students|professionals)/i);
  if (ageMatch) {
    ageRange = ageMatch[0];
  }

  // Objective detection
  let objective = 'Lead Generation';
  if (lower.includes('awareness') || lower.includes('reach') || lower.includes('brand')) {
    objective = 'Brand Awareness';
  } else if (lower.includes('store visit') || lower.includes('footfall') || lower.includes('offline')) {
    objective = 'Store Visits';
  } else if (lower.includes('sales') || lower.includes('purchase') || lower.includes('e-commerce') || lower.includes('buy')) {
    objective = 'Online Sales';
  } else if (lower.includes('launch') || lower.includes('introduce')) {
    objective = 'Product Launch';
  } else if (lower.includes('retention') || lower.includes('loyalty')) {
    objective = 'Customer Retention';
  }

  // Geography detection
  let geography = 'India';
  const cities = ['chennai', 'mumbai', 'delhi', 'bengaluru', 'bangalore', 'hyderabad', 'kolkata', 'pune', 'ahmedabad', 'jaipur', 'india'];
  for (const city of cities) {
    if (lower.includes(city)) {
      geography = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // Product extraction heuristics
  let product = 'Product / Service';
  let category = 'Retail & Consumer Goods';
  if (lower.includes('phone') || lower.includes('lico23') || lower.includes('smartphone') || lower.includes('gadget')) {
    product = 'Lico23 Smartphone';
    category = 'Consumer Electronics';
  } else if (lower.includes('clothing') || lower.includes('festive') || lower.includes('apparel') || lower.includes('wear')) {
    product = 'Festive Apparel Collection';
    category = 'Fashion & Apparel';
  } else if (lower.includes('bottle') || lower.includes('ecosip') || lower.includes('drinkware')) {
    product = 'EcoSip Reusable Bottles';
    category = 'Sustainable Lifestyle';
  } else if (lower.includes('saas') || lower.includes('software') || lower.includes('app')) {
    product = 'B2B Software Platform';
    category = 'SaaS & Technology';
  }

  // Preferred channels based on prompt
  const preferredChannels: string[] = [];
  if (lower.includes('social') || lower.includes('instagram') || lower.includes('meta')) preferredChannels.push('Paid Social (Instagram & Meta)');
  if (lower.includes('search') || lower.includes('google')) preferredChannels.push('Search Engine Advertising (Google Ads)');
  if (lower.includes('creator') || lower.includes('influencer')) preferredChannels.push('Creator & Influencer Partnerships');
  if (lower.includes('video') || lower.includes('youtube') || lower.includes('reels')) preferredChannels.push('Short-Form Video & YouTube');
  if (lower.includes('email') || lower.includes('newsletter')) preferredChannels.push('Email Marketing & Nurturing');

  if (preferredChannels.length === 0) {
    preferredChannels.push('Paid Social Campaigns', 'Search Advertising', 'Short-Form Video');
  }

  res.json({
    success: true,
    brief: {
      businessName: lower.includes('ecosip') ? 'EcoSip Store' : 'Emerging Brand',
      product,
      productCategory: category,
      targetAudience: lower.includes('youngster') ? 'Youngsters & College Students' : 'Value-conscious Consumers',
      audienceAgeRange: ageRange,
      geography,
      objective,
      budget,
      campaignDurationDays: duration,
      preferredChannels,
      excludedChannels: [],
      productPositioning: 'Competitive pricing with high perceived value and modern styling',
      constraints: `₹${(budget).toLocaleString('en-IN')} total budget over ${duration} days`,
    },
    source: 'deterministic-fallback',
  });
});

// Platform-Specific Content Generation Endpoint
app.post('/api/gemini/generate-content', async (req: Request, res: Response) => {
  const { brief, platforms, tone, discountDetails, websiteUrl } = req.body;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an expert copywriter and marketing director. Generate platform-specific marketing copy for the following campaign:
Product: ${brief.product || 'Featured Offer'}
Category: ${brief.productCategory || 'General'}
Objective: ${brief.objective || 'Lead Generation'}
Target Audience: ${brief.targetAudience || 'General Consumers'} (${brief.audienceAgeRange || 'All'})
Geography: ${brief.geography || 'India'}
Tone: ${tone || 'Friendly and casual'}
Discount / Offer: ${discountDetails || 'Special Introductory Pricing'}
Website / Store URL: ${websiteUrl || 'https://marketpulse.example.com'}
Selected Platforms: ${JSON.stringify(platforms || ['instagram', 'youtube', 'x', 'facebook', 'linkedin'])}

Return ONLY a JSON object with platform keys for requested platforms:
{
  "instagram": {
    "hook": "Attention grabbing opening line",
    "caption": "Full Instagram caption formatted with emojis and paragraph breaks",
    "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"],
    "cta": "Link in bio to claim offer",
    "visualConcept": "Brief visual or 9:16 Reel suggestion"
  },
  "youtube": {
    "title": "High CTR video title under 70 chars",
    "description": "Engaging description with timestamps placeholder and link",
    "hookScript": "First 15-second script hook for video opener",
    "hashtags": ["#Shorts", "#Topic"],
    "thumbnailConcept": "Visual description for high contrast thumbnail",
    "cta": "Subscribe and click link in description"
  },
  "x": {
    "post": "Punchy post within 260 characters with strong hook",
    "hashtags": ["#Tag1", "#Tag2"],
    "alternative": "Alternative punchy variation",
    "cta": "Check the link below"
  },
  "facebook": {
    "post": "Engaging community post with storytelling and clear benefits",
    "offerSummary": "Bullet points summarizing the value",
    "cta": "Shop Now / Learn More",
    "visualConcept": "Carousel or lifestyle image recommendation"
  },
  "linkedin": {
    "post": "Professional insights post focused on business value, efficiency, or industry trends",
    "hashtags": ["#Industry", "#Leadership"],
    "businessAngle": "Key professional takeaway",
    "cta": "Explore the case study / Connect with our team"
  }
}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        return res.json({ success: true, drafts: parsed, source: 'gemini' });
      }
    } catch (apiErr) {
      console.warn('Gemini content generation failed, using fallback templates:', apiErr);
    }
  }

  // Deterministic platform copy generation fallback
  const pName = brief.product || 'Premium Collection';
  const offer = discountDetails || 'Exclusive Limited-Time Offer';
  const url = websiteUrl || 'https://marketpulse.example.com';
  const toneDesc = tone || 'Friendly and casual';

  const drafts: Record<string, any> = {
    instagram: {
      hook: `🚨 Big news: ${pName} is officially here with ${offer}!`,
      caption: `Ready to upgrade your routine? Meet ${pName} — crafted specifically for ${brief.targetAudience || 'everyday achievers'}. \n\n✨ Why you'll love it:\n• Designed for peak performance and durability\n• Specially priced: ${offer}\n• Fast dispatch across ${brief.geography || 'India'}\n\nTap the link in bio to explore before stock runs out! 📦👇`,
      hashtags: [`#${pName.replace(/\s+/g, '')}`, '#ExclusiveDeal', '#UpgradeYourLife', '#LimitedTime', '#MarketPulse'],
      cta: '👉 Tap link in bio to claim your exclusive offer',
      visualConcept: 'Dynamic 9:16 vertical Reel opening with a quick problem-solution demo, fast cuts, upbeat lofi beat, and bold text overlay showing the discount.',
    },
    youtube: {
      title: `Why Everyone Is Talking About ${pName} (${offer} Revealed!)`,
      description: `In this video, we break down why ${pName} has become an instant favorite for ${brief.targetAudience || 'creators and professionals'}.\n\n🎯 Get ${offer} today: ${url}\n\n⏱️ Timestamps:\n0:00 - The Problem\n1:15 - First Look & Unboxing\n3:40 - Real World Test\n5:20 - How to Get ${offer}\n\nDon't forget to like and subscribe for more product deep-dives!`,
      hookScript: `Stop scrolling if you're still doing things the hard way! For the next 30 seconds, I'm going to show you why ${pName} is completely changing the game.`,
      hashtags: ['#ProductReview', `#${pName.replace(/\s+/g, '')}`, '#DealOfTheDay', '#Trending'],
      thumbnailConcept: 'Split screen: Left side showing the old frustrating way with a red cross; right side holding the clean product with bright green discount badge and expressive face.',
      cta: 'Check the pinned link in description for instant access.',
    },
    x: {
      post: `The wait is over: ${pName} is live with ${offer}.\n\nBuilt specifically for ${brief.targetAudience || 'you'} in ${brief.geography || 'India'}.\n\nClaim yours before this batch sells out: ${url}`,
      hashtags: [`#${pName.replace(/\s+/g, '')}`, '#Deals'],
      alternative: `Most options in the market cut corners. ${pName} doesn't.\n\nToday only: ${offer}.\n👉 Grab it here: ${url}`,
      cta: `👉 Grab yours now: ${url}`,
    },
    facebook: {
      post: `Attention ${brief.geography || 'everyone'}! If you've been searching for a better solution for your daily routine, we have great news.\n\nWe just announced ${pName} with an exclusive ${offer} for our community!\n\nWhether you need reliable performance, sleek aesthetics, or unbeatable value, this is your chance to get it first.`,
      offerSummary: `✅ Special offer: ${offer}\n✅ Fast, reliable delivery\n✅ 100% satisfaction guarantee\n✅ Limited availability`,
      cta: `Click "Shop Now" below to claim your offer before time runs out.`,
      visualConcept: 'Carousel post featuring 4 high-resolution lifestyle images showing the product in practical everyday contexts.',
    },
    linkedin: {
      post: `In high-growth markets, efficiency and quality cannot be compromised. That's why we engineered ${pName}.\n\nTailored for ${brief.targetAudience || 'forward-thinking teams and individuals'}, our latest release bridges the gap between premium performance and practical accessibility.\n\nKey highlights:\n• Streamlined workflow integration\n• Transparent pricing with ${offer}\n• Proven customer satisfaction across ${brief.geography || 'the region'}\n\nHow is your organization approaching this shift this quarter? Let's discuss in the comments below.`,
      hashtags: ['#Innovation', '#BusinessStrategy', '#Productivity', '#GrowthMarketing'],
      businessAngle: 'Balancing cost efficiency with superior product utility in emerging markets.',
      cta: `Explore full specifications and commercial availability at: ${url}`,
    },
  };

  res.json({
    success: true,
    drafts,
    source: 'deterministic-fallback',
  });
});

// Pulse Assistant Contextual Chat Endpoint
app.post('/api/gemini/assistant', async (req: Request, res: Response) => {
  const { question, context } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Missing question in request body' });
  }

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are "Pulse Assistant", an expert marketing intelligence consultant embedded inside the Market Pulse application.
You give actionable, mathematically sound, concise, and realistic advice to founders and marketers.
Never invent ad spend, ROI, or audience counts that were not provided.
Clearly explain marketing concepts (like CPL, CAC, ROAS, creative fatigue, deterministic ranking).

Application Context:
${JSON.stringify(context || {})}

User Question:
"${question}"

Provide a structured, helpful, professional, and friendly response. Keep it under 250 words with bullet points where appropriate.`,
        config: {
          temperature: 0.4,
        },
      });

      const reply = response.text;
      if (reply) {
        return res.json({ success: true, answer: reply, source: 'gemini' });
      }
    } catch (apiErr) {
      console.warn('Gemini chat failed, using expert fallback consultant logic:', apiErr);
    }
  }

  // High-value deterministic fallback knowledge base
  const q = question.toLowerCase();
  let answer = '';

  if (q.includes('why is this strategy ranked') || q.includes('rank 1') || q.includes('ranking')) {
    answer = `**How Market Pulse Scores & Ranks Strategies:**\n\nRankings use our transparent deterministic formula:\n\n**Suitability Score = (0.30 × Audience Fit) + (0.25 × Objective Fit) + (0.20 × Budget Fit) + (0.15 × Evidence Strength) + (0.10 × Execution Feasibility)**\n\n• The #1 ranked strategy maximizes your specific audience alignment and primary objective (e.g., Lead Generation).\n• If historical campaign benchmarks exist in your workspace, evidence strength gives bonus points to proven low-CPL channels.\n• Note: A high suitability score represents strategic fit, NOT a guaranteed probability of sales.`;
  } else if (q.includes('distribute') || q.includes('budget') || q.includes('50 lakh') || q.includes('allocation')) {
    answer = `**Recommended Budget Allocation Framework:**\n\n1. **Core Proven Channel (40–50%):** Allocate to the highest-intent channel (e.g. Paid Search or Meta targeted ads) to secure predictable initial baseline leads.\n2. **High-Engagement Channel (25–30%):** Use for short-form video or creator partnerships to drive awareness and fuel retargeting pools.\n3. **Conversion & Nurture (15%):** Email automation, SMS sequences, and retargeting ads to convert users who didn't buy on the first visit.\n4. **Experimentation Reserve (10–15%):** Keep unallocated or reserved for testing emerging angles, creative variants, or landing page tweaks before scaling.`;
  } else if (q.includes('qualified lead') || q.includes('cpl') || q.includes('cost per')) {
    answer = `**Cost Per Qualified Lead (CPL):**\n\n**Formula: Actual Spend ÷ Number of Qualified Leads**\n\n• In your demo workspace, Search Campaign B spent ₹35,000 for 70 leads = **₹500 CPL**.\n• Social Campaign A spent ₹40,000 for 40 leads = **₹1,000 CPL**.\n• While Social had more clicks (2,000 vs 1,000), Search produced double the qualified enquiries at half the cost. High click-through rate does not guarantee high lead intent!`;
  } else if (q.includes('likes') && (q.includes('enquiries') || q.includes('leads') || q.includes('sales'))) {
    answer = `**Why High Likes Don't Translate to Sales / Leads:**\n\n1. **Intent Mismatch:** Social users scroll for entertainment. A "like" takes 0.2 seconds, while submitting a contact form or making a purchase requires active buying intent.\n2. **Friction in Funnel:** Slow landing pages, long forms, or unoptimized mobile checkouts cause 70%+ drop-offs after the click.\n3. **Broad vs Qualified Audience:** Viral creative often attracts casual viewers rather than your target decision-makers.\n4. **Weak Call-to-Action:** Entertaining content without clear, compelling urgency leaves users passive.`;
  } else if (q.includes('evidence') || q.includes('reliable') || q.includes('data')) {
    answer = `**How to Make Strategy Recommendations More Reliable:**\n\n• **Upload First-Party Data:** Import clean campaign CSVs with verified spend, UTM parameters, and conversion numbers in the Data Sources page.\n• **Track Post-Click Milestones:** Instead of counting raw clicks, track form completions, WhatsApp chat initiations, or checkout events.\n• **Run Controlled A/B Tests:** Spend 10% of budget on a 7-day test split between two hooks or audiences before committing your full budget.`;
  } else {
    answer = `**Market Pulse Intelligence Guidance:**\n\nWhen planning campaigns, always align your budget to specific customer conversion steps:\n• **Awareness:** Short-form video & creator content to build recognition.\n• **Intent:** Paid search & retargeting to capture active demand.\n• **Closing:** Clear landing pages, transparent offers, and quick response times.\n\nFeel free to ask about channel allocation, CPL calculations, competitor angles, or testing frameworks!`;
  }

  res.json({
    success: true,
    answer,
    source: 'deterministic-fallback',
  });
});

// Setup Vite or static file serving
async function setupViteAndListen() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Market Pulse server listening at http://0.0.0.0:${PORT}`);
  });
}

setupViteAndListen().catch((err) => {
  console.error('Failed to start server:', err);
});
