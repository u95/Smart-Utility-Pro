import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calculator, ArrowLeft, Percent, Heart, Calendar, DollarSign, 
  HelpCircle, Activity, Landmark, ShieldCheck, Scale, Globe
} from 'lucide-react';
import { AccentColor } from '../types';

interface CalculatorSuiteProps {
  accentColor: AccentColor;
  onBack: () => void;
  triggerAd: (onComplete: () => void) => void;
}

type CalcMode = 'standard' | 'scientific' | 'gst' | 'emi' | 'age' | 'bmi' | 'percentage' | 'discount' | 'currency';

export function CalculatorSuite({ accentColor, onBack, triggerAd }: CalculatorSuiteProps) {
  const [activeMode, setActiveMode] = useState<CalcMode>('standard');

  // STANDARD / SCIENTIFIC STATES
  const [display, setDisplay] = useState('0');
  const [formula, setFormula] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  // GST STATES
  const [gstAmount, setGstAmount] = useState('1000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  // EMI STATES
  const [emiPrincipal, setEmiPrincipal] = useState('100000');
  const [emiInterest, setEmiInterest] = useState('8.5');
  const [emiTenure, setEmiTenure] = useState('5'); // Years

  // AGE STATES
  const [birthdate, setBirthdate] = useState('2000-01-01');

  // BMI STATES
  const [bmiWeight, setBmiWeight] = useState('70'); // kg
  const [bmiHeight, setBmiHeight] = useState('175'); // cm

  // PERCENTAGE STATES
  const [pctX, setPctX] = useState('15');
  const [pctY, setPctY] = useState('250');

  // DISCOUNT STATES
  const [discPrice, setDiscPrice] = useState('150');
  const [discPercent, setDiscPercent] = useState('20');
  const [discTax, setDiscTax] = useState('8.5');

  // CURRENCY STATES
  const [currAmount, setCurrAmount] = useState('100');
  const [currFrom, setCurrFrom] = useState('USD');
  const [currTo, setCurrTo] = useState('EUR');

  const exchangeRates: Record<string, number> = {
    USD: 1.0,
    EUR: 0.92,
    GBP: 0.78,
    INR: 83.5,
    JPY: 157.8,
    CAD: 1.36,
    AUD: 1.49
  };

  const activeAccentClass = {
    indigo: 'bg-indigo-600 text-white',
    emerald: 'bg-emerald-600 text-white',
    violet: 'bg-violet-600 text-white',
    amber: 'bg-amber-600 text-white',
    rose: 'bg-rose-600 text-white',
    blue: 'bg-blue-600 text-white',
  }[accentColor];

  const buttonAccentClass = {
    indigo: 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20',
    violet: 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20',
    amber: 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20',
    blue: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20',
  }[accentColor];

  // MATH HANDLERS
  const handleKey = (key: string) => {
    if (isFinished) {
      setDisplay(key);
      setFormula('');
      setIsFinished(false);
      return;
    }

    if (display === '0' && !['+', '-', '*', '/', '%', '.'].includes(key)) {
      setDisplay(key);
    } else {
      setDisplay(prev => prev + key);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setFormula('');
    setIsFinished(false);
  };

  const handleBackspace = () => {
    if (display.length <= 1) {
      setDisplay('0');
    } else {
      setDisplay(prev => prev.slice(0, -1));
    }
  };

  const handleOperator = (op: string) => {
    setFormula(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleEvaluate = () => {
    if (!formula) return;
    try {
      const expression = formula + display;
      // Secure safe calculation evaluating only arithmetic characters
      if (/[^-+/*0-9.%\s]/g.test(expression)) {
        throw new Error("Invalid Input");
      }
      const evalResult = Function(`"use strict"; return (${expression})`)();
      setDisplay(String(Number(evalResult.toFixed(8))));
      setFormula('');
      setIsFinished(true);
    } catch (e) {
      setDisplay('Error');
      setFormula('');
      setIsFinished(true);
    }
  };

  const handleScientificOp = (op: string) => {
    try {
      const val = parseFloat(display);
      let res = 0;
      if (op === 'sin') res = Math.sin((val * Math.PI) / 180);
      else if (op === 'cos') res = Math.cos((val * Math.PI) / 180);
      else if (op === 'tan') res = Math.tan((val * Math.PI) / 180);
      else if (op === 'ln') res = Math.log(val);
      else if (op === 'log') res = Math.log10(val);
      else if (op === 'sqrt') res = Math.sqrt(val);
      else if (op === 'sqr') res = Math.pow(val, 2);
      
      setDisplay(String(Number(res.toFixed(8))));
      setIsFinished(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  // GST CALCULATIONS
  const netAmt = parseFloat(gstAmount) || 0;
  let gstTax = 0;
  let gstTotal = 0;
  if (gstType === 'exclusive') {
    gstTax = (netAmt * gstRate) / 100;
    gstTotal = netAmt + gstTax;
  } else {
    gstTotal = netAmt;
    gstTax = netAmt - (netAmt * (100 / (100 + gstRate)));
  }
  const cgst = gstTax / 2;
  const sgst = gstTax / 2;

  // EMI CALCULATIONS
  const p = parseFloat(emiPrincipal) || 0;
  const r = (parseFloat(emiInterest) || 0) / 12 / 100;
  const n = (parseFloat(emiTenure) || 0) * 12;
  let emiMonthly = 0;
  let emiTotalPayable = 0;
  let emiTotalInterest = 0;
  if (p && r && n) {
    emiMonthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    emiTotalPayable = emiMonthly * n;
    emiTotalInterest = emiTotalPayable - p;
  }

  // AGE CALCULATIONS
  const getAgeResults = () => {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    const now = new Date();
    
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Next Birthday countdown
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday.setFullYear(now.getFullYear() + 1);
    }
    const diffTime = nextBday.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { years, months, days, countdown: diffDays };
  };
  const ageResult = getAgeResults();

  // BMI CALCULATIONS
  const weight = parseFloat(bmiWeight) || 0;
  const heightMeters = (parseFloat(bmiHeight) || 0) / 100;
  let bmiScore = 0;
  let bmiCategory = 'Underweight';
  let bmiColor = 'text-blue-400';
  if (weight && heightMeters) {
    bmiScore = weight / (heightMeters * heightMeters);
    if (bmiScore < 18.5) { bmiCategory = 'Underweight'; bmiColor = 'text-blue-400'; }
    else if (bmiScore < 24.9) { bmiCategory = 'Healthy Normal'; bmiColor = 'text-emerald-400'; }
    else if (bmiScore < 29.9) { bmiCategory = 'Overweight'; bmiColor = 'text-amber-400'; }
    else { bmiCategory = 'Obese'; bmiColor = 'text-rose-400'; }
  }

  // DISCOUNT CALCULATIONS
  const prc = parseFloat(discPrice) || 0;
  const dsc = parseFloat(discPercent) || 0;
  const tx = parseFloat(discTax) || 0;
  const totalSaved = (prc * dsc) / 100;
  const discountedPrice = prc - totalSaved;
  const taxAmount = (discountedPrice * tx) / 100;
  const finalPrice = discountedPrice + taxAmount;

  // CURRENCY CONVERSION
  const currencyConvert = () => {
    const amt = parseFloat(currAmount) || 0;
    const rateFrom = exchangeRates[currFrom];
    const rateTo = exchangeRates[currTo];
    if (!amt || !rateFrom || !rateTo) return '0.00';
    // Convert to USD base first, then convert to target
    const usdVal = amt / rateFrom;
    return (usdVal * rateTo).toFixed(2);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white font-sans overflow-hidden" id="calculator-root">
      
      {/* Dynamic Navigation Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-20" id="calc-header">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold font-display leading-tight">Calculator Studio</h1>
          <p className="text-xs text-slate-400">9 Advanced High-Precision Workspaces</p>
        </div>
      </div>

      {/* Calculator Mode Tabs (Horizontally Scrollable) */}
      <div className="flex gap-1.5 overflow-x-auto px-4 py-2 bg-slate-950 border-b border-slate-850" id="calc-tab-scroller">
        {[
          { id: 'standard', label: 'Standard', icon: <Calculator size={14} /> },
          { id: 'scientific', label: 'Scientific', icon: <Landmark size={14} /> },
          { id: 'gst', label: 'GST Calculator', icon: <Landmark size={14} /> },
          { id: 'emi', label: 'EMI Loan', icon: <Landmark size={14} /> },
          { id: 'age', label: 'Age Tracker', icon: <Calendar size={14} /> },
          { id: 'bmi', label: 'BMI Score', icon: <Activity size={14} /> },
          { id: 'percentage', label: 'Percentage', icon: <Percent size={14} /> },
          { id: 'discount', label: 'Discount', icon: <DollarSign size={14} /> },
          { id: 'currency', label: 'Exchange Converter', icon: <Globe size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveMode(tab.id as CalcMode); handleClear(); }}
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

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          
          {/* STANDARD & SCIENTIFIC DISPLAY */}
          {(activeMode === 'standard' || activeMode === 'scientific') && (
            <motion.div
              key="calc-math"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Output Readout Card */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 text-right flex flex-col justify-end min-h-[100px] shadow-inner font-mono">
                <span className="text-slate-500 text-xs min-h-[16px] truncate">{formula}</span>
                <span className="text-3xl font-bold tracking-tight text-slate-100 truncate mt-1">{display}</span>
              </div>

              {/* Grid buttons layout */}
              <div className="grid grid-cols-4 gap-2">
                <button onClick={handleClear} className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 font-bold text-xs text-rose-400 cursor-pointer">AC</button>
                <button onClick={handleBackspace} className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 font-bold text-xs text-slate-300 cursor-pointer">DEL</button>
                <button onClick={() => handleKey('%')} className="py-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 font-bold text-xs text-slate-300 cursor-pointer">%</button>
                <button onClick={() => handleOperator('/')} className={`py-3.5 rounded-xl font-bold text-xs cursor-pointer ${buttonAccentClass}`}>/</button>

                {activeMode === 'scientific' && (
                  <>
                    <button onClick={() => handleScientificOp('sin')} className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-[10px] font-semibold text-slate-400">SIN</button>
                    <button onClick={() => handleScientificOp('cos')} className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-[10px] font-semibold text-slate-400">COS</button>
                    <button onClick={() => handleScientificOp('tan')} className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-[10px] font-semibold text-slate-400">TAN</button>
                    <button onClick={() => handleScientificOp('sqrt')} className="py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-[10px] font-semibold text-slate-400">√</button>
                  </>
                )}

                {['7', '8', '9'].map(k => (
                  <button key={k} onClick={() => handleKey(k)} className="py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 font-bold text-sm cursor-pointer">{k}</button>
                ))}
                <button onClick={() => handleOperator('*')} className={`py-3.5 rounded-xl font-bold text-xs cursor-pointer ${buttonAccentClass}`}>×</button>

                {['4', '5', '6'].map(k => (
                  <button key={k} onClick={() => handleKey(k)} className="py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 font-bold text-sm cursor-pointer">{k}</button>
                ))}
                <button onClick={() => handleOperator('-')} className={`py-3.5 rounded-xl font-bold text-xs cursor-pointer ${buttonAccentClass}`}>-</button>

                {['1', '2', '3'].map(k => (
                  <button key={k} onClick={() => handleKey(k)} className="py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 font-bold text-sm cursor-pointer">{k}</button>
                ))}
                <button onClick={() => handleOperator('+')} className={`py-3.5 rounded-xl font-bold text-xs cursor-pointer ${buttonAccentClass}`}>+</button>

                <button onClick={() => handleKey('0')} className="py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 font-bold text-sm col-span-2 cursor-pointer">0</button>
                <button onClick={() => handleKey('.')} className="py-3.5 rounded-xl bg-slate-850 hover:bg-slate-800 font-bold text-sm cursor-pointer">.</button>
                <button onClick={handleEvaluate} className={`py-3.5 rounded-xl font-bold text-sm cursor-pointer ${activeAccentClass}`}>=</button>
              </div>
            </motion.div>
          )}

          {/* GST CALCULATOR */}
          {activeMode === 'gst' && (
            <motion.div
              key="calc-gst"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tax Inputs</span>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono">Principal Bill Amount ($)</label>
                  <input 
                    type="number" 
                    value={gstAmount} 
                    onChange={(e) => setGstAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-mono">GST Rate Slab (%)</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[5, 12, 18, 28].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setGstRate(rate)}
                        className={`py-1.5 rounded-lg text-xs font-bold border ${
                          gstRate === rate 
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button 
                    onClick={() => setGstType('exclusive')}
                    className={`py-2 rounded-xl text-xs font-semibold border ${
                      gstType === 'exclusive' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    GST Exclusive
                  </button>
                  <button 
                    onClick={() => setGstType('inclusive')}
                    className={`py-2 rounded-xl text-xs font-semibold border ${
                      gstType === 'inclusive' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    GST Inclusive
                  </button>
                </div>
              </div>

              {/* Tax Output Receipt Card */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-850 pb-2 mb-2">
                  <span className="text-slate-400">Net Price / Cost</span>
                  <span className="font-bold text-slate-300">${netAmt.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CGST ({(gstRate / 2)}%)</span>
                  <span className="text-slate-300">${cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SGST ({(gstRate / 2)}%)</span>
                  <span className="text-slate-300">${sgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-dashed border-slate-850 pb-2">
                  <span className="text-slate-500">Total GST Tax Amount</span>
                  <span className="text-indigo-400 font-bold">${gstTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pt-1">
                  <span className="text-slate-300 font-semibold">Total Invoice Amount</span>
                  <span className="text-emerald-400 font-black">${gstTotal.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* EMI LOAN CALCULATOR */}
          {activeMode === 'emi' && (
            <motion.div
              key="calc-emi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Principal & Rate</span>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono">Loan Amount ($)</label>
                  <input 
                    type="number" 
                    value={emiPrincipal} 
                    onChange={(e) => setEmiPrincipal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">Interest Rate (% p.a.)</label>
                    <input 
                      type="number" 
                      value={emiInterest} 
                      onChange={(e) => setEmiInterest(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">Tenure (Years)</label>
                    <input 
                      type="number" 
                      value={emiTenure} 
                      onChange={(e) => setEmiTenure(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* EMI results receipt */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-center p-3 bg-slate-900 rounded-xl mb-2">
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-slate-500 uppercase">Monthly EMI</span>
                    <span className="text-lg font-black text-emerald-400 mt-1">${emiMonthly.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Principal Loan</span>
                  <span className="text-slate-300">${p.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Interest Payable</span>
                  <span className="text-indigo-400">${emiTotalInterest.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-850 pt-2 font-bold">
                  <span className="text-slate-300">Total Payment</span>
                  <span className="text-slate-100">${emiTotalPayable.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* AGE TRACKER */}
          {activeMode === 'age' && (
            <motion.div
              key="calc-age"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Birthdate Configuration</span>
                <input 
                  type="date" 
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none text-white font-mono"
                />
              </div>

              {ageResult && (
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-3xl font-bold text-indigo-400">{ageResult.years}</span>
                    <span className="text-[10px] text-slate-500 uppercase mt-1">Years old</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-center">
                    <span className="text-3xl font-bold text-emerald-400">{ageResult.months}</span>
                    <span className="text-[10px] text-slate-500 uppercase mt-1">Months</span>
                  </div>
                  <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl flex flex-col justify-center col-span-2">
                    <span className="text-xs text-slate-400">Next Birthday Countdown</span>
                    <span className="text-2xl font-black text-amber-400 mt-1">{ageResult.countdown} Days</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* BMI CALCULATOR */}
          {activeMode === 'bmi' && (
            <motion.div
              key="calc-bmi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Weight & Height parameters</span>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={bmiWeight} 
                      onChange={(e) => setBmiWeight(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">Height (cm)</label>
                    <input 
                      type="number" 
                      value={bmiHeight} 
                      onChange={(e) => setBmiHeight(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {bmiScore > 0 && (
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 text-center space-y-2">
                  <span className="text-slate-500 text-[10px] uppercase font-mono">Body Mass Index Score</span>
                  <h3 className="text-3xl font-black tracking-tight">{bmiScore.toFixed(1)}</h3>
                  <div className={`text-sm font-semibold ${bmiColor}`}>
                    {bmiCategory}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                    {bmiCategory === 'Healthy Normal' ? 'Fantastic! You possess a highly balanced body weight coordinate.' : 'We recommend consulting active fitness charts or managing daily nutrition diets.'}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* PERCENTAGE CALCULATOR */}
          {activeMode === 'percentage' && (
            <motion.div
              key="calc-pct"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 font-mono"
            >
              <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Ratio inputs</span>
                
                <div className="flex items-center gap-2 text-sm">
                  <span>What is</span>
                  <input 
                    type="number" 
                    value={pctX} 
                    onChange={(e) => setPctX(e.target.value)}
                    className="w-16 bg-slate-900 border border-slate-750 rounded-lg px-2 py-1 text-center font-bold text-indigo-400"
                  />
                  <span>% of</span>
                  <input 
                    type="number" 
                    value={pctY} 
                    onChange={(e) => setPctY(e.target.value)}
                    className="w-20 bg-slate-900 border border-slate-750 rounded-lg px-2 py-1 text-center font-bold text-indigo-400"
                  />
                </div>
              </div>

              {/* Answer card */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 text-center font-bold text-sm text-slate-200">
                Answer: <span className="text-emerald-400 text-lg">
                  {((parseFloat(pctX) || 0) * (parseFloat(pctY) || 0) / 100).toFixed(4).replace(/\.?0+$/, '')}
                </span>
              </div>
            </motion.div>
          )}

          {/* DISCOUNT CALCULATOR */}
          {activeMode === 'discount' && (
            <motion.div
              key="calc-disc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Discount parameters</span>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono">Original Cost Price ($)</label>
                  <input 
                    type="number" 
                    value={discPrice} 
                    onChange={(e) => setDiscPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">Discount Off (%)</label>
                    <input 
                      type="number" 
                      value={discPercent} 
                      onChange={(e) => setDiscPercent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">Sales Tax (%)</label>
                    <input 
                      type="number" 
                      value={discTax} 
                      onChange={(e) => setDiscTax(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Receipt output */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Original Price</span>
                  <span className="text-slate-300">${prc.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Money Saved</span>
                  <span className="text-emerald-400 font-bold">-${totalSaved.toFixed(2)} ({dsc}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sales Tax Added</span>
                  <span className="text-rose-400">+${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-850 pt-2 font-bold">
                  <span className="text-slate-300">Final Purchase Price</span>
                  <span className="text-emerald-400 font-black">${finalPrice.toFixed(2)}</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* CURRENCY EXCHANGE CONVERTER */}
          {activeMode === 'currency' && (
            <motion.div
              key="calc-curr"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl space-y-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Conversion Indexes</span>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-500 font-mono">Convert Amount</label>
                  <input 
                    type="number" 
                    value={currAmount} 
                    onChange={(e) => setCurrAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">From Currency</label>
                    <select
                      value={currFrom}
                      onChange={(e) => setCurrFrom(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono focus:outline-none text-white"
                    >
                      {Object.keys(exchangeRates).map(code => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-mono">To Currency</label>
                    <select
                      value={currTo}
                      onChange={(e) => setCurrTo(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs font-mono focus:outline-none text-white"
                    >
                      {Object.keys(exchangeRates).map(code => (
                        <option key={code} value={code}>{code}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Conversion results receipt */}
              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 text-center space-y-1 font-mono">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Exchange Rate Conversion</span>
                <div className="text-lg text-slate-400">
                  {currAmount} {currFrom} =
                </div>
                <div className="text-3xl font-black text-emerald-400 tracking-tight">
                  {currencyConvert()} {currTo}
                </div>
                <span className="text-[10px] text-slate-600 block pt-1">
                  1 {currFrom} = {(exchangeRates[currTo] / exchangeRates[currFrom]).toFixed(4)} {currTo}
                </span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
