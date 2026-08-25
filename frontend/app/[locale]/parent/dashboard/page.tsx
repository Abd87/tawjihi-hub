'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart2,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Globe,
  Loader2,
  AlertCircle,
  Eye,
  TrendingUp,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface LessonItem {
  id: string;
  titleAr: string;
  titleEn: string;
  videoUrl: string;
  pdfUrl: string;
  durationMinutes: number;
  order: number;
  locked: boolean;
}

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  track: 'BTEC' | 'ACADEMIC';
  semester: 1 | 2;
  subjectAr: string;
  subjectEn: string;
  teacherNameAr: string;
  teacherNameEn: string;
  thumbnailUrl: string;
  lessons: LessonItem[];
  published: boolean;
  locked: boolean;
  createdAt: string;
}

interface StudentUser {
  id: string;
  email: string;
  role: string;
  nameAr: string;
  nameEn?: string;
  trackType?: 'BTEC' | 'ACADEMIC';
}

interface ParentUser {
  id: string;
  email: string;
  role: string;
  nameAr: string;
  nameEn?: string;
  linkedStudentEmail?: string;
}

interface QuizAttempt {
  courseTitle: string;
  score: number;
  maxScore: number;
  date: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function ls<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function calcProgress(course: Course, completedLessonIds: string[]): number {
  if (!course?.lessons?.length) return 0;
  const done = course.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
  return Math.round((done / course.lessons.length) * 100);
}

// ---------------------------------------------------------------------------
// Parent Dashboard Page
// ---------------------------------------------------------------------------
export default function ParentDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isAr = locale === 'ar';

  const [loaded, setLoaded] = useState(false);
  const [parent, setParent] = useState<ParentUser | null>(null);
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  const toggleLanguage = () => {
    const next = locale === 'ar' ? 'en' : 'ar';
    router.replace('/parent/dashboard', { locale: next });
  };

  useEffect(() => {
    // Auth guard
    const raw = localStorage.getItem('user');
    if (!raw) {
      window.location.href = `/${locale}/login`;
      return;
    }
    let u: ParentUser;
    try {
      u = JSON.parse(raw);
    } catch {
      window.location.href = `/${locale}/login`;
      return;
    }

    if (u.role !== 'PARENT') {
      // Redirect based on role
      if (u.role === 'TEACHER') {
        window.location.href = `/${locale}/admin/courses`;
      } else {
        window.location.href = `/${locale}/dashboard`;
      }
      return;
    }

    setParent(u);

    // Find linked student
    const linkedEmail = u.linkedStudentEmail?.toLowerCase();
    let foundStudent: StudentUser | null = null;
    if (linkedEmail) {
      const allUsers = ls<Array<Record<string, unknown>>>('admin-users', []);
      const match = allUsers.find(
        (au) => au && (au.email as string)?.toLowerCase() === linkedEmail && au.role === 'STUDENT'
      );
      if (match) {
        foundStudent = {
          id: match.id as string,
          email: match.email as string,
          role: match.role as string,
          nameAr: match.nameAr as string,
          nameEn: match.nameEn as string | undefined,
          trackType: match.trackType as 'BTEC' | 'ACADEMIC' | undefined,
        };
      }
    }
    setStudent(foundStudent);

    // Load courses
    if (foundStudent) {
      const allCourses = ls<Course[]>('admin-courses', []);
      const studentCourses = allCourses.filter(
        (c) => c.published && (!foundStudent!.trackType || c.track === foundStudent!.trackType)
      );
      setCourses(studentCourses);

      // Progress
      const progKey = `student-progress-${foundStudent.id}`;
      setCompletedIds(ls<string[]>(progKey, []));

      // Quiz attempts
      const quizKey = `quiz-attempts-${foundStudent.id}`;
      setQuizAttempts(ls<QuizAttempt[]>(quizKey, []));
    }

    setLoaded(true);
  }, [locale]);

