
import React, { useState, useEffect, useRef } from 'react';
import { BlogPost, GeneratedFeed, PipelineConfig, GeneratedContent } from '../types';
import { generateBlogContent } from '../services/gemini';
import { ALL_CATEGORIES } from '../constants';
import { Share2, Clock, Eye, TrendingUp, Menu, Search, Facebook, Twitter, Link, ChevronLeft, CheckCircle, BarChart2, Globe, ArrowLeft, Target, X, Zap, Loader2, Linkedin, Mail, ThumbsUp, AlertCircle, Bell, Moon, Sun, ChevronRight, ShoppingBag, ExternalLink, Grid, List } from 'lucide-react';

interface BlogFrontendProps {
  feed: GeneratedFeed | any;
  archive: BlogPost[];
  loading: boolean;
  config: PipelineConfig;
}

// Helper to inject native ads and affiliate blocks into text content
const renderContentWithNativeAds = (text: string, affiliateProduct?: string, affiliateCta?: string, config?: PipelineConfig) => {
    const paragraphs = text.split('\n\n');
    return paragraphs.map((para, index) => (
        <React.Fragment key={index}>
            <p className="mb-4">{para}</p>
            
            {/* Inject High-Yield Affiliate Block after 2nd paragraph */}
            {index === 1 && affiliateProduct && (
                 <div className="my-6 p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl shadow-sm relative group">
                    <div className="absolute top-2 right-2 text-[8px] text-gray-300 font-mono hidden group-hover:block">
                        Tag: {config?.credentials.amazonAffiliateTag || 'demo-20'}
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 rounded-lg text-red-600">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-1">Editor's Choice: {affiliateProduct}</h4>
                            <p className="text-sm text-gray-600 mb-3">Our top recommendation for maximizing results in this category.</p>
                            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg text-sm flex items-center gap-2 transition-all shadow-lg shadow-red-600/20">
                                {affiliateCta || "Check Best Price"} <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Inject "Taboola" Style Native Ad after 4th paragraph */}
            {index === 4 && (
                <div className="my-8">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 border-b border-gray-100 pb-1 flex justify-between">
                        <span>Sponsored Content</span>
                        <span className="font-mono text-gray-300 hidden group-hover:inline">{config?.credentials.adSenseId || 'pub-demo'}</span>
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="group cursor-pointer">
                            <div className="bg-gray-200 aspect-video rounded-lg mb-2 overflow-hidden relative">
                                <div className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] px-1">Ads by Google</div>
                            </div>
                            <h5 className="font-bold text-sm text-gray-800 leading-tight group-hover:text-blue-600">New AI Tool Write 5,000 Words in 10 Minutes (Try Free)</h5>
                        </div>
                        <div className="group cursor-pointer">
                            <div className="bg-gray-200 aspect-video rounded-lg mb-2 overflow-hidden relative">
                                <div className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] px-1">Ads by Google</div>
                            </div>
                            <h5 className="font-bold text-sm text-gray-800 leading-tight group-hover:text-blue-600">Millionaire Traders Use This 1 Indicator. See It Here.</h5>
                        </div>
                    </div>
                </div>
            )}

            {/* Inject Large Banner Ad after 7th paragraph */}
            {index === 6 && (
                <div className="my-8 w-full h-[250px] bg-gray-50 flex flex-col items-center justify-center border border-gray-200 rounded-lg relative group">
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Advertisement</p>
                     <div className="text-center px-4 max-w-sm">
                        <h3 className="font-black text-xl text-gray-900 mb-2">Stop Paying Full Price</h3>
                        <p className="text-sm text-gray-500 mb-4">Install this browser extension to save $100s per year automatically.</p>
                        <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl hover:bg-blue-700 transform hover:-translate-y-1 transition-all">Download Now</button>
                     </div>
                     <span className="absolute bottom-2 right-2 text-[9px] text-gray-300 hidden group-hover:block font-mono">
                        ID: {config?.credentials.adSenseId}
                     </span>
                </div>
            )}
        </React.Fragment>
    ));
};

