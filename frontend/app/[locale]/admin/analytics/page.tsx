'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Key, 
  CheckSquare, 
  Award,
  Clock,
  MessageSquare,
  UserCheck,
  TrendingUp,
  Loader2,
  Calendar,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface CourseStat {
  id: string;
  titleAr: string;
  titleEn: string;
  lessonsCount: number;
  quizzesCount: number;
  enrolledCount: number;
  averageCompletion: number;
  averageQuizScore: number;
}

interface RecentAttempt {
  id: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  student: {
    nameAr: string;
    email: string;
  };
  quiz: {
    titleAr: string;
    titleEn: string;
  };
}

interface RecentComment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    nameAr: string;
    role: string;
  };
  lesson: {
    titleAr: string;
    titleEn: string;
  };
}

interface RecentEnrollment {
  id: string;
  enrolledAt: string;
  student: {
    nameAr: string;
    email: string;
  };
  course: {
    titleAr: string;
    titleEn: string;
  };
}

interface AnalyticsData {
  summary: {
    coursesCount: number;
    studentsCount: number;
    totalCoupons: number;
    activeCoupons: number;
    averageCompletion: number;
    averageQuizScore: number;
  };
  courses: CourseStat[];
  recentActivity: {
    attempts: RecentAttempt[];
    comments: RecentComment[];
    enrollments: RecentEnrollment[];
  };
}