  // ── Loading ──
  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-teal-500 animate-spin" />
      </div>
    );
  }

  // ── Stats ──
  const enrolledCount = courses.length;
  const overallProgress =
    courses.length === 0
      ? 0
      : Math.round(
          courses.reduce((sum, c) => sum + calcProgress(c, completedIds), 0) / courses.length
        );

  const passScore = (a: QuizAttempt) => Math.round((a.score / a.maxScore) * 100) >= 60;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-[#020617] text-white overflow-x-hidden">
      {/* Background blurs */}
      <div className="fixed top-[-15%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-teal-500/5 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-15%] end-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/5 blur-[130px] pointer-events-none" />



      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-10 space-y-10">

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/20">
              <Users className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {isAr ? 'لوحة تحكم ولي الأمر' : 'Parent Dashboard'}
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                {isAr ? 'تابع تقدم أبنائك الأكاديمي' : 'Track your students academic progress'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/settings"
              className="flex items-center gap-2 px-4 py-3 sm:p-4.5 bg-slate-950/80 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900 rounded-2xl transition-all shadow-sm"
              title={isAr ? 'الإعدادات' : 'Settings'}
            >
              <Settings className="h-5 w-5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* ── No student found ── */}
        {!student && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">
              {isAr ? 'لم يتم العثور على الطالب المرتبط' : 'Linked student not found'}
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              {isAr
                ? 'تأكد من أن البريد الإلكتروني للطالب مسجّل في النظام ومطابق للحساب المرتبط.'
                : 'Make sure the student email is registered and matches the linked account.'}
            </p>
            <p className="text-xs text-slate-600">
              {isAr ? 'البريد المرتبط:' : 'Linked email:'}{' '}
              <span className="text-slate-400 font-mono">{parent?.linkedStudentEmail || '—'}</span>
            </p>
          </div>
        )}

        {/* ── Student profile card ── */}
        {student && (
          <div className="relative rounded-2xl border border-teal-500/20 bg-gradient-to-br from-teal-900/20 to-slate-900/40 backdrop-blur-sm p-6 overflow-hidden">
            <div className="absolute top-0 end-0 w-48 h-48 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white text-2xl font-bold shrink-0">
                {(student?.nameAr || student?.nameEn || 'S').charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    {isAr ? (student?.nameAr || 'طالب') : (student?.nameEn || student?.nameAr || 'Student')}
                  </h2>
                  {student.trackType && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      student.trackType === 'ACADEMIC'
                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                        : 'bg-brand-500/15 text-brand-400 border border-brand-500/20'
                    }`}>
                      {student.trackType === 'ACADEMIC'
                        ? (isAr ? 'علمي' : 'Academic')
                        : (isAr ? 'مهني (BTEC)' : 'BTEC')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-400">{student.email}</p>
              </div>

              {/* Quick stats */}
              <div className="flex gap-4 shrink-0">
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-teal-400">{enrolledCount}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{isAr ? 'مقررات' : 'Courses'}</div>
                </div>
                <div className="w-px bg-slate-800" />
                <div className="text-center">
                  <div className="text-2xl font-extrabold text-cyan-400">{overallProgress}%</div>
                  <div className="text-xs text-slate-500 mt-0.5">{isAr ? 'تقدم كلي' : 'Progress'}</div>
                </div>
                <div className="w-px bg-slate-800" />
                <button
                  onClick={() => {
                    const text = encodeURIComponent(
                      isAr
                        ? `تقرير التقدم الأكاديمي للطالب/ة ${student.nameAr}: أنجز ${overallProgress}% من مادتين في منصة توجيهي هب.`
                        : `Academic progress update for student ${student.nameAr}: ${overallProgress}% completed on Tawjihi Hub.`
                    );
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold transition-all self-center"
                  title={isAr ? 'مشاركة التقرير عبر واتساب' : 'Share Progress Report'}
                >
                  <span>{isAr ? 'مشاركة التقرير' : 'Share Report'}</span>
                </button>
              </div>
            </div>

            {/* Overall progress ring (replaces bar) */}
            <div className="hidden sm:block absolute -end-6 -bottom-10 opacity-20 pointer-events-none">
              <svg className="w-64 h-64" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-teal-500" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * overallProgress) / 100} />
              </svg>
            </div>
          </div>
        )}

        {/* ── Actionable Insights / Recommendations ── */}
        {student && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
               <AlertCircle className="h-5 w-5 text-amber-400" />
               {isAr ? 'توصيات وملاحظات' : 'Recommendations'}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {overallProgress < 20 && courses.length > 0 ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 border-s-4 border-s-amber-500">
                  <p className="text-sm font-semibold text-white mb-1">{isAr ? 'تحفيز إضافي مطلوب' : 'Extra motivation needed'}</p>
                  <p className="text-xs text-slate-400">{isAr ? 'الطالب في بداية رحلته، يحتاج للتشجيع للبدء في إنهاء الدروس.' : 'Student is just starting out. Needs encouragement to begin lessons.'}</p>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 border-s-4 border-s-teal-500">
                  <p className="text-sm font-semibold text-white mb-1">{isAr ? 'تقدم ممتاز' : 'Great Progress'}</p>
                  <p className="text-xs text-slate-400">{isAr ? 'الطالب مستمر في حضور الدروس بشكل جيد.' : 'The student is consistently taking lessons.'}</p>
                </div>
              )}
              {quizAttempts.some(a => (a.score / a.maxScore) < 0.6) && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 border-s-4 border-s-red-500">
                  <p className="text-sm font-semibold text-white mb-1">{isAr ? 'مراجعة للاختبارات' : 'Review Quizzes'}</p>
                  <p className="text-xs text-slate-400">{isAr ? 'بعض الاختبارات درجاتها منخفضة. يرجى متابعة دراسة بنك الأخطاء.' : 'Some quiz scores are low. Please review the mistake bank.'}</p>
                </div>
              )}
              {quizAttempts.length > 0 && quizAttempts.some(a => (a.score / a.maxScore) > 0.9) && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 border-s-4 border-s-blue-500">
                  <p className="text-sm font-semibold text-white mb-1">{isAr ? 'أداء مبهر في الاختبارات' : 'Impressive Quiz Performance'}</p>
                  <p className="text-xs text-slate-400">{isAr ? 'حصل الطالب على درجات عالية في اختباراته الأخيرة.' : 'The student achieved high marks in recent quizzes.'}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Course Progress Grid ── */}
        {student && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <BookOpen className="h-5 w-5 text-teal-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isAr ? 'تقدم المقررات الدراسية' : 'Course Progress'}
              </h2>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-10 text-center">
                <BookOpen className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  {isAr ? 'لا توجد مقررات منشورة حتى الآن' : 'No published courses available yet'}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => {
                  const prog = calcProgress(course, completedIds);
                  const completedLessons = course.lessons.filter((l) =>
                    completedIds.includes(l.id)
                  ).length;

                  return (
                    <div
                      key={course.id}
                      className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm p-5 hover:border-teal-800/50 transition-all"
                    >
                      {/* Subject badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5">
                            {isAr ? course.subjectAr : course.subjectEn}
                          </p>
                          <h3 className="text-sm font-bold text-white leading-snug">
                            {isAr ? course.titleAr : course.titleEn}
                          </h3>
                        </div>
                        <span className={`shrink-0 ms-2 px-1.5 py-0.5 rounded text-xs font-bold ${
                          course.track === 'ACADEMIC'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-brand-500/10 text-brand-400'
                        }`}>
                          {course.track === 'ACADEMIC' ? (isAr ? 'علمي' : 'Acad') : 'BTEC'}
                        </span>
                      </div>

                      {/* Teacher */}
                      <p className="text-xs text-slate-600 mb-3">
                        {isAr ? course.teacherNameAr : course.teacherNameEn}
                      </p>

                      {/* Progress bar */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>
                            {completedLessons}/{course.lessons.length}{' '}
                            {isAr ? 'درس' : 'lessons'}
                          </span>
                          <span className="font-bold text-teal-400">{prog}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full transition-all duration-500"
                            style={{ width: `${prog}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ── Quiz Scores Table ── */}
        {student && (
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isAr ? 'نتائج الاختبارات' : 'Quiz Results'}
              </h2>
            </div>

            {quizAttempts.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-10 text-center">
                <BarChart2 className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">
                  {isAr ? 'لا توجد نتائج اختبارات حتى الآن' : 'No quiz results yet'}
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60">
                      <th className="text-start text-xs font-semibold text-slate-400 px-5 py-3">
                        {isAr ? 'المقرر' : 'Course'}
                      </th>
                      <th className="text-center text-xs font-semibold text-slate-400 px-4 py-3">
                        {isAr ? 'الدرجة' : 'Score'}
                      </th>
                      <th className="text-center text-xs font-semibold text-slate-400 px-4 py-3">
                        {isAr ? 'النسبة' : '%'}
                      </th>
                      <th className="text-center text-xs font-semibold text-slate-400 px-4 py-3">
                        {isAr ? 'الحالة' : 'Status'}
                      </th>
                      <th className="text-start text-xs font-semibold text-slate-400 px-5 py-3">
                        {isAr ? 'التاريخ' : 'Date'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizAttempts.map((attempt, i) => {
                      const pct = Math.round((attempt.score / attempt.maxScore) * 100);
                      const passed = passScore(attempt);
                      return (
                        <tr
                          key={i}
                          className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors"
                        >
                          <td className="px-5 py-3.5 text-white text-sm font-medium">
                            {attempt.courseTitle}
                          </td>
                          <td className="px-4 py-3.5 text-center text-slate-300 font-mono text-sm">
                            {attempt.score}/{attempt.maxScore}
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <span className={`font-bold ${
                              pct >= 80 ? 'text-emerald-400' :
                              pct >= 60 ? 'text-amber-400' :
                              'text-rose-400'
                            }`}>
                              {pct}%
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            {passed ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                                <CheckCircle className="h-3 w-3" />
                                {isAr ? 'ناجح' : 'Pass'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                                <XCircle className="h-3 w-3" />
                                {isAr ? 'راسب' : 'Fail'}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 text-xs">
                            {new Date(attempt.date).toLocaleDateString(isAr ? 'ar-JO' : 'en-GB', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── Summary stats row (when student found) ── */}
        {student && quizAttempts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: <Trophy className="h-5 w-5" />,
                color: 'teal',
                label: isAr ? 'إجمالي الاختبارات' : 'Total Quizzes',
                value: quizAttempts.length,
              },
              {
                icon: <CheckCircle className="h-5 w-5" />,
                color: 'emerald',
                label: isAr ? 'ناجح' : 'Passed',
                value: quizAttempts.filter(passScore).length,
              },
              {
                icon: <TrendingUp className="h-5 w-5" />,
                color: 'cyan',
                label: isAr ? 'متوسط النسبة' : 'Avg Score',
                value:
                  Math.round(
                    quizAttempts.reduce(
                      (s, a) => s + (a.score / a.maxScore) * 100,
                      0
                    ) / quizAttempts.length
                  ) + '%',
              },
              {
                icon: <BookOpen className="h-5 w-5" />,
                color: 'cyan',
                label: isAr ? 'مقررات مسجّل بها' : 'Enrolled',
                value: enrolledCount,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-2xl border border-${stat.color}-500/20 bg-${stat.color}-500/5 p-5 flex flex-col gap-2`}
              >
                <div className={`text-${stat.color}-400`}>{stat.icon}</div>
                <div className={`text-2xl font-extrabold text-${stat.color}-400`}>{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between text-xs text-slate-600">
          <span>© 2025 Tawjihi Hub</span>
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 hover:text-slate-400 transition-colors"
          >
            {isAr ? (
              <>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                <span>الرئيسية</span>
              </>
            ) : (
              <>
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Home</span>
              </>
            )}
          </Link>
        </div>
      </footer>
    </div>
  );
}
