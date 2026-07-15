import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, FileUp, ArrowLeft, Merge, Sliders, Play, CheckCircle, 
  Settings, Lock, Unlock, Image as ImageIcon, Eye, FileDown, Trash
} from 'lucide-react';
import { AccentColor } from '../types';

interface PDFToolsProps {
  accentColor: AccentColor;
  onBack: () => void;
  triggerAd: (onComplete: () => void) => void;
}

type PDFSubTool = 'menu' | 'merge' | 'split' | 'compress' | 'rotate' | 'lock' | 'unlock' | 'img_to_pdf' | 'pdf_to_img' | 'extract_txt';

export function PDFTools({ accentColor, onBack, triggerAd }: PDFToolsProps) {
  const [activeSubTool, setActiveSubTool] = useState<PDFSubTool>('menu');
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Sub-tool states
  const [password, setPassword] = useState('');
  const [splitRange, setSplitRange] = useState('1-3');
  const [compressLevel, setCompressLevel] = useState<number>(50); // percentage
  const [rotation, setRotation] = useState<number>(90); // deg

  const accentColorClasses = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-indigo-100 border-indigo-500/20 shadow-indigo-600/10 text-indigo-600',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-emerald-100 border-emerald-500/20 shadow-emerald-600/10 text-emerald-600',
    violet: 'bg-violet-600 hover:bg-violet-700 text-violet-100 border-violet-500/20 shadow-violet-600/10 text-violet-600',
    amber: 'bg-amber-600 hover:bg-amber-700 text-amber-100 border-amber-500/20 shadow-amber-600/10 text-amber-600',
    rose: 'bg-rose-600 hover:bg-rose-700 text-rose-100 border-rose-500/20 shadow-rose-600/10 text-rose-600',
    blue: 'bg-blue-600 hover:bg-blue-700 text-blue-100 border-blue-500/20 shadow-blue-600/10 text-blue-600',
  };

  const menuTheme = {
    indigo: 'bg-indigo-500/10 text-indigo-400',
    emerald: 'bg-emerald-500/10 text-emerald-400',
    violet: 'bg-violet-500/10 text-violet-400',
    amber: 'bg-amber-500/10 text-amber-400',
    rose: 'bg-rose-500/10 text-rose-400',
    blue: 'bg-blue-500/10 text-blue-400',
  }[accentColor];

  const subTools = [
    { id: 'merge', title: 'Merge PDF', icon: <Merge size={20} />, desc: 'Combine multiple PDF files into one.' },
    { id: 'split', title: 'Split PDF', icon: <Sliders size={20} />, desc: 'Extract specific pages or page ranges.' },
    { id: 'compress', title: 'Compress PDF', icon: <FileDown size={20} />, desc: 'Reduce file size while preserving quality.' },
    { id: 'rotate', title: 'Rotate PDF', icon: <Sliders size={20} className="rotate-90" />, desc: 'Rotate specific or all pages.' },
    { id: 'lock', title: 'Lock PDF', icon: <Lock size={20} />, desc: 'Secure PDF with a reliable password.' },
    { id: 'unlock', title: 'Unlock PDF', icon: <Unlock size={20} />, desc: 'Remove password protection from PDF.' },
    { id: 'img_to_pdf', title: 'Image to PDF', icon: <ImageIcon size={20} />, desc: 'Convert PNG, JPG, WEBP to PDF.' },
    { id: 'pdf_to_img', title: 'PDF to Image', icon: <Eye size={20} />, desc: 'Extract high-resolution image pages.' },
    { id: 'extract_txt', title: 'Extract Text', icon: <FileText size={20} />, desc: 'Retrieve raw text from PDF document.' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file: any) => ({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setIsDone(false);

    // Simulate standard Ad interstitial before exporting as Play Store monetizing requirement
    triggerAd(() => {
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 2500);
    });
  };

  const resetToolState = () => {
    setFiles([]);
    setIsProcessing(false);
    setIsDone(false);
    setPassword('');
    setSplitRange('1-3');
    setCompressLevel(50);
    setRotation(90);
  };

  const triggerDownload = () => {
    // Standard client side mock download trigger
    const content = "Smart Utility Pro - PDF Processed File Mock Content";
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart_utility_${activeSubTool}_processed.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="pdf-tools-root">
      
      {/* Dynamic Action Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur" id="pdf-header">
        <button 
          onClick={activeSubTool === 'menu' ? onBack : () => { setActiveSubTool('menu'); resetToolState(); }}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          id="pdf-back-btn"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">
            {activeSubTool === 'menu' ? 'PDF Utilities' : subTools.find(t => t.id === activeSubTool)?.title}
          </h1>
          <p className="text-xs text-slate-400">
            {activeSubTool === 'menu' ? 'Manage, compress, protect files' : 'Local sandboxed file process'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeSubTool === 'menu' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 gap-3"
              key="pdf-menu"
            >
              {subTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveSubTool(tool.id as PDFSubTool)}
                  className="flex items-center gap-4 p-3.5 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800/50 rounded-2xl transition-all duration-200 text-left cursor-pointer group"
                >
                  <div className={`p-3 rounded-xl transition-transform group-hover:scale-105 ${menuTheme}`}>
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-100 font-display">{tool.title}</h3>
                    <p className="text-xs text-slate-400 truncate">{tool.desc}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-4"
              key="pdf-workspace"
            >
              {/* File Upload Zone */}
              {!isDone && !isProcessing && (
                <div className="border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-2xl p-6 text-center transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept={activeSubTool === 'img_to_pdf' ? "image/*" : ".pdf"}
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <FileUp size={36} className="text-slate-500 animate-bounce" />
                    <span className="text-sm font-semibold">
                      Drag & Drop or <span className="text-indigo-400 underline">Browse</span>
                    </span>
                    <span className="text-xs text-slate-500">
                      Supports up to 50MB files (Processed locally)
                    </span>
                  </div>
                </div>
              )}

              {/* Uploaded File List */}
              {files.length > 0 && !isProcessing && !isDone && (
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-3 space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Selected Files</span>
                    <span className="text-xs text-slate-400 font-mono">{files.length} active</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {files.map((file, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-slate-800/80 rounded-xl border border-slate-700/30">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText size={16} className="text-indigo-400 flex-shrink-0" />
                          <span className="text-xs text-slate-200 truncate pr-2">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 font-mono">{file.size}</span>
                          <button 
                            onClick={() => removeFile(i)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded-lg"
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific Subtool Options */}
              {!isProcessing && !isDone && files.length > 0 && (
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-2">
                    <Settings size={14} className="text-slate-400" />
                    <span className="text-xs font-semibold text-slate-400 uppercase">Configuration</span>
                  </div>

                  {activeSubTool === 'split' && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400">Pages/Ranges (e.g. 1-3, 5, 8-10):</label>
                      <input 
                        type="text" 
                        value={splitRange} 
                        onChange={(e) => setSplitRange(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white font-mono"
                      />
                    </div>
                  )}

                  {activeSubTool === 'compress' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Target Quality (DPI):</span>
                        <span className="font-mono text-indigo-400">{compressLevel === 75 ? 'Standard (150 DPI)' : compressLevel === 100 ? 'High (300 DPI)' : 'Low (72 DPI)'}</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="100" 
                        step="25"
                        value={compressLevel} 
                        onChange={(e) => setCompressLevel(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  )}

                  {activeSubTool === 'rotate' && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400">Rotation Angle:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[90, 180, 270].map((angle) => (
                          <button
                            key={angle}
                            type="button"
                            onClick={() => setRotation(angle)}
                            className={`py-1.5 rounded-lg border text-xs font-mono font-medium ${
                              rotation === angle 
                                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                            }`}
                          >
                            {angle}° Clockwise
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(activeSubTool === 'lock' || activeSubTool === 'unlock') && (
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400">Password Encryption Key:</label>
                      <input 
                        type="password" 
                        placeholder={activeSubTool === 'lock' ? 'Set encryption password' : 'Enter unlock password'}
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white font-mono"
                      />
                    </div>
                  )}

                  {activeSubTool === 'extract_txt' && (
                    <div className="flex items-center gap-2 p-2.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl text-xs">
                      <FileText size={16} className="text-indigo-400" />
                      <span>Extracts plain text with table headers formatting retained.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Progress & Processing Screen */}
              {isProcessing && (
                <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Processing PDF on Sandbox...</h4>
                    <p className="text-xs text-slate-500 mt-1">Executing binary transforms securely offline</p>
                  </div>
                </div>
              )}

              {/* Final Success Workspace */}
              {isDone && (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-800/20 border border-slate-800 rounded-2xl text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">File Processed Successfully!</h4>
                    <p className="text-xs text-slate-400 mt-1">Your new document is secure and fully formatted.</p>
                  </div>

                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={triggerDownload}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 cursor-pointer"
                    >
                      Download Processed File
                    </button>
                    <button
                      onClick={() => setActiveSubTool('menu')}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
                    >
                      Return to PDF Menu
                    </button>
                  </div>
                </div>
              )}

              {/* Action trigger button */}
              {!isProcessing && !isDone && (
                <button
                  onClick={handleProcess}
                  disabled={files.length === 0}
                  className={`w-full py-3 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                    files.length > 0 
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:opacity-95 shadow-indigo-600/20 cursor-pointer' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Play size={14} />
                  <span>Execute {subTools.find(t => t.id === activeSubTool)?.title}</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
