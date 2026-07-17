'use client';

import { useParams } from 'next/navigation';
import { PlayCircle, ArrowRight, Sword, Shield, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function GamifiedLandingPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* ─── NAVIGATION ──────────────────────────────────────────────────────────── */}
      <nav className="border-b border-indigo-500/20 bg-[#0B1120]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
            <Sword className="h-6 w-6 text-cyan-400" />
            Tawjihi Hub
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-indigo-900/40 rounded-full border border-indigo-500/30 text-indigo-300 text-sm font-medium">
              <Trophy className="h-4 w-4 text-yellow-400" /> 
              <span>LVL. 99</span>
            </div>
            <Link href={`/${locale}/login`} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
              {isRtl ? 'دخول اللاعبين' : 'Player Login'}
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ───────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center relative">
        {/* Neon Glows */}
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-950 border border-indigo-500/50 rounded-full text-indigo-300 text-sm font-mono tracking-widest shadow-[0_0_10px_rgba(99,102,241,0.3)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {isRtl ? 'تحديث السيرفر: متاح الآن' : 'SERVER UPDATE: ONLINE'}
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black leading-tight uppercase tracking-tight">
            {isRtl ? 'ارفع مستواك' : 'Level Up'} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              {isRtl ? 'في التوجيهي' : 'Your Grades'}
            </span>
          </h1>

          <p className="text-lg text-indigo-200/80 max-w-lg font-medium leading-relaxed">
            {isRtl ? 'حول دراستك إلى مغامرة ملحمية. أكمل المهام، اكسب النقاط، وتغلب على الامتحانات.' : 'Turn your studies into an epic adventure. Complete quests, earn XP, and conquer the exams.'}
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black text-lg rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all flex items-center gap-3 group border border-cyan-400/50">
              <PlayCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {isRtl ? 'ابدأ اللعب الآن' : 'START PLAYING NOW'}
            </button>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-gray-900/80 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_50px_rgba(79,70,229,0.15)]">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
               <div className="flex items-center gap-3">
                 <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
                   <Shield className="h-6 w-6 text-indigo-400" />
                 </div>
                 <div>
                   <div className="text-sm text-indigo-300 font-mono">CURRENT QUEST</div>
                   <div className="font-bold">{isRtl ? 'اختبار الرياضيات النهائي' : 'Final Math Boss'}</div>
                 </div>
               </div>
               <div className="text-right">
                 <div className="text-2xl font-black text-cyan-400">85%</div>
                 <div className="text-xs text-indigo-400">COMPLETION</div>
               </div>
            </div>

            {/* Mock Progress Bar */}
            <div className="space-y-2 mb-8">
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                <div className="w-[85%] h-full bg-gradient-to-r from-cyan-400 to-indigo-500 relative">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
                 <div className="text-3xl font-black text-yellow-400">12,450</div>
                 <div className="text-xs text-gray-400 font-mono">TOTAL XP</div>
               </div>
               <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2">
                 <div className="text-3xl font-black text-purple-400">14</div>
                 <div className="text-xs text-gray-400 font-mono">ACHIEVEMENTS</div>
               </div>
            </div>
          </div>
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { background-position: 1rem 0; }
          100% { background-position: 0 0; }
        }
      `}} />
    </div>
  );
}
