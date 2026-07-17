'use client';

import { useParams } from 'next/navigation';
import { PlayCircle, ArrowRight, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function VibrantLandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#F0FDFA] text-[#134E4A] font-sans overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ─── NAVIGATION ──────────────────────────────────────────────────────────── */}
      <nav className="border-b-4 border-[#134E4A] bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-2xl font-black">
            <div className="bg-[#0891B2] p-2 rounded-lg border-2 border-[#134E4A] shadow-[4px_4px_0_#134E4A]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            Tawjihi Hub
          </div>
          <Link href={`/${locale}/login`} className="px-6 py-2 bg-[#16A34A] text-white font-bold border-2 border-[#134E4A] shadow-[4px_4px_0_#134E4A] hover:translate-y-1 hover:shadow-[2px_2px_0_#134E4A] transition-all rounded-lg">
            {isRtl ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-block px-4 py-2 bg-[#22D3EE] border-2 border-[#134E4A] rounded-full font-bold shadow-[4px_4px_0_#134E4A]">
            {isRtl ? '🔥 الأفضل في الأردن' : '🔥 Best in Jordan'}
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black leading-tight">
            {isRtl ? 'اكسر قواعد' : 'Break the rules of'} <br />
            <span className="text-white bg-[#0891B2] px-4 py-1 rounded-xl border-4 border-[#134E4A] inline-block mt-2 shadow-[8px_8px_0_#134E4A] rotate-[-2deg]">
              {isRtl ? 'الدراسة التقليدية' : 'traditional study'}
            </span>
          </h1>

          <p className="text-xl font-semibold max-w-lg">
            {isRtl ? 'لا تكتفِ بالنجاح، بل اسعى للتفوق! انضم لآلاف الطلاب وابدأ التحدي الآن.' : 'Don\'t just pass, aim for excellence! Join thousands of students and start the challenge now.'}
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-[#16A34A] text-white font-black text-lg border-4 border-[#134E4A] rounded-xl shadow-[8px_8px_0_#134E4A] hover:translate-y-2 hover:shadow-[0px_0px_0_#134E4A] transition-all flex items-center gap-2">
              {isRtl ? 'ابدأ مجاناً' : 'Start for Free'}
              <ArrowRight className={`h-6 w-6 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Blocky decorative elements */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400 border-4 border-[#134E4A] rounded-full shadow-[6px_6px_0_#134E4A] z-0" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-400 border-4 border-[#134E4A] rounded-lg shadow-[6px_6px_0_#134E4A] rotate-12 z-0" />
          
          {/* Main Video Box */}
          <div className="relative z-10 bg-white border-4 border-[#134E4A] rounded-3xl shadow-[16px_16px_0_#134E4A] overflow-hidden aspect-video flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-[#0891B2]/10" />
            <button className="w-24 h-24 bg-[#16A34A] rounded-full border-4 border-[#134E4A] flex items-center justify-center shadow-[6px_6px_0_#134E4A] group-hover:scale-110 transition-transform z-10">
              <PlayCircle className="h-12 w-12 text-white ml-1" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
