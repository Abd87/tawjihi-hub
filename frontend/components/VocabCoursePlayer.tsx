'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, 
  HelpCircle, PlayCircle, Star, X, LayoutDashboard 
} from 'lucide-react';
import vocabData from '@/data/vocab.json';

interface VocabCoursePlayerProps {
  course: any;
}

export default function VocabCoursePlayer({ course }: VocabCoursePlayerProps) {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  const [activeUnit, setActiveUnit] = useState<string | null>(null);
  const [mode, setMode] = useState<'study' | 'quiz' | null>(null);
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);
  
  const courseTitle = isRtl ? course.titleAr : course.titleEn;

  useEffect(() => {
    const saved = localStorage.getItem('vocab_completed');
    if (saved) setCompletedUnits(JSON.parse(saved));
  }, []);

  const markComplete = (unit: string) => {
    const next = Array.from(new Set([...completedUnits, unit]));
    setCompletedUnits(next);
    localStorage.setItem('vocab_completed', JSON.stringify(next));
  };

  const units = Object.keys(vocabData).sort();

  if (activeUnit) {
    return (
      <div className="min-h-screen bg-[#020617] pt-24 pb-20">
        <VocabUnitPlayer 
          unitKey={activeUnit} 
          unitData={(vocabData as any)[activeUnit]} 
          onClose={() => { setActiveUnit(null); setMode(null); }}
          onComplete={() => markComplete(activeUnit)}
          isRtl={isRtl}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/dashboard" className="hover:text-brand-500 transition-colors">
            {isRtl ? 'لوحة التحكم' : 'Dashboard'}
          </Link>
          <span className="opacity-50">/</span>
          <span className="text-white font-medium">{courseTitle}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl mb-10 text-center relative overflow-hidden">
          <div className="absolute top-[-50%] start-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
          <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/20 relative z-10">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-4 relative z-10">{courseTitle}</h1>
          <p className="text-slate-400 max-w-2xl mx-auto relative z-10">
            {isRtl ? course.descriptionAr : course.descriptionEn}
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">
          {isRtl ? 'الوحدات الدراسية' : 'Study Units'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => {
            const isCompleted = completedUnits.includes(unit);
            return (
              <button
                key={unit}
                onClick={() => setActiveUnit(unit)}
                className={`text-left group relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isCompleted 
                    ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/10' 
                    : 'bg-slate-900 border-slate-800 hover:border-brand-500/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-500/20 text-brand-400 group-hover:scale-110 transition-transform'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-400 transition-colors">
                  {unit}
                </h3>
                <p className="text-sm text-slate-400 mb-4">
                  {isRtl ? 'تدريب تفاعلي للمصطلحات' : 'Interactive Vocab Training'}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{isRtl ? 'ابدأ التدريب' : 'Start Training'}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// INNER PLAYER COMPONENT
// ---------------------------------------------------------------------------
function VocabUnitPlayer({ unitKey, unitData, onClose, onComplete, isRtl }: any) {
  const [mode, setMode] = useState<'menu' | 'study' | 'test'>('menu');
  const [sectionFilter, setSectionFilter] = useState<string | null>(null);
  
  // Test State
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);

  const startStudy = (sec?: string) => {
    setSectionFilter(sec || null);
    setMode('study');
  };

  const startTest = (sec?: string) => {
    let qs = unitData.questions;
    if (sec) qs = qs.filter((q: any) => q.sec === sec);
    // Shuffle
    qs = [...qs].sort(() => Math.random() - 0.5);
    setTestQuestions(qs);
    setAnswers([]);
    setQIndex(0);
    setFinished(false);
    setStartTime(Date.now());
    setMode('test');
  };

  const handleAnswer = (selectedIdx: number, confidence: number) => {
    const currentQ = testQuestions[qIndex];
    const isCorrect = selectedIdx === currentQ.correct;
    
    setAnswers([...answers, {
      qRef: currentQ.ref,
      selected: selectedIdx,
      correct: isCorrect,
      confidence
    }]);

    if (qIndex + 1 < testQuestions.length) {
      setQIndex(qIndex + 1);
    } else {
      setFinished(true);
      if (answers.filter(a => a.correct).length + (isCorrect ? 1 : 0) === testQuestions.length) {
        onComplete();
      }
    }
  };

  if (mode === 'menu') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" /> <span>{isRtl ? 'عودة للدورة' : 'Back to Course'}</span>
        </button>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2">{unitKey}</h2>
          <p className="text-slate-400">{isRtl ? 'اختر نمط التعلم' : 'Choose learning mode'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => startStudy()} className="bg-slate-900 border border-slate-800 hover:border-brand-500 rounded-2xl p-6 text-left group transition-all">
            <BookOpen className="h-10 w-10 text-brand-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Study Mode</h3>
            <p className="text-sm text-slate-400">Review all terms and definitions with immediate answers.</p>
          </button>
          <button onClick={() => startTest()} className="bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl p-6 text-left group transition-all">
            <Star className="h-10 w-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Quiz Mode</h3>
            <p className="text-sm text-slate-400">Test your knowledge with mixed questions and track your score.</p>
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'study') {
    let displayQuestions = unitData.questions;
    if (sectionFilter) displayQuestions = displayQuestions.filter((q: any) => q.sec === sectionFilter);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-white flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h2 className="text-xl font-bold text-white">Study Mode</h2>
        </div>
        
        {displayQuestions.map((q: any, i: number) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4">
            <span className="text-xs font-bold text-brand-500 bg-brand-500/10 px-2 py-1 rounded mb-3 inline-block">Section {q.sec}</span>
            <p className="text-lg text-white mb-4">{q.q}</p>
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl mb-3 font-medium">
              ✅ {q.opts[q.correct]}
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: q.exp }} />
          </div>
        ))}
      </div>
    );
  }

  if (mode === 'test') {
    if (finished) {
      const correctCount = answers.filter(a => a.correct).length;
      const score = Math.round((correctCount / answers.length) * 100);
      return (
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 mb-6">
            <h2 className="text-3xl font-black text-white mb-6">Quiz Complete!</h2>
            <div className="text-6xl font-black text-brand-500 mb-6">{score}%</div>
            <p className="text-slate-300 mb-8">You answered {correctCount} out of {answers.length} correctly.</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setMode('menu')} className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700">Main Menu</button>
              <button onClick={() => startTest()} className="px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600">Retake Quiz</button>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = testQuestions[qIndex];
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>Question {qIndex + 1} of {testQuestions.length}</span>
            <span>Section {currentQ.sec}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${((qIndex)/testQuestions.length)*100}%`}} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mb-6">
          <h3 className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
            {currentQ.q}
          </h3>
          <div className="space-y-3">
            {currentQ.opts.map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(i, 3)} // default confidence
                className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-brand-500 transition-colors text-slate-200 text-lg"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