export const BlogFrontend: React.FC<BlogFrontendProps> = ({ feed, archive, loading, config }) => {
  const [viewMode, setViewMode] = useState<'HOME' | 'ARTICLE' | 'ARCHIVE'>('HOME');
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [postContent, setPostContent] = useState<GeneratedContent | null>(null);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  
  // UI States
  const [showPopup, setShowPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNotificationRequest, setShowNotificationRequest] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [readProgress, setReadProgress] = useState(0);
  const [liveReaders, setLiveReaders] = useState(120);
  
  // Archive/Feed State
  const [visiblePosts, setVisiblePosts] = useState<BlogPost[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  useEffect(() => {
      if (feed && feed.latest) {
          setVisiblePosts(feed.latest);
      }
  }, [feed]);

  // Live Reader Simulator
  useEffect(() => {
    const interval = setInterval(() => {
        setLiveReaders(prev => {
            const change = Math.floor(Math.random() * 5) - 2;
            return Math.max(80, prev + change);
        });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Scroll listener for reading progress
  useEffect(() => {
    const handleScroll = () => {
        const totalScroll = document.documentElement.scrollTop;
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scroll = windowHeight > 0 ? totalScroll / windowHeight : 0;
        setReadProgress(Math.min(1, Math.max(0, scroll)));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activePost]);

  // Popup & Notification Timers
  useEffect(() => {
    const popupTimer = setTimeout(() => {
        if (viewMode === 'HOME' && !isMenuOpen) setShowPopup(true); 
    }, 15000); // 15s delay

    const notifTimer = setTimeout(() => {
        setShowNotificationRequest(true);
    }, 5000); // 5s delay

    return () => {
        clearTimeout(popupTimer);
        clearTimeout(notifTimer);
    };
  }, [viewMode, isMenuOpen]);

  const handlePostClick = async (post: BlogPost) => {
    setActivePost(post);
    setPostContent(null);
    setIsLoadingPost(true);
    setViewMode('ARTICLE');
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    
    // Simulate Ad Interstitial delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
        const fullContent = await generateBlogContent({
            ...config,
            niche: post.title, 
            wordCount: 1500
        });
        setPostContent(fullContent);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoadingPost(false);
    }
  };

  const handleBackToHome = () => {
    setViewMode('HOME');
    setActivePost(null);
    setPostContent(null);
    setCurrentCategory(null);
    window.scrollTo(0, 0);
  };

  const handleOpenArchive = () => {
      setViewMode('ARCHIVE');
      setIsMenuOpen(false);
      window.scrollTo(0,0);
  };

  const handleCategoryClick = (category: string) => {
      setCurrentCategory(category);
      setIsMenuOpen(false);
      window.scrollTo(0,0);
      
      // If we are in archive mode, filter is handled in render
      // If we are in home, we show filtered view
      if (viewMode !== 'ARCHIVE') {
          // For simplicity in Home view we simulate it by setting filtered visible posts
          // But ideally we redirect to Archive mode pre-filtered
           setViewMode('ARCHIVE');
      }
  };

  // --------------------------------------------------------------------------
  // MENU DRAWER COMPONENT
  // --------------------------------------------------------------------------
  const renderMenuDrawer = () => (
      <>
        {/* Backdrop */}
        <div 
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsMenuOpen(false)}
        />
        {/* Sidebar */}
        <div className={`fixed top-0 left-0 h-full w-[300px] bg-white z-[101] shadow-2xl transform transition-transform duration-300 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-black text-white">
                <h2 className="font-black italic text-xl tracking-tighter">VIRAL<span className="text-red-500">VELOCITY</span></h2>
                <button onClick={() => setIsMenuOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8 custom-scrollbar">
                {/* Navigation */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Explore ({ALL_CATEGORIES.length})</h3>
                    <ul className="space-y-2 font-bold text-gray-800">
                        {ALL_CATEGORIES.map(cat => (
                            <li 
                                key={cat} 
                                onClick={() => handleCategoryClick(cat)}
                                className="flex items-center justify-between cursor-pointer hover:text-red-600 transition-colors group text-sm border-b border-gray-50 py-1"
                            >
                                {cat}
                                <ChevronRight className="w-3 h-3 text-gray-300 group-hover:text-red-600" />
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Settings Simulation */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preferences</h3>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <Globe className="w-4 h-4" /> Language
                        </div>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">{config.language}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
                <button className="w-full bg-red-600 text-white font-bold py-3 rounded shadow hover:bg-red-700 mb-2">Subscribe Now</button>
                <p className="text-[10px] text-gray-400">© 2024 ViralVelocity Media Inc.</p>
            </div>
        </div>
      </>
  );

  // --------------------------------------------------------------------------
  // SEARCH OVERLAY COMPONENT
  // --------------------------------------------------------------------------
  const SearchOverlay = () => (
      isSearchOpen && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[80] animate-fade-in flex flex-col items-center pt-32 px-4">
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-8 right-8 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <X className="w-6 h-6 text-gray-600" />
            </button>
            <div className="w-full max-w-3xl">
                <h2 className="text-3xl font-black text-center mb-8 text-gray-900">What are you looking for?</h2>
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search for 'Bitcoin', 'AI', 'Stocks'..." 
                        className="w-full text-2xl font-bold border-b-4 border-gray-200 py-4 bg-transparent outline-none focus:border-red-600 placeholder-gray-300"
                        autoFocus
                    />
                    <Search className="absolute right-0 top-4 w-8 h-8 text-gray-400" />
                </div>
            </div>
        </div>
      )
  );

  // --------------------------------------------------------------------------
  // SINGLE POST VIEW
  // --------------------------------------------------------------------------
  if (viewMode === 'ARTICLE' && activePost) {
    return (
        <div className="bg-white min-h-screen font-serif pb-20"> {/* pb-20 for sticky footer ad */}
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 h-1.5 bg-red-600 z-[60]" style={{ width: `${readProgress * 100}%` }}></div>
            
            {renderMenuDrawer()}
            <SearchOverlay />

            {/* Sticky Social Sidebar (Desktop) */}
            <div className="hidden lg:flex fixed left-8 top-1/3 flex-col gap-4 z-40">
                <button className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                    <Facebook className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                    <Twitter className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                    <Linkedin className="w-5 h-5" />
                </button>
            </div>

            {/* Nav - Minimal for Read Mode */}
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-gray-100 z-50 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                     <button onClick={() => setIsMenuOpen(true)}>
                        <Menu className="w-6 h-6 text-gray-700 hover:text-red-600" />
                    </button>
                    <button onClick={handleBackToHome} className="flex items-center gap-2 text-gray-600 hover:text-black font-sans font-bold text-sm uppercase tracking-wider">
                        <ArrowLeft className="w-4 h-4" /> Back to Feed
                    </button>
                </div>
                
                <div className="font-black text-xl tracking-tighter italic hidden md:block">
                    VIRAL<span className="text-red-600">VELOCITY</span>
                </div>
                <div className="flex gap-2 items-center">
                     <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 animate-pulse">
                        <Eye className="w-3 h-3" />
                        <span className="text-xs font-bold font-sans">{liveReaders.toLocaleString()} Reading</span>
                     </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8 relative">
                
                {isLoadingPost ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-bold text-gray-900">Verifying Browser...</h2>
                            <p className="text-sm text-gray-500">Checking connection for a secure reading experience.</p>
                        </div>
                        {/* Fake Loading Ad */}
                        <div className="mt-8 w-[300px] h-[250px] bg-gray-50 border border-gray-200 flex flex-col items-center justify-center rounded">
                             <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Advertisement</p>
                             <div className="text-center p-4">
                                <h4 className="font-bold text-gray-800">Your Computer Might Be Slow</h4>
                                <p className="text-xs text-gray-500 mt-2">Download PC Cleaner Pro Now.</p>
                                <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded text-sm font-bold">Scan Now</button>
                             </div>
                        </div>
                    </div>
                ) : postContent ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* Article Content */}
                        <article className="lg:col-span-8">
                            <div className="flex items-center gap-3 text-sm text-gray-500 font-sans mb-4">
                                <span className="text-red-600 font-bold uppercase tracking-wider">{activePost.category}</span>
                                <span>•</span>
                                <span>{activePost.publishDate || 'Today'}</span>
                                <span>•</span>
                                <span>{activePost.readTime || '5 min read'}</span>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                                {postContent.title}
                            </h1>

                            <div className="flex items-center justify-between border-y border-gray-100 py-4 mb-8 font-sans">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                                        {(activePost.author || 'Ed')[0]}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{activePost.author || 'Senior Editor'}</div>
                                        <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Verified Expert
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 lg:hidden">
                                    <button className="p-2 text-gray-400 hover:text-blue-600"><Facebook className="w-4 h-4" /></button>
                                    <button className="p-2 text-gray-400 hover:text-sky-500"><Twitter className="w-4 h-4" /></button>
                                </div>
                            </div>

                            {/* Content Body with Native Ads */}
                            <div className="prose prose-lg prose-red max-w-none text-gray-800 leading-relaxed font-serif">
                                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-red-600 italic text-lg text-gray-700 mb-8 font-serif">
                                    <strong>Key Takeaways:</strong> {postContent.metaDescription}
                                </div>
                                
                                {renderContentWithNativeAds(postContent.body, postContent.affiliateProduct, postContent.affiliateCta, config)}
                            </div>

                            {/* Tags */}
                            <div className="mt-12 pt-6 border-t border-gray-100">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-sans">Filed Under</h4>
                                <div className="flex flex-wrap gap-2">
                                    {postContent.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-sans rounded-full cursor-pointer transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* AUTHOR BIO BOX */}
                            {postContent.authorBio && (
                                <div className="mt-12 p-6 bg-gray-50 rounded-xl flex gap-4 border border-gray-100 font-sans">
                                    <div className="w-16 h-16 bg-gray-300 rounded-full shrink-0 flex items-center justify-center text-xl font-bold text-gray-500">
                                        {(activePost.author || 'Ed')[0]}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">About {activePost.author || 'The Author'}</h4>
                                        <p className="text-sm text-gray-600 leading-relaxed">{postContent.authorBio}</p>
                                    </div>
                                </div>
                            )}

                            {/* RELATED POSTS GRID */}
                            <div className="mt-12">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 font-sans flex items-center gap-2">
                                    <ThumbsUp className="w-5 h-5 text-red-600" />
                                    You Might Also Like
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {postContent.relatedPosts?.map((post, idx) => (
                                        <div key={idx} className="group cursor-pointer">
                                            <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                                                <div className="w-full h-full bg-gray-300 group-hover:scale-105 transition-transform duration-500"></div>
                                            </div>
                                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{post.category}</span>
                                            <h4 className="font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors mt-1">
                                                {post.title}
                                            </h4>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </article>

                        {/* SIDEBAR - WITH HIDDEN SEO PANEL FOR ADMIN */}
                        <aside className="lg:col-span-4 space-y-8">
                            
                            {/* SEO SCORECARD (Visible because you are the admin) */}
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm font-sans">
                                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
                                    <BarChart2 className="w-4 h-4 text-emerald-600" />
                                    <h3 className="font-bold text-gray-800 text-sm uppercase">SEO Performance</h3>
                                    <span className="ml-auto bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {postContent.seoScore}/100
                                    </span>
                                </div>
                                
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase mb-1">Search Intent</p>
                                        <div className="flex items-center gap-2">
                                            <Target className="w-4 h-4 text-blue-500" />
                                            <span className="font-medium text-gray-700">{postContent.searchIntent}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <p className="text-gray-400 text-xs font-bold uppercase mb-1">Meta Description</p>
                                        <p className="text-xs text-gray-600 italic bg-white p-2 rounded border border-gray-200">
                                            "{postContent.metaDescription}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sticky Sidebar Widget */}
                            <div className="sticky top-24 space-y-8">
                                {/* Newsletter */}
                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center font-sans">
                                    <h4 className="font-bold text-blue-900 mb-2">Subscribe to Newsletter</h4>
                                    <p className="text-sm text-blue-700 mb-4">Get the top stories in your inbox every morning.</p>
                                    <input className="w-full p-2 rounded border border-blue-200 mb-2 text-sm" placeholder="Email Address" />
                                    <button className="w-full bg-blue-600 text-white font-bold py-2 rounded text-sm hover:bg-blue-700">Join Free</button>
                                </div>

                                {/* Skyscraper Ad */}
                                <div className="w-full h-[600px] bg-white border border-gray-300 shadow-sm flex flex-col items-center justify-center text-gray-400 relative group">
                                    <span className="font-bold">SIDEBAR SKYSCRAPER</span>
                                    <span className="text-xs">300x600</span>
                                    <span className="text-xs mt-2">Highest CTR Zone</span>
                                     <span className="absolute bottom-2 right-2 text-[9px] text-gray-300 hidden group-hover:block font-mono">
                                        ID: {config.credentials.adSenseId}
                                     </span>
                                </div>
                            </div>

                        </aside>
                    </div>
                ) : null}
            </main>
            
            {/* STICKY FOOTER AD - The Money Maker */}
            <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-300 z-50 flex items-center justify-center shadow-[0_-5px_20px_rgba(0,0,0,0.1)] group">
                 <div className="relative w-full max-w-3xl h-full flex items-center justify-between px-4">
                     <span className="text-[10px] absolute top-1 left-2 text-gray-400 font-bold uppercase flex gap-2">
                        Advertisement
                        <span className="font-mono hidden group-hover:inline text-gray-300">{config.credentials.adSenseId}</span>
                     </span>
                     <div className="flex items-center gap-4 w-full justify-center">
                         <div className="w-12 h-12 bg-gray-200 rounded"></div>
                         <div>
                             <p className="font-bold text-sm text-gray-900">Claim Your $100 Welcome Bonus</p>
                             <p className="text-xs text-gray-500">Limited time offer for new accounts.</p>
                         </div>
                         <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold text-sm shadow ml-auto">
                            Apply Now
                         </button>
                     </div>
                 </div>
            </div>
        </div>
    );
  }

  // --------------------------------------------------------------------------
  // FEED VIEW & ARCHIVE VIEW (Shared Wrapper)
  // --------------------------------------------------------------------------
  
  const displayedPosts = viewMode === 'ARCHIVE' 
      ? (currentCategory ? archive.filter(p => p.category === currentCategory) : archive)
      : visiblePosts;

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-900 overflow-y-auto relative pb-12">
      
      {renderMenuDrawer()}
      <SearchOverlay />
      {showNotificationRequest && (
        <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] p-4 z-[90] border border-gray-100 flex gap-4 animate-slide-in">
             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                 <Bell className="w-6 h-6 text-blue-600 animate-bounce" />
             </div>
             <div>
                 <h4 className="font-bold text-gray-900 mb-1">Get Breaking News Alerts?</h4>
                 <p className="text-xs text-gray-500 mb-3">Be the first to know about market moving trends.</p>
                 <div className="flex gap-2">
                     <button onClick={() => setShowNotificationRequest(false)} className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded">Later</button>
                     <button onClick={() => setShowNotificationRequest(false)} className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded">Allow</button>
                 </div>
             </div>
        </div>
      )}
      {showCookieConsent && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-[100] flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-800">
              <div className="text-xs text-gray-400 max-w-3xl">
                  <span className="font-bold text-white">We value your privacy.</span> We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
              </div>
              <div className="flex gap-3">
                   <button onClick={() => setShowCookieConsent(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-xs font-bold transition-colors">Reject</button>
                   <button onClick={() => setShowCookieConsent(false)} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-bold transition-colors shadow-lg shadow-emerald-900/20">Accept All</button>
              </div>
          </div>
      )}

      {/* RETENTION POPUP */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPopup(false)}></div>
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative z-10 animate-slide-in">
                <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                    <X className="w-5 h-5" />
                </button>
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                        <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black uppercase mb-2">Wait! Don't Miss Out</h3>
                    <p className="text-gray-600 mb-6">Join 20,000+ others getting our <strong>High-RPM Secrets</strong> delivered daily.</p>
                    <input type="email" placeholder="Your Best Email" className="w-full border border-gray-300 rounded p-3 mb-3 text-sm outline-none focus:border-red-500" />
                    <button className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition-colors">
                        Send Me The Guide
                    </button>
                    <p className="text-xs text-gray-400 mt-4 cursor-pointer hover:underline" onClick={() => setShowPopup(false)}>No thanks, I hate money.</p>
                </div>
            </div>
        </div>
      )}

      {/* TICKER TAPE */}
      <div className="bg-red-700 text-white text-xs font-bold py-2 overflow-hidden whitespace-nowrap relative z-40">
          <div className="inline-block animate-marquee pl-full">
            <span className="mx-4">BREAKING: Tech Stocks Rally As AI Regulation Looms</span> • 
            <span className="mx-4">CRYPTO: Bitcoin Hits New Support Level At $34k</span> • 
            <span className="mx-4">REVIEW: Is The New iPhone Worth The Upgrade?</span> • 
            <span className="mx-4">TRAVEL: Top 10 Hidden Gems In Europe For 2024</span> •
            <span className="mx-4">FINANCE: Federal Reserve Hints At Rate Pause</span>
          </div>
      </div>

      {/* HEADER - Trusted News Style */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-30 shadow-sm">
        <div className="bg-black text-white text-[10px] py-1 px-4 text-center font-bold tracking-widest uppercase">
           {config.language} Edition • Global Coverage • {new Date().toLocaleDateString()}
        </div>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsMenuOpen(true)}>
                    <Menu className="w-6 h-6 cursor-pointer hover:text-blue-600 transition-colors" />
                </button>
                <h1 className="text-3xl font-black tracking-tighter italic font-serif cursor-pointer" onClick={handleBackToHome}>
                   VIRAL<span className="text-red-600">VELOCITY</span>
                </h1>
            </div>
            {/* Horizontal Nav - Visible on Desktop */}
            <nav className="hidden md:flex gap-6 font-bold text-sm uppercase tracking-wide text-gray-600 overflow-hidden h-6">
                <a onClick={() => handleCategoryClick('Technology')} className="hover:text-black cursor-pointer">Tech</a>
                <a onClick={() => handleCategoryClick('Finance')} className="hover:text-black cursor-pointer">Finance</a>
                <a onClick={() => handleCategoryClick('Crypto')} className="hover:text-black cursor-pointer">Crypto</a>
                <a onClick={() => handleCategoryClick('Travel')} className="hover:text-black cursor-pointer">Travel</a>
                 <a onClick={() => handleCategoryClick('Gaming News')} className="hover:text-black cursor-pointer">Gaming</a>
            </nav>
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSearchOpen(true)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <Search className="w-5 h-5" />
                </button>
                <button onClick={() => setShowPopup(true)} className="bg-red-600 text-white px-4 py-2 text-sm font-bold uppercase rounded hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                    Subscribe
                </button>
            </div>
        </div>
      </header>

      {/* ADSENSE PLACEHOLDER - HEADER */}
      <div className="max-w-7xl mx-auto py-6 flex justify-center">
         <div className="w-[728px] h-[90px] bg-white border border-gray-200 shadow-sm flex items-center justify-center flex-col text-gray-400 text-xs relative group">
            <span className="font-bold">GOOGLE ADSENSE (LEADERBOARD)</span>
            <span>Targeting High CPM keywords in Finance/Tech</span>
             <span className="absolute bottom-1 right-2 text-[8px] text-gray-300 font-mono hidden group-hover:block">
                Publisher: {config.credentials.adSenseId}
            </span>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: HERO & LATEST (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Conditional Header for Archive Mode */}
            {viewMode === 'ARCHIVE' && (
                <div className="mb-6 pb-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 font-serif mb-1">
                            {currentCategory ? currentCategory : 'Full Archive'}
                        </h2>
                        <p className="text-gray-500 text-sm">Browsing {displayedPosts.length} published articles.</p>
                    </div>
                    {currentCategory && (
                         <button onClick={() => setCurrentCategory(null)} className="text-sm text-red-600 font-bold hover:underline">
                            Clear Filter
                         </button>
                    )}
                </div>
            )}

            {/* HERO SECTION (Only on Home View) */}
            {viewMode === 'HOME' && !currentCategory && (
                <article 
                    onClick={() => handlePostClick(feed.hero)}
                    className={`relative group cursor-pointer overflow-hidden rounded-xl bg-black shadow-xl ${loading ? 'animate-pulse' : ''}`}
                >
                    <div className="aspect-video w-full bg-gray-800 opacity-80 group-hover:opacity-60 transition-opacity">
                        {/* In a real app, this would be a generated image */}
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-blue-900 to-purple-900">
                        <TrendingUp className="w-24 h-24 text-white/20" />
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black via-black/80 to-transparent">
                        <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase mb-3 rounded">
                            {feed.hero.category}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg font-serif">
                            {feed.hero.title}
                        </h2>
                        <p className="text-gray-200 text-lg mb-4 line-clamp-2 max-w-2xl font-serif">
                            {feed.hero.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                            <span className="font-bold text-white">{feed.hero.author || "Senior Editor"}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {feed.hero.publishDate}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {feed.hero.views}</span>
                        </div>
                    </div>
                </article>
            )}

            {/* POSTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedPosts.map((post: BlogPost, index: number) => (
                    <React.Fragment key={post.id}>
                        <article 
                            onClick={() => handlePostClick(post)}
                            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-200 cursor-pointer group animate-fade-in"
                        >
                            <div className="h-48 bg-gray-200 relative overflow-hidden">
                                 <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    <span className="text-gray-400 font-serif italic text-4xl font-black opacity-20">IMG</span>
                                 </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-blue-600 text-xs font-bold uppercase">{post.category}</span>
                                    <span className="text-gray-400 text-xs flex items-center gap-1"><Eye className="w-3 h-3" /> {post.views}</span>
                                </div>
                                <h3 className="text-xl font-bold leading-tight mb-2 font-serif text-gray-900 group-hover:text-blue-700 transition-colors">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                    {post.excerpt}
                                </p>
                                <div className="flex gap-2">
                                    <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Facebook className="w-4 h-4" /></button>
                                    <button className="p-1.5 text-sky-500 hover:bg-sky-50 rounded"><Twitter className="w-4 h-4" /></button>
                                    <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded"><Link className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </article>

                        {/* STRATEGIC AD BREAK #1 - NATIVE GRID (After 4th post) */}
                        {index === 3 && viewMode === 'HOME' && (
                            <div className="md:col-span-2 py-8 my-4 border-y border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sponsored Stories</span>
                                    <span className="text-[10px] text-gray-300">Ads by Google</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="group cursor-pointer">
                                            <div className="aspect-video bg-gray-100 rounded mb-2 overflow-hidden relative">
                                                 <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 text-xs font-bold">AD</div>
                                            </div>
                                            <h5 className="font-bold text-xs text-gray-800 leading-tight group-hover:text-blue-600">
                                                {i === 1 ? 'Homeowners: Remember To Do This Before October' : i === 2 ? 'New AI Tool Writes Code In Seconds' : 'The Best Travel Cards For 2024'}
                                            </h5>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STRATEGIC AD BREAK #2 - BANNER (After 8th post) */}
                        {index === 7 && viewMode === 'HOME' && (
                            <div className="md:col-span-2 py-6 flex justify-center">
                                <div className="w-full h-[150px] bg-gray-50 border border-gray-200 flex flex-col items-center justify-center rounded-lg relative overflow-hidden group">
                                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest z-10">Advertisement</p>
                                     <div className="z-10 text-center">
                                         <h3 className="font-black text-lg text-gray-800">Limited Time Offer</h3>
                                         <button className="mt-2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">Shop Now</button>
                                     </div>
                                     <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"></div>
                                     <span className="absolute bottom-2 right-2 text-[8px] text-gray-300 font-mono hidden group-hover:block">
                                        ID: {config.credentials.adSenseId}
                                    </span>
                                </div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* SEE MORE / ARCHIVE BUTTON */}
            {viewMode === 'HOME' && (
                 <div className="py-8 flex justify-center border-t border-gray-200 mt-8">
                     <button 
                        onClick={handleOpenArchive}
                        className="px-8 py-3 bg-white border-2 border-black text-black font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                    >
                        View Full Archive ({archive.length} Posts) <ArrowLeft className="w-4 h-4 rotate-180" />
                     </button>
                 </div>
            )}

            {/* IN-FEED AD */}
            <div className="w-full h-[250px] bg-white border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center gap-2 shadow-sm relative group mt-8">
                 <p className="text-gray-400 font-bold tracking-widest">NATIVE AD PLACEMENT</p>
                 <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded shadow-lg hover:bg-blue-700">
                    Learn How To Retire At 30
                 </button>
                 <span className="text-[10px] text-gray-400">Sponsored Content</span>
                 <span className="absolute bottom-1 right-2 text-[8px] text-gray-300 font-mono hidden group-hover:block">
                    Ad Unit: {config.credentials.adSenseId}
                 </span>
            </div>

        </div>

        {/* RIGHT SIDEBAR (4 cols) */}
        <aside className="lg:col-span-4 space-y-8">
            
            {/* SOCIAL PROOF WIDGET */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
                <h4 className="font-black text-lg mb-2 uppercase">Join 2 Million Readers</h4>
                <p className="text-sm text-gray-500 mb-4">Get the viral news before it hits mainstream.</p>
                <div className="flex justify-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-80"><Facebook className="w-5 h-5"/></div>
                    <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-80"><Twitter className="w-5 h-5"/></div>
                    <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-80"><TrendingUp className="w-5 h-5"/></div>
                </div>
                <input type="email" placeholder="Your email address" className="w-full bg-gray-100 border border-gray-200 rounded p-2 text-sm mb-2 outline-none focus:border-blue-500" />
                <button className="w-full bg-black text-white font-bold py-2 rounded text-sm uppercase hover:bg-gray-800 transition-colors">Sign Up Free</button>
            </div>

            {/* TRENDING WIDGET */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-red-600 text-white px-4 py-3 font-bold uppercase flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trending Now
                </div>
                <div className="divide-y divide-gray-100">
                    {feed.trending.map((post: BlogPost, i: number) => (
                        <div 
                            key={post.id} 
                            onClick={() => handlePostClick(post)}
                            className="p-4 hover:bg-gray-50 cursor-pointer flex gap-4 group"
                        >
                            <div className="text-3xl font-black text-gray-200 group-hover:text-red-200 font-serif">
                                {i + 1}
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-red-600 uppercase mb-1 block">{post.category}</span>
                                <h5 className="font-bold text-gray-900 leading-snug group-hover:text-red-600 transition-colors">
                                    {post.title}
                                </h5>
                                <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {post.views} reads
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* STICKY AD */}
            <div className="sticky top-24 w-full h-[600px] bg-white border border-gray-300 shadow-sm flex flex-col items-center justify-center text-gray-400 relative group">
                <span className="font-bold">SIDEBAR SKYSCRAPER</span>
                <span className="text-xs">300x600</span>
                <span className="text-xs mt-2">Highest CTR Zone</span>
                <span className="absolute bottom-2 right-2 text-[9px] text-gray-300 hidden group-hover:block font-mono">
                    ID: {config.credentials.adSenseId}
                </span>
            </div>

        </aside>

      </main>

      <footer className="bg-black text-gray-400 py-12 mt-12 border-t border-gray-800">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
             <div>
                <h4 className="text-white font-bold uppercase mb-4">ViralVelocity</h4>
                <p className="text-sm">The world's fastest growing digital media network. Covering Tech, Finance, and Culture.</p>
             </div>
             <div>
                <h4 className="text-white font-bold uppercase mb-4">Categories</h4>
                <ul className="space-y-2 text-sm">
                    <li>Technology</li>
                    <li>Finance</li>
                    <li>Health</li>
                    <li>Crypto</li>
                </ul>
             </div>
             <div>
                <h4 className="text-white font-bold uppercase mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                    <li>Privacy Policy</li>
                    <li>Terms of Service</li>
                    <li>Affiliate Disclosure</li>
                </ul>
             </div>
         </div>
      </footer>
      
      <style>{`
        @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
        }
        .animate-marquee {
            animation: marquee 20s linear infinite;
        }
        .pl-full {
            padding-left: 100%;
        }
      `}</style>
    </div>
  );
};
