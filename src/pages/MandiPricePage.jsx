import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, AlertCircle, Search, RefreshCw } from 'lucide-react';
import { MANDI_DATA } from '../data/mandiData';
import Tappable from '../components/common/Tappable';
import { useT } from '../context/AppContext';

export default function MandiPricePage({ onBack }) {
  const t = useT();
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');

  const filteredData = MANDI_DATA.filter((item) => {
    const matchesSearch = item.nameHi.toLowerCase().includes(search.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      item.mandi.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = selectedCrop === 'all' || item.cropId === selectedCrop;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pb-24 min-h-screen bg-surface-light">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-teal-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tappable
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center hover:bg-teal-100 border border-teal-200"
            ariaLabel="Go back"
          >
            <ArrowLeft size={20} />
          </Tappable>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">
              {t('mandiPrices') || 'मंडी भाव (Mandi Prices)'}
            </h1>
            <p className="text-xs text-teal-600 font-medium">दैनिक APMC बाजार भाव</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 bg-teal-50/70 px-2.5 py-1 rounded-full border border-teal-100">
          <RefreshCw size={12} className="text-teal-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>लाइव अपडेट</span>
        </div>
      </div>

      <div className="px-4 pt-3 space-y-3">
        {/* Sample Data Disclaimer Banner - Required by Spec */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-amber-900 shadow-sm">
          <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-semibold text-amber-800">
              {t('sampleDataDisclaimer') || 'ये अनुमानित मूल्य हैं — अपने नजदीकी मंडी से पुष्टि करें।'}
            </p>
            <p className="text-amber-700 mt-0.5">
              These are indicative APMC market rates. Daily prices may vary based on quality, moisture, and local demand.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="फसल या मंडी का नाम खोजें (Search crop/mandi)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 shadow-sm"
          />
        </div>

        {/* Price Cards List */}
        <div className="space-y-2.5">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{item.nameHi}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    किस्म: <span className="text-slate-700 font-medium">{item.variety}</span> • {item.mandi}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-extrabold text-teal-700">
                    ₹{item.pricePerQuintal.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {t('pricePerQuintal') || 'प्रति क्विंटल'}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md ${
                      item.trend === 'up'
                        ? 'bg-emerald-50 text-emerald-700'
                        : item.trend === 'down'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.trend === 'up' && <TrendingUp size={13} />}
                    {item.trend === 'down' && <TrendingDown size={13} />}
                    {item.trend === 'stable' && <Minus size={13} />}
                    {item.change}
                  </span>
                  {item.msp && (
                    <span className="text-slate-500">
                      MSP: <strong className="text-slate-700">₹{item.msp}</strong>
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">{item.lastUpdated}</span>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-slate-100 p-6">
              <p className="text-sm text-slate-500">कोई फसल या मंडी नहीं मिली।</p>
              <button
                onClick={() => setSearch('')}
                className="mt-2 text-xs font-semibold text-teal-600 underline"
              >
                सभी फसलें देखें
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
