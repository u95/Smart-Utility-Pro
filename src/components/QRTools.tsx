import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, ArrowLeft, Wifi, Contact, Mail, MapPin, MessageSquare, 
  History, Camera, Upload, Copy, ExternalLink, Download, Trash, RefreshCw
} from 'lucide-react';
import { AccentColor, QRHistoryEntry } from '../types';

interface QRToolsProps {
  accentColor: AccentColor;
  onBack: () => void;
  triggerAd: (onComplete: () => void) => void;
}

type QRMode = 'generate' | 'scan' | 'history';
type QRType = 'text' | 'wifi' | 'contact' | 'email' | 'location' | 'whatsapp';

export function QRTools({ accentColor, onBack, triggerAd }: QRToolsProps) {
  const [activeMode, setActiveMode] = useState<QRMode>('generate');
  const [qrType, setQrType] = useState<QRType>('text');
  const [qrHistory, setQrHistory] = useState<QRHistoryEntry[]>([]);
  
  // Generator Inputs
  const [textInput, setTextInput] = useState('https://ai.studio/build');
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState('password123');
  const [wifiSec, setWifiSec] = useState('WPA');
  const [contactName, setContactName] = useState('John Doe');
  const [contactPhone, setContactPhone] = useState('+1234567890');
  const [contactEmail, setContactEmail] = useState('john@example.com');
  const [emailTo, setEmailTo] = useState('support@company.com');
  const [emailSub, setEmailSub] = useState('Smart Utility Inquiry');
  const [locationLat, setLocationLat] = useState('37.7749');
  const [locationLng, setLocationLng] = useState('-122.4194');
  const [waPhone, setWaPhone] = useState('+15550199');
  const [waMsg, setWaMsg] = useState('Hello from Smart Utility Pro!');

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [rawQrValue, setRawQrValue] = useState('');

  // Scanner states
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    // Load local history on mount
    const saved = localStorage.getItem('sup_qr_history');
    if (saved) {
      try {
        setQrHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    // Set initial default URL QR
    handleGenerate(false);
  }, []);

  const activeAccentClass = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    emerald: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    violet: 'bg-violet-600 hover:bg-violet-700 text-white',
    amber: 'bg-amber-600 hover:bg-amber-700 text-white',
    rose: 'bg-rose-600 hover:bg-rose-700 text-white',
    blue: 'bg-blue-600 hover:bg-blue-700 text-white',
  }[accentColor];

  const borderAccentClass = {
    indigo: 'border-indigo-500',
    emerald: 'border-emerald-500',
    violet: 'border-violet-500',
    amber: 'border-amber-500',
    rose: 'border-rose-500',
    blue: 'border-blue-500',
  }[accentColor];

  const handleGenerate = (saveToHistory = true) => {
    let payload = '';

    if (qrType === 'text') {
      payload = textInput;
    } else if (qrType === 'wifi') {
      payload = `WIFI:S:${wifiSsid};T:${wifiSec};P:${wifiPass};;`;
    } else if (qrType === 'contact') {
      payload = `BEGIN:VCARD\nFN:${contactName}\nTEL:${contactPhone}\nEMAIL:${contactEmail}\nEND:VCARD`;
    } else if (qrType === 'email') {
      payload = `mailto:${emailTo}?subject=${encodeURIComponent(emailSub)}`;
    } else if (qrType === 'location') {
      payload = `geo:${locationLat},${locationLng}`;
    } else if (qrType === 'whatsapp') {
      payload = `https://wa.me/${waPhone.replace(/\+/g, '')}?text=${encodeURIComponent(waMsg)}`;
    }

    setRawQrValue(payload);
    const size = '200x200';
    const finalUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(payload)}`;
    setGeneratedUrl(finalUrl);

    if (saveToHistory && payload.trim() !== '') {
      const newEntry: QRHistoryEntry = {
        id: Date.now().toString(),
        type: qrType,
        value: payload,
        timestamp: Date.now()
      };
      const updated = [newEntry, ...qrHistory];
      setQrHistory(updated);
      localStorage.setItem('sup_qr_history', JSON.stringify(updated));
    }
  };

  const deleteHistoryItem = (id: string) => {
    const updated = qrHistory.filter(item => item.id !== id);
    setQrHistory(updated);
    localStorage.setItem('sup_qr_history', JSON.stringify(updated));
  };

  const clearAllHistory = () => {
    setQrHistory([]);
    localStorage.removeItem('sup_qr_history');
  };

  const handleScanSimulation = () => {
    setIsScanning(true);
    setCameraActive(true);
    setScanResult(null);

    // Simulate standard camera scan timeout with a radar overlay
    setTimeout(() => {
      setCameraActive(false);
      setIsScanning(false);
      
      const presets = [
        "WIFI:S:OfficeRouter_5G;T:WPA;P:AccessKey2026;;",
        "https://ai.studio/build",
        "BEGIN:VCARD\nFN:Alice Smith\nTEL:+14155552671\nEMAIL:alice@studio.io\nEND:VCARD",
        "https://wa.me/15550199?text=Hello"
      ];
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      setScanResult(randomPreset);

      // Add scanned QR to history as well
      const newEntry: QRHistoryEntry = {
        id: Date.now().toString(),
        type: randomPreset.startsWith('WIFI') ? 'wifi' : randomPreset.startsWith('BEGIN') ? 'contact' : 'text',
        value: randomPreset,
        timestamp: Date.now()
      };
      const updated = [newEntry, ...qrHistory];
      setQrHistory(updated);
      localStorage.setItem('sup_qr_history', JSON.stringify(updated));

    }, 3000);
  };

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    alert("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="qr-tools-root">
      
      {/* App Bar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur" id="qr-header">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold font-display leading-tight">QR Barcode Studio</h1>
            <p className="text-xs text-slate-400">Generate & Scan Instant Nodes</p>
          </div>
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div className="grid grid-cols-3 bg-slate-950 border-b border-slate-850 p-1 text-center" id="qr-nav-tabs">
        {[
          { id: 'generate', label: 'Generate', icon: <QrCode size={14} /> },
          { id: 'scan', label: 'Scan Code', icon: <Camera size={14} /> },
          { id: 'history', label: 'History', icon: <History size={14} /> }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(mode.id as QRMode)}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeMode === mode.id 
                ? 'bg-slate-800 text-white shadow-xs' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          
          {/* GENERATE WORKSPACE */}
          {activeMode === 'generate' && (
            <motion.div
              key="gen-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Type Grid Select */}
              <div className="grid grid-cols-6 gap-1 bg-slate-950 p-1 rounded-xl" id="qr-types-selector">
                {[
                  { id: 'text', icon: <QrCode size={16} />, label: 'Text/URL' },
                  { id: 'wifi', icon: <Wifi size={16} />, label: 'Wi-Fi' },
                  { id: 'contact', icon: <Contact size={16} />, label: 'vCard' },
                  { id: 'email', icon: <Mail size={16} />, label: 'Email' },
                  { id: 'location', icon: <MapPin size={16} />, label: 'GPS' },
                  { id: 'whatsapp', icon: <MessageSquare size={16} />, label: 'WA' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setQrType(item.id as QRType); }}
                    className={`flex flex-col items-center justify-center py-2 rounded-lg text-[9px] font-semibold gap-1 transition-all cursor-pointer ${
                      qrType === item.id 
                        ? 'bg-slate-850 text-indigo-400' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                    <span className="truncate max-w-full px-0.5">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Input forms depending on type */}
              <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Payload Parameters</span>

                {qrType === 'text' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">Plain Text or Website URL</label>
                    <input 
                      type="text" 
                      value={textInput} 
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                )}

                {qrType === 'wifi' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">SSID Network Name</label>
                      <input 
                        type="text" 
                        value={wifiSsid} 
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">Security Password</label>
                      <input 
                        type="password" 
                        value={wifiPass} 
                        onChange={(e) => setWifiPass(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['WPA', 'WEP', 'nopass'].map((sec) => (
                        <button
                          key={sec}
                          onClick={() => setWifiSec(sec)}
                          className={`py-1 rounded-lg text-[9px] font-mono border ${
                            wifiSec === sec ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {sec.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {qrType === 'contact' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">Contact Name</label>
                      <input 
                        type="text" 
                        value={contactName} 
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Phone Number</label>
                        <input 
                          type="text" 
                          value={contactPhone} 
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-500 font-mono">Email Address</label>
                        <input 
                          type="email" 
                          value={contactEmail} 
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {qrType === 'email' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">Recipient Email</label>
                      <input 
                        type="email" 
                        value={emailTo} 
                        onChange={(e) => setEmailTo(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">Subject Title</label>
                      <input 
                        type="text" 
                        value={emailSub} 
                        onChange={(e) => setEmailSub(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}

                {qrType === 'location' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">Latitude</label>
                      <input 
                        type="text" 
                        value={locationLat} 
                        onChange={(e) => setLocationLat(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">Longitude</label>
                      <input 
                        type="text" 
                        value={locationLng} 
                        onChange={(e) => setLocationLng(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}

                {qrType === 'whatsapp' && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">WhatsApp Country + Phone</label>
                      <input 
                        type="text" 
                        value={waPhone} 
                        onChange={(e) => setWaPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 font-mono">Default Chat Message</label>
                      <input 
                        type="text" 
                        value={waMsg} 
                        onChange={(e) => setWaMsg(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* QR Render Canvas Frame */}
              {generatedUrl && (
                <div className="bg-slate-950 border border-slate-850 p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-white p-3 rounded-xl shadow-inner relative group">
                    <img 
                      src={generatedUrl} 
                      alt="Generated Barcode Node" 
                      className="w-44 h-44 object-contain" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">RAW METADATA</span>
                    <p className="text-xs text-slate-300 font-mono truncate max-w-[240px] px-2">{rawQrValue}</p>
                  </div>

                  <div className="flex gap-2 w-full max-w-[260px]">
                    <button
                      onClick={() => copyToClipboard(rawQrValue)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Copy</span>
                    </button>
                    <a
                      href={generatedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={`flex-1 py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 shadow-md shadow-indigo-600/10 cursor-pointer ${activeAccentClass}`}
                    >
                      <Download size={12} />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Action Trigger */}
              <button
                onClick={() => handleGenerate(true)}
                className={`w-full py-3.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer ${activeAccentClass}`}
              >
                <RefreshCw size={14} className="animate-spin-slow" />
                <span>Compile & Refresh QR Node</span>
              </button>

            </motion.div>
          )}

          {/* SCAN WORKSPACE */}
          {activeMode === 'scan' && (
            <motion.div
              key="scan-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Camera Frame Viewfinder simulator */}
              <div className="relative w-full aspect-square bg-black border-2 border-slate-800 rounded-3xl overflow-hidden flex flex-col items-center justify-between p-4">
                
                {/* Visual corners for scanner */}
                <div className={`absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 rounded-tl-md ${borderAccentClass}`} />
                <div className={`absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 rounded-tr-md ${borderAccentClass}`} />
                <div className={`absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 rounded-bl-md ${borderAccentClass}`} />
                <div className={`absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 rounded-br-md ${borderAccentClass}`} />

                <div className="flex justify-between items-center w-full z-10">
                  <span className="text-[9px] uppercase font-bold bg-rose-500 text-white px-1.5 py-0.5 rounded tracking-wider animate-pulse">Live Lens</span>
                  <span className="text-xs text-neutral-400 font-mono">Scan frame bounds</span>
                </div>

                {cameraActive ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {/* Animated laser line */}
                    <motion.div 
                      className={`absolute left-4 right-4 h-0.5 bg-indigo-500 shadow-lg shadow-indigo-500/50 z-20`}
                      initial={{ top: '10%' }}
                      animate={{ top: '90%' }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    />
                    <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider animate-pulse">Aligning Matrix coordinates...</div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <Camera size={44} className="text-slate-600" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300">Camera Viewfinder Idle</h4>
                      <p className="text-[10px] text-slate-500 mt-1">Activate high-resolution system camera streams or drop barcode photos</p>
                    </div>
                  </div>
                )}

                <div className="z-10 w-full flex justify-center pb-2">
                  {!cameraActive && (
                    <button
                      onClick={handleScanSimulation}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold shadow-lg hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera size={14} />
                      <span>Start Camera Stream</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Scan Results Display */}
              {scanResult && (
                <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Decoded Node Data</span>
                    <span className="text-[10px] font-semibold text-emerald-400 font-mono">✓ Success</span>
                  </div>
                  
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 font-mono text-xs text-slate-300 break-all select-all">
                    {scanResult}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(scanResult)}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Copy size={12} />
                      <span>Copy Value</span>
                    </button>
                    {scanResult.startsWith('http') && (
                      <a
                        href={scanResult}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink size={12} />
                        <span>Navigate URL</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          )}

          {/* HISTORY WORKSPACE */}
          {activeMode === 'history' && (
            <motion.div
              key="history-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-semibold text-slate-400 uppercase">Activity Logs</span>
                {qrHistory.length > 0 && (
                  <button 
                    onClick={clearAllHistory}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                  >
                    <Trash size={12} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {qrHistory.length === 0 ? (
                <div className="text-center py-10 bg-slate-800/10 border border-slate-800/50 rounded-2xl p-6">
                  <QrCode size={36} className="text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No saved QR actions yet</p>
                  <p className="text-[10px] text-slate-500 mt-1">Generated and scanned nodes appear here for quick access offline.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {qrHistory.map((item) => (
                    <div 
                      key={item.id} 
                      className="p-3 bg-slate-800/40 border border-slate-800/50 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/10 px-1.5 rounded">
                            {item.type}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 font-mono truncate">{item.value}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => copyToClipboard(item.value)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                          title="Copy text"
                        >
                          <Copy size={12} />
                        </button>
                        <button 
                          onClick={() => deleteHistoryItem(item.id)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete entry"
                        >
                          <Trash size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
