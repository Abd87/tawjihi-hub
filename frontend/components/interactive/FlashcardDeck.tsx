'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { Flashcard } from '@/data/grammar-foundation';
import { useTranslations } from 'next-intl';

export default function FlashcardDeck({ cards, isRtl }: { cards: Flashcard[], isRtl: boolean }) {
  const t = useTranslations('courses');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completed, setCompleted] = useState(false);

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setCompleted(true);
      }
    }, 150); // slight delay for flip animation reset
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
      }, 150);
    }
  };

  if (completed) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-8 border border-emerald-500/30 flex flex-col items-center justify-center text-center animate-fade-in min-h-[300px]">
        <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">
          {isRtl ? 'عمل رائع!' : 'Great Job!'}
        </h3>
        <p className="text-slate-300">
          {isRtl ? 'لقد أكملت جميع البطاقات في هذه الوحدة.' : 'You have completed all cards in this module.'}
        </p>
        <button 
          onClick={() => { setCurrentIndex(0); setCompleted(false); }}
          className="mt-6 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition-colors flex items-center gap-2"
        >
          <RotateCw className="w-4 h-4" />
          {isRtl ? 'مراجعة مرة أخرى' : 'Review Again'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      
      {/* Progress Bar */}
      <div className="w-full flex items-center justify-between mb-4 text-sm text-slate-400">
        <span>{currentIndex + 1} / {cards.length}</span>
        <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${((currentIndex) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card Container (Perspective for 3D flip) */}
      <div 
        className="relative w-full aspect-[4/3] max-h-[400px] perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-800 border-2 border-slate-700 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center">
            <h4 className="text-3xl font-bold text-white leading-tight" dir={isRtl ? 'rtl' : 'ltr'}>
              {isRtl ? currentCard.frontAr : currentCard.frontEn}
            </h4>
            <div className="absolute bottom-6 text-slate-500 text-sm flex items-center gap-2">
              <RotateCw className="w-4 h-4 opacity-50" />
              {isRtl ? 'اضغط للقلب' : 'Tap to flip'}
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-emerald-900/40 border-2 border-emerald-500/50 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center">
            <h4 className="text-4xl font-black text-emerald-400 mb-2" dir="ltr">
              {currentCard.backEn}
            </h4>
            {currentCard.backAr && currentCard.backAr !== currentCard.backEn && (
              <p className="text-xl text-emerald-100/80" dir="rtl">
                {currentCard.backAr}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Controls */}
      <div className="w-full flex items-center justify-between mt-8">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isRtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>
        
        <button 
          onClick={handleNext}
          className="px-8 py-3 rounded-full bg-emerald-500 text-slate-900 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
        >
          {currentIndex === cards.length - 1 ? (isRtl ? 'إنهاء' : 'Finish') : (isRtl ? 'التالي' : 'Next')}
        </button>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
