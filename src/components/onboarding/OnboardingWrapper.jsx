// src/components/onboarding/OnboardingWrapper.jsx — Section 6 spec with JalRakshak design tokens
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import LanguageScreen from './LanguageScreen';
import CropScreen from './CropScreen';
import LocationScreen from './LocationScreen';
import { trackEvent, EVENTS } from '../../firebase/analytics';
import Tappable from '../common/Tappable';

export default function OnboardingWrapper({ onComplete }) {
  const [step, setStep] = useState(0);
  const [language, setLanguage] = useState('hi');
  const [crops, setCrops] = useState([]);
  const [customCrop, setCustomCrop] = useState('');

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    trackEvent(EVENTS.ONBOARDING_LANGUAGE_SELECTED, { language: lang });
  };

  const handleNext = () => {
    if (step === 0 && !language) return;
    if (step === 1 && crops.length === 0) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  const handleLocationComplete = (locationData) => {
    trackEvent(EVENTS.ONBOARDING_COMPLETED);
    const finalCrops = crops.map(c => (c === 'other' && customCrop.trim() ? customCrop.trim() : c));
    onComplete({
      language,
      crops: finalCrops,
      location: locationData.location,
      name: locationData.name,
    });
  };

  const screens = [
    <LanguageScreen selectedLanguage={language} onSelect={handleLanguageSelect} />,
    <CropScreen selectedCrops={crops} onSelect={setCrops} customCrop={customCrop} onCustomCropChange={setCustomCrop} language={language} />,
    <LocationScreen onComplete={handleLocationComplete} language={language} />,
  ];

  return (
    <div className="fixed inset-0 z-[500] bg-surface-light flex flex-col">
      {/* Header with progress dots and back button */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        {/* Back button */}
        <div className="w-12 h-12 flex items-center justify-center">
          {step > 0 && (
            <Tappable
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700"
              ariaLabel="Back"
            >
              <ArrowLeft size={20} />
            </Tappable>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 items-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? 'w-7 bg-teal-700'
                  : 'w-2 bg-slate-200'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}
            />
          ))}
        </div>

        <div className="w-12" />
      </div>

      {/* Screen content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full animate-slide-in-right" key={step}>
          {screens[step]}
        </div>
      </div>

      {/* Continue button (screens 0 and 1 only) */}
      {step < 2 && (
        <div className="px-6 pb-6 safe-bottom">
          <Tappable
            onClick={handleNext}
            disabled={(step === 0 && !language) || (step === 1 && crops.length === 0)}
            className="w-full h-14 rounded-2xl font-bold text-base text-white bg-teal-700 hover:bg-teal-800 shadow-btn disabled:opacity-50 disabled:shadow-none"
            id="onboarding-continue-btn"
          >
            {language === 'hi' || !language ? 'आगे बढ़ें →' : 'Continue →'}
          </Tappable>
        </div>
      )}
    </div>
  );
}
