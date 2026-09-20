// src/components/onboarding/LocationScreen.jsx — With GPS & State/District Manual Fallback
import React, { useState } from 'react';
import { MapPin, Bell, Navigation, CheckCircle2, ChevronDown } from 'lucide-react';
import { useLocation } from '../../hooks/useLocation';
import { useNotifications } from '../../hooks/useNotifications';
import { t } from '../../i18n/index';
import { trackEvent, EVENTS } from '../../firebase/analytics';
import Tappable from '../common/Tappable';
import { INDIAN_STATES_AND_DISTRICTS, DEFAULT_LOCATION } from '../../data/indianLocations';

export default function LocationScreen({ onComplete, language }) {
  const { location, loading, error, requestLocation } = useLocation();
  const { requestPermission, isFCMSupported } = useNotifications();
  const [cityName, setCityName] = useState('');
  const [userName, setUserName] = useState('');
  const [locationGranted, setLocationGranted] = useState(false);
  const [locationMethod, setLocationMethod] = useState(null);
  const [notificationGranted, setNotificationGranted] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  // Manual State & District selector state
  const [selectedStateCode, setSelectedStateCode] = useState('UP');
  const currentStateObj = INDIAN_STATES_AND_DISTRICTS.find(s => s.code === selectedStateCode) || INDIAN_STATES_AND_DISTRICTS[0];
  const [selectedDistrictName, setSelectedDistrictName] = useState(currentStateObj.districts[0]?.name || 'मेरठ (Meerut)');

  const handleStateChange = (code) => {
    setSelectedStateCode(code);
    const stateObj = INDIAN_STATES_AND_DISTRICTS.find(s => s.code === code);
    if (stateObj && stateObj.districts.length > 0) {
      setSelectedDistrictName(stateObj.districts[0].name);
    }
  };

  const handleLocationRequest = async () => {
    try {
      const loc = await requestLocation();
      if (loc) {
        setLocationGranted(true);
        setLocationMethod('gps');
        trackEvent(EVENTS.ONBOARDING_LOCATION_GRANTED, { method: 'gps' });
      }
    } catch {
      // Error handled by useLocation hook and rendered below
    }
  };

  const handleNotificationPermission = async () => {
    setNotifLoading(true);
    const result = await requestPermission();
    if (result) {
      setNotificationGranted(true);
      trackEvent(EVENTS.NOTIFICATION_PERMISSION_GRANTED);
    }
    setNotifLoading(false);
  };

  const handleComplete = async () => {
    let locationData;

    if (locationGranted && location) {
      locationData = {
        lat: location.lat,
        lng: location.lng,
        city: location.city || cityName || selectedDistrictName.split(' ')[0],
        state: location.state || currentStateObj.state.split(' ')[0]
      };
    } else if (cityName.trim()) {
      setGeocoding(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName.trim())},India&format=json&limit=1`,
          { headers: { 'User-Agent': 'JalRakshak/1.0' } }
        );
        const data = await res.json();
        if (data?.[0]) {
          locationData = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
            city: cityName.trim(),
            state: data[0].display_name?.split(',').slice(-3, -2)[0]?.trim() || ''
          };
          setLocationMethod('manual_search');
        } else {
          // Fallback to selected district coordinates
          const distObj = currentStateObj.districts.find(d => d.name === selectedDistrictName) || currentStateObj.districts[0];
          locationData = {
            lat: distObj.lat,
            lng: distObj.lng,
            city: cityName.trim() || distObj.name.split(' ')[0],
            state: currentStateObj.state.split(' ')[0]
          };
          setLocationMethod('manual_dropdown');
        }
      } catch {
        const distObj = currentStateObj.districts.find(d => d.name === selectedDistrictName) || currentStateObj.districts[0];
        locationData = {
          lat: distObj.lat,
          lng: distObj.lng,
          city: cityName.trim() || distObj.name.split(' ')[0],
          state: currentStateObj.state.split(' ')[0]
        };
        setLocationMethod('manual_dropdown');
      } finally {
        setGeocoding(false);
      }
    } else {
      // Use selected State & District
      const distObj = currentStateObj.districts.find(d => d.name === selectedDistrictName) || currentStateObj.districts[0];
      locationData = {
        lat: distObj.lat,
        lng: distObj.lng,
        city: distObj.name.split(' ')[0],
        state: currentStateObj.state.split(' ')[0]
      };
      setLocationMethod('manual_dropdown');
    }

    trackEvent(EVENTS.ONBOARDING_COMPLETED, {
      location_method: locationMethod || 'default',
      notification_granted: notificationGranted,
    });

    onComplete({ location: locationData, name: userName.trim() });
  };

  // Farmer is NEVER stuck: either GPS is granted, or State/District is selected by default, or city is typed!
  const canProceed = true;

  return (
    <div className="flex flex-col h-full bg-surface-light">
      {/* Header */}
      <div className="text-center pt-6 pb-3 px-4">
        <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-teal-700 mx-auto flex items-center justify-center mb-2 animate-scale-in">
          <MapPin size={28} />
        </div>
        <h2 className="text-2xl font-black text-slate-900">{t(language, 'whereField')}</h2>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          {t(language, 'whereFieldSub') || 'सटीक मौसम और सिंचाई सलाह के लिए अपना स्थान बताएं'}
        </p>
      </div>

      <div className="flex-1 px-4 space-y-3.5 overflow-y-auto pb-4 hide-scrollbar">
        {/* GPS Button */}
        <Tappable
          onClick={handleLocationRequest}
          disabled={loading || locationGranted}
          className={`w-full h-12 py-2.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            locationGranted
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-teal-700 hover:bg-teal-800 text-white shadow-btn'
          }`}
          id="location-gps-btn"
        >
          <Navigation size={18} className={loading ? 'animate-spin' : ''} />
          <span>
            {loading
              ? 'लोकेशन खोज रहे हैं...'
              : locationGranted
                ? t(language, 'locationFound') || '✅ GPS लोकेशन मिल गई!'
                : t(language, 'giveLocation') || '📍 GPS से ऑटोमेटिक स्थान खोजें'}
          </span>
        </Tappable>

        {locationGranted && location?.city && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-teal-800 font-bold bg-teal-50 border border-teal-200 rounded-xl py-2 px-3 animate-scale-in">
            <CheckCircle2 size={15} className="text-teal-600" />
            <span>📍 {location.city}{location.state ? `, ${location.state}` : ''}</span>
          </div>
        )}

        {/* GPS Denied / Error Warning with Guidance */}
        {error && !locationGranted && (
          <div className="p-3 rounded-xl border border-amber-300 bg-amber-50 text-xs text-amber-900 leading-relaxed">
            <p className="font-bold flex items-center gap-1">
              <span>⚠️</span>
              <span>{t(language, 'locationDenied') || 'GPS लोकेशन की अनुमति नहीं मिली'}</span>
            </p>
            <p className="mt-1 text-amber-800">
              कोई बात नहीं! आप नीचे सीधे अपना <strong>राज्य और जिला</strong> चुन सकते हैं:
            </p>
            <button
              onClick={handleLocationRequest}
              className="mt-2 text-teal-800 font-bold underline flex items-center gap-1"
            >
              🔄 GPS पुनः प्रयास करें
            </button>
          </div>
        )}

        {/* Manual State & District Selector Fallback */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-slate-800 font-bold flex items-center gap-1">
              <span>🗺️</span>
              <span>राज्य और जिला चुनें (Manual Selector)</span>
            </label>
            <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-semibold">
              कभी न अटकें
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {/* State selector */}
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">राज्य (State)</label>
              <div className="relative">
                <select
                  value={selectedStateCode}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-teal-600 outline-none pr-7"
                  id="state-select"
                >
                  {INDIAN_STATES_AND_DISTRICTS.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.state}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* District selector */}
            <div>
              <label className="text-[11px] text-slate-600 font-medium block mb-1">जिला (District)</label>
              <div className="relative">
                <select
                  value={selectedDistrictName}
                  onChange={(e) => setSelectedDistrictName(e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-teal-600 outline-none pr-7"
                  id="district-select"
                >
                  {currentStateObj.districts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Optional village/town input */}
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            <label className="text-[11px] text-slate-600 font-medium block mb-1">
              गाँव / कस्बा (वैकल्पिक)
            </label>
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="जैसे: रामपुर, दौराला..."
              className="w-full px-3 py-2 border border-slate-200 focus:border-teal-600 rounded-xl text-xs outline-none bg-slate-50 text-slate-800"
              id="city-input"
            />
          </div>
        </div>

        {/* Name input */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-card">
          <label className="text-xs text-slate-800 font-bold block mb-1">
            👤 आपका नाम (Your Name)
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="जैसे: राम प्रसाद, गुरप्रीत सिंह..."
            className="w-full px-3 py-2.5 border border-slate-200 focus:border-teal-600 rounded-xl text-xs outline-none bg-slate-50 text-slate-800"
            id="name-input"
          />
        </div>

        {/* Notification permission block */}
        {isFCMSupported && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 mb-1 text-amber-900 font-bold text-xs">
              <Bell size={15} className="text-amber-600" />
              <span>मौसम चेतावनी और बारिश अलर्ट</span>
            </div>
            <p className="text-[11px] text-amber-800 mb-2 leading-relaxed">
              अचानक बारिश या तेज हवा से पहले अपने फोन पर तुरंत सूचना पाएं।
            </p>
            <Tappable
              onClick={handleNotificationPermission}
              disabled={notifLoading || notificationGranted}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                notificationGranted
                  ? 'bg-teal-50 text-teal-800 border border-teal-300'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
              }`}
              id="notification-permission-btn"
            >
              {notifLoading
                ? 'चालू हो रहा है...'
                : notificationGranted
                  ? '✅ सूचनाएं चालू हैं'
                  : '🔔 मुफ्त मौसम सूचनाएं चालू करें'}
            </Tappable>
          </div>
        )}
      </div>

      {/* Get Started CTA */}
      <div className="px-4 pb-6 pt-2 safe-bottom">
        <Tappable
          onClick={handleComplete}
          disabled={geocoding}
          className="w-full h-13 py-3 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 shadow-btn"
          id="get-started-btn"
        >
          {geocoding ? 'स्थान पुष्टि हो रही है...' : (t(language, 'getStarted') || 'ऐप शुरू करें →')}
        </Tappable>
      </div>
    </div>
  );
}
