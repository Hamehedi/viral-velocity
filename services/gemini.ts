import { GoogleGenAI, Type } from "@google/genai";
import { PipelineConfig, GeneratedFeed, GeneratedContent, BlogPost } from "../types";
import { TIER_1_CATEGORIES, TIER_3_CATEGORIES, ALL_CATEGORIES } from "../constants";

const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// NEW: Generates 100+ simulated posts instantly to populate the empty site
export const generateSimulatedArchive = (): BlogPost[] => {
  const templates = [
    "Why {cat} Is Exploding in 2024",
    "The Secret To Mastering {cat} Quickly",
    "10 {cat} Mistakes You Are Making",
    "How I Made $5000 with {cat}",
    "The Ultimate Guide to {cat}",
    "{cat}: What The Experts Aren't Telling You",
    "Is {cat} The Future of Tech?",
    "Beginner's Guide to {cat} Success",
    "Stop Ignoring {cat} Before It's Too Late",
    "Top 5 Tools for {cat} Enthusiasts"
  ];

  const archive: BlogPost[] = [];
  
  // Generate ~4 posts per category for all 30 categories = ~120 posts
  ALL_CATEGORIES.forEach((category) => {
    for (let i = 0; i < 4; i++) {
        const template = templates[Math.floor(Math.random() * templates.length)];
        const title = template.replace("{cat}", category);
        const views = (Math.floor(Math.random() * 800) + 50) + 'k'; // Random views 50k - 850k
        
        // Generate a clean, formatted simulated body content so it's ready instantly (Markdown-free logic for parser)
        const simulatedBody = `
## The Rise of ${category}

${category} has seen unprecedented growth in recent months. Experts suggest this trend is here to stay, driven by global shifts in technology and consumer behavior.

## Why It Matters Now

For anyone looking to get ahead, understanding ${category} is no longer optional. It is a critical skill that opens doors to new opportunities.

## Key Strategies for Success

* Start Small: Don't overwhelm yourself.
* Stay Consistent: Regular practice is key.
* Use the Right Tools: Leverage modern apps to speed up your workflow.

## Conclusion

The future looks bright for those who embrace ${category}. Start your journey today and watch your results compound over time.
        `;

        const simulatedContent: GeneratedContent = {
            title: title,
            body: simulatedBody,
            metaDescription: `Discover why ${category} is trending and how you can capitalize on it.`,
            tags: [category, "Trending", "Guide"],
            jsonLd: "{}",
            seoScore: 85,
            trendingScore: 92,
            searchIntent: "Informational",
            imagePrompt: `A professional, high-quality image representing ${category}`,
            authorBio: "Staff Writer specialized in global trends.",
            affiliateProduct: "Top Rated Tool",
            affiliateCta: "Check Availability",
            relatedPosts: [],
            projectedEarnings: 150
        };

        archive.push({
            id: `sim-${category}-${i}`,
            title: title,
            excerpt: `Learn the essential strategies behind ${category} and why it matters today.`,
            category: category,
            author: "Staff Writer",
            readTime: `${Math.floor(Math.random() * 10) + 3} min read`,
            views: views,
            publishDate: `${Math.floor(Math.random() * 30) + 1} days ago`,
            type: 'STANDARD',
            content: simulatedContent
        });
    }
  });

  // Shuffle the array
  return archive.sort(() => Math.random() - 0.5);
};

