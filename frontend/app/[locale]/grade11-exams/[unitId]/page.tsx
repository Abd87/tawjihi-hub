'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/routing';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  BrainCircuit,
  Lock,
  UserPlus,
  LogIn,
  BookOpen,
  X,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Check,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import grade11Data from '@/data/grade11_unit_exams.json';

export default function Grade11UnitExamEnginePage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  const unitId = params?.unitId as string;

  const [exam, setExam] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [showPassagePane, setShowPassagePane] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !userStr) {
      setShowAuthGate(true);
      return;
    } else {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }

    const found = grade11Data.find((u: any) => u.id === unitId || u.unitNumber === parseInt(unitId.replace('unit-', '')));
    if (found) {
      setExam(found);
      setTimeLeft(found.durationMinutes * 60);
    }
  }, [unitId]);

  // Timer countdown
  useEffect(() => {
    if (!exam || submitted || showAuthGate || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [exam, submitted, showAuthGate, timeLeft]);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitExam = async () => {
    if (!exam || submitted) return;

    let correctCount = 0;
    const mistakesToSave: any[] = [];

    exam.questions.forEach((q: any, idx: number) => {
      const selected = userAnswers[idx];
      if (selected === q.correctAnswerIndex) {
        correctCount++;
      } else {
        mistakesToSave.push({
          id: q.id,
          unitId: exam.id,
          question: q.question,
          selectedChoice: q.choices[selected] || 'No answer selected',
          correctChoice: q.choices[q.correctAnswerIndex],
          explanationAr: q.explanationAr,
          explanationEn: q.explanationEn,
          date: new Date().toISOString()
        });
      }
    });

    setScore(correctCount);
    setSubmitted(true);

    // Save mistakes to localStorage
    if (user && mistakesToSave.length > 0) {
      const mistakeKey = `student-mistakes-${user.id}`;
      const existingStr = localStorage.getItem(mistakeKey);
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [...mistakesToSave, ...existing];
      localStorage.setItem(mistakeKey, JSON.stringify(updated));

      // Sync to API backend if online
      try {
        const token = localStorage.getItem('token');
        for (const mistake of mistakesToSave) {
          await fetch('/api/student/mistakes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              questionId: mistake.id,
              selectedChoice: mistake.selectedChoice
            })
          });
        }
      } catch (e) {}
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (showAuthGate) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 dir-ltr font-sans">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-amber-500/20 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">
            Login Required
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Please sign up or log in to take High Note 11 free unit exams and track your scores in your Mistake Bank.
          </p>
          <div className="space-y-3 pt-2">
            <Link
              href={`/register?redirect=/grade11-exams/${unitId}`}
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Free Account</span>
            </Link>
            <Link
              href={`/login?redirect=/grade11-exams/${unitId}`}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const currentQ = exam.questions[currentIdx];
  const percentage = Math.round((score / exam.questionsCount) * 100);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans text-left" dir="ltr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 space-y-6">
        
        {/* Navigation & Header Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            href="/grade11-exams"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/60 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Exam Catalog</span>
          </Link>

          <div className="flex items-center gap-3">
            {exam.readingPassage && (
              <button
                onClick={() => setShowPassagePane(!showPassagePane)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-bold transition-all"
              >
                {showPassagePane ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                <span>{showPassagePane ? 'Hide Side Passage' : 'Show Side Passage'}</span>
              </button>
            )}

            {!submitted && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono font-bold">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Unit Info Header */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-xl">
          <div>
            <span className="text-xs font-bold text-brand-400 block mb-1">
              High Note 11 • Unit {exam.unitNumber}
            </span>
            <h1 className="text-lg sm:text-xl font-extrabold text-white">
              {exam.titleEn} ({exam.titleAr})
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
            <span className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-bold">
              {exam.questionsCount} Questions
            </span>
          </div>
        </div>

        {/* Results Breakdown Screen */}
        {submitted ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-8 animate-in fade-in max-w-4xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500/20 to-amber-500/20 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
                <Award className="w-10 h-10" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Exam Final Score & Explanation Breakdown
              </h2>

              <div className="text-4xl sm:text-5xl font-black text-brand-400">
                {percentage}%
              </div>

              <p className="text-sm text-slate-300">
                You answered <span className="text-emerald-400 font-bold">{score}</span> out of <span className="font-bold">{exam.questionsCount}</span> questions correctly.
              </p>

              {exam.questionsCount - score > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold inline-flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 shrink-0" />
                  <span>
                    {exam.questionsCount - score} incorrect questions saved automatically to your <strong>Mistake Bank</strong>.
                  </span>
                </div>
              )}
            </div>

            {/* Answer Breakdown with Detailed Explanations */}
            <div className="space-y-6 pt-4 border-t border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4">
                Detailed Answers & Rule Explanations:
              </h3>

              {exam.questions.map((q: any, qIdx: number) => {
                const userAns = userAnswers[qIdx];
                const isCorrect = userAns === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-2xl border ${
                      isCorrect
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-rose-500/5 border-rose-500/20'
                    } space-y-4`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-white">
                        {qIdx + 1}. {q.question}
                      </h4>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </div>

                    {/* 2x2 Grid Options Review */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.choices.map((choice: string, cIdx: number) => {
                        const isChosen = userAns === cIdx;
                        const isAnswerKey = cIdx === q.correctAnswerIndex;

                        return (
                          <div
                            key={cIdx}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              isAnswerKey
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold'
                                : isChosen
                                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                                : 'bg-slate-950/40 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span>{choice}</span>
                            {isAnswerKey && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Detailed Solution Explanation */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-brand-400 font-bold mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>High Note 11 Explanation & Solution Rule:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed dir-rtl text-right">
                        {q.explanationAr}
                      </p>
                      <p className="text-slate-400 leading-relaxed text-left">
                        {q.explanationEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setUserAnswers({});
                  setScore(0);
                  setTimeLeft(exam.durationMinutes * 60);
                  setCurrentIdx(0);
                }}
                className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Exam</span>
              </button>

              <Link
                href="/dashboard/mistakes"
                className="flex-1 py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 text-center"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Open Mistake Bank</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Question View - Side-by-Side Split View (Left: Passage | Right: Question & 2x2 Choices) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Side: Reading Comprehension Passage Pane */}
            {showPassagePane && exam.readingPassage && (
              <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-3 sticky top-24 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs pb-2 border-b border-slate-800">
                  <BookOpen className="w-4 h-4" />
                  <span>High Note 11 Reading Passage • Unit {exam.unitNumber}</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">{exam.titleEn}</h4>
                <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
                  <p>{exam.readingPassage}</p>
                </div>
              </div>
            )}

            {/* Right Side: Active Question & 2x2 Option Grid */}
            <div className={`${(showPassagePane && exam.readingPassage) ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl mx-auto'} bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-6 w-full`}>
              
              {/* Question Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                <span className="font-semibold">Question {currentIdx + 1} of {exam.questionsCount}</span>
                <div className="w-36 h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / exam.questionsCount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Title */}
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-relaxed">
                {currentIdx + 1}. {currentQ.question}
              </h3>

              {/* Compact 2x2 Options Grid (A, B, C, D) - Fits cleanly on screen without scrolling */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.choices.map((choice: string, cIdx: number) => {
                  const isSelected = userAnswers[currentIdx] === cIdx;
                  return (
                    <button
                      key={cIdx}
                      onClick={() => handleSelectOption(currentIdx, cIdx)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm font-semibold flex items-center justify-between ${
                        isSelected
                          ? 'bg-brand-500/20 border-brand-500 text-white shadow-lg shadow-brand-500/10'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <span className="leading-snug">{choice}</span>
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

              {/* Compact Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(prev => prev - 1)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    currentIdx === 0
                      ? 'bg-slate-950 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  Previous
                </button>

                {currentIdx < exam.questionsCount - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-1"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitExam}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1"
                  >
                    <span>Submit Exam</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
