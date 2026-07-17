'use client';

import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LuxuryLandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-serif overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ─── NAVIGATION ──────────────────────────────────────────────────────────── */}
      <nav className="w-full pt-10 px-12 absolute top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="text-2xl tracking-[0.2em] uppercase text-[#1A1A1A]">
            Tawjihi<span className="font-light text-[#D4AF37]">Hub</span>
          </div>
          <div className="flex items-center gap-12 font-sans tracking-widest text-xs uppercase">
            <Link href={`/${locale}/login`} className="hover:text-[#D4AF37] transition-colors duration-500">
              {isRtl ? 'تسجيل الدخول' : 'Sign In'}
            </Link>
            <Link href={`/${locale}/register`} className="px-8 py-3 border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors duration-500">
              {isRtl ? 'العضوية' : 'Membership'}
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────────────────────────────── */}
      <main className="min-h-screen flex flex-col justify-center px-12 pt-32 pb-20 relative">
        <div className="absolute top-1/2 right-12 -translate-y-1/2 w-1/3 aspect-[3/4] bg-[#F2F2F2] -z-10 overflow-hidden">
           <div className="w-full h-full bg-[#1A1A1A]/5 object-cover" />
        </div>

        <div className="max-w-4xl space-y-12">
          <div className="text-[#D4AF37] font-sans tracking-[0.3em] text-xs uppercase">
            {isRtl ? 'أكاديمية التميز الخاصة' : 'Private Excellence Academy'}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-light leading-[1.1]">
            {isRtl ? 'ارتقِ بتعليمك' : 'Elevate your'} <br />
            <span className="italic">
              {isRtl ? 'إلى القمة.' : 'education.'}
            </span>
          </h1>

          <p className="text-lg text-[#666666] max-w-md font-sans font-light leading-loose">
            {isRtl ? 'المنصة التعليمية الأكثر حصرية وتطوراً لطلاب التوجيهي في الأردن. مصممة لنخبة الطلاب.' : 'The most exclusive and advanced educational platform for Tawjihi students in Jordan. Designed for the elite.'}
          </p>

          <div className="pt-8">
            <button className="group flex items-center gap-6 font-sans tracking-widest text-xs uppercase text-[#1A1A1A] hover:text-[#D4AF37] transition-colors duration-500">
              <span className="border-b border-current pb-1">{isRtl ? 'اكتشف البرامج' : 'Discover Programs'}</span>
              <ArrowRight className={`h-4 w-4 transform group-hover:translate-x-4 transition-transform duration-500 ${isRtl ? 'rotate-180 group-hover:-translate-x-4' : ''}`} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
