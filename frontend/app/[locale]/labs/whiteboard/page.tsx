'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const Excalidraw = dynamic(
  () => import('@excalidraw/excalidraw').then((mod) => mod.Excalidraw),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">جاري تحميل السبورة الذكية...</p>
      </div>
    )
  }
);

export default function WhiteboardPrototype() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  // We don't really need `mounted` if we use next/dynamic with ssr: false, it won't render on server
  return (
    <div className="w-screen h-screen flex flex-col bg-slate-50 text-slate-900 overflow-hidden">
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
            {isRtl ? 'السبورة التفاعلية' : 'Interactive Whiteboard'}
          </h1>
        </div>
      </div>

      <div style={{ height: 'calc(100vh - 3.5rem)', width: '100vw' }} dir="ltr">
        <Excalidraw theme="light" />
      </div>
    </div>
  );
}