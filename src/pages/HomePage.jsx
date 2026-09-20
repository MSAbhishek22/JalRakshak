// src/pages/HomePage.jsx — JalRakshak Water & Soil Guardian Dashboard
import React, { useState } from 'react';
import {
  MessageCircle,
  CloudSun,
  TrendingUp,
  Droplets,
  Users,
  Settings2,
  Bell,
  Sparkles,
  FlaskConical,
  Building2,
  BookOpen,
  Bug,
  PhoneCall,
  Calendar,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp, useT } from '../context/AppContext';
import { useWeather } from '../hooks/useWeather';
import { useNotifications } from '../hooks/useNotifications';
import { useCountUp } from '../hooks/useCountUp';
import { getWeatherEmoji, getWeatherCondition } from '../api/weather';
import FarmerHook from '../components/FarmerHook';
import SavingsTracker from '../components/SavingsTracker';
import ForecastStrip from '../components/weather/ForecastStrip';
import FertilizerAdvisory from '../components/FertilizerAdvisory';
import Tappable from '../components/common/Tappable';
import { WeatherCardSkeleton, ForecastStripSkeleton } from '../components/common/LoadingSpinner';
import { getIrrigationDecision } from '../utils/irrigationLogic';

export default function HomePage() {
  const { user, setActiveTab } = useApp();
  const t = useT();
  const { weatherData, loading, error } = useWeather();
  const { permission, requestPermission } = useNotifications();

  const [showSchemesModal, setShowSchemesModal] = useState(false);
  const [showCropGuideModal, setShowCropGuideModal] = useState(false);
  const [showPestModal, setShowPestModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showFertilizerModal, setShowFertilizerModal] = useState(false);

  const lang = user.language || 'hi';
  const userName = user.name || '';
  const hour = new Date().getHours();
  const greetingKey = hour < 12 ? 'goodMorning' : hour < 17 ? 'goodAfternoon' : hour < 20 ? 'goodEvening' : 'goodNight';
  const greeting = t(greetingKey) || (hour < 12 ? 'सुप्रभात' : hour < 17 ? 'नमस्ते' : hour < 20 ? 'शुभ संध्या' : 'शुभ रात्रि');
  const greetingEmoji = hour < 12 ? '🌅' : hour < 17 ? '☀️' : hour < 20 ? '🌇' : '🌙';

  const irrigationDecision = weatherData ? getIrrigationDecision(weatherData, user.crops?.[0] || 'गेहूं') : null;

  const temp = weatherData?.temperatureCelsius || 0;
  const { current: displayTemp } = useCountUp(Math.round(temp), 1000);
  const rainProb = weatherData?.rainProbabilityNext24h || 0;
  const weatherEmoji = getWeatherEmoji(rainProb, temp);
  const condition = getWeatherCondition(rainProb, temp, lang);

  return (
    <div
      className="min-h-screen bg-surface-light pb-24 px-4 pt-3 scroll-container"
      style={{ paddingBottom: 'max(88px, calc(68px + env(safe-area-inset-bottom)))' }}
    >
      {/* Top Header + JalRakshak Guardian Badge */}
      <div className="flex items-center justify-between h-14">
        <div className="flex items-center gap-2">
          <span className="text-xl">💧</span>
          <div>
            <span className="text-base font-extrabold text-slate-800 leading-none block">
              {userName ? (lang === 'en' ? `${userName}'s Farm` : `${userName} ${t('fieldOf')}`) : t('myField')}
            </span>
            <span className="text-[11px] text-teal-700 font-semibold">
              {t('waterGuardian') || 'जल रक्षक • किसान साथी'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Water & Soil Guardian Badge */}
          <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 rounded-full px-2.5 py-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span className="text-[11px] font-bold text-teal-800 tracking-wide">
              JalRakshak
            </span>
          </div>

          <Tappable
            onClick={async () => {
              if (permission !== 'granted') {
                const res = await requestPermission();
                if (res) alert('सूचनाएं चालू हो गईं!');
                else alert('सूचनाएं चालू नहीं हो सकीं। सेटिंग्स देखें।');
              } else {
                alert('सूचनाएं पहले से चालू हैं!');
              }
            }}
            className="w-10 h-10 bg-white rounded-full border border-slate-200 shadow-card flex items-center justify-center relative text-slate-600"
            ariaLabel="Notifications"
          >
            <Bell size={18} />
            {permission !== 'granted' && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            )}
          </Tappable>

          {user.name && (
            <div className="w-8 h-8 rounded-full bg-teal-800 text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Mission Headline + Water Saved Hero */}
      <div
        className="mt-2 rounded-3xl animate-slide-down overflow-hidden border border-teal-800/40"
        style={{
          background: 'linear-gradient(135deg, #0F766E 0%, #115E59 50%, #0F172A 100%)',
          boxShadow: '0 12px 32px rgba(15, 118, 110, 0.25)',
        }}
      >
        {/* Mission text */}
        <div className="pt-4 pb-1 px-5 text-center">
          <p className="text-xs font-semibold text-teal-200 tracking-wide">
            {t('missionHeadline') || '💧 हर बूंद की रक्षा — आपका जल एवं मिट्टी संरक्षक'}
          </p>
        </div>

        {/* Water Saved Hero Stat */}
        <div className="p-4">
          <SavingsTracker language={lang} onNavigate={setActiveTab} />
        </div>
      </div>

      {/* Greeting + Weather Card */}
      <div
        className="mt-4 rounded-3xl p-5 animate-slide-down border border-teal-600/30 text-white"
        style={{
          background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 60%, #134E4A 100%)',
          boxShadow: '0 8px 24px rgba(13, 148, 136, 0.25)',
        }}
      >
        <p className="text-xl font-black">
          {greeting}{userName ? `, ${userName}${lang === 'en' ? '' : ' जी'}` : '!'} {greetingEmoji}
        </p>
        <p className="text-xs text-teal-100 mt-1 font-medium">
          {irrigationDecision ? (irrigationDecision.decision === 'skip' ? t('skipToday') : t('irrigateToday')) : ''}
        </p>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/15">
          <div>
            <span className="text-3xl font-black tracking-tight">
              {weatherData ? displayTemp : '--'}°C
            </span>
            <p className="text-xs text-teal-100 mt-0.5">{condition}</p>
          </div>
          <span className="text-4xl filter drop-shadow">{weatherEmoji}</span>
        </div>
      </div>

      {/* First-Time Farmer Orientation Bar */}
      <div className="mt-3 bg-white border border-teal-200/90 rounded-2xl p-3 shadow-xs">
        <p className="text-[11px] font-extrabold text-teal-900 flex items-center gap-1.5">
          <span>👉</span>
          <span>{t('firstStepsTitle') || 'सबसे पहले क्या करें? (शुरुआती किसानों के लिए)'}</span>
        </p>
        <div className="flex gap-2 mt-2 overflow-x-auto hide-scrollbar">
          <Tappable
            onClick={() => setActiveTab('weather')}
            className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl text-[11px] font-bold text-sky-900 whitespace-nowrap flex items-center gap-1 shadow-2xs"
          >
            <span>{t('stepWeather') || '1. 🌦️ आज की मौसम व सिंचाई सलाह'}</span>
          </Tappable>
          <Tappable
            onClick={() => setActiveTab('ai')}
            className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl text-[11px] font-bold text-teal-900 whitespace-nowrap flex items-center gap-1 shadow-2xs"
          >
            <span>{t('stepAI') || '2. 🤖 AI किसान मित्र से सवाल'}</span>
          </Tappable>
          <Tappable
            onClick={() => setActiveTab('schemes')}
            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-900 whitespace-nowrap flex items-center gap-1 shadow-2xs"
          >
            <span>{t('stepSchemes') || '3. 🏛️ सरकारी योजनाएं व सब्सिडी'}</span>
          </Tappable>
        </div>
      </div>

      {/* Farmer Hook Card (Decision callout) */}
      <div className="mt-4">
        {loading ? <WeatherCardSkeleton /> : <FarmerHook irrigationDecision={irrigationDecision} language={lang} />}
      </div>

      {/* Today's Forecast Strip */}
      <div className="mt-4">
        {loading ? (
          <ForecastStripSkeleton />
        ) : (
          <ForecastStrip hourlyData={weatherData?.raw?.hourly} label={t('todayForecast')} />
        )}
      </div>

      {/* Prominent Govt Schemes & Subsidies Home Card */}
      <div className="mt-5">
        <Tappable
          onClick={() => setActiveTab('schemes')}
          className="w-full text-left rounded-3xl p-4 transition-all border border-teal-300 bg-gradient-to-r from-teal-50 via-emerald-50 to-amber-50 shadow-card flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-slate-900">
                  {t('schemesCardTitle') || 'सरकारी योजनाएं व सब्सिडी'}
                </h4>
                <span className="text-[10px] font-extrabold bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                  {t('schemesBadge') || '5 योजनाएं'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug font-medium">
                {t('schemesCardSub') || 'PM-KISAN (₹6000), PMFBY फसल बीमा, KCC 4% ऋण, 55% ड्रिप सब्सिडी'}
              </p>
            </div>
          </div>
          <div className="p-2 bg-white rounded-xl text-teal-800 shadow-xs flex-shrink-0">
            <ArrowRight size={18} />
          </div>
        </Tappable>
      </div>

      {/* Quick Actions Grid (6 actions: AI, Weather, Mandi, Community, Impact, Settings) */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-1 px-1">
          <h3 className="text-sm font-bold text-slate-800">{t('quickServices') || 'त्वरित सेवाएं'}</h3>
          <span className="text-xs text-teal-700 font-semibold">{t('oneTapOpen') || '1-टैप में खोलें'}</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-2.5 px-1 font-medium">
          {t('quickServicesDesc') || 'खेती के मुख्य कार्य — मौसम, दैनिक मंडी दर, AI सलाह और अनुभवी किसान चर्चा'}
        </p>

        <div className="grid grid-cols-2 gap-3">
          {[
            {
              id: 'ai',
              Icon: MessageCircle,
              title: 'AI से पूछें',
              sub: 'बोलकर या लिखकर',
              tab: 'ai',
              bg: 'bg-teal-50 border-teal-200 text-teal-800',
              iconColor: 'text-teal-700'
            },
            {
              id: 'weather',
              Icon: CloudSun,
              title: t('sevenDayWeather') || '7 दिन मौसम',
              sub: 'वर्षा का पूरा हाल',
              tab: 'weather',
              bg: 'bg-sky-50 border-sky-200 text-sky-900',
              iconColor: 'text-sky-600'
            },
            {
              id: 'mandi',
              Icon: TrendingUp,
              title: t('mandiPrices') || 'मंडी भाव',
              sub: 'दैनिक बाजार दर',
              tab: 'mandi',
              bg: 'bg-amber-50 border-amber-200 text-amber-900',
              iconColor: 'text-amber-600'
            },
            {
              id: 'community',
              Icon: Users,
              title: t('communityTips') || 'किसान चर्चा',
              sub: 'अनुभवी किसानों के टिप्स',
              tab: 'community',
              bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
              iconColor: 'text-emerald-700'
            },
            {
              id: 'impact',
              Icon: Droplets,
              title: t('impact') || 'जल प्रभाव',
              sub: 'पर्यावरणीय बचत',
              tab: 'impact',
              bg: 'bg-cyan-50 border-cyan-200 text-cyan-900',
              iconColor: 'text-cyan-700'
            },
            {
              id: 'settings',
              Icon: Settings2,
              title: t('settings') || 'सेटिंग',
              sub: 'भाषा व फसल',
              tab: 'settings',
              bg: 'bg-slate-50 border-slate-200 text-slate-800',
              iconColor: 'text-slate-600'
            },
          ].map((action) => {
            const ActionIcon = action.Icon;
            return (
              <Tappable
                key={action.id}
                onClick={() => setActiveTab(action.tab)}
                className={`p-3.5 rounded-2xl border shadow-card flex items-center gap-3 text-left w-full ${action.bg}`}
              >
                <div className={`p-2 rounded-xl bg-white/80 shadow-sm ${action.iconColor}`}>
                  <ActionIcon size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">{action.title}</p>
                  <p className="text-[11px] opacity-75 mt-0.5 leading-tight">{action.sub}</p>
                </div>
              </Tappable>
            );
          })}
        </div>
      </div>

      {/* Farmer Tools Horizontal Strip */}
      <div className="mt-6">
        <div className="flex justify-between items-center px-1 mb-1">
          <p className="text-sm font-extrabold text-slate-800">
            🛠️ {t('farmerTools') || 'किसान के औज़ार'}
          </p>
          <span className="text-xs text-slate-500 font-medium">{t('swipe') || 'स्वाइप करें →'}</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-2.5 px-1 font-medium">
          {t('farmerToolsDesc') || 'खाद मात्रा कैलकुलेटर, सरकारी योजनाएं, मंडी भाव और कॉल सेंटर'}
        </p>

        <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
          {[
            {
              Icon: FlaskConical,
              title: t('fertilizerAdvisory') || 'खाद सलाहकार',
              desc: 'NPK पोषक संतुलन',
              bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
              iconColor: 'text-emerald-700',
              action: () => setShowFertilizerModal(true)
            },
            {
              Icon: TrendingUp,
              title: t('mandiPrices') || 'मंडी भाव',
              desc: 'APMC बाजार दर',
              bg: 'bg-amber-50 border-amber-200 text-amber-900',
              iconColor: 'text-amber-700',
              action: () => setActiveTab('mandi')
            },
            {
              Icon: Users,
              title: t('communityTips') || 'किसान चौपाल',
              desc: 'सत्यापित अनुभव',
              bg: 'bg-teal-50 border-teal-200 text-teal-900',
              iconColor: 'text-teal-700',
              action: () => setActiveTab('community')
            },
            {
              Icon: Building2,
              title: t('govtSchemes') || 'सरकारी योजनाएं',
              desc: 'PM-KISAN, PMFBY',
              bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
              iconColor: 'text-indigo-700',
              action: () => setActiveTab('schemes')
            },
            {
              Icon: BookOpen,
              title: t('cropGuide') || 'फसल गाइड',
              desc: 'गेहूं, धान, सब्जियां',
              bg: 'bg-orange-50 border-orange-200 text-orange-900',
              iconColor: 'text-orange-700',
              action: () => setShowCropGuideModal(true)
            },
            {
              Icon: Bug,
              title: t('pestGuide') || 'कीट व बीमारी',
              desc: 'पहचानें व उपाय करें',
              bg: 'bg-rose-50 border-rose-200 text-rose-900',
              iconColor: 'text-rose-700',
              action: () => setShowPestModal(true)
            },
            {
              Icon: PhoneCall,
              title: t('helpline') || 'किसान हेल्पलाइन',
              desc: '1800-180-1551',
              bg: 'bg-teal-50 border-teal-200 text-teal-900',
              iconColor: 'text-teal-700',
              action: () => window.open('tel:18001801551')
            },
            {
              Icon: Calendar,
              title: t('farmCalendar') || 'खेती कैलेंडर',
              desc: 'कब बोएं, कब काटें',
              bg: 'bg-purple-50 border-purple-200 text-purple-900',
              iconColor: 'text-purple-700',
              action: () => setShowCalendarModal(true)
            },
          ].map((tool) => {
            const ToolIcon = tool.Icon;
            return (
              <Tappable
                key={tool.title}
                onClick={tool.action}
                className={`min-w-[155px] h-[108px] rounded-2xl border p-3.5 flex flex-col justify-between text-left flex-shrink-0 shadow-card ${tool.bg}`}
              >
                <div className={`w-8 h-8 rounded-xl bg-white/80 shadow-xs flex items-center justify-center ${tool.iconColor}`}>
                  <ToolIcon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight line-clamp-1">{tool.title}</p>
                  <p className="text-[10px] opacity-75 mt-0.5 leading-tight line-clamp-1">{tool.desc}</p>
                </div>
              </Tappable>
            );
          })}
        </div>
      </div>

      {/* Fertilizer Advisory Modal */}
      {showFertilizerModal && (
        <FertilizerAdvisory language={lang} onClose={() => setShowFertilizerModal(false)} />
      )}

      {/* Govt Schemes Modal */}
      {showSchemesModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-0"
          onClick={() => setShowSchemesModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto hide-scrollbar shadow-modal animate-slide-up"
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="text-teal-600" size={22} />
                <span>सरकारी योजनाएं (Govt Schemes)</span>
              </h2>
              <Tappable
                onClick={() => setShowSchemesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                ariaLabel="Close"
              >
                <X size={18} />
              </Tappable>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: 'PM-KISAN (पीएम किसान)',
                  benefit: '₹6,000 प्रति वर्ष — ₹2000 की तीन किस्तों में सीधे बैंक खाते में',
                  who: 'सभी छोटे व सीमांत किसान परिवार',
                  how: 'pmkisan.gov.in या नजदीकी CSC केंद्र पर e-KYC करवाएं',
                  helpline: '155261'
                },
                {
                  name: 'PMFBY — फसल बीमा योजना',
                  benefit: 'सूखा, बाढ़ या ओलावृष्टि से फसल नुकसान पर पूरा मुआवज़ा',
                  who: 'खरीफ, रबी व बागवानी करने वाले सभी किसान',
                  how: 'बुआई के 10 दिन के अंदर बैंक शाखा या कृषि मित्र से संपर्क करें',
                  helpline: '14447'
                },
                {
                  name: 'KCC — किसान क्रेडिट कार्ड',
                  benefit: '₹3 लाख तक का कृषि ऋण मात्र 4% रियायती ब्याज दर पर',
                  who: 'सभी भूस्वामी एवं बटाईदार किसान',
                  how: 'नजदीकी ग्रामीण या राष्ट्रीयकृत बैंक में जमीन के दस्तावेज जमा करें',
                  helpline: null
                },
                {
                  name: 'मृदा स्वास्थ्य कार्ड (Soil Health Card)',
                  benefit: 'खेत की मिट्टी के 12 पोषक तत्वों की मुफ्त जांच व सही खाद की सलाह',
                  who: 'प्रत्येक किसान के लिए 3 वर्ष में एक बार मुफ्त',
                  how: 'नजदीकी कृषि विज्ञान केंद्र (KVK) या ग्राम कृषि सहायक से संपर्क करें',
                  helpline: null
                },
                {
                  name: 'PM किसान मानधन योजना',
                  benefit: '60 वर्ष की आयु के बाद ₹3,000 प्रति माह निश्चित पेंशन',
                  who: '18 से 40 वर्ष के छोटे और सीमांत किसान',
                  how: 'maandhan.in पर या नजदीकी जन सेवा केंद्र (CSC) से आवेदन करें',
                  helpline: '18002676888'
                }
              ].map((s) => (
                <div key={s.name} className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
                  <h3 className="font-bold text-teal-800 text-sm">{s.name}</h3>
                  <p className="text-xs text-slate-700 mt-1.5">
                    <strong>लाभ:</strong> {s.benefit}
                  </p>
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>पात्रता:</strong> {s.who}
                  </p>
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>आवेदन:</strong> {s.how}
                  </p>
                  {s.helpline && (
                    <Tappable
                      onClick={() => window.open(`tel:${s.helpline}`)}
                      className="mt-3 w-full py-2 bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-btn"
                    >
                      <PhoneCall size={14} />
                      <span>हेल्पलाइन {s.helpline} पर कॉल करें</span>
                    </Tappable>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Crop Guide Modal */}
      {showCropGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-0"
          onClick={() => setShowCropGuideModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto hide-scrollbar shadow-modal animate-slide-up"
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="text-amber-600" size={22} />
                <span>फसल ज्ञान गाइड (Crop Guide)</span>
              </h2>
              <Tappable
                onClick={() => setShowCropGuideModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                ariaLabel="Close"
              >
                <X size={18} />
              </Tappable>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: 'गेहूं (Wheat)',
                  season: 'रबी (अक्टूबर-मार्च)',
                  water: 'हर 10-12 दिन (सीआरआई, कल्ले, गांठ, बाली पर आवश्यक)',
                  fertilizer: 'DAP 50kg/एकड़ बुआई पर, यूरिया दो बार में',
                  tip: 'पीला रस्ट दिखे तो प्रोपिकोनाजोल छिड़कें — KVK से मात्रा पूछें'
                },
                {
                  name: 'धान / चावल (Paddy)',
                  season: 'खरीफ (जून-नवंबर)',
                  water: '5-7 दिन में सिंचाई, बालियों के बाद पानी रोकें',
                  fertilizer: 'DAP + पोटाश बुआई पर, जिंक सल्फेट 10kg/एकड़',
                  tip: '24 घंटे से ज्यादा पानी खड़ा न रहने दें — जड़ सड़न रुकती है'
                },
                {
                  name: 'सब्जियां (Vegetables)',
                  season: 'वर्ष पर्यंत (Seasonal)',
                  water: 'गर्मी में 2-3 दिन, शीत ऋतु में 5-7 दिन',
                  fertilizer: 'सड़ी गोबर खाद + सूक्ष्म पोषक तत्व',
                  tip: 'नीम तेल 5ml/लीटर का साप्ताहिक छिड़काव कीड़ों से बचाता है'
                },
                {
                  name: 'आलू (Potato)',
                  season: 'रबी (अक्टूबर-जनवरी)',
                  water: 'हल्की सिंचाई हर 7-10 दिन, कंद बनते समय नमी जरूरी',
                  fertilizer: 'पोटाश 40kg/एकड़ अनिवार्य कंदों के आकार के लिए',
                  tip: 'झुलसा रोग से बचाव हेतु मैंकोजेब का सुरक्षात्मक छिड़काव करें'
                }
              ].map((c) => (
                <div key={c.name} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <h3 className="font-bold text-teal-800 text-sm">{c.name}</h3>
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>मौसम:</strong> {c.season}
                  </p>
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>सिंचाई:</strong> {c.water}
                  </p>
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>खाद:</strong> {c.fertilizer}
                  </p>
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-amber-900 text-xs font-medium">
                    💡 <strong>सलाह:</strong> {c.tip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pest Guide Modal */}
      {showPestModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-0"
          onClick={() => setShowPestModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto hide-scrollbar shadow-modal animate-slide-up"
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Bug className="text-rose-600" size={22} />
                <span>कीट एवं रोग प्रबंधन (Pest Guide)</span>
              </h2>
              <Tappable
                onClick={() => setShowPestModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                ariaLabel="Close"
              >
                <X size={18} />
              </Tappable>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 text-xs text-amber-900 font-semibold">
              ⚠️ रासायनिक कीटनाशक के प्रयोग से पहले KVK विशेषज्ञ से अनुशंसित मात्रा जरूर जांचें।
            </div>

            <div className="space-y-2.5">
              {[
                {
                  pest: 'माहू (Aphids)',
                  sign: 'पत्तियों पर छोटे हरे/काले कीड़े, पत्तियां मुड़कर पीली होना',
                  remedy: 'नीम तेल (5ml/L) या हल्का साबुन पानी स्प्रे करें'
                },
                {
                  pest: 'तना छेदक (Stem Borer)',
                  sign: 'तने में बारीक छेद और बीच की पत्ती सूखना (dead heart)',
                  remedy: 'फेरोमोन ट्रैप लगाएं और ट्राइकोग्रामा कार्ड का उपयोग करें'
                },
                {
                  pest: 'पत्ती झुलसा (Blight)',
                  sign: 'पत्तियों के किनारों पर भूरे या काले जलने जैसे धब्बे',
                  remedy: 'ट्राइकोडर्मा जैव कवकनाशी या अनुशंसित कॉपर ऑक्सीक्लोराइड'
                },
                {
                  pest: 'सफेद मक्खी (Whitefly)',
                  sign: 'पत्तियों की निचली सतह पर सफेद कीट, चिपचिपा पदार्थ',
                  remedy: 'पीले चिपचिपे ट्रैप लगाएं (10 ट्रैप/एकड़)'
                }
              ].map((item) => (
                <div key={item.pest} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
                  <h3 className="font-bold text-rose-700 text-sm">{item.pest}</h3>
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>पहचान:</strong> {item.sign}
                  </p>
                  <p className="text-xs text-slate-700 mt-1">
                    <strong>उपाय:</strong> {item.remedy}
                  </p>
                </div>
              ))}
            </div>

            <Tappable
              onClick={() => window.open('tel:18001801551')}
              className="w-full mt-4 py-3 bg-teal-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-btn"
            >
              <PhoneCall size={16} />
              <span>📞 किसान कॉल सेंटर: 1800-180-1551</span>
            </Tappable>
          </div>
        </div>
      )}

      {/* Farm Calendar Modal */}
      {showCalendarModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center p-0"
          onClick={() => setShowCalendarModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto hide-scrollbar shadow-modal animate-slide-up"
          >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="text-purple-600" size={22} />
                <span>खेती कैलेंडर (Farm Calendar)</span>
              </h2>
              <Tappable
                onClick={() => setShowCalendarModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                ariaLabel="Close"
              >
                <X size={18} />
              </Tappable>
            </div>

            <div className="space-y-3">
              {[
                {
                  season: 'रबी (Rabi)',
                  period: 'अक्टूबर से मार्च',
                  crops: 'गेहूं, चना, सरसों, आलू, मटर, जौ',
                  sow: 'अक्टूबर - नवंबर',
                  harvest: 'मार्च - अप्रैल'
                },
                {
                  season: 'खरीफ (Kharif)',
                  period: 'जून से नवंबर (मानसून आधारित)',
                  crops: 'धान, सोयाबीन, मक्का, कपास, बाजरा, मूंगफली',
                  sow: 'जून - जुलाई',
                  harvest: 'सितंबर - अक्टूबर'
                },
                {
                  season: 'ज़ायद / गरमा (Zaid)',
                  period: 'मार्च से जून (ग्रीष्मकालीन)',
                  crops: 'तरबूज, खीरा, ककड़ी, भिंडी, मूंग, उड़द',
                  sow: 'फरवरी - मार्च',
                  harvest: 'मई - जून'
                }
              ].map((c) => (
                <div key={c.season} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-purple-800 text-sm">{c.season}</h3>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {c.period}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-2">
                    <strong>फसलें:</strong> {c.crops}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-500">बुआई:</span>
                      <p className="font-semibold text-slate-800">{c.sow}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">कटाई:</span>
                      <p className="font-semibold text-slate-800">{c.harvest}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
