import React, { useState, useEffect } from 'react';
import { generateAutomationScript } from '../services/gemini';
import { PipelineConfig } from '../types';
import { Code, Copy, Check, Terminal, Play } from 'lucide-react';

interface CodeGeneratorProps {
  config: PipelineConfig;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({ config }) => {
  const [script, setScript] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [platform, setPlatform] = useState('Replit');

  useEffect(() => {
    // Generate script on mount or when config changes
    const fetchScript = async () => {
        setLoading(true);
        try {
            const code = await generateAutomationScript(config, platform);
            setScript(code);
        } catch (error) {
            setScript("# Error generating script. Please check your API key.");
        } finally {
            setLoading(false);
        }
    };
    fetchScript();
  }, [config.niche, config.monetization, platform]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-white">Automation Script</h2>
            <p className="text-gray-400">Deploy this worker code to automate your Blogger pipeline.</p>
        </div>
        
        <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
            {['Replit', 'Local Machine'].map((p) => (
                <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                        platform === p ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'
                    }`}
                >
                    {p}
                </button>
            ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-950 rounded-xl border border-gray-800 overflow-hidden flex flex-col min-h-0 relative shadow-2xl">
        <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-mono text-gray-400">bot.py</span>
            </div>
            <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded text-xs text-gray-400 hover:text-white transition-colors"
            >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy Code'}
            </button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar p-4 relative">
            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 bg-gray-950/50 backdrop-blur-sm z-10">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-emerald-400 font-mono text-sm animate-pulse">Writing custom Python script...</p>
                </div>
            ) : null}
            
            <pre className="font-mono text-sm text-gray-300 leading-relaxed">
                <code>{script}</code>
            </pre>
        </div>
      </div>

      <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-lg flex gap-4 items-start">
        <div className="p-2 bg-blue-900/30 rounded-lg text-blue-400 shrink-0 mt-1">
            <Play className="w-4 h-4" />
        </div>
        <div>
            <h4 className="text-blue-100 font-medium text-sm mb-1">How to run this?</h4>
            <ol className="text-sm text-blue-200/70 list-decimal pl-4 space-y-1">
                {platform === 'Replit' ? (
                    <>
                        <li>Create a new Python Repl.</li>
                        <li>Paste the code into <code>main.py</code>.</li>
                        <li>Upload your <code>client_secret.json</code> (from Google Cloud Console).</li>
                        <li>Add your API Keys in the Secrets tab (lock icon).</li>
                        <li>Click "Run" to test, then set up a scheduled interval if you have a paid plan, or use Uptimerobot for free keep-alive.</li>
                    </>
                ) : (
                     <>
                        <li>Install Python 3.9+ on your machine.</li>
                        <li>Run <code>pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib requests markdown</code>.</li>
                        <li>Place <code>client_secret.json</code> in the same folder.</li>
                        <li>Run <code>python bot.py</code>.</li>
                    </>
                )}
            </ol>
        </div>
      </div>
    </div>
  );
};