'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  HelpCircle, 
  Loader2, 
  Award,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

interface Choice {
  id: string;
  textAr: string;
  textEn: string;
}

interface Question {
  id: string;
  textAr: string;
  textEn: string;
  type: 'MCQ' | 'SHORT_ANSWER';
  choices: Choice[];
}

interface Quiz {
  id: string;
  titleAr: string;
  titleEn: string;
  cefrLevel?: string;
  durationMinutes?: number;
  questions: Question[];
}

interface AttemptAnswer {
  questionId: string;
  selectedChoiceId?: string;
  textAnswer?: string;
}

interface GradedBreakdown {
  questionId: string;
  textAr: string;
  textEn: string;
  type: 'MCQ' | 'SHORT_ANSWER';
  isCorrect: boolean;
  userSelection: string;
  correctSelection: string;
  explanationAr?: string;
  explanationEn?: string;
}

export default function StudentQuizPage() {
  const t = useTranslations('quiz');
  const navT = useTranslations('navigation');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const quizId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<AttemptAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins default
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  // Grading states
  const [gradedResult, setGradedResult] = useState<{
    score: number;
    maxScore: number;
    percent: number;
    breakdown: GradedBreakdown[];
  } | null>(null);


  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const response = await fetch(`/api/quizzes/${quizId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }

        const data = await response.json();
        setQuiz(data.quiz);
        setTimeLeft((data.quiz.durationMinutes || 30) * 60);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, router]);

  // Timer countdown
  useEffect(() => {
    if (loading || gradedResult) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto submit via state
          setShouldAutoSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, gradedResult]);

  // Auto-submit effect
  useEffect(() => {
    if (shouldAutoSubmit && !gradedResult) {
      handleSubmit(answers);
      setShouldAutoSubmit(false);
    }
  }, [shouldAutoSubmit, gradedResult]);

  const handleMcqSelect = (questionId: string, choiceId: string) => {
    const updated = [...answers];
    const idx = updated.findIndex(a => a.questionId === questionId);
    if (idx !== -1) {
      updated[idx].selectedChoiceId = choiceId;
    } else {
      updated.push({ questionId, selectedChoiceId: choiceId });
    }
    setAnswers(updated);
  };

  const handleShortAnswerChange = (questionId: string, value: string) => {
    const updated = [...answers];
    const idx = updated.findIndex(a => a.questionId === questionId);
    if (idx !== -1) {
      updated[idx].textAnswer = value;
    } else {
      updated.push({ questionId, textAnswer: value });
    }
    setAnswers(updated);
  };

  const handleSubmit = async (answersParam?: AttemptAnswer[] | React.FormEvent) => {
    // Support both form event submission and direct answers array (for auto-submit)
    if (answersParam && typeof (answersParam as React.FormEvent).preventDefault === 'function') {
      (answersParam as React.FormEvent).preventDefault();
    }
    const submittedAnswers = Array.isArray(answersParam) ? answersParam : answers;
    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ answers: submittedAnswers })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setGradedResult(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
        <span>Loading Quiz Sheet...</span>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400 p-6">
        <h3 className="text-lg font-bold text-slate-200">Quiz Not Found</h3>
        <Link href="/dashboard" className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const isRtl = locale === 'ar';
  const quizTitle = isRtl ? quiz.titleAr : quiz.titleEn;

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-x-hidden font-sans pb-16 selection:bg-brand-500/30 selection:text-brand-300">
      
      {/* Background glow highlights */}
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-18 flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            {isRtl ? (
              <><ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" /><span>لوحة التحكم</span></>
            ) : (
              <><ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-1" /><span>Dashboard</span></>
            )}
          </Link>
          
          <div className="flex items-center gap-3">
            {quiz.cefrLevel && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                CEFR: {quiz.cefrLevel}
              </span>
            )}
            
            {/* Timer banner */}
            {!gradedResult && (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-mono font-bold text-slate-350 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
                <Clock className="h-4 w-4 text-brand-500 animate-pulse" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main player contents */}
      <main className="max-w-3xl mx-auto px-4 pt-10 z-10 relative">
        
        {/* Quiz Intro Title */}
        <div className="mb-8 border-b border-slate-900 pb-5">
          <h1 className="text-xl sm:text-3xl font-extrabold text-white">
            {quizTitle}
          </h1>
        </div>

        {/* 1. GRADING RESULTS SCREEN VIEW */}
        {gradedResult && (
          <div className="space-y-8">
            
            {/* radial / scoreboard panel */}
            <div className="bg-slate-900/20 border border-slate-850 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 end-0 w-32 h-32 bg-gradient-to-bl from-brand-500/10 to-transparent blur-2xl pointer-events-none rounded-full" />
              
              <div className="space-y-2 text-center md:text-start">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-xs font-semibold">
                  <Award className="h-3.5 w-3.5" />
                  <span>{t('resultTitle')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t('scoreLabel')}</h2>
                <p className="text-sm text-slate-400">{t('congratsB2')}</p>
              </div>

              {/* Score count display */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 min-w-[200px] text-center shadow-inner">
                <span className="text-xs text-slate-500 font-semibold uppercase">{t('scoreLabel')}</span>
                <div className="text-xl sm:text-2xl font-black text-white mt-1.5">
                  {t('scorePercent', {
                    score: gradedResult.score,
                    max: gradedResult.maxScore,
                    percent: gradedResult.percent
                  })}
                </div>
                {/* Visual meter bar */}
                <div className="mt-3.5 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${gradedResult.percent >= 50 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${gradedResult.percent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Questions Grading Breakdown details */}
            <div className="space-y-6">
              {gradedResult.breakdown.map((item, index) => {
                const questionText = (isRtl ? item.textAr : item.textEn) || (isRtl ? item.textEn : item.textAr);
                const explanationText = (isRtl ? item.explanationAr : item.explanationEn) || (isRtl ? item.explanationEn : item.explanationAr);

                return (
                  <div 
                    key={item.questionId}
                    className={`rounded-2xl border p-5 sm:p-6 shadow-md transition-all ${
                      item.isCorrect 
                        ? 'border-emerald-500/20 bg-emerald-500/3 hover:bg-emerald-500/5' 
                        : 'border-rose-500/20 bg-rose-500/3 hover:bg-rose-500/5'
                    }`}
                  >
                    
                    {/* Header: Correct / Incorrect badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`h-6 w-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          item.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                        }`}>{index + 1}</span>
                        <span className="text-xs text-slate-500 uppercase font-mono">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        {item.isCorrect ? (
                          <><CheckCircle className="h-4.5 w-4.5 text-emerald-500" /><span className="text-emerald-400">{t('correct')}</span></>
                        ) : (
                          <><XCircle className="h-4.5 w-4.5 text-rose-500" /><span className="text-rose-400">{t('incorrect')}</span></>
                        )}
                      </div>
                    </div>

                    {/* Question text */}
                    <h4 className="text-white text-sm sm:text-base font-semibold leading-relaxed mb-4" dir="auto">
                      {questionText}
                    </h4>

                    {/* Solutions breakdown */}
                    <div className="space-y-2.5 border-t border-slate-900/60 pt-4 mb-4 text-xs sm:text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-slate-550 font-semibold shrink-0 min-w-[100px] block">{t('userAnswer')}</span>
                        <span className={`font-semibold ${item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.userSelection || 'N/A'}
                        </span>
                      </div>
                      {!item.isCorrect && (
                        <div className="flex items-start gap-2">
                          <span className="text-slate-550 font-semibold shrink-0 min-w-[100px] block">{t('correctAnswer')}</span>
                          <span className="text-emerald-400 font-semibold">{item.correctSelection}</span>
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    {explanationText && (
                      <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 text-xs text-slate-400 flex gap-2.5 items-start">
                        <AlertCircle className="h-4.5 w-4.5 text-brand-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-brand-500 block mb-1">{t('explanation')}</span>
                          <p className="leading-relaxed">{explanationText}</p>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Back button + Retake */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl text-sm font-bold text-white bg-slate-900 border border-slate-800 hover:border-slate-500 transition-all"
              >
                <span>{locale === 'ar' ? 'الرجوع إلى لوحة القيادة' : 'Back to Dashboard'}</span>
              </Link>
              <button
                onClick={() => {
                  setGradedResult(null);
                  setAnswers([]);
                  setTimeLeft((quiz?.durationMinutes ?? 30) * 60);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{locale === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}</span>
              </button>
            </div>

          </div>
        )}

        {/* 2. ACTIVE QUIZ QUESTION RUNNER */}
        {!gradedResult && (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {quiz.questions.map((q, index) => {
              const questionText = (isRtl ? q.textAr : q.textEn) || (isRtl ? q.textEn : q.textAr);
              const studentAnswer = answers.find(a => a.questionId === q.id);

              return (
                <div key={q.id} className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 sm:p-7 shadow-lg">
                  
                  {/* Badge index */}
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-4 uppercase">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold">{index + 1}</span>
                    <span>{t('questionCount', { index: index + 1, total: quiz.questions.length })}</span>
                  </div>

                  {/* Question Title */}
                  <h3 className="text-slate-100 text-sm sm:text-base font-bold leading-relaxed mb-6" dir="auto">
                    {questionText}
                  </h3>

                  {/* Type 1: MCQ options */}
                  {q.type === 'MCQ' && (
                    <div className="grid gap-3.5">
                      {q.choices.map((choice) => {
                        const isSelected = studentAnswer?.selectedChoiceId === choice.id;
                        const choiceText = (isRtl ? choice.textAr : choice.textEn) || (isRtl ? choice.textEn : choice.textAr);
                        
                        return (
                          <div 
                            key={choice.id}
                            onClick={() => handleMcqSelect(q.id, choice.id)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 text-xs sm:text-sm ${
                              isSelected 
                                ? 'border-brand-500 bg-brand-500/5 text-brand-400' 
                                : 'border-slate-850 bg-slate-950/20 hover:border-slate-750 text-slate-300'
                            }`}
                          >
                            <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-brand-500 text-brand-500' : 'border-slate-700'
                            }`}>
                              {isSelected && <div className="h-2 w-2 rounded-full bg-brand-500" />}
                            </div>
                            <span dir="auto" className="flex-1 text-start">{choiceText}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Type 2: Short Answer input */}
                  {q.type === 'SHORT_ANSWER' && (
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        required
                        value={studentAnswer?.textAnswer || ''}
                        onChange={(e) => handleShortAnswerChange(q.id, e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs sm:text-sm text-slate-200 placeholder-slate-650 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                        placeholder={isRtl ? 'اكتب إجابتك هنا...' : 'Type your answer...'}
                      />
                    </div>
                  )}

                </div>
              );
            })}

            {/* Submission Actions */}
            <div className="pt-4">
              {/* Progress indicator */}
              {(() => {
                const answeredCount = answers.filter(a => a.selectedChoiceId || a.textAnswer?.trim()).length;
                const totalCount = quiz?.questions.length ?? 0;
                return (
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>{locale === 'ar' ? `تم الإجابة على ${answeredCount} من ${totalCount} سؤال` : `${answeredCount} of ${totalCount} questions answered`}</span>
                    <div className="h-1.5 w-32 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: totalCount > 0 ? `${(answeredCount/totalCount)*100}%` : '0%' }} />
                    </div>
                  </div>
                );
              })()}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2.5 py-4 px-8 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-xl shadow-brand-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <span>{t('submitQuiz')}</span>
                      {isRtl ? <ArrowLeft className="h-4.5 w-4.5" /> : <ArrowRight className="h-4.5 w-4.5" />}
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </main>

    </div>
  );
}
