'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import 'tldraw/tldraw.css';

// Dynamic import with SSR disabled to prevent hydration and window issues
const Tldraw = dynamic(() => import('tldraw').then((mod) => mod.Tldraw), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      Loading Smart Whiteboard...
    </div>
  )
});

export default function InfiniteWhiteboard() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay mount to ensure DOM is fully painted and stable
    const timer = setTimeout(() => {
      setMounted(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999, backgroundColor: '#f8fafc', touchAction: 'none' }} dir="ltr">
      
      {/* Floating Back Button */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 9999999 }}>
        <Link 
          href={`/${locale}/dashboard`}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#0ea5e9', 
            color: '#ffffff', 
            padding: '10px 20px', 
            borderRadius: '8px',
            textDecoration: 'none',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: 'bold',
            fontSize: '14px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}
        >
          {locale === 'ar' ? 'العودة للوحة التحكم' : 'Back to Dashboard'}
        </Link>
      </div>

      {/* The Infinite Canvas */}
      {mounted && (
        <Tldraw inferDarkMode={false} />
      )}
    </div>
  );
}