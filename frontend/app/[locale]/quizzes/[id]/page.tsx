'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
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
  RefreshCw,
  Save,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Check,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import Link from 'next/link';
import MathRenderer from '@/components/MathRenderer';

interface Choice {
  id: string;
  textAr: string;
  textEn: string;
}

interface Question {
  id: string;
  textAr: string;
  textEn: string;
  type: string;
  choices: Choice[];
}

interface Section {
  id: string;
  titleAr: string;
  titleEn: string;
  passageAr?: string;
  passageEn?: string;
  order: number;
  questions: Question[];
}

interface Quiz {
  id: string;
  titleAr: string;
  titleEn: string;
  cefrLevel: string | null;
  durationMinutes: number;
  sections: Section[];
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
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const quizId = params?.id as string;
  const isRtl = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<AttemptAnswer[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins default
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [showPassagePane, setShowPassagePane] = useState(true);

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

        if (!response.ok) throw new Error('Failed to fetch quiz');

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
          setShouldAutoSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, gradedResult]);

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
      if (!response.ok) throw new Error(data.error || 'Submission failed');
      setGradedResult(data.result);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'An error occurred while submitting the test. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextAction = () => {
    if (!quiz || !quiz.sections[activeSectionIndex]) return;
    const currentSection = quiz.sections[activeSectionIndex];
    if (activeQuestionIndex < currentSection.questions.length - 1) {
      setActiveQuestionIndex(prev => prev + 1);
    } else if (activeSectionIndex < quiz.sections.length - 1) {
      setActiveSectionIndex(prev => prev + 1);
      setActiveQuestionIndex(0);
    } else {
      handleSubmit();
    }
  };

  const prevAction = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionIndex(prev => prev - 1);
    } else if (activeSectionIndex > 0) {
      setActiveSectionIndex(prev => prev - 1);
      const prevSection = quiz!.sections[activeSectionIndex - 1];
      setActiveQuestionIndex(Math.max(0, prevSection.questions.length - 1));
    }
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

  const currentSection = quiz.sections[activeSectionIndex];
  if (!currentSection) return null;

  const currentQ = currentSection.questions[activeQuestionIndex];
  const qTextEn = currentQ?.textEn || '';
  const qTextAr = currentQ?.textAr || '';
  const combinedQText = (qTextEn + ' ' + qTextAr).toLowerCase();
  
  // Smart detection for reading comprehension
  const isReadingQuestion = ['paragraph', 'text', 'underlined', 'passage', 'writer', 'author', 'pronoun', 'line', 'refer', 'meaning'].some(keyword => combinedQText.includes(keyword));
  const hasPassage = !!(currentSection.passageAr || currentSection.passageEn);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
              <ArrowLeft className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
            </button>
            <div>
              <h1 className="font-bold text-white line-clamp-1">{isRtl ? quiz.titleAr : quiz.titleEn}</h1>
              <p className="text-xs text-brand-400">{isRtl ? (currentSection?.titleAr || currentSection?.titleEn) : (currentSection?.titleEn || currentSection?.titleAr)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold ${
              timeLeft < 300 ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-800 text-slate-200'
            }`}>
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
            
            {gradedResult && (
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                {isRtl ? 'الرجوع إلى لوحة القيادة' : 'Dashboard'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 flex flex-col justify-center">
        {gradedResult ? (
          <div className="max-w-3xl mx-auto w-full pb-32">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-lg mb-8 relative overflow-hidden">
              <div className="absolute top-0 start-0 w-full h-2 bg-gradient-to-r from-brand-500 to-amber-500" />
              <Award className="h-16 w-16 text-brand-500 mx-auto mb-4" />
              <h2 className="text-3xl font-black text-white mb-2">{Math.round(gradedResult.percent)}%</h2>
              <p className="text-slate-400 font-semibold text-lg">{isRtl ? 'النتيجة النهائية' : 'Final Score'}</p>
              <div className="mt-6 flex justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">{gradedResult.score}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{isRtl ? 'صحيح' : 'Correct'}</div>
                </div>
                <div className="w-px bg-slate-800" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-rose-400">{gradedResult.maxScore - gradedResult.score}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">{isRtl ? 'خاطئ' : 'Incorrect'}</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-xl text-white mb-4">{isRtl ? 'تفاصيل الإجابات' : 'Answers Breakdown'}</h3>
              {gradedResult.breakdown.map((item, idx) => (
                <div key={item.questionId} className={`p-5 rounded-2xl border ${item.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                  <div className="flex gap-4">
                    <div className={`mt-0.5 shrink-0 ${item.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {item.isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                    </div>
                    <div className="space-y-4 w-full">
                      <div className="flex gap-2 font-semibold text-slate-200 text-lg">
                        <span>{idx + 1}.</span>
                        <MathRenderer 
                          className="prose prose-invert max-w-none prose-p:my-0 [&_*]:!text-slate-200 [&_*]:!bg-transparent [&>u]:text-brand-400 [&>u]:font-black [&>u]:underline [&>u]:underline-offset-4 [&>u]:bg-brand-500/10 [&>u]:px-1 [&>u]:py-0.5 [&>u]:rounded [&>u]:border [&>u]:border-brand-500/30"
                          dir="auto"
                          html={(isRtl ? (item.textAr || item.textEn) : (item.textEn || item.textAr)) || ''}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                          <span className="block text-xs font-bold text-slate-500 mb-1">{isRtl ? 'إجابتك' : 'Your Answer'}</span>
                          {item.userSelection ? (
                            <MathRenderer 
                              className={item.isCorrect ? 'text-emerald-400 font-medium prose prose-invert max-w-none prose-p:my-0 [&_*]:!text-emerald-400 [&_*]:!bg-transparent' : 'text-rose-400 font-medium prose prose-invert max-w-none prose-p:my-0 [&_*]:!text-rose-400 [&_*]:!bg-transparent'}
                              dir="auto"
                              html={item.userSelection}
                            />
                          ) : (
                            <span className="text-rose-400 font-medium">{isRtl ? 'لم يتم الإجابة' : 'Not answered'}</span>
                          )}
                        </div>
                        {!item.isCorrect && (
                          <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                            <span className="block text-xs font-bold text-slate-500 mb-1">{isRtl ? 'الإجابة الصحيحة' : 'Correct Answer'}</span>
                            <MathRenderer 
                              className="text-emerald-400 font-medium prose prose-invert max-w-none prose-p:my-0 [&_*]:!text-emerald-400 [&_*]:!bg-transparent"
                              dir="auto"
                              html={item.correctSelection}
                            />
                          </div>
                        )}
                      </div>

                      {(item.explanationAr || item.explanationEn) && (
                        <div className="bg-slate-950/60 border border-slate-900 rounded-xl p-4 text-xs text-slate-400 flex gap-2.5 items-start">
                          <AlertCircle className="h-4.5 w-4.5 text-brand-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-brand-500 block mb-1">{isRtl ? 'الشرح' : 'Explanation'}</span>
                            <p className="leading-relaxed">{isRtl ? item.explanationAr : item.explanationEn}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto items-start h-full pb-32">
            
            {hasPassage && (
              <div className={`hidden lg:flex flex-col gap-4 fixed bottom-6 ${isRtl ? 'left-6' : 'right-6'} z-40`}>
                <button
                  onClick={() => setShowPassagePane(!showPassagePane)}
                  className="bg-brand-500 text-white p-3 rounded-full shadow-xl hover:bg-brand-600 transition-all flex items-center justify-center gap-2 group"
                >
                  {showPassagePane ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                  <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out px-0 group-hover:px-2 text-sm font-bold">
                    {showPassagePane ? 'Hide Passage' : 'View Passage'}
                  </span>
                </button>
              </div>
            )}

            {hasPassage && showPassagePane && (isReadingQuestion || true) && (
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-xl h-full max-h-[75vh] flex flex-col">
                <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-brand-400 font-bold text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>Reading Passage</span>
                  </span>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-sm text-slate-300 leading-relaxed font-serif" dir={!currentSection.passageAr && currentSection.passageEn ? 'ltr' : 'auto'}>
                  {((isRtl ? currentSection.passageAr : currentSection.passageEn) || currentSection.passageEn || '')
                    .split('\n\n')
                    .map((para: string, pIdx: number) => (
                    <MathRenderer 
                      key={pIdx} 
                      as="p"
                      className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 tracking-wide leading-relaxed text-slate-200 [&>u]:text-brand-400 [&>u]:font-black [&>u]:underline [&>u]:underline-offset-4 [&>u]:bg-brand-500/10 [&>u]:px-1 [&>u]:py-0.5 [&>u]:rounded [&>u]:border [&>u]:border-brand-500/30 [&>b>u]:text-brand-400 [&>b>u]:font-black [&>b>u]:underline [&>b>u]:underline-offset-4 [&>b>u]:bg-brand-500/10 [&>b>u]:px-1 [&>b>u]:py-0.5 [&>b>u]:rounded [&>b>u]:border [&>b>u]:border-brand-500/30"
                      html={para}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={`${(hasPassage && showPassagePane) ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl mx-auto'} bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl w-full`}>
              
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Question {activeQuestionIndex + 1} of {currentSection.questions.length}</span>
                  <span className="px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-bold uppercase">
                    {currentQ.type}
                  </span>
                </div>
                <div className="w-36 h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${((activeQuestionIndex + 1) / currentSection.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <MathRenderer
                as="h3"
                className="text-base sm:text-lg font-extrabold text-white leading-relaxed mb-6 [&>u]:text-brand-400 [&>u]:font-black [&>u]:underline [&>u]:underline-offset-4 [&>u]:bg-brand-500/10 [&>u]:px-1 [&>u]:py-0.5 [&>u]:rounded [&>u]:border [&>u]:border-brand-500/30"
                dir="auto"
                html={`${activeQuestionIndex + 1}. ${(isRtl ? currentQ.textAr : currentQ.textEn) || currentQ.textEn}`}
              />

              {currentQ.type === 'MCQ' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {currentQ.choices.map((choice: any) => {
                    const ansObj = answers.find(a => a.questionId === currentQ.id);
                    const isSelected = ansObj?.selectedChoiceId === choice.id;
                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleMcqSelect(currentQ.id, choice.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm font-semibold flex items-center justify-between ${
                          isSelected
                            ? 'bg-brand-500/20 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                        dir="auto"
                      >
                        <MathRenderer as="span" className="leading-snug" html={(isRtl ? choice.textAr : choice.textEn) || choice.textEn} />
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ms-2 ${
                            isSelected ? 'border-brand-400 bg-brand-500 text-white' : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="mb-6">
                  <input
                    type="text"
                    value={answers.find(a => a.questionId === currentQ.id)?.textAnswer || ''}
                    onChange={(e) => handleShortAnswerChange(currentQ.id, e.target.value)}
                    placeholder={isRtl ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                    dir="auto"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <button
                  disabled={activeQuestionIndex === 0 && activeSectionIndex === 0}
                  onClick={prevAction}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeQuestionIndex === 0 && activeSectionIndex === 0
                      ? 'bg-slate-950 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {isRtl ? 'السابق' : 'Previous'}
                </button>

                {activeQuestionIndex < currentSection.questions.length - 1 || activeSectionIndex < quiz.sections.length - 1 ? (
                  <button
                    onClick={nextAction}
                    className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1"
                  >
                    <span>{isRtl ? 'التالي' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubmit()}
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>{isRtl ? 'إنهاء الاختبار' : 'Submit Exam'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
