'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const t = useTranslations('cookies');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-2xl pointer-events-auto animate-in slide-in-from-bottom-10 fade-in duration-500">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-brand-400 shrink-0">
            <Cookie className="h-6 w-6" />
          </div>
          <div className="flex-1 text-center sm:text-start">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t('message')}
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0 shrink-0">
            <button
              onClick={handleDecline}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {t('decline')}
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-6 py-2 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/20 transition-all"
            >
              {t('accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
