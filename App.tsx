
import React, { useState, useEffect } from 'react';
import { BlogFrontend } from './components/BlogFrontend';
import { AdminPanel } from './components/AdminPanel';
import { PipelineConfig, GeneratedFeed, BlogPost } from './types';
import { DEFAULT_CONFIG, INITIAL_POSTS } from './constants';
import { generateViralFeed, generateSimulatedArchive } from './services/gemini';
import { Settings } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<PipelineConfig>(DEFAULT_CONFIG);
  const [feed, setFeed] = useState<GeneratedFeed | any>(INITIAL_POSTS);
  const [archive, setArchive] = useState<BlogPost[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize archive with initial posts AND 100+ simulated posts
  useEffect(() => {
    // 1. Start with the preset Demo posts
    let initialArchive = [
        INITIAL_POSTS.hero,
        ...INITIAL_POSTS.trending,
        ...INITIAL_POSTS.latest
    ];
    
    // 2. Generate 100+ simulated posts to populate the "Empty Site"
    const simulatedPosts = generateSimulatedArchive();
    
    // 3. Combine them
    setArchive([...initialArchive, ...simulatedPosts]);
  }, []);

  const handleGenerateFeed = async () => {
    setIsGenerating(true);
    try {
        const newFeed = await generateViralFeed(config);
        setFeed(newFeed);
        
        // Add new posts to archive (prevent duplicates by ID ideally, but for sim just prepend)
        const newPosts = [newFeed.hero, ...newFeed.trending, ...newFeed.latest];
        setArchive(prev => [...newPosts, ...prev]);
        
        setIsAdminOpen(false); // Close admin to show result
    } catch (e) {
        console.error(e);
        alert("Failed to generate content. Check API Key.");
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="relative">
      {/* THE LIVE BLOG */}
      <BlogFrontend 
        feed={feed} 
        archive={archive} 
        loading={isGenerating} 
        config={config} 
      />

      {/* ADMIN TOGGLE - Floating Button */}
      <button 
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform border-2 border-emerald-500 group"
        title="Open Backend Command Center"
      >
        <Settings className="w-6 h-6 animate-spin-slow group-hover:animate-spin" />
      </button>

      {/* BACKEND PANEL */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)} 
        config={config} 
        setConfig={setConfig}
        onGenerateFeed={handleGenerateFeed}
        isGenerating={isGenerating}
      />
    </div>
  );
}
