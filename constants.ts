
import { PipelineConfig } from './types';

export const TIER_1_CATEGORIES = [
  "Insurance", "Mortgages", "Legal Services", "SaaS Tech", "Credit Cards", 
  "Real Estate", "Higher Education", "Medical Health", "Trading Forex", 
  "Luxury Travel", "Electric Vehicles", "Cloud Computing", "Cyber Security", 
  "Personal Loans", "Digital Marketing"
];

export const TIER_3_CATEGORIES = [
  "Freelancing", "Make Money Online", "Android Apps", "Gaming News", 
  "Celebrity Gossip", "Crypto Airdrops", "Life Hacks", "Budget Travel", 
  "Fitness Tips", "DIY Crafts", "Motivation", "Gadget Reviews", 
  "Dating Advice", "Astrology", "Sports Highlights"
];

export const ALL_CATEGORIES = [...TIER_1_CATEGORIES, ...TIER_3_CATEGORIES];

export const ADS_TXT_CONTENT = "google.com, pub-2250931776047846, DIRECT, f08c47fec0942fa0";

export const DEFAULT_CONFIG: PipelineConfig = {
  niche: 'Global Viral News & Tech Breakthroughs',
  frequency: 'High Frequency (Every 10m)', 
  wordCount: 1500,
  tone: 'Urgent, Authoritative, and Highly Engaging',
  includeImages: true,
  monetization: ['AdSense', 'Amazon Affiliate'],
  seoStrategy: 'Viral News',
  dataSource: 'Google Trends',
  targetRegion: 'US/UK/CA',
  indexingStrategy: 'Instant Indexing API',
  language: 'English',
  credentials: {
    adSenseId: 'pub-2250931776047846',
    amazonAffiliateTag: 'velocity20-20',
    bloggerBlogId: '123456789',
    adSenseSlotId: '1234567890'
  }
};

export const INITIAL_POSTS = {
  hero: {
    id: '1',
    title: "Markets Rally As New Tech Regulation Stalls In Senate",
    excerpt: "Analysts predict a massive Q4 surge following the unexpected legislative gridlock. Here is what savvy investors are doing right now.",
    category: "Finance",
    author: "Sarah Jenkins",
    readTime: "4 min read",
    views: "2.4M",
    publishDate: "10 mins ago",
    type: 'HERO'
  },
  trending: [
    { id: '2', title: "Bitcoin Flash Crash: Is $30k The New Floor?", views: "890k", category: "Crypto", type: 'TRENDING' },
    { id: '3', title: "The 5000-Mile Battery: EV Myth or Reality?", views: "650k", category: "Auto", type: 'TRENDING' },
    { id: '4', title: "Remote Jobs Paying $150k+ You Can Start Today", views: "1.2M", category: "Careers", type: 'TRENDING' },
  ],
  latest: [
    { id: '5', title: "This Nootropic Stack Is Taking Silicon Valley By Storm", excerpt: "It is not coffee, and biohackers swear by it for 12-hour focus sessions.", category: "Health", views: "450k", type: 'STANDARD' },
    { id: '6', title: "SpaceX Starship Update: Launch Window Confirmed", excerpt: "Elon Musk drops new details on the Mars colonization timeline.", category: "Space", views: "320k", type: 'STANDARD' },
    { id: '7', title: "Why Remote Work Is Here To Stay", excerpt: "Stats show productivity is up, but managers are worried about control.", category: "Careers", views: "210k", type: 'STANDARD' },
    { id: '8', title: "Best Budget Laptops for Students 2024", excerpt: "You don't need to spend $1000 to get a machine that can handle engineering loads.", category: "Tech", views: "180k", type: 'STANDARD' },
    { id: '9', title: "Crypto Regulation: What You Need To Know", excerpt: "The SEC is cracking down, here is what it means for your current holdings.", category: "Crypto", views: "300k", type: 'STANDARD' },
    { id: '10', title: "Top 5 Travel Destinations for Digital Nomads", excerpt: "Cheap living, fast wifi, and great community. The definitive list.", category: "Travel", views: "150k", type: 'STANDARD' },
    { id: '11', title: "How To Start Dropshipping With $0", excerpt: "A complete guide to starting e-commerce without holding any inventory.", category: "Finance", views: "410k", type: 'STANDARD' },
    { id: '12', title: "The Rise of AI Art: Threat or Opportunity?", excerpt: "Artists are fighting back, but the tech is improving faster than legislation.", category: "Tech", views: "290k", type: 'STANDARD' },
    { id: '13', title: "Healthy Meal Prep Ideas for Busy Professionals", excerpt: "Save time and money with these simple recipes that last all week.", category: "Health", views: "120k", type: 'STANDARD' },
    { id: '14', title: "Understanding the New Tax Laws", excerpt: "Don't get caught off guard this tax season. Key changes explained.", category: "Finance", views: "90k", type: 'STANDARD' },
    { id: '15', title: "Beginner's Guide to Investing in Stocks", excerpt: "Compound interest is your best friend. Start now with this simple strategy.", category: "Finance", views: "330k", type: 'STANDARD' },
    { id: '16', title: "Review: The Best Noise Cancelling Headphones", excerpt: "Silence the world with these top picks for every budget.", category: "Tech", views: "250k", type: 'STANDARD' }
  ]
};