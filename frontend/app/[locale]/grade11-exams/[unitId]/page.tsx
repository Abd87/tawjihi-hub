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
  PanelLeftOpen,
  Save,
  Play,
  Flame,
  CheckCircle
} from 'lucide-react';
import { getGrade11ExamById, getGrade11ExamByUnit } from '@/app/actions/grade11-exams';

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
  
  // Save & Resume State
  const [hasSavedProgress, setHasSavedProgress] = useState(false);
  const [savedProgressData, setSavedProgressData] = useState<any>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // In-Exam Mistake Bank Mode
  const [isMistakeMode, setIsMistakeMode] = useState(false);
  const [mistakeList, setMistakeList] = useState<any[]>([]);
  const [currentMistakeIdx, setCurrentMistakeIdx] = useState(0);
  const [mistakeUserAnswers, setMistakeUserAnswers] = useState<Record<number, number>>({});
  const [mistakeResolvedIds, setMistakeResolvedIds] = useState<string[]>([]);
  const [mistakeFeedback, setMistakeFeedback] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token || !userStr) {
      setShowAuthGate(true);
      return;
    } else {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        
        // Check saved progress
        const progressKey = `g11-progress-${unitId}-${u.id}`;
        const saved = localStorage.getItem(progressKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.currentIdx !== undefined) {
              setSavedProgressData(parsed);
              setHasSavedProgress(true);
              setShowResumeModal(true);
            }
          } catch (e) {}
        }
      } catch (e) {}
    }

    // Attempt to match unitId which could be an ID or "unit-X"
    if (unitId.startsWith('unit-')) {
      const uNum = parseInt(unitId.replace('unit-', ''));
      getGrade11ExamByUnit(uNum).then(e => {
        if (e) {
          setExam({ ...e, questionsCount: e.questions.length });
          setTimeLeft(e.durationMinutes * 60);
        }
      });
    } else {
      getGrade11ExamById(unitId).then(e => {
        if (e) {
          setExam({ ...e, questionsCount: e.questions.length });
          setTimeLeft(e.durationMinutes * 60);
        }
      });
    }
  }, [unitId]);

  // Timer countdown
  useEffect(() => {
    if (!exam || submitted || showAuthGate || isMistakeMode || showResumeModal || timeLeft <= 0) return;
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
  }, [exam, submitted, showAuthGate, isMistakeMode, showResumeModal, timeLeft]);

  const handleResumeProgress = () => {
    if (savedProgressData) {
      setCurrentIdx(savedProgressData.currentIdx || 0);
      setUserAnswers(savedProgressData.userAnswers || {});
      setTimeLeft(savedProgressData.timeLeft || (exam?.durationMinutes * 60));
    }
    setShowResumeModal(false);
  };

  const handleStartFresh = () => {
    if (user) {
      const progressKey = `g11-progress-${unitId}-${user.id}`;
      localStorage.removeItem(progressKey);
    }
    setCurrentIdx(0);
    setUserAnswers({});
    setTimeLeft(exam?.durationMinutes * 60 || 1800);
    setShowResumeModal(false);
  };

  const handleSaveAndExit = () => {
    if (user && exam) {
      const progressKey = `g11-progress-${unitId}-${user.id}`;
      const payload = {
        unitId: exam.id,
        currentIdx,
        userAnswers,
        timeLeft,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(progressKey, JSON.stringify(payload));
      router.push('/grade11-exams');
    }
  };

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
      } else if (selected !== undefined) {
        mistakesToSave.push({
          qIdx: idx,
          id: q.id,
          unitId: exam.id,
          question: q.question,
          choices: q.choices,
          correctAnswerIndex: q.correctAnswerIndex,
          selectedChoice: q.choices[selected] || 'No answer selected',
          correctChoice: q.choices[q.correctAnswerIndex],
          explanationAr: q.explanationAr,
          explanationEn: q.explanationEn,
          type: q.type,
          date: new Date().toISOString()
        });
      }
    });

    setScore(correctCount);
    setMistakeList(mistakesToSave);
    setSubmitted(true);

    // Clear saved progress on completion
    if (user) {
      const progressKey = `g11-progress-${unitId}-${user.id}`;
      localStorage.removeItem(progressKey);

      // Save mistakes to localStorage
      if (mistakesToSave.length > 0) {
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
    }
  };

  // Start Mistake Correction Engine
  const handleStartMistakeMode = () => {
    if (mistakeList.length === 0) return;
    setIsMistakeMode(true);
    setCurrentMistakeIdx(0);
    setMistakeUserAnswers({});
    setMistakeResolvedIds([]);
    setMistakeFeedback({});
  };

  const handleSelectMistakeOption = (mIdx: number, optionIndex: number) => {
    const currentMistake = mistakeList[mIdx];
    const isRight = optionIndex === currentMistake.correctAnswerIndex;

    setMistakeUserAnswers(prev => ({ ...prev, [mIdx]: optionIndex }));
    setMistakeFeedback(prev => ({ ...prev, [mIdx]: isRight }));

    if (isRight && !mistakeResolvedIds.includes(currentMistake.id)) {
      setMistakeResolvedIds(prev => [...prev, currentMistake.id]);
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
  const isReadingQuestion = currentQ?.type === 'reading' || currentIdx < 8;
  const percentage = Math.round((score / exam.questionsCount) * 100);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans text-left" dir="ltr">
      
      {/* Resume Progress Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <Save className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Resume Previous Progress?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We found your saved progress for <strong>Unit {exam.unitNumber}</strong> on Question {savedProgressData?.currentIdx + 1} with {formatTime(savedProgressData?.timeLeft || 0)} remaining.
            </p>
            <div className="space-y-3 pt-2">
              <button
                onClick={handleResumeProgress}
                className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Saved Exam</span>
              </button>

              <button
                onClick={handleStartFresh}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start Fresh from Question 1</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
            {!submitted && !isMistakeMode && (
              <button
                onClick={handleSaveAndExit}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save & Exit</span>
              </button>
            )}

            {!submitted && !isMistakeMode && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-400 text-xs font-mono font-bold">
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

        {/* In-Exam Mistake Bank Mode (Resolve Mistakes) */}
        {isMistakeMode ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6 max-w-4xl mx-auto animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                <BrainCircuit className="w-5 h-5" />
                <span>Mistake Bank Practice Engine ({mistakeResolvedIds.length} / {mistakeList.length} Resolved)</span>
              </div>
              <button
                onClick={() => setIsMistakeMode(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-300 font-bold hover:bg-slate-700"
              >
                Back to Score Summary
              </button>
            </div>

            {mistakeResolvedIds.length === mistakeList.length ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white">🎉 100% Mastery Achieved!</h3>
                <p className="text-sm text-slate-300">
                  Awesome work! You have successfully resolved all mistaken questions for Unit {exam.unitNumber}.
                </p>
                <button
                  onClick={() => setIsMistakeMode(false)}
                  className="px-6 py-3 bg-gradient-to-r from-brand-500 to-amber-600 text-white font-extrabold text-xs rounded-xl shadow-lg"
                >
                  Return to Final Results
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {(() => {
                  const mQ = mistakeList[currentMistakeIdx];
                  const userChoice = mistakeUserAnswers[currentMistakeIdx];
                  const isCorrect = mistakeFeedback[currentMistakeIdx];

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Mistake {currentMistakeIdx + 1} of {mistakeList.length}</span>
                        <span className="text-amber-400 font-bold">{mQ.type?.toUpperCase()}</span>
                      </div>

                      <h3
                        className="text-base sm:text-lg font-bold text-white leading-relaxed [&>u]:text-brand-400 [&>u]:font-black [&>u]:underline [&>u]:underline-offset-4 [&>u]:bg-brand-500/10 [&>u]:px-1 [&>u]:py-0.5 [&>u]:rounded [&>u]:border [&>u]:border-brand-500/30"
                        dangerouslySetInnerHTML={{ __html: mQ.question }}
                      />

                      {/* 2x2 Option Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mQ.choices.map((choice: string, cIdx: number) => {
                          const isChosen = userChoice === cIdx;
                          const isAnswerKey = cIdx === mQ.correctAnswerIndex;

                          return (
                            <button
                              key={cIdx}
                              onClick={() => handleSelectMistakeOption(currentMistakeIdx, cIdx)}
                              className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs sm:text-sm font-semibold flex items-center justify-between ${
                                isChosen && isAnswerKey
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                                  : isChosen && !isAnswerKey
                                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <span>{choice}</span>
                              {isChosen && isAnswerKey && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ms-2" />}
                              {isChosen && !isAnswerKey && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ms-2" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Immediate Explanation Feedback */}
                      {userChoice !== undefined && (
                        <div className={`p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-amber-500/10 border-amber-500/20 text-amber-300'} space-y-1 text-xs`}>
                          <div className="font-bold flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>{isCorrect ? 'Correct! Mistake Resolved!' : 'Incorrect Try Again:'}</span>
                          </div>
                          <p className="dir-rtl text-right text-slate-200">{mQ.explanationAr}</p>
                          <p className="text-left text-slate-400">{mQ.explanationEn}</p>
                        </div>
                      )}

                      {/* Navigation between Mistakes */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                        <button
                          disabled={currentMistakeIdx === 0}
                          onClick={() => setCurrentMistakeIdx(prev => prev - 1)}
                          className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold disabled:opacity-40"
                        >
                          Previous Mistake
                        </button>

                        <button
                          disabled={currentMistakeIdx === mistakeList.length - 1}
                          onClick={() => setCurrentMistakeIdx(prev => prev + 1)}
                          className="px-5 py-2 bg-brand-500 text-white rounded-xl text-xs font-bold disabled:opacity-40"
                        >
                          Next Mistake
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : submitted ? (
          /* Results Breakdown Screen */
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

              {mistakeList.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 shrink-0" />
                    <span>
                      {mistakeList.length} incorrect questions saved to your <strong>Mistake Bank</strong>.
                    </span>
                  </div>

                  <button
                    onClick={handleStartMistakeMode}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Fix Mistakes Now</span>
                  </button>
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
                      <h4
                        className="text-sm font-bold text-white [&>u]:text-brand-400 [&>u]:font-black [&>u]:underline [&>u]:underline-offset-4 [&>u]:bg-brand-500/10 [&>u]:px-1 [&>u]:py-0.5 [&>u]:rounded [&>u]:border [&>u]:border-brand-500/30"
                        dangerouslySetInnerHTML={{ __html: `${qIdx + 1}. ${q.question}` }}
                      />
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
          /* Active Question View - Passage ONLY shown for Reading Comprehension Questions */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Side: Reading Comprehension Passage Pane (ONLY FOR READING QUESTIONS) */}
            {isReadingQuestion && exam.text && showPassagePane && (
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[500px] lg:h-[calc(100vh-8rem)] sticky top-24 shadow-2xl">
                <div className="bg-slate-800/50 border-b border-slate-700/50 p-4 flex items-center justify-between shrink-0">
                  <span className="font-bold text-slate-300 text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-brand-400" />
                    <span>High Note 11 Reading Passage • Unit {exam.unitNumber}</span>
                  </span>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-sm text-slate-300 leading-relaxed font-serif">
                  {exam.text.split('\n\n').map((para: string, pIdx: number) => (
                    <p 
                      key={pIdx} 
                      className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 tracking-wide leading-relaxed text-slate-200 [&>u]:text-brand-400 [&>u]:font-black [&>u]:underline [&>u]:underline-offset-4 [&>u]:bg-brand-500/10 [&>u]:px-1 [&>u]:py-0.5 [&>u]:rounded [&>u]:border [&>u]:border-brand-500/30 [&>b>u]:text-brand-400 [&>b>u]:font-black [&>b>u]:underline [&>b>u]:underline-offset-4 [&>b>u]:bg-brand-500/10 [&>b>u]:px-1 [&>b>u]:py-0.5 [&>b>u]:rounded [&>b>u]:border [&>b>u]:border-brand-500/30"
                      dangerouslySetInnerHTML={{ __html: para }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Right Side: Active Question & 2x2 Option Grid */}
            <div className={`${(isReadingQuestion && exam.text && showPassagePane) ? 'lg:col-span-7' : 'lg:col-span-12 max-w-4xl mx-auto'} bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl space-y-6 w-full`}>
              
              {/* Question Progress Tracker */}
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Question {currentIdx + 1} of {exam.questionsCount}</span>
                  <span className="px-2 py-0.5 rounded bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-bold uppercase">
                    {currentQ.type || 'Question'}
                  </span>
                </div>
                <div className="w-36 h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / exam.questionsCount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Title */}
              <h3
                className="text-base sm:text-lg font-extrabold text-white leading-relaxed [&>u]:text-brand-400 [&>u]:font-black [&>u]:underline [&>u]:underline-offset-4 [&>u]:bg-brand-500/10 [&>u]:px-1 [&>u]:py-0.5 [&>u]:rounded [&>u]:border [&>u]:border-brand-500/30"
                dangerouslySetInnerHTML={{ __html: `${currentIdx + 1}. ${currentQ.question}` }}
              />

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
