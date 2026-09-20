// src/components/SavingsTracker.jsx — Water-first savings snapshot on HomePage
import React from 'react';
import { t } from '../i18n/index';
import { storage } from '../utils/storage';
import {
  calculateTotalSavings,
  calculateWaterLitersSaved,
  calculateVillageDrinkingDays,
} from '../utils/savingsCalculator';
import { useCountUp } from '../hooks/useCountUp';
import Tappable from './common/Tappable';

export default function SavingsTracker({ language, onNavigate }) {
  const irrigationLog = storage.get('irrigation_log') || [];
  const totalSavings = calculateTotalSavings(irrigationLog);
  const totalWater = calculateWaterLitersSaved(irrigationLog);
  const villageDays = calculateVillageDrinkingDays(totalWater);

  const { current: displayWater } = useCountUp(totalWater, 2000);
  const { current: displayAmount } = useCountUp(totalSavings, 1500);

  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 40%, #0369A1 100%)',
        boxShadow: '0 8px 24px rgba(15, 118, 110, 0.35)',
      }}
    >
      {/* Water Hero */}
      <div style={{ padding: '24px 20px 16px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.18)', borderRadius: '20px',
          padding: '4px 12px', marginBottom: '12px',
          border: '1px solid rgba(255,255,255,0.25)'
        }}>
          <span style={{ fontSize: '14px' }}>💧</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#CCFBF1', letterSpacing: '0.5px' }}>
            {t(language, 'waterSavedHero')}
          </span>
        </div>

        <p style={{
          fontSize: 'clamp(28px, 8vw, 40px)', fontWeight: 900, color: '#FFFFFF',
          margin: '0 0 4px', lineHeight: 1.1, letterSpacing: '-0.5px', wordBreak: 'break-word',
        }}>
          {displayWater.toLocaleString('en-IN')}
        </p>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          {t(language, 'litersWaterSaved')}
        </p>

        {/* Village equivalent */}
        {villageDays > 0 && (
          <p style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.85)',
            margin: '8px 0 0', fontWeight: 600
          }}>
            {t(language, 'villageDrinkingEquiv').replace('{days}', villageDays)}
          </p>
        )}

        {/* Plain language farmer benefit explainer */}
        <div style={{
          marginTop: '10px',
          background: 'rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '8px 12px',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <p style={{ fontSize: '12px', color: '#F0FDFA', margin: 0, lineHeight: 1.4, fontWeight: 500 }}>
            {t(language, 'whyWaterHelps')}
          </p>
        </div>
      </div>

      {/* Rupee savings - secondary */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.25)', padding: '14px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div>
          <p style={{ fontSize: '22px', fontWeight: 800, color: '#FDE68A', margin: 0 }}>
            ₹{displayAmount.toLocaleString('en-IN')}
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0' }}>
            {t(language, 'rupeeSavedSub')}
          </p>
        </div>
        <Tappable
          onClick={() => onNavigate?.('impact')}
          className="bg-white/20 hover:bg-white/30 text-white rounded-xl px-3.5 py-2 text-xs font-semibold border border-white/30 shadow-sm"
        >
          {t(language, 'viewDetails')}
        </Tappable>
      </div>
    </div>
  );
}
