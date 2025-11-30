
import React, { useState } from 'react';
import { generateBlogContent, generateBlogImage } from '../services/gemini';
import { PipelineConfig, GeneratedContent } from '../types';
import { Loader2, RefreshCw, Image as ImageIcon, Search, CheckCircle, TrendingUp, Globe, Code } from 'lucide-react';

interface SimulatorProps {
  config: PipelineConfig;
}

export const Simulator: React.FC<SimulatorProps> = ({ config }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<string>('');
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'serp' | 'article' | 'schema'>('serp');

  const runSimulation = async () => {
    setLoading(true);
    setError('');
    setContent(null);
    setImageUrl('');
    setActiveTab('serp');
    
    try {
      setStep(`Analyzing ${config.dataSource} Globally...`);
      await new Promise(r => setTimeout(r, 1200));
      
      setStep('Identifying Keyword Gaps & Search Intent...');
      await new Promise(r => setTimeout(r, 1000));

      setStep(`Engineering Content via ${config.seoStrategy}...`);
      const generated = await generateBlogContent(config);
      setContent(generated);

      if (generated.imagePrompt && config.includeImages) {
        setStep('Synthesizing High-CTR Thumbnail...');
        const img = await generateBlogImage(generated.imagePrompt);
        setImageUrl(img);
      }

      setStep(`Validating JSON-LD Schema...`);
      await new Promise(r => setTimeout(r, 600));

      setStep('Simulating Instant Indexing...');
      await new Promise(r => setTimeout(r, 600));
      
      setStep('Complete');

    } catch (err: any) {
      setError(err.message || "Simulation failed. Check API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Simulation Lab
            <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded border border-emerald-800 uppercase tracking-wide">
               {config.targetRegion}
            </span>
          </h2>
          <p className="text-gray-400">Test how your automated content dominates the Search Engine Results Page (SERP).</p>
        </div>
        <button 
          onClick={runSimulation}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all ${
            loading 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
          }`}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          {loading ? step : 'Run Search Dominance Test'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
          Error: {error}
        </div>
      )}

      {/* Results View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Main Preview Area */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden h-[600px]">
          {/* Preview Tabs */}
          <div className="bg-gray-800 border-b border-gray-700 flex">
             <button 
                onClick={() => setActiveTab('serp')}
                className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'serp' ? 'bg-gray-900 text-emerald-400 border-t-2 border-emerald-400' : 'text-gray-400 hover:text-white'}`}
             >
                <Search className="w-4 h-4" /> Google SERP
             </button>
             <button 
                onClick={() => setActiveTab('article')}
                className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'article' ? 'bg-gray-900 text-emerald-400 border-t-2 border-emerald-400' : 'text-gray-400 hover:text-white'}`}
             >
                <Globe className="w-4 h-4" /> Blog Post
             </button>
             <button 
                onClick={() => setActiveTab('schema')}
                className={`px-6 py-3 text-sm font-medium flex items-center gap-2 ${activeTab === 'schema' ? 'bg-gray-900 text-emerald-400 border-t-2 border-emerald-400' : 'text-gray-400 hover:text-white'}`}
             >
                <Code className="w-4 h-4" /> Tech SEO (Schema)
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white text-gray-900">
            {content ? (
              <>
                {/* GOOGLE SERP SIMULATION */}
                {activeTab === 'serp' && (
                    <div className="p-8 bg-white min-h-full">
                         <div className="max-w-2xl">
                             <div className="text-xs text-gray-500 mb-4">About 1,230,000 results (0.34 seconds)</div>
                             
                             {/* Rich Snippet / Feature Snippet Simulation */}
                             <div className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                                 <div className="text-sm text-gray-800 font-medium mb-2">
                                     {content.body.slice(0, 150)}...
                                 </div>
                                 <div className="mb-1">
                                     <div className="text-xs text-gray-800">yourblog.com › {content.tags[0].toLowerCase().replace(' ', '-')}</div>
                                     <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium">{content.title}</h3>
                                 </div>
                             </div>

                             {/* Standard Result */}
                             <div className="mb-6">
                                <div className="flex items-center gap-2 mb-1 group cursor-pointer">
                                    <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-[10px] text-gray-500">Logo</div>
                                    <div>
                                        <div className="text-sm text-[#202124]">Your Brand Name</div>
                                        <div className="text-xs text-gray-500">https://www.yourblog.com › {content.tags[0].toLowerCase()}</div>
                                    </div>
                                </div>
                                <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium mb-1">{content.title}</h3>
                                <div className="text-sm text-[#4d5156] leading-6">
                                    <span className="text-gray-500">{new Date().toLocaleDateString()} — </span>
                                    {content.metaDescription}
                                </div>
                             </div>

                             {/* Image Pack Simulation */}
                             {imageUrl && (
                                 <div className="flex gap-2 overflow-hidden mb-6">
                                     <div className="w-1/3 aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
                                         <img src={imageUrl} className="w-full h-full object-cover" />
                                         <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">Latest</div>
                                     </div>
                                     <div className="w-1/3 aspect-video bg-gray-100 rounded-lg"></div>
                                     <div className="w-1/3 aspect-video bg-gray-100 rounded-lg"></div>
                                 </div>
                             )}
                         </div>
                    </div>
                )}

                {/* BLOG POST PREVIEW */}
                {activeTab === 'article' && (
                    <div className="p-8 max-w-3xl mx-auto">
                        <h1 className="text-3xl font-bold mb-4 leading-tight font-serif">{content.title}</h1>
                        {imageUrl && (
                            <img src={imageUrl} alt="Featured" className="w-full rounded-lg mb-6 shadow-md" />
                        )}
                        <div className="flex gap-2 mb-6">
                            {content.tags.slice(0, 3).map(t => (
                                <span key={t} className="px-2 py-1 bg-gray-100 text-xs font-bold uppercase tracking-wider text-gray-600 rounded">{t}</span>
                            ))}
                        </div>
                        <div className="prose prose-stone max-w-none whitespace-pre-wrap">
                            {content.body}
                        </div>
                        {/* Monetization Placeholder */}
                        <div className="my-8 p-6 bg-yellow-50 border border-yellow-200 rounded text-center">
                            <p className="text-sm font-bold text-gray-400 uppercase mb-2">Advertisement / Affiliate Slot</p>
                            <div className="h-16 bg-gray-200 rounded w-full animate-pulse"></div>
                        </div>
                    </div>
                )}

                {/* SCHEMA VALIDATOR */}
                {activeTab === 'schema' && (
                    <div className="p-8 bg-[#1e1e1e] min-h-full text-blue-300 font-mono text-xs overflow-auto">
                        <div className="mb-4 text-gray-400 font-sans text-sm border-b border-gray-700 pb-2">
                             Use this JSON-LD to qualify for Rich Results (NewsArticle, FAQPage).
                        </div>
                        <pre>{JSON.stringify(JSON.parse(content.jsonLd || '{}'), null, 2)}</pre>
                    </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-gray-900">
                <Search className="w-16 h-16 mb-4 opacity-10" />
                <p>Run simulation to see search placement...</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Column */}
        <div className="space-y-6">
            
            {/* Score Cards */}
            {content && (
                <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                             <span className="text-gray-400 text-xs uppercase font-bold">SEO Health</span>
                             <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{content.seoScore}</div>
                        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${content.seoScore}%` }}></div>
                        </div>
                        
                        {/* ACTIONABLE FEEDBACK - NEW LOGIC */}
                        <div className="mt-3 pt-3 border-t border-gray-800">
                             {content.seoScore >= 95 ? (
                                 <p className="text-xs text-emerald-400 font-medium">Perfect! Ready for #1 ranking domination.</p>
                             ) : content.seoScore >= 85 ? (
                                 <p className="text-xs text-blue-400 font-medium">Strong. Add 2 more internal links to boost authority.</p>
                             ) : content.seoScore >= 70 ? (
                                 <p className="text-xs text-yellow-400 font-medium">Good start. Increase LSI keyword density by 1-2%.</p>
                             ) : (
                                 <div className="text-xs text-red-400">
                                     <p className="font-bold mb-1">Needs Improvement:</p>
                                     <ul className="list-disc pl-4 space-y-1 opacity-80">
                                         <li>Meta description is too short</li>
                                         <li>Missing H3 subheaders</li>
                                         <li>Low keyword density</li>
                                     </ul>
                                 </div>
                             )}
                        </div>
                    </div>
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl">
                         <div className="flex items-center justify-between mb-2">
                             <span className="text-gray-400 text-xs uppercase font-bold">Viral Probability</span>
                             <TrendingUp className="w-4 h-4 text-orange-400" />
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{content.trendingScore}</div>
                        <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${content.trendingScore}%` }}></div>
                        </div>
                    </div>
                </div>
            )}

             {/* Intent Analysis */}
             <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Search Intent Analysis</h3>
                {content ? (
                    <div>
                         <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                content.searchIntent.includes('Transactional') ? 'bg-green-900/50 text-green-400' :
                                content.searchIntent.includes('Navigational') ? 'bg-blue-900/50 text-blue-400' :
                                'bg-purple-900/50 text-purple-400'
                            }`}>
                                {content.searchIntent}
                            </span>
                            <span className="text-gray-400 text-sm">Detected</span>
                         </div>
                         <p className="text-sm text-gray-500 leading-relaxed">
                            The AI structured this post as 
                            <strong className="text-gray-300"> {content.searchIntent} </strong> 
                            because trends indicate users are looking for {
                                content.searchIntent.includes('Informational') ? 'answers and guides' : 'products to buy'
                            }.
                         </p>
                    </div>
                ) : (
                    <div className="h-20 bg-gray-800/50 rounded animate-pulse"></div>
                )}
            </div>

            {/* Keyword Strategy */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">LSI Keywords Target</h3>
                {content ? (
                    <div className="flex flex-wrap gap-2">
                        {content.tags.map((tag, i) => (
                            <span key={i} className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-600">Waiting for generation...</p>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};