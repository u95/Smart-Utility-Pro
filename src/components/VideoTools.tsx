import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, ArrowLeft, Sliders, Music, VolumeX, Info, Play, CheckCircle, 
  Settings, Scissors, Sparkles, Download, Upload
} from 'lucide-react';
import { AccentColor } from '../types';

interface VideoToolsProps {
  accentColor: AccentColor;
  onBack: () => void;
  triggerAd: (onComplete: () => void) => void;
}

type VideoSubTool = 'compress' | 'trim' | 'audio' | 'mute' | 'info';

export function VideoTools({ accentColor, onBack, triggerAd }: VideoToolsProps) {
  const [activeSubTool, setActiveSubTool] = useState<VideoSubTool>('compress');
  const [videoFile, setVideoFile] = useState<{ name: string; size: string; duration: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Video Options
  const [trimStart, setTrimStart] = useState<number>(10); // seconds
  const [trimEnd, setTrimEnd] = useState<number>(45); // seconds
  const [maxDuration, setMaxDuration] = useState<number>(60);
  const [compressPreset, setCompressPreset] = useState<'480p' | '720p' | '1080p'>('720p');
  const [audioFormat, setAudioFormat] = useState<'mp3' | 'wav'>('mp3');

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  }[accentColor];

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        duration: '1m 24s'
      });
      setMaxDuration(84);
      setTrimStart(15);
      setTrimEnd(60);
    }
  };

  const handleProcessVideo = () => {
    if (!videoFile) return;
    setIsProcessing(true);
    setIsDone(false);

    triggerAd(() => {
      setTimeout(() => {
        setIsProcessing(false);
        setIsDone(true);
      }, 3000);
    });
  };

  const triggerDownload = () => {
    const content = "Smart Utility Pro - Processed Video File Mock";
    const blob = new Blob([content], { type: 'video/mp4' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart_${activeSubTool}_${videoFile?.name || 'video.mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="video-tools-root">
      
      {/* Header Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur" id="video-header">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          id="video-back-btn"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">Video Toolkit</h1>
          <p className="text-xs text-slate-400">Offline Frame Optimizers</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {!videoFile ? (
          <div 
            onClick={() => document.getElementById('video-upload-input')?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 bg-slate-800/10 min-h-[300px]"
            id="video-upload-zone"
          >
            <input 
              type="file" 
              id="video-upload-input" 
              onChange={handleVideoUpload} 
              accept="video/*" 
              className="hidden" 
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Upload size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Upload Video Clip</h3>
              <p className="text-xs text-slate-500 mt-1">Supports MP4, MOV, MKV, WebM up to 100MB</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Horizontal Subtool Switcher */}
            <div className="flex gap-1 overflow-x-auto pb-1 border-b border-slate-800/60" id="video-tab-bar">
              {[
                { id: 'compress', label: 'Compress', icon: <Sliders size={14} /> },
                { id: 'trim', label: 'Trim Clip', icon: <Scissors size={14} /> },
                { id: 'audio', label: 'Extract Audio', icon: <Music size={14} /> },
                { id: 'mute', label: 'Mute', icon: <VolumeX size={14} /> },
                { id: 'info', label: 'Metadata', icon: <Info size={14} /> }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => { setActiveSubTool(sub.id as VideoSubTool); setIsDone(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeSubTool === sub.id 
                      ? 'bg-slate-800 text-white border border-slate-700' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sub.icon}
                  <span>{sub.label}</span>
                </button>
              ))}
            </div>

            {/* Video Preview Canvas Grid */}
            <div className="relative w-full aspect-video bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between p-3 shadow-inner">
              <div className="flex justify-between items-center z-10">
                <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/10 px-2 py-0.5 rounded-full">
                  Local processing sandbox
                </span>
                <span className="text-xs text-slate-500 font-mono">{videoFile.duration}</span>
              </div>

              {/* Core visual icon display */}
              <div className="flex flex-col items-center justify-center py-6 gap-2">
                <Video size={48} className="text-indigo-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-300 truncate max-w-[200px]">{videoFile.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">{videoFile.size}</span>
              </div>

              {/* Progress Slider */}
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-1/3" />
              </div>
            </div>

            {/* Subtool controllers */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSubTool}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-4"
              >
                {activeSubTool === 'compress' && (
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-400 block">Compression Resolution Preset</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '1080p', label: 'HD 1080p', desc: 'High Quality' },
                        { id: '720p', label: 'HD 720p', desc: 'Balanced' },
                        { id: '480p', label: 'SD 480p', desc: 'Fast/Light' }
                      ].map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setCompressPreset(preset.id as any)}
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between h-20 ${
                            compressPreset === preset.id 
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="text-xs font-bold font-display">{preset.label}</span>
                          <span className="text-[9px] text-slate-500 leading-none">{preset.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubTool === 'trim' && (
                  <div className="space-y-4">
                    <span className="text-xs font-semibold text-slate-400 block">Trim Video Boundaries</span>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>Start Frame: {trimStart}s</span>
                        <span>End Frame: {trimEnd}s</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500">Trim From (s)</label>
                          <input 
                            type="number" 
                            min="0"
                            max={trimEnd - 1}
                            value={trimStart}
                            onChange={(e) => setTrimStart(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500">Trim To (s)</label>
                          <input 
                            type="number" 
                            min={trimStart + 1}
                            max={maxDuration}
                            value={trimEnd}
                            onChange={(e) => setTrimEnd(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubTool === 'audio' && (
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-slate-400 block">Extraction Format codec</span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'mp3', label: 'MP3 Audio (192kbps)' },
                        { id: 'wav', label: 'WAV Lossless (44.1kHz)' }
                      ].map((format) => (
                        <button
                          key={format.id}
                          onClick={() => setAudioFormat(format.id as any)}
                          className={`py-2 rounded-xl text-xs font-semibold border ${
                            audioFormat === format.id 
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {format.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubTool === 'mute' && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-400 block">Strip Audio Track</span>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Removes all audio streams and metadata tracks from the video container, reducing final export size and silencing sound.
                    </p>
                    <div className="p-3 bg-indigo-500/5 text-indigo-300 border border-indigo-500/10 rounded-xl text-xs flex items-center gap-2">
                      <VolumeX size={16} className="text-indigo-400" />
                      <span>Optimized for fast export without re-encoding frames.</span>
                    </div>
                  </div>
                )}

                {activeSubTool === 'info' && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-semibold text-slate-400 block">Advanced Metadata Analysis</span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      {[
                        { l: 'MIME Type', v: 'video/mp4' },
                        { l: 'Resolution', v: '1920 x 1080 px' },
                        { l: 'Bitrate', v: '4250 kbps' },
                        { l: 'Framerate', v: '30.00 fps' },
                        { l: 'Audio Codec', v: 'AAC Stereo' },
                        { l: 'Video Codec', v: 'H.264 / AVC' }
                      ].map((row, i) => (
                        <div key={i} className="bg-slate-900/50 p-2 border border-slate-800 rounded-xl flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase">{row.l}</span>
                          <span className="font-semibold text-slate-300 truncate mt-0.5">{row.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Rendering Progress View */}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold">Re-rendering container boundaries...</h4>
                  <p className="text-[10px] text-slate-500 mt-1">GPU Accelerated sandboxed encoding</p>
                </div>
              </div>
            )}

            {/* Done Screen */}
            {isDone && (
              <div className="flex flex-col items-center justify-center p-6 bg-slate-850 border border-slate-800 rounded-2xl text-center space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Video Processed!</h4>
                  <p className="text-xs text-slate-400">File is fully formatted and ready to download.</p>
                </div>

                <div className="flex gap-2 w-full">
                  <button
                    onClick={triggerDownload}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 cursor-pointer"
                  >
                    Download File
                  </button>
                  <button
                    onClick={() => setIsDone(false)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
                  >
                    Reset Editor
                  </button>
                </div>
              </div>
            )}

            {/* Trigger Process Button */}
            {!isProcessing && !isDone && (
              <div className="flex gap-2">
                <button
                  onClick={() => setVideoFile(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
                >
                  Upload New Video
                </button>
                <button
                  onClick={handleProcessVideo}
                  className={`flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg cursor-pointer ${activeAccentClass}`}
                >
                  <Play size={14} />
                  <span>Execute {activeSubTool.toUpperCase()}</span>
                </button>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
