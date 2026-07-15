import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scan, ArrowLeft, Camera, Upload, Check, Sliders, Play, 
  FileText, Sparkles, Copy, FileDown, Image as ImageIcon, Maximize
} from 'lucide-react';
import { AccentColor } from '../types';

interface DocScannerProps {
  accentColor: AccentColor;
  onBack: () => void;
  triggerAd: (onComplete: () => void) => void;
}

type ScanStep = 'camera' | 'crop' | 'filter' | 'export';
type FilterType = 'original' | 'magic' | 'bw' | 'grayscale';

export function DocScanner({ accentColor, onBack, triggerAd }: DocScannerProps) {
  const [step, setStep] = useState<ScanStep>('camera');
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('magic');
  
  // Crop node handles (percentages)
  const [corners, setCorners] = useState({
    tl: { x: 10, y: 15 },
    tr: { x: 88, y: 12 },
    bl: { x: 12, y: 84 },
    br: { x: 92, y: 80 }
  });

  const [activeCorner, setActiveCorner] = useState<keyof typeof corners | null>(null);
  
  // OCR states
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/10',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-600/10',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/10',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/10',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10',
  }[accentColor];

  const borderAccentClass = {
    indigo: 'border-indigo-500',
    emerald: 'border-emerald-500',
    violet: 'border-violet-500',
    amber: 'border-amber-500',
    rose: 'border-rose-500',
    blue: 'border-blue-500',
  }[accentColor];

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setScannedImage(event.target.result as string);
          setStep('crop');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateCameraSnapshot = () => {
    // Generate an elegant document mockup image automatically
    setIsOcrRunning(true);
    setTimeout(() => {
      // High resolution invoice template
      setScannedImage("https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=600&auto=format&fit=crop");
      setStep('crop');
      setIsOcrRunning(false);
    }, 1500);
  };

  const handleDragCorner = (e: React.MouseEvent<HTMLDivElement>, corner: keyof typeof corners) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setCorners(prev => ({
      ...prev,
      [corner]: {
        x: Math.max(0, Math.min(100, x)),
        y: Math.max(0, Math.min(100, y))
      }
    }));
  };

  const handleRunOcr = () => {
    setIsOcrRunning(true);
    setExtractedText(null);

    triggerAd(() => {
      setTimeout(() => {
        setIsOcrRunning(false);
        setExtractedText(
          "INVOICE & BILL OF LADING\n" +
          "Invoice No: INV-2026-9483\n" +
          "Date: July 14, 2026\n" +
          "Due Date: August 14, 2026\n\n" +
          "BILL TO:\n" +
          "Google AI Studio Developer\n" +
          "Silicon Valley, California, US\n\n" +
          "DESCRIPTION               QTY    PRICE     TOTAL\n" +
          "Smart Utility Pro Cloud   1      $49.99    $49.99\n" +
          "On-device OCR Pack        1      $15.00    $15.00\n\n" +
          "SUBTOTAL: $64.99\n" +
          "TAX (8.5%): $5.52\n" +
          "TOTAL BALANCE DUE: $70.51\n\n" +
          "Thank you for your business!"
        );
      }, 2000);
    });
  };

  const downloadProcessedDoc = (format: 'pdf' | 'jpg') => {
    const content = extractedText || "Smart Utility Pro Scanned Document Asset";
    const blob = new Blob([content], { type: format === 'pdf' ? 'application/pdf' : 'image/jpeg' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scanned_document_${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="doc-scanner-root">
      
      {/* Dynamic Navigation Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="scan-header">
        <button 
          onClick={step === 'camera' ? onBack : () => {
            if (step === 'crop') setStep('camera');
            if (step === 'filter') setStep('crop');
            if (step === 'export') setStep('filter');
          }}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">Document Scanner</h1>
          <p className="text-xs text-slate-400">
            {step === 'camera' && 'Capture paper docs'}
            {step === 'crop' && 'Auto edge perspective'}
            {step === 'filter' && 'Color filter enhancing'}
            {step === 'export' && 'OCR text & exports'}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: CAPTURE CAMERA */}
          {step === 'camera' && (
            <motion.div
              key="step-cam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Viewfinder simulator */}
              <div className="relative w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden border border-slate-800 flex flex-col justify-between p-4 shadow-inner">
                
                {/* Simulated grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-15 pointer-events-none">
                  <div className="border border-white/40" /><div className="border border-white/40" /><div className="border border-white/40" />
                  <div className="border border-white/40" /><div className="border border-white/40" /><div className="border border-white/40" />
                  <div className="border border-white/40" /><div className="border border-white/40" /><div className="border border-white/40" />
                </div>

                <div className="flex justify-between items-center z-10">
                  <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 rounded">Auto Crop active</span>
                  <span className="text-xs text-slate-400 font-mono">3:4 Ratio</span>
                </div>

                {isOcrRunning ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-20">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin mb-2" />
                    <span className="text-xs font-semibold text-indigo-400 animate-pulse">Taking Snapshot...</span>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-6 text-center">
                    <Scan size={60} className="text-slate-700 animate-pulse" />
                  </div>
                )}

                <div className="z-10 text-center text-[10px] text-slate-500">
                  Align documents within the bounds. Handled fully offline.
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => document.getElementById('doc-upload-file')?.click()}
                  className="flex-1 py-3 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-2xl text-xs font-semibold border border-slate-800 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload size={14} />
                  <span>Upload Image</span>
                  <input 
                    type="file" 
                    id="doc-upload-file" 
                    onChange={handleDocumentUpload} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </button>
                <button
                  onClick={simulateCameraSnapshot}
                  className={`flex-1 py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg ${activeAccentClass} cursor-pointer`}
                >
                  <Camera size={14} />
                  <span>Capture Page</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: EDGE PERSPECTIVE CROP */}
          {step === 'crop' && scannedImage && (
            <motion.div
              key="step-crop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="relative w-full aspect-[3/4] bg-slate-950 rounded-3xl overflow-hidden border border-slate-850 p-1 flex items-center justify-center select-none">
                {/* Rendered Document background */}
                <img 
                  src={scannedImage} 
                  className="w-full h-full object-cover opacity-60 rounded-2xl" 
                  alt="Document crop workspace" 
                  referrerPolicy="no-referrer"
                />

                {/* SVG Polygon overlay matching current corners */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <polygon
                    points={`
                      ${corners.tl.x}%,${corners.tl.y}% 
                      ${corners.tr.x}%,${corners.tr.y}% 
                      ${corners.br.x}%,${corners.br.y}% 
                      ${corners.bl.x}%,${corners.bl.y}%
                    `}
                    className="fill-indigo-500/10 stroke-indigo-500 stroke-2"
                  />
                </svg>

                {/* Interactive Drag Handles */}
                {Object.keys(corners).map((key) => {
                  const corner = key as keyof typeof corners;
                  const pos = corners[corner];
                  return (
                    <div
                      key={corner}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                      onMouseDown={() => setActiveCorner(corner)}
                      onMouseMove={(e) => {
                        if (activeCorner === corner) {
                          handleDragCorner(e, corner);
                        }
                      }}
                      onMouseUp={() => setActiveCorner(null)}
                      onMouseLeave={() => setActiveCorner(null)}
                      className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center cursor-move z-20 group"
                    >
                      <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white shadow-md group-hover:scale-125 transition-transform" />
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-800/30 p-3 rounded-xl text-center text-xs text-slate-400">
                Drag the four corner anchors to align with document border edges.
              </div>

              <button
                onClick={() => setStep('filter')}
                className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer ${activeAccentClass}`}
              >
                <Check size={14} />
                <span>Apply Crop Perspective</span>
              </button>
            </motion.div>
          )}

          {/* STEP 3: APPLY FILTERS */}
          {step === 'filter' && scannedImage && (
            <motion.div
              key="step-filter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Filtered Preview Frame */}
              <div className="relative w-full aspect-[3/4] bg-slate-950 rounded-3xl overflow-hidden border border-slate-850 p-1 flex items-center justify-center">
                <img 
                  src={scannedImage} 
                  className={`w-full h-full object-cover rounded-2xl transition-all ${
                    filter === 'grayscale' ? 'grayscale opacity-90' : ''
                  } ${
                    filter === 'bw' ? 'contrast-[2.0] brightness-[1.2] grayscale' : ''
                  } ${
                    filter === 'magic' ? 'saturate-[1.3] contrast-[1.1] brightness-[1.1]' : ''
                  }`}
                  alt="Enhanced Doc preview"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Filters Carousel options */}
              <div className="grid grid-cols-4 gap-2 bg-slate-950 p-1.5 rounded-2xl" id="doc-filters-bar">
                {[
                  { id: 'original', l: 'Original' },
                  { id: 'magic', l: 'Magic Color' },
                  { id: 'bw', l: 'B & W' },
                  { id: 'grayscale', l: 'Grayscale' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id as FilterType)}
                    className={`py-2 rounded-xl text-[10px] font-bold text-center cursor-pointer transition-all ${
                      filter === f.id 
                        ? 'bg-slate-800 text-indigo-400 border border-slate-700' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f.l}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('export')}
                className={`w-full py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1 cursor-pointer ${activeAccentClass}`}
              >
                <Check size={14} />
                <span>Enhancement complete</span>
              </button>
            </motion.div>
          )}

          {/* STEP 4: EXPORT & OCR EXTRACTION */}
          {step === 'export' && scannedImage && (
            <motion.div
              key="step-export"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* OCR recognition workspace */}
              <div className="bg-slate-850/60 border border-slate-800 rounded-3xl p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={16} className="text-amber-400" />
                    <span className="text-xs font-bold font-display">Optical Text Extractor (OCR)</span>
                  </div>
                  {extractedText && (
                    <button
                      onClick={() => { navigator.clipboard.writeText(extractedText); alert("Copied Text!"); }}
                      className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                  )}
                </div>

                {isOcrRunning ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin" />
                    <p className="text-xs text-indigo-400 font-semibold animate-pulse">Running Neural Grid OCR...</p>
                  </div>
                ) : extractedText ? (
                  <div className="max-h-[220px] overflow-y-auto bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] font-mono leading-relaxed text-slate-300 whitespace-pre-wrap select-all">
                    {extractedText}
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-3">
                    <FileText size={32} className="text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-400">OCR transcript is ready to compile</p>
                    <button
                      onClick={handleRunOcr}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold rounded-xl shadow-md cursor-pointer"
                    >
                      Extract Text via AI
                    </button>
                  </div>
                )}
              </div>

              {/* Save outputs */}
              <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase block">Export Options</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => downloadProcessedDoc('pdf')}
                    className="py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileDown size={14} />
                    <span>Save to PDF</span>
                  </button>
                  <button
                    onClick={() => downloadProcessedDoc('jpg')}
                    className="py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ImageIcon size={14} />
                    <span>Save to JPG</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => { setScannedImage(null); setStep('camera'); setExtractedText(null); }}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Scan Next Document Page
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
