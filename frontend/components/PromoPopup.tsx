'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, MessageCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const params = useParams();
  const currentLocale = (params?.locale as string) || 'ar';
  const isRtl = currentLocale === 'ar';

  useEffect(() => {
    // Only show if not seen before
    const hasSeenPromo = localStorage.getItem('promo_seen');
    if (hasSeenPromo) return;

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/promo');
        const data = await res.json();
        
        if (data && data.enabled) {
          setSettings(data);
          // Show with a slight delay
          setTimeout(() => {
            setIsOpen(true);
          }, 1500);
        }
      } catch (error) {
        console.error('Failed to load promo settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('promo_seen', 'true');
  };

  const handleClaim = () => {
    localStorage.setItem('promo_seen', 'true');
    // Open whatsapp in new tab
    window.open('https://wa.me/962790881392', '_blank');
    setIsOpen(false);
  };

  if (!isOpen || !settings) return null;

  const title = isRtl ? settings.titleAr : settings.titleEn;
  const description = isRtl ? settings.descriptionAr : settings.descriptionEn;
  const oldPrice = settings.originalPrice;
  const newPrice = settings.discountPrice;
  const ctaText = isRtl ? 'تواصل معنا الآن' : 'Contact Us Now';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-brand-500/30 shadow-[0_0_40px_rgba(234,88,12,0.2)] animate-slide-down">
        {/* Glowing bg */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 rounded-full blur-[60px]" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-[60px]" />
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 end-4 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative p-6 sm:p-8 text-center flex flex-col items-center">
          
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-amber-500 flex items-center justify-center shadow-lg shadow-brand-500/20 mb-4 animate-bounce">
            <Sparkles className="h-8 w-8 text-white" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-tight">
            {title}
          </h3>
          
          <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed">
            {description}
          </p>

          <div className="flex items-center justify-center gap-4 mb-8 bg-slate-950/50 p-4 rounded-2xl w-full border border-slate-800">
            <div className="flex flex-col items-end">
              <span className="text-sm text-slate-500 line-through decoration-rose-500/50 decoration-2">
                {oldPrice} JOD
              </span>
              <span className="text-xs text-slate-400">
                {isRtl ? 'السعر الأصلي' : 'Original Price'}
              </span>
            </div>
            
            <div className="h-10 w-px bg-slate-800" />
            
            <div className="flex flex-col items-start">
              <span className="text-3xl font-black text-brand-400 drop-shadow-md">
                {newPrice} JOD
              </span>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                {isRtl ? 'السعر الجديد' : 'New Price'}
              </span>
            </div>
          </div>

          <button 
            onClick={handleClaim}
            className="w-full group relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 py-4 text-base font-bold text-white shadow-lg shadow-[#25D366]/25 hover:shadow-[#25D366]/40 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <MessageCircle className="h-6 w-6 relative z-10" />
            <span className="relative z-10">{ctaText}</span>
          </button>
          
        </div>
      </div>
    </div>
  );
}
