import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, ArrowLeft, Palette, Shield, CreditCard, Bell, 
  Trash2, HelpCircle, Heart, Star, Sparkles, Check, Github, Cloud
} from 'lucide-react';
import { AccentColor, AppSettings } from '../types';

interface SettingsSuiteProps {
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  isPremium: boolean;
  setIsPremium: (prem: boolean) => void;
  githubUrl: string;
  setGithubUrl: (url: string) => void;
  onNavigateToBuildDeploy?: () => void;
  onBack: () => void;
}

export function SettingsSuite({ 
  accentColor, 
  setAccentColor, 
  isPremium, 
  setIsPremium, 
  githubUrl, 
  setGithubUrl, 
  onNavigateToBuildDeploy,
  onBack 
}: SettingsSuiteProps) {
  const [securityPin, setSecurityPin] = useState('2026');
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [diagnosticMode, setDiagnosticMode] = useState(false);

  useEffect(() => {
    const savedPin = localStorage.getItem('sup_vault_pin');
    if (savedPin) {
      setSecurityPin(savedPin);
    }
  }, []);

  const handleUpdatePin = () => {
    const code = prompt("Configure new 4-digit Vault Access PIN code:", securityPin);
    if (code) {
      if (/^\d{4}$/.test(code)) {
        setSecurityPin(code);
        localStorage.setItem('sup_vault_pin', code);
        alert("Numeric access PIN successfully configured!");
      } else {
        alert("Error! PIN must be exactly 4 digits.");
      }
    }
  };

  const handleWipeDatabase = () => {
    if (confirm("Reset application databases? This will purge all saved secure notes, vault credentials, and download logs.")) {
      localStorage.removeItem('sup_notes_data');
      localStorage.removeItem('sup_vault_data');
      localStorage.removeItem('sup_vault_pin');
      alert("App databases successfully cleared. Rebooting containers...");
      window.location.reload();
    }
  };

  const activeAccentClass = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    violet: 'bg-violet-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    blue: 'bg-blue-600',
  }[accentColor];

  const textAccentClass = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    violet: 'text-violet-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    blue: 'text-blue-400',
  }[accentColor];

  const borderAccentClass = {
    indigo: 'border-indigo-500',
    emerald: 'border-emerald-500',
    violet: 'border-violet-500',
    amber: 'border-amber-500',
    rose: 'border-rose-500',
    blue: 'border-blue-500',
  }[accentColor];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="settings-root">
      
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="settings-header">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">Settings Studio</h1>
          <p className="text-xs text-slate-400">Personalize themes, lock screen & vaults</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* PREMIUM SIMULATION MONETIZATION BILLING */}
        <div className="bg-gradient-to-tr from-indigo-950 via-slate-950 to-slate-950 border border-slate-800/80 p-5 rounded-3xl relative overflow-hidden space-y-3.5">
          {/* Glowing particle visual ornaments */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-2">
            <Sparkles className="text-amber-400" size={18} />
            <span className="text-xs font-black uppercase tracking-widest text-slate-200">Utility Premium Status</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Unlock ad-free multi-threaded tools, ultra-secure vault storage buffers, 1080p full doc scans, and rapid Wi-Fi gauges instantly.
          </p>

          <div className="flex justify-between items-center bg-slate-900/60 p-3.5 rounded-2xl border border-slate-850">
            <div>
              <span className="text-xs font-bold text-slate-300 block">Smart Pro Membership</span>
              <span className="text-[10px] text-slate-500 font-mono">Simulate Google Play Billing</span>
            </div>

            <button
              onClick={() => {
                setIsPremium(!isPremium);
                alert(isPremium ? 'Premium account status deactivated.' : 'Smart Utility Pro: PREMIUM MEMBERSHIP ACTIVATED!');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-sans shadow-md cursor-pointer transition-all ${
                isPremium 
                  ? 'bg-emerald-600 text-white shadow-emerald-600/10' 
                  : 'bg-indigo-600 text-white shadow-indigo-600/10'
              }`}
            >
              {isPremium ? 'Active (Pro)' : 'Upgrade Pro'}
            </button>
          </div>
        </div>

        {/* ACCENT PALETTE THEMING SELECTION */}
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-3xl space-y-3">
          <div className="flex items-center gap-1.5 text-slate-300 border-b border-slate-800 pb-2 mb-1">
            <Palette size={14} className={textAccentClass} />
            <span className="text-xs font-semibold uppercase tracking-wider">Accent Theme Palette</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            {[
              { id: 'indigo', label: 'Indigo Iris', color: 'bg-indigo-500' },
              { id: 'emerald', label: 'Emerald Jade', color: 'bg-emerald-500' },
              { id: 'violet', label: 'Violet Nebula', color: 'bg-violet-500' },
              { id: 'amber', label: 'Amber Flame', color: 'bg-amber-500' },
              { id: 'rose', label: 'Crimson Rose', color: 'bg-rose-500' },
              { id: 'blue', label: 'Ocean Blue', color: 'bg-blue-500' },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => setAccentColor(theme.id as AccentColor)}
                className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  accentColor === theme.id 
                    ? 'bg-slate-950 border-slate-700 font-bold scale-102' 
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full ${theme.color} flex items-center justify-center shadow-inner`}>
                  {accentColor === theme.id && <Check size={11} className="text-white font-bold" />}
                </div>
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* VAULT SECURITY CREDENTIALS */}
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-3xl space-y-3.5">
          <div className="flex items-center gap-1.5 text-slate-300 border-b border-slate-800 pb-2 mb-1">
            <Shield size={14} className={textAccentClass} />
            <span className="text-xs font-semibold uppercase tracking-wider">Vault Locks & Encryption</span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-2xl border border-slate-850">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-300 block">4-Digit Security PIN</span>
              <span className="text-[10px] text-slate-500 font-mono">Current PIN code: {securityPin}</span>
            </div>
            <button
              onClick={handleUpdatePin}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs rounded-xl font-bold cursor-pointer"
            >
              Modify Code
            </button>
          </div>
        </div>

        {/* SYSTEM NOTIFICATION TOGGLES */}
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-3xl space-y-3.5">
          <div className="flex items-center gap-1.5 text-slate-300 border-b border-slate-800 pb-2 mb-1">
            <Bell size={14} className={textAccentClass} />
            <span className="text-xs font-semibold uppercase tracking-wider">Alerts & Notifications</span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-2xl border border-slate-850">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-300 block">Diagnostic alerts</span>
              <span className="text-[10px] text-slate-500 font-mono">Speed, PDF compression flags</span>
            </div>

            <button
              onClick={() => setAllowNotifications(!allowNotifications)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border ${
                allowNotifications 
                  ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              {allowNotifications ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* OPEN SOURCE / GITHUB */}
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-3xl space-y-3.5" id="github-section">
          <div className="flex items-center gap-1.5 text-slate-300 border-b border-slate-800 pb-2 mb-1">
            <Github size={14} className={textAccentClass} />
            <span className="text-xs font-semibold uppercase tracking-wider">GitHub Repository</span>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 font-mono uppercase block">Customize Repository Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => {
                  setGithubUrl(e.target.value);
                  localStorage.setItem('sup_github_url', e.target.value);
                }}
                placeholder="https://github.com/username/repository"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
              />
              <button
                onClick={() => {
                  const defaultUrl = 'https://github.com';
                  setGithubUrl(defaultUrl);
                  localStorage.setItem('sup_github_url', defaultUrl);
                }}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white text-[10px] rounded-xl font-bold transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-2xl border border-slate-850">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-300 block">Open Source Code</span>
              <span className="text-[10px] text-slate-500 font-mono">Launch link in a new tab</span>
            </div>
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Github size={12} />
              <span>GitHub Link</span>
            </a>
          </div>
        </div>

        {/* CLOUD BUILD & DEPLOYMENT ACTIONS */}
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-3xl space-y-3.5" id="settings-build-deploy-section">
          <div className="flex items-center gap-1.5 text-slate-300 border-b border-slate-800 pb-2 mb-1">
            <Cloud size={14} className={textAccentClass} />
            <span className="text-xs font-semibold uppercase tracking-wider">Cloud Build & Deploy</span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-2xl border border-slate-850">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-300 block">Build & Release Center</span>
              <span className="text-[10px] text-slate-500 font-mono">Trigger containerized deployments</span>
            </div>
            <button
              onClick={onNavigateToBuildDeploy}
              className={`px-3.5 py-1.5 ${activeAccentClass} text-white hover:opacity-90 text-xs rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer`}
            >
              <Cloud size={12} />
              <span>Open Console</span>
            </button>
          </div>
        </div>

        {/* STORAGE WIPE RESET DATABASE */}
        <div className="bg-rose-500/5 border border-rose-950/30 p-4 rounded-3xl space-y-3.5">
          <div className="flex items-center gap-1.5 text-rose-400 border-b border-rose-950/20 pb-2 mb-1">
            <Trash2 size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Destructive Actions</span>
          </div>

          <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-2xl border border-rose-950/10">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-300 block">Purge Local Storage</span>
              <span className="text-[10px] text-slate-500 font-mono">Deletes notes, vault codes</span>
            </div>
            <button
              onClick={handleWipeDatabase}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-xl font-bold cursor-pointer shadow-md shadow-rose-600/10"
            >
              Reset Database
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
