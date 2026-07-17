'use client';

import { useParams } from 'next/navigation';
import { BookOpen, ArrowRight, Library } from 'lucide-react';
import Link from 'next/link';

export default function AcademicLandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-800 overflow-hidden font-serif" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ─── NAVIGATION ──────────────────────────────────────────────────────────── */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-slate-900">
            <Library className="h-7 w-7 text-blue-600" />
            Tawjihi Hub.
          </div>
          <div className="flex items-center gap-8 font-sans">
            <Link href={`/${locale}/login`} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              {isRtl ? 'دخول' : 'Sign In'}
            </Link>
            <Link href={`/${locale}/register`} className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full shadow-sm hover:bg-slate-800 transition-colors">
              {isRtl ? 'ابدأ الآن' : 'Get Started'}
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-widest rounded-full font-sans">
            <BookOpen className="h-3 w-3" />
            {isRtl ? 'التميز الأكاديمي' : 'Academic Excellence'}
          </div>
          
          <h1 className="text-5xl md:text-6xl font-medium leading-[1.1] text-slate-900">
            {isRtl ? 'مستقبلك يبدأ' : 'Your future begins'} <br />
            <span className="italic text-slate-500 font-light">
              {isRtl ? 'من هنا.' : 'right here.'}
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-md leading-relaxed font-sans font-light">
            {isRtl ? 'منصة تعليمية متكاملة تقدم محتوى رصيناً وشاملاً لطلاب التوجيهي للوصول إلى أعلى المراتب.' : 'A comprehensive educational platform providing rigorous and complete content for Tawjihi students.'}
          </p>

          <div className="flex flex-wrap gap-4 font-sans">
            <button className="px-8 py-3.5 bg-blue-600 text-white font-medium text-base rounded-full shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:bg-blue-500 transition-all flex items-center gap-2">
              {isRtl ? 'تصفح المناهج' : 'Browse Curriculum'}
              <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-slate-50 rounded-[2.5rem] transform rotate-3 scale-105 -z-10" />
          <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50">
            <div className="aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50 mix-blend-multiply pointer-events-none" />
               <BookOpen className="h-16 w-16 text-slate-300 stroke-[1]" />
            </div>
            
            <div className="space-y-4 font-sans">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <div className="text-sm text-slate-500">{isRtl ? 'المادة' : 'Subject'}</div>
                  <div className="font-medium text-slate-900">{isRtl ? 'الفيزياء المتقدمة' : 'Advanced Physics'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">{isRtl ? 'الفصل' : 'Chapter'}</div>
                  <div className="font-medium text-blue-600">04</div>
                </div>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[60%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
