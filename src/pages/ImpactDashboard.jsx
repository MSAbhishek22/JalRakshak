// src/pages/ImpactDashboard.jsx
// Presentation-ready environmental impact dashboard for JalRakshak.
// Sleek deep slate & teal palette with saffron earth accents.
import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp, useT } from '../context/AppContext';
import { useCountUp } from '../hooks/useCountUp';
import Tappable from '../components/common/Tappable';
import {
  calculateTotalSavings,
  calculateWaterLitersSaved,
  calculateCO2Saved,
  calculateVillageDrinkingDays,
  getDailySavingsData,
  WATER_PER_CYCLE_LITERS,
  CO2_KG_PER_SKIPPED_CYCLE,
} from '../utils/savingsCalculator';

// JalRakshak Earth-tone palette
const EARTH = {
  bgDark: '#0F172A',
  bgCard: 'rgba(15, 23, 42, 0.75)',
  bgCardLight: 'rgba(17, 94, 89, 0.35)',
  green1: '#134E4A',
  green2: '#0F766E',
  green3: '#14B8A6',
  green4: '#2DD4BF',
  blue1: '#0369A1',
  blue2: '#0284C7',
  blue3: '#38BDF8',
  earth1: '#D97706',
  earth2: '#F59E0B',
  earth3: '#FDE68A',
  textPrimary: '#F8FAFC',
  textSecondary: 'rgba(248,250,252,0.8)',
  textMuted: 'rgba(248,250,252,0.5)',
};

function AnimatedNumber({ value, suffix = '', prefix = '', duration = 2000 }) {
  const { current } = useCountUp(value, duration);
  return (
    <span>
      {prefix}{typeof current === 'number' ? current.toLocaleString('en-IN') : current}{suffix}
    </span>
  );
}

