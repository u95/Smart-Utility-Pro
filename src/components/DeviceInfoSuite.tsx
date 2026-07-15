import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, ArrowLeft, Cpu, HardDrive, Smartphone, Battery, 
  Activity, Compass, ShieldAlert, Sliders, CheckCircle2
} from 'lucide-react';
import { AccentColor } from '../types';

interface DeviceInfoSuiteProps {
  accentColor: AccentColor;
  onBack: () => void;
}

export function DeviceInfoSuite({ accentColor, onBack }: DeviceInfoSuiteProps) {
  // Live CPU core speeds simulation
  const [cpuCores, setCpuCores] = useState<number[]>([35, 42, 18, 55, 62, 28, 44, 51]);
  // Live Accelerometer telemetry simulation
  const [accelX, setAccelX] = useState(0.02);
  const [accelY, setAccelY] = useState(-0.11);
  const [accelZ, setAccelZ] = useState(9.81);

  useEffect(() => {
    // Tick CPU cores and wiggle sensor lines
    const timer = setInterval(() => {
      setCpuCores(prev => prev.map(core => {
        const delta = Math.floor(Math.random() * 20 - 10);
        return Math.max(5, Math.min(98, core + delta));
      }));

      setAccelX(Number((Math.random() * 0.1 - 0.05).toFixed(3)));
      setAccelY(Number((Math.random() * 0.1 - 0.05 - 0.1).toFixed(3)));
      setAccelZ(Number((9.8 + Math.random() * 0.06).toFixed(3)));
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  const activeAccentClass = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    violet: 'bg-violet-600',
    amber: 'bg-amber-600',
    rose: 'bg-rose-600',
    blue: 'bg-blue-600',
  }[accentColor];

  const textAccentClass = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    violet: 'text-violet-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400',
    blue: 'text-blue-400',
  }[accentColor];

  const barAccentClass = {
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
  }[accentColor];

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="device-info-root">
      
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="devinfo-header">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">Device Diagnostics</h1>
          <p className="text-xs text-slate-400">Live hardware telemetry logs</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* CORE DEVICE SPECIFICATIONS */}
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-3xl space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-1 text-slate-300">
            <Smartphone size={14} className={textAccentClass} />
            <span className="text-xs font-semibold uppercase tracking-wider">Device Profiles</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {[
              { l: 'System OS Model', v: 'Android Utility Pro VM' },
              { l: 'OS Release Name', v: 'Android 14 (Upside Down Cake)' },
              { l: 'API Level Target', v: 'Level 34' },
              { l: 'Kernel Core Version', v: '6.1.25-android-goldfish' },
              { l: 'Hardware Model', v: 'Smart_System_x86_64' },
              { l: 'Secure Boot Status', v: 'Enabled (Verified Boot)' }
            ].map((spec, i) => (
              <div key={i} className="bg-slate-950 p-2.5 border border-slate-850 rounded-xl">
                <span className="text-[9px] text-slate-500 uppercase font-bold">{spec.l}</span>
                <span className="text-slate-300 font-semibold block mt-0.5 truncate">{spec.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE LIVE CPU ACTIVITY METERS */}
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-3xl space-y-3.5 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Cpu size={14} className={textAccentClass} />
              <span className="text-xs font-semibold uppercase tracking-wider">CPU Processor Core Speeds</span>
            </div>
            <span className="text-[10px] text-indigo-400 font-bold font-mono">Octa-Core 2.84 GHz</span>
          </div>

          {/* Core grid usage meters */}
          <div className="grid grid-cols-2 gap-3">
            {cpuCores.map((usage, index) => (
              <div key={index} className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between text-slate-400">
                  <span>Core #{index + 1}</span>
                  <span className="font-bold">{usage}%</span>
                </div>
                <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                  <motion.div 
                    className={`h-full ${barAccentClass} rounded-full`}
                    animate={{ width: `${usage}%` }}
                    transition={{ ease: 'easeOut', duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STORAGE & RAM CODES */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* MEMORY / RAM card */}
          <div className="bg-slate-800/30 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest block">System RAM memory</span>
            <div className="py-2.5">
              <span className="text-2xl font-black font-display text-emerald-400">5.12 GB</span>
              <span className="text-[10px] text-slate-400 block font-mono">Of 8.00 GB Available</span>
            </div>
            <div className="h-1.5 bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-3/4 rounded-full" />
            </div>
          </div>

          {/* STORAGE card */}
          <div className="bg-slate-800/30 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] text-slate-500 font-mono uppercase font-bold tracking-widest block">Secure Storage</span>
            <div className="py-2.5">
              <span className="text-2xl font-black font-display text-indigo-400">128 GB</span>
              <span className="text-[10px] text-slate-400 block font-mono">Of 256 GB Available</span>
            </div>
            <div className="h-1.5 bg-slate-950 border border-slate-850 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-2/4 rounded-full" />
            </div>
          </div>

        </div>

        {/* BATTERY HEALTH TELEMETRY */}
        <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-3xl space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 mb-1 text-slate-300">
            <Battery size={14} className={textAccentClass} />
            <span className="text-xs font-semibold uppercase tracking-wider">Battery Diagnostics</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-950 p-2 border border-slate-850 rounded-xl flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Charge Percent</span>
              <span className="text-emerald-400 font-bold block mt-0.5">85% (Charging)</span>
            </div>
            <div className="bg-slate-950 p-2 border border-slate-850 rounded-xl flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Health Condition</span>
              <span className="text-emerald-400 font-bold block mt-0.5">Excellent (98%)</span>
            </div>
            <div className="bg-slate-950 p-2 border border-slate-850 rounded-xl flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Core Temperature</span>
              <span className="text-slate-300 block mt-0.5">34.2 °C (93.5 °F)</span>
            </div>
            <div className="bg-slate-950 p-2 border border-slate-850 rounded-xl flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase font-bold">Voltage Stream</span>
              <span className="text-slate-300 block mt-0.5">4.28 Volts</span>
            </div>
          </div>
        </div>

        {/* ONBOARD SENSORS TRACKER */}
        <div className="bg-slate-950 border border-slate-850 p-4 rounded-3xl space-y-3.5 shadow-inner">
          <div className="flex items-center gap-1.5 border-b border-slate-850 pb-2 mb-1 text-slate-300">
            <Compass size={14} className={textAccentClass} />
            <span className="text-xs font-semibold uppercase tracking-wider">Dynamic Physical Sensors</span>
          </div>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-2">
              <span className="text-xs font-bold text-slate-300">3-Axis Accelerometer</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-1.5 bg-slate-950 rounded-lg">
                  <span className="text-[9px] text-slate-500 block">X Axis</span>
                  <span className="text-indigo-400 font-bold">{accelX} m/s²</span>
                </div>
                <div className="p-1.5 bg-slate-950 rounded-lg">
                  <span className="text-[9px] text-slate-500 block">Y Axis</span>
                  <span className="text-indigo-400 font-bold">{accelY} m/s²</span>
                </div>
                <div className="p-1.5 bg-slate-950 rounded-lg">
                  <span className="text-[9px] text-slate-500 block">Z Axis</span>
                  <span className="text-indigo-400 font-bold">{accelZ} m/s²</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-xl flex flex-col justify-center">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Magnetometer</span>
                <span className="text-slate-300 font-semibold block mt-0.5">48.2 μT (MicroTesla)</span>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-xl flex flex-col justify-center">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Ambient Light</span>
                <span className="text-slate-300 font-semibold block mt-0.5">144 Lux (Clear indoor)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
