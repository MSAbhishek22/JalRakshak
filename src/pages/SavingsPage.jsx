// src/pages/SavingsPage.jsx — JalRakshak Water & Financial Savings Overview
import { useEffect, useState } from 'react';
import { Plus, X, Check, Droplets, Trophy, ArrowLeft } from 'lucide-react';
import { useApp, useT } from '../context/AppContext';
import { storage } from '../utils/storage';
import { calculateTotalSavings, calculateWaterLitersSaved } from '../utils/savingsCalculator';
import { trackEvent, EVENTS } from '../firebase/analytics';
import { useCountUp } from '../hooks/useCountUp';
import Tappable from '../components/common/Tappable';
import SuccessCheck from '../components/common/SuccessCheck';

function calcMonthSavings(log) {
  if (!Array.isArray(log)) return 0;
  const now = new Date();
  return log
    .filter(e => {
      if (!e.aiSaidSkip || !e.didSkip) return false;
      const d = new Date(e.date || e.timestamp);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, e) => s + (e.savings || 0), 0);
}

function calcWeekSavings(log) {
  if (!Array.isArray(log)) return 0;
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return log
    .filter(e => e.aiSaidSkip && e.didSkip && new Date(e.date || e.timestamp).getTime() >= weekAgo)
    .reduce((s, e) => s + (e.savings || 0), 0);
}

function getSkipCount(log) {
  if (!Array.isArray(log)) return 0;
  return log.filter(e => e.aiSaidSkip && e.didSkip).length;
}

