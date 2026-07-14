'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Beaker, Lock, PlayCircle, ShieldCheck, Maximize } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export default function VirtualLabsPage() {
  const t = useTranslations('navigation');
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  const labRef = useRef<HTMLDivElement>(null);

  const enterFullscreen = () => {
    if (labRef.current) {
      if (labRef.current.requestFullscreen) {
        labRef.current.requestFullscreen();
      } else if ((labRef.current as any).webkitRequestFullscreen) {
        (labRef.current as any).webkitRequestFullscreen();
      } else if ((labRef.current as any).msRequestFullscreen) {
        (labRef.current as any).msRequestFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans pb-20">
      {/* Header Section */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-500/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-bold mb-6">
            <Beaker className="h-4 w-4" />
            {isRtl ? 'المختبرات الافتراضية' : 'Virtual Labs'}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            {isRtl ? 'جرب العلوم ' : 'Experience Science '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-400">
              {isRtl ? 'عملياً' : 'Practically'}
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {isRtl 
              ? 'تجارب تفاعلية مجانية مقدمة بالتعاون مع PhET لتبسيط مفاهيم الفيزياء والكيمياء لطلبة التوجيهي.' 
              : 'Free interactive experiments powered by PhET to simplify physics and chemistry concepts.'}
          </p>
        </div>
      </div>

      {/* Free Demo Lab Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-brand-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-brand-500/10">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                <PlayCircle className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {isRtl ? 'بناء الدوائر الكهربائية (تجربة مجانية)' : 'Circuit Construction Kit (Free Demo)'}
                </h2>
                <p className="text-sm text-slate-400">
                  {isRtl ? 'فيزياء التوجيهي - وحدة التيار الكهربائي' : 'Grade 12 Physics - Electric Current Unit'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
                {isRtl ? 'مفتوح للجميع' : 'Open for All'}
              </span>
              <button 
                onClick={enterFullscreen}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
              >
                <Maximize className="h-3.5 w-3.5" />
                {isRtl ? 'ملء الشاشة' : 'Fullscreen'}
              </button>
            </div>
          </div>
          <div ref={labRef} className="w-full h-[600px] md:h-[700px] bg-slate-950 relative">
            <iframe 
              src={`https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html?locale=${locale}`}
              width="100%" 
              height="100%" 
              allowFullScreen
              className="border-0 absolute inset-0"
              title="PhET Circuit Construction Kit"
            ></iframe>
          </div>
        </div>

        {/* Locked Premium Labs Grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-slate-400" />
            {isRtl ? 'المختبرات الحصرية للطلاب المشتركين' : 'Premium Labs for Enrolled Students'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Locked Lab 1 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-100 transition-all">
                <Lock className="h-10 w-10 text-slate-500 mb-3" />
                <p className="text-slate-300 font-bold mb-4">
                  {isRtl ? 'متاح للمشتركين فقط' : 'Available for Enrolled Students'}
                </p>
                <Link href="/login" className="px-6 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  {isRtl ? 'تسجيل الدخول لفتح المعمل' : 'Login to Unlock'}
                </Link>
              </div>
              <div className="opacity-40 blur-sm pointer-events-none">
                <div className="w-full h-40 bg-slate-800 rounded-2xl mb-4"></div>
                <h4 className="text-lg font-bold text-white mb-2">{isRtl ? 'حركة المقذوفات' : 'Projectile Motion'}</h4>
                <p className="text-sm text-slate-500">{isRtl ? 'تجارب الزخم وحفظ الطاقة' : 'Momentum and Energy Conservation'}</p>
              </div>
            </div>

            {/* Locked Lab 2 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-100 transition-all">
                <Lock className="h-10 w-10 text-slate-500 mb-3" />
                <p className="text-slate-300 font-bold mb-4">
                  {isRtl ? 'متاح للمشتركين فقط' : 'Available for Enrolled Students'}
                </p>
                <Link href="/login" className="px-6 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  {isRtl ? 'تسجيل الدخول لفتح المعمل' : 'Login to Unlock'}
                </Link>
              </div>
              <div className="opacity-40 blur-sm pointer-events-none">
                <div className="w-full h-40 bg-slate-800 rounded-2xl mb-4"></div>
                <h4 className="text-lg font-bold text-white mb-2">{isRtl ? 'قانون فاراداي' : 'Faraday Law'}</h4>
                <p className="text-sm text-slate-500">{isRtl ? 'الحث الكهرومغناطيسي' : 'Electromagnetic Induction'}</p>
              </div>
            </div>

            {/* Locked Lab 3 */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative group overflow-hidden">
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-100 transition-all">
                <Lock className="h-10 w-10 text-slate-500 mb-3" />
                <p className="text-slate-300 font-bold mb-4">
                  {isRtl ? 'متاح للمشتركين فقط' : 'Available for Enrolled Students'}
                </p>
                <Link href="/login" className="px-6 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  {isRtl ? 'تسجيل الدخول لفتح المعمل' : 'Login to Unlock'}
                </Link>
              </div>
              <div className="opacity-40 blur-sm pointer-events-none">
                <div className="w-full h-40 bg-slate-800 rounded-2xl mb-4"></div>
                <h4 className="text-lg font-bold text-white mb-2">{isRtl ? 'التركيز والمحاليل الكيميائية' : 'Concentration & Solutions'}</h4>
                <p className="text-sm text-slate-500">{isRtl ? 'تجارب الكيمياء العضوية' : 'Organic Chemistry Labs'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
