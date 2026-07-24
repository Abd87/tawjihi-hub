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
  Award
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

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const handleStartExam = (exam: any) => {
    if (user) {
      router.push(`/grade11-exams/${exam.id}`);
    } else {
      setSelectedExamForAuth(exam);
      setShowAuthModal(true);
    }
  };

  return (
    <div className={`min-h-screen bg-[#020617] text-white font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[130px]" />
        <div className="absolute bottom-[10%] end-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-12">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/60 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold"
          >
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{isRtl ? 'العودة للوحة التحكم' : 'Back to Dashboard'}</span>
          </Link>

          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            {isRtl ? '✨ امتحانات مجانية 100%' : '✨ 100% Free Lead Exams'}
          </span>
        </div>

        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-500/20 to-amber-500/20 border border-brand-500/30 text-brand-400 text-xs font-bold">
            <GraduationCap className="w-4 h-4" />
            <span>{isRtl ? 'منهاج الأول ثانوي (Action Pack 11)' : 'Grade 11 Action Pack'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            {isRtl
              ? 'امتحانات الأول ثانوي المجانية لجميع الوحدات'
              : 'Grade 11 Free Unit Exams Catalog'}
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {isRtl
              ? 'اختبر مستواك مجاناً في وحدات مادة اللغة الإنجليزية (Units 1 - 10) وحضّر نفسك لمرحلة التوجيهي بثقة عالية. احصل على نتيجتك فوراً وراجع أخطاءك!'
              : 'Test your knowledge for free across all 10 Grade 11 Units. Instant scoring, detailed feedback, and mistake bank tracking.'}
          </p>
        </div>

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <span>{exam.questionsCount} {isRtl ? 'سؤال تفاعلي' : 'Questions'}</span>
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
