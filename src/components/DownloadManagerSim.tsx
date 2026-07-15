import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, ArrowLeft, Play, Pause, X, File, ShieldCheck, 
  ArrowRight, RefreshCw, Layers, History, ServerCrash
} from 'lucide-react';
import { AccentColor, DownloadTask } from '../types';

interface DownloadManagerSimProps {
  accentColor: AccentColor;
  onBack: () => void;
  triggerAd: (onComplete: () => void) => void;
}

export function DownloadManagerSim({ accentColor, onBack, triggerAd }: DownloadManagerSimProps) {
  const [downloadUrl, setDownloadUrl] = useState('https://storage.googleapis.com/smart_utility_pro_patch.zip');
  const [threadCount, setThreadCount] = useState(4);
  const [activeTasks, setActiveTasks] = useState<DownloadTask[]>([]);
  const [downloadHistory, setDownloadHistory] = useState<{ name: string; size: string; time: string }[]>([]);

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/10',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/10',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10',
  }[accentColor];

  const barAccentClass = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
  }[accentColor];

  // Core download state loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTasks((prevTasks) => {
        let updated = prevTasks.map((task) => {
          if (task.status !== 'downloading') return task;

          const currentProgress = task.progress;
          // Random download velocity based on thread counts
          const speedNum = (Math.random() * 4 + 2) * (threadCount / 2);
          const increment = speedNum / 3; // divide for interval tick

          const nextProgress = Math.min(100, Number((currentProgress + increment).toFixed(1)));
          const speedStr = speedNum.toFixed(1) + ' MB/s';

          if (nextProgress >= 100) {
            // Task Completed! Push to history
            setDownloadHistory(h => [{ name: task.name, size: task.size, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }, ...h]);
            return { ...task, progress: 100, speed: '0 MB/s', status: 'completed' as const };
          }

          return {
            ...task,
            progress: nextProgress,
            speed: speedStr
          };
        });

        // Filter out completed tasks so they disappear from active lists after completion
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [threadCount]);

  const handleStartDownload = () => {
    if (!downloadUrl.trim()) return;

    // Isolate file name from web address URL
    const nameStr = downloadUrl.split('/').pop() || 'network_resource.bin';
    const randomSize = (Math.random() * 45 + 10).toFixed(1) + ' MB';

    const newTask: DownloadTask = {
      id: Date.now().toString(),
      name: nameStr,
      url: downloadUrl,
      progress: 0,
      speed: '0.0 MB/s',
      status: 'downloading',
      size: randomSize
    };

    triggerAd(() => {
      setActiveTasks([newTask, ...activeTasks]);
    });
  };

  const handleToggleTask = (id: string) => {
    setActiveTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'downloading' ? 'paused' as const : 'downloading' as const,
          speed: t.status === 'downloading' ? '0.0 MB/s' : t.speed
        };
      }
      return t;
    }));
  };

  const handleRemoveTask = (id: string) => {
    setActiveTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="download-mgr-root">
      
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="dl-header">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">Download Core</h1>
          <p className="text-xs text-slate-400">Concurrent multi-threaded pipeline</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Form address input */}
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-3xl space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block font-mono">Download Parameters</span>
          
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-mono">Resource Destination Link URL</label>
            <input 
              type="text" 
              value={downloadUrl} 
              onChange={(e) => setDownloadUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs font-mono text-indigo-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-500 font-mono">Multithreading Threads</label>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setThreadCount(prev => Math.max(1, prev - 1))}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-750 rounded-lg text-xs"
                >
                  -
                </button>
                <span className="text-xs font-mono font-bold text-slate-300">{threadCount}</span>
                <button 
                  onClick={() => setThreadCount(prev => Math.min(16, prev + 1))}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-750 rounded-lg text-xs"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <button
                onClick={handleStartDownload}
                className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md ${activeAccentClass}`}
              >
                <Download size={12} />
                <span>Trigger DL</span>
              </button>
            </div>
          </div>
        </div>

        {/* ACTIVE DOWNLOADS LIST */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Active Pipelines</span>
          
          {activeTasks.length === 0 ? (
            <div className="text-center py-8 bg-slate-950 border border-slate-850 rounded-2xl p-6 text-slate-500">
              <Download size={28} className="mx-auto mb-2 opacity-50" />
              <span className="text-xs">No active downloading sockets</span>
            </div>
          ) : (
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="bg-slate-950 border border-slate-850 rounded-2xl p-3.5 space-y-2 relative overflow-hidden shadow-inner"
                >
                  {/* Title and details */}
                  <div className="flex justify-between items-start min-w-0">
                    <div className="min-w-0">
                      <span className="text-xs font-bold font-display truncate block max-w-[200px] text-slate-200">{task.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{task.size} • thread: x{threadCount}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {task.status !== 'completed' && (
                        <button 
                          onClick={() => handleToggleTask(task.id)}
                          className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white rounded-lg"
                        >
                          {task.status === 'downloading' ? <Pause size={12} /> : <Play size={12} />}
                        </button>
                      )}
                      <button 
                        onClick={() => handleRemoveTask(task.id)}
                        className="p-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-rose-400 rounded-lg"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Wave Indicator */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>{task.progress}%</span>
                      <span className="text-emerald-400 font-bold">{task.speed}</span>
                    </div>
                    <div className="h-2 bg-slate-900 rounded-full overflow-hidden relative border border-slate-850">
                      <motion.div
                        className={`h-full ${barAccentClass} rounded-full`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${task.progress}%` }}
                        transition={{ ease: 'linear' }}
                      />
                    </div>
                  </div>
                  
                  {task.status === 'completed' && (
                    <div className="flex items-center gap-1.5 p-1 px-2.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-lg text-[10px] font-bold justify-center font-mono uppercase">
                      <ShieldCheck size={12} />
                      <span>Integrity Verified ✓ Completed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COMPLETED HISTORY LOG */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">History Archives</span>
            <History size={14} className="text-slate-500" />
          </div>

          {downloadHistory.length === 0 ? (
            <div className="text-center py-10 bg-slate-800/10 border border-slate-800/50 rounded-2xl p-6 text-slate-500">
              <span className="text-xs font-semibold">Archives are empty</span>
            </div>
          ) : (
            <div className="space-y-2">
              {downloadHistory.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-2.5 bg-slate-950 border border-slate-850 rounded-xl font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-2 min-w-0">
                    <File size={14} className="text-slate-500 flex-shrink-0" />
                    <span className="truncate pr-2">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-500">{item.size}</span>
                    <span className="text-[9px] text-emerald-500 font-bold uppercase">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
