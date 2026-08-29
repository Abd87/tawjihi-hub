'use client';

import { useEffect, useState } from 'react';
import 'tldraw/tldraw.css';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const Tldraw = dynamic(
  () => import('tldraw').then((mod) => mod.Tldraw),
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#f8fafc' }} dir="ltr">
      {/* Custom Header Overlaid on top of Tldraw */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '56px', backgroundColor: 'white', display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between', zIndex: 10, borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            href={`/${locale}/dashboard`}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#64748b', textDecoration: 'none' }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Back
          </Link>
          <div style={{ height: '16px', width: '1px', backgroundColor: '#cbd5e1' }}></div>
          <h1 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Sparkles style={{ width: '16px', height: '16px', color: '#0ea5e9' }} />
            Interactive Whiteboard (Beta)
          </h1>
        </div>
      </div>

      {/* The actual Tldraw component, absolute positioned below the header */}
      <div style={{ position: 'absolute', top: '56px', left: 0, right: 0, bottom: 0 }}>
        <Tldraw inferDarkMode={false} persistenceKey="tawjihi-whiteboard-stable" />
      </div>
    </div>
  );
}