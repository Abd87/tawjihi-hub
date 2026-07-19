'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { 
  PlayCircle, 
  FileText, 
  Star, 
  Lock, 
  CheckCircle2, 
  Award, AlertOctagon, FileCheck, PlaySquare, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  BookOpen,
  Calendar,
  Video,
  Download,
  ChevronDown,
  ChevronUp,
  Trophy,
  Circle,
  ClipboardList,
  MessageCircle
} from 'lucide-react';
import CourseUnlockModal from '@/components/CourseUnlockModal';
import Link from 'next/link';
import VocabCoursePlayer from '@/components/VocabCoursePlayer';

interface InlineQuestion {
  id: string;
  textAr: string;
  textEn: string;
  choices: { textAr: string; textEn: string; isCorrect: boolean }[];
  explanationAr: string;
  explanationEn: string;
}

interface Lesson {
  id: string;
  titleAr: string;
  titleEn: string;
  videoUrl: string;
  pdfUrl?: string;
  durationMinutes: number;
  order: number;
  locked: boolean;
  questions?: InlineQuestion[];
}

interface LiveSession {
  id: string;
  titleAr: string;
  titleEn: string;
  zoomLink: string;
  startTime: string;
  durationMinutes: number;
}

interface Exam {
  id: string;
  titleAr: string;
  titleEn: string;
  pdfUrl: string;
}

interface Unit {
  id: string;
  titleAr: string;
  titleEn: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  track: 'BTEC' | 'ACADEMIC';
  semester?: 1 | 2;
  subjectAr: string;
  subjectEn: string;
  teacherNameAr: string;
  teacherNameEn: string;
  thumbnailUrl: string;
  coverImage?: string;
  published: boolean;
  locked: boolean;
  units: Unit[];
  lessons: Lesson[]; // Flat array maintained for backward compatibility in progress calculations
  liveSessions?: LiveSession[];
  exams?: Exam[];
  quizzes?: any[];
}

