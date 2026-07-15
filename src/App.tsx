import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Image, Video, QrCode, Camera, Folder, Calculator, 
  RefreshCw, FileEdit, Shield, Download, Wifi, Smartphone, 
  Settings, Search, Sparkles, Star, Grid, Menu, Bell, HelpCircle, Github
} from 'lucide-react';

import { AccentColor } from './types';
import { AdMobSim, InterstitialAd } from './components/AdMobSim';
import { Onboarding } from './components/Onboarding';

// Tool workspaces
import { PDFTools } from './components/PDFTools';
import { ImageTools } from './components/ImageTools';
import { VideoTools } from './components/VideoTools';
import { QRTools } from './components/QRTools';
import { DocScanner } from './components/DocScanner';
import { FileManagerSim } from './components/FileManagerSim';
import { CalculatorSuite } from './components/CalculatorSuite';
import { UnitConverter } from './components/UnitConverter';
import { NotesSuite } from './components/NotesSuite';
import { PasswordVault } from './components/PasswordVault';
import { DownloadManagerSim } from './components/DownloadManagerSim';
import { WiFiToolsSuite } from './components/WiFiToolsSuite';
import { DeviceInfoSuite } from './components/DeviceInfoSuite';
import { SettingsSuite } from './components/SettingsSuite';

type ScreenID = 
  | 'dashboard' | 'pdf' | 'image' | 'video' | 'qr' | 'scanner' 
  | 'file' | 'calculator' | 'converter' | 'notes' | 'vault' 
  | 'download' | 'wifi' | 'device' | 'settings';

