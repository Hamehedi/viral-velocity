

import React, { useState, useEffect } from 'react';
import { PipelineConfig } from '../types';
import { generateAutomationScript } from '../services/gemini';
import { Settings as SettingsIcon, Terminal, Copy, Play, Check, X, Target, BarChart2, Globe, DollarSign, Languages, LineChart, FileText, CreditCard, HelpCircle, Wallet } from 'lucide-react';
import { ADS_TXT_CONTENT } from '../constants';

interface AdminPanelProps {
  config: PipelineConfig;
  setConfig: (c: PipelineConfig) => void;
  isOpen: boolean;
  onClose: () => void;
  onGenerateFeed: () => void;
  isGenerating: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, setConfig, isOpen, onClose, onGenerateFeed, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'SETTINGS' | 'CODE' | 'ANALYTICS'>('SETTINGS');
  const [script, setScript] = useState('');
  const [loadingScript, setLoadingScript] = useState(false);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);

  useEffect(() => {
    if (activeTab === 'CODE') {
        setLoadingScript(true);
        generateAutomationScript(config, 'Replit').then(setScript).finally(() => setLoadingScript(false));
    }
  }, [activeTab, config]);

  const updateCredential = (key: keyof typeof config.credentials, value: string) => {
      setConfig({
          ...config,
          credentials: {
              ...config.credentials,
              [key]: value
          }
      });
  };

  const copyAdsTxt = () => {
    navigator.clipboard.writeText(ADS_TXT_CONTENT);
    setCopiedAdsTxt(true);
    setTimeout(() => setCopiedAdsTxt(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        {/* Panel */}
        <div className="relative w-full max-w-2xl bg-gray-900 h-full border-l border-gray-800 shadow-2xl flex flex-col animate-slide-in">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-950">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-emerald-500" />
                        Backend Command Center
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">Configure the AI Agent that powers your blog.</p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-800">
                <button 
                    onClick={() => setActiveTab('SETTINGS')}
                    className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'SETTINGS' ? 'border-emerald-500 text-emerald-400 bg-gray-800/50' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    AI Configuration
                </button>
                <button 
                    onClick={() => setActiveTab('ANALYTICS')}
                    className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'ANALYTICS' ? 'border-emerald-500 text-emerald-400 bg-gray-800/50' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Live Revenue
                </button>
                <button 
                    onClick={() => setActiveTab('CODE')}
                    className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'CODE' ? 'border-emerald-500 text-emerald-400 bg-gray-800/50' : 'border-transparent text-gray-400 hover:text-white'}`}
                >
                    Source Code
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                
                {activeTab === 'SETTINGS' && (
                    <div className="space-y-8">
                        {/* Simulation Control */}
                        <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-6">
                            <h3 className="text-emerald-400 font-bold mb-2">Manual Override</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Force the AI agent to scan {config.dataSource} and update the blog frontend immediately.
                            </p>
                            <button 
                                onClick={onGenerateFeed}
                                disabled={isGenerating}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>Processing Global Trends...</>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4" />
                                        Run AI Content Pipeline
                                    </>
                                )}
                            </button>
                        </div>

                         {/* FINANCIAL SETUP - NEW SECTION */}
                         <div className="space-y-4 pt-4 border-t border-gray-800">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-yellow-500" /> 
                                Financial Setup
                            </h3>
                            <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 text-sm text-gray-300 flex gap-3 mb-2">
                                <HelpCircle className="w-5 h-5 text-blue-400 shrink-0" />
                                <div>
                                    <strong className="text-white block mb-1">How do I get paid?</strong>
                                    The automation script uses YOUR personal IDs below. Money from AdSense and Amazon goes directly to your bank account, not to this platform.
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-xs uppercase font-bold mb-1 block">AdSense Publisher ID</label>
                                    <input 
                                        type="text"
                                        placeholder="pub-xxxxxxxxxxxxxxxx"
                                        value={config.credentials.adSenseId}
                                        onChange={(e) => updateCredential('adSenseId', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-yellow-500 outline-none" 
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">Found in AdSense Account > Settings</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-xs uppercase font-bold mb-1 block">AdSense Customer ID</label>
                                    <input 
                                        type="text"
                                        placeholder="6292420416"
                                        value={config.credentials.adSenseCustomerId}
                                        onChange={(e) => updateCredential('adSenseCustomerId', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-yellow-500 outline-none" 
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">Found in AdSense Account Info</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-xs uppercase font-bold mb-1 block">AdSense Slot ID</label>
                                    <input 
                                        type="text"
                                        placeholder="1234567890"
                                        value={config.credentials.adSenseSlotId}
                                        onChange={(e) => updateCredential('adSenseSlotId', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-yellow-500 outline-none" 
                                    />
                                     <p className="text-[10px] text-gray-500 mt-1">Found in AdSense Ad Unit</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-xs uppercase font-bold mb-1 block">Amazon Affiliate Tag</label>
                                    <input 
                                        type="text"
                                        placeholder="mytag-20"
                                        value={config.credentials.amazonAffiliateTag}
                                        onChange={(e) => updateCredential('amazonAffiliateTag', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-yellow-500 outline-none" 
                                    />
                                     <p className="text-[10px] text-gray-500 mt-1">Found in Amazon Associates Central</p>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-xs uppercase font-bold mb-1 block">Blogger Blog ID</label>
                                    <input 
                                        type="text"
                                        placeholder="123456789"
                                        value={config.credentials.bloggerBlogId}
                                        onChange={(e) => updateCredential('bloggerBlogId', e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none" 
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">Found in your Blogger URL: blogger.com/blog/ID/...</p>
                                </div>
                            </div>
                            
                            {/* Ads.txt Configuration Helper */}
                            <div className="mt-4 p-4 bg-gray-950 border border-gray-800 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-gray-400 text-xs uppercase font-bold">Blogger Ads.txt Configuration</label>
                                    <button 
                                        onClick={copyAdsTxt}
                                        className="text-xs text-emerald-400 flex items-center gap-1 hover:text-emerald-300 transition-colors"
                                    >
                                        {copiedAdsTxt ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copiedAdsTxt ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                                <textarea 
                                    readOnly 
                                    value={ADS_TXT_CONTENT}
                                    className="w-full bg-gray-900 text-gray-400 text-xs font-mono p-2 rounded border border-gray-800 focus:outline-none"
                                    rows={2}
                                />
                                <p className="text-[10px] text-gray-500 mt-2">
                                    <strong>Instructions:</strong> Copy this code. Go to Blogger Dashboard → Settings → Monetization. Enable "Custom ads.txt" and paste the code there. This is required to get paid.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-800">
                            <h3 className="text-white font-bold flex items-center gap-2"><Target className="w-4 h-4" /> Niche & Audience</h3>
                            
                            <div>
                                <label className="text-gray-400 text-xs uppercase font-bold mb-1 block">Blog Niche</label>
                                <input 
                                    value={config.niche}
                                    onChange={(e) => setConfig({...config, niche: e.target.value})}
                                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:border-emerald-500 outline-none" 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-400 text-xs uppercase font-bold mb-1 block">Geo Target</label>
                                    <select 
                                        value={config.targetRegion}
                                        onChange={(e) => setConfig({...config, targetRegion: e.target.value as any})}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none"
                                    >
                                        <option value="Global">Global</option>
                                        <option value="US/UK/CA">Tier 1 (US/UK/CA)</option>
                                        <option value="Asia Pacific">Asia Pacific</option>
                                        <option value="Europe">Europe</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-gray-400 text-xs uppercase font-bold mb-1 block">Content Language</label>
                                    <select 
                                        value={config.language}
                                        onChange={(e) => setConfig({...config, language: e.target.value as any})}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white outline-none"
                                    >
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish (Español)</option>
                                        <option value="French">French (Français)</option>
                                        <option value="German">German (Deutsch)</option>
                                        <option value="Portuguese">Portuguese (Português)</option>
                                        <option value="Hindi">Hindi (हिंदी)</option>
                                        <option value="Japanese">Japanese (日本語)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-gray-800">
                             <h3 className="text-white font-bold flex items-center gap-2"><DollarSign className="w-4 h-4" /> Monetization Strategy</h3>
                             <div className="flex flex-wrap gap-2">
                                {['AdSense', 'Amazon', 'CPA', 'Crypto'].map(m => (
                                    <button 
                                        key={m}
                                        onClick={() => {
                                            const newMon = config.monetization.includes(m) 
                                                ? config.monetization.filter(x => x !== m)
                                                : [...config.monetization, m];
                                            setConfig({...config, monetization: newMon});
                                        }}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${config.monetization.includes(m) ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                             </div>
                        </div>
                    </div>
                )}

                {activeTab === 'ANALYTICS' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                <p className="text-gray-400 text-xs uppercase font-bold">Projected Monthly</p>
                                <p className="text-2xl font-bold text-white">$14,203</p>
                                <p className="text-emerald-400 text-xs">+12% from last month</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                                <p className="text-gray-400 text-xs uppercase font-bold">Current RPM</p>
                                <p className="text-2xl font-bold text-white">$42.50</p>
                                <p className="text-gray-500 text-xs">High Tier 1 Traffic</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative overflow-hidden">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <LineChart className="w-4 h-4 text-emerald-400" />
                                Traffic Growth Simulation
                            </h4>
                            {/* Fake Chart */}
                            <div className="h-40 flex items-end justify-between gap-1">
                                {[30, 45, 38, 52, 58, 65, 50, 75, 82, 88, 95, 100].map((h, i) => (
                                    <div key={i} className="bg-emerald-500/20 hover:bg-emerald-500 transition-colors w-full rounded-t" style={{ height: `${h}%` }}></div>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>Day 1</span>
                                <span>Day 30</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-gray-400 text-xs font-bold uppercase">Top Performing Keywords</h4>
                            {['Bitcoin Prediction 2025', 'Best AI Tools Free', 'Remote Jobs No Experience'].map(k => (
                                <div key={k} className="flex justify-between items-center p-3 bg-gray-800 rounded border border-gray-700">
                                    <span className="text-white text-sm">{k}</span>
                                    <span className="text-emerald-400 text-xs font-bold">Volume: High</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'CODE' && (
                    <div className="h-full flex flex-col">
                         {/* DEPLOYMENT BLUEPRINT UI */}
                         <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg mb-4">
                            <h3 className="text-blue-200 font-bold text-sm mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Deployment Blueprint (Enterprise Scale)
                            </h3>
                            <ul className="text-xs text-blue-300/80 space-y-2 list-disc pl-4">
                                <li><strong>30-Category Strategy:</strong> The bot now cycles through 30 distinct niches (15 High Value + 15 High Volume).</li>
                                <li><strong>Smart Feedback Loop:</strong> The script simulates traffic analysis to post more often in winning categories.</li>
                                <li><strong>High Frequency:</strong> Scheduling is set to ~10 mins per post to reach 50-100 posts/day.</li>
                                <li><strong>Monetization:</strong> AdSense ({config.credentials.adSenseId || 'Not Set'}) and Amazon ({config.credentials.amazonAffiliateTag || 'Not Set'}) injected.</li>
                                <li><strong>Indexing:</strong> URLs are pinged to Google instantly via API for rapid ranking.</li>
                            </ul>
                            <div className="mt-3 p-3 bg-blue-950/50 border border-blue-800 rounded">
                                <p className="text-[10px] text-blue-300">
                                    <strong>💡 Pro Tip: Never Stop Posting</strong><br/>
                                    If using Replit Free, create a free account on <a href="https://uptimerobot.com" target="_blank" className="underline hover:text-white">UptimeRobot.com</a>. 
                                    Add a new "HTTP Monitor" pointing to the URL Replit gives you when you run this code. This pings your bot every 5 mins, keeping it alive forever.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <p className="text-gray-400 text-sm">Python worker script for automated posting.</p>
                            <button onClick={() => navigator.clipboard.writeText(script)} className="text-emerald-400 text-xs flex items-center gap-1 hover:text-emerald-300">
                                <Copy className="w-3 h-3" /> Copy
                            </button>
                        </div>
                        <div className="flex-1 bg-black rounded-lg border border-gray-800 p-4 overflow-auto font-mono text-xs text-gray-300 relative">
                             {loadingScript && (
                                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                             )}
                             <pre>{script}</pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};