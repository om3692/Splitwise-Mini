import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { calculateSettlements } from './utils/debtAlgorithm';

const getEmoji = (desc) => {
  const lowerDesc = desc.toLowerCase();
  if (lowerDesc.includes('food') || lowerDesc.includes('dinner')) return '🍔';
  if (lowerDesc.includes('travel') || lowerDesc.includes('uber')) return '🚗';
  if (lowerDesc.includes('movie') || lowerDesc.includes('ticket')) return '🎬';
  if (lowerDesc.includes('drink') || lowerDesc.includes('bar')) return '🍻';
  return '💸';
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [step, setStep] = useState(1);

  // Step 1 State
  const [numPeople, setNumPeople] = useState(2);
  const [groupNames, setGroupNames] = useState(['', '']);
  const [finalUsers, setFinalUsers] = useState([]);

  // Step 2 State
  const [expenses, setExpenses] = useState([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [splitWith, setSplitWith] = useState([]);

  const settlements = useMemo(() => calculateSettlements(expenses), [expenses]);

  const handleNumChange = (e) => {
    let val = parseInt(e.target.value);
    if (isNaN(val) || val < 2) val = 2;
    if (val > 10) val = 10;
    
    setNumPeople(val);
    setGroupNames(prev => {
      const newArr = [...prev];
      if (val > prev.length) newArr.push(...Array(val - prev.length).fill(''));
      else if (val < prev.length) newArr.splice(val);
      return newArr;
    });
  };

  const handleNameInput = (index, value) => {
    const newNames = [...groupNames];
    newNames[index] = value;
    setGroupNames(newNames);
  };

  const initializeGroup = (e) => {
    e.preventDefault();
    const cleanedNames = groupNames.map((name, i) => name.trim() || `Person ${i + 1}`);
    const uniqueNames = [...new Set(cleanedNames)];
    
    setFinalUsers(uniqueNames);
    setPayer(uniqueNames[0]);
    setSplitWith([...uniqueNames]);
    setStep(2);
  };

  const toggleSplitUser = (user) => {
    if (splitWith.includes(user)) {
      if (splitWith.length > 1) setSplitWith(splitWith.filter(u => u !== user));
    } else {
      setSplitWith([...splitWith, user]);
    }
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!desc || !amount) return;
    
    const newExpense = {
      id: Date.now(), desc, payer, splitWith, amount: parseFloat(amount)
    };
    
    setExpenses([...expenses, newExpense]);
    setDesc(''); setAmount('');
    setPayer(finalUsers[0]); setSplitWith([...finalUsers]);
  };

  return (
    // Added a subtle mesh gradient background for ultimate depth
    <div className={`min-h-screen transition-colors duration-700 font-sans overflow-x-hidden ${
      darkMode 
        ? 'bg-[#0B0F19] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] text-white' 
        : 'bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))] text-slate-900'
    } p-4 md:p-8`}>
      
      <header className="flex justify-between items-center mb-10 max-w-2xl mx-auto pt-4">
        <h1 className="text-4xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 drop-shadow-sm">
          Splitwise Mini
        </h1>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full backdrop-blur-md border transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 ${
            darkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/50 border-slate-200 hover:bg-white/80'
          }`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-8 md:p-10 rounded-[2rem] backdrop-blur-2xl border shadow-2xl relative overflow-hidden ${
                darkMode ? 'bg-white/[0.02] border-white/5 shadow-black/50' : 'bg-white/60 border-white shadow-slate-200/50'
              }`}
            >
              {/* Subtle accent glow inside the card */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

              <h2 className="text-2xl font-bold mb-8 tracking-tight">Configure Your Group</h2>
              <form onSubmit={initializeGroup} className="space-y-8 relative z-10">
                
                <div className="space-y-3">
                  <label className="text-xs font-bold opacity-60 uppercase tracking-widest ml-1">
                    Number of People
                  </label>
                  <div className="relative group">
                    <input 
                      type="number" min="2" max="10"
                      value={numPeople} onChange={handleNumChange}
                      className={`w-full p-4 rounded-2xl bg-transparent border-2 outline-none transition-all font-bold text-xl ${
                        darkMode ? 'border-white/10 focus:border-blue-500 focus:bg-white/5 focus:ring-4 ring-blue-500/10' : 'border-slate-200 focus:border-blue-500 focus:bg-white focus:ring-4 ring-blue-500/10'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-bold opacity-60 uppercase tracking-widest ml-1">
                    Participant Names
                  </label>
                  <div className="space-y-3">
                    {groupNames.map((name, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                        key={idx}
                      >
                        <input 
                          type="text" value={name} onChange={(e) => handleNameInput(idx, e.target.value)}
                          placeholder={idx === 0 ? "e.g., Om" : idx === 1 ? "e.g., Shruti" : `Person ${idx + 1}`}
                          className={`w-full p-4 rounded-xl bg-transparent border outline-none transition-all ${
                            darkMode ? 'border-white/10 focus:border-emerald-400 focus:bg-white/5' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="w-full relative group mt-6">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                  <div className="relative w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold text-lg py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-xl flex justify-center items-center gap-2">
                    Start Splitting <span>→</span>
                  </div>
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className={`p-8 md:p-10 rounded-[2rem] backdrop-blur-2xl border shadow-2xl relative overflow-hidden ${
                darkMode ? 'bg-white/[0.02] border-white/5 shadow-black/50' : 'bg-white/60 border-white shadow-slate-200/50'
              }`}>
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <button 
                  onClick={() => { setStep(1); setExpenses([]); }}
                  className="absolute top-8 right-8 text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity flex items-center gap-1"
                >
                  <span>←</span> Back
                </button>

                <h2 className="text-2xl font-bold mb-8 tracking-tight">Log an Expense</h2>
                <form onSubmit={handleAddExpense} className="flex flex-col space-y-8 relative z-10">
                  
                  <div className="flex flex-col md:flex-row gap-5">
                    <div className="relative flex-1 group">
                      <span className="absolute left-5 top-4 text-2xl transition-transform group-focus-within:scale-110">{desc ? getEmoji(desc) : '📝'}</span>
                      <input 
                        type="text" placeholder="What was it for?" value={desc} onChange={(e) => setDesc(e.target.value)}
                        className={`w-full pl-14 p-5 rounded-2xl bg-transparent border-2 outline-none transition-all font-medium ${
                          darkMode ? 'border-white/10 focus:border-blue-500 focus:bg-white/5' : 'border-slate-200 focus:border-blue-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div className="relative w-full md:w-48 group">
                      <span className="absolute left-5 top-5 text-slate-400 font-bold text-lg">$</span>
                      <input 
                        type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)}
                        className={`w-full pl-10 p-5 rounded-2xl bg-transparent border-2 outline-none transition-all font-bold text-lg ${
                          darkMode ? 'border-white/10 focus:border-emerald-500 focus:bg-white/5' : 'border-slate-200 focus:border-emerald-500 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold opacity-60 uppercase tracking-widest ml-1 mb-3 block">Who paid?</label>
                      <div className="flex gap-3 flex-wrap">
                        {finalUsers.map(user => (
                          <button
                            key={`payer-${user}`} type="button" onClick={() => setPayer(user)}
                            className={`h-14 px-5 rounded-xl flex items-center gap-3 font-bold transition-all duration-300 border border-transparent ${
                              payer === user 
                                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-[1.02]' 
                                : darkMode ? 'bg-white/5 hover:bg-white/10 border-white/5' : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs uppercase backdrop-blur-sm">{user[0]}</div>
                            {user}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold opacity-60 uppercase tracking-widest ml-1 mb-3 block">Split equally between</label>
                      <div className="flex gap-3 flex-wrap">
                        {finalUsers.map(user => {
                          const isSelected = splitWith.includes(user);
                          return (
                            <button
                              key={`split-${user}`} type="button" onClick={() => toggleSplitUser(user)}
                              className={`h-14 px-5 rounded-xl flex items-center gap-3 font-bold transition-all duration-300 border-2 ${
                                isSelected 
                                  ? darkMode ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]' : 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                                  : darkMode ? 'border-white/5 bg-white/5 opacity-50 hover:opacity-100' : 'border-slate-200 bg-white opacity-60 hover:opacity-100'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-current' : 'border-current'}`}>
                                {isSelected && <span className="text-[10px]">✓</span>}
                              </div>
                              {user}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <ReceiptUploadMock setAmount={setAmount} darkMode={darkMode} />

                  <button type="submit" className="w-full relative group mt-4">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold text-lg py-4 rounded-2xl transition-all transform active:scale-[0.98] shadow-xl">
                      Save & Calculate
                    </div>
                  </button>
                </form>
              </div>

              {settlements.length > 0 && (
                <div className="space-y-4 pt-4">
                  <h2 className="text-xl font-bold opacity-90 flex items-center gap-2 ml-2">
                    <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Balances</span>
                  </h2>
                  <AnimatePresence>
                    {settlements.map((s, idx) => (
                      <motion.div 
                        key={idx} initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} layout
                        className={`flex flex-col sm:flex-row justify-between items-center p-6 rounded-3xl backdrop-blur-xl border ${
                          darkMode ? 'bg-white/[0.03] border-white/5 shadow-black/40' : 'bg-white border-slate-100 shadow-xl shadow-slate-200/50'
                        } gap-4`}
                      >
                        <div className={`flex items-center gap-3 w-full sm:w-auto rounded-xl p-3 px-5 border ${darkMode ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                          <span className="font-bold text-rose-400">{s.from}</span>
                          <span className="text-xs font-semibold opacity-50 uppercase tracking-wider">owes</span>
                          <span className="font-bold text-emerald-400">{s.to}</span>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-8">
                          <span className="font-black text-3xl tracking-tighter drop-shadow-sm">${s.amount}</span>
                          <SettleButton />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

const SettleButton = () => {
  const [settled, setSettled] = useState(false);

  const handleSettle = () => {
    setSettled(true);
    confetti({
      particleCount: 150, spread: 80, origin: { y: 0.6 },
      colors: ['#34d399', '#60a5fa', '#ffffff'], disableForReducedMotion: true
    });
  };

  return (
    <button 
      onClick={handleSettle} disabled={settled}
      className={`relative overflow-hidden px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
        settled ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 border border-white/10'
      }`}
    >
      {settled ? (
        <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 10 }} className="flex items-center gap-2">
          <span>✨</span> Settled
        </motion.span>
      ) : 'Settle'}
    </button>
  );
};

const ReceiptUploadMock = ({ setAmount, darkMode }) => {
  const [isScanning, setIsScanning] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/api/scan-receipt", {
        method: "POST", body: formData,
      });
      const data = await response.json();
      setAmount(data.amount.toString());
    } catch (error) {
      console.error("Failed to reach Python backend:", error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="relative mt-4">
      <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
      <div className={`relative overflow-hidden flex items-center gap-5 p-5 rounded-2xl transition-all duration-500 border-2 ${
        isScanning 
          ? 'border-blue-500/50 bg-blue-500/5 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
          : darkMode ? 'border-dashed border-white/10 hover:border-white/20 hover:bg-white/5' : 'border-dashed border-slate-300 hover:border-blue-300 hover:bg-blue-50'
      }`}>
        {isScanning && (
          <motion.div initial={{ left: '-100%' }} animate={{ left: '200%' }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent skew-x-[-20deg] z-10" />
        )}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-inner ${isScanning ? 'bg-blue-500/20 shadow-blue-500/50' : darkMode ? 'bg-white/5' : 'bg-slate-100'}`}>
          {isScanning ? '🧠' : '📸'}
        </div>
        <div className="text-sm flex-1">
          <p className={`font-bold text-base ${isScanning ? 'text-blue-500' : ''}`}>
            {isScanning ? 'AI Engine Processing...' : 'Scan Receipt'}
          </p>
          <p className="opacity-60 text-xs mt-1 font-medium">
            {isScanning ? 'Running Python vision models.' : 'Auto-extract totals using ML backend.'}
          </p>
        </div>
      </div>
    </div>
  );
};