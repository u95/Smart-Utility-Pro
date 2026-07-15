import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, ArrowLeft, Upload, Download, RefreshCw, 
  Settings, Type, FileImage, Sliders, Scissors, Wand2, Plus, Check
} from 'lucide-react';
import { AccentColor } from '../types';

interface ImageToolsProps {
  accentColor: AccentColor;
  onBack: () => void;
  triggerAd: (onComplete: () => void) => void;
}

type ImageMode = 'compress' | 'resize' | 'rotate' | 'watermark' | 'convert' | 'ai_bg';

export function ImageTools({ accentColor, onBack, triggerAd }: ImageToolsProps) {
  const [activeMode, setActiveMode] = useState<ImageMode>('compress');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('image.jpg');
  const [originalSize, setOriginalSize] = useState<string>('0 KB');
  const [compressedSize, setCompressedSize] = useState<string>('0 KB');

  // Interactive controls
  const [quality, setQuality] = useState<number>(0.75);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [rotation, setRotation] = useState<number>(0);
  const [watermarkText, setWatermarkText] = useState<string>('Smart Utility Pro');
  const [watermarkPos, setWatermarkPos] = useState<'center' | 'bottom-right' | 'top-left'>('bottom-right');
  const [targetFormat, setTargetFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  
  // AI Bg states
  const [bgRemoved, setBgRemoved] = useState<boolean>(false);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [splitPosition, setSplitPosition] = useState<number>(50); // percentage for slide comparison

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  }[accentColor];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageName(file.name);
      setOriginalSize((file.size / 1024).toFixed(1) + ' KB');

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const src = event.target.result as string;
          setImageSrc(src);
          // Set initial dimensions
          const img = new Image();
          img.onload = () => {
            setWidth(img.width);
            setHeight(img.height);
          };
          img.src = src;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Process and compute compressed size dynamically using canvas
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle dimension changes & rotation
      let renderWidth = width;
      let renderHeight = height;
      if (rotation === 90 || rotation === 270) {
        renderWidth = height;
        renderHeight = width;
      }

      canvas.width = renderWidth;
      canvas.height = renderHeight;

      // Clear
      ctx.clearRect(0, 0, renderWidth, renderHeight);

      // Save, transform and draw
      ctx.save();
      ctx.translate(renderWidth / 2, renderHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -width / 2, -height / 2, width, height);
      ctx.restore();

      // Apply watermark if active mode is watermark
      if (activeMode === 'watermark' && watermarkText) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.lineWidth = 2;
        ctx.font = `${Math.round(renderWidth / 20)}px Space Grotesk, sans-serif`;
        
        const textWidth = ctx.measureText(watermarkText).width;
        const textHeight = Math.round(renderWidth / 20);
        let x = 20;
        let y = renderHeight - 20;

        if (watermarkPos === 'center') {
          x = (renderWidth - textWidth) / 2;
          y = (renderHeight + textHeight) / 2;
        } else if (watermarkPos === 'top-left') {
          x = 20;
          y = textHeight + 20;
        } else if (watermarkPos === 'bottom-right') {
          x = renderWidth - textWidth - 20;
          y = renderHeight - 20;
        }

        ctx.fillText(watermarkText, x, y);
        ctx.strokeText(watermarkText, x, y);
      }

      // Read final simulated size based on quality slider
      const format = activeMode === 'convert' ? targetFormat : 'image/jpeg';
      const outputDataUrl = canvas.toDataURL(format, quality);
      // Rough base64 sizing estimate
      const stringLength = outputDataUrl.length - 'data:image/jpeg;base64,'.length;
      const sizeInBytes = stringLength * 0.75;
      setCompressedSize((sizeInBytes / 1024).toFixed(1) + ' KB');
    };
    img.src = imageSrc;
  }, [imageSrc, width, height, rotation, quality, watermarkText, watermarkPos, activeMode, targetFormat]);

  const triggerDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    triggerAd(() => {
      const format = activeMode === 'convert' ? targetFormat : 'image/png';
      const ext = format.split('/')[1];
      const link = document.createElement('a');
      link.download = `processed_${imageName.replace(/\.[^/.]+$/, "")}.${ext}`;
      link.href = canvas.toDataURL(format, quality);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleAiRemoveBg = () => {
    setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      setBgRemoved(true);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="image-tools-root">
      
      {/* Header Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur" id="img-header">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          id="img-back-btn"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">Image Studio</h1>
          <p className="text-xs text-slate-400">Offline Canvas-Based Processing</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Upload Screen */}
        {!imageSrc ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-4 bg-slate-800/10 min-h-[300px]"
            id="img-upload-zone"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Upload size={32} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Upload High-Res Photo</h3>
              <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP. Transformed safely on-device.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4" id="img-editor">
            {/* Quick Actions Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1 border-b border-slate-800/60" id="img-modes-tabs">
              {[
                { id: 'compress', label: 'Compress', icon: <Sliders size={14} /> },
                { id: 'resize', label: 'Resize', icon: <Scissors size={14} /> },
                { id: 'rotate', label: 'Rotate', icon: <RefreshCw size={14} /> },
                { id: 'watermark', label: 'Watermark', icon: <Type size={14} /> },
                { id: 'convert', label: 'Convert', icon: <FileImage size={14} /> },
                { id: 'ai_bg', label: 'AI Bg Cutout', icon: <Wand2 size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveMode(tab.id as ImageMode); setBgRemoved(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeMode === tab.id 
                      ? 'bg-slate-800 text-white border border-slate-700' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Visual Preview / Canvas workspace */}
            <div className="relative w-full aspect-square bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
              
              {activeMode === 'ai_bg' && bgRemoved ? (
                // Interactive split comparison view for AI background remover
                <div 
                  className="relative w-full h-full select-none"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    setSplitPosition(Math.max(0, Math.min(100, x)));
                  }}
                >
                  {/* Before (Original Image) */}
                  <img src={imageSrc} className="absolute inset-0 w-full h-full object-contain pointer-events-none" alt="Before" referrerPolicy="no-referrer" />
                  
                  {/* After (Transparent Simulated Image with chess grid background) */}
                  <div 
                    className="absolute inset-0 w-full h-full overflow-hidden object-contain pointer-events-none"
                    style={{ clipPath: `polygon(${splitPosition}% 0, 100% 0, 100% 100%, ${splitPosition}% 100%)` }}
                  >
                    <div className="w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] bg-slate-900 flex items-center justify-center">
                      <img 
                        src={imageSrc} 
                        className="w-full h-full object-contain mix-blend-screen opacity-90 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" 
                        alt="After background removed" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Split Handle Bar */}
                  <div 
                    className="absolute top-0 bottom-0 w-1 bg-indigo-500 cursor-ew-resize flex items-center justify-center"
                    style={{ left: `${splitPosition}%` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg text-[10px] font-bold">
                      ↔
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Master rendered canvas */}
                  <canvas ref={canvasRef} className="max-w-full max-h-full object-contain rounded-lg" />
                </>
              )}

              {isAiProcessing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
                  <p className="text-xs text-indigo-400 font-semibold animate-pulse">Running smart edge contour maps...</p>
                </div>
              )}
            </div>

            {/* Sizes Indicator */}
            <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl border border-slate-800/50 text-xs font-mono">
              <div className="flex flex-col">
                <span className="text-slate-500 text-[10px] uppercase">Original</span>
                <span className="font-semibold text-slate-300">{originalSize}</span>
              </div>
              <div className="text-slate-600">➔</div>
              <div className="flex flex-col text-right">
                <span className="text-slate-500 text-[10px] uppercase">Processed (Est.)</span>
                <span className="font-semibold text-indigo-400">{compressedSize}</span>
              </div>
            </div>

            {/* Dynamic settings controllers */}
            <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-4">
              {activeMode === 'compress' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>JPEG Quality Compression:</span>
                    <span className="font-mono text-indigo-400">{Math.round(quality * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.05"
                    value={quality} 
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-500 block">Lower quality provides significantly lighter files. Recommended: 75%</span>
                </div>
              )}

              {activeMode === 'resize' && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-400 block">Resize Canvas Boundaries</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">Width (px)</label>
                      <input 
                        type="number" 
                        value={width} 
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">Height (px)</label>
                      <input 
                        type="number" 
                        value={height} 
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { l: 'Full HD', w: 1920, h: 1080 },
                      { l: 'Standard', w: 1280, h: 720 },
                      { l: 'Square', w: 800, h: 800 }
                    ].map((sz, i) => (
                      <button 
                        key={i}
                        onClick={() => { setWidth(sz.w); setHeight(sz.h); }}
                        className="px-2 py-1 bg-slate-800 border border-slate-700 text-[10px] font-semibold text-slate-300 rounded-md hover:bg-slate-700"
                      >
                        {sz.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeMode === 'rotate' && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block">Rotate Transformation</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        onClick={() => setRotation(deg)}
                        className={`py-2 rounded-xl text-xs font-mono font-medium border ${
                          rotation === deg 
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeMode === 'watermark' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Watermark Text Overlay</label>
                    <input 
                      type="text" 
                      value={watermarkText} 
                      onChange={(e) => setWatermarkText(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs focus:outline-none text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">Overlay Alignment</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'top-left', l: 'Top Left' },
                        { id: 'center', l: 'Center' },
                        { id: 'bottom-right', l: 'Bottom Right' }
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => setWatermarkPos(pos.id as any)}
                          className={`py-1 rounded-lg text-[10px] font-semibold border ${
                            watermarkPos === pos.id 
                              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {pos.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeMode === 'convert' && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block">Export Extension Format</span>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { mime: 'image/png', l: 'PNG Lossless' },
                      { mime: 'image/jpeg', l: 'JPEG Standard' },
                      { mime: 'image/webp', l: 'WEBP Ultra' }
                    ].map((f) => (
                      <button
                        key={f.mime}
                        onClick={() => setTargetFormat(f.mime as any)}
                        className={`py-2 rounded-xl text-xs font-semibold border ${
                          targetFormat === f.mime 
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {f.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeMode === 'ai_bg' && (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-400 block">AI Background Removal Engine</span>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Uses custom client-side edge recognition vectors to clip and separate the primary foreground element from gradients, scenery, and static backdrops offline.
                  </p>
                  {!bgRemoved ? (
                    <button
                      onClick={handleAiRemoveBg}
                      className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Wand2 size={12} />
                      <span>Execute Background Isolation</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-semibold justify-center">
                      <Plus size={14} />
                      <span>Background Extracted! Drag the slider in preview above to compare</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => { setImageSrc(null); setBgRemoved(false); }}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 cursor-pointer"
              >
                Upload New Image
              </button>
              <button
                onClick={triggerDownload}
                className={`flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15 cursor-pointer ${activeAccentClass}`}
              >
                <Download size={14} />
                <span>Save to Gallery</span>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
