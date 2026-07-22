'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  DollarSign, 
  AlertTriangle, 
  UploadCloud, 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Plus, 
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  Users
} from 'lucide-react';

import AIQuizGeneratorModal from '@/components/studio/AIQuizGeneratorModal';

export default function TeacherStudioDashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isRtl ? 'استوديو المعلم 2.0' : 'Teacher Studio 2.0'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {isRtl ? 'لوحة تحكم المعلم والاستوديو' : 'Teacher Studio Dashboard'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRtl
              ? 'قم وإدارة محتوى الدورات، متابعة الأرباح والنسب المالية، واكتشاف الأسئلة الأكثر تعثراً لدى طلابك'
              : 'Manage course content, track revenue share payouts, and identify student learning bottlenecks'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 transition-all w-fit"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? 'توليد بالذكاء الاصطناعي ✨' : 'AI Quiz Generator ✨'}</span>
          </button>

          <Link
            href={`/${locale}/studio/course-builder/new`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-sm font-bold transition-all w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'إضافة دورة جديدة' : 'Create Course'}</span>
          </Link>
        </div>
      </div>

      <AIQuizGeneratorModal
        isOpen={showAiModal}
        onClose={() => setShowAiModal(false)}
        locale={locale}
      />

      {/* Main Studio Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Course Builder */}
        <Link
          href={`/${locale}/studio/course-builder`}
          className="group bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-brand-500/10 text-brand-400 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                {isRtl ? 'منشئ ومحرر الدورات' : 'Course Builder'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'إضافة الدروس، الفيديوهات، الملفات والوحدات الدراسية' : 'Manage units, lessons, videos, and PDFs'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'إدارة الدورات' : 'Manage Courses'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </Link>

        {/* Card 2: Bulk Quiz Uploader */}
        <Link
          href={`/${locale}/studio/quiz-bulk`}
          className="group bg-slate-900/60 border border-slate-800 hover:border-blue-500/50 p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-blue-500/10 text-blue-400 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                {isRtl ? 'رفع بنك الأسئلة السريع' : 'Bulk Quiz Uploader'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'رفع مئات الأسئلة والاختبارات دفعة واحدة بحركة سريعة' : 'Upload hundreds of quiz questions instantly'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'رفع بنك الأسئلة' : 'Upload Quizzes'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </Link>

        {/* Card 3: Revenue & Financial Payouts */}
        <Link
          href={`/${locale}/studio/revenue`}
          className="group bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                {isRtl ? 'المالية وتتبع الأرباح' : 'Revenue & Financials'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'عرض صافي الأرباح، نسبة المعلم من المبيعات وتقارير الكوبونات' : 'Track net payouts, revenue share %, and coupon sales'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'عرض الأرباح والنسبة' : 'View Financials'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </Link>

        {/* Card 4: Student Bottlenecks Analytics */}
        <Link
          href={`/${locale}/studio/analytics`}
          className="group bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                {isRtl ? 'الأسئلة الأكثر تعثراً للطلاب' : 'Student Bottlenecks'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'اكتشاف الأسئلة التي واجه الطلاب صعوبة بها لإضافة فيديوهات توضيحية' : 'Identify difficult questions & target re-explanations'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'تحليلات التعثر' : 'View Bottlenecks'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </Link>
      </div>

      {/* Courses Overview Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            {isRtl ? 'دوراتك التعليمية الحالية' : 'Your Active Courses'}
          </h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            {courses.length} {isRtl ? 'دورة' : 'Courses'}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <Loader2 className="w-6 h-6 text-brand-500 animate-spin mx-auto" />
          </div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-800 text-brand-400 uppercase">
                      {course.track}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${course.published ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {course.published ? (isRtl ? 'منشورة' : 'Published') : (isRtl ? 'مسودة' : 'Draft')}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base">
                    {isRtl ? course.titleAr : course.titleEn}
                  </h4>
                </div>

                <div className="pt-4 border-t border-slate-900 mt-4 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {course._count?.units || 0} {isRtl ? 'وحدات' : 'Units'}
                  </span>
                  <Link
                    href={`/${locale}/studio/course-builder/${course.id}`}
                    className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
                  >
                    <span>{isRtl ? 'تعديل المحتوى' : 'Edit Content'}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <p>{isRtl ? 'لم تقم بإنشاء أي دورات تعليمية بعد' : 'No courses created yet.'}</p>
            <Link
              href={`/${locale}/studio/course-builder/new`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إنشاء دورة جديدة الآن' : 'Create First Course'}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
