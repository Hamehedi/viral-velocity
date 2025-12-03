
import React, { useState, useEffect } from 'react';
import { BlogFrontend } from './components/BlogFrontend';
import { PipelineConfig, GeneratedFeed, BlogPost } from './types';
import { DEFAULT_CONFIG, INITIAL_POSTS } from './constants';
import { generateViralFeed, generateSimulatedArchive } from './services/gemini';

export default function App() {
  const [config] = useState<PipelineConfig>(DEFAULT_CONFIG);
  const [feed, setFeed] = useState<GeneratedFeed>(INITIAL_POSTS);
  const [archive, setArchive] = useState<BlogPost[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize archive AND fetch fresh AI content automatically
  useEffect(() => {
    const init = async () => {
        // 1. Immediate Content Load (Simulation) - Zero Latency for user
        let initialArchive: BlogPost[] = [
            INITIAL_POSTS.hero,
            ...INITIAL_POSTS.trending,
            ...INITIAL_POSTS.latest
        ];
        const simulatedPosts = generateSimulatedArchive();
        const fullArchive = [...initialArchive, ...simulatedPosts];
        setArchive(fullArchive);

        // 2. Auto-Run AI Pipeline (Background)
        // This fully automates the content generation without manual buttons
        if (process.env.API_KEY) {
            setIsGenerating(true);
            try {
                // Pass fullArchive so the AI can analyze traffic trends
                const newFeed = await generateViralFeed(config, fullArchive);
                setFeed(newFeed);
                
                // seamless integration of new AI posts into the archive
                const newPosts = [newFeed.hero, ...newFeed.trending, ...newFeed.latest];
                setArchive(prev => [...newPosts, ...prev]);
            } catch (e) {
                console.warn("AI Generation silent fail (using robust simulation):", e);
            } finally {
                setIsGenerating(false);
            }
        }
    };

    init();
  }, []);

  return (
    <div className="relative">
      <BlogFrontend 
        feed={feed} 
        archive={archive} 
        loading={isGenerating} 
        config={config} 
      />
    </div>
  );
}
