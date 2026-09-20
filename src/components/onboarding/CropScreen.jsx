// src/components/onboarding/CropScreen.jsx — Section 6, Screen 2
import React from 'react';
import { CROPS, getCropName } from '../../utils/cropData';
import { t } from '../../i18n/index';
import Tappable from '../common/Tappable';

export default function CropScreen({ selectedCrops, onSelect, customCrop, onCustomCropChange, language }) {
  const showCustomInput = selectedCrops.includes('other');

  const toggleCrop = (cropId) => {
    if (selectedCrops.includes(cropId)) {
      onSelect(selectedCrops.filter(c => c !== cropId));
    } else {
      onSelect([...selectedCrops, cropId]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-light">
      <div className="text-center pt-6 pb-4 px-4">
        <h2 className="text-2xl font-black text-slate-900">{t(language, 'whatCrop')}</h2>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          {t(language, 'whatCropSub')}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 flex-1 overflow-y-auto pb-4">
        {CROPS.map(crop => {
          const isSelected = selectedCrops.includes(crop.id);
          return (
            <Tappable
              key={crop.id}
              onClick={() => toggleCrop(crop.id)}
              className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 shadow-card transition-all duration-200 ${
                isSelected
                  ? 'border-teal-700 bg-teal-50 shadow-btn'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              style={{ minHeight: '100px' }}
              id={`crop-${crop.id}`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-teal-700 flex items-center justify-center animate-scale-in">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
              <span className="text-[32px]">{crop.emoji}</span>
              <span className={`text-sm font-bold mt-1 ${isSelected ? 'text-teal-900' : 'text-slate-800'}`}>
                {getCropName(crop.id, language)}
              </span>
              {language !== 'hi' && language !== 'en' && (
                <span className="text-xs text-slate-500">{crop.hi}</span>
              )}
            </Tappable>
          );
        })}
      </div>

      {/* Custom crop input */}
      {showCustomInput && (
        <div className="px-4 pb-4 animate-slide-down">
          <input
            type="text"
            value={customCrop}
            onChange={(e) => onCustomCropChange(e.target.value)}
            placeholder={t(language, 'typeCropName')}
            className="w-full px-4 py-3 border-2 border-teal-600 rounded-xl text-sm focus:outline-none bg-white text-slate-800"
            id="custom-crop-input"
          />
        </div>
      )}
    </div>
  );
}
