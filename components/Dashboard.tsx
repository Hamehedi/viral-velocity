import React from 'react';
import { Activity, BarChart3, Zap, Globe, Cpu, DollarSign, TrendingUp, Search, Radio, Rocket } from 'lucide-react';
import { PipelineConfig } from '../types';

interface DashboardProps {
  config: PipelineConfig;
  onNavigate: (view: any) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; sub?: string; color?: string }> = ({ title, value, icon, sub, color = "text-emerald-400" }) => (
  <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-gray-700 transition-colors group">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className={`p-2 bg-gray-800 rounded-lg ${color} group-hover:bg-gray-700 transition-colors`}>
        {icon}
      </div>
    </div>
    {sub && <p className="text-xs text-gray-500">{sub}</p>}
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ config, onNavigate }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Empire Command Center</h1>
          <p className="text-gray-400">Targeting <span className="text-emerald-400 font-mono">{config.targetRegion}</span> with <span className="text-white">{config.seoStrategy}</span></p>
        </div>
        <div className="flex gap-3">
             <button 
                onClick={() => onNavigate('SIMULATOR')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20"
            >
                <Zap className="w-4 h-4" />
                Test Ranking Power
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
            title="Indexing Speed" 
            value={config.indexingStrategy.includes('API') ? 'Instant (<5m)' : 'Standard'} 
            icon={<Rocket className="w-5 h-5" />}
            sub="Google Indexing API status"
            color={config.indexingStrategy.includes('API') ? "text-purple-400" : "text-gray-400"}
        />
        <StatCard 
            title="Monetization Active" 
            value={`${config.monetization.length} Sources`} 
            icon={<DollarSign className="w-5 h-5" />}
            sub="Optimized for High RPM"
            color="text-yellow-400"
        />
        <StatCard 
            title="Trend Source" 
            value={config.dataSource} 
            icon={<Radio className="w-5 h-5" />}
            sub="Real-time signals active"
            color="text-red-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visualizer */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Traffic Pipeline Visualization
            </h3>
            
            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-800"></div>

                <div className="space-y-8 relative">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-500/30 flex items-center justify-center shrink-0 z-10">
                            <Search className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">1. Intent Detection</h4>
                            <p className="text-sm text-gray-400 mt-1">Identifies 'Gap Keywords' in {config.targetRegion} with low competition.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-900/30 border border-purple-500/30 flex items-center justify-center shrink-0 z-10">
                            <Cpu className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">2. Content Engineering</h4>
                            <p className="text-sm text-gray-400 mt-1">Generates {config.wordCount} words + JSON-LD Schema for Rich Snippets.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-900/30 border border-emerald-500/30 flex items-center justify-center shrink-0 z-10">
                            <Rocket className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h4 className="text-white font-medium">3. Instant Indexing</h4>
                            <p className="text-sm text-gray-400 mt-1">Pushes URL to Google API for ranking in minutes, not days.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
             <h3 className="text-lg font-semibold text-white mb-6">Execution Strategy</h3>
             <div className="space-y-4">
                <button onClick={() => onNavigate('SIMULATOR')} className="w-full p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg text-left transition-all flex items-center justify-between group">
                    <div>
                        <h4 className="text-white font-medium">Simulate Google SERP</h4>
                        <p className="text-sm text-gray-400 mt-1">See how your post looks in search results.</p>
                    </div>
                    <Search className="w-5 h-5 text-gray-500 group-hover:text-blue-400" />
                </button>

                <button onClick={() => onNavigate('CODE_GEN')} className="w-full p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg text-left transition-all flex items-center justify-between group">
                    <div>
                        <h4 className="text-white font-medium">Get Enterprise Bot Script</h4>
                        <p className="text-sm text-gray-400 mt-1">Download Python code with Indexing API logic.</p>
                    </div>
                    <Cpu className="w-5 h-5 text-gray-500 group-hover:text-purple-400" />
                </button>

                <div className="p-4 bg-emerald-900/10 border border-emerald-500/20 rounded-lg flex gap-3">
                    <Globe className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                        <h4 className="text-emerald-400 text-sm font-medium">Targeting Active: {config.targetRegion}</h4>
                        <p className="text-xs text-gray-500 mt-1">Content will use local idioms and references for max trust.</p>
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};