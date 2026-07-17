'use client';

import { useParams } from 'next/navigation';
import { ArrowRight, Star, PlayCircle } from 'lucide-react';
import Link from 'next/link';

export default function BrutalismLandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#FFF000] text-black font-mono overflow-hidden selection:bg-black selection:text-[#FFF000]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ─── NAVIGATION ──────────────────────────────────────────────────────────── */}
      <nav className="border-b-8 border-black bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
            <span className="bg-black text-white px-2 py-1 rotate-3">T</span>
            HUB
          </div>
          <Link href={`/${locale}/login`} className="px-8 py-3 bg-[#FF0055] text-white font-bold uppercase border-4 border-black shadow-[6px_6px_0_#000] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0px_0px_0_#000] transition-all">
            {isRtl ? 'دخول' : 'ENTER'}
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid xl:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-4 border-black font-black uppercase shadow-[4px_4px_0_#000] -rotate-2">
            <Star className="h-5 w-5 fill-current" />
            {isRtl ? 'لا عذر بعد اليوم' : 'NO MORE EXCUSES'}
          </div>
          
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.9] tracking-tighter">
            {isRtl ? 'كسر' : 'CRUSH'} <br />
            <span className="text-white drop-shadow-[4px_4px_0_#000] stroke-black">
              {isRtl ? 'النظام' : 'EXAMS.'}
            </span>
          </h1>

          <p className="text-2xl font-bold max-w-lg bg-white border-4 border-black p-4 shadow-[6px_6px_0_#000]">
            {isRtl ? 'طريقة جديدة كلياً لاجتياز التوجيهي بقوة.' : 'A completely new way to dominate your Tawjihi exams.'}
          </p>

          <div className="flex flex-wrap gap-6 pt-4">
            <button className="px-10 py-5 bg-[#00E5FF] text-black font-black text-2xl uppercase border-4 border-black shadow-[8px_8px_0_#000] hover:translate-y-2 hover:translate-x-2 hover:shadow-[0px_0px_0_#000] transition-all flex items-center gap-4">
              {isRtl ? 'ابدأ الآن' : 'START NOW'}
              <ArrowRight className={`h-8 w-8 stroke-[4] ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Glitchy/Raw Video Box */}
          <div className="w-full aspect-square bg-[#FF0055] border-8 border-black shadow-[16px_16px_0_#000] p-4 flex flex-col relative z-10 group rotate-2 hover:rotate-0 transition-transform">
            <div className="flex justify-between border-b-4 border-black pb-2 mb-4">
               <div className="font-black text-2xl">VIDEO.MP4</div>
               <div className="flex gap-2">
                 <div className="w-6 h-6 border-4 border-black rounded-full bg-white" />
                 <div className="w-6 h-6 border-4 border-black rounded-full bg-black" />
               </div>
            </div>
            <div className="flex-1 bg-white border-4 border-black flex items-center justify-center overflow-hidden relative">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-20" />
               <div className="text-8xl font-black rotate-[-10deg] opacity-10 uppercase group-hover:scale-150 transition-transform duration-700">PLAY</div>
               <div className="w-32 h-32 bg-[#FFF000] border-8 border-black rounded-full flex items-center justify-center absolute z-10 animate-bounce">
                 <PlayCircle className="h-16 w-16 stroke-[3]" />
               </div>
            </div>
          </div>
          
          <div className="absolute -bottom-10 -left-10 bg-white border-4 border-black px-6 py-4 font-black text-3xl shadow-[8px_8px_0_#000] z-20 -rotate-6">
            100% {isRtl ? 'مضمون' : 'LEGIT'}
          </div>
        </div>
      </main>
    </div>
  );
}