export default function CourseSyllabusPage() {
  const t = useTranslations('courses');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const courseId = params?.id as string;
  const isRtl = locale === 'ar';

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [lastVisitedRoute, setLastVisitedRoute] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);


  // Sync progress from backend
  const syncProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`/api/progress?courseId=${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCompletedItems(data.items || []);
        
        // Update local cache as well just in case
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userId = JSON.parse(userStr).id;
          localStorage.setItem(`completed-items-${userId}-${courseId}`, JSON.stringify(data.items || []));
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    const handleFocus = () => {
      syncProgress();
    };
    window.addEventListener('focus', handleFocus);
    handleFocus(); // run once on mount
    return () => window.removeEventListener('focus', handleFocus);
  }, [courseId]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (!token || !userStr) {
          router.replace('/login');
          return;
        }
        
        setAuthorized(true);

        const res = await fetch(`/api/courses/${courseId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const found = await res.json();
          setCourse(found);
          
          // Initial load from cache to prevent flicker, then sync
          const userId = userStr ? JSON.parse(userStr).id : '';
          const completed = localStorage.getItem(`completed-items-${userId}-${courseId}`);
          if (completed) {
            setCompletedItems(JSON.parse(completed));
          }
          
          const lastVisited = localStorage.getItem(`last-visited-route-${userId}-${courseId}`);
          if (lastVisited) {
            setLastVisitedRoute(lastVisited);
          }

          syncProgress();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, router]);

  const handlePdfClick = (lessonId: string) => {
    if (course?.locked) return;
    const userStr = localStorage.getItem('user');
    const userId = userStr ? JSON.parse(userStr).id : 'guest';
    const itemKey = `completed-items-${userId}-${courseId}`;
    const pdfItem = `${lessonId}-pdf`;
    
    if (!completedItems.includes(pdfItem)) {
      const newItems = [...completedItems, pdfItem];
      setCompletedItems(newItems);
      localStorage.setItem(itemKey, JSON.stringify(newItems));
      
      // Save to backend
      const token = localStorage.getItem('token');
      if (token) {
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId, itemId: pdfItem })
        }).catch(e => console.error(e));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
        <span>{isRtl ? 'جاري تحميل خطة المادة...' : 'Loading Syllabus...'}</span>
      </div>
    );
  }

  // Intercept Vocab BTEC Course
  if (courseId === 'vocab-btec') {
    return <VocabCoursePlayer course={course} />;
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400 p-6">
        <h3 className="text-lg font-bold text-slate-200">Course Not Found</h3>
        <Link href="/dashboard" className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-xl text-sm font-semibold">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Course lock gate
  if (course.locked) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-center px-4">
        <CourseUnlockModal 
          isOpen={true} 
          onClose={() => router.push('/dashboard')} 
          courseTitleAr={course.titleAr}
          courseTitleEn={course.titleEn}
          isRtl={isRtl}
        />
      </div>
    );
  }

  const courseTitle = isRtl ? course.titleAr : course.titleEn;
  const courseDesc = isRtl ? course.descriptionAr : course.descriptionEn;

  // Calculate mastery
  let totalItems = 0;
  course.lessons.forEach(l => {
    if (l.videoUrl) totalItems++;
    if (l.pdfUrl) totalItems++;
    if (l.questions && l.questions.length > 0) totalItems++;
  });
  const masteredItems = completedItems.length;
  const progressPercent = totalItems > 0 ? Math.round((masteredItems / totalItems) * 100) : 0;

  // Find first uncompleted lesson for "Up Next"
  const upNextLesson = course.lessons.find(l => {
    const vidKey = `${l.id}-video`;
    const pracKey = `${l.id}-practice`;
    const hasVid = !!l.videoUrl;
    const hasPrac = l.questions && l.questions.length > 0;
    
    if (hasVid && !completedItems.includes(vidKey)) return true;
    if (hasPrac && !completedItems.includes(pracKey)) return true;
    return false;
  }) || course.lessons[0];

  const calculatedUpNextLink = upNextLesson 
    ? (!completedItems.includes(`${upNextLesson.id}-video`) && upNextLesson.videoUrl
        ? `/${locale}/courses/${courseId}/video/${upNextLesson.id}`
        : `/${locale}/courses/${courseId}/practice/${upNextLesson.id}`)
    : '#';

  const upNextLink = lastVisitedRoute || calculatedUpNextLink;

  return (
    <div className="min-h-screen bg-[#020617] pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/50 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800/50 hover:border-slate-700 w-fit">
            <ArrowLeft className={`h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
            <span className="font-semibold">{isRtl ? 'العودة للوحة التحكم' : 'Back to Dashboard'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT SIDEBAR: Mastery & Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/20">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
                {courseTitle}
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                {courseDesc || (isRtl ? 'لا يوجد وصف متاح.' : 'No description available.')}
              </p>

              {/* Progress Bar */}
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isRtl ? 'إتقان المادة' : 'Course Mastery'}
                  </span>
                  <span className="text-lg font-black text-brand-500">{progressPercent}%</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-500 to-amber-500 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 text-center">
                  {masteredItems} {isRtl ? 'من' : 'out of'} {totalItems} {isRtl ? 'دروس مكتملة' : 'items mastered'}
                </p>
              </div>

              {/* Up Next Button */}
              {totalItems > 0 && progressPercent < 100 && (
                <Link 
                  href={upNextLink}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-500/25 group"
                >
                  <PlayCircle className="h-5 w-5" />
                  <span>{isRtl ? 'متابعة التعلم' : 'Up Next'}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </Link>
              )}
              <Link 
                href={`/${locale}/courses/${courseId}/mistakes`}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/50 font-bold rounded-2xl transition-all group"
              >
                <AlertOctagon className="h-5 w-5" />
                <span>{isRtl ? 'بنك الأخطاء' : 'Mistakes Bank'}</span>
                {isRtl ? <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </Link>
              {course.discussionGroupLink && (
                <a 
                  href={course.discussionGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 hover:border-[#25D366]/50 font-bold rounded-2xl transition-all group"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>{isRtl ? 'مجموعة النقاش' : 'Discussion Group'}</span>
                  {isRtl ? <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> : <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </a>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR: Syllabus List */}
          <div className="lg:col-span-8">
            {/* Live Classes Section */}
            {course.liveSessions && course.liveSessions.length > 0 && (
              <div className="mb-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
                    <Video className="h-6 w-6 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-black text-white">
                    {isRtl ? 'الجلسات المباشرة (Zoom)' : 'Live Classes (Zoom)'}
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {course.liveSessions.map((session, idx) => (
                    <div key={session.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors hover:border-slate-700 relative overflow-hidden">
                      <div className="absolute top-0 start-0 w-1 h-full bg-blue-500"></div>
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-bold text-white">
                          {isRtl ? session.titleAr : session.titleEn}
                        </h3>
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                          <span className="flex items-center gap-1.5 text-blue-400">
                            <Calendar className="h-4 w-4" />
                            {new Date(session.startTime).toLocaleString(isRtl ? 'ar-JO' : 'en-US', {
                              weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                            })}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500">
                            {session.durationMinutes} {isRtl ? 'دقيقة' : 'mins'}
                          </span>
                        </div>
                      </div>
                      <a href={session.zoomLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                        <Video className="h-4 w-4" />
                        {isRtl ? 'انضمام عبر Zoom' : 'Join via Zoom'}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6 flex items-center gap-3">
              <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30">
                <FileText className="h-6 w-6 text-brand-500" />
              </div>
              <h2 className="text-xl font-black text-white">
                {isRtl ? 'خطة المادة' : 'Recorded Syllabus'}
              </h2>
            </div>

            <div className="space-y-6">
              {course.units && course.units.map((unit, unitIdx) => {
                const isExpanded = expandedUnits.includes(unit.id);
                
                return (
                  <div key={unit.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
                    {/* Unit Header */}
                    <button 
                      onClick={() => {
                        setExpandedUnits(prev => 
                          prev.includes(unit.id) ? prev.filter(id => id !== unit.id) : [...prev, unit.id]
                        );
                      }}
                      className="w-full px-6 py-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between hover:bg-slate-800/80 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-lg font-bold text-brand-500">
                          {unitIdx + 1}
                        </div>
                        <div className="text-start">
                          <h3 className="text-xl font-bold text-white">
                            {isRtl ? unit.titleAr : unit.titleEn}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1">
                            {unit.lessons.length} {isRtl ? 'دروس' : 'lessons'}
                          </p>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-6 w-6 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-slate-400" />
                      )}
                    </button>

                    {/* Lessons List (Collapsible) */}
                    {isExpanded && (
                      <div className="divide-y divide-slate-800/50 bg-slate-900/30">
                        {unit.lessons.map((lesson, lessonIdx) => {
                          const isLessonLocked = lesson.locked;
                          
                          return (
                            <div key={lesson.id} className="pl-6 pr-4 py-2 relative">
                              <div className="absolute top-0 start-4 w-px h-full bg-slate-800"></div>
                              {/* Lesson Sub-header */}
                              <div className="px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 relative z-10">
                                    {lessonIdx + 1}
                                  </div>
                                  <h4 className="text-md font-bold text-slate-200">
                                    {isRtl ? lesson.titleAr : lesson.titleEn}
                                  </h4>
                                </div>
                                {isLessonLocked && <Lock className="h-4 w-4 text-slate-500" />}
                              </div>

                              {/* Lesson Items */}
                              <div className="ps-8 pe-2 pb-4 space-y-2">
                                {/* 1. Video Item */}
                                {lesson.videoUrl && (
                                  <Link 
                                    href={isLessonLocked ? '#' : `/${locale}/courses/${courseId}/video/${lesson.id}`}
                                    onClick={isLessonLocked ? (e) => { e.preventDefault(); setShowUnlockModal(true); } : undefined}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors bg-slate-900/50 border border-slate-800 hover:border-slate-700 ${
                                      isLessonLocked ? 'cursor-pointer' : 'hover:bg-slate-800/80'
                                    }`}
                                  >
                                    <div className={`shrink-0 ${completedItems.includes(`${lesson.id}-video`) ? 'text-emerald-500' : 'text-brand-500'}`}>
                                      {completedItems.includes(`${lesson.id}-video`) ? (
                                        <div className="relative">
                                          <PlaySquare className="h-5 w-5" />
                                          
                                        </div>
                                      ) : <PlayCircle className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className={`font-semibold text-sm ${completedItems.includes(`${lesson.id}-video`) ? 'text-slate-300' : 'text-blue-400'}`}>
                                        {isRtl ? 'فيديو الشرح' : 'Instructional Video'}
                                      </h5>
                                      <p className="text-xs text-slate-500 mt-0.5">{lesson.durationMinutes} {isRtl ? 'دقيقة' : 'minutes'}</p>
                                    </div>
                                    <div className="shrink-0 ms-auto">
                                      {completedItems.includes(`${lesson.id}-video`) ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-slate-700 hover:text-slate-600 transition-colors" />}
                                    </div>
                                  </Link>
                                )}

                                {/* 2. PDF Item */}
                                {lesson.pdfUrl && (
                                  <a 
                                    href={isLessonLocked ? '#' : lesson.pdfUrl}
                                    target={isLessonLocked ? '_self' : '_blank'}
                                    rel="noreferrer"
                                    onClick={isLessonLocked ? (e) => { e.preventDefault(); setShowUnlockModal(true); } : () => handlePdfClick(lesson.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors bg-slate-900/50 border border-slate-800 hover:border-slate-700 ${
                                      isLessonLocked ? 'cursor-pointer' : 'hover:bg-slate-800/80'
                                    }`}
                                  >
                                    <div className={`shrink-0 ${completedItems.includes(`${lesson.id}-pdf`) ? 'text-emerald-500' : 'text-slate-400'}`}>
                                      {completedItems.includes(`${lesson.id}-pdf`) ? (
                                        <div className="relative">
                                          <FileCheck className="h-5 w-5 text-emerald-500" />
                                          
                                        </div>
                                      ) : <FileText className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className={`font-semibold text-sm ${completedItems.includes(`${lesson.id}-pdf`) ? 'text-slate-300' : 'text-slate-300'}`}>
                                        {isRtl ? 'ملف المادة (PDF)' : 'Study Material (PDF)'}
                                      </h5>
                                    </div>
                                    <div className="shrink-0 ms-auto">
                                      {completedItems.includes(`${lesson.id}-pdf`) ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-slate-700 hover:text-slate-600 transition-colors" />}
                                    </div>
                                  </a>
                                )}

                                {/* 3. Practice Item */}
                                {lesson.questions && lesson.questions.length > 0 && (
                                  <Link 
                                    href={isLessonLocked ? '#' : `/${locale}/courses/${courseId}/practice/${lesson.id}`}
                                    onClick={isLessonLocked ? (e) => { e.preventDefault(); setShowUnlockModal(true); } : undefined}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors bg-slate-900/50 border border-slate-800 hover:border-slate-700 ${
                                      isLessonLocked ? 'cursor-pointer' : 'hover:bg-slate-800/80'
                                    }`}
                                  >
                                    <div className={`shrink-0 ${completedItems.includes(`${lesson.id}-practice`) ? 'text-emerald-500' : 'text-amber-500'}`}>
                                      {completedItems.includes(`${lesson.id}-practice`) ? (
                                        <div className="relative">
                                          <Trophy className="h-5 w-5 text-emerald-500" />
                                          
                                        </div>
                                      ) : <Star className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className={`font-semibold text-sm ${completedItems.includes(`${lesson.id}-practice`) ? 'text-slate-300' : 'text-amber-400'}`}>
                                        {isRtl ? 'تمرين تفاعلي' : 'Practice Exercise'}
                                      </h5>
                                      <p className="text-xs text-slate-500 mt-0.5">
                                        {lesson.questions.length} {isRtl ? 'أسئلة' : 'questions'}
                                      </p>
                                    </div>
                                    <div className="shrink-0 ms-auto">
                                      {completedItems.includes(`${lesson.id}-practice`) ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-slate-700 hover:text-slate-600 transition-colors" />}
                                    </div>
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quizzes Section */}
            {course.quizzes && course.quizzes.length > 0 && (
              <div className="mt-10 mb-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30">
                    <ClipboardList className="h-6 w-6 text-brand-400" />
                  </div>
                  <h2 className="text-xl font-black text-white">
                    {isRtl ? 'الاختبارات الإلكترونية' : 'Digital Quizzes'}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.quizzes.map((quiz: any) => (
                    <Link 
                      key={quiz.id}
                      href={`/${locale}/quizzes/${quiz.id}`}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4 hover:bg-slate-800/80 hover:border-brand-500/50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 group-hover:border-brand-500/50 transition-colors">
                          <ClipboardList className="h-5 w-5 text-brand-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white line-clamp-1">
                            {isRtl ? quiz.titleAr : quiz.titleEn}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 font-semibold">
                            {quiz.durationMinutes} {isRtl ? 'دقيقة' : 'Minutes'} • {quiz.cefrLevel}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className={`h-5 w-5 text-slate-500 group-hover:text-brand-400 transition-colors shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Exams Section */}
            {course.exams && course.exams.length > 0 && (
              <div className="mt-10 mb-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="p-2.5 bg-rose-500/20 rounded-xl border border-rose-500/30">
                    <FileText className="h-6 w-6 text-rose-400" />
                  </div>
                  <h2 className="text-xl font-black text-white">
                    {isRtl ? 'ملفات وامتحانات (PDF)' : 'PDF Exams & Resources'}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {course.exams.map((exam: any) => (
                    <a 
                      key={exam.id}
                      href={exam.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4 hover:bg-slate-800/80 hover:border-slate-700 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 group-hover:border-rose-500/50 transition-colors">
                          <FileText className="h-5 w-5 text-rose-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white line-clamp-1">
                            {isRtl ? exam.titleAr : exam.titleEn}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1 font-semibold">
                            {isRtl ? 'انقر للتحميل' : 'Click to download'}
                          </p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-slate-500 group-hover:text-rose-400 transition-colors shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <CourseUnlockModal 
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        courseTitleAr={course.titleAr}
        courseTitleEn={course.titleEn}
        isRtl={isRtl}
      />
    </div>
  );
}
