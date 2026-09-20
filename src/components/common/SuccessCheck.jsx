import React, { useEffect } from 'react';

/**
 * SuccessCheck component
 * Displays a celebratory checkmark with pulse animation and auto-dismisses.
 */
export default function SuccessCheck({ message = 'सफल! (Success)', onComplete, duration = 1600 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-white rounded-3xl p-6 shadow-modal flex flex-col items-center max-w-xs w-full text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 mb-4 ring-8 ring-teal-50/50">
          <svg
            className="w-10 h-10 text-teal-600 animate-bounce-slow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{message}</h3>
        <p className="text-xs text-slate-500">JalRakshak • जल और मिट्टी की रक्षा</p>
      </div>
    </div>
  );
}