export const generateViralFeed = async (config: PipelineConfig, archive: BlogPost[] = []): Promise<GeneratedFeed> => {
  const ai = getAI();
  
  // NEW: Analyze Archive for Traffic Trends
  // Calculate average views per category to identify what's actually trending in the system
  let trendingContext = "";
  let topCategories: string[] = [];

  if (archive.length > 0) {
      const categoryStats: Record<string, { totalViews: number, count: number }> = {};
      
      const parseViews = (str: string) => {
          if (!str) return 0;
          const s = str.toLowerCase().replace(/,/g, '');
          if (s.endsWith('m')) return parseFloat(s) * 1000000;
          if (s.endsWith('k')) return parseFloat(s) * 1000;
          return parseFloat(s) || 0;
      };

      archive.forEach(post => {
          if (!post.category) return;
          const views = parseViews(post.views);
          if (!categoryStats[post.category]) categoryStats[post.category] = { totalViews: 0, count: 0 };
          categoryStats[post.category].totalViews += views;
          categoryStats[post.category].count++;
      });

      // Find top performing categories based on average views
      topCategories = Object.entries(categoryStats)
          .map(([cat, stats]) => ({ category: cat, avg: stats.totalViews / stats.count }))
          .sort((a, b) => b.avg - a.avg)
          .slice(0, 3) // Top 3 trending
          .map(c => c.category);
          
      if (topCategories.length > 0) {
          trendingContext = `
          INTERNAL DATA ANALYSIS: The top performing categories (highest avg views) in the last 24h are: ${topCategories.join(', ')}. 
          
          CRITICAL INSTRUCTION: You MUST prioritize these specific trending categories. 
          - Generate at least 50% of the new content for ${topCategories[0]} to capitalize on viral momentum.
          - The remaining content must STRICTLY follow the Tier 1 / Tier 3 balance rule defined below.`;
      }
  }

  if (!trendingContext) {
      trendingContext = `TRAFFIC ANALYSIS SIMULATION: Randomly select 3-4 categories from the list below to be "VIRAL" right now.`;
  }
  
  // JSON Schema description for the prompt (since we can't use responseSchema with tools)
  const schemaDescription = JSON.stringify({
    hero: { title: "string", excerpt: "string", category: "string", views: "string", author: "string" },
    trending: [{ title: "string", category: "string", views: "string" }],
    latest: [{ title: "string", excerpt: "string", category: "string", views: "string" }]
  }, null, 2);

  const prompt = `
    Act as an Editor-in-Chief for a massive global media empire.
    
    **SEARCH GROUNDING:**
    Use Google Search to find REAL, CURRENT trending news and topics in: ${ALL_CATEGORIES.join(', ')}.
    Do not hallucinate trends. Use the search tool to find what is actually happening right now.
    
    YOUR STRATEGY:
    1. **${trendingContext}**
    2. **FEEDBACK LOOP:** Double down on what works. If a category is identified as trending above, generate MULTIPLE angles for it.
    3. **AUDIENCE BALANCE (CRITICAL):** Even while prioritizing trending topics, you must ensure the feed appeals to both audiences to maintain revenue mix:
       - **Tier 1 (High CPC):** Include at least 3 posts about Finance, Tech, Insurance, Legal, or Real Estate.
       - **Tier 3 (High Volume):** Include at least 3 posts about Freelancing, Crypto, Gaming, Life Hacks, or Apps.
    4. **DENSITY:** Generate 12 items in the 'latest' array to fill the home page.
    
    Category List: ${ALL_CATEGORIES.join(', ')}
    
    Output valid JSON strictly matching this structure:
    ${schemaDescription}
    
    Do not include markdown formatting.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }]
      // No responseSchema or responseMimeType when using tools
    }
  });

  let text = response.text || "{}";
  // Clean potential markdown wrapping from Gemini
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();

  let raw;
  try {
      raw = JSON.parse(text);
  } catch (e) {
      console.error("Failed to parse viral feed JSON", e);
      raw = { hero: {}, trending: [], latest: [] };
  }
  
  return {
    hero: { ...raw.hero, id: 'hero-' + Date.now(), type: 'HERO', publishDate: 'Just now', readTime: '5 min read' },
    trending: raw.trending?.map((t: any, i: number) => ({ ...t, id: 'trend-' + i, type: 'TRENDING' })) || [],
    latest: raw.latest?.map((t: any, i: number) => ({ ...t, id: 'latest-' + i, type: 'STANDARD', author: 'Staff Writer', publishDate: '1 hour ago', readTime: '3 min read' })) || []
  };
};

export const generateBlogContent = async (config: PipelineConfig): Promise<GeneratedContent> => {
    const ai = getAI();
    const articleTitle = config.niche; 

    // Define the schema structure for the model to follow
    const schemaStructure = JSON.stringify({
        title: "string",
        body: "string (markdown)",
        metaDescription: "string",
        tags: ["string"],
        jsonLd: "string (JSON-LD)",
        seoScore: 85,
        trendingScore: 90,
        searchIntent: "string",
        imagePrompt: "string",
        authorBio: "string",
        affiliateProduct: "string",
        affiliateCta: "string",
        relatedPosts: [{ title: "string", category: "string", tags: ["string"] }],
        projectedEarnings: 100
    }, null, 2);

    const prompt = `
      You are an expert AI Article Writer & SEO Strategist designed for MAXIMUM REVENUE and GLOBAL SEARCH DOMINANCE.
      Topic: "${articleTitle}"
      Global Config Language: ${config.language}.

      **CRITICAL INSTRUCTION: SEARCH GROUNDING ENABLED**
      1.  **USE GOOGLE SEARCH:** You have access to Google Search. You **MUST** use it to research the topic "${articleTitle}" to ensure the content is accurate, up-to-date, and factually correct.
      2.  **INTEGRATE FACTS:** Incorporate specific data points, recent news, or statistics found via search into the body of the article.

      **STEP 1: ANALYZE AUDIENCE & MONETIZATION**
      Determine if this topic appeals more to a "Tier 1" (First World) or "Tier 3" (Developing World) audience.
      
      **IF TIER 1 (US/UK/CA/DE - High CPC):**
      - **Writing Tone:** Professional, Analytical, "E-E-A-T" Focused.
      - **Keywords:** Use "Analysis", "Market Report", "Investment Strategy", "Review".
      - **Length:** 1500 words.
      - **Affiliate Tag:** ${config.credentials.amazonAffiliateTag}.
      - **Affiliate CTA:** "Check Best Price", "Explore Top Options".
      - **VISUAL STRATEGY (CRITICAL):**
        - Style: Hyper-realistic, 8k, Cinematic, Futuristic, High-Tech.
        - Elements: Glass, Neon, Blue/Silver palette, modern architecture, abstract data visualization.
        - **PROMPT RULE:** Create a detailed prompt for a high-end, futuristic 16:9 featured image tailored to the specific topic "${articleTitle}".

      **IF TIER 3 (IN/NG/PK/BD - High Volume):**
      - **Writing Tone:** Actionable, Urgent, "Viral" Focused.
      - **Keywords:** Use "Free", "Download", "Tutorial", "Secret", "Earn Money".
      - **Length:** 1000 words.
      - **Affiliate CTA:** "Start Earning Today", "Get Started Now".
      - **VISUAL STRATEGY (CRITICAL):**
        - Style: Vibrant, Warm Lighting, Relatable, Action-Oriented.
        - Elements: Smartphones, Cash/Coins icons, Home Office setups, enthusiastic people.
        - **PROMPT RULE:** Create a detailed prompt for a relatable, engaging 16:9 featured image tailored to the specific topic "${articleTitle}".

      **STEP 2: ADVANCED SEO ENGINEERING (CRITICAL)**
      1. **Entity Injection:** Identify and mention 3-5 specific "Named Entities" (People, Companies, Locations, Laws) related to the topic.
      2. **LSI Keywords:** Include at least 5 Latent Semantic Indexing keywords naturally in the text.
      3. **Featured Snippet Target:** Include a concise 40-60 word answer paragraph immediately after the H1 or first H2.
      4. **Meta Description:** Strictly 150-160 characters. Must include primary keyword + CTA.
      5. **Schema Markup:** Generate full 'NewsArticle' JSON-LD. MUST include 'speakable' property.

      **STEP 3: WRITE CONTENT**
      - Structure:
        1. **Key Takeaways** (Box).
        2. **Introduction** (Hook + Answer Target).
        3. **Body Paragraphs** (H2/H3 - Deep Dive).
        4. **MONETIZATION BLOCK:** Persuasive "Editor's Choice" with Affiliate CTA.
        5. **FAQ Section** (Keyword rich).
      
      **RESTRICTION:** Do NOT include headings about "SEO Prioritization" or "Step 1" in the generated body. Only the final article content.
      
      Output valid JSON strictly matching this structure:
      ${schemaStructure}

      Do not include markdown formatting (no \`\`\`json). Just the raw JSON string.
    `;
  
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
        // No responseSchema when using tools
      }
    });
  
    let text = response.text || "{}";
    // Clean potential markdown wrapping from Gemini
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Robust JSON parsing
    let content;
    try {
        content = JSON.parse(text);
    } catch (e) {
        // Fallback if JSON is malformed
        console.error("JSON Parse Error:", e);
        content = {
            title: articleTitle,
            body: text, // Fallback to raw text
            metaDescription: "Read more about " + articleTitle,
            tags: ["Viral", "News"],
            jsonLd: "{}",
            seoScore: 70,
            trendingScore: 70,
            searchIntent: "Informational",
            imagePrompt: "A generic news image",
            authorBio: "Staff Writer",
            relatedPosts: [],
            projectedEarnings: 50
        };
    }

    // Extract grounding chunks if available
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingLinks = chunks
        .map((c: any) => c.web ? { title: c.web.title, url: c.web.uri } : null)
        .filter((x: any) => x);

    return { ...content, groundingLinks } as GeneratedContent;
};