export default function App() {
  // Navigation & global settings state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [activeScreen, setActiveScreen] = useState<ScreenID>('dashboard');
  const [accentColor, setAccentColor] = useState<AccentColor>('indigo');
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [githubUrl, setGithubUrl] = useState<string>(() => {
    return localStorage.getItem('sup_github_url') || 'https://github.com';
  });

  // Search & categories filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Productivity' | 'Media' | 'Security' | 'Hardware'>('All');

  // AdMob interstitial state
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [onAdComplete, setOnAdComplete] = useState<() => void>(() => {});

  useEffect(() => {
    // Check onboarding cache
    const onboarded = localStorage.getItem('sup_onboarded');
    if (onboarded === 'true') {
      setShowOnboarding(false);
    }
  }, []);

  const triggerAd = (onComplete: () => void) => {
    if (isPremium) {
      // Skip advertisement for premium users
      onComplete();
      return;
    }
    setOnAdComplete(() => onComplete);
    setShowInterstitial(true);
  };

  const handleFinishAd = () => {
    setShowInterstitial(false);
    onAdComplete();
  };

  const finishOnboarding = () => {
    localStorage.setItem('sup_onboarded', 'true');
    setShowOnboarding(false);
  };

  const accentHex = {
    indigo: '#6366f1',
    emerald: '#10b981',
    violet: '#8b5cf6',
    amber: '#f59e0b',
    rose: '#f43f5e',
    blue: '#3b82f6',
  }[accentColor];

  const textAccentClass = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    violet: 'text-violet-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    blue: 'text-blue-400',
  }[accentColor];

  const bgAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    violet: 'bg-violet-600 hover:bg-violet-700',
    amber: 'bg-amber-600 hover:bg-amber-700',
    rose: 'bg-rose-600 hover:bg-rose-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
  }[accentColor];

  const borderAccentClass = {
    indigo: 'border-indigo-500/20 focus:border-indigo-500',
    emerald: 'border-emerald-500/20 focus:border-emerald-500',
    violet: 'border-violet-500/20 focus:border-violet-500',
    amber: 'border-amber-500/20 focus:border-amber-500',
    rose: 'border-rose-500/20 focus:border-rose-500',
    blue: 'border-blue-500/20 focus:border-blue-500',
  }[accentColor];

  // Definition of the 13 modular categories
  const toolsList = [
    { id: 'pdf', title: 'PDF Processor', desc: 'Merge, split, lock & reduce PDF files', category: 'Productivity', icon: <FileText size={18} />, premium: false },
    { id: 'image', title: 'Image Editor', desc: 'Crop, compress, scale & remove BG', category: 'Media', icon: <Image size={18} />, premium: false },
    { id: 'video', title: 'Video Cutter', desc: 'Trimming, format audio & convert', category: 'Media', icon: <Video size={18} />, premium: true },
    { id: 'qr', title: 'QR Workshop', desc: 'Generate high density custom QR codes', category: 'Productivity', icon: <QrCode size={18} />, premium: false },
    { id: 'scanner', title: 'Document Scanner', desc: 'OCR camera scanner & text extractor', category: 'Productivity', icon: <Camera size={18} />, premium: true },
    { id: 'file', title: 'File Cleaner', desc: 'Wipe system caches & storage analyst', category: 'Hardware', icon: <Folder size={18} />, premium: false },
    { id: 'calculator', title: 'Calc Studio', desc: 'Scientific, loan EMI, GST & age tracking', category: 'Productivity', icon: <Calculator size={18} />, premium: false },
    { id: 'converter', title: 'Unit Converter', desc: 'Convert storage size, speed & weight', category: 'Productivity', icon: <RefreshCw size={18} />, premium: false },
    { id: 'notes', title: 'Secure Notes', desc: 'Interactive checklist folder notebook', category: 'Productivity', icon: <FileEdit size={18} />, premium: false },
    { id: 'vault', title: 'Password Shield', desc: 'AES locked vault & biometric scanner', category: 'Security', icon: <Shield size={18} />, premium: true },
    { id: 'download', title: 'Download Manager', desc: 'Concurrent multi-threaded pipeline', category: 'Productivity', icon: <Download size={18} />, premium: false },
    { id: 'wifi', title: 'WiFi Analyzer', desc: 'Ping jitter, MAC details & speed test', category: 'Hardware', icon: <Wifi size={18} />, premium: false },
    { id: 'device', title: 'Device Info', desc: 'Octa-core telemetry & accelerometer', category: 'Hardware', icon: <Smartphone size={18} />, premium: false }
  ];

  // Filters the dashboard grid list
  const filteredTools = toolsList.filter((tool) => {
    const matchesCategory = activeFilter === 'All' || tool.category === activeFilter;
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleNavigateToTool = (toolId: ScreenID) => {
    const found = toolsList.find(t => t.id === toolId);
    if (found && found.premium && !isPremium) {
      alert("Pro Feature Locked! Please activate premium version simulator under settings to unlock.");
      return;
    }

    triggerAd(() => {
      setActiveScreen(toolId);
    });
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-slate-950 p-0 sm:p-4 text-white selection:bg-indigo-500/20" id="smart-utility-app">
      
      {/* Phone Screen Container Frame */}
      <div className="w-full max-w-md h-screen sm:h-[840px] bg-slate-900 sm:rounded-[36px] border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col" id="applet-viewport">
        
        <AnimatePresence mode="wait">
          
          {/* 1. ONBOARDING OVERLAY */}
          {showOnboarding ? (
            <motion.div key="onboarding" className="w-full h-full">
              <Onboarding accentColor={accentColor} onComplete={finishOnboarding} />
            </motion.div>
          ) : (
            
            // 2. MAIN NAV WORKSPACE STAGES
            <div className="flex-1 flex flex-col h-full overflow-hidden" id="navigation-root">
              
              <AnimatePresence mode="wait">
                
                {/* SCREEN: DASHBOARD */}
                {activeScreen === 'dashboard' && (
                  <motion.div 
                    key="dashboard-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col h-full overflow-hidden"
                  >
                    {/* Header top status layout */}
                    <div className="px-5 pt-5 pb-3 flex justify-between items-center bg-slate-900/50 backdrop-blur z-10" id="dash-header">
                      <div>
                        <span className="text-[10px] text-slate-500 font-mono tracking-widest font-black uppercase block">GOOGLE PLAY EDITION</span>
                        <h1 className="text-xl font-bold font-display tracking-tight flex items-center gap-1.5 mt-0.5">
                          <span>Smart Utility</span>
                          <span className={`${textAccentClass} font-black`}>Pro</span>
                        </h1>
                      </div>

                      {/* Upgrade badge or indicators */}
                      <div className="flex items-center gap-2">
                        <a 
                          href={githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-750 rounded-2xl flex items-center justify-center transition-colors cursor-pointer"
                          title="View on GitHub"
                        >
                          <Github size={16} className="text-slate-400 hover:text-white transition-colors" />
                        </a>

                        <button 
                          onClick={() => handleNavigateToTool('settings')}
                          className={`p-2 bg-slate-800 hover:bg-slate-750 border border-slate-750 rounded-2xl flex items-center justify-center transition-colors cursor-pointer relative ${isPremium ? 'border-amber-500/30' : ''}`}
                        >
                          {isPremium ? (
                            <Star size={16} className="text-amber-400 fill-amber-400" />
                          ) : (
                            <Settings size={16} className="text-slate-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Dashboard body scroll section */}
                    <div className="flex-1 overflow-y-auto px-5 pb-20 space-y-4">
                      
                      {/* Search Bar filter */}
                      <div className="relative flex items-center mt-1" id="search-bar-wrapper">
                        <Search className="absolute left-4 text-slate-500" size={16} />
                        <input
                          type="text"
                          placeholder="Search utility tools & metrics..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 rounded-2xl pl-11 pr-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Categories Quick Filter Tags */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1" id="category-scroller">
                        {['All', 'Productivity', 'Media', 'Security', 'Hardware'].map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                              activeFilter === filter 
                                ? 'bg-slate-800 text-white border border-slate-700' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>

                      {/* GitHub Integration Prominent Card */}
                      <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-850 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-inner" id="dashboard-github-banner">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-white`}>
                            <Github size={18} className={textAccentClass} />
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-bold block">SOURCE CODE REPOSITORY</span>
                            <span className="text-xs font-bold text-slate-200">GitHub Repository Link</span>
                            <span className="text-[10px] text-slate-400 font-mono block max-w-[170px] truncate mt-0.5">{githubUrl}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a 
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-slate-100 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <span>Open</span>
                          </a>
                          <button 
                            onClick={() => handleNavigateToTool('settings')}
                            className="px-2 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      {/* Tools Bento / List Grid layout */}
                      <div className="grid grid-cols-1 gap-2.5 pt-1" id="dash-grid-bento">
                        {filteredTools.map((tool) => (
                          <div
                            key={tool.id}
                            onClick={() => handleNavigateToTool(tool.id as ScreenID)}
                            className="p-3.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-850 rounded-2xl cursor-pointer hover:border-slate-800 transition-all flex items-center justify-between gap-4 group shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center transition-colors group-hover:text-white ${textAccentClass}`}>
                                {tool.icon}
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-bold text-xs text-slate-200 font-display group-hover:text-white">{tool.title}</h3>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed truncate max-w-[200px]">{tool.desc}</p>
                              </div>
                            </div>

                            {tool.premium && !isPremium ? (
                              <span className="text-[8px] font-bold font-mono tracking-wider bg-amber-500/15 border border-amber-500/25 text-amber-400 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                                Pro Limit
                              </span>
                            ) : (
                              <span className="text-[8px] uppercase tracking-widest text-slate-600 font-mono group-hover:text-slate-400 flex-shrink-0">
                                Launch
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Bottom Floating Navigation Tabs Bar */}
                    <div className="absolute bottom-0 left-0 right-0 py-2.5 px-6 border-t border-slate-850 bg-slate-900/90 backdrop-blur flex justify-around items-center" id="dash-footer">
                      <button 
                        onClick={() => setActiveFilter('All')} 
                        className={`flex flex-col items-center gap-1 cursor-pointer ${activeFilter === 'All' ? textAccentClass : 'text-slate-500'}`}
                      >
                        <Grid size={18} />
                        <span className="text-[8px] uppercase font-bold font-mono tracking-widest">Dashboard</span>
                      </button>

                      <button 
                        onClick={() => handleNavigateToTool('settings')} 
                        className="flex flex-col items-center gap-1 cursor-pointer text-slate-500 hover:text-slate-300"
                      >
                        <Settings size={18} />
                        <span className="text-[8px] uppercase font-bold font-mono tracking-widest">Settings</span>
                      </button>
                    </div>

                  </motion.div>
                )}

                {/* WORKSPACES SELECTOR FOR EACH TOOL CHAIRS */}
                {activeScreen === 'pdf' && (
                  <motion.div key="pdf" className="h-full w-full">
                    <PDFTools accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} triggerAd={triggerAd} />
                  </motion.div>
                )}

                {/* IMAGE EDITOR */}
                {activeScreen === 'image' && (
                  <motion.div key="image" className="h-full w-full">
                    <ImageTools accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} triggerAd={triggerAd} />
                  </motion.div>
                )}

                {/* VIDEO TRIMMER */}
                {activeScreen === 'video' && (
                  <motion.div key="video" className="h-full w-full">
                    <VideoTools accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} triggerAd={triggerAd} />
                  </motion.div>
                )}

                {/* QR GENERATOR */}
                {activeScreen === 'qr' && (
                  <motion.div key="qr" className="h-full w-full">
                    <QRTools accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} triggerAd={triggerAd} />
                  </motion.div>
                )}

                {/* CAMERA SCANNERS */}
                {activeScreen === 'scanner' && (
                  <motion.div key="scanner" className="h-full w-full">
                    <DocScanner accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} triggerAd={triggerAd} />
                  </motion.div>
                )}

                {/* FILE MANAGER */}
                {activeScreen === 'file' && (
                  <motion.div key="file" className="h-full w-full">
                    <FileManagerSim accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} triggerAd={triggerAd} />
                  </motion.div>
                )}

                {/* CALCULATORS */}
                {activeScreen === 'calculator' && (
                  <motion.div key="calculator" className="h-full w-full">
                    <CalculatorSuite accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} triggerAd={triggerAd} />
                  </motion.div>
                )}

                {/* CONVERTERS */}
                {activeScreen === 'converter' && (
                  <motion.div key="converter" className="h-full w-full">
                    <UnitConverter accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} />
                  </motion.div>
                )}

                {/* NOTES SUITE */}
                {activeScreen === 'notes' && (
                  <motion.div key="notes" className="h-full w-full">
                    <NotesSuite accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} />
                  </motion.div>
                )}

                {/* PASSWORDS */}
                {activeScreen === 'vault' && (
                  <motion.div key="vault" className="h-full w-full">
                    <PasswordVault accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} />
                  </motion.div>
                )}

                {/* DOWNLOADS */}
                {activeScreen === 'download' && (
                  <motion.div key="download" className="h-full w-full">
                    <DownloadManagerSim accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} triggerAd={triggerAd} />
                  </motion.div>
                )}

                {/* WIFI TOOLS */}
                {activeScreen === 'wifi' && (
                  <motion.div key="wifi" className="h-full w-full">
                    <WiFiToolsSuite accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} />
                  </motion.div>
                )}

                {/* TELEMETRY */}
                {activeScreen === 'device' && (
                  <motion.div key="device" className="h-full w-full">
                    <DeviceInfoSuite accentColor={accentColor} onBack={() => setActiveScreen('dashboard')} />
                  </motion.div>
                )}

                {/* SETTINGS */}
                {activeScreen === 'settings' && (
                  <motion.div key="settings" className="h-full w-full">
                    <SettingsSuite 
                      accentColor={accentColor} 
                      setAccentColor={setAccentColor}
                      isPremium={isPremium}
                      setIsPremium={setIsPremium}
                      githubUrl={githubUrl}
                      setGithubUrl={setGithubUrl}
                      onBack={() => setActiveScreen('dashboard')} 
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          )}

        </AnimatePresence>

        {/* GOOGLE ADMOB INTEGRATION */}
        {!isPremium && activeScreen === 'dashboard' && !showOnboarding && (
          <AdMobSim key="admob-banner" />
        )}

        {/* GOOGLE INTERSTITIAL AD OVERLAY */}
        <InterstitialAd isOpen={showInterstitial} onClose={handleFinishAd} />

      </div>

    </div>
  );
}
