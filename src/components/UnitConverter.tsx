import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Ruler, Scale, Thermometer, Map, HelpCircle, 
  Wind, Gauge, Zap, Clock, Database, RefreshCw, ArrowRightLeft
} from 'lucide-react';
import { AccentColor } from '../types';

interface UnitConverterProps {
  accentColor: AccentColor;
  onBack: () => void;
}

type ConvertCategory = 'length' | 'weight' | 'temperature' | 'area' | 'volume' | 'speed' | 'pressure' | 'fuel' | 'time' | 'storage';

export function UnitConverter({ accentColor, onBack }: UnitConverterProps) {
  const [activeCategory, setActiveCategory] = useState<ConvertCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [outputValue, setOutputValue] = useState<string>('0');

  const activeAccentClass = {
    indigo: 'bg-indigo-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    violet: 'bg-violet-600 text-white',
    amber: 'bg-amber-600 text-white',
    rose: 'bg-rose-600 text-white',
    blue: 'bg-blue-600 text-white',
  }[accentColor];

  // Comprehensive Units metadata and baseline-multiplier scale ratios (Base units marked as 1.0)
  const categories: Record<ConvertCategory, {
    label: string;
    icon: React.ReactNode;
    base: string;
    units: Record<string, { label: string; ratio: number }>; // ratio * unit = base
  }> = {
    length: {
      label: 'Length',
      icon: <Ruler size={14} />,
      base: 'm',
      units: {
        mm: { label: 'Millimeters (mm)', ratio: 0.001 },
        cm: { label: 'Centimeters (cm)', ratio: 0.01 },
        m: { label: 'Meters (m)', ratio: 1.0 },
        km: { label: 'Kilometers (km)', ratio: 1000.0 },
        in: { label: 'Inches (in)', ratio: 0.0254 },
        ft: { label: 'Feet (ft)', ratio: 0.3048 },
        yd: { label: 'Yards (yd)', ratio: 0.9144 },
        mi: { label: 'Miles (mi)', ratio: 1609.344 }
      }
    },
    weight: {
      label: 'Weight',
      icon: <Scale size={14} />,
      base: 'kg',
      units: {
        mg: { label: 'Milligrams (mg)', ratio: 1e-6 },
        g: { label: 'Grams (g)', ratio: 0.001 },
        kg: { label: 'Kilograms (kg)', ratio: 1.0 },
        oz: { label: 'Ounces (oz)', ratio: 0.0283495 },
        lb: { label: 'Pounds (lb)', ratio: 0.453592 },
        ton: { label: 'Metric Tons (t)', ratio: 1000.0 }
      }
    },
    temperature: {
      label: 'Temperature',
      icon: <Thermometer size={14} />,
      base: 'C',
      units: {
        C: { label: 'Celsius (°C)', ratio: 1.0 },
        F: { label: 'Fahrenheit (°F)', ratio: 1.0 }, // Handled with special math formulas
        K: { label: 'Kelvin (K)', ratio: 1.0 }       // Handled with special math formulas
      }
    },
    area: {
      label: 'Area',
      icon: <Map size={14} />,
      base: 'sq_m',
      units: {
        sq_cm: { label: 'Sq. Centimeters', ratio: 0.0001 },
        sq_m: { label: 'Sq. Meters (m²)', ratio: 1.0 },
        sq_km: { label: 'Sq. Kilometers (km²)', ratio: 1000000.0 },
        sq_in: { label: 'Sq. Inches', ratio: 0.00064516 },
        sq_ft: { label: 'Sq. Feet (ft²)', ratio: 0.092903 },
        acre: { label: 'Acres (ac)', ratio: 4046.856 },
        hectare: { label: 'Hectares (ha)', ratio: 10000.0 }
      }
    },
    volume: {
      label: 'Volume',
      icon: <HelpCircle size={14} />,
      base: 'l',
      units: {
        ml: { label: 'Milliliters (ml)', ratio: 0.001 },
        l: { label: 'Liters (l)', ratio: 1.0 },
        cup: { label: 'Metric Cups', ratio: 0.25 },
        pt: { label: 'Pints (pt)', ratio: 0.473176 },
        qt: { label: 'Quarts (qt)', ratio: 0.946353 },
        gal: { label: 'Gallons (US gal)', ratio: 3.78541 },
        fl_oz: { label: 'Fluid Ounces (fl oz)', ratio: 0.0295735 }
      }
    },
    speed: {
      label: 'Speed',
      icon: <Wind size={14} />,
      base: 'm_s',
      units: {
        m_s: { label: 'Meters / Sec (m/s)', ratio: 1.0 },
        km_h: { label: 'Kilometers / Hour (km/h)', ratio: 0.277778 },
        mph: { label: 'Miles / Hour (mph)', ratio: 0.44704 },
        knot: { label: 'Knots (kt)', ratio: 0.514444 }
      }
    },
    pressure: {
      label: 'Pressure',
      icon: <Gauge size={14} />,
      base: 'pa',
      units: {
        pa: { label: 'Pascals (Pa)', ratio: 1.0 },
        kpa: { label: 'KiloPascals (kPa)', ratio: 1000.0 },
        bar: { label: 'Bar (bar)', ratio: 100000.0 },
        psi: { label: 'PSI (lbs/sq_in)', ratio: 6894.76 },
        atm: { label: 'Atmospheres (atm)', ratio: 101325.0 }
      }
    },
    fuel: {
      label: 'Fuel Economy',
      icon: <Zap size={14} />,
      base: 'mpg',
      units: {
        mpg: { label: 'Miles per Gallon (mpg)', ratio: 1.0 },
        lp100km: { label: 'Liters / 100km (L/100km)', ratio: 1.0 } // Special inverse ratio math
      }
    },
    time: {
      label: 'Time',
      icon: <Clock size={14} />,
      base: 'sec',
      units: {
        ms: { label: 'Milliseconds (ms)', ratio: 0.001 },
        sec: { label: 'Seconds (s)', ratio: 1.0 },
        min: { label: 'Minutes (min)', ratio: 60.0 },
        hr: { label: 'Hours (h)', ratio: 3600.0 },
        day: { label: 'Days (d)', ratio: 86400.0 },
        week: { label: 'Weeks (wk)', ratio: 604800.0 },
        month: { label: 'Months (mo - 30d)', ratio: 2592000.0 },
        year: { label: 'Years (yr - 365d)', ratio: 31536000.0 }
      }
    },
    storage: {
      label: 'Storage',
      icon: <Database size={14} />,
      base: 'b',
      units: {
        b: { label: 'Bytes (B)', ratio: 1.0 },
        kb: { label: 'Kilobytes (KB)', ratio: 1024.0 },
        mb: { label: 'Megabytes (MB)', ratio: 1048576.0 },
        gb: { label: 'Gigabytes (GB)', ratio: 1073741824.0 },
        tb: { label: 'Terabytes (TB)', ratio: 1099511627776.0 },
        pb: { label: 'Petabytes (PB)', ratio: 1125899906842624.0 }
      }
    }
  };

  // Set default units when changing categories
  useEffect(() => {
    const keys = Object.keys(categories[activeCategory].units);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  }, [activeCategory]);

  // Compute conversion dynamically
  useEffect(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setOutputValue('0');
      return;
    }

    if (fromUnit === toUnit) {
      setOutputValue(String(val));
      return;
    }

    // Special Temperature Formula
    if (activeCategory === 'temperature') {
      let baseC = val;
      if (fromUnit === 'F') baseC = (val - 32) * 5/9;
      else if (fromUnit === 'K') baseC = val - 273.15;

      let targetVal = baseC;
      if (toUnit === 'F') targetVal = (baseC * 9/5) + 32;
      else if (toUnit === 'K') targetVal = baseC + 273.15;

      setOutputValue(Number(targetVal.toFixed(6)).toString());
      return;
    }

    // Special Fuel Inverse math
    if (activeCategory === 'fuel') {
      if (fromUnit === 'mpg' && toUnit === 'lp100km') {
        setOutputValue(val > 0 ? (235.215 / val).toFixed(4) : '0');
      } else if (fromUnit === 'lp100km' && toUnit === 'mpg') {
        setOutputValue(val > 0 ? (235.215 / val).toFixed(4) : '0');
      }
      return;
    }

    const currentCat = categories[activeCategory];
    const fromRatio = currentCat.units[fromUnit]?.ratio || 1.0;
    const toRatio = currentCat.units[toUnit]?.ratio || 1.0;

    // Convert input value to base unit first, then divide by target ratio
    const baseValue = val * fromRatio;
    const finalValue = baseValue / toRatio;

    // Remove training decimals cleanly
    setOutputValue(Number(finalValue.toFixed(8)).toString());

  }, [inputValue, fromUnit, toUnit, activeCategory]);

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="unit-converter-root">
      
      {/* Navigation App Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="unit-header">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">Universal Converter</h1>
          <p className="text-xs text-slate-400">10 Standard Mathematical Dimensions</p>
        </div>
      </div>

      {/* Categories horizontal list */}
      <div className="flex gap-1.5 overflow-x-auto px-4 py-2 bg-slate-950 border-b border-slate-850" id="unit-categories-list">
        {Object.entries(categories).map(([key, data]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key as ConvertCategory)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === key 
                ? 'bg-slate-800 text-white border border-slate-700' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {data.icon}
            <span>{data.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            {/* Input card */}
            <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">Source Parameter</span>
              
              <div className="space-y-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-lg font-mono font-bold focus:outline-none focus:border-indigo-500 text-indigo-400"
                />
                
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                >
                  {Object.entries(categories[activeCategory].units as any).map(([uKey, data]: any) => (
                    <option key={uKey} value={uKey}>{data.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap visual line button */}
            <div className="flex justify-center -my-1.5 relative z-10">
              <button
                onClick={handleSwapUnits}
                className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-600 rounded-full text-indigo-400 shadow-md transition-colors hover:scale-105 cursor-pointer"
              >
                <ArrowRightLeft size={16} className="rotate-90" />
              </button>
            </div>

            {/* Target Output card */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-3 shadow-inner">
              <span className="text-xs font-semibold text-slate-500 uppercase font-mono tracking-wider">Target Conversion</span>
              
              <div className="space-y-2">
                <div className="w-full bg-slate-900/50 border border-slate-900 rounded-xl px-4 py-3 text-lg font-mono font-bold text-emerald-400 select-all truncate">
                  {outputValue}
                </div>

                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                >
                  {Object.entries(categories[activeCategory].units as any).map(([uKey, data]: any) => (
                    <option key={uKey} value={uKey}>{data.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Interactive Grid conversions cheatsheet for the dimensions */}
            <div className="bg-slate-800/20 border border-slate-800 p-4 rounded-2xl space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Scale References</span>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                {Object.entries(categories[activeCategory].units as any)
                  .filter(([k]: any) => k !== categories[activeCategory].base)
                  .slice(0, 4)
                  .map(([uKey, data]: any) => (
                    <div key={uKey} className="bg-slate-950/40 p-2 rounded-lg border border-slate-850">
                      <span>1 {uKey} = {Number((data.ratio / ((categories[activeCategory].units as any)[toUnit]?.ratio || 1)).toFixed(6))} {toUnit}</span>
                    </div>
                  ))}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
