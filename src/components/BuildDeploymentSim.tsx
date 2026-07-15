import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Cloud, Terminal, Play, CheckCircle2, XCircle, 
  Loader2, Activity, Globe, GitBranch, RefreshCw, Server,
  Shield, Settings, Database, Plus, Trash2, ExternalLink
} from 'lucide-react';

interface BuildDeploymentSimProps {
  accentColor: string;
  onBack: () => void;
  triggerAd: (onComplete: () => void) => void;
}

interface BuildHistoryItem {
  id: string;
  env: string;
  version: string;
  status: 'success' | 'failed' | 'building';
  time: string;
  duration: string;
  commit: string;
}

interface EnvVar {
  key: string;
  value: string;
  isSecret: boolean;
}

export function BuildDeploymentSim({ accentColor, onBack, triggerAd }: BuildDeploymentSimProps) {
  const [activeEnv, setActiveEnv] = useState<'production' | 'staging' | 'preview'>('production');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Initial build history state
  const [history, setHistory] = useState<BuildHistoryItem[]>(() => {
    const cached = localStorage.getItem('sup_build_history');
    if (cached) return JSON.parse(cached);
    return [
      { id: 'b-3', env: 'production', version: 'v1.4.2', status: 'success', time: '2026-07-14 18:24', duration: '42s', commit: '8f2a1b9' },
      { id: 'b-2', env: 'staging', version: 'v1.4.3-rc1', status: 'success', time: '2026-07-14 19:10', duration: '38s', commit: 'a4f9e12' },
      { id: 'b-1', env: 'production', version: 'v1.4.1', status: 'failed', time: '2026-07-13 11:05', duration: '14s', commit: '2c8b74e' }
    ];
  });

  // Configurable Env variables
  const [envVars, setEnvVars] = useState<EnvVar[]>(() => {
    const cached = localStorage.getItem('sup_env_vars');
    if (cached) return JSON.parse(cached);
    return [
      { key: 'NODE_ENV', value: 'production', isSecret: false },
      { key: 'DATABASE_URL', value: 'postgresql://db_user:********@cloud-sql-host/sup_db', isSecret: true },
      { key: 'GEMINI_API_KEY', value: 'AIzaSy**************************', isSecret: true },
      { key: 'PORT', value: '3000', isSecret: false }
    ];
  });

  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newIsSecret, setNewIsSecret] = useState(false);

  // Auto scroll logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Persist states
  useEffect(() => {
    localStorage.setItem('sup_build_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('sup_env_vars', JSON.stringify(envVars));
  }, [envVars]);

  const addEnvVar = () => {
    if (!newKey.trim() || !newValue.trim()) return;
    const keyUpper = newKey.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
    setEnvVars(prev => [...prev, { key: keyUpper, value: newValue, isSecret: newIsSecret }]);
    setNewKey('');
    setNewValue('');
    setNewIsSecret(false);
  };

  const removeEnvVar = (keyToRemove: string) => {
    setEnvVars(prev => prev.filter(v => v.key !== keyToRemove));
  };

  // Simulate deployment pipeline sequence
  const startSimulation = () => {
    if (isBuilding) return;

    // Trigger AdMob interstitial for excitement and simulator feeling
    triggerAd(() => {
      executeBuildSequence();
    });
  };

  const executeBuildSequence = () => {
    setIsBuilding(true);
    setBuildProgress(0);
    setLogs([]);

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const commitHash = Math.random().toString(16).substring(2, 9);
    const ver = activeEnv === 'production' ? 'v1.4.3' : activeEnv === 'staging' ? 'v1.4.4-rc1' : 'v1.4.3-preview';

    const buildSteps = [
      { msg: '🚀 Initializing build environment cloud cluster...', delay: 300, progress: 5 },
      { msg: '📁 Fetching repository source code via git pipeline...', delay: 800, progress: 15 },
      { msg: `🌿 Branch: main | Target Commit: [${commitHash}]`, delay: 1200, progress: 20 },
      { msg: '📦 Installing workspace dependencies from package.json...', delay: 1800, progress: 35 },
      { msg: '✓ Found React 19, Motion/React, Tailwind CSS, Lucide Icons', delay: 2300, progress: 42 },
      { msg: '⚡ Running compiler (tsc --noEmit) for type checking...', delay: 3100, progress: 50 },
      { msg: '✓ TypeScript static analysis completed with zero errors.', delay: 3600, progress: 60 },
      { msg: '🎨 Packaging client bundle using Vite compiler...', delay: 4200, progress: 72 },
      { msg: '✓ Assets minified, CSS bundle compiled with Tailwind CSS', delay: 4700, progress: 80 },
      { msg: '🐳 Building optimized Docker container image...', delay: 5300, progress: 88 },
      { msg: '🛰️ Pushing container image to Google Artifact Registry...', delay: 5900, progress: 92 },
      { msg: `📡 Deploying revision to Cloud Run [env: ${activeEnv}]...`, delay: 6600, progress: 97 },
      { msg: '🎉 Container booted successfully. Running health checks...', delay: 7200, progress: 99 },
      { msg: '🚀 SUCCESS! Traffic fully routed. Deployment is LIVE!', delay: 7800, progress: 100 }
    ];

    buildSteps.forEach((step, idx) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${step.msg}`]);
        setBuildProgress(step.progress);

        if (step.progress === 100) {
          setIsBuilding(false);
          // Add to build history
          setHistory(prev => [
            {
              id: `b-${Date.now()}`,
              env: activeEnv,
              version: ver,
              status: 'success',
              time: timestamp,
              duration: '8.2s',
              commit: commitHash
            },
            ...prev
          ]);
        }
      }, step.delay);
    });
  };

  const textAccentClass = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    violet: 'text-violet-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    blue: 'text-blue-400',
  }[accentColor] || 'text-indigo-400';

  const bgAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700',
    emerald: 'bg-emerald-600 hover:bg-emerald-700',
    violet: 'bg-violet-600 hover:bg-violet-700',
    amber: 'bg-amber-600 hover:bg-amber-700',
    rose: 'bg-rose-600 hover:bg-rose-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
  }[accentColor] || 'bg-indigo-600 hover:bg-indigo-700';

  const borderAccentClass = {
    indigo: 'border-indigo-500/30',
    emerald: 'border-emerald-500/30',
    violet: 'border-violet-500/30',
    amber: 'border-amber-500/30',
    rose: 'border-rose-500/30',
    blue: 'border-blue-500/30',
  }[accentColor] || 'border-indigo-500/30';

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-100 font-sans" id="build-deploy-suite">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <Cloud size={16} className={textAccentClass} />
              <h1 className="text-sm font-bold tracking-tight">Cloud Build & Deploy</h1>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">Simulate pipelines & containerized cloud deployment</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            ● AGENT CLOUD LIVE
          </span>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-xl mx-auto w-full pb-8">
        {/* Environment Selection & Trigger Box */}
        <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Target Environment</span>
            <span className="text-[10px] text-slate-500 font-mono">Service: smart-utility-pro</span>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 border border-slate-850 rounded-2xl">
            {(['production', 'staging', 'preview'] as const).map((env) => (
              <button
                key={env}
                onClick={() => !isBuilding && setActiveEnv(env)}
                disabled={isBuilding}
                className={`py-2 text-xs font-bold rounded-xl transition-all capitalize cursor-pointer ${
                  activeEnv === env 
                    ? 'bg-slate-900 text-white shadow border border-slate-800' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {env}
              </button>
            ))}
          </div>

          {/* Trigger Action */}
          <div className="flex flex-col gap-3">
            <button
              onClick={startSimulation}
              disabled={isBuilding}
              className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all relative overflow-hidden cursor-pointer shadow-lg ${
                isBuilding 
                  ? 'bg-slate-900 text-slate-500 border border-slate-800' 
                  : `${bgAccentClass} text-white shadow-indigo-500/10`
              }`}
            >
              {isBuilding ? (
                <>
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                  <span>Building Pipeline ({buildProgress}%)</span>
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" />
                  <span>Deploy to Cloud {activeEnv}</span>
                </>
              )}
            </button>
            
            {/* Real Progress bar */}
            {isBuilding && (
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                  <motion.div 
                    className={`h-full ${bgAccentClass}`}
                    initial={{ width: '0%' }}
                    animate={{ width: `${buildProgress}%` }}
                    transition={{ ease: 'easeInOut' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Terminal Terminal Logs */}
        <div className="bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-900 bg-slate-950/90 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal size={14} className={textAccentClass} />
              <span className="text-xs font-bold font-mono">Build Console Logs</span>
            </div>
            <button 
              onClick={() => setShowLogs(!showLogs)}
              className="text-[10px] text-slate-500 hover:text-white transition-colors font-mono cursor-pointer"
            >
              {showLogs ? 'Collapse' : 'Expand'}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showLogs && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 200 }}
                exit={{ height: 0 }}
                className="overflow-y-auto p-4 font-mono text-[10px] text-slate-300 space-y-1.5 bg-black/80"
              >
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-1 py-8">
                    <Terminal size={20} className="stroke-[1.5]" />
                    <span>No active logs. Click "Deploy to Cloud" to run build.</span>
                  </div>
                ) : (
                  <>
                    {logs.map((log, idx) => (
                      <div key={idx} className="leading-relaxed border-l-2 border-slate-800 pl-2">
                        {log}
                      </div>
                    ))}
                    <div ref={terminalEndRef} />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Configuration Env Variables */}
        <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-3xl space-y-3.5">
          <div className="flex items-center gap-1.5 text-slate-300 border-b border-slate-900 pb-2">
            <Settings size={14} className={textAccentClass} />
            <span className="text-xs font-bold uppercase tracking-wider">Cloud Environment Config</span>
          </div>

          {/* Form to add Env */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <span className="text-[9px] uppercase font-bold text-slate-500 font-mono block mb-1">Add Variable</span>
            </div>
            <input 
              type="text"
              placeholder="VARIABLE_KEY"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 font-mono uppercase"
            />
            <input 
              type="text"
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-200 placeholder-slate-700 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <div className="col-span-2 flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={newIsSecret}
                  onChange={(e) => setNewIsSecret(e.target.checked)}
                  className="rounded border-slate-800 text-indigo-600 focus:ring-0 bg-slate-950" 
                />
                <span>Encrypt secret / hide in logs</span>
              </label>
              <button
                onClick={addEnvVar}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 text-[10px] rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus size={10} />
                <span>Add Variable</span>
              </button>
            </div>
          </div>

          {/* List of Env */}
          <div className="space-y-1.5">
            {envVars.map((v) => (
              <div key={v.key} className="flex items-center justify-between bg-slate-950/40 border border-slate-850 px-3 py-2 rounded-xl text-[10px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-bold">{v.key}</span>
                  {v.isSecret && (
                    <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1 rounded uppercase">Secret</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <span className="truncate max-w-[150px]">{v.value}</span>
                  <button 
                    onClick={() => removeEnvVar(v.key)}
                    className="text-slate-600 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History of Deployments */}
        <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-3xl space-y-3">
          <div className="flex items-center gap-1.5 text-slate-300 border-b border-slate-900 pb-2">
            <Activity size={14} className={textAccentClass} />
            <span className="text-xs font-bold uppercase tracking-wider">Deployment Pipeline History</span>
          </div>

          <div className="space-y-2">
            {history.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-950/60 p-3 rounded-2xl border border-slate-850 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 capitalize">{item.env}</span>
                    <span className="text-[10px] bg-slate-900 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded font-mono">{item.version}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>{item.time}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><GitBranch size={10} />{item.commit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">{item.duration}</span>
                  {item.status === 'success' ? (
                    <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <CheckCircle2 size={10} />
                      <span>Live</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      <XCircle size={10} />
                      <span>Failed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
