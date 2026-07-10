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
  ChevronLeft
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
}

interface Lesson {
  id: string;
  titleAr: string;
  titleEn: string;
  questions?: InlineQuestion[];
}

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  lessons: Lesson[];
}

export default function PracticeSessionPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const courseId = params?.id as string;
  const lessonId = params?.lessonId as string;
  const isRtl = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [questions, setQuestions] = useState<InlineQuestion[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [correctCount, setCorrectCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/courses/${courseId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const foundCourse = await res.json();
          setCourse(foundCourse);
          const foundLesson = foundCourse.lessons?.find((l: any) => l.id === lessonId);
          if (foundLesson) {
            setLesson(foundLesson);
            setQuestions(foundLesson.questions || []);
          }
        }
      } catch (e) {}
      setLoading(false);
    };
    loadData();
  }, [courseId, lessonId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!course || !lesson || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400 p-6">
        <h3 className="text-xl font-bold text-slate-200 mb-4">No Practice Questions Found</h3>
        <Link 
          href={`/${locale}/courses/${courseId}`} 
          className="px-6 py-3 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-colors"
        >
          Back to Course
        </Link>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleCheck = () => {
    if (selectedChoiceIndex === null) return;
    
    const correct = currentQuestion.choices[selectedChoiceIndex].isCorrect;
    setIsCorrect(correct);
    setHasChecked(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      setShowExplanation(true);
      // Play a simple success sound (optional, assuming we have one or just rely on visual)
      try {
        const audio = new Audio('/sounds/success.mp3'); // We might not have this, so wrap in try/catch
        audio.play().catch(() => {});
      } catch (e) {}
    } else {
      setShowExplanation(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoiceIndex(null);
      setHasChecked(false);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
      // Save progress if needed
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute top-[-20%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none" />
        
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-12 rounded-3xl max-w-lg w-full flex flex-col items-center shadow-2xl relative z-10">
          <div className="w-24 h-24 bg-brand-500/20 rounded-full flex items-center justify-center mb-6 relative">
            <Trophy className="w-12 h-12 text-brand-400 relative z-10" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute top-0 right-0 animate-pulse" />
          </div>
          
          <h1 className="text-3xl font-black text-white mb-2">
            {isRtl ? 'أنجزت المهمة بامتياز!' : 'Lesson Complete!'}
          </h1>
          <p className="text-slate-400 mb-8 text-lg">
            {isRtl 
              ? `لقد أجبت بشكل صحيح على ${correctCount} من أصل ${questions.length}`
              : `You scored ${correctCount} out of ${questions.length} correct.`}
          </p>
          
          <div className="w-full h-3 bg-slate-800 rounded-full mb-10 overflow-hidden">
            <div 
              className="h-full bg-brand-500 rounded-full" 
              style={{ width: `${(correctCount / questions.length) * 100}%` }}
            />
          </div>

          <Link 
            href={`/${locale}/courses/${courseId}`} 
            className="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
          >
            {isRtl ? 'العودة للدرس' : 'Back to Syllabus'}
            {isRtl ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#0f172a] flex flex-col font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center px-4 sm:px-8 justify-between sticky top-0 z-50">
        <Link 
          href={`/${locale}/courses/${courseId}`} 
          className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 font-semibold text-sm"
        >
          <X className="w-5 h-5" />
          <span className="hidden sm:inline">{isRtl ? 'خروج' : 'Exit'}</span>
        </Link>
        
        <div className="flex-1 max-w-md mx-8">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isRtl ? 'التقدم' : 'Progress'}
            </span>
            <span className="text-xs font-bold text-brand-400">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
          <div className="flex gap-1.5 h-2.5">
            {questions.map((_, idx) => (
              <div 
                key={idx}
                className={`flex-1 rounded-full transition-all duration-300 ${
                  idx < currentIndex ? 'bg-brand-500' : 
                  idx === currentIndex ? 'bg-brand-400/50' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 font-bold text-brand-400 text-sm">
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">{correctCount} {isRtl ? 'نقاط' : 'Pts'}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col min-h-full">
          
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {isRtl ? currentQuestion.textAr : currentQuestion.textEn}
            </h2>
          </div>

          <div className="space-y-3 flex-1">
            {currentQuestion.choices.map((choice, idx) => {
              const isSelected = selectedChoiceIndex === idx;
              let stateClass = 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-slate-300';
              
              if (isSelected) {
                if (!hasChecked) {
                  stateClass = 'bg-brand-500/10 border-brand-500 text-white';
                } else if (isCorrect) {
                  stateClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-100';
                } else {
                  stateClass = 'bg-rose-500/10 border-rose-500 text-rose-100';
                }
              } else if (hasChecked && choice.isCorrect) {
                // Show the correct answer if they got it wrong
                stateClass = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100/70';
              } else if (hasChecked) {
                stateClass = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-50 cursor-not-allowed';
              }

              return (
                <button
                  key={idx}
                  disabled={hasChecked}
                  onClick={() => setSelectedChoiceIndex(idx)}
                  className={`w-full text-start p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${stateClass}`}
                >
                  <div className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected && !hasChecked ? 'border-brand-500' :
                    isSelected && isCorrect ? 'border-emerald-500 bg-emerald-500' :
                    isSelected && !isCorrect ? 'border-rose-500 bg-rose-500' :
                    hasChecked && choice.isCorrect ? 'border-emerald-500/50 bg-emerald-500/20' :
                    'border-slate-600'
                  }`}>
                    {isSelected && !hasChecked && <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />}
                    {isSelected && isCorrect && <Check className="w-3.5 h-3.5 text-white" />}
                    {isSelected && !isCorrect && <X className="w-3.5 h-3.5 text-white" />}
                    {!isSelected && hasChecked && choice.isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-base sm:text-lg font-medium">
                    {isRtl ? choice.textAr : choice.textEn}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation Section */}
          {hasChecked && showExplanation && (
            <div className="mt-8 p-6 rounded-2xl bg-slate-800/50 border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
              <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-brand-400" />
                {isRtl ? 'الشرح' : 'Explanation'}
              </h4>
              <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
                {isRtl ? currentQuestion.explanationAr : currentQuestion.explanationEn}
              </p>
            </div>
          )}

        </div>
      </main>

      {/* Action Bar (Fixed Bottom) */}
      <div className={`fixed bottom-0 left-0 right-0 border-t transition-colors duration-300 z-50 ${
        !hasChecked ? 'bg-slate-900 border-slate-800' :
        isCorrect ? 'bg-emerald-950/80 border-emerald-900/50 backdrop-blur-lg' :
        'bg-rose-950/80 border-rose-900/50 backdrop-blur-lg'
      }`}>
        <div className="max-w-4xl mx-auto px-4 h-24 flex items-center justify-between">
          
          <div className="flex-1">
            {hasChecked && isCorrect && (
              <div className="flex items-center gap-3 animate-in slide-in-from-left-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-emerald-400">
                  {isRtl ? 'رائع! إجابة صحيحة' : 'Awesome! Correct.'}
                </h3>
              </div>
            )}
            
            {hasChecked && !isCorrect && (
              <div className="flex items-center gap-3 animate-in slide-in-from-left-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <X className="w-6 h-6 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-rose-400 leading-tight">
                    {isRtl ? 'غير صحيح تماماً' : 'Not quite.'}
                  </h3>
                  <button 
                    onClick={() => setShowExplanation(true)}
                    className="text-sm font-bold text-rose-300 hover:text-rose-200 underline underline-offset-4 mt-0.5"
                  >
                    {isRtl ? 'عرض الشرح' : 'See explanation'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            {!hasChecked ? (
              <button
                onClick={handleCheck}
                disabled={selectedChoiceIndex === null}
                className="px-8 py-3.5 bg-brand-500 disabled:bg-slate-800 disabled:text-slate-500 hover:bg-brand-600 text-white font-black rounded-xl text-lg transition-all shadow-lg shadow-brand-500/20 disabled:shadow-none min-w-[140px]"
              >
                {isRtl ? 'تحقق' : 'Check'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className={`px-8 py-3.5 font-black rounded-xl text-lg transition-all shadow-lg min-w-[140px] flex items-center gap-2 ${
                  isCorrect 
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20' 
                    : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                }`}
              >
                {isRtl ? 'التالي' : 'Next'}
                {isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

// Minimal icon for the component
function Lightbulb(props: any) {
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
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  )
}
