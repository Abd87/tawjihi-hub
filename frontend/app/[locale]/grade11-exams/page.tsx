'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter, Link } from '@/i18n/routing';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Play,
  UserPlus,
  LogIn,
  X,
  Award,
  BrainCircuit,
  CheckCircle,
  XCircle,
  RotateCcw,
  Flame,
  Check
} from 'lucide-react';
import grade11Data from '@/data/grade11_unit_exams.json';

export default function Grade11ExamsCatalogPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [user, setUser] = useState<any>(null);
  const [selectedExamForAuth, setSelectedExamForAuth] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'mistakes'>('catalog');

  // Grade 11 Mistake Bank State
  const [g11Mistakes, setG11Mistakes] = useState<any[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [feedbackState, setFeedbackState] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      try {
        const u = JSON.parse(userStr);
        setUser(u);
        loadMistakes(u.id);
      } catch (e) {}
    }
  }, []);

  const loadMistakes = (userId: string) => {
    const key = `student-mistakes-${userId}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const list = JSON.parse(raw);
        // Filter Grade 11 mistakes
        const filtered = list.filter((m: any) => 
          (m.id && m.id.startsWith('g11_')) || (m.unitId && m.unitId.startsWith('unit-'))
        );
        setG11Mistakes(filtered);
      } catch (e) {}
    }
  };

  const handleStartExam = (exam: any) => {
    if (user) {
      router.push(`/grade11-exams/${exam.id}`);
    } else {
      setSelectedExamForAuth(exam);
      setShowAuthModal(true);
    }
  };

  const handleResolveMistakeOption = (mistakeItem: any, optionIndex: number) => {
    const isCorrect = optionIndex === mistakeItem.correctAnswerIndex;
    setSelectedAnswers(prev => ({ ...prev, [mistakeItem.id]: optionIndex }));
    setFeedbackState(prev => ({ ...prev, [mistakeItem.id]: isCorrect }));

    if (isCorrect && user) {
      // Remove this mistake from localStorage and state so it disappears
      setTimeout(() => {
        const key = `student-mistakes-${user.id}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const list = JSON.parse(raw);
            const updated = list.filter((m: any) => m.id !== mistakeItem.id);
            localStorage.setItem(key, JSON.stringify(updated));
            setG11Mistakes(prev => prev.filter(m => m.id !== mistakeItem.id));
          } catch (e) {}
        }
      }, 1200);
    }
  };

  return (
    <div className={`min-h-screen bg-[#020617] text-white font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[130px]" />
        <div className="absolute bottom-[10%] end-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-10">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/60 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold"
          >
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{isRtl ? 'العودة للوحة التحكم' : 'Back to Dashboard'}</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              {isRtl ? '✨ امتحانات مجانية 100%' : '✨ 100% Free Lead Exams'}
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-500/20 to-amber-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>{isRtl ? 'منهاج الأول ثانوي (High Note 11)' : 'Grade 11 High Note 11'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {isRtl
              ? 'امتحانات الأول ثانوي وبنك الأخطاء التفاعلي'
              : 'Grade 11 High Note 11 Free Exams & Mistake Bank'}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {isRtl
              ? 'اختبر مستواك في جميع وحدات اللغة الإنجليزية (High Note 11 Units 1 - 10) وراجع أخطاءك وحلها في بنك الأخطاء المخصص حتى إتقانها واختفائها!'
              : 'Test your knowledge across all 10 High Note 11 Units. Resolve mistakes in your dedicated Mistake Bank until 100% mastery!'}
          </p>
        </div>

        {/* Tab Switcher: Catalog vs Mistake Bank */}
        <div className="flex items-center justify-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-gradient-to-r from-brand-500 to-amber-600 text-white shadow-lg shadow-brand-500/20'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{isRtl ? '📚 كتالوج امتحانات الـ 10 وحدات' : '📚 10 Unit Exams Catalog'}</span>
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 relative ${
              activeTab === 'mistakes'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-amber-400" />
            <span>{isRtl ? '🧠 بنك أخطاء الأول ثانوي' : '🧠 Grade 11 Mistake Bank'}</span>
            {g11Mistakes.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                {g11Mistakes.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: CATALOG GRID */}
        {activeTab === 'catalog' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
            {grade11Data.map((exam: any) => (
              <div
                key={exam.id}
                className="group bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 rounded-3xl p-6 flex flex-col justify-between backdrop-blur-xl transition-all duration-300 shadow-xl hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-0 end-0 p-4 opacity-5 group-hover:opacity-15 transition-opacity">
                  <Award className="w-24 h-24 text-brand-400" />
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[11px] font-bold">
                      {isRtl ? `الوحدة ${exam.unitNumber}` : `Unit ${exam.unitNumber}`}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase">
                      {isRtl ? 'مجاني' : 'FREE'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                      {isRtl ? exam.titleAr : exam.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed line-clamp-2">
                      {isRtl ? exam.descriptionAr : exam.descriptionEn}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      <BookOpen className="w-4 h-4 text-brand-400 shrink-0" />
                      <span>{exam.questionsCount} {isRtl ? 'سؤال كامل' : 'Questions'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{exam.durationMinutes} {isRtl ? 'دقيقة' : 'Mins'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white text-xs font-extrabold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    <Play className="w-4 h-4 fill-white transition-transform group-hover/btn:scale-110" />
                    <span>{isRtl ? 'ابدأ الاختبار الآن مجاناً' : 'Start Exam Free'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: GRADE 11 MISTAKE BANK HUB */}
        {activeTab === 'mistakes' && (
          <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
            {!user ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
                <Lock className="w-12 h-12 text-amber-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">
                  {isRtl ? 'سجّل دخولك لعرض بنك الأخطاء' : 'Sign in to Access Your Mistake Bank'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isRtl ? 'عند تقديم امتحانات الأول ثانوي، تُحفظ جميع أسئلتك الخاطئة هنا تلقائياً لحلها وإخفائها عند الإجابة الصحيحة!' : 'When taking Grade 11 exams, your wrong answers are automatically saved here for targeted resolution.'}
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href="/register?redirect=/grade11-exams"
                    className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl"
                  >
                    {isRtl ? 'إنشاء حساب مجاني' : 'Create Free Account'}
                  </Link>
                  <Link
                    href="/login?redirect=/grade11-exams"
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                  >
                    {isRtl ? 'تسجيل الدخول' : 'Log In'}
                  </Link>
                </div>
              </div>
            ) : g11Mistakes.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-10 text-center space-y-4 backdrop-blur-xl">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white">
                  {isRtl ? '🎉 بنك الأخطاء فارغ تماماً! (100% إتقان)' : '🎉 Grade 11 Mistake Bank Empty!'}
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  {isRtl
                    ? 'ممتاز جداً! ليس لديك أي أسئلة خاطئة مسجلة، أو قمت بحل جميع الأخطاء السابقة بنجاح!'
                    : 'Awesome job! You have zero active mistakes, or you have successfully resolved all previous wrong questions!'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-bold">
                    {isRtl ? `لديك ${g11Mistakes.length} أسئلة خاطئة متبقية في بنك الأخطاء:` : `Active Grade 11 Mistakes: ${g11Mistakes.length}`}
                  </span>
                  <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-bold">
                    {isRtl ? 'حل السؤال بنجاح لإخفائه تلقائياً' : 'Correct answers disappear automatically'}
                  </span>
                </div>

                <div className="space-y-4">
                  {g11Mistakes.map((m: any, idx: number) => {
                    const selectedOpt = selectedAnswers[m.id];
                    const isCorrect = feedbackState[m.id];

                    return (
                      <div
                        key={m.id}
                        className={`p-6 rounded-3xl border ${
                          isCorrect
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 animate-out fade-out duration-700'
                            : 'bg-slate-900/60 border-slate-800'
                        } space-y-4 backdrop-blur-xl transition-all`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4
                            className="text-sm sm:text-base font-bold text-white [&>u]:text-brand-400 [&>u]:font-black [&>u]:underline [&>u]:underline-offset-4 [&>u]:bg-brand-500/10 [&>u]:px-1 [&>u]:py-0.5 [&>u]:rounded [&>u]:border [&>u]:border-brand-500/30"
                            dangerouslySetInnerHTML={{ __html: `${idx + 1}. ${m.question}` }}
                          />
                          <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 font-mono shrink-0">
                            Unit {m.unitId?.replace('unit-', '')}
                          </span>
                        </div>

                        {/* 2x2 Option Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          {m.choices?.map((choice: string, cIdx: number) => {
                            const isChosen = selectedOpt === cIdx;
                            const isAnswerKey = cIdx === m.correctAnswerIndex;

                            return (
                              <button
                                key={cIdx}
                                onClick={() => handleResolveMistakeOption(m, cIdx)}
                                className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs font-semibold flex items-center justify-between ${
                                  isChosen && isAnswerKey
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                                    : isChosen && !isAnswerKey
                                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                                }`}
                              >
                                <span>{choice}</span>
                                {isChosen && isAnswerKey && <Check className="w-4 h-4 text-emerald-400 shrink-0 ms-2" />}
                                {isChosen && !isAnswerKey && <XCircle className="w-4 h-4 text-rose-400 shrink-0 ms-2" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Solution Feedback */}
                        {selectedOpt !== undefined && (
                          <div className={`p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'} text-xs space-y-1`}>
                            <div className="font-bold flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4" />
                              <span>{isCorrect ? (isRtl ? 'إجابة صحيحة! تم حل الخطأ واختفائه بنجاح 🎉' : 'Correct! Mistake resolved & removed! 🎉') : (isRtl ? 'إجابة خاطئة - حاول مرة أخرى' : 'Incorrect try again')}</span>
                            </div>
                            <p className="dir-rtl text-right text-slate-200">{m.explanationAr}</p>
                            <p className="text-left text-slate-400">{m.explanationEn}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auth Modal for Unauthenticated Users */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full relative space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 end-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-amber-500/20 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-400">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {isRtl ? 'سجّل دخولك للبدء بالاختبار المجاني' : 'Sign In Required'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {isRtl
                  ? `لتأدية امتحان (${selectedExamForAuth?.titleAr}) وحفظ نتيجتك وحفظ أخطائك في بنك الأخطاء، يرجى إنشاء حساب مجاني أو تسجيل الدخول.`
                  : `To take the free unit test (${selectedExamForAuth?.titleEn}) and save your score, please sign up or log in.`}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href={`/register?redirect=/grade11-exams/${selectedExamForAuth?.id}`}
                className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{isRtl ? 'إنشاء حساب مجاني جديد' : 'Create Free Account'}</span>
              </Link>

              <Link
                href={`/login?redirect=/grade11-exams/${selectedExamForAuth?.id}`}
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isRtl ? 'لديك حساب بالفعل؟ تسجيل الدخول' : 'Already have an account? Log In'}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
