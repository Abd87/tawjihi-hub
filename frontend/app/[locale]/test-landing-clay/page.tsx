'use client';

import { useParams } from 'next/navigation';
import { PlayCircle, ArrowRight, Smile, Heart } from 'lucide-react';
import Link from 'next/link';

export default function ClaymorphismLandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#FFF0E5] text-[#3D3D3D] font-sans overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ─── NAVIGATION ──────────────────────────────────────────────────────────── */}
      <nav className="pt-6 px-6 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4 bg-white/50 backdrop-blur-xl rounded-[2rem] shadow-[inset_4px_4px_10px_rgba(255,255,255,1),inset_-4px_-4px_10px_rgba(0,0,0,0.05),0_10px_20px_rgba(0,0,0,0.05)] border border-white/80">
          <div className="flex items-center gap-2 text-2xl font-black text-[#FF8A5B]">
            <Smile className="h-8 w-8" />
            Tawjihi Hub
          </div>
          <Link href={`/${locale}/login`} className="px-6 py-2.5 bg-[#4ECDC4] text-white font-bold rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_8px_15px_rgba(78,205,196,0.3)] hover:scale-105 transition-transform active:scale-95 active:shadow-[inset_2px_2px_8px_rgba(0,0,0,0.2)]">
            {isRtl ? 'دخول سريع' : 'Quick Login'}
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#FF8A5B] font-bold rounded-3xl shadow-[inset_2px_2px_5px_rgba(255,255,255,1),inset_-2px_-2px_5px_rgba(0,0,0,0.05),0_10px_20px_rgba(255,138,91,0.15)] border border-white">
            <Heart className="h-5 w-5 fill-current" />
            {isRtl ? 'أحب دراستك' : 'Love your studies'}
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black leading-[1.1] text-[#2C3E50]">
            {isRtl ? 'دراسة التوجيهي' : 'Tawjihi studies'} <br />
            <span className="text-[#FF8A5B] drop-shadow-sm">
              {isRtl ? 'صارت ممتعة!' : 'made fun!'}
            </span>
          </h1>

          <p className="text-xl font-medium text-slate-500 max-w-lg leading-relaxed">
            {isRtl ? 'وداعاً للملل والتوتر. منصتنا مصممة لتجعل رحلتك التعليمية مليئة بالحماس والمرح.' : 'Goodbye boredom and stress. Our platform is designed to make your educational journey full of excitement and fun.'}
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-10 py-5 bg-[#FF8A5B] text-white font-black text-xl rounded-3xl shadow-[inset_3px_3px_6px_rgba(255,255,255,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.2),0_15px_25px_rgba(255,138,91,0.3)] hover:scale-105 active:scale-95 active:shadow-[inset_4px_4px_10px_rgba(0,0,0,0.3)] transition-all flex items-center gap-3">
              {isRtl ? 'يلا نبدأ' : 'Let\'s Go!'}
              <ArrowRight className={`h-6 w-6 stroke-[3] ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        <div className="relative">
          {/* Soft floating background blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFE66D] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-spin-slow blur-2xl opacity-50 z-0" style={{animationDuration: '20s'}} />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#4ECDC4] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] animate-spin-slow blur-2xl opacity-40 z-0" style={{animationDuration: '25s', animationDirection: 'reverse'}} />
          
          <div className="relative z-10 w-full aspect-square md:aspect-video rounded-[3rem] bg-white p-4 shadow-[inset_5px_5px_15px_rgba(255,255,255,1),inset_-5px_-5px_15px_rgba(0,0,0,0.05),0_30px_60px_rgba(0,0,0,0.1)] border-4 border-white flex flex-col transform hover:rotate-1 transition-transform duration-500">
            <div className="flex-1 rounded-[2rem] bg-[#F7F9FC] shadow-[inset_10px_10px_20px_rgba(0,0,0,0.05),inset_-10px_-10px_20px_rgba(255,255,255,1)] flex items-center justify-center relative overflow-hidden">
               <button className="w-24 h-24 bg-white text-[#FF8A5B] rounded-[2rem] flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(255,255,255,1),inset_-4px_-4px_8px_rgba(0,0,0,0.05),0_15px_30px_rgba(255,138,91,0.2)] hover:scale-110 active:scale-95 transition-all z-10">
                 <PlayCircle className="h-12 w-12 stroke-[2.5]" />
               </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