function BarChart({ data, maxVal, color }) {
  const barMax = maxVal || Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px', width: '100%' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
          <div
            style={{
              width: '100%', maxWidth: '32px',
              height: `${Math.max((d.value / barMax) * 130, 4)}px`,
              background: `linear-gradient(180deg, ${color} 0%, ${color}88 100%)`,
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: `${i * 40}ms`,
              opacity: d.value > 0 ? 1 : 0.3,
            }}
          />
          <span style={{ fontSize: '10px', color: EARTH.textMuted, lineHeight: 1 }}>
            {d.day}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ImpactDashboard({ onBack }) {
  const { user, setActiveTab } = useApp();
  const t = useT();
  const lang = user?.language || 'hi';

  const [irrigationLog, setIrrigationLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('irrigation_log') || '[]'); }
    catch { return []; }
  });

  const [fertilizerLog, setFertilizerLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fertilizer_log') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    const reload = () => {
      try { setIrrigationLog(JSON.parse(localStorage.getItem('irrigation_log') || '[]')); } catch {}
      try { setFertilizerLog(JSON.parse(localStorage.getItem('fertilizer_log') || '[]')); } catch {}
    };
    window.addEventListener('storage', reload);
    return () => window.removeEventListener('storage', reload);
  }, []);

  // Computed metrics
  const totalRupees = calculateTotalSavings(irrigationLog);
  const totalWater = calculateWaterLitersSaved(irrigationLog);
  const totalCO2 = calculateCO2Saved(irrigationLog);
  const villageDays = calculateVillageDrinkingDays(totalWater);
  const totalRunoffAvoided = useMemo(() => {
    return fertilizerLog.reduce((sum, e) => sum + (e.runoffN || 0), 0);
  }, [fertilizerLog]);

  // Chart data (last 15 days)
  const dailyData = useMemo(() => getDailySavingsData(irrigationLog, 15), [irrigationLog]);
  const waterChartData = dailyData.map(d => ({ day: d.day, value: d.waterLiters }));
  const co2ChartData = dailyData.map(d => ({ day: d.day, value: Math.round(d.co2Kg * 10) / 10 }));
  const rupeeChartData = dailyData.map(d => ({ day: d.day, value: d.rupees }));

  const [activeChart, setActiveChart] = useState('water');

  const chartConfig = {
    water: { data: waterChartData, color: EARTH.blue3, label: t('totalWaterSaved') },
    co2: { data: co2ChartData, color: EARTH.green4, label: t('co2Avoided') },
    rupees: { data: rupeeChartData, color: EARTH.earth2, label: `₹ ${t('rupeeSavedSub')}` },
  };

  const skipCount = irrigationLog.filter(e => e.aiSaidSkip && e.didSkip).length;
  const dieselSaved = Math.round(skipCount * 4.28 * 10) / 10;

  const handleBack = () => {
    if (onBack) onBack();
    else setActiveTab('home');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${EARTH.bgDark} 0%, #064E3B 35%, ${EARTH.bgDark} 100%)`,
      color: EARTH.textPrimary,
      padding: '0',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Top Header Bar with Back Button */}
      <div style={{
        padding: '16px 20px 0',
        maxWidth: '900px',
        marginInline: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 20
      }}>
        <Tappable
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white"
          ariaLabel="Back to Home"
        >
          <ArrowLeft size={20} />
        </Tappable>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
          {lang === 'en' ? 'JalRakshak Impact' : 'जल रक्षक प्रभाव डैशबोर्ड'}
        </span>
        <div style={{ width: '40px' }} />
      </div>

      {/* Hero Header */}
      <div style={{
        padding: '24px 20px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '300px', borderRadius: '50%',
          background: `radial-gradient(circle, ${EARTH.green3}33 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(45, 212, 191, 0.15)', border: '1px solid rgba(45, 212, 191, 0.35)',
          borderRadius: '20px', padding: '6px 14px', marginBottom: '16px',
        }}>
          <span style={{ fontSize: '14px' }}>💧</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: EARTH.green4, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
            JalRakshak Impact
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 900,
          margin: '0 0 8px', lineHeight: 1.2,
          background: `linear-gradient(135deg, ${EARTH.textPrimary}, ${EARTH.green4})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {t('impactDashboard')}
        </h1>
        <p style={{ fontSize: '14px', color: EARTH.textSecondary, margin: 0, maxWidth: '400px', marginInline: 'auto' }}>
          {t('missionHeadline')}
        </p>
      </div>

      {/* 3 Hero Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px', padding: '0 20px 24px', maxWidth: '900px', marginInline: 'auto',
      }}>
        {/* Water Saved */}
        <div style={{
          background: `linear-gradient(135deg, ${EARTH.blue1}, #083344)`,
          borderRadius: '20px', padding: '24px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px rgba(3, 105, 161, 0.35)`,
        }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>💧</div>
          <p style={{ fontSize: 'clamp(32px, 6vw, 44px)', fontWeight: 900, margin: '0 0 4px', lineHeight: 1 }}>
            <AnimatedNumber value={totalWater} duration={2500} />
          </p>
          <p style={{ fontSize: '14px', color: EARTH.textSecondary, margin: '0 0 12px' }}>
            {t('litersWaterSaved')}
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
            padding: '8px 12px', fontSize: '13px', color: EARTH.earth3,
          }}>
            {t('villageDrinkingEquiv').replace('{days}', villageDays)}
          </div>
        </div>

        {/* Fertilizer Runoff Avoided */}
        <div style={{
          background: `linear-gradient(135deg, ${EARTH.green1}, #064E3B)`,
          borderRadius: '20px', padding: '24px',
          border: '1px solid rgba(45, 212, 191, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px rgba(15, 118, 110, 0.35)`,
        }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🧪</div>
          <p style={{ fontSize: 'clamp(32px, 6vw, 44px)', fontWeight: 900, margin: '0 0 4px', lineHeight: 1 }}>
            <AnimatedNumber value={Math.round(totalRunoffAvoided * 10) / 10} duration={2000} suffix="" />
          </p>
          <p style={{ fontSize: '14px', color: EARTH.textSecondary, margin: '0 0 12px' }}>
            {t('kgNitrogen')} {t('fertilizerRunoffAvoided').toLowerCase()}
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
            padding: '8px 12px', fontSize: '13px', color: EARTH.earth3,
          }}>
            {lang === 'hi'
              ? `स्थानीय नदियों और कुओं का पानी साफ रखा`
              : `Keeping local rivers and wells clean`}
          </div>
        </div>

        {/* CO₂ Avoided */}
        <div style={{
          background: `linear-gradient(135deg, #1E293B, #0F172A)`,
          borderRadius: '20px', padding: '24px',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px rgba(15, 23, 42, 0.4)`,
        }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌍</div>
          <p style={{ fontSize: 'clamp(32px, 6vw, 44px)', fontWeight: 900, margin: '0 0 4px', lineHeight: 1 }}>
            <AnimatedNumber value={Math.round(totalCO2)} duration={2000} />
          </p>
          <p style={{ fontSize: '14px', color: EARTH.textSecondary, margin: '0 0 12px' }}>
            {t('kgCO2')} {t('co2Avoided').toLowerCase()}
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '10px',
            padding: '8px 12px', fontSize: '13px', color: EARTH.earth3,
          }}>
            ⛽ {dieselSaved} L {t('dieselSaved').toLowerCase()}
          </div>
        </div>
      </div>

      {/* PMKSY Micro-Irrigation Subsidy Thematic Cross-Link */}
      <div style={{ padding: '0 20px 24px', maxWidth: '900px', marginInline: 'auto' }}>
        <Tappable
          onClick={() => setActiveTab('schemes')}
          className="w-full text-left rounded-2xl p-4 transition-all"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.45), rgba(56, 189, 248, 0.25))',
            border: '1.5px solid rgba(45, 212, 191, 0.45)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 28px rgba(15, 118, 110, 0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '16px',
              background: 'rgba(45, 212, 191, 0.2)', border: '1px solid rgba(45, 212, 191, 0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
            }}>
              💧
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                  {t('pmksyCrossTitle') || 'ड्रिप व फव्वारा सिंचाई पर 55% तक सरकारी सब्सिडी (PMKSY)'}
                </span>
                <span style={{ fontSize: '10px', fontWeight: 800, background: '#F59E0B', color: '#0F172A', padding: '2px 8px', borderRadius: '6px' }}>
                  {t('pmksyCrossBadge') || '55% छूट'}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(248,250,252,0.85)', margin: '4px 0 0', lineHeight: 1.4 }}>
                {t('pmksyCrossDesc') || 'जल संरक्षण से सीधे जुड़ी योजना: 40-50% पानी बचाएं और सरकार से 55% वित्तीय सहायता पाएं। योजना विवरण देखें →'}
              </p>
            </div>
          </div>
          <div style={{
            padding: '8px 14px', borderRadius: '12px', background: '#0F766E',
            color: '#FFFFFF', fontSize: '12px', fontWeight: 700, flexShrink: 0,
            boxShadow: '0 2px 8px rgba(15, 118, 110, 0.4)'
          }}>
            {t('viewSchemeCta') || 'योजना देखें →'}
          </div>
        </Tappable>
      </div>

      {/* 15-Day Trend Chart */}
      <div style={{
        margin: '0 20px 24px', maxWidth: '900px', marginInline: 'auto',
        background: EARTH.bgCard, borderRadius: '20px', padding: '24px',
        border: '1px solid rgba(45, 212, 191, 0.2)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
            📊 {t('last15Days')}
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['water', 'co2', 'rupees'].map(key => (
              <Tappable
                key={key}
                onClick={() => setActiveChart(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeChart === key
                    ? 'bg-teal-500 text-slate-900 shadow-sm'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {key === 'water' ? '💧 जल' : key === 'co2' ? '🌍 कार्बन' : '₹ बचत'}
              </Tappable>
            ))}
          </div>
        </div>

        <BarChart
          data={chartConfig[activeChart].data}
          color={chartConfig[activeChart].color}
        />

        <p style={{ fontSize: '12px', color: EARTH.textMuted, textAlign: 'center', marginTop: '14px' }}>
          {chartConfig[activeChart].label} — {t('last15Days')}
        </p>
      </div>

      {/* Money Savings Summary */}
      <div style={{
        margin: '0 20px 24px', maxWidth: '900px', marginInline: 'auto',
        background: `linear-gradient(135deg, rgba(217, 119, 6, 0.25), rgba(245, 158, 11, 0.15))`,
        borderRadius: '20px', padding: '24px',
        border: '1px solid rgba(245, 158, 11, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '32px' }}>💰</span>
          <div>
            <p style={{ fontSize: '28px', fontWeight: 900, margin: 0, color: '#FDE68A' }}>
              ₹<AnimatedNumber value={totalRupees} duration={2000} />
            </p>
            <p style={{ fontSize: '14px', color: EARTH.earth3, margin: '4px 0 0' }}>
              {t('totalSavings')} — {skipCount} {t('timesSaved')}
            </p>
          </div>
        </div>
      </div>

      {/* Assumptions Footer */}
      <div style={{
        padding: '16px 20px 36px', maxWidth: '900px', marginInline: 'auto',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '11px', color: EARTH.textMuted, lineHeight: 1.6 }}>
          {lang === 'hi'
            ? `परिकलन: 1 सिंचाई चक्र = ${WATER_PER_CYCLE_LITERS.toLocaleString()} लीटर (1 हेक्टेयर), डीज़ल पंप से ${CO2_KG_PER_SKIPPED_CYCLE} kg CO₂। ICAR/IPCC मानक।`
            : `Calculations: 1 irrigation cycle = ${WATER_PER_CYCLE_LITERS.toLocaleString()} liters (1 hectare), diesel pump = ${CO2_KG_PER_SKIPPED_CYCLE} kg CO₂. Based on ICAR/IPCC estimates.`}
        </p>
      </div>
    </div>
  );
}
