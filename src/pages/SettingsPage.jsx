import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useApp, useT } from '../context/AppContext';
import { SettingsRow } from '../components/SettingsPanel';
import { getCropName } from '../utils/cropData';
import { trackEvent, EVENTS } from '../firebase/analytics';
import { storage } from '../utils/storage';
import { useLocation as useGeoLocation } from '../hooks/useLocation';
import Tappable from '../components/common/Tappable';
import { INDIAN_STATES_AND_DISTRICTS } from '../data/indianLocations';

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-checked={value}
      role="switch"
      style={{
        width: '44px', height: '24px', borderRadius: '12px',
        background: value ? '#0F766E' : '#CBD5E1',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 200ms ease', padding: 0,
        flexShrink: 0
      }}
    >
      <div style={{
        width: '20px', height: '20px', borderRadius: '50%',
        background: '#FFFFFF', position: 'absolute', top: '2px',
        left: value ? '22px' : '2px',
        transition: 'left 200ms ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
      }} />
    </button>
  );
}

export default function SettingsPage({ onNavigate, onBack }) {
  const { user, updateUser, clearAllData, setActiveTab } = useApp();
  const t = useT();
  const lang = user.language || 'hi';
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showCropPicker, setShowCropPicker] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState(() => storage.get('user_crops') || ['गेहूं']);
  const [cityInput, setCityInput] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const { requestLocation } = useGeoLocation();

  // Location selector state
  const [settingStateCode, setSettingStateCode] = useState('UP');
  const currentSettingState = INDIAN_STATES_AND_DISTRICTS.find(s => s.code === settingStateCode) || INDIAN_STATES_AND_DISTRICTS[0];
  const [settingDistrictName, setSettingDistrictName] = useState(currentSettingState.districts[0]?.name || 'मेरठ (Meerut)');

  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState(localStorage.getItem('user_name') || '');
  const [nameToast, setNameToast] = useState(false);

  const LANGUAGES = [
    { code: 'hi', name: 'हिन्दी', subname: 'Hindi' },
    { code: 'en', name: 'English', subname: 'English' },
    { code: 'bn', name: 'বাংলা', subname: 'Bengali' },
    { code: 'mr', name: 'मराठी', subname: 'Marathi' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', subname: 'Punjabi' },
  ];

  const ALL_CROPS = [
    { emoji: '🌾', name: 'गेहूं' }, { emoji: '🌾', name: 'धान' }, { emoji: '🫘', name: 'दाल' },
    { emoji: '🌽', name: 'मक्का' }, { emoji: '🥕', name: 'सब्जियां' }, { emoji: '🥔', name: 'आलू' },
    { emoji: '🍅', name: 'टमाटर' }, { emoji: '➕', name: 'अन्य' }
  ];

  const [notifPrefs, setNotifPrefs] = useState(
    () => storage.get('notification_prefs') || { flood: true, drought: true, irrigation: false, weather: false }
  );

  const toggleNotif = (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    storage.set('notification_prefs', updated);
    trackEvent(EVENTS.SETTINGS_NOTIFICATION_TOGGLED, { key, value: updated[key] });
  };

  const handleShare = async () => {
    trackEvent(EVENTS.APP_SHARED);
    const data = {
      title: 'JalRakshak — जल और मिट्टी का रक्षक',
      text: 'खेती के लिए AI सहायक। मौसम, पानी की बचत, फसल सुरक्षा — हिंदी में। मुफ्त!',
      url: 'https://jalrakshak.vercel.app'
    };
    if (navigator.share) {
      try { await navigator.share(data); } catch (e) { if (e.name !== 'AbortError') navigator.clipboard?.writeText(data.url); }
    } else {
      navigator.clipboard?.writeText(data.url);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const handleDelete = () => {
    if (!deleteConfirm) { setDeleteConfirm(true); setTimeout(() => setDeleteConfirm(false), 4000); return; }
    trackEvent(EVENTS.SETTINGS_DATA_CLEARED);
    localStorage.clear();
    window.location.reload();
  };

  const joinDate = user.onboardingDate || new Date().toISOString();
  const joinMonth = new Date(joinDate).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-surface-light min-h-screen scroll-container pb-24" style={{ paddingBottom: 'max(88px, calc(68px + env(safe-area-inset-bottom)))' }}>
      {nameToast && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', width: 'max-content', maxWidth: '400px', background: '#0F766E', color: '#FFF', padding: '12px 24px', borderRadius: '24px', fontSize: '14px', fontWeight: 600, zIndex: 1000, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(15,118,110,0.3)' }}>
          ✅ नाम सेव हो गया!
        </div>
      )}

      {/* Top Header Bar with Back Button */}
      <div className="flex items-center gap-3 px-4 pt-3 pb-1">
        <Tappable
          onClick={() => onBack ? onBack() : setActiveTab('home')}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-card flex items-center justify-center text-slate-700"
          ariaLabel="Back to Home"
        >
          <ArrowLeft size={20} />
        </Tappable>
        <div>
          <h1 className="text-lg font-black text-slate-900 leading-tight">
            {t('settings') || 'सेटिंग्स व प्रोफ़ाइल'}
          </h1>
          <p className="text-[11px] text-teal-700 font-semibold">
            किसान जानकारी व प्राथमिकताएं
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="rounded-3xl mx-4 mt-4 p-5 shadow-card" style={{ background: 'linear-gradient(135deg, #0F766E, #115E59)' }}>
        <div className="flex items-center gap-4">
          <div className="w-[56px] h-[56px] rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-xs">
            <span className="text-[26px] font-bold text-white">{user.name ? user.name.charAt(0).toUpperCase() : '💧'}</span>
          </div>
          <div>
            <p className="text-lg font-black text-white leading-tight">{user.name || t('dearFarmer')}</p>
            <p className="text-xs text-teal-100 mt-0.5">📍 {user.location?.city || 'Delhi'}{user.location?.state ? `, ${user.location.state}` : ''}</p>
            <p className="text-[11px] text-teal-200/75 mt-1">{t('memberSince')} {joinMonth}</p>
          </div>
        </div>
      </div>

      {/* My Info */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-card overflow-hidden border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 px-4 pt-4 pb-2">{t('myInfo')}</h3>
        <SettingsRow icon="👤" label={t('name')} value={user.name || t('setIt')} chevron onClick={() => setShowNameModal(true)} />
        <SettingsRow icon="🌾" label={t('crop')} value={user.crops?.map(c => getCropName(c, lang)).join(', ') || t('setIt')} chevron onClick={() => setShowCropPicker(true)} />
        <SettingsRow icon="📍" label={t('location')} value={user.location?.city || 'Delhi'} chevron onClick={() => setShowLocationPicker(true)} />
        <SettingsRow icon="🗣️" label={t('language')} value={LANGUAGES.find(l => l.code === lang)?.name || 'हिन्दी'} chevron onClick={() => setShowLangPicker(true)} />
      </div>

      {showNameModal && (
        <div style={{ position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', background: 'rgba(15,23,42,0.6)', zIndex: 900, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowNameModal(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-t-3xl p-6 w-full shadow-modal animate-slide-up">
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>👤 अपना नाम बताएं</h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '18px' }}>यह नाम होम स्क्रीन और किसान चौपाल पर दिखेगा</p>
            <input
              autoFocus
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              placeholder="जैसे: रामजी लाल"
              className="w-full h-12 border-2 border-teal-100 focus:border-teal-600 rounded-xl px-4 text-base mb-4 outline-none text-slate-800"
            />
            <Tappable onClick={() => {
              const trimmed = nameInput.trim();
              localStorage.setItem('user_name', trimmed);
              if (typeof updateUser === 'function') updateUser({ name: trimmed });
              setShowNameModal(false);
              setNameToast(true);
              setTimeout(() => setNameToast(false), 2500);
            }} className="w-full h-12 bg-teal-700 text-white rounded-xl text-base font-bold shadow-btn mb-2">
              ✅ सेव करें
            </Tappable>
            <Tappable onClick={() => setShowNameModal(false)} className="w-full h-10 text-slate-500 text-sm">
              रद्द करें
            </Tappable>
          </div>
        </div>
      )}

      {/* Language Picker */}
      {showLangPicker && (
        <div style={{ position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', background: 'rgba(15,23,42,0.6)', zIndex: 900, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowLangPicker(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-t-3xl p-6 w-full shadow-modal animate-slide-up">
            <p style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#0F172A' }}>🗣️ भाषा चुनें</p>
            {LANGUAGES.map(langOpt => (
              <Tappable key={langOpt.code} onClick={() => { 
                  localStorage.setItem('user_language', langOpt.code);
                  updateUser({ language: langOpt.code }); 
                  setShowLangPicker(false); 
                }}
                className={`w-full h-14 flex items-center justify-between px-4 rounded-xl mb-2 border transition-all ${
                  user.language === langOpt.code
                    ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <p style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>{langOpt.name}</p>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>{langOpt.subname}</p>
                </div>
                {user.language === langOpt.code && <span style={{ fontSize: '18px', color: '#0F766E' }}>✓</span>}
              </Tappable>
            ))}
          </div>
        </div>
      )}

      {/* Crop Picker */}
      {showCropPicker && (
        <div style={{ position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', background: 'rgba(15,23,42,0.6)', zIndex: 900, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setShowCropPicker(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-t-3xl p-6 w-full shadow-modal animate-slide-up">
            <p style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px', color: '#0F172A' }}>🌾 फसल चुनें</p>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>एक या अधिक फसलें चुन सकते हैं</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '18px' }}>
              {ALL_CROPS.map(crop => {
                const selected = selectedCrops.includes(crop.name);
                return (
                  <Tappable key={crop.name}
                    onClick={() => setSelectedCrops(prev => selected ? prev.filter(c => c !== crop.name) : [...prev, crop.name])}
                    className={`h-14 flex items-center gap-2.5 px-3.5 rounded-xl border text-left transition-all ${
                      selected ? 'bg-teal-50 border-teal-600 font-bold text-teal-900' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span style={{ fontSize: '20px' }}>{crop.emoji}</span>
                    <span style={{ fontSize: '14px', flex: 1 }}>{crop.name}</span>
                    {selected && <span style={{ color: '#0F766E', fontWeight: 700 }}>✓</span>}
                  </Tappable>
                );
              })}
            </div>
            <Tappable onClick={() => { updateUser({ crops: selectedCrops }); storage.set('user_crops', selectedCrops); setShowCropPicker(false); }}
              className="w-full h-12 bg-teal-700 text-white rounded-xl text-base font-bold shadow-btn">
              ✅ सेव करें ({selectedCrops.length} फसल)
            </Tappable>
          </div>
        </div>
      )}

      {/* Location Picker */}
      {showLocationPicker && (
        <div style={{
          position: 'fixed', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '430px', background: 'rgba(15,23,42,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'flex-end'
        }} onClick={() => setShowLocationPicker(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-t-3xl p-6 w-full shadow-modal animate-slide-up max-h-[85vh] overflow-y-auto">
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
              📍 स्थान बदलें (Change Location)
            </p>

            {/* GPS Option */}
            <Tappable
              onClick={async () => {
                setGpsLoading(true);
                try {
                  const loc = await requestLocation();
                  if (loc) {
                    updateUser({ location: loc });
                    storage.set('user_location', loc);
                    storage.remove('weather_cache');
                    storage.remove('weather_cache_time');
                    setShowLocationPicker(false);
                  }
                } catch {
                  alert('GPS लोकेशन नहीं मिली। नीचे से राज्य व जिला चुनें।');
                } finally {
                  setGpsLoading(false);
                }
              }}
              disabled={gpsLoading}
              className="w-full h-12 bg-teal-700 text-white rounded-xl text-sm font-bold shadow-btn flex items-center justify-center gap-2 mb-3"
            >
              {gpsLoading ? 'लोकेशन मिल रही है...' : '📍 मेरी वर्तमान GPS लोकेशन'}
            </Tappable>

            <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '12px', margin: '10px 0' }}>— या राज्य व जिला चुनें —</p>

            {/* State & District Dropdown */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">राज्य (State)</label>
                <div className="relative">
                  <select
                    value={settingStateCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      setSettingStateCode(code);
                      const sObj = INDIAN_STATES_AND_DISTRICTS.find(s => s.code === code);
                      if (sObj?.districts?.[0]) setSettingDistrictName(sObj.districts[0].name);
                    }}
                    className="w-full appearance-none bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-teal-600 outline-none pr-8"
                  >
                    {INDIAN_STATES_AND_DISTRICTS.map((s) => (
                      <option key={s.code} value={s.code}>{s.state}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">जिला (District)</label>
                <div className="relative">
                  <select
                    value={settingDistrictName}
                    onChange={(e) => setSettingDistrictName(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-teal-600 outline-none pr-8"
                  >
                    {currentSettingState.districts.map((d) => (
                      <option key={d.name} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <Tappable
              onClick={() => {
                const distObj = currentSettingState.districts.find(d => d.name === settingDistrictName) || currentSettingState.districts[0];
                const loc = {
                  lat: distObj.lat,
                  lng: distObj.lng,
                  city: distObj.name.split(' ')[0],
                  state: currentSettingState.state.split(' ')[0],
                  country: 'India'
                };
                updateUser({ location: loc });
                storage.set('user_location', loc);
                storage.remove('weather_cache');
                storage.remove('weather_cache_time');
                setShowLocationPicker(false);
              }}
              className="w-full h-12 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold shadow-btn flex items-center justify-center gap-2"
            >
              ✅ स्थान सुरक्षित करें ({settingDistrictName.split(' ')[0]})
            </Tappable>
          </div>
        </div>
      )}

      {/* Notifications section */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-card overflow-hidden border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 px-4 pt-4 pb-2">{t('notifications')}</h3>
        {[
          { key: 'flood', icon: '🚨', label: 'बाढ़ की चेतावनी' },
          { key: 'drought', icon: '☀️', label: 'सूखे की चेतावनी' },
          { key: 'irrigation', icon: '💧', label: 'सिंचाई रिमाइंडर' },
          { key: 'weather', icon: '🌦️', label: 'दैनिक मौसम' },
        ].map(n => (
          <div key={n.key} className="h-14 flex items-center justify-between px-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <span className="text-xl">{n.icon}</span>
              <span className="text-sm text-slate-800 font-medium">{n.label}</span>
            </div>
            <Toggle value={notifPrefs[n.key]} onChange={() => toggleNotif(n.key)} />
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="mx-4 mt-4 bg-white rounded-2xl shadow-card overflow-hidden border border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 px-4 pt-4 pb-2">{t('appInfo')}</h3>
        <SettingsRow icon="💧" label={t('version')} value="2.0.0 (JalRakshak)" />
        <SettingsRow icon="🔒" label={t('privacyPolicy')} chevron onClick={() => onNavigate('privacy')} />
        <SettingsRow icon="📋" label={t('termsOfService')} chevron onClick={() => onNavigate('terms')} />
        <SettingsRow icon="⭐" label={t('rateApp')} chevron onClick={() => window.open('https://play.google.com/store/apps', '_blank')} />
        <SettingsRow icon="📤" label={t('shareApp')} chevron onClick={handleShare} />
        <SettingsRow icon="🐛" label={t('reportBug')} chevron onClick={() => window.open('mailto:msabhishekanni10@gmail.com?subject=Bug Report - JalRakshak')} />
      </div>

      {/* Danger Zone */}
      <div className="mx-4 mt-4 px-2">
        <Tappable
          onClick={handleDelete}
          className={`w-full h-12 rounded-xl text-sm font-bold border transition-all mt-4 mb-20 ${
            deleteConfirm
              ? 'bg-red-600 text-white border-red-700 shadow-sm'
              : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
          }`}
        >
          {deleteConfirm ? '⚠️ पुष्टि करें: सारा डेटा मिट जाएगा - फिर टैप करें' : 'सारा डेटा हटाएं (Reset App)'}
        </Tappable>
      </div>
    </div>
  );
}
