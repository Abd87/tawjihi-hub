'use client';

import { useState } from 'react';
import { SpotMistakeQuestion } from '@/data/grammar-foundation';
import { useTranslations } from 'next-intl';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SpotTheMistake({ questions, isRtl }: { questions: SpotMistakeQuestion[], isRtl: boolean }) {
  const t = useTranslations('courses');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const [shakeWordIndex, setShakeWordIndex] = useState<number | null>(null);

  const currentQ = questions[currentIndex];
  const isCurrentSolved = solved[currentIndex];

  const words = currentQ.sentence.split(' ');

  const handleWordClick = (index: number) => {
    if (isCurrentSolved) return;

    if (index === currentQ.wrongWordIndex) {
      // Correct!
      setSolved(prev => ({ ...prev, [currentIndex]: true }));
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399']
      });
    } else {
      // Wrong word clicked
      setShakeWordIndex(index);
      setTimeout(() => setShakeWordIndex(null), 500);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const isCompleted = Object.keys(solved).length === questions.length;

  if (isCompleted && currentIndex === questions.length - 1 && isCurrentSolved) {
    return (
      <div className="bg-slate-800/50 rounded-2xl p-8 border border-emerald-500/30 flex flex-col items-center justify-center text-center animate-fade-in min-h-[300px]">
        <TrophyIcon className="w-20 h-20 text-yellow-400 mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
        <h3 className="text-3xl font-bold text-white mb-2">
          {isRtl ? 'بطل القواعد!' : 'Grammar Champion!'}
        </h3>
        <p className="text-slate-300">
          {isRtl ? 'لقد اكتشفت جميع الأخطاء بنجاح.' : 'You spotted all the mistakes successfully.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      
      {/* Progress */}
      <div className="w-full flex items-center justify-between mb-8 text-sm text-slate-400">
        <span>{currentIndex + 1} / {questions.length}</span>
        <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(Object.keys(solved).length / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 md:p-12 w-full shadow-2xl relative overflow-hidden">
        
        <h3 className="text-center text-slate-400 font-medium mb-8">
          {isRtl ? 'اضغط على الكلمة الخاطئة في الجملة:' : 'Click the wrong word in the sentence:'}
        </h3>

        {/* Sentence Container */}
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-4 mb-12 text-2xl md:text-4xl font-bold" dir="ltr">
          {words.map((word, idx) => {
            const isWrongWord = idx === currentQ.wrongWordIndex;
            const isShaking = shakeWordIndex === idx;
            
            let wordClasses = "px-2 py-1 rounded-lg cursor-pointer transition-all duration-300 ";
            
            if (isCurrentSolved) {
              if (isWrongWord) {
                wordClasses += "bg-emerald-500/20 text-emerald-400 line-through opacity-50";
              } else {
                wordClasses += "text-slate-300";
              }
            } else {
              wordClasses += "text-white hover:bg-slate-700 hover:-translate-y-1";
              if (isShaking) wordClasses += " animate-shake text-red-400 bg-red-500/10";
            }

            return (
              <span 
                key={idx}
                onClick={() => handleWordClick(idx)}
                className={wordClasses}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Correction Feedback */}
        <div className={`transition-all duration-500 ${isCurrentSolved ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none absolute'}`}>
          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3 text-emerald-400 font-bold text-2xl" dir="ltr">
              <CheckCircle2 className="w-6 h-6" />
              <span>{words[currentQ.wrongWordIndex]}</span>
              <ArrowRight className="w-5 h-5 text-slate-500" />
              <span className="text-white border-b-2 border-emerald-500">{currentQ.correction}</span>
            </div>
            <p className="text-slate-300 mt-4" dir={isRtl ? 'rtl' : 'ltr'}>
              {isRtl ? currentQ.explanationAr : currentQ.explanationEn}
            </p>

            <button 
              onClick={handleNext}
              className="mt-6 px-8 py-3 rounded-full bg-emerald-500 text-slate-900 font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
              {isRtl ? 'التالي' : 'Next'}
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-5deg); }
          50% { transform: translateX(5px) rotate(5deg); }
          75% { transform: translateX(-5px) rotate(-5deg); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7c0 3.31 2.69 6 6 6s6-2.69 6-6V2Z" />
    </svg>
  );
}
