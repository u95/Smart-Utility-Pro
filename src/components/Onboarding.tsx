import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, ShieldCheck, Zap, ChevronRight, Check } from 'lucide-react';
import { AccentColor } from '../types';

interface OnboardingProps {
  accentColor: AccentColor;
  onComplete: () => void;
}

export function Onboarding({ accentColor, onComplete }: OnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "All-in-One Mobile Suite",
      description: "Smart Utility Pro consolidates 13 essential categories of daily tools into a single, light-weight, highly-optimized workspace. Say goodbye to clutter.",
      icon: <Smartphone className="w-16 h-16" />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Secure & Offline First",
      description: "Privacy is our priority. Your password vaults, custom notes, local scanned docs, and network logs are strictly saved inside your device. No cloud collection.",
      icon: <ShieldCheck className="w-16 h-16" />,
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Lightning Fast Utilities",
      description: "Engineered with modern responsive Material 3 design and GPU-accelerated transition animations, designed to run flawlessly on standard and high-end hardware.",
      icon: <Zap className="w-16 h-16" />,
      color: "from-pink-500 to-rose-600"
    }
  ];

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20',
    violet: 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/20',
    amber: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20',
    rose: 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20',
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20',
  }[accentColor];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div id="onboarding-overlay" className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950 p-4 font-sans text-white">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between h-[580px] p-8">
        
        {/* Progress indicator dots */}
        <div className="flex justify-center gap-1.5" id="onboarding-progress-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-white' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Swipeable Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center text-center my-6"
          >
            {/* Ambient glowing circle */}
            <div className={`w-32 h-32 rounded-full bg-gradient-to-tr ${slides[currentSlide].color} flex items-center justify-center shadow-lg mb-8`}>
              <div className="text-white">
                {slides[currentSlide].icon}
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight font-display mb-3">
              {slides[currentSlide].title}
            </h2>
            
            <p className="text-sm text-slate-400 leading-relaxed px-2">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Actions Button */}
        <div className="flex items-center justify-between" id="onboarding-actions">
          <button
            onClick={onComplete}
            className="text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
          >
            Skip
          </button>

          <button
            onClick={handleNext}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 ${activeAccentClass}`}
          >
            {currentSlide === slides.length - 1 ? (
              <>
                <span>Get Started</span>
                <Check size={16} />
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