export default function SavingsPage({ onBack }) {
  const { user, setActiveTab } = useApp();
  const t = useT();
  const lang = user.language || 'hi';
  const [irrigationLog, setIrrigationLog] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('irrigation_log') || '[]');
    } catch {
      return [];
    }
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const reload = () => {
      try {
        setIrrigationLog(JSON.parse(localStorage.getItem('irrigation_log') || '[]'));
      } catch (_) {}
    };

    window.addEventListener('storage', reload);
    return () => window.removeEventListener('storage', reload);
  }, []);

  const total = calculateTotalSavings(irrigationLog);
  const month = calcMonthSavings(irrigationLog);
  const week = calcWeekSavings(irrigationLog);
  const count = getSkipCount(irrigationLog);
  const liters = calculateWaterLitersSaved(irrigationLog);
  const tankers = Math.floor(liters / 1000);
  const goal = storage.get('savings_goal') || 5000;

  const [showLogModal, setShowLogModal] = useState(false);
  const [logEntry, setLogEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    crop: (storage.get('user_crops') || ['गेहूं'])[0],
    durationHours: 3,
    aiSaidSkip: false,
    didSkip: false,
  });

  const CROP_SAVINGS = { 'गेहूं': 450, 'धान': 650, 'मक्का': 400, 'सब्जियां': 750, 'आलू': 500, 'टमाटर': 600, 'दाल': 350 };

  const saveIrrigationEntry = () => {
    const existing = storage.get('irrigation_log') || [];
    const entry = {
      id: `log_${Date.now()}`,
      date: new Date(logEntry.date).toISOString(),
      crop: logEntry.crop,
      durationHours: logEntry.durationHours,
      aiSaidSkip: logEntry.aiSaidSkip,
      didSkip: logEntry.didSkip,
      savings: logEntry.aiSaidSkip && logEntry.didSkip ? (CROP_SAVINGS[logEntry.crop] || 500) : 0,
    };
    const updated = [entry, ...existing];
    storage.set('irrigation_log', updated);
    setIrrigationLog(updated);
    setShowLogModal(false);
    setShowSuccess(true);
    trackEvent(EVENTS.SAVINGS_UPDATED, { savings: entry.savings, crop: entry.crop });
  };

  const { current: displayTotal } = useCountUp(total, 1200);
  const { current: displayMonth } = useCountUp(month, 1000);
  const { current: displayWeek } = useCountUp(week, 1000);
  const { current: displayCount } = useCountUp(count, 800);
  const { current: displayLiters } = useCountUp(liters, 1500);

  const pct = goal > 0 ? Math.min((total / goal) * 100, 100) : 0;

  useEffect(() => {
    trackEvent(EVENTS.SAVINGS_VIEWED, { total_savings: total, skip_count: count });
  }, [total, count]);

  return (
    <div className="bg-surface-light min-h-screen pb-24 scroll-container" style={{ paddingBottom: 'max(88px, calc(68px + env(safe-area-inset-bottom)))' }}>
      {/* Hero Header */}
      <div
        className="rounded-b-[32px] px-5 pt-6 pb-9 shadow-md"
        style={{ background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 50%, #115E59 100%)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <Tappable
            onClick={() => onBack ? onBack() : setActiveTab('home')}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white"
            ariaLabel="Back"
          >
            <ArrowLeft size={18} />
          </Tappable>
          <span className="text-xs font-bold text-teal-200 uppercase tracking-wider">{t('totalSavings')}</span>
          <div className="w-9" />
        </div>
        <p className="text-[48px] font-black text-white mt-1 leading-none tracking-tight">
          ₹{displayTotal.toLocaleString('en-IN')}
        </p>
        <p className="text-xs text-teal-100/80 mt-1">{t('toDate')}</p>

        <div className="flex justify-around mt-5 pt-4 border-t border-teal-600/50">
          <div className="text-center">
            <p className="text-[20px] font-black text-white">₹{displayMonth.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-teal-200">{t('thisMonth')}</p>
          </div>
          <div className="text-center border-x border-teal-600/40 px-4">
            <p className="text-[20px] font-black text-white">₹{displayWeek.toLocaleString('en-IN')}</p>
            <p className="text-[11px] text-teal-200">{t('thisWeek')}</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-black text-white">{displayCount}</p>
            <p className="text-[11px] text-teal-200">{t('timesSaved')}</p>
          </div>
        </div>
      </div>

      {/* Irrigation Log Card */}
      <div className="mx-4 -mt-4 bg-white rounded-2xl p-5 relative z-10 border border-slate-100 shadow-card">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">{t('irrigationLog')}</h3>
          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
            {irrigationLog.length} रिकॉर्ड
          </span>
        </div>

        <Tappable
          onClick={() => setShowLogModal(true)}
          className="w-full h-12 mt-3.5 border-2 border-dashed border-teal-500/60 bg-teal-50/50 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-teal-800 hover:bg-teal-50 transition-colors"
        >
          <Plus size={16} />
          <span>{t('logIrrigation')}</span>
        </Tappable>

        {irrigationLog.length > 0 && (
          <div className="mt-3 space-y-0 divide-y divide-slate-100">
            {[...irrigationLog].reverse().slice(0, 7).map((entry, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {new Date(entry.date || entry.timestamp).toLocaleDateString('hi-IN')}
                  </p>
                  <p className="text-[11px] text-slate-500">{entry.crop}</p>
                </div>
                <p className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  {entry.aiSaidSkip ? '⏭️ सिंचाई टाली' : `${entry.durationHours || 0}h सिंचाई`}
                </p>
                <p className={`text-sm font-bold ${entry.savings > 0 ? 'text-teal-700' : 'text-slate-400'}`}>
                  {entry.savings > 0 ? `+₹${entry.savings}` : '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Goal Progress */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-card p-5 border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-slate-900">{t('monthGoal')}</h3>
          <Trophy size={18} className="text-amber-500" />
        </div>
        <div className="flex flex-col items-center mt-2">
          <svg width="130" height="130" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="56" fill="none" stroke="#E2E8F0" strokeWidth="12" />
            <circle
              cx="70" cy="70" r="56" fill="none" stroke="#0F766E" strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - pct / 100)}`}
              transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
            />
            <text x="70" y="65" textAnchor="middle" dominantBaseline="central"
              style={{ fontSize: '24px', fontWeight: 900, fill: '#0F766E' }}>
              {Math.round(pct)}%
            </text>
            <text x="70" y="88" textAnchor="middle"
              style={{ fontSize: '11px', fontWeight: 600, fill: '#64748B' }}>
              लक्ष्य
            </text>
          </svg>
          <p className="text-xs font-semibold text-slate-600 mt-2">
            ₹{total.toLocaleString('en-IN')} / ₹{goal.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Water Savings Hero Metric */}
      <div className="mx-4 mt-4 mb-4 rounded-2xl p-5 border border-sky-200" style={{ background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Droplets className="text-sky-700" size={20} />
          <p className="text-sm font-bold text-sky-900">{t('waterSaved')}</p>
        </div>
        <p className="text-[30px] font-black text-sky-900 mt-1 leading-tight">
          {displayLiters.toLocaleString('en-IN')} {t('liters')}
        </p>
        <p className="text-xs text-sky-800 mt-1 font-medium">≈ {tankers} पानी के टैंकर सुरक्षित किए</p>
        <p className="text-xs text-sky-900/80 italic mt-2">
          {t('waterFunFact').replace('{x}', Math.max(1, Math.floor(liters / 50)))}
        </p>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div
          style={{
            position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: '430px', background: 'rgba(15, 23, 42, 0.6)',
            zIndex: 500, display: 'flex', alignItems: 'flex-end'
          }}
          onClick={() => setShowLogModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-t-3xl p-5 w-full shadow-modal animate-slide-up"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <p className="text-lg font-bold text-slate-900">💧 सिंचाई दर्ज करें</p>
              <Tappable
                onClick={() => setShowLogModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                ariaLabel="Close"
              >
                <X size={18} />
              </Tappable>
            </div>

            <label className="text-xs font-bold text-slate-700 block mb-1.5">तारीख</label>
            <input
              type="date"
              value={logEntry.date}
              onChange={e => setLogEntry(p => ({ ...p, date: e.target.value }))}
              className="w-full h-11 border-2 border-teal-100 rounded-xl px-3 text-sm mb-3 outline-none focus:border-teal-600 text-slate-800"
            />

            <label className="text-xs font-bold text-slate-700 block mb-1.5">{t('crop')}</label>
            <select
              value={logEntry.crop}
              onChange={e => setLogEntry(p => ({ ...p, crop: e.target.value }))}
              className="w-full h-11 border-2 border-teal-100 rounded-xl px-3 text-sm mb-3 outline-none focus:border-teal-600 bg-white text-slate-800"
            >
              {['गेहूं','धान','मक्का','सब्जियां','आलू','टमाटर','दाल','अन्य'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              सिंचाई का समय: <span className="text-teal-700">{logEntry.durationHours} घंटे</span>
            </label>
            <input
              type="range" min="0.5" max="8" step="0.5" value={logEntry.durationHours}
              onChange={e => setLogEntry(p => ({ ...p, durationHours: parseFloat(e.target.value) }))}
              className="w-full mb-4 accent-teal-700"
            />

            <label className="text-xs font-bold text-slate-700 block mb-2">AI की सलाह का पालन</label>
            <div className="flex gap-2.5 mb-4">
              {[
                { label: '💧 पानी देने की सलाह थी', val: false },
                { label: '🌧️ टालने की सलाह (बचत)', val: true }
              ].map(opt => (
                <Tappable
                  key={String(opt.val)}
                  onClick={() => setLogEntry(p => ({ ...p, aiSaidSkip: opt.val, didSkip: opt.val }))}
                  className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                    logEntry.aiSaidSkip === opt.val
                      ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {opt.label}
                </Tappable>
              ))}
            </div>

            <Tappable
              onClick={saveIrrigationEntry}
              className="w-full h-12 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-btn flex items-center justify-center gap-2"
            >
              <Check size={18} />
              <span>सेव करें (Save Entry)</span>
            </Tappable>
          </div>
        </div>
      )}

      {showSuccess && (
        <SuccessCheck
          message="सिंचाई रिकॉर्ड सेव हुआ!"
          onComplete={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
