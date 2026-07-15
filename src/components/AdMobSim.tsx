import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, ShieldAlert, Award, Star } from 'lucide-react';

// Bottom inline banner simulation
export function AdMobSim() {
  return (
    <div 
      className="h-[50px] bg-slate-950 border-t border-slate-850 flex items-center justify-between px-4 text-slate-500 font-mono text-[9px]"
      id="admob-banner-banner"
    >
      <div className="flex items-center gap-1.5">
        <span className="bg-amber-500/10 text-amber-500 border border-amber-500/30 px-1 rounded-sm text-[8px] font-bold">AD</span>
        <span className="truncate max-w-[180px]">Upgrade to Smart Premium Version for ad-free workspace</span>
      </div>
      <button 
        onClick={() => window.open('https://ai.studio/build', '_blank')}
        className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/35 text-indigo-400 font-bold hover:bg-indigo-500/20 rounded-sm text-[8px] cursor-pointer"
      >
        GO PRO
      </button>
    </div>
  );
}

interface InterstitialAdProps {
  isOpen: boolean;
  onClose: () => void;
}

// Full screen overlay simulation
export function InterstitialAd({ isOpen, onClose }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    setCountdown(5);
    setCanClose(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        id="admob-fullscreen-container"
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white p-6 font-sans"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between" id="admob-header">
          <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-full text-xs text-neutral-300 font-mono">
            <ShieldAlert size={14} className="text-amber-500" />
            <span>AdMob Simulation</span>
          </div>
          <button
            onClick={onClose}
            disabled={!canClose}
            id="admob-close-btn"
            className={`p-2 rounded-full transition-colors ${
              canClose
                ? 'bg-neutral-800 text-white hover:bg-neutral-700 cursor-pointer'
                : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
            }`}
          >
            {canClose ? <X size={20} /> : <span className="text-sm font-medium px-1">{countdown}s</span>}
          </button>
        </div>

        {/* Ad Video Content Simulator */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-6" id="admob-body">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 animate-pulse">
            <Star size={40} className="text-white fill-amber-300" />
          </div>
          
          <h3 className="text-2xl font-bold tracking-tight font-display mb-2">
            Smart Utility Pro Premium
          </h3>
          <p className="text-sm text-neutral-400 max-w-xs mb-8">
            Get unlimited cloud backup, ad-free experience, and 100+ advanced calculation features instantly!
          </p>

          <div className="relative w-full max-w-sm aspect-video rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between p-4 shadow-inner">
            <div className="flex items-start justify-between">
              <span className="text-[10px] uppercase font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded tracking-wider">Sponsored</span>
              <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                Support dev
              </span>
            </div>

            {/* Simulated interactive video bar */}
            <div className="flex flex-col items-center justify-center py-2 gap-2">
              <div className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500 animate-bounce">
                INTERSTITIAL
              </div>
              <span className="text-xs text-neutral-500">Ad plays silently in preview container</span>
            </div>

            {/* Video progress slider */}
            <div className="w-full">
              <div className="flex justify-between text-[10px] text-neutral-500 mb-1 font-mono">
                <span>0:0{5 - countdown}</span>
                <span>0:05</span>
              </div>
              <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-indigo-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-3 items-center" id="admob-footer">
          <button
            onClick={() => window.open('https://ai.studio/build', '_blank')}
            className="w-full max-w-sm py-3.5 bg-gradient-to-r from-indigo-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 text-center hover:opacity-95 transition-opacity"
          >
            Install App From Play Store
          </button>
          
          <p className="text-[10px] text-neutral-500 text-center">
            {canClose 
              ? '✓ You can close this advertisement now.'
              : `You can skip this ad in ${countdown} seconds.`
            }
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
