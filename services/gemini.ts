
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
        
        archive.push({
            id: `sim-${category}-${i}`,
            title: title,
            excerpt: `Learn the essential strategies behind ${category} and why it matters today.`,
            category: category,
            author: "Staff Writer",
            readTime: `${Math.floor(Math.random() * 10) + 3} min read`,
            views: views,
            publishDate: `${Math.floor(Math.random() * 30) + 1} days ago`,
            type: 'STANDARD'
        });
    }
  });

  // Shuffle the array
  return archive.sort(() => Math.random() - 0.5);
};

export const generateViralFeed = async (config: PipelineConfig): Promise<GeneratedFeed> => {
  const ai = getAI();
  
  const prompt = `
    Act as an Editor-in-Chief for a massive global media empire.
    
    YOUR STRATEGY:
    1. **TRAFFIC ANALYSIS SIMULATION:** Randomly select 3-4 categories from the list below to be "VIRAL" right now. Assign them huge view counts (2.5M+).
    2. **FEEDBACK LOOP:** Because those categories are viral, you must generate MORE posts about them in the 'latest' section.
    3. **AUDIENCE BALANCE:** Keep alternating betwen Tier 1 and Tier 3 topics, but bias towards the viral categories.
    4. **DENSITY:** Generate 12 items in the 'latest' array to fill the home page.
    
    Category List: ${ALL_CATEGORIES.join(', ')}
    
    Output a JSON Feed with:
    - 1 Hero Article (Tier 1 Topic)
    - 3 Trending Articles (The "Viral" ones with 1M+ views)
    - 12 Latest Articles (Mix of topics, heavily favoring the "Viral" categories)
    
    Output JSON strictly:
    {
      "hero": { "title": "...", "excerpt": "...", "category": "...", "views": "2.4M", "author": "..." },
      "trending": [ 
          { "title": "...", "category": "...", "views": "..." },
          { "title": "...", "category": "...", "views": "..." },
          { "title": "...", "category": "...", "views": "..." }
      ],
      "latest": [ 
          { "title": "...", "excerpt": "...", "category": "...", "views": "..." },
          ... (12 items total)
      ]
    }
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hero: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              excerpt: { type: Type.STRING },
              category: { type: Type.STRING },
              views: { type: Type.STRING },
              author: { type: Type.STRING }
            }
          },
          trending: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                category: { type: Type.STRING },
                views: { type: Type.STRING }
              }
            }
          },
          latest: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                excerpt: { type: Type.STRING },
                category: { type: Type.STRING },
                views: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });

  const raw = JSON.parse(response.text || "{}");
  
  return {
    hero: { ...raw.hero, id: 'hero-' + Date.now(), type: 'HERO', publishDate: 'Just now', readTime: '5 min read' },
    trending: raw.trending?.map((t: any, i: number) => ({ ...t, id: 'trend-' + i, type: 'TRENDING' })) || [],
    latest: raw.latest?.map((t: any, i: number) => ({ ...t, id: 'latest-' + i, type: 'STANDARD', author: 'Staff Writer', publishDate: '1 hour ago', readTime: '3 min read' })) || []
  };
};

export const generateBlogContent = async (config: PipelineConfig): Promise<GeneratedContent> => {
    const ai = getAI();
    const articleTitle = config.niche; 

    const prompt = `
      You are an expert AI Article Writer & SEO Strategist designed for MAXIMUM REVENUE and GLOBAL SEARCH DOMINANCE.
      Topic: "${articleTitle}"
      Global Config Language: ${config.language}.

      **STEP 1: ANALYZE AUDIENCE & MONETIZATION**
      Determine if this topic appeals more to a "Tier 1" (First World) or "Tier 3" (Developing World) audience.
      
      **IF TIER 1 (US/UK/CA/DE - High CPC):**
      - **Writing Tone:** Professional, Analytical, "E-E-A-T" Focused (Experience, Expertise, Authoritativeness, Trust).
      - **Keywords:** Use "Analysis", "Market Report", "Investment Strategy", "Review".
      - **Length:** 1500 words.
      - **Affiliate Tag:** ${config.credentials.amazonAffiliateTag}.
      - **Affiliate CTA:** "Check Best Price", "View Exclusive Offer".

      **IF TIER 3 (IN/NG/PK/BD - High Volume):**
      - **Writing Tone:** Actionable, Urgent, "Viral" Focused.
      - **Keywords:** Use "Free", "Download", "Tutorial", "Secret", "Earn Money".
      - **Length:** 1000 words.
      - **Affiliate CTA:** "Start Earning Today", "Get Started Now", "Download Free App".

      **STEP 2: ADVANCED SEO ENGINEERING (CRITICAL)**
      1. **Entity Injection:** Identify and mention 3-5 specific "Named Entities" (People, Companies, Locations, Laws) related to the topic to connect with Google's Knowledge Graph.
      2. **Featured Snippet Target:** Include a concise 40-60 word answer paragraph ("The Answer Target") immediately after the H1 or first H2 to capture Position Zero.
      3. **Meta Description:** Strictly 150-160 characters. Must include primary keyword + CTA.
      4. **Schema Markup:** Generate full 'NewsArticle' JSON-LD. MUST include 'speakable' property for Voice Search dominance.

      **STEP 3: WRITE CONTENT**
      - Structure:
        1. **Key Takeaways** (Box).
        2. **Introduction** (Hook + Answer Target).
        3. **Body Paragraphs** (H2/H3 - Deep Dive).
        4. **MONETIZATION BLOCK:** Persuasive "Editor's Choice" with Affiliate CTA.
        5. **FAQ Section** (Keyword rich).
      
      Output JSON.
    `;
  
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            body: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            jsonLd: { type: Type.STRING },
            seoScore: { type: Type.NUMBER },
            trendingScore: { type: Type.NUMBER },
            searchIntent: { type: Type.STRING },
            imagePrompt: { type: Type.STRING, description: "Detailed prompt for text-to-image generation based on audience visual strategy" },
            authorBio: { type: Type.STRING },
            affiliateProduct: { type: Type.STRING, description: "Name of the recommended product/service for monetization" },
            affiliateCta: { type: Type.STRING, description: "Persuasive Call-to-Action text for the affiliate link based on audience tier" },
            relatedPosts: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        category: { type: Type.STRING }
                    }
                }
            },
            projectedEarnings: { type: Type.NUMBER, description: "Estimated USD earnings for this post based on tier" }
          }
        }
      }
    });
  
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as GeneratedContent;
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

  return response.text || "# Error";
};
