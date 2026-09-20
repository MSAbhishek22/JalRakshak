// src/components/FertilizerAdvisory.jsx
// Fertilizer dosage comparison and advisory modal with JalRakshak design tokens.
import React, { useState, useMemo } from 'react';
import { Volume2, X, Search, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CROPS } from '../utils/cropData';
import { getRecommendedDosage, calculateRunoff, getNutrientStatus } from '../utils/fertilizerData';
import { t } from '../i18n/translations';
import { speakHi } from '../utils/tts';
import Tappable from './common/Tappable';
import SuccessCheck from './common/SuccessCheck';

export default function FertilizerAdvisory({ language = 'hi', onClose }) {
  const { setActiveTab } = useApp();
  const lang = language;
  const cropsWithFertilizer = CROPS.filter(c => c.id !== 'other' && getRecommendedDosage(c.id));

  const [selectedCrop, setSelectedCrop] = useState(cropsWithFertilizer[0]?.id || 'wheat');
  const [appliedN, setAppliedN] = useState('');
  const [appliedP, setAppliedP] = useState('');
  const [appliedK, setAppliedK] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const recommended = useMemo(() => getRecommendedDosage(selectedCrop), [selectedCrop]);

  const result = useMemo(() => {
    if (!recommended || !showResult) return null;
    const nVal = parseFloat(appliedN) || 0;
    const pVal = parseFloat(appliedP) || 0;
    const kVal = parseFloat(appliedK) || 0;

    const nStatus = getNutrientStatus(nVal, recommended.n);
    const pStatus = getNutrientStatus(pVal, recommended.p);
    const kStatus = getNutrientStatus(kVal, recommended.k);
    const runoff = calculateRunoff(nVal, recommended.n);

    return { nStatus, pStatus, kStatus, runoff, nVal, pVal, kVal };
  }, [appliedN, appliedP, appliedK, recommended, showResult]);

  const handleCheck = () => {
    setShowResult(true);
  };

  const handleVoiceRead = () => {
    if (!result || !recommended) return;
    const crop = CROPS.find(c => c.id === selectedCrop);
    const cropName = crop?.[lang] || crop?.hi || selectedCrop;
    let speech = `${cropName} के लिए: `;

    if (result.runoff.isOverdosing) {
      speech += `आप अधिक खाद डाल रहे हैं। सिफारिश ${recommended.n} किलो नाइट्रोजन प्रति हेक्टेयर है। `;
      speech += `अतिरिक्त खाद से लगभग ${result.runoff.runoffN} किलो नाइट्रोजन पानी में बह सकता है।`;
    } else {
      speech += `संतुलित खाद की मात्रा! बहुत अच्छा।`;
    }
    speakHi(speech);
  };

  const saveFertilizerCheck = () => {
    if (!result || !recommended) return;
    try {
      const existing = JSON.parse(localStorage.getItem('fertilizer_log') || '[]');
      existing.push({
        ts: Date.now(),
        cropId: selectedCrop,
        appliedN: result.nVal,
        recommendedN: recommended.n,
        excessN: result.runoff.excessN,
        runoffN: result.runoff.runoffN,
      });
      localStorage.setItem('fertilizer_log', JSON.stringify(existing));
    } catch (e) { /* ignore */ }

    setShowSuccess(true);
  };

  const inputStyle = {
    width: '100%', height: '48px', border: '2px solid #CCFBF1', borderRadius: '12px',
    padding: '0 14px', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box',
    outline: 'none', background: '#FFFFFF', color: '#1E293B',
  };

  const NutrientBar = ({ label, applied, recommended: rec, status }) => {
    const maxVal = Math.max(applied, rec) * 1.3 || 1;
    return (
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B' }}>{label}</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: status.statusKey === 'optimal' ? '#0F766E' : status.color }}>
            {status.status}
          </span>
        </div>
        <div style={{ position: 'relative', height: '22px', background: '#F1F5F9', borderRadius: '11px', overflow: 'hidden' }}>
          {/* Recommended marker */}
          <div style={{
            position: 'absolute', left: `${(rec / maxVal) * 100}%`, top: 0, bottom: 0,
            width: '3px', background: '#0F766E', zIndex: 2,
          }} />
          {/* Applied bar */}
          <div style={{
            height: '100%', borderRadius: '11px',
            width: `${Math.min((applied / maxVal) * 100, 100)}%`,
            background: status.statusKey === 'overdose'
              ? 'linear-gradient(90deg, #F87171, #EF4444)'
              : status.statusKey === 'optimal'
                ? 'linear-gradient(90deg, #2DD4BF, #0F766E)'
                : 'linear-gradient(90deg, #FCD34D, #F59E0B)',
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>{t(lang, 'currentApplication')}: {applied} kg</span>
          <span style={{ fontSize: '12px', color: '#0F766E', fontWeight: 600 }}>{t(lang, 'recommendedDosage')}: {rec} kg</span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '430px', background: 'rgba(15, 23, 42, 0.65)',
        zIndex: 800, display: 'flex', alignItems: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF', borderRadius: '24px 24px 0 0',
          padding: '24px 20px', width: '100%', maxHeight: '85vh',
          overflowY: 'auto', boxShadow: '0 -8px 32px rgba(0,0,0,0.2)',
        }}
        className="hide-scrollbar animate-slide-up"
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🧪</span>
            <span>{t(lang, 'fertilizerAdvisory')}</span>
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {result && (
              <Tappable
                onClick={handleVoiceRead}
                className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center"
                ariaLabel="Read advisory aloud"
              >
                <Volume2 size={18} />
              </Tappable>
            )}
            <Tappable
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center"
              ariaLabel="Close"
            >
              <X size={18} />
            </Tappable>
          </div>
        </div>

        {/* Crop Selector */}
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '8px' }}>
          {t(lang, 'selectCrop')}
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {cropsWithFertilizer.map(crop => (
            <Tappable
              key={crop.id}
              onClick={() => { setSelectedCrop(crop.id); setShowResult(false); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                selectedCrop === crop.id
                  ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                  : 'bg-teal-50/60 text-teal-800 border-teal-200/80 hover:bg-teal-100/50'
              }`}
            >
              {crop.emoji} {crop[lang] || crop.hi}
            </Tappable>
          ))}
        </div>

        {/* Recommended display */}
        {recommended && (
          <div style={{
            background: '#F0FDFA', borderRadius: '14px', padding: '12px 14px',
            marginBottom: '16px', border: '1.5px solid #CCFBF1',
          }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0F766E', margin: '0 0 6px' }}>
              {t(lang, 'recommendedDosage')} (ICAR मानक):
            </p>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#134E4A' }}>
              <span>N: <strong>{recommended.n}</strong></span>
              <span>P₂O₅: <strong>{recommended.p}</strong></span>
              <span>K₂O: <strong>{recommended.k}</strong></span>
              <span style={{ fontSize: '11px', color: '#64748B', alignSelf: 'center' }}>{t(lang, 'kgPerHectare')}</span>
            </div>
          </div>
        )}

        {/* Input Fields */}
        <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '8px' }}>
          {t(lang, 'currentApplication')}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
              {t(lang, 'nitrogenN')}
            </label>
            <input
              type="number" inputMode="numeric" value={appliedN}
              onChange={e => { setAppliedN(e.target.value); setShowResult(false); }}
              placeholder={recommended?.n?.toString() || '120'}
              style={{ ...inputStyle, marginBottom: 0 }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
              {t(lang, 'phosphorusP')}
            </label>
            <input
              type="number" inputMode="numeric" value={appliedP}
              onChange={e => { setAppliedP(e.target.value); setShowResult(false); }}
              placeholder={recommended?.p?.toString() || '60'}
              style={{ ...inputStyle, marginBottom: 0 }}
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '4px' }}>
              {t(lang, 'potassiumK')}
            </label>
            <input
              type="number" inputMode="numeric" value={appliedK}
              onChange={e => { setAppliedK(e.target.value); setShowResult(false); }}
              placeholder={recommended?.k?.toString() || '40'}
              style={{ ...inputStyle, marginBottom: 0 }}
            />
          </div>
        </div>

        {/* Check Button */}
        <Tappable
          onClick={handleCheck}
          className="w-full h-12 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-btn flex items-center justify-center gap-2 mb-4"
        >
          <Search size={16} />
          <span>{t(lang, 'checkDosage')}</span>
        </Tappable>

        {/* Results */}
        {result && recommended && (
          <div style={{ animation: 'slideUp 300ms ease forwards' }}>
            <NutrientBar
              label={t(lang, 'nitrogenN')}
              applied={result.nVal}
              recommended={recommended.n}
              status={result.nStatus}
            />
            <NutrientBar
              label={t(lang, 'phosphorusP')}
              applied={result.pVal}
              recommended={recommended.p}
              status={result.pStatus}
            />
            <NutrientBar
              label={t(lang, 'potassiumK')}
              applied={result.kVal}
              recommended={recommended.k}
              status={result.kStatus}
            />

            {/* Overdose Warning */}
            {result.runoff.isOverdosing ? (
              <div style={{
                background: '#FEF2F2', borderRadius: '16px', padding: '16px',
                border: '1.5px solid #F87171', marginTop: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <AlertTriangle className="text-rose-600" size={20} />
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                    {t(lang, 'overdoseWarning')}
                  </p>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.6 }}>
                  {t(lang, 'runoffWarning').replace('{x}', result.runoff.runoffN)}
                </p>
                <Tappable
                  onClick={saveFertilizerCheck}
                  className="mt-3 w-full h-11 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>{lang === 'hi' ? 'समझ गया, सिफारिश अपनाऊंगा' : 'Got it, will follow recommendation'}</span>
                </Tappable>
              </div>
            ) : (
              <div style={{
                background: '#F0FDFA', borderRadius: '16px', padding: '16px',
                border: '1.5px solid #5EEAD4', marginTop: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 className="text-teal-600" size={20} />
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#0F766E', margin: 0 }}>
                    {t(lang, 'optimalDosage')}
                  </p>
                </div>
                <p style={{ fontSize: '13px', color: '#475569', margin: '6px 0 0', lineHeight: 1.6 }}>
                  {lang === 'hi'
                    ? 'आपकी खाद की मात्रा संतुलित है। फसल स्वस्थ रहेगी और भूजल भी सुरक्षित रहेगा!'
                    : 'Your dosage is optimal. Crop health and groundwater both protected!'}
                </p>
                <Tappable
                  onClick={saveFertilizerCheck}
                  className="mt-3 w-full h-11 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={16} />
                  <span>रिकॉर्ड सहेजें (Save to Log)</span>
                </Tappable>
              </div>
            )}
          </div>
        )}

        {/* Soil Health Card Scheme Direct Cross-Link */}
        <div style={{
          marginTop: '16px', borderRadius: '16px', padding: '14px',
          background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
          border: '1.5px solid #10B981', boxShadow: '0 2px 10px rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>🌱</span>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#065F46' }}>
              {t(lang, 'soilHealthCrossTitle') || 'मुफ्त मिट्टी जांच कराएं (मृदा स्वास्थ्य कार्ड योजना)'}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#047857', margin: 0, lineHeight: 1.4 }}>
            {t(lang, 'soilHealthCrossDesc') || 'खाद खरीदने से पहले अपने खेत की मिट्टी के 12 पोषक तत्वों की मुफ्त सरकारी जांच कराएं। अनावश्यक खाद पर हजारों रुपये बचाएं।'}
          </p>
          <Tappable
            onClick={() => {
              onClose?.();
              setActiveTab('schemes');
            }}
            className="mt-2.5 w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>{t(lang, 'viewSchemeDetails') || 'योजना का विवरण व लाभ देखें →'}</span>
          </Tappable>
        </div>

        {/* Safety disclaimer */}
        <div style={{
          background: '#FFFBEB', borderRadius: '12px', padding: '10px 14px',
          marginTop: '16px', border: '1.5px solid #FDE68A',
        }}>
          <p style={{ fontSize: '12px', color: '#B45309', margin: 0, fontWeight: 600 }}>
            💡 {lang === 'hi'
              ? 'सटीक सलाह के लिए नजदीकी KVK या कृषि विज्ञान केंद्र से संपर्क करें'
              : 'For precise advice, contact your nearest KVK or agricultural center'}
          </p>
        </div>
      </div>

      {showSuccess && (
        <SuccessCheck
          message={lang === 'hi' ? 'खाद सलाह दर्ज हुई!' : 'Advisory saved!'}
          onComplete={() => {
            setShowSuccess(false);
            onClose?.();
          }}
        />
      )}
    </div>
  );
}
