import React from 'react';
import { PipelineConfig } from '../types';
import { Settings as SettingsIcon, Target, Clock, Type, DollarSign, BarChart2, Radio, Globe, Zap } from 'lucide-react';

interface SettingsProps {
  config: PipelineConfig;
  onChange: (newConfig: PipelineConfig) => void;
}

export const Settings: React.FC<SettingsProps> = ({ config, onChange }) => {
  
  const updateField = (field: keyof PipelineConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const toggleMonetization = (method: string) => {
    const current = config.monetization;
    if (current.includes(method)) {
        updateField('monetization', current.filter(m => m !== method));
    } else {
        updateField('monetization', [...current, method]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="border-b border-gray-800 pb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <SettingsIcon className="w-6 h-6 text-gray-400" />
          Empire Configuration
        </h2>
        <p className="text-gray-400 mt-2">Configure the brain of your automated SEO machine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Niche Selection */}
        <div className="space-y-4">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Niche / Global Focus
            </label>
            <input 
                type="text" 
                value={config.niche}
                onChange={(e) => updateField('niche', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="e.g. Global Trending News"
            />
        </div>

        {/* Target Region */}
        <div className="space-y-4">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                Target Region
            </label>
            <select 
                value={config.targetRegion}
                onChange={(e) => updateField('targetRegion', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
                <option value="Global">Global (Maximum Traffic Volume)</option>
                <option value="US/UK/CA">Tier 1 (High CPM/AdSense Rates)</option>
                <option value="Asia Pacific">Asia Pacific (High Growth)</option>
                <option value="Europe">Europe</option>
            </select>
        </div>

        {/* SEO Strategy */}
        <div className="space-y-4">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-orange-400" />
                SEO Strategy
            </label>
            <select 
                value={config.seoStrategy}
                onChange={(e) => updateField('seoStrategy', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-orange-500 outline-none"
            >
                <option value="Skyscraper Technique">Skyscraper (Better than #1 Result)</option>
                <option value="Viral News">Viral News (High CTR, Mass Traffic)</option>
                <option value="Programmatic SEO">Programmatic (Mass Page Gen)</option>
                <option value="Evergreen Authority">Evergreen Authority</option>
            </select>
        </div>

        {/* Data Source */}
        <div className="space-y-4">
             <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400" />
                Topic Source
            </label>
            <select 
                value={config.dataSource}
                onChange={(e) => updateField('dataSource', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
            >
                <option value="Google Trends">Google Trends (Real-time Search)</option>
                <option value="Twitter/X Trends">Twitter/X Trends (Social Viral)</option>
                <option value="NewsAPI">NewsAPI (Global Headlines)</option>
                <option value="Specific Keywords">Specific Keywords List</option>
            </select>
        </div>

        {/* Indexing Strategy */}
        <div className="space-y-4">
             <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Indexing Speed
            </label>
            <select 
                value={config.indexingStrategy}
                onChange={(e) => updateField('indexingStrategy', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-500 outline-none"
            >
                <option value="Instant Indexing API">Instant Indexing API (Rank in Minutes)</option>
                <option value="Standard XML">Standard Sitemap (Slower)</option>
                <option value="Ping Services">Ping Services Only</option>
            </select>
        </div>

        {/* Tone */}
        <div className="space-y-4">
             <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Type className="w-4 h-4 text-purple-400" />
                Content Tone
            </label>
            <select 
                value={config.tone}
                onChange={(e) => updateField('tone', e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
            >
                <option value="Urgent, Authoritative, and Highly Engaging">Authoritative & Viral</option>
                <option value="Informative and Professional">Informative & Professional</option>
                <option value="Casual and Fun">Casual & Fun</option>
            </select>
        </div>

      </div>

      {/* Monetization */}
      <div className="space-y-4 pt-6 border-t border-gray-800">
         <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-yellow-400" />
            Active Monetization Channels
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['AdSense', 'Amazon Affiliate', 'CPA Offers', 'Premium Sponsors', 'Crypto Referral'].map((method) => (
                <button
                    key={method}
                    onClick={() => toggleMonetization(method)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        config.monetization.includes(method)
                        ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-200'
                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800'
                    }`}
                >
                    {method}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};