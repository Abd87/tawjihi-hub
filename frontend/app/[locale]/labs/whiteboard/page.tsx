'use client';

import { useEffect, useState } from 'react';
import 'tldraw/tldraw.css';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Save, Sparkles, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import with SSR disabled to prevent hydration errors and canvas disappearing
const Tldraw = dynamic(() => import('tldraw').then((mod) => mod.Tldraw), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
      <p className="text-slate-500 font-medium">جاري تحميل السبورة الذكية...</p>
    </div>
  )
});

export default function WhiteboardPrototype() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Header bar */}
      <div className="h-14 border-b border-slate-200 bg-white flex items-center px-4 justify-between shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRtl ? 'العودة' : 'Back'}
          </Link>
          <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
          <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            {isRtl ? 'السبورة التفاعلية (نسخة تجريبية)' : 'Interactive Whiteboard (Beta)'}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
            <Save className="w-3.5 h-3.5" />
            {isRtl ? 'حفظ تلقائي فعّال' : 'Auto-saving enabled'}
          </div>
          <div className="text-xs font-bold px-3 py-1.5 bg-brand-100 text-brand-700 rounded-full border border-brand-200 shadow-sm">
            Tawjihi Hub
          </div>
        </div>
      </div>

      {/* Whiteboard Container */}
      <div className="flex-1 w-full relative z-0" dir="ltr">
        {mounted && (
          <div style={{ position: 'absolute', inset: 0 }}>
            <Tldraw 
              persistenceKey="tawjihi-whiteboard-prototype-v2"
              inferDarkMode={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}