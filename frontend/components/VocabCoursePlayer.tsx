'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, 
  HelpCircle, PlayCircle, Star, X, LayoutDashboard,
  AlertTriangle, RotateCcw, Save
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
          onClose={() => setActiveUnit(null)}
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
                style={{ direction: isRtl ? 'rtl' : 'ltr' }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-500/20 text-brand-400 group-hover:scale-110 transition-transform'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-brand-400 transition-colors" dir="ltr">
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
  const [mode, setMode] = useState<'menu' | 'study' | 'test' | 'mistake-bank' | 'review'>('menu');
  const [sectionFilter, setSectionFilter] = useState<string | null>(null);
  
  // Test State
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [finished, setFinished] = useState(false);
  
  const [hasSavedTest, setHasSavedTest] = useState(false);
  const [mistakes, setMistakes] = useState<string[]>([]); // array of qRefs

  // Load state on mount
  useEffect(() => {
    const saved = localStorage.getItem(`vocab_test_${unitKey}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.finished && parsed.answers && parsed.testQuestions) {
        setHasSavedTest(true);
      }
    }
    const savedMistakes = localStorage.getItem(`vocab_mistakes_${unitKey}`);
    if (savedMistakes) {
      setMistakes(JSON.parse(savedMistakes));
    }
  }, [unitKey]);

  // Save state on change
  useEffect(() => {
    if (mode === 'test' || mode === 'mistake-bank') {
      localStorage.setItem(`vocab_test_${unitKey}`, JSON.stringify({
        qIndex, answers, testQuestions, finished, mode
      }));
    }
  }, [qIndex, answers, testQuestions, finished, mode, unitKey]);

  // Save mistakes on change
  useEffect(() => {
    localStorage.setItem(`vocab_mistakes_${unitKey}`, JSON.stringify(mistakes));
  }, [mistakes, unitKey]);

  const startStudy = (sec?: string) => {
    setSectionFilter(sec || null);
    setMode('study');
  };

  const startTest = (sec?: string) => {
    let qs = unitData.questions;
    if (sec) qs = qs.filter((q: any) => q.sec === sec);
    qs = [...qs].sort(() => Math.random() - 0.5); // Shuffle
    setTestQuestions(qs);
    setAnswers([]);
    setQIndex(0);
    setFinished(false);
    setMode('test');
    setHasSavedTest(false);
  };

  const resumeTest = () => {
    const saved = localStorage.getItem(`vocab_test_${unitKey}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setTestQuestions(parsed.testQuestions);
      setAnswers(parsed.answers);
      setQIndex(parsed.qIndex);
      setFinished(parsed.finished);
      setMode(parsed.mode || 'test');
    }
  };

  const startMistakeBank = () => {
    const qs = unitData.questions.filter((q: any) => mistakes.includes(q.ref));
    setTestQuestions([...qs].sort(() => Math.random() - 0.5));
    setAnswers([]);
    setQIndex(0);
    setFinished(false);
    setMode('mistake-bank');
  };

  const handleAnswer = (selectedIdx: number) => {
    const currentQ = testQuestions[qIndex];
    const isCorrect = selectedIdx === currentQ.correct;
    
    setAnswers([...answers, {
      qRef: currentQ.ref,
      selected: selectedIdx,
      correct: isCorrect,
    }]);

    // Handle Mistakes
    if (!isCorrect) {
      if (!mistakes.includes(currentQ.ref)) {
        setMistakes([...mistakes, currentQ.ref]);
      }
    } else {
      if (mode === 'mistake-bank') {
        // Remove from mistake bank immediately if answered correctly
        setMistakes(mistakes.filter(ref => ref !== currentQ.ref));
      }
    }

    if (qIndex + 1 < testQuestions.length) {
      setQIndex(qIndex + 1);
    } else {
      setFinished(true);
      if (mode === 'test') {
        const correctCount = answers.filter(a => a.correct).length + (isCorrect ? 1 : 0);
        if (correctCount === testQuestions.length) {
          onComplete();
        }
      } else if (mode === 'mistake-bank') {
        if (mistakes.filter(ref => ref !== currentQ.ref).length === 0) {
           onComplete();
        }
      }
    }
  };

  if (mode === 'menu') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
        <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} /> 
          <span>{isRtl ? 'العودة للوحدات' : 'Back to Units'}</span>
        </button>
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2" dir="ltr">{unitKey}</h2>
          <p className="text-slate-400">{isRtl ? 'اختر نمط التعلم المناسب لك' : 'Choose learning mode'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => startStudy()} className="bg-slate-900 border border-slate-800 hover:border-brand-500 rounded-2xl p-6 text-left group transition-all" style={{ textAlign: isRtl ? 'right' : 'left' }}>
            <BookOpen className="h-10 w-10 text-brand-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{isRtl ? 'وضع الدراسة' : 'Study Mode'}</h3>
            <p className="text-sm text-slate-400">{isRtl ? 'مراجعة جميع المصطلحات والتعريفات مع الإجابات المباشرة.' : 'Review all terms and definitions with immediate answers.'}</p>
          </button>
          
          <div className="flex flex-col gap-4">
            <button onClick={() => startTest()} className="bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl p-6 text-left group transition-all flex-1" style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <Star className="h-10 w-10 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{isRtl ? 'وضع الاختبار (جديد)' : 'Quiz Mode (New)'}</h3>
              <p className="text-sm text-slate-400">{isRtl ? 'اختبر معلوماتك مع أسئلة متنوعة واحصل على درجتك.' : 'Test your knowledge with mixed questions and track your score.'}</p>
            </button>
            {hasSavedTest && (
              <button onClick={resumeTest} className="bg-brand-500/10 border border-brand-500 hover:bg-brand-500/20 rounded-2xl p-4 text-brand-500 font-bold transition-all flex items-center justify-center gap-2">
                <RotateCcw className="h-5 w-5" />
                {isRtl ? 'استئناف الاختبار غير المكتمل' : 'Resume Incomplete Quiz'}
              </button>
            )}
          </div>

          {mistakes.length > 0 && (
            <button onClick={startMistakeBank} className="md:col-span-2 bg-red-500/5 border border-red-500/20 hover:border-red-500 hover:bg-red-500/10 rounded-2xl p-6 text-left group transition-all" style={{ textAlign: isRtl ? 'right' : 'left' }}>
              <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{isRtl ? 'بنك الأخطاء' : 'Mistake Bank'}</h3>
              <p className="text-sm text-slate-400">
                {isRtl 
                  ? `لديك ${mistakes.length} سؤال أخطأت فيه سابقاً. اختبرها الآن لتقويتها.` 
                  : `You have ${mistakes.length} mistakes to review and fix.`}
              </p>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'study') {
    let displayQuestions = unitData.questions;
    if (sectionFilter) displayQuestions = displayQuestions.filter((q: any) => q.sec === sectionFilter);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} /> 
            {isRtl ? 'رجوع' : 'Back'}
          </button>
          <h2 className="text-xl font-bold text-white">{isRtl ? 'وضع الدراسة' : 'Study Mode'}</h2>
        </div>
        
        {displayQuestions.map((q: any, i: number) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-4" dir="ltr">
            <span className="text-xs font-bold text-brand-500 bg-brand-500/10 px-2 py-1 rounded mb-3 inline-block">Section {q.sec}</span>
            <div className="text-lg text-white mb-4" dangerouslySetInnerHTML={{ __html: q.q }} />
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl mb-3 font-medium" dangerouslySetInnerHTML={{ __html: `✅ ${q.opts[q.correct]}` }} />
            <div className="bg-slate-800/50 p-4 rounded-xl text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: q.exp }} />
          </div>
        ))}
      </div>
    );
  }

  if (mode === 'test' || mode === 'mistake-bank') {
    if (finished) {
      const correctCount = answers.filter(a => a.correct).length;
      const score = Math.round((correctCount / answers.length) * 100);
      return (
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 mb-6">
            <h2 className="text-3xl font-black text-white mb-6">
              {isRtl ? 'تم إنهاء الاختبار!' : 'Quiz Complete!'}
            </h2>
            <div className={`text-6xl font-black mb-6 ${score >= 50 ? 'text-brand-500' : 'text-red-500'}`}>
              {score}%
            </div>
            <p className="text-slate-300 mb-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
              {isRtl 
                ? `لقد أجبت بشكل صحيح على ${correctCount} من أصل ${answers.length} سؤال.` 
                : `You answered ${correctCount} out of ${answers.length} correctly.`}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
              <button onClick={() => { setMode('review'); localStorage.removeItem(`vocab_test_${unitKey}`); }} className="px-6 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 font-bold">
                {isRtl ? 'مراجعة الأخطاء' : 'Review Mistakes'}
              </button>
              <button onClick={() => { setMode('menu'); localStorage.removeItem(`vocab_test_${unitKey}`); }} className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 font-bold">
                {isRtl ? 'القائمة الرئيسية' : 'Main Menu'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentQ = testQuestions[qIndex];
    return (
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          <div className="flex justify-between text-sm text-slate-400 mb-4 items-center">
            <button onClick={() => setMode('menu')} className="flex items-center gap-2 hover:text-white transition-colors bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <Save className="h-4 w-4" />
              {isRtl ? 'حفظ والخروج' : 'Save & Exit'}
            </button>
            <span>{qIndex + 1} / {testQuestions.length}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${((qIndex)/testQuestions.length)*100}%`}} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 mb-6" dir="ltr">
          <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded mb-4 inline-block">Section {currentQ.sec}</span>
          <h3 
            className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: currentQ.q }} 
          />
          <div className="space-y-3">
            {currentQ.opts.map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-brand-500 transition-colors text-slate-200 text-lg"
                dangerouslySetInnerHTML={{ __html: opt }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'review') {
    const wrongAnswers = answers.filter(a => !a.correct);

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6" style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          <button onClick={() => setMode('menu')} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="h-4 w-4" style={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} /> 
            {isRtl ? 'العودة للقائمة' : 'Back to Menu'}
          </button>
          <h2 className="text-xl font-bold text-white">{isRtl ? 'مراجعة الإجابات الخاطئة' : 'Review Mistakes'}</h2>
        </div>

        {wrongAnswers.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-emerald-500 mb-2">{isRtl ? 'لا توجد أخطاء!' : 'No Mistakes!'}</h3>
            <p className="text-slate-400 mb-6">{isRtl ? 'لقد أجبت على جميع الأسئلة بشكل صحيح.' : 'You answered all questions correctly.'}</p>
            <button onClick={() => setMode('menu')} className="px-6 py-2 bg-brand-500 text-white rounded-lg">
              {isRtl ? 'القائمة الرئيسية' : 'Main Menu'}
            </button>
          </div>
        ) : (
          wrongAnswers.map((ans, i) => {
            const q = unitData.questions.find((x: any) => x.ref === ans.qRef);
            if (!q) return null;
            return (
              <div key={i} className="bg-slate-900 border border-red-500/20 rounded-2xl p-6 mb-4" dir="ltr">
                <div className="text-lg text-white mb-4" dangerouslySetInnerHTML={{ __html: q.q }} />
                <div className="space-y-2 mb-4 text-sm">
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-2">
                    <span>❌</span> <span dangerouslySetInnerHTML={{ __html: q.opts[ans.selected] }} />
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl flex items-center gap-2">
                    <span>✅</span> <span dangerouslySetInnerHTML={{ __html: q.opts[q.correct] }} />
                  </div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: q.exp }} />
              </div>
            );
          })
        )}
      </div>
    );
  }

  return null;
}
