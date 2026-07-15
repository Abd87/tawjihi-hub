'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, GraduationCap, Star, TrendingUp, X } from 'lucide-react';

const namesAr = ['أحمد من إربد', 'سارة من عمّان', 'عمر من الزرقاء', 'ليان من السلط', 'محمود من العقبة', 'راما من الكرك', 'يوسف من المفرق'];
const namesEn = ['Ahmad from Irbid', 'Sarah from Amman', 'Omar from Zarqa', 'Layan from Salt', 'Mahmoud from Aqaba', 'Rama from Karak', 'Yousef from Mafraq'];

const actionsAr = [
  { text: 'حصل للتو على 100٪ في اختبار الرياضيات!', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/20' },
  { text: 'سجل الآن في مسار BTEC هندسة.', icon: GraduationCap, color: 'text-brand-400', bg: 'bg-brand-400/20' },
  { text: 'أنهى بنجاح 5 دروس في الفيزياء.', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  { text: 'قام بتفعيل بطاقة توجيهي هب.', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/20' },
];

const actionsEn = [
  { text: 'just scored 100% on the Math quiz!', icon: Star, color: 'text-amber-400', bg: 'bg-amber-400/20' },
  { text: 'just enrolled in BTEC Engineering.', icon: GraduationCap, color: 'text-brand-400', bg: 'bg-brand-400/20' },
  { text: 'successfully completed 5 Physics lessons.', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/20' },
  { text: 'activated their Tawjihi Hub Access Card.', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-400/20' },
];

export default function SocialProofPopup({ isRtl }: { isRtl: boolean }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<{
    name: string;
    action: { text: string; icon: any; color: string; bg: string };
    timeAgo: string;
  } | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Generate a random notification
    const generateNotification = () => {
      const names = isRtl ? namesAr : namesEn;
      const actions = isRtl ? actionsAr : actionsEn;
      
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      // Random time between 1 and 15 minutes ago
      const minutesAgo = Math.floor(Math.random() * 15) + 1;
      const timeAgo = isRtl ? `منذ ${minutesAgo} دقيقة` : `${minutesAgo} min ago`;

      setCurrentNotification({
        name: randomName,
        action: randomAction,
        timeAgo,
      });
      setIsVisible(true);

      // Hide after 6 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    // Initial delay before first popup
    const initialTimer = setTimeout(() => {
      generateNotification();
      
      // Subsequent popups every 30-45 seconds
      const loop = () => {
        const randomDelay = Math.floor(Math.random() * 15000) + 30000;
        timeoutId = setTimeout(() => {
          generateNotification();
          loop();
        }, randomDelay);
      };
      loop();
      
    }, 10000); // 10 seconds

    return () => {
      clearTimeout(initialTimer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isRtl]);

  if (!currentNotification) return null;

  const Icon = currentNotification.action.icon;

  return (
    <div 
      className={`fixed bottom-6 z-50 transition-all duration-700 ease-in-out sm:max-w-sm w-[calc(100%-32px)] 
        ${isRtl ? 'left-4 sm:left-6' : 'right-4 sm:right-6'} 
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}
      `}
    >
      <div className="relative overflow-hidden bg-slate-900/95 backdrop-blur-md border border-slate-800 shadow-2xl rounded-2xl p-4 pr-10 flex items-start gap-4">
        
        {/* Subtle glow effect */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl" />

        <div className={`shrink-0 p-2.5 rounded-full ${currentNotification.action.bg}`}>
          <Icon className={`h-5 w-5 ${currentNotification.action.color}`} />
        </div>
        
        <div className="flex-1 min-w-0 pt-0.5">
          <p className="text-sm font-bold text-white mb-0.5 truncate">
            {currentNotification.name}
          </p>
          <p className="text-xs text-slate-300 leading-snug">
            {currentNotification.action.text}
          </p>
          <p className="text-[10px] text-slate-500 mt-1.5 font-medium">
            {currentNotification.timeAgo}
          </p>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 end-3 text-slate-500 hover:text-slate-300 transition-colors p-1"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
