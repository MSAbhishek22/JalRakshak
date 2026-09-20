import { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Droplets, Wind, Gauge, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWeather, getWeatherEmoji } from '../hooks/useWeather';
import { useApp, useT } from '../context/AppContext';
import { getIrrigationDecision } from '../utils/irrigationLogic';
import { trackEvent, EVENTS } from '../firebase/analytics';
import Tappable from '../components/common/Tappable';

function Skeleton({ width = '100%', height = '20px', radius = '8px', style = {} }) {
  return (
    <div className="skeleton" style={{ width, height, borderRadius: radius, ...style }} />
  );
}

export default function WeatherPage({ onBack }) {
  const { user, setActiveTab } = useApp();
  const t = useT();
  const { weatherData, loading, error, lastUpdated, refetch } = useWeather();
  const [barsVisible, setBarsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    trackEvent(EVENTS.WEATHER_PAGE_VIEWED);
    const tm = setTimeout(() => setBarsVisible(true), 500);
    return () => clearTimeout(tm);
  }, []);

  useEffect(() => {
    if (weatherData) setBarsVisible(true);
  }, [weatherData]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setBarsVisible(false);
    await refetch();
    setRefreshing(false);
    setTimeout(() => setBarsVisible(true), 300);
  };

  const irrigationDecision = weatherData
    ? getIrrigationDecision(weatherData, user.crops?.[0] || 'गेहूं')
    : null;

  const loc = weatherData?.location || {};
  const city = loc.city || user.location?.city || 'आपका क्षेत्र';
  const state = loc.state || user.location?.state || '';

  const lastUpdatedStr = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
    : '';

  const DAY_NAMES_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

  return (
    <div style={{ background: '#FFFBF5', minHeight: '100%', paddingBottom: '90px' }}>
      {/* HERO — Current Weather */}
      <div style={{
        background: 'linear-gradient(160deg, #0F766E 0%, #0D9488 45%, #0369A1 100%)',
        padding: '20px 20px 38px',
        borderRadius: '0 0 32px 32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(15, 118, 110, 0.25)'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-30px', right: '-30px',
          width: '150px', height: '150px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20px', left: '-20px',
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)'
        }} />

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Tappable
              onClick={() => onBack ? onBack() : setActiveTab('home')}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white"
              ariaLabel="Back"
            >
              <ArrowLeft size={18} />
            </Tappable>
            <div>
              <p style={{ fontSize: '15px', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <MapPin size={16} className="text-teal-200" />
                <span>{city}{state ? `, ${state}` : ''}</span>
              </p>
              {lastUpdatedStr && (
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '3px 0 0' }}>
                  अंतिम अपडेट: {lastUpdatedStr}
                </p>
              )}
            </div>
          </div>
          <Tappable
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/15 hover:bg-white/25 border border-white/30 rounded-full px-3.5 py-1.5 text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? t('refreshing') : t('refresh')}</span>
          </Tappable>
        </div>

        {/* Error banner */}
        {error && error !== 'cached' && (
          <div style={{
            background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '12px', padding: '10px 14px', marginBottom: '16px'
          }}>
            <p style={{ fontSize: '13px', color: '#FDE68A', margin: 0 }}>
              📴 ऑफ़लाइन — पुराना डेटा दिखाया जा रहा है
            </p>
          </div>
        )}

        {/* Main temperature */}
        {loading ? (
          <div>
            <Skeleton width="140px" height="68px" radius="12px" style={{ background: 'rgba(255,255,255,0.2)', marginBottom: '14px' }} />
            <Skeleton width="180px" height="20px" radius="8px" style={{ background: 'rgba(255,255,255,0.15)' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                <span style={{ fontSize: '68px', fontWeight: 900, color: '#FFFFFF', lineHeight: 1, letterSpacing: '-2px' }}>
                  {weatherData?.current?.temperature ?? '--'}
                </span>
                <span style={{ fontSize: '26px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', marginTop: '6px' }}>°C</span>
              </div>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.95)', margin: '4px 0 0', fontWeight: 600 }}>
                {weatherData?.current?.description}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>
                महसूस होता है {weatherData?.current?.feelsLike ?? '--'}°C
              </p>
            </div>
            <span style={{ fontSize: '68px', lineHeight: 1, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))' }}>
              {weatherData?.current?.emoji}
            </span>
          </div>
        )}

        {/* Stats row */}
        <div style={{
          display: 'flex', justifyContent: 'space-around',
          marginTop: '20px', paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.2)'
        }}>
          {[
            { Icon: Droplets, label: t('humidity'), value: loading ? '--' : `${weatherData?.current?.humidity ?? '--'}%` },
            { Icon: Wind, label: t('wind'), value: loading ? '--' : `${weatherData?.current?.windSpeed ?? '--'} km/h` },
            { Icon: Gauge, label: t('pressure'), value: loading ? '--' : `${weatherData?.current?.pressure ?? '--'} hPa` },
          ].map(stat => {
            const StatIcon = stat.Icon;
            return (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', margin: '0 0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <StatIcon size={12} />
                  <span>{stat.label}</span>
                </p>
                <p style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* IRRIGATION DECISION CARD */}
      <div style={{ margin: '-20px 16px 0', position: 'relative', zIndex: 10 }}>
        {loading ? (
          <Skeleton height="80px" radius="16px" style={{ background: '#FFFFFF', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
        ) : irrigationDecision && (
          <div style={{
            background: '#FFFFFF', borderRadius: '18px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '16px 18px',
            border: '1px solid #E2E8F0',
            borderLeft: `5px solid ${irrigationDecision.color}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '28px' }}>{irrigationDecision.icon}</span>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 800, color: irrigationDecision.color, margin: 0 }}>
                    {irrigationDecision.decision === 'skip' ? 'आज पानी मत दें (जल बचत)' : t('irrigateToday')}
                  </p>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                    {irrigationDecision.reason}
                  </p>
                </div>
              </div>
              <div style={{
                background: irrigationDecision.decision === 'skip' ? '#F0F9FF' : '#F0FDFA',
                border: `1px solid ${irrigationDecision.decision === 'skip' ? '#BAE6FD' : '#99F6E4'}`,
                borderRadius: '12px', padding: '6px 10px', textAlign: 'center'
              }}>
                <p style={{ fontSize: '20px', fontWeight: 900, color: irrigationDecision.color, margin: 0 }}>
                  {weatherData?.rainProbabilityNext24h ?? 0}%
                </p>
                <p style={{ fontSize: '10px', color: '#64748B', margin: 0 }}>बारिश</p>
              </div>
            </div>
            <Tappable
              onClick={() => setActiveTab('savings')}
              className="w-full mt-3 h-11 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-btn flex items-center justify-center gap-1.5"
            >
              <span>{t('logAndSee')}</span>
              <ArrowRight size={14} />
            </Tappable>
          </div>
        )}
      </div>

      {/* 7-DAY FORECAST */}
      <div style={{ padding: '24px 16px 0' }}>
        <p style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
          {t('sevenDayForecast')}
        </p>
        {loading ? (
          Array(7).fill(0).map((_, i) => (
            <Skeleton key={i} height="56px" radius="14px" style={{ marginBottom: '8px' }} />
          ))
        ) : (
          (weatherData?.daily?.dates || []).map((date, idx) => {
            const d = new Date(date + 'T00:00:00');
            const dayName = idx === 0 ? t('today') : idx === 1 ? t('tomorrow') : DAY_NAMES_HI[d.getDay()];
            const rain = weatherData.daily.rainProbabilities[idx] ?? 0;
            const max = weatherData.daily.maxTemps[idx] ?? '--';
            const min = weatherData.daily.minTemps[idx] ?? '--';
            const emoji = getWeatherEmoji(weatherData.daily.weatherCodes[idx] ?? 0);

            const borderColor = rain > 80 ? '#EF4444' : rain > 60 ? '#0284C7' : rain > 30 ? '#F59E0B' : 'transparent';

            return (
              <div key={date} style={{
                background: '#FFFFFF', borderRadius: '14px',
                padding: '0 16px', height: '58px', marginBottom: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #F1F5F9',
                borderLeft: `4px solid ${borderColor}`,
                transition: 'transform 150ms ease',
              }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', width: '54px' }}>
                  {dayName}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{emoji}</span>
                  {rain > 15 && (
                    <span style={{
                      fontSize: '11px', fontWeight: 700,
                      color: rain > 60 ? '#B91C1C' : rain > 30 ? '#0369A1' : '#B45309',
                      background: rain > 60 ? '#FEF2F2' : rain > 30 ? '#F0F9FF' : '#FFFBEB',
                      padding: '2px 8px', borderRadius: '10px'
                    }}>
                      {rain}%
                    </span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{max}°</span>
                  <span style={{ fontSize: '12px', color: '#94A3B8', margin: '0 4px' }}>/</span>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{min}°</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RAIN PROBABILITY CHART */}
      <div style={{ padding: '20px 16px' }}>
        <p style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>{t('rainChart')}</p>
        <div style={{
          background: '#FFFFFF', borderRadius: '18px', padding: '20px 12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0'
        }}>
          <div style={{ height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '4px' }}>
            {loading
              ? Array(7).fill(0).map((_, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Skeleton width="100%" height="60px" radius="4px 4px 0 0" style={{ marginBottom: '4px' }} />
                    <Skeleton width="24px" height="10px" radius="4px" />
                  </div>
                ))
              : (weatherData?.daily?.rainProbabilities || Array(7).fill(0)).map((prob, idx) => {
                  const date = weatherData?.daily?.dates?.[idx];
                  const d = date ? new Date(date + 'T00:00:00') : null;
                  const dayLabel = idx === 0 ? t('today') : idx === 1 ? t('tomorrow') : d ? DAY_NAMES_HI[d.getDay()] : `D${idx + 1}`;
                  const barH = Math.max((prob / 100) * 110, 4);
                  const color = prob <= 20 ? '#14B8A6' : prob <= 50 ? '#38BDF8' : prob <= 75 ? '#F59E0B' : '#EF4444';
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color, marginBottom: '4px' }}>{prob}%</span>
                      <div style={{
                        width: '100%', background: color, borderRadius: '6px 6px 2px 2px',
                        height: barsVisible ? `${barH}px` : '4px',
                        transition: `height 700ms cubic-bezier(0.34,1.56,0.64,1) ${idx * 60}ms`,
                        boxShadow: `0 2px 8px ${color}30`,
                      }} />
                      <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '6px' }}>{dayLabel}</span>
                    </div>
                  );
                })
            }
          </div>
        </div>
      </div>

      {/* HOURLY FORECAST */}
      <div style={{ padding: '0 16px 24px' }}>
        <p style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>{t('hourlyForecast')}</p>
        <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '8px' }} className="hide-scrollbar">
          {loading
            ? Array(8).fill(0).map((_, i) => (
                <div key={i} className="skeleton" style={{ minWidth: '68px', height: '96px', borderRadius: '14px', flexShrink: 0 }} />
              ))
            : (weatherData?.hourly?.times || [])
                .filter((_, i) => i % 3 === 0)
                .slice(0, 8)
                .map((time, idx) => {
                  const actualIdx = idx * 3;
                  const temp = weatherData.hourly.temperatures[actualIdx];
                  const rain = weatherData.hourly.rainProbabilities[actualIdx];
                  const code = weatherData.hourly.weatherCodes[actualIdx];
                  const timeStr = new Date(time).toLocaleTimeString('hi-IN', {
                    hour: '2-digit', minute: '2-digit', hour12: true
                  });
                  const isNow = actualIdx === 0;
                  return (
                    <div key={time} style={{
                      minWidth: '74px', height: '98px',
                      background: isNow ? 'linear-gradient(135deg, #CCFBF1, #99F6E4)' : '#FFFFFF',
                      borderRadius: '14px', padding: '10px 6px', textAlign: 'center', flexShrink: 0,
                      boxShadow: isNow ? '0 4px 12px rgba(15,118,110,0.15)' : '0 1px 3px rgba(0,0,0,0.06)',
                      border: isNow ? '1.5px solid #14B8A6' : '1px solid #E2E8F0',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                      <span style={{ fontSize: '11px', color: isNow ? '#0F766E' : '#94A3B8', fontWeight: isNow ? 700 : 500 }}>
                        {isNow ? t('now') : timeStr}
                      </span>
                      <span style={{ fontSize: '24px' }}>{getWeatherEmoji(code ?? 0)}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{temp ?? '--'}°</span>
                      {rain > 15 && (
                        <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: 700 }}>{rain}%</span>
                      )}
                    </div>
                  );
                })
          }
        </div>
      </div>
    </div>
  );
}
