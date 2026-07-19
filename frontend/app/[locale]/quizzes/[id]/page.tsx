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
  RefreshCw,
  Save,
  BookOpen,
  CheckCircle2
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
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
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


  const currentSection = quiz.sections[activeSectionIndex];
  const hasNextSection = activeSectionIndex < quiz.sections.length - 1;
  const isSplitScreen = currentSection?.passageAr || currentSection?.passageEn;

  if (!currentSection) {
      return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col font-sans">
      {/* Header */}
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
                onClick={() => router.push(`/${locale}/dashboard`)}
                className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                {isRtl ? 'الرجوع إلى لوحة القيادة' : 'Dashboard'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8">
        
        {gradedResult ? (
          <div className="max-w-3xl mx-auto pb-32">
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
                        <div 
                          className="prose prose-invert max-w-none prose-p:my-0 [&_*]:!text-slate-200 [&_*]:!bg-transparent"
                          dir="auto"
                          dangerouslySetInnerHTML={{ __html: (isRtl ? (item.textAr || item.textEn) : (item.textEn || item.textAr)) || '' }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                          <span className="block text-xs font-bold text-slate-500 mb-1">{isRtl ? 'إجابتك' : 'Your Answer'}</span>
                          {item.userSelection ? (
                            <div 
                              className={item.isCorrect ? 'text-emerald-400 font-medium prose prose-invert max-w-none prose-p:my-0 [&_*]:!text-emerald-400 [&_*]:!bg-transparent' : 'text-rose-400 font-medium prose prose-invert max-w-none prose-p:my-0 [&_*]:!text-rose-400 [&_*]:!bg-transparent'}
                              dir="auto"
                              dangerouslySetInnerHTML={{ __html: item.userSelection }}
                            />
                          ) : (
                            <span className="text-rose-400 font-medium">{isRtl ? 'لم يتم الإجابة' : 'Not answered'}</span>
                          )}
                        </div>
                        {!item.isCorrect && (
                          <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800">
                            <span className="block text-xs font-bold text-slate-500 mb-1">{isRtl ? 'الإجابة الصحيحة' : 'Correct Answer'}</span>
                            <div 
                              className="text-emerald-400 font-medium prose prose-invert max-w-none prose-p:my-0 [&_*]:!text-emerald-400 [&_*]:!bg-transparent"
                              dir="auto"
                              dangerouslySetInnerHTML={{ __html: item.correctSelection }}
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
        ) : isSplitScreen ? (
          // Split Screen Layout
          <div className="flex flex-col md:flex-row gap-8 items-start h-[calc(100vh-10rem)]" dir="ltr">
            
            {/* Left side: Reading Passage */}
            <div className="w-full md:w-1/2 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 sticky top-24 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-slate-700" dir={isRtl ? 'rtl' : 'ltr'}>
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-brand-500" />
                {isRtl ? 'النص المقروء' : 'Reading Passage'}
              </h2>
              <div 
                className={`prose prose-invert max-w-none text-slate-300 leading-relaxed text-lg [&_*]:!text-slate-300 [&_*]:!bg-transparent ${!currentSection?.passageAr && currentSection?.passageEn ? 'text-left' : ''}`}
                dir={!currentSection?.passageAr && currentSection?.passageEn ? 'ltr' : 'auto'}
                dangerouslySetInnerHTML={{ __html: (isRtl ? (currentSection?.passageAr || currentSection?.passageEn) : (currentSection?.passageEn || currentSection?.passageAr)) || '' }}
              />
            </div>

            {/* Right side: Questions */}
            <div className="w-full md:w-1/2 space-y-6 overflow-y-auto h-full pb-32 scrollbar-thin scrollbar-thumb-slate-700 pe-4" dir={isRtl ? 'rtl' : 'ltr'}>
              {currentSection?.questions.map((q, idx) => (
                <QuestionCard 
                  key={q.id}
                  question={q}
                  index={idx}
                  isRtl={isRtl}
                  answer={answers.find(a => a.questionId === q.id)}
                  onMcqSelect={handleMcqSelect}
                  onShortAnswerChange={handleShortAnswerChange}
                />
              ))}
            </div>

          </div>
        ) : (
          // Standard Centered Layout
          <div className="max-w-3xl mx-auto space-y-6 pb-32">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 text-center">
              <h2 className="text-2xl font-black text-white">{isRtl ? (currentSection?.titleAr || currentSection?.titleEn) : (currentSection?.titleEn || currentSection?.titleAr)}</h2>
            </div>
            
            {currentSection?.questions.map((q, idx) => (
              <QuestionCard 
                key={q.id}
                question={q}
                index={idx}
                isRtl={isRtl}
                answer={answers.find(a => a.questionId === q.id)}
                onMcqSelect={handleMcqSelect}
                onShortAnswerChange={handleShortAnswerChange}
              />
            ))}
          </div>
        )}

      </main>

      {/* Sticky Bottom Navigation */}
      {!gradedResult && (
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={() => setActiveSectionIndex(i => Math.max(0, i - 1))}
              disabled={activeSectionIndex === 0}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 text-slate-200 px-5 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2"
            >
              <ArrowLeft className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              {isRtl ? 'القسم السابق' : 'Previous Section'}
            </button>
            
            <div className="text-sm font-bold text-slate-400">
              {activeSectionIndex + 1} / {quiz.sections.length}
            </div>

            {!hasNextSection ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-brand-500/20"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isRtl ? 'إنهاء الاختبار' : 'Submit Exam'}
              </button>
            ) : (
              <button
                onClick={() => setActiveSectionIndex(i => i + 1)}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
              >
                {isRtl ? 'القسم التالي' : 'Next Section'}
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

const indexToAlpha = (idx: number) => String.fromCharCode(65 + idx);

// Sub-component for individual questions
function QuestionCard({ question, index, isRtl, answer, onMcqSelect, onShortAnswerChange }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-brand-500/20 text-brand-400 font-bold w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
          {index + 1}
        </div>
        <div 
          className="text-lg font-semibold text-slate-200 pt-1 prose prose-invert max-w-none prose-p:my-0 [&_*]:!text-slate-200 [&_*]:!bg-transparent"
          dir="auto"
          dangerouslySetInnerHTML={{ __html: (isRtl ? (question.textAr || question.textEn) : (question.textEn || question.textAr)) || '' }}
        />
      </div>

      {question.type === 'MCQ' ? (
        <div className="space-y-3">
          {question.choices.map((choice: any) => {
            const isSelected = answer?.selectedChoiceId === choice.id;
            return (
              <label 
                key={choice.id}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-brand-500/10 border-brand-500/50 shadow-[0_0_0_1px_rgba(249,115,22,0.5)]' 
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={choice.id}
                  checked={isSelected}
                  onChange={() => onMcqSelect(question.id, choice.id)}
                  className="w-5 h-5 accent-brand-500"
                />
                <span 
                  className={`ms-4 font-medium ${isSelected ? 'text-white' : 'text-slate-300'} prose prose-invert prose-p:my-0 max-w-none [&_*]:!text-inherit [&_*]:!bg-transparent`}
                  dir="auto"
                  dangerouslySetInnerHTML={{ __html: (isRtl ? (choice.textAr || choice.textEn) : (choice.textEn || choice.textAr)) || '' }}
                />
              </label>
            );
          })}
        </div>
      ) : (
        <div className="pt-2">
          <input
            type="text"
            value={answer?.textAnswer || ''}
            onChange={(e) => onShortAnswerChange(question.id, e.target.value)}
            placeholder={isRtl ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            dir="auto"
          />
        </div>
      )}
    </div>
  );
}
