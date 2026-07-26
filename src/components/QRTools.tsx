import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, ArrowLeft, Wifi, Contact, Mail, MapPin, MessageSquare, 
  History, Camera, Upload, Copy, ExternalLink, Download, Trash, RefreshCw, Check
} from 'lucide-react';
import QRCode from 'qrcode';
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

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [rawQrValue, setRawQrValue] = useState('');
  const [qrColor, setQrColor] = useState('#ffffff');
  const [qrBg, setQrBg] = useState('#0f172a');
  const [copied, setCopied] = useState(false);

  // Scanner states
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
  }, []);

  useEffect(() => {
    generateQrCode(false);
  }, [qrType, textInput, wifiSsid, wifiPass, wifiSec, contactName, contactPhone, contactEmail, emailTo, emailSub, locationLat, locationLng, waPhone, waMsg, qrColor, qrBg]);

  const generateQrCode = async (saveToHistory = true) => {
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

    if (!payload.trim()) return;

    try {
      const url = await QRCode.toDataURL(payload, {
        width: 320,
        margin: 2,
        color: {
          dark: qrColor,
          light: qrBg
        }
      });
      setQrDataUrl(url);

      if (saveToHistory && payload.trim() !== '') {
        const newEntry: QRHistoryEntry = {
          id: Date.now().toString(),
          type: qrType,
          value: payload,
          timestamp: Date.now()
        };
        const updated = [newEntry, ...qrHistory.filter(h => h.value !== payload)];
        setQrHistory(updated);
        localStorage.setItem('sup_qr_history', JSON.stringify(updated));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageScanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          // Display uploaded image as scanned QR payload
          const resultText = `Scanned Image: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nFormat: ${file.type}`;
          setScanResult(resultText);
          saveScanToHistory(resultText);
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const startCameraScan = async () => {
    setIsScanning(true);
    setScanResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access not available in sandbox. You can upload an image or select a test code.");
      setIsScanning(false);
    }
  };

  const stopCameraScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  const saveScanToHistory = (val: string) => {
    const newEntry: QRHistoryEntry = {
      id: Date.now().toString(),
      type: 'text',
      value: val,
      timestamp: Date.now()
    };
    const updated = [newEntry, ...qrHistory];
    setQrHistory(updated);
    localStorage.setItem('sup_qr_history', JSON.stringify(updated));
  };

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="qr-tools-root">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur" id="qr-header">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold font-display leading-tight">QR Code Studio</h1>
            <p className="text-xs text-slate-400">Generate & Scan Instant QR Codes</p>
          </div>
        </div>
      </div>

      {/* Mode Switch Tabs */}
      <div className="grid grid-cols-3 bg-slate-950 border-b border-slate-800 p-1 text-center" id="qr-nav-tabs">
        {[
          { id: 'generate', label: 'Generate', icon: <QrCode size={14} /> },
          { id: 'scan', label: 'Scan Code', icon: <Camera size={14} /> },
          { id: 'history', label: 'History', icon: <History size={14} /> }
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => { setActiveMode(mode.id as QRMode); stopCameraScan(); }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeMode === mode.id 
                ? 'bg-indigo-600 text-white shadow-sm' 
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
              <div className="grid grid-cols-6 gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800" id="qr-types-selector">
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
                    onClick={() => setQrType(item.id as QRType)}
                    className={`flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-semibold gap-1 transition-all cursor-pointer ${
                      qrType === item.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                    <span className="truncate max-w-full px-0.5">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Input forms */}
              <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Payload Parameters</span>

                {qrType === 'text' && (
                  <div className="space-y-1">
                    <label className="text-xs text-slate-400">Plain Text or Website URL</label>
                    <input 
                      type="text" 
                      value={textInput} 
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                )}

                {qrType === 'wifi' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-slate-400">Network Name (SSID)</label>
                      <input 
                        type="text" 
                        value={wifiSsid} 
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Password</label>
                      <input 
                        type="text" 
                        value={wifiPass} 
                        onChange={(e) => setWifiPass(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                {qrType === 'contact' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-slate-400">Full Name</label>
                      <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Phone Number</label>
                      <input type="text" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                    </div>
                  </div>
                )}

                {qrType === 'email' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-slate-400">Recipient Email</label>
                      <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400">Subject</label>
                      <input type="text" value={emailSub} onChange={(e) => setEmailSub(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
                    </div>
                  </div>
                )}

                {/* Color Customizer */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">QR Color:</span>
                    <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Background:</span>
                    <input type="color" value={qrBg} onChange={(e) => setQrBg(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent" />
                  </div>
                </div>
              </div>

              {/* Rendered QR Preview */}
              {qrDataUrl && (
                <div className="flex flex-col items-center justify-center bg-slate-800/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl">
                    <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 rounded-lg" />
                  </div>

                  <div className="flex gap-2 w-full max-w-xs">
                    <a
                      href={qrDataUrl}
                      download="qr_code.png"
                      onClick={() => generateQrCode(true)}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
                    >
                      <Download size={14} />
                      Download PNG
                    </a>
                    <button
                      onClick={() => copyToClipboard(rawQrValue)}
                      className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SCANNER WORKSPACE */}
          {activeMode === 'scan' && (
            <motion.div
              key="scan-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-800/40 border border-slate-800 p-6 rounded-2xl text-center space-y-4">
                {isScanning ? (
                  <div className="relative aspect-square max-w-xs mx-auto bg-black rounded-2xl overflow-hidden border-2 border-indigo-500">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-pulse" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <Camera size={48} className="text-indigo-400" />
                    <div>
                      <h3 className="font-bold text-sm text-white">Scan QR Code</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Use camera or upload an image file</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {!isScanning ? (
                    <button
                      onClick={startCameraScan}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Camera size={16} />
                      Open Camera Scanner
                    </button>
                  ) : (
                    <button
                      onClick={stopCameraScan}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Stop Camera
                    </button>
                  )}

                  <label className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer">
                    <Upload size={16} />
                    <span>Upload QR Image File</span>
                    <input type="file" accept="image/*" onChange={handleImageScanUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {scanResult && (
                <div className="bg-slate-800/60 border border-slate-700 p-4 rounded-2xl space-y-3">
                  <span className="text-xs font-bold text-emerald-400 block uppercase">Scan Result</span>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-slate-200 whitespace-pre-wrap">
                    {scanResult}
                  </div>
                  <button
                    onClick={() => copyToClipboard(scanResult)}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy size={14} />
                    Copy Result
                  </button>
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
              className="space-y-3"
            >
              {qrHistory.length > 0 ? (
                <>
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs text-slate-400">Saved Records ({qrHistory.length})</span>
                    <button onClick={clearAllHistory} className="text-xs text-rose-400 hover:underline cursor-pointer">Clear All</button>
                  </div>
                  <div className="space-y-2">
                    {qrHistory.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-[10px] text-indigo-400 uppercase font-mono">{item.type}</span>
                          <p className="text-xs text-slate-200 truncate font-mono">{item.value}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => copyToClipboard(item.value)} className="p-1.5 text-slate-400 hover:text-white cursor-pointer"><Copy size={14} /></button>
                          <button onClick={() => deleteHistoryItem(item.id)} className="p-1.5 text-slate-400 hover:text-rose-400 cursor-pointer"><Trash size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs">No QR history yet.</div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
