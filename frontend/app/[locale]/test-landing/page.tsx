'use client';

import { useParams } from 'next/navigation';
import { PlayCircle, ArrowRight, Sparkles, GraduationCap, Users, Star } from 'lucide-react';
import Link from 'next/link';

export default function TestLandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  
  // Use translations if needed, or hardcode some premium marketing text
  const t = {
    heroTitle: isRtl ? 'تعلم بذكاء، تفوق بثقة' : 'Learn Smarter, Excel with Confidence',
    heroSubtitle: isRtl 
      ? 'منصة توجيهي هب تضع بين يديك أحدث التقنيات التعليمية لضمان نجاحك في امتحانات التوجيهي.' 
      : 'Tawjihi Hub puts the latest educational technologies in your hands to ensure your success in Tawjihi exams.',
    ctaPrimary: isRtl ? 'ابدأ رحلتك الآن' : 'Start Your Journey Now',
    ctaSecondary: isRtl ? 'شاهد كيف نعمل' : 'See How It Works',
    stats: [
      { id: 1, label: isRtl ? 'طالب مسجل' : 'Registered Students', value: '10K+' },
      { id: 2, label: isRtl ? 'دورة تعليمية' : 'Educational Courses', value: '150+' },
      { id: 3, label: isRtl ? 'نسبة نجاح' : 'Success Rate', value: '98%' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#050515] text-white overflow-hidden relative selection:bg-purple-500/30 font-sans" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* ─── GLASSMORPHISM BACKGROUND ORBS ──────────────────────────────────────── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] overflow-hidden pointer-events-none">
        {/* Deep Blue Orb */}
        <div className="absolute top-[-100px] left-[10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Purple Orb */}
        <div className="absolute top-[50px] right-[10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        {/* Teal Orb */}
        <div className="absolute bottom-[-100px] left-[30%] w-[400px] h-[400px] bg-teal-500/20 rounded-full mix-blend-screen filter blur-[90px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
      </div>

      {/* ─── NAVIGATION OVERLAY (MOCK) ──────────────────────────────────────────── */}
      <nav className="relative z-50 pt-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            <GraduationCap className="h-6 w-6 text-blue-400" />
            Tawjihi Hub
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href={`/${locale}`} className="hover:text-white transition-colors">{isRtl ? 'الرئيسية' : 'Home'}</a>
            <a href="#" className="hover:text-white transition-colors">{isRtl ? 'الدورات' : 'Courses'}</a>
            <a href="#" className="hover:text-white transition-colors">{isRtl ? 'عن المنصة' : 'About Us'}</a>
          </div>
          <Link href={`/${locale}/login`} className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/5 backdrop-blur-sm transition-all font-semibold text-sm">
            {isRtl ? 'تسجيل الدخول' : 'Sign In'}
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────────────────────────────── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left: Text Content */}
        <div className="flex-1 space-y-8 text-center lg:text-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-sm font-medium text-blue-200 w-fit mx-auto lg:mx-0 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Sparkles className="h-4 w-4" />
            <span>{isRtl ? 'المنصة التعليمية الأولى في الأردن 🇯🇴' : 'The #1 Educational Platform in Jordan 🇯🇴'}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
            {isRtl ? 'تعلم بذكاء،' : 'Learn Smarter,'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400">
              {isRtl ? 'تفوق بثقة' : 'Excel with Confidence'}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 font-bold text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] transition-all hover:scale-105 flex items-center justify-center gap-2">
              {t.ctaPrimary}
              {isRtl ? <ArrowRight className="h-5 w-5 rotate-180" /> : <ArrowRight className="h-5 w-5" />}
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md font-bold text-white transition-all hover:scale-105 flex items-center justify-center gap-2">
              <PlayCircle className="h-5 w-5" />
              {t.ctaSecondary}
            </button>
          </div>
          
          <div className="pt-8 flex items-center gap-4 justify-center lg:justify-start text-sm text-slate-400">
            <div className="flex flex-col">
              <div className="flex items-center justify-center lg:justify-start gap-1 text-amber-400 mb-1">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
              </div>
              <span>{isRtl ? 'تقييم 4.9/5 من الطلاب' : 'Rated 4.9/5 by students'}</span>
            </div>
          </div>
        </div>

        {/* Right: Glassmorphism Card / Video Preview */}
        <div className="flex-1 w-full relative perspective-1000">
          <div className="relative w-full aspect-video rounded-3xl bg-white/5 border border-white/20 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-4 transform lg:rotate-y-[-10deg] lg:rotate-x-[5deg] transition-transform duration-700 hover:rotate-0 flex flex-col overflow-hidden group">
            {/* Glossy Reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-3xl pointer-events-none" />
            
            {/* Mock UI inside the glass card */}
            <div className="flex items-center justify-between mb-6">
              <div className="w-24 h-4 rounded-full bg-white/20" />
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-rose-500/80" />
                <div className="w-4 h-4 rounded-full bg-amber-500/80" />
                <div className="w-4 h-4 rounded-full bg-emerald-500/80" />
              </div>
            </div>
            
            <div className="flex-1 rounded-2xl bg-black/40 border border-white/5 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20" />
               <button className="w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.1)] z-10">
                 <PlayCircle className="h-10 w-10 text-white ml-1" />
               </button>
            </div>
            
            {/* Floating Stats Badge */}
            <div className="absolute -bottom-6 -left-6 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">10K+</div>
                <div className="text-xs text-emerald-400 font-medium">{isRtl ? 'طالب نشط' : 'Active Students'}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── STATS SECTION ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.02] backdrop-blur-md py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x md:rtl:divide-x-reverse divide-white/10">
          {t.stats.map(stat => (
            <div key={stat.id} className="text-center py-4">
              <div className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">{stat.value}</div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
