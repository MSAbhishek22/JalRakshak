import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, ShieldCheck, PhoneCall, CheckCircle, Search } from 'lucide-react';
import { useApp, useT } from '../context/AppContext';
import { SCHEMES } from '../data/schemesData';
import Tappable from '../components/common/Tappable';

export default function SchemesPage({ onBack, defaultSchemeId }) {
  const { user } = useApp();
  const t = useT();
  const lang = user?.language || 'hi';
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all', label: t('allSchemes') || 'सभी योजनाएं' },
    { id: 'water', label: t('waterSubsidy') || '💧 जल सब्सिडी' },
    { id: 'finance', label: t('financial') || '💰 नकद व ऋण' },
    { id: 'insurance', label: t('cropInsurance') || '🛡️ फसल बीमा' },
    { id: 'soil', label: t('soilHealth') || '🌱 मिट्टी स्वास्थ्य' },
  ];

  const filteredSchemes = SCHEMES.filter((scheme) => {
    // Category filtering
    if (selectedFilter === 'water' && scheme.id !== 'pmksy') return false;
    if (selectedFilter === 'finance' && !['pm-kisan', 'kcc'].includes(scheme.id)) return false;
    if (selectedFilter === 'insurance' && scheme.id !== 'pmfby') return false;
    if (selectedFilter === 'soil' && scheme.id !== 'soil-health-card') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = (scheme.name[lang] || scheme.name.hi).toLowerCase().includes(q);
      const benefitMatch = (scheme.benefit[lang] || scheme.benefit.hi).toLowerCase().includes(q);
      return nameMatch || benefitMatch;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-surface-light pb-24 scroll-container" style={{ paddingBottom: 'max(88px, calc(68px + env(safe-area-inset-bottom)))' }}>
      {/* Top Navigation Bar with consistent top-left back button */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tappable
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700"
            ariaLabel="Back"
          >
            <ArrowLeft size={20} />
          </Tappable>
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-tight">
              {t('schemesCardTitle') || 'सरकारी योजनाएं व सब्सिडी'}
            </h1>
            <p className="text-[11px] text-teal-700 font-semibold">
              {lang === 'en' ? 'Verified Government Benefits' : 'सत्यापित सरकारी लाभ व आवेदन'}
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center text-base">
          🏛️
        </div>
      </div>

      {/* Hero Banner */}
      <div className="mx-4 mt-3 rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, #0F766E 0%, #115E59 60%, #042F2E 100%)' }}>
        <p className="text-xs font-bold text-teal-200 uppercase tracking-wider">
          {lang === 'en' ? 'Farmer Welfare & Subsidies' : 'किसान कल्याण व वित्तीय सहायता'}
        </p>
        <h2 className="text-xl font-black mt-1">
          {lang === 'en' ? 'Official Schemes for Your Field' : 'आपके खेत और परिवार के लिए 5 मुख्य योजनाएं'}
        </h2>
        <p className="text-xs text-teal-100/90 mt-1 leading-relaxed">
          {lang === 'en'
            ? 'Access direct cash transfers, crop loss insurance, low-interest credit, micro-irrigation subsidies, and free soil testing.'
            : 'सीधे बैंक खाते में सम्मान निधि, सस्ती फसल बीमा, 4% पर केसीसी ऋण, ड्रिप सब्सिडी और मुफ्त मिट्टी जांच का लाभ लें।'}
        </p>
      </div>

      {/* Search Input */}
      <div className="mx-4 mt-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchSchemesPlaceholder') || 'योजना खोजें (जैसे: पीएम किसान, ड्रिप सब्सिडी, केसीसी)...'}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-teal-600 text-slate-800 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold p-1"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 mt-3 overflow-x-auto hide-scrollbar pb-1">
        {filterTabs.map((tab) => (
          <Tappable
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              selectedFilter === tab.id
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </Tappable>
        ))}
      </div>

      {/* Schemes List */}
      <div className="mx-4 mt-3 space-y-3.5">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            id={`scheme-${scheme.id}`}
            className={`bg-white rounded-2xl p-4 border transition-all shadow-card ${
              defaultSchemeId === scheme.id ? 'border-teal-500 ring-2 ring-teal-200' : 'border-slate-200/80'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-1.5 bg-slate-50 rounded-xl border border-slate-100">{scheme.icon}</span>
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">
                    {scheme.name[lang] || scheme.name.hi}
                  </h3>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${scheme.badgeColor}`}>
                    {scheme.tag}
                  </span>
                </div>
              </div>
            </div>

            {/* 1-Line Benefit */}
            <div className="mt-3 bg-teal-50/70 border border-teal-100 rounded-xl p-3">
              <p className="text-xs font-bold text-teal-900">
                {t('keyBenefit') || 'मुख्य लाभ:'}
              </p>
              <p className="text-xs text-teal-800 mt-0.5 leading-relaxed font-semibold">
                {scheme.benefit[lang] || scheme.benefit.hi}
              </p>
            </div>

            {/* 1-Line Eligibility */}
            <div className="mt-2 text-xs text-slate-700">
              <span className="font-bold text-slate-900">
                {t('eligibility') || 'पात्रता:'}{' '}
              </span>
              <span>{scheme.eligibility[lang] || scheme.eligibility.hi}</span>
            </div>

            {/* Mandatory Note / Coverage */}
            <div className="mt-2 text-xs text-slate-600 bg-slate-50 rounded-xl p-2.5 border border-slate-100 leading-relaxed">
              {scheme.mandatoryNote[lang] || scheme.mandatoryNote.hi}
            </div>

            {/* Official Link CTA Button */}
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2">
              <Tappable
                onClick={() => window.open(scheme.url, '_blank', 'noopener,noreferrer')}
                className="flex-1 py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-btn"
              >
                <span>{scheme.ctaText[lang] || scheme.ctaText.hi}</span>
                <ExternalLink size={14} />
              </Tappable>
            </div>
          </div>
        ))}

        {filteredSchemes.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-3xl mb-2">🔍</p>
            <p className="text-sm font-bold text-slate-800">{t('schemesEmptyTitle') || 'कोई योजना नहीं मिली'}</p>
            <p className="text-xs text-slate-500 mt-1">{t('schemesEmptyDesc') || 'कृपया दूसरा शब्द खोजें या फ़िल्टर बदलें'}</p>
          </div>
        )}
      </div>

      {/* Kisan Call Center Helpline Card */}
      <div className="mx-4 mt-5 bg-amber-50 rounded-2xl p-4 border border-amber-200">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
          <PhoneCall size={16} className="text-amber-700" />
          <span>{t('kisanCallCenterTitle') || 'मुफ्त किसान कॉल सेंटर (Kisan Call Center)'}</span>
        </div>
        <p className="text-xs text-amber-800 leading-relaxed mb-3">
          {t('kisanCallCenterDesc') || 'किसी भी सरकारी योजना, सब्सिडी या कृषि समस्या के समाधान के लिए सरकार के टोल-फ्री नंबर पर कॉल करें।'}
        </p>
        <Tappable
          onClick={() => window.open('tel:18001801551')}
          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
        >
          <PhoneCall size={14} />
          <span>{t('callCenterBtn') || '📞 1800-180-1551 पर तुरंत कॉल करें'}</span>
        </Tappable>
      </div>
    </div>
  );
}
