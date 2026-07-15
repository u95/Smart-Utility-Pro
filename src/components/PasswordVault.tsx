import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, ArrowLeft, ShieldCheck, Key, Eye, EyeOff, Plus, Trash2, 
  RefreshCw, Copy, Check, Fingerprint, ShieldAlert, FolderKey
} from 'lucide-react';
import { AccentColor, PasswordEntry } from '../types';

interface PasswordVaultProps {
  accentColor: AccentColor;
  onBack: () => void;
}

export function PasswordVault({ accentColor, onBack }: PasswordVaultProps) {
  // Vault state
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [vaultPin, setVaultPin] = useState('2026'); // Default vault code
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Biometric state
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);

  // New entry state
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [username, setUsername] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Banking');
  const [showPlainPassword, setShowPlainPassword] = useState<Record<string, boolean>>({});

  // Password Generator States
  const [genLength, setGenLength] = useState(16);
  const [genUpper, setGenUpper] = useState(true);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genSymbols, setGenSymbols] = useState(true);

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/10',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/10',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10',
  }[accentColor];

  const ringAccentClass = {
    indigo: 'focus:border-indigo-500 focus:ring-indigo-500/20',
    emerald: 'focus:border-emerald-500 focus:ring-emerald-500/20',
    violet: 'focus:border-violet-500 focus:ring-violet-500/20',
    amber: 'focus:border-amber-500 focus:ring-amber-500/20',
    rose: 'focus:border-rose-500 focus:ring-rose-500/20',
    blue: 'focus:border-blue-500 focus:ring-blue-500/20',
  }[accentColor];

  useEffect(() => {
    // Load saved accounts on mount
    const saved = localStorage.getItem('sup_vault_data');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    const savedPin = localStorage.getItem('sup_vault_pin');
    if (savedPin) {
      setVaultPin(savedPin);
    }
  }, []);

  const saveEntries = (updated: PasswordEntry[]) => {
    setEntries(updated);
    localStorage.setItem('sup_vault_data', JSON.stringify(updated));
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin === vaultPin) {
        // Authenticated!
        setTimeout(() => {
          setIsLocked(false);
          setPin('');
        }, 300);
      } else if (newPin.length === 4) {
        // Incorrect Pin shake feedback
        setTimeout(() => {
          alert("Incorrect Security PIN code! Hint: Default PIN is '2026'");
          setPin('');
        }, 300);
      }
    }
  };

  const handleBiometricSimulation = () => {
    setIsBiometricScanning(true);
    setTimeout(() => {
      setIsBiometricScanning(false);
      setIsLocked(false);
    }, 2000);
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 14) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score, label: 'Very Weak', color: 'bg-rose-500 w-1/4' };
    if (score === 2) return { score, label: 'Weak', color: 'bg-amber-500 w-2/4' };
    if (score === 3) return { score, label: 'Medium', color: 'bg-yellow-400 w-3/4' };
    if (score >= 4) return { score, label: 'Strong/Ultra Secure', color: 'bg-emerald-500 w-full' };
    return { score: 0, label: 'None', color: 'bg-slate-700' };
  };

  const generateSecurePassword = () => {
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let pool = lower;
    if (genUpper) pool += upper;
    if (genNumbers) pool += numbers;
    if (genSymbols) pool += symbols;

    let res = '';
    for (let i = 0; i < genLength; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      res += pool.charAt(idx);
    }
    setPasswordText(res);
  };

  const handleSaveEntry = () => {
    if (!title || !username || !passwordText) {
      alert("Please fill in Title, Account name, and Password text");
      return;
    }

    const newEntry: PasswordEntry = {
      id: Date.now().toString(),
      title,
      username,
      passwordText,
      url: url || 'https://',
      category,
      createdAt: Date.now()
    };

    const updated = [newEntry, ...entries];
    saveEntries(updated);
    setIsAdding(false);
    
    // Clear inputs
    setTitle('');
    setUsername('');
    setPasswordText('');
    setUrl('');
    setCategory('Banking');
  };

  const deleteEntry = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete credentials? This action is irreversible.")) {
      const updated = entries.filter(item => item.id !== id);
      saveEntries(updated);
    }
  };

  const togglePasswordVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlainPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied!`);
  };

  const strengthInfo = getPasswordStrength(passwordText);
  const filteredEntries = entries.filter(e => activeCategory === 'All' || e.category === activeCategory);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="pass-vault-root">
      
      <AnimatePresence mode="wait">
        {isLocked ? (
          // LOCKED SCREEN PINPAD & TOUCHID EMULATOR
          <motion.div
            key="lock-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950 z-30 p-6 flex flex-col justify-between"
          >
            {/* Header Lock details */}
            <div className="flex flex-col items-center justify-center pt-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/5">
                <Lock size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display tracking-tight">Smart Vault Locked</h2>
                <p className="text-[10px] text-slate-500 font-mono mt-1">AES-256 On-Device Vault Guard</p>
              </div>

              {/* Pin bullet bubbles */}
              <div className="flex gap-4 pt-4" id="pin-dots">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border-2 border-slate-700 transition-all ${
                      idx < pin.length ? 'bg-indigo-400 border-indigo-400 scale-110 shadow-md shadow-indigo-500/20' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Simulated interactive Fingerprint scanning modal */}
            {isBiometricScanning ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/20"
                >
                  <Fingerprint size={48} className="animate-pulse" />
                </motion.div>
                <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-widest animate-pulse">Scanning biometric vectors...</span>
              </div>
            ) : (
              <div className="flex justify-center my-1">
                <button
                  onClick={handleBiometricSimulation}
                  className="p-3.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 transition-colors shadow-inner cursor-pointer"
                  title="Simulate Fingerprint Scan"
                >
                  <Fingerprint size={28} />
                </button>
              </div>
            )}

            {/* Custom Phone Numerical keypad matrix */}
            <div className="w-full max-w-[280px] mx-auto grid grid-cols-3 gap-3.5 pb-6 text-center font-mono" id="num-pad-grid">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num)}
                  className="w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-850 active:bg-slate-800 border border-slate-800/40 text-lg font-bold text-slate-100 flex items-center justify-center mx-auto transition-all cursor-pointer"
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={onBack}
                className="w-14 h-14 text-[10px] font-bold text-slate-500 flex items-center justify-center mx-auto hover:text-slate-300 cursor-pointer"
              >
                BACK
              </button>
              <button
                onClick={() => handleKeyPress('0')}
                className="w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-850 text-lg font-bold text-slate-100 flex items-center justify-center mx-auto cursor-pointer"
              >
                0
              </button>
              <button
                onClick={() => setPin('')}
                className="w-14 h-14 text-[10px] font-bold text-rose-500 flex items-center justify-center mx-auto hover:text-rose-400 cursor-pointer"
              >
                CLEAR
              </button>
            </div>
          </motion.div>
        ) : (
          // UNLOCKED PASSWORD VAULT WORKSPACE
          <motion.div
            key="unlocked-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="vault-unlocked-header">
              <div className="flex items-center gap-3">
                <button onClick={() => { setIsLocked(true); }} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h1 className="text-lg font-bold font-display leading-tight">Smart Vault</h1>
                  <p className="text-xs text-slate-400">{isAdding ? 'Construct credentials' : 'Local AES key storage'}</p>
                </div>
              </div>
              {!isAdding && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className={`p-2 rounded-xl flex items-center justify-center transition-all cursor-pointer ${activeAccentClass}`}
                >
                  <Plus size={18} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence mode="wait">
                
                {/* NEW CREDENTIAL RECORD FORM */}
                {isAdding ? (
                  <motion.div
                    key="add-credential"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-850 border border-slate-800 p-4 rounded-3xl space-y-3.5 shadow-inner">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-mono">Form Inputs</span>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono">Account Title</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Gmail Login"
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono">Category Folder</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl px-2.5 py-2 text-xs text-slate-300"
                          >
                            {['Banking', 'Social', 'Work', 'Streaming', 'Shopping'].map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Login Username / Email</label>
                        <input 
                          type="text" 
                          placeholder="user@example.com"
                          value={username} 
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>

                      <div className="space-y-1.5 relative">
                        <label className="text-[10px] text-slate-500 font-mono">Security Password</label>
                        <input 
                          type="text" 
                          placeholder="Password text"
                          value={passwordText} 
                          onChange={(e) => setPasswordText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 pr-10 text-xs font-mono"
                        />
                        
                        {/* strength bar indicator */}
                        {passwordText && (
                          <div className="space-y-1 mt-1.5">
                            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full ${strengthInfo.color} transition-all duration-300`} />
                            </div>
                            <span className="text-[9px] text-slate-500 font-bold uppercase font-mono tracking-wider block">Strength: {strengthInfo.label}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Domain Web Address URL</label>
                        <input 
                          type="text" 
                          placeholder="https://google.com"
                          value={url} 
                          onChange={(e) => setUrl(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Integrated Password Generator subtool */}
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-3xl space-y-3 font-mono">
                      <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2 mb-2">
                        <Key size={14} className="text-amber-400" />
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Passcode Generator</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-400">
                          <span>Characters:</span>
                          <span className="font-bold text-indigo-400">{genLength}</span>
                        </div>
                        <input 
                          type="range" 
                          min="8" 
                          max="32"
                          value={genLength}
                          onChange={(e) => setGenLength(Number(e.target.value))}
                          className="w-full accent-indigo-500 cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[9px] font-bold text-slate-500 uppercase">
                        <button
                          type="button"
                          onClick={() => setGenUpper(!genUpper)}
                          className={`py-1 rounded border ${genUpper ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800'}`}
                        >
                          A-Z Caps
                        </button>
                        <button
                          type="button"
                          onClick={() => setGenNumbers(!genNumbers)}
                          className={`py-1 rounded border ${genNumbers ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800'}`}
                        >
                          0-9 Num
                        </button>
                        <button
                          type="button"
                          onClick={() => setGenSymbols(!genSymbols)}
                          className={`py-1 rounded border ${genSymbols ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800'}`}
                        >
                          Symbols
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={generateSecurePassword}
                        className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs border border-slate-800 rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={12} />
                        <span>Populate Code</span>
                      </button>
                    </div>

                    {/* Actions button */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsAdding(false)}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEntry}
                        className={`flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer ${activeAccentClass}`}
                      >
                        <ShieldCheck size={14} />
                        <span>Encrypt & Save</span>
                      </button>
                    </div>

                  </motion.div>
                ) : (
                  // VAULT RECORDS LIST
                  <motion.div
                    key="list-credentials"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Category selectors */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1" id="vault-folders-tab">
                      {['All', 'Banking', 'Social', 'Work', 'Streaming', 'Shopping'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                            activeCategory === cat 
                              ? 'bg-slate-800 text-white' 
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Records List */}
                    {filteredEntries.length === 0 ? (
                      <div className="text-center py-16 bg-slate-800/10 border border-slate-800/50 rounded-3xl p-6">
                        <FolderKey size={44} className="text-slate-700 mx-auto mb-2 animate-pulse" />
                        <p className="text-xs text-slate-400 font-medium">No locked accounts here yet</p>
                        <p className="text-[10px] text-slate-500 mt-1">Tap the plus badge at top right to start compiling highly encrypted, double-shielded logins.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {filteredEntries.map((item) => (
                          <div 
                            key={item.id}
                            className="p-3.5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col gap-2 relative group"
                          >
                            <div className="flex justify-between items-start min-w-0">
                              <div className="min-w-0">
                                <span className="text-[9px] uppercase font-bold bg-indigo-500/10 border border-indigo-500/15 text-indigo-300 px-1.5 rounded-full font-mono">
                                  {item.category}
                                </span>
                                <h3 className="font-bold text-sm text-slate-200 mt-1 font-display truncate">{item.title}</h3>
                              </div>

                              <button 
                                onClick={(e) => deleteEntry(item.id, e)}
                                className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors flex-shrink-0"
                                title="Delete record"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            {/* Credentials detail copy grids */}
                            <div className="bg-slate-900 border border-slate-850 rounded-xl p-2.5 text-[11px] font-mono space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">USER:</span>
                                <div className="flex items-center gap-1">
                                  <span className="text-slate-300 font-medium select-all">{item.username}</span>
                                  <button onClick={() => copyToClipboard(item.username, 'Account name')} className="p-1 text-slate-500 hover:text-white rounded">
                                    <Copy size={10} />
                                  </button>
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <span className="text-slate-500">PASS:</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-indigo-400 font-bold select-all tracking-wide">
                                    {showPlainPassword[item.id] ? item.passwordText : '••••••••••••'}
                                  </span>
                                  <button onClick={(e) => togglePasswordVisibility(item.id, e)} className="p-1 text-slate-500 hover:text-white rounded">
                                    {showPlainPassword[item.id] ? <EyeOff size={10} /> : <Eye size={10} />}
                                  </button>
                                  <button onClick={() => copyToClipboard(item.passwordText, 'Password')} className="p-1 text-slate-500 hover:text-white rounded">
                                    <Copy size={10} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Domain URL node */}
                            <span className="text-[9px] text-slate-500 font-mono truncate">{item.url}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
