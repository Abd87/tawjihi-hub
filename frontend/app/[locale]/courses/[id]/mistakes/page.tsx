'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { 
  Check, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Trophy, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  AlertOctagon
} from 'lucide-react';

interface Choice {
  textAr: string;
  textEn: string;
  isCorrect: boolean;
}

interface InlineQuestion {
  id: string;
  textAr: string;
  textEn: string;
  choices: Choice[];
  explanationAr: string;
  explanationEn: string;
  lessonId?: string;
}

export default function MistakesBankPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const courseId = params?.id as string;
  const isRtl = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<InlineQuestion[]>([]);
  const [userId, setUserId] = useState<string>('guest');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [correctCount, setCorrectCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [answers, setAnswers] = useState<Record<string, { choiceIndex: number; isCorrect: boolean }>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        const currentUserId = userStr ? JSON.parse(userStr).id : 'guest';
        setUserId(currentUserId);
        
        const mistakeKey = `mistakes-${currentUserId}-${courseId}`;
        const savedMistakesStr = localStorage.getItem(mistakeKey);
        let mistakeIds: string[] = [];
        if (savedMistakesStr) {
           try { mistakeIds = JSON.parse(savedMistakesStr); } catch(e){}
        }

        if (mistakeIds.length === 0) {
           setQuestions([]);
           setLoading(false);
           return;
        }

        const res = await fetch(`/api/courses/${courseId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const foundCourse = await res.json();
          let allQuestions: InlineQuestion[] = [];
          
          if (foundCourse.lessons) {
             foundCourse.lessons.forEach((lesson: any) => {
                if (lesson.questions) {
                   lesson.questions.forEach((q: any) => {
                      allQuestions.push({ ...q, lessonId: lesson.id });
                   });
                }
             });
          }

          const filteredQuestions = allQuestions.filter(q => mistakeIds.includes(q.id));
          setQuestions(filteredQuestions);
        }
      } catch (e) {}
      setLoading(false);
    };
    loadData();
  }, [courseId]);

  useEffect(() => {
    if (questions.length === 0) return;
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    
    if (answers[currentQ.id]) {
      setSelectedChoiceIndex(answers[currentQ.id].choiceIndex);
      setIsCorrect(answers[currentQ.id].isCorrect);
      setHasChecked(true);
      setShowExplanation(true);
    } else {
      setSelectedChoiceIndex(null);
      setIsCorrect(null);
      setHasChecked(false);
      setShowExplanation(false);
    }
  }, [currentIndex, answers, questions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400 p-6">
        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
           <Trophy className="w-12 h-12 text-rose-500" />
        </div>
        <h3 className="text-2xl font-black text-white mb-4">
           {isRtl ? 'لا يوجد أخطاء!' : 'No Mistakes!'}
        </h3>
        <p className="mb-8 text-center max-w-md">
           {isRtl ? 'بنك الأخطاء الخاص بك فارغ. عمل رائع!' : 'Your mistake bank is completely empty. Great job!'}
        </p>
        <Link 
          href={`/${locale}/courses/${courseId}`} 
          className="px-8 py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25"
        >
          {isRtl ? 'العودة للدورة' : 'Back to Course'}
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleCheck = () => {
    if (selectedChoiceIndex === null || answers[currentQuestion.id]) return;
    
    const correct = currentQuestion.choices[selectedChoiceIndex].isCorrect;
    setIsCorrect(correct);
    setHasChecked(true);
    
    const newCorrectCount = correct ? correctCount + 1 : correctCount;
    if (correct) {
      setCorrectCount(newCorrectCount);
      try {
        const audio = new Audio('/sounds/success.mp3');
        audio.play().catch(() => {});
      } catch (e) {}
      
      // Remove from mistake bank if correct!
      const mistakeKey = `mistakes-${userId}-${courseId}`;
      const savedMistakesStr = localStorage.getItem(mistakeKey);
      let mistakeIds: string[] = [];
      if (savedMistakesStr) {
         try { mistakeIds = JSON.parse(savedMistakesStr); } catch(e){}
      }
      mistakeIds = mistakeIds.filter(id => id !== currentQuestion.id);
      localStorage.setItem(mistakeKey, JSON.stringify(mistakeIds));

    }
    
    setShowExplanation(true);
    
    const updatedAnswers = { 
      ...answers, 
      [currentQuestion.id]: { choiceIndex: selectedChoiceIndex, isCorrect: correct } 
    };
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };
  
  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute top-[-20%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-500/10 blur-[120px] pointer-events-none" />
        
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-12 rounded-3xl max-w-lg w-full flex flex-col items-center shadow-2xl relative z-10">
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 relative">
            <Trophy className="w-12 h-12 text-emerald-400 relative z-10" />
            <Sparkles className="w-6 h-6 text-emerald-300 absolute top-0 right-0 animate-pulse" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2">
            {isRtl ? 'جلسة مراجعة الأخطاء مكتملة!' : 'Mistake Review Complete!'}
          </h1>
          <p className="text-slate-400 mb-8 text-lg">
            {isRtl 
              ? `لقد أصلحت ${correctCount} أخطاء من أصل ${questions.length}.`
              : `You fixed ${correctCount} out of ${questions.length} mistakes.`}
          </p>
          
          <div className="w-full h-3 bg-slate-800 rounded-full mb-10 overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full" 
              style={{ width: `${(correctCount / questions.length) * 100}%` }}
            />
          </div>

          <Link 
            href={`/${locale}/courses/${courseId}`} 
            className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-rose-500/25"
          >
            {isRtl ? 'العودة للدورة' : 'Back to Syllabus'}
            {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 bg-[#0f172a] flex flex-col font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="h-16 border-b border-rose-900/50 bg-rose-950/20 backdrop-blur-md flex items-center px-4 sm:px-8 justify-between sticky top-20 z-40">
        <Link 
          href={`/${locale}/courses/${courseId}`} 
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-semibold text-sm"
        >
          <X className="w-5 h-5" />
          <span className="font-bold whitespace-nowrap">{isRtl ? 'حفظ وخروج' : 'Save & Exit'}</span>
        </Link>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertOctagon className="w-3 h-3" />
              {isRtl ? 'بنك الأخطاء' : 'Mistake Bank'}
            </span>
            <span className="text-xs font-bold text-rose-400">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="flex gap-1.5 h-2.5">
            {questions.map((_, idx) => (
              <div 
                key={idx}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  idx < currentIndex ? 'bg-rose-500' : 
                  idx === currentIndex ? 'bg-rose-400/50' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 font-bold text-emerald-400 text-sm">
          <Check className="w-4 h-4" />
          <span className="hidden sm:inline">{correctCount} {isRtl ? 'تُصحح' : 'Fixed'}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12 overflow-y-auto">
        <div className="w-full max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-8 leading-relaxed">
            { (isRtl ? currentQuestion.textAr : currentQuestion.textEn) || (isRtl ? currentQuestion.textEn : currentQuestion.textAr) }
          </h2>

          <div className="space-y-4 mb-8">
            {currentQuestion.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => !answers[currentQuestion.id] && !hasChecked && setSelectedChoiceIndex(idx)}
                className={`w-full text-start p-4 rounded-2xl border-2 transition-all flex justify-between items-center ${
                  hasChecked 
                    ? idx === selectedChoiceIndex
                      ? isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400'
                      : choice.isCorrect ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
                    : idx === selectedChoiceIndex
                      ? 'bg-rose-500/20 border-rose-500 text-white'
                      : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300'
                }`}
                disabled={!!answers[currentQuestion.id] || hasChecked}
              >
                <span className="text-base sm:text-lg font-medium">{isRtl ? choice.textAr : choice.textEn}</span>
                
                {hasChecked && idx === selectedChoiceIndex && (
                  isCorrect ? <Check className="w-6 h-6 text-emerald-500" /> : <X className="w-6 h-6 text-rose-500" />
                )}
                {hasChecked && idx !== selectedChoiceIndex && choice.isCorrect && (
                  <Check className="w-6 h-6 text-emerald-500/50" />
                )}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className={`p-6 rounded-2xl border mb-8 animate-in fade-in slide-in-from-bottom-4 ${
              isCorrect 
                ? 'bg-emerald-500/10 border-emerald-500/20' 
                : 'bg-rose-500/10 border-rose-500/20'
            }`}>
              <h4 className={`font-bold mb-2 flex items-center gap-2 ${
                isCorrect ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {isCorrect ? <Trophy className="w-5 h-5" /> : <X className="w-5 h-5" />}
                {isRtl 
                  ? (isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة')
                  : (isCorrect ? 'Correct!' : 'Incorrect')}
              </h4>
              <p className="text-slate-300 leading-relaxed">
                {isRtl ? currentQuestion.explanationAr : currentQuestion.explanationEn}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className={`w-14 shrink-0 py-4 rounded-2xl flex items-center justify-center transition-all ${
                currentIndex > 0 
                  ? 'bg-slate-800 hover:bg-slate-700 text-white' 
                  : 'bg-slate-900/50 text-slate-600 cursor-not-allowed'
              }`}
            >
              {isRtl ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
          
            {!hasChecked ? (
              <button
                onClick={handleCheck}
                disabled={selectedChoiceIndex === null}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  selectedChoiceIndex !== null
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Check className="w-5 h-5" />
                {isRtl ? 'تحقق من الإجابة' : 'Check Answer'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
              >
                {currentIndex < questions.length - 1 ? (isRtl ? 'السؤال التالي' : 'Next Question') : (isRtl ? 'إنهاء التمارين' : 'Finish Practice')}
                {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