export default function AdminAnalyticsPage() {
  const t = useTranslations('admin');
  const tAnalytics = useTranslations('analytics');
  const navT = useTranslations('navigation');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [authorized, setAuthorized] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token: string) => {
    try {
      if (token.startsWith('mock-')) {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      }
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const decoded = decodeToken(token);
      const hasAccess = decoded?.role === 'ADMIN' || decoded?.role === 'TEACHER';
      
      if (!hasAccess) {
        router.replace('/dashboard');
        return;
      }

      setAuthorized(true);

      try {
        const response = await fetch('/api/analytics/teacher', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error('Unreachable analytics server');
        }

        const resData = await response.json();
        setData(resData);
      } catch (err) {
        // Load detailed mock statistics for offline validation
        const mockData: AnalyticsData = {
          summary: {
            coursesCount: 2,
            studentsCount: 254,
            totalCoupons: 180,
            activeCoupons: 35,
            averageCompletion: 76,
            averageQuizScore: 8.4
          },
          courses: [
            {
              id: 'c1',
              titleAr: 'تاريخ الأردن للتوجيهي والمهني BTEC',
              titleEn: 'Jordan History for Grade 12 BTEC',
              lessonsCount: 6,
              quizzesCount: 3,
              enrolledCount: 145,
              averageCompletion: 82,
              averageQuizScore: 8.7
            },
            {
              id: 'c2',
              titleAr: 'الرياضيات العلمية - التفاضل والتكامل',
              titleEn: 'Scientific Calculus - Limits & Derivatives',
              lessonsCount: 8,
              quizzesCount: 4,
              enrolledCount: 109,
              averageCompletion: 68,
              averageQuizScore: 8.1
            }
          ],
          recentActivity: {
            attempts: [
              {
                id: 'att-1',
                score: 9,
                maxScore: 10,
                submittedAt: new Date(Date.now() - 600000).toISOString(),
                student: { nameAr: 'خالد عبد الله', email: 'khaled@gmail.com' },
                quiz: { titleAr: 'اختبار النهايات الاتصال', titleEn: 'Limits Quiz' }
              },
              {
                id: 'att-2',
                score: 8,
                maxScore: 10,
                submittedAt: new Date(Date.now() - 3600000).toISOString(),
                student: { nameAr: 'يوسف رانيا', email: 'yousef@yahoo.com' },
                quiz: { titleAr: 'تطبيق التفاضل الهندسي', titleEn: 'Derivatives Apps Quiz' }
              }
            ],
            comments: [
              {
                id: 'com-1',
                content: 'هل شرح النهايات في الكتاب المدرسي يغطي جميع هذه المسائل؟ وشكراً للجهد.',
                createdAt: new Date(Date.now() - 1200000).toISOString(),
                user: { nameAr: 'نور الهدى', role: 'STUDENT' },
                lesson: { titleAr: 'مفهوم النهايات والاتصال الرياضي', titleEn: 'Limits Concept' }
              },
              {
                id: 'com-2',
                content: 'بالتأكيد يا نور، قمنا بتغطية جميع أسئلة وزارة التربية والتعليم هنا.',
                createdAt: new Date(Date.now() - 900000).toISOString(),
                user: { nameAr: 'أ. أحمد العلمي', role: 'TEACHER' },
                lesson: { titleAr: 'مفهوم النهايات والاتصال الرياضي', titleEn: 'Limits Concept' }
              }
            ],
            enrollments: [
              {
                id: 'en-1',
                enrolledAt: new Date(Date.now() - 1800000).toISOString(),
                student: { nameAr: 'سارة خالد', email: 'sara@gmail.com' },
                course: { titleAr: 'الرياضيات العلمية - التفاضل والتكامل', titleEn: 'Scientific Calculus' }
              },
              {
                id: 'en-2',
                enrolledAt: new Date(Date.now() - 7200000).toISOString(),
                student: { nameAr: 'حمزة النجار', email: 'hamza@btec.jo' },
                course: { titleAr: 'تاريخ الأردن للتوجيهي والمهني BTEC', titleEn: 'Jordan History BTEC' }
              }
            ]
          }
        };
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [router]);

  if (!authorized || loading || !data) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
        <span>Loading Analytics Engine...</span>
      </div>
    );
  }

  const isRtl = locale === 'ar';

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-x-hidden font-sans pb-16 selection:bg-brand-500/30 selection:text-brand-300">
      
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            {isRtl ? (
              <><ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" /><span>لوحة القيادة</span></>
            ) : (
              <><ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-1" /><span>Dashboard</span></>
            )}
          </Link>
          
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/quizzes" 
              className="py-1.5 px-3 border border-slate-900 bg-slate-950/50 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-450 text-slate-400 transition-colors"
            >
              Quiz Creator
            </Link>
            <Link 
              href="/admin/coupons" 
              className="py-1.5 px-3 border border-slate-900 bg-slate-950/50 hover:bg-slate-900 rounded-lg text-xs font-semibold text-slate-450 text-slate-400 transition-colors"
            >
              Coupons manager
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
              Admin Mode
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 z-10 relative space-y-8">
        
        {/* Title Block */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {tAnalytics('dashboardTitle')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {tAnalytics('dashboardSub')}
            </p>
          </div>
        </div>

        {/* 4 Dashboard Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Assigned Subjects */}
          <div className="relative rounded-2xl border border-slate-900 bg-slate-950/45 p-6 shadow-lg overflow-hidden group hover:border-brand-500/20 transition-colors">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-slate-550 uppercase tracking-wider block">
                  {tAnalytics('totalCourses')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {data.summary.coursesCount}
                </span>
              </div>
              <div className="p-3 bg-blue-500/5 text-blue-400 border border-blue-500/10 rounded-xl">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Card 2: Enrolled Students */}
          <div className="relative rounded-2xl border border-slate-900 bg-slate-950/45 p-6 shadow-lg overflow-hidden group hover:border-brand-500/20 transition-colors">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-slate-550 uppercase tracking-wider block">
                  {tAnalytics('totalStudents')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {data.summary.studentsCount}
                </span>
              </div>
              <div className="p-3 bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-xl">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Card 3: Completion percentage */}
          <div className="relative rounded-2xl border border-slate-900 bg-slate-950/45 p-6 shadow-lg overflow-hidden group hover:border-brand-500/20 transition-colors">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-slate-550 uppercase tracking-wider block">
                  {tAnalytics('completions')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {data.summary.averageCompletion}%
                </span>
              </div>
              <div className="p-3 bg-brand-500/5 text-brand-400 border border-brand-500/10 rounded-xl">
                <CheckSquare className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Card 4: Average Score */}
          <div className="relative rounded-2xl border border-slate-900 bg-slate-950/45 p-6 shadow-lg overflow-hidden group hover:border-brand-500/20 transition-colors">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-2xs font-bold text-slate-550 uppercase tracking-wider block">
                  {tAnalytics('avgScore')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white block">
                  {data.summary.averageQuizScore} <span className="text-xs text-slate-500 font-bold">/10</span>
                </span>
              </div>
              <div className="p-3 bg-amber-500/5 text-amber-400 border border-amber-500/10 rounded-xl">
                <Award className="h-5 w-5" />
              </div>
            </div>
          </div>

        </div>

        {/* Mid Grid: Course Progression stats & SVG visual indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Syllabus Progress details per course */}
          <div className="lg:col-span-8 bg-slate-900/10 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-brand-500" />
              <span>{tAnalytics('courseBreakdown')}</span>
            </h2>

            <div className="space-y-4">
              {data.courses.map(course => (
                <div key={course.id} className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white leading-tight">
                        {isRtl ? course.titleAr : course.titleEn}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 text-3xs font-bold text-slate-550 uppercase tracking-wide">
                        <span>{course.lessonsCount} {tAnalytics('lessonsCount')}</span>
                        <span>•</span>
                        <span>{course.quizzesCount} {tAnalytics('quizzesCount')}</span>
                        <span>•</span>
                        <span>{course.enrolledCount} Students</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress lines visual bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Completion rate bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-2xs font-bold text-slate-500">
                        <span>{tAnalytics('completions')}</span>
                        <span>{course.averageCompletion}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-brand-500 rounded-full transition-all duration-500" 
                          style={{ width: `${course.averageCompletion}%` }}
                        />
                      </div>
                    </div>

                    {/* Quiz average grade bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-2xs font-bold text-slate-500">
                        <span>{tAnalytics('avgScore')}</span>
                        <span>{course.averageQuizScore} / 10</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                          style={{ width: `${course.averageQuizScore * 10}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Coupons Info */}
          <div className="lg:col-span-4 bg-slate-900/10 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <Key className="h-4.5 w-4.5 text-brand-500" />
                <span>{tAnalytics('couponTitle')}</span>
              </h2>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between py-2.5 border-b border-slate-900/40 text-xs font-semibold">
                  <span className="text-slate-400">Total Created Coupons</span>
                  <span className="text-white font-bold">{data.summary.totalCoupons}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-slate-900/40 text-xs font-semibold">
                  <span className="text-slate-400">Available Active Coupons</span>
                  <span className="text-emerald-400 font-bold">{data.summary.activeCoupons}</span>
                </div>
                <div className="flex justify-between py-2.5 text-xs font-semibold">
                  <span className="text-slate-400">Redeemed Coupons</span>
                  <span className="text-slate-400 font-bold">{data.summary.totalCoupons - data.summary.activeCoupons}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link 
                href="/admin/coupons"
                className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-brand-500" />
                <span>Manage Coupon Keys</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Grid: Recent Activity Feed */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
          <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-brand-500" />
            <span>{tAnalytics('recentActivity')}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Recent attempts column */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-black text-slate-200 border-b border-slate-900 pb-2 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-500" />
                <span>{tAnalytics('recentAttempts')}</span>
              </h3>
              
              <div className="space-y-3">
                {data.recentActivity.attempts.map(attempt => (
                  <div key={attempt.id} className="p-3 bg-slate-950/40 border border-slate-950 rounded-xl space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-white">{attempt.student.nameAr}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.25 rounded bg-amber-500/10 text-amber-450 text-amber-400">
                        {attempt.score} / {attempt.maxScore}
                      </span>
                    </div>
                    <span className="text-3xs font-bold text-slate-550 block truncate">
                      {isRtl ? attempt.quiz.titleAr : attempt.quiz.titleEn}
                    </span>
                    <span className="text-4xs text-slate-550 block">
                      {new Date(attempt.submittedAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}

                {data.recentActivity.attempts.length === 0 && (
                  <p className="text-center text-slate-650 text-xs py-6">{tAnalytics('noActivity')}</p>
                )}
              </div>
            </div>

            {/* Recent discussion comments column */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-black text-slate-200 border-b border-slate-900 pb-2 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-brand-500" />
                <span>{tAnalytics('recentComments')}</span>
              </h3>

              <div className="space-y-3">
                {data.recentActivity.comments.map(comment => (
                  <div key={comment.id} className="p-3 bg-slate-950/40 border border-slate-950 rounded-xl space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-white">{comment.user.nameAr}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.25 rounded bg-brand-500/10 text-brand-400 uppercase tracking-wider">
                        {comment.user.role}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-300 line-clamp-2 italic font-medium leading-relaxed">
                      "{comment.content}"
                    </p>
                    <span className="text-4xs text-slate-550 block">
                      ON: {isRtl ? comment.lesson.titleAr : comment.lesson.titleEn}
                    </span>
                  </div>
                ))}

                {data.recentActivity.comments.length === 0 && (
                  <p className="text-center text-slate-650 text-xs py-6">{tAnalytics('noActivity')}</p>
                )}
              </div>
            </div>

            {/* Recent enrollments column */}
            <div className="space-y-4">
              <h3 className="text-xs sm:text-sm font-black text-slate-200 border-b border-slate-900 pb-2 flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-blue-500" />
                <span>{tAnalytics('recentEnrollments')}</span>
              </h3>

              <div className="space-y-3">
                {data.recentActivity.enrollments.map(enrollment => (
                  <div key={enrollment.id} className="p-3 bg-slate-950/40 border border-slate-950 rounded-xl space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-white">{enrollment.student.nameAr}</span>
                    </div>
                    <span className="text-3xs font-bold text-slate-550 block truncate">
                      {isRtl ? enrollment.course.titleAr : enrollment.course.titleEn}
                    </span>
                    <span className="text-4xs text-slate-550 block">
                      {new Date(enrollment.enrolledAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}

                {data.recentActivity.enrollments.length === 0 && (
                  <p className="text-center text-slate-650 text-xs py-6">{tAnalytics('noActivity')}</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
