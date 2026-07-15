import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, ArrowLeft, RefreshCw, Zap, Sliders, Info, ShieldCheck, 
  WifiOff, ArrowUpRight, ArrowDownRight, Radio, HelpCircle
} from 'lucide-react';
import { AccentColor } from '../types';

interface WiFiToolsSuiteProps {
  accentColor: AccentColor;
  onBack: () => void;
}

export function WiFiToolsSuite({ accentColor, onBack }: WiFiToolsSuiteProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [testPhase, setTestPhase] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  
  // Speed metrics
  const [ping, setPing] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [download, setDownload] = useState(0.0);
  const [upload, setUpload] = useState(0.0);
  
  // Real-time needle gauge percentage
  const [needleValue, setNeedleValue] = useState(0);

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  }[accentColor];

  const borderAccentClass = {
    indigo: 'border-indigo-500',
    emerald: 'border-emerald-500',
    violet: 'border-violet-500',
    amber: 'border-amber-500',
    rose: 'border-rose-500',
    blue: 'border-blue-500',
  }[accentColor];

  const handleStartSpeedTest = () => {
    setIsRunning(true);
    setTestPhase('ping');
    setPing(0);
    setJitter(0);
    setDownload(0);
    setUpload(0);

    // Timeline phases sequence
    // 1. PING latency sweeps
    setTimeout(() => {
      setPing(Math.round(Math.random() * 8 + 12)); // 12-20 ms
      setJitter(Math.round(Math.random() * 3 + 2)); // 2-5 ms
      setTestPhase('download');

      // 2. DOWNLOAD sweeps
      let dInterval = setInterval(() => {
        const tempDl = Math.random() * 120 + 280; // 280 - 400 MB/s
        setDownload(Number(tempDl.toFixed(1)));
        setNeedleValue(Math.round((tempDl / 500) * 100)); // normalized scale
      }, 100);

      setTimeout(() => {
        clearInterval(dInterval);
        setTestPhase('upload');

        // 3. UPLOAD sweeps
        let uInterval = setInterval(() => {
          const tempUl = Math.random() * 40 + 80; // 80 - 120 MB/s
          setUpload(Number(tempUl.toFixed(1)));
          setNeedleValue(Math.round((tempUl / 500) * 100));
        }, 100);

        setTimeout(() => {
          clearInterval(uInterval);
          setTestPhase('complete');
          setIsRunning(false);
          setNeedleValue(0);
        }, 3000);

      }, 3500);

    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="wifi-tools-root">
      
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="wifi-header">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">WiFi Network Tools</h1>
          <p className="text-xs text-slate-400">Diagnostic signals & speed test</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* SPEED TEST AREA */}
        <div className="bg-slate-950 border border-slate-850 rounded-3xl p-5 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Speedometer Node</span>

          {/* Visual Round Dial Needle Speedometer */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            
            {/* SVG dial curve background */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="70" className="stroke-slate-850 fill-none stroke-6" strokeDasharray="330 360" />
              <motion.circle 
                cx="88" 
                cy="88" 
                r="70" 
                className="stroke-indigo-500 fill-none stroke-6" 
                strokeDasharray="330 360" 
                strokeDashoffset={330 - (330 * needleValue / 100)}
                transition={{ ease: 'easeOut', duration: 0.2 }}
              />
            </svg>

            {/* Dial metrics display */}
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black font-display tracking-tight text-slate-100">
                {testPhase === 'download' ? download : testPhase === 'upload' ? upload : testPhase === 'complete' ? download : '0.0'}
              </span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold">Mbps</span>
              <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest font-mono mt-1">
                {testPhase === 'ping' && 'Latency ping...'}
                {testPhase === 'download' && 'DOWNLOADING...'}
                {testPhase === 'upload' && 'UPLOADING...'}
                {testPhase === 'complete' && 'Test Finished'}
                {testPhase === 'idle' && 'READY'}
              </span>
            </div>
          </div>

          {/* Core Latency / Jitter dashboard panel */}
          <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm text-xs font-mono">
            <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-slate-500">
                <ArrowDownRight size={14} className="text-emerald-400" />
                <span>Download</span>
              </div>
              <span className="font-bold text-slate-200">{download > 0 ? download + ' M' : '--'}</span>
            </div>
            <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-slate-500">
                <ArrowUpRight size={14} className="text-indigo-400" />
                <span>Upload</span>
              </div>
              <span className="font-bold text-slate-200">{upload > 0 ? upload + ' M' : '--'}</span>
            </div>
            <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center">
              <span className="text-slate-500">Ping Delay</span>
              <span className="font-bold text-slate-200">{ping > 0 ? ping + ' ms' : '--'}</span>
            </div>
            <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-xl flex justify-between items-center">
              <span className="text-slate-500">Jitter</span>
              <span className="font-bold text-slate-200">{jitter > 0 ? jitter + ' ms' : '--'}</span>
            </div>
          </div>

          <button
            onClick={handleStartSpeedTest}
            disabled={isRunning}
            className={`w-full max-w-xs py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg ${
              isRunning ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : activeAccentClass + ' cursor-pointer'
            }`}
          >
            <RefreshCw size={14} className={isRunning ? 'animate-spin' : ''} />
            <span>{isRunning ? 'Running speed tests...' : 'Trigger Speed Diagnostics'}</span>
          </button>
        </div>

        {/* NETWORK HARDWARE INFORMATION */}
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-3xl space-y-3.5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Info size={14} className="text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider">Wi-Fi Connection Node</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 font-mono uppercase">
              <Radio size={12} />
              <span>Connected</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {[
              { l: 'Network SSID', v: 'Office_Network_5G' },
              { l: 'Local IP Address', v: '192.168.1.144' },
              { l: 'Default Gateway', v: '192.168.1.1' },
              { l: 'Subnet IP Mask', v: '255.255.255.0' },
              { l: 'Public IP WAN', v: '104.244.42.1' },
              { l: 'MAC BSSID Address', v: 'D4:F5:13:B9:5A:21' },
              { l: 'Channel Frequency', v: 'Channel 36 (5.18 GHz)' },
              { l: 'Security encryption', v: 'WPA3 Personal (CCMP)' },
              { l: 'Signal Strength dBm', v: 'Excellent (-62 dBm)' },
              { l: 'DNS Name Servers', v: '8.8.8.8, 1.1.1.1' }
            ].map((row, i) => (
              <div key={i} className="bg-slate-900/50 p-2 border border-slate-850 rounded-xl flex flex-col justify-center">
                <span className="text-[9px] text-slate-500 uppercase font-bold">{row.l}</span>
                <span className="text-slate-300 font-semibold truncate mt-0.5">{row.v}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
