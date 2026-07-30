'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { grammarFoundationData } from '@/data/grammar-foundation';
import FlashcardDeck from '@/components/interactive/FlashcardDeck';
import SpotTheMistake from '@/components/interactive/SpotTheMistake';
import { BookOpen, AlertCircle, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function FoundationCoursePage() {
  const t = useTranslations('courses');
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  const router = useRouter();

  const [activeModuleId, setActiveModuleId] = useState<string>(grammarFoundationData[0].id);

  const activeModule = grammarFoundationData.find(m => m.id === activeModuleId);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href={`/${locale}/courses`}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {isRtl ? 'دورة التأسيس المجانية' : 'Free Foundation Course'}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? 'قواعد اللغة الإنجليزية' : 'English Grammar'}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar / Modules List */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden sticky top-24">
            <div className="p-4 bg-slate-800/50 border-b border-slate-800">
              <h2 className="font-bold text-lg">
                {isRtl ? 'محتويات الدورة' : 'Course Contents'}
              </h2>
            </div>
            <div className="p-2 space-y-1">
              {grammarFoundationData.map((mod, index) => {
                const isActive = activeModuleId === mod.id;
                const Icon = mod.type === 'FLASHCARDS' ? BookOpen : AlertCircle;
                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleId(mod.id)}
                    className={`w-full text-start px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                      isActive 
                        ? 'bg-emerald-500 text-slate-900 font-bold shadow-lg shadow-emerald-500/20' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-slate-900/20' : 'bg-slate-800'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs opacity-80 mb-0.5">
                        {isRtl ? `الوحدة ${index + 1}` : `Module ${index + 1}`}
                      </div>
                      <div className="text-sm">
                        {isRtl ? mod.titleAr : mod.titleEn}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <div className="p-4 mt-2 border-t border-slate-800 bg-slate-800/20">
              <Link 
                href={`/${locale}/courses`}
                className="w-full block text-center px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors"
              >
                {isRtl ? 'تصفح الدورات الكاملة' : 'Browse Full Courses'}
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 min-w-0">
          {activeModule && (
            <div className="animate-fade-in">
              <div className="mb-8 text-center md:text-start">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {isRtl ? activeModule.titleAr : activeModule.titleEn}
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl">
                  {isRtl ? activeModule.descriptionAr : activeModule.descriptionEn}
                </p>
              </div>

              <div className="w-full">
                {activeModule.type === 'FLASHCARDS' && activeModule.flashcards && (
                  <FlashcardDeck cards={activeModule.flashcards} isRtl={isRtl} />
                )}
                {activeModule.type === 'SPOT_MISTAKE' && activeModule.spotMistakes && (
                  <SpotTheMistake questions={activeModule.spotMistakes} isRtl={isRtl} />
                )}
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