export const generateBlogImage = async (imagePrompt: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: imagePrompt }]
        },
        config: {
            imageConfig: {
                aspectRatio: "16:9"
            }
        }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    return "";
};

export const generateAutomationScript = async (config: PipelineConfig, platform: string): Promise<string> => {
  const ai = getAI();

  const prompt = `
    Write a PRODUCTION-READY Python 3 script for a "Fully Automated Viral Blog Empire" using the Google Blogger API and Google Indexing API.
    
    Target Platform: ${platform} (Replit/VPS).
    Language: ${config.language}.
    
    **USER CREDENTIALS (HARDCODED):**
    - AdSense Publisher ID: "${config.credentials.adSenseId}"
    - Amazon Affiliate Tag: "${config.credentials.amazonAffiliateTag}"
    - Blogger Blog ID: "${config.credentials.bloggerBlogId}"
    - AdSense Ad Slot ID: "${config.credentials.adSenseSlotId}"
    
    **BUSINESS LOGIC:**
    1. **Lists:**
       - TIER_1_TOPICS = ${JSON.stringify(TIER_1_CATEGORIES)}
       - TIER_3_TOPICS = ${JSON.stringify(TIER_3_CATEGORIES)}
    
    2. **Loop:** Infinite loop (\`while True\`) alternating between Tier 1 and Tier 3 topics.
    
    3. **Content Generation (CRITICAL UPGRADE):**
       - The script must use \`model.generate_content\` with \`generation_config={"response_mime_type": "application/json"}\`.
       - PROMPT INSIDE PYTHON SCRIPT must request: title, body, metaDescription, jsonLd, affiliateCta.
       - Use the same advanced SEO logic (Entities, Snippet Target) as the frontend.

    4. **Post Construction:**
       - Combine \`body\` + injected AdSense HTML + injected Amazon CTA.
       - **IMPORTANT:** Inject the \`jsonLd\` string into the body inside a \`<script type="application/ld+json">\` tag. This is vital for SEO.
    
    5. **Monetization:**
       - Inject AdSense HTML (with pub/slot IDs) after paragraph 2.
       - Inject Amazon CTA (with affiliateCta text) at the end.
    
    6. **Indexing:** Call Google Indexing API for every new post URL.
    
    7. **Keep-Alive (Replit):**
       - Include a lightweight Flask server (\`keep_alive.py\` logic inside main file) to prevent the bot from sleeping.
    
    8. **Jitter:** Sleep randomly 8-14 minutes.
    
    Output ONLY valid Python code. Ensure all imports are present (flask, google-generativeai, google-api-python-client).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  let text = response.text || "# Error";
  text = text.replace(/```python/g, '').replace(/```/g, '').trim();

  return text;
};