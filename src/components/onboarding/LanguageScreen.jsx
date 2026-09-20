// src/components/onboarding/LanguageScreen.jsx — Section 6, Screen 1
import React from 'react';
import { Globe } from 'lucide-react';
import { LANGUAGE_OPTIONS } from '../../i18n/index';
import { trackEvent, EVENTS } from '../../firebase/analytics';
import Tappable from '../common/Tappable';

export default function LanguageScreen({ selectedLanguage, onSelect }) {
  const handleSelect = (code) => {
    onSelect(code);
    trackEvent(EVENTS.ONBOARDING_LANGUAGE_SELECTED, { language: code });
  };

  return (
    <div className="flex flex-col h-full bg-surface-light">
      {/* Top section */}
      <div className="text-center pt-8 pb-6 px-4">
        <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-teal-700 mx-auto flex items-center justify-center mb-2 animate-scale-in">
          <Globe size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mt-2 animate-slide-up">
          भाषा चुनें / Choose Language
        </h2>
        <p className="text-sm text-slate-600 mt-2 animate-slide-up leading-relaxed">
          आप किस भाषा में बात करना पसंद करते हैं?
        </p>
      </div>

      {/* Language Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 flex-1">
        {LANGUAGE_OPTIONS.map(lang => {
          const isSelected = selectedLanguage === lang.code;
          return (
            <Tappable
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 shadow-card transition-all duration-200 ${
                isSelected
                  ? 'border-teal-700 bg-teal-50/80 shadow-btn'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              style={{ minHeight: '76px' }}
              id={`lang-${lang.code}`}
            >
              <span className={`text-base font-extrabold ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                {lang.native}
              </span>
              <span className="text-xs text-slate-500 mt-0.5">{lang.english}</span>
            </Tappable>
          );
        })}
      </div>
    </div>
  );
}
