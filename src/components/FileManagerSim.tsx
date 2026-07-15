import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, ArrowLeft, HardDrive, File, Image as ImageIcon, Video, 
  Music, Trash2, ShieldCheck, Share2, Edit3, Trash, RefreshCw, AlertTriangle
} from 'lucide-react';
import { AccentColor } from '../types';

interface FileManagerSimProps {
  accentColor: AccentColor;
  onBack: () => void;
  triggerAd: (onComplete: () => void) => void;
}

export function FileManagerSim({ accentColor, onBack, triggerAd }: FileManagerSimProps) {
  // Virtual Storage Engine State (clearing files decrements space!)
  const [totalStorage] = useState(128.0); // GB
  const [usedStorage, setUsedStorage] = useState(84.3); // GB

  const [largeFiles, setLargeFiles] = useState([
    { id: 'lf1', name: 'wedding_movie_raw.mp4', size: '2.4 GB', bytes: 2.4, category: 'video', checked: false },
    { id: 'lf2', name: 'backup_system_2026.zip', size: '1.8 GB', bytes: 1.8, category: 'other', checked: false },
    { id: 'lf3', name: 'highres_scanned_catalog.pdf', size: '320 MB', bytes: 0.32, category: 'pdf', checked: false },
    { id: 'lf4', name: 'audiobook_chapter_6.mp3', size: '145 MB', bytes: 0.145, category: 'audio', checked: false },
  ]);

  const [duplicateFiles, setDuplicateFiles] = useState([
    { id: 'df1', name: 'IMG_4829_copy.jpg', size: '4.2 MB', bytes: 0.0042, path: '/DCIM/Camera/', checked: true },
    { id: 'df2', name: 'IMG_4829.jpg', size: '4.2 MB', bytes: 0.0042, path: '/DCIM/Camera/', checked: false },
    { id: 'df3', name: 'tax_form_revised_v2.pdf', size: '1.2 MB', bytes: 0.0012, path: '/Documents/', checked: true },
    { id: 'df4', name: 'tax_form_revised.pdf', size: '1.2 MB', bytes: 0.0012, path: '/Documents/', checked: false },
    { id: 'df5', name: 'voice_memo_102.wav', size: '8.4 MB', bytes: 0.0084, path: '/Audio/', checked: true },
    { id: 'df6', name: 'voice_memo_102(1).wav', size: '8.4 MB', bytes: 0.0084, path: '/Audio/', checked: false },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'large' | 'duplicates'>('overview');
  const [isCleaning, setIsCleaning] = useState(false);

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  }[accentColor];

  const barAccentClass = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
  }[accentColor];

  const handleToggleLarge = (id: string) => {
    setLargeFiles(prev => prev.map(f => f.id === id ? { ...f, checked: !f.checked } : f));
  };

  const handleToggleDuplicate = (id: string) => {
    setDuplicateFiles(prev => prev.map(f => f.id === id ? { ...f, checked: !f.checked } : f));
  };

  const deleteSelectedLarge = () => {
    const toDelete = largeFiles.filter(f => f.checked);
    if (toDelete.length === 0) return;

    setIsCleaning(true);
    triggerAd(() => {
      setTimeout(() => {
        const totalSavedBytes = toDelete.reduce((acc, f) => acc + f.bytes, 0);
        setUsedStorage(prev => Math.max(10, Number((prev - totalSavedBytes).toFixed(2))));
        setLargeFiles(prev => prev.filter(f => !f.checked));
        setIsCleaning(false);
        alert(`Successfully deleted ${toDelete.length} files. Saved ${totalSavedBytes.toFixed(2)} GB!`);
      }, 1500);
    });
  };

  const deleteSelectedDuplicates = () => {
    const toDelete = duplicateFiles.filter(f => f.checked);
    if (toDelete.length === 0) return;

    setIsCleaning(true);
    triggerAd(() => {
      setTimeout(() => {
        const totalSavedBytes = toDelete.reduce((acc, f) => acc + f.bytes, 0);
        setUsedStorage(prev => Math.max(10, Number((prev - totalSavedBytes).toFixed(4))));
        setDuplicateFiles(prev => prev.filter(f => !f.checked));
        setIsCleaning(false);
        alert(`Cleared duplicates! Free'd ${(totalSavedBytes * 1024).toFixed(1)} MB of storage.`);
      }, 1500);
    });
  };

  const storagePercentage = Math.round((usedStorage / totalStorage) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="file-manager-root">
      
      {/* Header Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="file-header">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">File & Storage</h1>
          <p className="text-xs text-slate-400">Optimize Space & Duplicates</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 bg-slate-950 border-b border-slate-850 p-1 text-center" id="file-tabs">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'large', label: 'Large Files' },
          { id: 'duplicates', label: 'Duplicates' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          
          {/* OVERVIEW WORKSPACE */}
          {activeTab === 'overview' && (
            <motion.div
              key="file-over"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Storage Gauge */}
              <div className="bg-slate-950 border border-slate-850 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-inner">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* SVG Circle Gauge */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="60" className="stroke-slate-850 fill-none stroke-8" />
                    <motion.circle 
                      cx="72" 
                      cy="72" 
                      r="60" 
                      className={`fill-none stroke-8 rounded-full ${barAccentClass}`} 
                      strokeDasharray={2 * Math.PI * 60}
                      initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      animate={{ strokeDashoffset: (2 * Math.PI * 60) * (1 - usedStorage / totalStorage) }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black tracking-tight font-display">{storagePercentage}%</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Used Space</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-slate-300 font-medium">Used {usedStorage} GB out of {totalStorage} GB</p>
                  <p className="text-[10px] text-slate-500 font-mono">Simulating standard dynamic storage</p>
                </div>
              </div>

              {/* Categorized breakdown */}
              <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase block tracking-wider">Storage Distribution</span>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: 'Videos', icon: <Video size={16} />, sz: '38.4 GB', col: 'text-rose-400 bg-rose-500/10' },
                    { label: 'Images', icon: <ImageIcon size={16} />, sz: '15.2 GB', col: 'text-emerald-400 bg-emerald-500/10' },
                    { label: 'Audio', icon: <Music size={16} />, sz: '6.4 GB', col: 'text-violet-400 bg-violet-500/10' },
                    { label: 'PDF Documents', icon: <File size={16} />, sz: '4.1 GB', col: 'text-indigo-400 bg-indigo-500/10' }
                  ].map((cat, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-900 border border-slate-850 rounded-xl">
                      <div className={`p-2 rounded-lg ${cat.col}`}>
                        {cat.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 block font-medium">{cat.label}</span>
                        <span className="text-xs font-semibold text-slate-200 font-mono">{cat.sz}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage Tips */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl flex items-start gap-2.5">
                <AlertTriangle size={18} className="text-amber-500 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-amber-300">Storage Optimization Available</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    We found {largeFiles.length} files over 100MB and {duplicateFiles.filter(d => d.checked).length} exact file duplicates ready to clear. Tap tabs above to review.
                  </p>
                </div>
              </div>

            </motion.div>
          )}

          {/* LARGE FILES LIST */}
          {activeTab === 'large' && (
            <motion.div
              key="file-large"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">Files &gt; 100MB</span>
                <span className="text-xs text-indigo-400 font-mono">{largeFiles.length} flagged</span>
              </div>

              {isCleaning ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-slate-800/10 rounded-2xl border border-slate-800">
                  <div className="w-10 h-10 border-4 border-slate-800 border-t-rose-500 rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-rose-400 animate-pulse">Shredding disk sectors...</span>
                </div>
              ) : largeFiles.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/10 border border-slate-800/50 rounded-2xl">
                  <ShieldCheck size={36} className="text-emerald-400 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-300">Disk space fully optimized!</p>
                  <p className="text-[10px] text-slate-500 mt-1">No large files remaining in cache.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {largeFiles.map((file) => (
                    <div 
                      key={file.id}
                      onClick={() => handleToggleLarge(file.id)}
                      className={`p-3 border rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        file.checked 
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-200' 
                          : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input 
                          type="checkbox" 
                          checked={file.checked}
                          onChange={() => {}} // handled by click
                          className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-200 truncate block">{file.name}</span>
                          <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">{file.category}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-400 flex-shrink-0">{file.size}</span>
                    </div>
                  ))}

                  <button
                    onClick={deleteSelectedLarge}
                    disabled={!largeFiles.some(f => f.checked)}
                    className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg ${
                      largeFiles.some(f => f.checked) 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-rose-600/10 animate-pulse' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 size={14} />
                    <span>Delete Selected ({largeFiles.filter(f => f.checked).length} files)</span>
                  </button>
                </div>
              )}

            </motion.div>
          )}

          {/* DUPLICATES CLEANER */}
          {activeTab === 'duplicates' && (
            <motion.div
              key="file-dup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">Exact File Duplicates</span>
                <span className="text-xs text-rose-400 font-mono">{duplicateFiles.length / 2} sets found</span>
              </div>

              {isCleaning ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-slate-800/10 rounded-2xl border border-slate-800">
                  <div className="w-10 h-10 border-4 border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
                  <span className="text-xs font-semibold text-indigo-400 animate-pulse">Purging identical hashes...</span>
                </div>
              ) : duplicateFiles.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/10 border border-slate-800/50 rounded-2xl">
                  <ShieldCheck size={36} className="text-emerald-400 mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-300">Duplicates Cleared!</p>
                  <p className="text-[10px] text-slate-500 mt-1">Every hash index on storage is unique.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {duplicateFiles.map((file) => (
                    <div 
                      key={file.id}
                      onClick={() => handleToggleDuplicate(file.id)}
                      className={`p-3 border rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        file.checked 
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-200' 
                          : 'bg-slate-800/40 border-slate-850 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input 
                          type="checkbox" 
                          checked={file.checked}
                          onChange={() => {}} // handled by click
                          className="accent-rose-500 w-4 h-4 rounded cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className="text-xs font-semibold text-slate-200 truncate block">{file.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{file.path}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-slate-400 flex-shrink-0">{file.size}</span>
                    </div>
                  ))}

                  <button
                    onClick={deleteSelectedDuplicates}
                    disabled={!duplicateFiles.some(f => f.checked)}
                    className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg ${
                      duplicateFiles.some(f => f.checked) 
                        ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-rose-600/10' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Trash2 size={14} />
                    <span>Clear Selected Duplicates ({duplicateFiles.filter(f => f.checked).length})</span>
                  </button>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
