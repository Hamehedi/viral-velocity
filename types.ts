

export enum AppView {
  BLOG = 'BLOG',
  ADMIN = 'ADMIN'
}

export interface UserCredentials {
  adSenseId: string;
  amazonAffiliateTag: string;
  bloggerBlogId: string;
  adSenseSlotId: string;
}

export interface PipelineConfig {
  niche: string;
  frequency: string;
  wordCount: number;
  tone: string;
  includeImages: boolean;
  monetization: string[];
  seoStrategy: 'Viral News' | 'Evergreen Authority' | 'Programmatic SEO' | 'Skyscraper Technique';
  dataSource: 'Google Trends' | 'Twitter/X Trends' | 'NewsAPI' | 'Specific Keywords';
  targetRegion: 'Global' | 'US/UK/CA' | 'Asia Pacific' | 'Europe';
  indexingStrategy: 'Standard XML' | 'Instant Indexing API' | 'Ping Services';
  language: 'English' | 'Spanish' | 'French' | 'German' | 'Portuguese' | 'Hindi' | 'Japanese';
  credentials: UserCredentials;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  author?: string;
  readTime?: string;
  imageUrl?: string;
  views: string;
  publishDate?: string;
  type: 'HERO' | 'STANDARD' | 'TRENDING';
}

export interface GeneratedFeed {
  hero: BlogPost;
  trending: BlogPost[];
  latest: BlogPost[];
}

export interface GeneratedContent {
  title: string;
  body: string; // Markdown or HTML
  metaDescription: string;
  tags: string[];
  jsonLd: string;
  seoScore: number;
  trendingScore: number;
  searchIntent: string;
  imagePrompt: string;
  authorBio: string;
  affiliateProduct?: string;
  affiliateCta?: string;
  relatedPosts: { title: string; category: string }[];
  projectedEarnings?: number;
}

export interface ScriptOptions {
  language: 'python' | 'node';
  platform: 'local' | 'replit' | 'colab';
}