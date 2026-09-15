'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  DollarSign, 
  AlertTriangle, 
  UploadCloud, 
  GraduationCap, PenTool, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Plus, 
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  Users,
  Radio,
  PlayCircle
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
      const res = await fetch('/api/courses?studio=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
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
            <span>{isRtl ? 'Ø§Ø³ØªÙˆØ¯ÙŠÙˆ Ø§Ù„Ù…Ø¹Ù„Ù… 2.0' : 'Teacher Studio 2.0'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {isRtl ? 'Ù„ÙˆØ­Ø© ØªØ­ÙƒÙ… Ø§Ù„Ù…Ø¹Ù„Ù… ÙˆØ§Ù„Ø§Ø³ØªÙˆØ¯ÙŠÙˆ' : 'Teacher Studio Dashboard'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRtl
              ? 'Ù‚Ù… ÙˆØ¥Ø¯Ø§Ø±Ø© Ù…Ø­ØªÙˆÙ‰ Ø§Ù„Ø¯ÙˆØ±Ø§ØªØŒ Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„Ø£Ø±Ø¨Ø§Ø­ ÙˆØ§Ù„Ù†Ø³Ø¨ Ø§Ù„Ù…Ø§Ù„ÙŠØ©ØŒ ÙˆØ§ÙƒØªØ´Ø§Ù Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø£ÙƒØ«Ø± ØªØ¹Ø«Ø±Ø§Ù‹ Ù„Ø¯Ù‰ Ø·Ù„Ø§Ø¨Ùƒ'
              : 'Manage course content, track revenue share payouts, and identify student learning bottlenecks'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAiModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 transition-all w-fit"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? 'ØªÙˆÙ„ÙŠØ¯ Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ âœ¨' : 'AI Quiz Generator âœ¨'}</span>
          </button>

          <Link
            href={`/${locale}/admin/courses`}
            className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-sm font-bold transition-all w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>{isRtl ? 'Ø¥Ø¶Ø§ÙØ© Ø¯ÙˆØ±Ø© Ø¬Ø¯ÙŠØ¯Ø©' : 'Create Course'}</span>
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
          href={`/${locale}/admin/courses`}
          className="group bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-brand-500/10 text-brand-400 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                {isRtl ? 'Ù…Ù†Ø´Ø¦ ÙˆÙ…Ø­Ø±Ø± Ø§Ù„Ø¯ÙˆØ±Ø§Øª' : 'Course Builder'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'Ø¥Ø¶Ø§ÙØ© Ø§Ù„Ø¯Ø±ÙˆØ³ØŒ Ø§Ù„ÙÙŠØ¯ÙŠÙˆÙ‡Ø§ØªØŒ Ø§Ù„Ù…Ù„ÙØ§Øª ÙˆØ§Ù„ÙˆØ­Ø¯Ø§Øª Ø§Ù„Ø¯Ø±Ø§Ø³ÙŠØ©' : 'Manage units, lessons, videos, and PDFs'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¯ÙˆØ±Ø§Øª' : 'Manage Courses'}</span>
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
                {isRtl ? 'Ø±ÙØ¹ Ø¨Ù†Ùƒ Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø³Ø±ÙŠØ¹' : 'Bulk Quiz Uploader'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'Ø±ÙØ¹ Ù…Ø¦Ø§Øª Ø§Ù„Ø£Ø³Ø¦Ù„Ø© ÙˆØ§Ù„Ø§Ø®ØªØ¨Ø§Ø±Ø§Øª Ø¯ÙØ¹Ø© ÙˆØ§Ø­Ø¯Ø© Ø¨Ø­Ø±ÙƒØ© Ø³Ø±ÙŠØ¹Ø©' : 'Upload hundreds of quiz questions instantly'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'Ø±ÙØ¹ Ø¨Ù†Ùƒ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©' : 'Upload Quizzes'}</span>
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
                {isRtl ? 'Ø§Ù„Ù…Ø§Ù„ÙŠØ© ÙˆØªØªØ¨Ø¹ Ø§Ù„Ø£Ø±Ø¨Ø§Ø­' : 'Revenue & Financials'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'Ø¹Ø±Ø¶ ØµØ§ÙÙŠ Ø§Ù„Ø£Ø±Ø¨Ø§Ø­ØŒ Ù†Ø³Ø¨Ø© Ø§Ù„Ù…Ø¹Ù„Ù… Ù…Ù† Ø§Ù„Ù…Ø¨ÙŠØ¹Ø§Øª ÙˆØªÙ‚Ø§Ø±ÙŠØ± Ø§Ù„ÙƒÙˆØ¨ÙˆÙ†Ø§Øª' : 'Track net payouts, revenue share %, and coupon sales'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'Ø¹Ø±Ø¶ Ø§Ù„Ø£Ø±Ø¨Ø§Ø­ ÙˆØ§Ù„Ù†Ø³Ø¨Ø©' : 'View Financials'}</span>
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
                {isRtl ? 'Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„Ø£ÙƒØ«Ø± ØªØ¹Ø«Ø±Ø§Ù‹ Ù„Ù„Ø·Ù„Ø§Ø¨' : 'Student Bottlenecks'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'Ø§ÙƒØªØ´Ø§Ù Ø§Ù„Ø£Ø³Ø¦Ù„Ø© Ø§Ù„ØªÙŠ ÙˆØ§Ø¬Ù‡ Ø§Ù„Ø·Ù„Ø§Ø¨ ØµØ¹ÙˆØ¨Ø© Ø¨Ù‡Ø§ Ù„Ø¥Ø¶Ø§ÙØ© ÙÙŠØ¯ÙŠÙˆÙ‡Ø§Øª ØªÙˆØ¶ÙŠØ­ÙŠØ©' : 'Identify difficult questions & target re-explanations'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'ØªØ­Ù„ÙŠÙ„Ø§Øª Ø§Ù„ØªØ¹Ø«Ø±' : 'View Bottlenecks'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </Link>

        {/* Card 5: Infinite Whiteboard */}
        <Link
          href={`/${locale}/labs/whiteboard`}
          className="group bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                {isRtl ? 'السبورة اللانهائية' : 'Infinite Whiteboard'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'مساحة شرح وتدريس حرة مع إمكانية رفع ملفات PDF' : 'Free teaching space with PDF upload capability'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'افتح السبورة' : 'Open Whiteboard'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </Link>

        {/* Card 6: Direct Broadcast Announcements */}
        <Link
          href={`/${locale}/studio/broadcasts`}
          className="group bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 p-6 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="p-3.5 bg-purple-500/10 text-purple-400 rounded-2xl w-fit group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                {isRtl ? 'Ø¥Ø¹Ù„Ø§Ù†Ø§Øª ÙˆØªÙ†Ø¨ÙŠÙ‡Ø§Øª Ø§Ù„Ø·Ù„Ø§Ø¨' : 'Direct Broadcasts'}
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                {isRtl ? 'Ø¥Ø±Ø³Ø§Ù„ ØªÙ†Ø¨ÙŠÙ‡Ø§Øª ÙˆÙÙˆØ±ÙŠØ§Øª Ù…Ø¨Ø§Ø´Ø±Ø© Ù„Ù„Ø·Ù„Ø§Ø¨ Ø§Ù„Ù…Ø´ØªØ±ÙƒÙŠÙ† Ø¨Ø¯ÙˆØ±Ø§ØªÙƒ' : 'Send instant alerts & announcements to enrolled students'}
              </p>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-white">
            <span>{isRtl ? 'Ø¥Ø±Ø³Ø§Ù„ Ø¥Ø¹Ù„Ø§Ù†' : 'Broadcast Now'}</span>
            {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </div>
        </Link>
      </div>

      {/* Courses Overview Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            {isRtl ? 'Ø¯ÙˆØ±Ø§ØªÙƒ Ø§Ù„ØªØ¹Ù„ÙŠÙ…ÙŠØ© Ø§Ù„Ø­Ø§Ù„ÙŠØ©' : 'Your Active Courses'}
          </h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
            {courses.length} {isRtl ? 'Ø¯ÙˆØ±Ø©' : 'Courses'}
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
                      {course.published ? (isRtl ? 'Ù…Ù†Ø´ÙˆØ±Ø©' : 'Published') : (isRtl ? 'Ù…Ø³ÙˆØ¯Ø©' : 'Draft')}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base">
                    {isRtl ? course.titleAr : course.titleEn}
                  </h4>
                </div>

                <div className="pt-4 border-t border-slate-900 mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400">
                    {course._count?.units || 0} {isRtl ? 'ÙˆØ­Ø¯Ø§Øª' : 'Units'}
                  </span>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/${locale}/courses/${course.id}`}
                      target="_blank"
                      className="text-slate-400 hover:text-white font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      <span>{isRtl ? 'Ù…Ø¹Ø§ÙŠÙ†Ø© ÙƒØ·Ø§Ù„Ø¨' : 'Preview'}</span>
                    </Link>
                    <Link
                      href={`/${locale}/admin/courses`}
                      className="text-brand-400 hover:text-brand-300 font-bold flex items-center gap-1"
                    >
                      <span>{isRtl ? 'ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ø­ØªÙˆÙ‰' : 'Edit Content'}</span>
                      {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-500 space-y-3">
            <p>{isRtl ? 'Ù„Ù… ØªÙ‚Ù… Ø¨Ø¥Ù†Ø´Ø§Ø¡ Ø£ÙŠ Ø¯ÙˆØ±Ø§Øª ØªØ¹Ù„ÙŠÙ…ÙŠØ© Ø¨Ø¹Ø¯' : 'No courses created yet.'}</p>
            <Link
              href={`/${locale}/admin/courses`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'Ø¥Ù†Ø´Ø§Ø¡ Ø¯ÙˆØ±Ø© Ø¬Ø¯ÙŠØ¯Ø© Ø§Ù„Ø¢Ù†' : 'Create First Course'}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
