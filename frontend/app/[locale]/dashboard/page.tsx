'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import PromoPopup from '@/components/PromoPopup';
import CourseUnlockModal from '@/components/CourseUnlockModal';
import { 
  GraduationCap, 
  LogOut, 
  BookOpen, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  Compass, 
  User, 
  Clock, 
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  MessageCircle,
  Lock,
  Users,
  Calendar,
  Video,
  Key,
  Settings,
  BarChart2,
  TrendingUp,
  Activity,
  ShieldCheck,
  BrainCircuit,
  Ticket,
  Calculator
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import RoleSimulator from '@/components/RoleSimulator';
import StudyPlanner from '@/components/StudyPlanner';
import StudentBroadcastBanner from '@/components/student/StudentBroadcastBanner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

interface LiveSession {
  id: string;
  titleAr: string;
  titleEn: string;
  zoomLink: string;
  startTime: string;
  durationMinutes: number;
}

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  coverImage?: string;
  subjectAr?: string;
  subjectEn?: string;
  teacherId?: string;
  teacherNameAr?: string;
  teacherNameEn?: string;
  _count?: {
    lessons: number;
    quizzes: number;
  };
  // Client mock specific
  mockProgress?: number;
  mockLessonsCount?: number;
  mockQuizzesCount?: number;
  liveSessions?: LiveSession[];
  locked?: boolean;
  semester?: 1 | 2;
  track?: string;
  published?: boolean;
}

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const navT = useTranslations('navigation');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ nameAr: string; nameEn?: string; role: string; trackType: 'ACADEMIC' | 'BTEC' } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeSemester, setActiveSemester] = useState<1 | 2>(1);
  const [selectedTrack, setSelectedTrack] = useState<'ACADEMIC' | 'BTEC' | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dashboardTrack');
      if (stored === 'ACADEMIC' || stored === 'BTEC') return stored;
    }
    return null;
  });
  const [lockedModalCourse, setLockedModalCourse] = useState<Course | null>(null);
  const [isScheduleMinimized, setIsScheduleMinimized] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);

  // Fallback Mock Courses in case local PostgreSQL is offline
  const getMockCourses = (track: 'ACADEMIC' | 'BTEC'): Course[] => {
    if (track === 'BTEC') {
      return [
        {
          id: 'mock-btec-1',
          titleAr: 'تاريخ الأردن للتوجيهي والمهني BTEC',
          titleEn: 'Jordan History for Grade 12 BTEC',
          descriptionAr: 'دورة شاملة ومبسطة لشرح منهاج تاريخ الأردن المعتمد لطلبة المسار المهني والتقني.',
          descriptionEn: 'Comprehensive guide covering historical milestones tailored for technical students.',
          coverImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=60',
          subjectAr: 'تاريخ الأردن (المشترك)', subjectEn: 'Jordan History',
          teacherNameAr: 'أ. محمد المهني', teacherNameEn: 'Mr. Mohammad BTEC',
          mockLessonsCount: 12,
          mockQuizzesCount: 6,
          mockProgress: 45
        },
        {
          id: 'mock-btec-2',
          titleAr: 'اللغة الإنجليزية المشتركة BTEC',
          titleEn: 'Core English for Grade 12 BTEC',
          descriptionAr: 'منهاج اللغة الإنجليزية المشترك لتعزيز مهارات القراءة والكتابة والمحادثة المهنية.',
          descriptionEn: 'Focus on communication, core grammar structures and vocational English writing.',
          coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=60',
          subjectAr: 'اللغة الإنجليزية (المشتركة)', subjectEn: 'Core English',
          teacherNameAr: 'أ. رانيا شحاتة', teacherNameEn: 'Mrs. Rania Shehata',
          mockLessonsCount: 15,
          mockQuizzesCount: 5,
          mockProgress: 75
        },
        {
          id: 'mock-btec-3',
          titleAr: 'التربية الإسلامية - المستوى الثالث',
          titleEn: 'Islamic Studies for Grade 12 BTEC',
          descriptionAr: 'شرح مبسط وواضح للمنهاج المقرر للتربية الإسلامية والثقافة الدينية.',
          descriptionEn: 'Islamic concepts, jurisprudence, and ethical structures for core education.',
          coverImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=60',
          subjectAr: 'التربية الإسلامية (المشتركة)', subjectEn: 'Islamic Studies',
          teacherNameAr: 'أ. إبراهيم خليل', teacherNameEn: 'Mr. Ibrahim Khalil',
          mockLessonsCount: 10,
          mockQuizzesCount: 4,
          mockProgress: 15
        }
      ];
    } else {
      return [
        {
          id: 'mock-acad-1',
          titleAr: 'الرياضيات العلمية - الفصل الأول',
          titleEn: 'Scientific Calculus - Term 1',
          descriptionAr: 'شرح مكثف وتفصيلي للنهايات والاشتقاق وتطبيقات التفاضل المتقدمة.',
          descriptionEn: 'Advanced topics in differentiation, limits and rate of change.',
          coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60',
          subjectAr: 'الرياضيات العلمية', subjectEn: 'Scientific Mathematics',
          teacherNameAr: 'أ. أحمد العلمي', teacherNameEn: 'Dr. Ahmad Academic',
          mockLessonsCount: 24,
          mockQuizzesCount: 12,
          mockProgress: 30
        },
        {
          id: 'mock-acad-2',
          titleAr: 'الفيزياء العلمية - الكهرباء والمغناطيسية',
          titleEn: 'Scientific Physics - Electromagnetism',
          descriptionAr: 'تغطية شاملة لقوانين كيرشوف، المجال المغناطيسي، والتيار المتردد.',
          descriptionEn: 'Complete breakdown of electrical circuits and electromagnetic induction.',
          coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=60',
          subjectAr: 'الفيزياء التخصصية', subjectEn: 'Advanced Physics',
          teacherNameAr: 'أ. يوسف ريان', teacherNameEn: 'Mr. Yousef Rayan',
          mockLessonsCount: 20,
          mockQuizzesCount: 10,
          mockProgress: 10
        },
        {
          id: 'mock-acad-3',
          titleAr: 'الكيمياء التخصصية - سرعة التفاعلات',
          titleEn: 'Advanced Chemistry - Reaction Rates',
          descriptionAr: 'دراسة سرعة التفاعلات الكيميائية، الاتزان الديناميكي وحسابات الأحماض والقواعد.',
          descriptionEn: 'Chemical kinetics, dynamic equilibrium, and pH calculation guides.',
          coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60',
          subjectAr: 'الكيمياء التخصصية', subjectEn: 'Advanced Chemistry',
          teacherNameAr: 'أ. سارة الكيماوي', teacherNameEn: 'Mrs. Sara Chemistry',
          mockLessonsCount: 18,
          mockQuizzesCount: 8,
          mockProgress: 55
        }
      ];
    }
  };

  // Extracted to avoid duplication between try/catch blocks
  const computeCourseProgress = (courseList: Course[], userId: string) => {
    let completedLessonIds: string[] = [];
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`completed-lessons-${userId}`);
        if (stored) completedLessonIds = JSON.parse(stored);
      } catch (e) {}
    }

    return courseList.map((c: any) => {
      // Special handling for Vocab Course
      if (c.id === 'vocab-btec') {
        c.mockLessonsCount = 8;
        c.mockQuizzesCount = 8;
        const stored = typeof window !== 'undefined' ? localStorage.getItem('vocab_completed') : null;
        if (stored) {
           const completedUnits = JSON.parse(stored);
           c.mockProgress = Math.round((completedUnits.length / 8) * 100);
        } else {
           c.mockProgress = 0;
        }
      } else if (c.lessons) {
        c.mockLessonsCount = c.lessons.length;
        c.mockQuizzesCount = c.lessons.reduce((acc: number, l: any) => acc + (l._count?.questions > 0 ? 1 : 0), 0);
        c._pdfCount = c.lessons.filter((l: any) => !!l.pdfUrl).length;
        
        const total = c.lessons.length || 1;
        const mastered = c.lessons.filter((l: any) => completedLessonIds.includes(l.id)).length;
        c.mockProgress = Math.round((mastered / total) * 100);
      } else {
        // Fallback for mock courses
        const stored = typeof window !== 'undefined' ? localStorage.getItem(`progress-${c.id}`) : null;
        if (stored) {
          const completedIds: string[] = JSON.parse(stored);
          const total = c.mockLessonsCount ?? 1;
          c.mockProgress = Math.round((completedIds.length / total) * 100);
        }
      }
      const lastRoute = typeof window !== 'undefined' ? localStorage.getItem(`last-visited-route-${userId}-${c.id}`) : null;
      if (lastRoute) {
        c._lastVisitedLink = lastRoute;
      }
      return c;
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Auth Guard check failed
        router.replace('/login');
        return;
      }

      // Parent role redirect
      const cachedForRoleCheck = localStorage.getItem('user');
      if (cachedForRoleCheck) {
        const parsedForRoleCheck = JSON.parse(cachedForRoleCheck);
        if (parsedForRoleCheck?.role === 'PARENT') {
          router.replace('/parent/dashboard');
          return;
        }
      }

      try {
        // 1. Fetch current profile
        const profileRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        let activeUser: any = null;
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          activeUser = profileData.user;
        } else {
          const cachedUser = localStorage.getItem('user');
          if (cachedUser) {
            activeUser = JSON.parse(cachedUser);
          } else {
            throw new Error('Authentication expired');
          }
        }
        setUser(activeUser);

        // 2. Fetch track-segregated courses
        const coursesRes = await fetch('/api/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // computeCourseProgress is defined above the useEffect (DRY)

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          const filtered = coursesData.courses.filter((c: any) => 
            c.published && c.track === (selectedTrack || activeUser.trackType || 'ACADEMIC')
          );
          setCourses(computeCourseProgress(filtered, activeUser.id));
        } else {
          // Fallback to local mock data if database connection error occurs
          setCourses(computeCourseProgress(getMockCourses(selectedTrack || activeUser.trackType), activeUser.id));
        }

        // 3. Fetch admin stats if user is ADMIN
        if (activeUser.role === 'ADMIN' || activeUser.isMasterAdmin) {
          const statsRes = await fetch('/api/admin/dashboard-stats', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setAdminStats(statsData);
          }
        }

      } catch (err: any) {
        // Fallback for offline/unreachable server using localstorage cached credentials
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          const parsedUser = JSON.parse(cachedUser);
          setUser(parsedUser);

          // Try admin-courses from localStorage first, else fall back to mock
          const storedCourses = localStorage.getItem('admin-courses');
          if (storedCourses) {
            const allCourses = JSON.parse(storedCourses);
            const filtered = allCourses.filter((c: any) =>
              c.published && c.track === (selectedTrack || parsedUser?.trackType || 'ACADEMIC')
            );
            setCourses(computeCourseProgress(filtered, parsedUser.id));
          } else {
            setCourses(computeCourseProgress(getMockCourses(selectedTrack || parsedUser.trackType), parsedUser.id));
          }
        } else {
          localStorage.removeItem('token');
          router.replace('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router, selectedTrack]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout failed', e);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('dashboardTrack');
    window.dispatchEvent(new Event('local-storage-update'));
    router.replace('/login');
  };

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace('/dashboard', { locale: nextLocale });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
        <span>{locale === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Loading your dashboard...'}</span>
      </div>
    );
  }

  const welcomeName = locale === 'ar' ? user?.nameAr : (user?.nameEn || user?.nameAr);
  const currentTrack = selectedTrack || user?.trackType || 'ACADEMIC';
  const isBtec = currentTrack === 'BTEC';

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-x-hidden font-sans pb-16 selection:bg-brand-500/30 selection:text-brand-300">
      
      {/* Background neon glows */}
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <PromoPopup />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 z-10 relative">
        <RoleSimulator />
        <StudentBroadcastBanner isRtl={locale === 'ar'} />
        
        {/* Welcome Section */}
        <div className="bg-slate-900/20 border border-slate-850 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl mb-10 overflow-hidden relative">
          <div className="absolute top-0 end-0 w-32 h-32 bg-gradient-to-bl from-brand-500/10 to-transparent blur-2xl pointer-events-none rounded-full" />
          
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-xs font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>{t('syllabusHeader')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              {t('welcomeTitle', { name: welcomeName })}
            </h1>
            <p className="text-sm sm:text-base text-slate-400">
              {t('welcomeSub')}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/settings"
              className="flex items-center gap-2 px-4 py-3 sm:p-4.5 bg-slate-950/80 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-900 rounded-2xl transition-all shadow-sm"
              title={locale === 'ar' ? 'الإعدادات' : 'Settings'}
            >
              <Settings className="h-5 w-5 text-slate-400" />
            </Link>

            {/* Current Track indicator badge */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4.5 min-w-[240px] shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500 font-semibold">{t('currentTrack')}</span>
              {(user?.role === 'TEACHER' || user?.role === 'ADMIN') && (
                <button 
                  onClick={async () => {
                    const next = isBtec ? 'ACADEMIC' : 'BTEC';
                    setSelectedTrack(next);
                    localStorage.setItem('dashboardTrack', next);
                    try {
                      const token = localStorage.getItem('token');
                      if (token) {
                        await fetch('/api/auth/update-profile', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ trackType: next })
                        });
                        const cachedUser = localStorage.getItem('user');
                        if (cachedUser) {
                          const parsed = JSON.parse(cachedUser);
                          parsed.trackType = next;
                          localStorage.setItem('user', JSON.stringify(parsed));
                        }
                      }
                    } catch (e) {}
                  }}
                  className="text-xs font-bold text-brand-500 hover:text-brand-400 bg-brand-500/10 px-2 py-1 rounded-lg transition-colors"
                >
                  {locale === 'ar' ? 'تبديل المسار' : 'Switch Track'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${isBtec ? 'bg-brand-500/10 text-brand-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {isBtec ? <Compass className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
              </div>
              <span className="text-sm sm:text-base font-bold text-white">
                {isBtec ? t('btecBadge') : t('acadBadge')}
              </span>
            </div>
            </div>
          </div>
        </div>

        {/* Student Quick Action Ribbon */}
        {user?.role === 'STUDENT' && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mb-10">
            <Link
              href="/grade11-exams"
              className="group p-4 bg-gradient-to-r from-brand-950/60 to-amber-950/60 border border-brand-500/40 hover:border-brand-500/80 rounded-2xl transition-all flex items-center gap-3 backdrop-blur-xl col-span-2 sm:col-span-1 shadow-lg shadow-brand-500/10"
            >
              <div className="p-2.5 rounded-xl bg-brand-500/20 text-brand-400 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors flex items-center gap-1">
                  <span>{locale === 'ar' ? 'امتحانات 11 مجانية' : 'Grade 11 Free Exams'}</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-extrabold">NEW</span>
                </h4>
                <p className="text-[10px] text-slate-300">
                  {locale === 'ar' ? 'اختبارات الـ 10 وحدات' : '10 Unit Free Exams'}
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/mistakes"
              className="group p-4 bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  {locale === 'ar' ? 'بنك الأخطاء' : 'Mistake Bank'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {locale === 'ar' ? 'مراجعة وتثبيت الإجابات' : 'Review wrong choices'}
                </p>
              </div>
            </Link>

            <Link
              href="/calculator"
              className="group p-4 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 rounded-2xl transition-all flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {locale === 'ar' ? 'حاسبة المعدل' : 'GPA Calculator'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {locale === 'ar' ? 'حساب المعدل المعتمد' : 'Calculate your GPA'}
                </p>
              </div>
            </Link>

            <Link
              href="/redeem"
              className="group p-4 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {locale === 'ar' ? 'تفعيل بطاقة' : 'Redeem Coupon'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {locale === 'ar' ? 'إدخال رمز الكوبون' : 'Enter access code'}
                </p>
              </div>
            </Link>

            <Link
              href="/subjects"
              className="group p-4 bg-slate-900/60 border border-slate-800 hover:border-brand-500/50 rounded-2xl transition-all flex items-center gap-3 backdrop-blur-xl"
            >
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-brand-400 transition-colors">
                  {locale === 'ar' ? 'تصفح المواد' : 'Browse Subjects'}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {locale === 'ar' ? 'اكتشاف الخطط الدراسية' : 'Explore all subjects'}
                </p>
              </div>
            </Link>
          </div>
        )}

        {/* Admin / Teacher View */}
        {(user?.role === 'ADMIN' || user?.role === 'TEACHER') ? (
          <div className="space-y-8 animate-fade-in pb-20">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30">
                  <BarChart2 className="h-6 w-6 text-brand-400" />
                </div>
                <h2 className="text-xl font-black text-white">
                  {locale === 'ar' ? 'لوحة تحكم الإدارة' : 'Command Center'}
                </h2>
             </div>
             
             {/* KPI Metrics */}
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-lg">
                   <div className="absolute top-0 end-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <Users className="h-20 w-20" />
                   </div>
                   <p className="text-slate-400 text-sm font-semibold mb-1">{locale === 'ar' ? 'الطلاب النشطين' : 'Active Students'}</p>
                   <h3 className="text-3xl font-black text-white">{adminStats?.stats?.totalStudents || 0}</h3>
                   <p className="text-emerald-500 text-xs mt-3 flex items-center gap-1 font-bold"><TrendingUp className="h-3 w-3" /> {locale === 'ar' ? 'إجمالي' : 'Total'}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-lg">
                   <div className="absolute top-0 end-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <BookOpen className="h-20 w-20" />
                   </div>
                   <p className="text-slate-400 text-sm font-semibold mb-1">{locale === 'ar' ? 'الدورات الفعالة' : 'Active Courses'}</p>
                   <h3 className="text-3xl font-black text-white">{adminStats?.stats?.totalCourses || courses.length || 0}</h3>
                   <p className="text-emerald-500 text-xs mt-3 flex items-center gap-1 font-bold"><TrendingUp className="h-3 w-3" /> {locale === 'ar' ? 'إجمالي' : 'Total'}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-lg">
                   <div className="absolute top-0 end-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <Key className="h-20 w-20" />
                   </div>
                   <p className="text-slate-400 text-sm font-semibold mb-1">{locale === 'ar' ? 'الكوبونات الفعالة' : 'Active Coupons'}</p>
                   <h3 className="text-3xl font-black text-white">{adminStats?.stats?.activeCoupons || 0}</h3>
                   <p className="text-slate-500 text-xs mt-3 flex items-center gap-1 font-bold">{locale === 'ar' ? 'جاهزة للاستخدام' : 'Ready to use'}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-lg">
                   <div className="absolute top-0 end-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <Award className="h-20 w-20" />
                   </div>
                   <p className="text-slate-400 text-sm font-semibold mb-1">{locale === 'ar' ? 'الاختبارات المنجزة' : 'Completed Quizzes'}</p>
                   <h3 className="text-3xl font-black text-white">-</h3>
                   <p className="text-slate-500 text-xs mt-3 flex items-center gap-1 font-bold">{locale === 'ar' ? 'قريباً' : 'Coming soon'}</p>
                </div>
             </div>
             
             {/* Large Action Cards */}
             <div className="mt-12">
                 <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <Settings className="h-5 w-5 text-slate-400" />
                   {locale === 'ar' ? 'إدارة المنصة' : 'Platform Management'}
                 </h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/admin/courses" className="flex flex-col gap-4 p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/40 transition-all group">
                      <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <GraduationCap className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white mb-1">{locale === 'ar' ? 'الدورات التعليمية' : 'Manage Courses'}</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{locale === 'ar' ? 'إضافة وتعديل وحذف الدورات والدروس' : 'Add, edit, or remove courses and lessons.'}</p>
                      </div>
                    </Link>

                    <Link href="/admin/quizzes" className="flex flex-col gap-4 p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all group">
                      <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white mb-1">{locale === 'ar' ? 'الاختبارات' : 'Quizzes'}</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{locale === 'ar' ? 'إنشاء الاختبارات وتحديد الإجابات الصحيحة' : 'Create quizzes and configure answers.'}</p>
                      </div>
                    </Link>

                    <Link href="/admin/coupons" className="flex flex-col gap-4 p-6 rounded-3xl border border-brand-500/20 bg-brand-500/5 hover:bg-brand-500/10 hover:border-brand-500/40 transition-all group">
                      <div className="p-4 bg-brand-500/10 rounded-2xl text-brand-400 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Key className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white mb-1">{locale === 'ar' ? 'الكوبونات' : 'Coupons'}</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{locale === 'ar' ? 'إدارة أكواد الدخول للطلاب الجدد' : 'Generate access codes for new students.'}</p>
                      </div>
                    </Link>

                    <Link href="/admin/analytics" className="flex flex-col gap-4 p-6 rounded-3xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40 transition-all group">
                      <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Award className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white mb-1">{locale === 'ar' ? 'تقارير الأداء' : 'Analytics'}</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{locale === 'ar' ? 'متابعة أداء الطلاب ومعدلات الإنجاز' : 'Track student performance and completion rates.'}</p>
                      </div>
                    </Link>

                    <Link href="/admin/teachers" className="flex flex-col gap-4 p-6 rounded-3xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition-all group">
                      <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white mb-1">{locale === 'ar' ? 'إدارة المعلمين' : 'Teachers'}</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{locale === 'ar' ? 'إضافة معلمين وتوزيع الصلاحيات' : 'Add teachers and manage platform access.'}</p>
                      </div>
                    </Link>

                    <Link href="/admin/users" className="flex flex-col gap-4 p-6 rounded-3xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all group">
                      <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-white mb-1">{locale === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</p>
                        <p className="text-sm text-slate-400 leading-relaxed">{locale === 'ar' ? 'ترقية حسابات الطلاب أو المعلمين لمدراء' : 'Promote student or teacher accounts to Admins.'}</p>
                      </div>
                    </Link>
                 </div>
             </div>

             {/* Recent Activity Feed */}
             <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <Activity className="h-5 w-5 text-brand-500" />
                   {locale === 'ar' ? 'أحدث النشاطات' : 'Recent Activity'}
                </h3>
                <div className="space-y-4">
                  {adminStats?.recentActivities?.length > 0 ? (
                    adminStats.recentActivities.map((act: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-850">
                         <div className={`p-2 rounded-full ${act.color} shrink-0`}>
                            <Sparkles className="h-4 w-4" />
                         </div>
                         <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-200">{locale === 'ar' ? act.textAr : act.textEn}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {new Date(act.time).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                            </p>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500">
                      {locale === 'ar' ? 'لا يوجد نشاطات حديثة' : 'No recent activities'}
                    </div>
                  )}
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-10 animate-fade-in pb-20">
            {/* Enrolled Courses (Top Priority) */}
            {user?.role === 'STUDENT' && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30">
                    <GraduationCap className="h-6 w-6 text-brand-400" />
                  </div>
                  <h2 className="text-xl font-black text-white">
                    {locale === 'ar' ? 'دوراتي المشترك بها' : 'My Enrolled Courses'}
                  </h2>
                </div>
                
                {courses.filter(c => !c.locked).length === 0 ? (
                  <div className="text-center py-10 bg-slate-900/10 border border-slate-900 rounded-3xl p-6">
                     <p className="text-slate-500">{locale === 'ar' ? 'لم تشترك في أي دورة بعد.' : 'You haven\'t enrolled in any courses yet.'}</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.filter(c => !c.locked).map((course: any) => {
                      const lessonsVal = course.mockLessonsCount ?? 0;
                      const quizzesVal = course.mockQuizzesCount ?? 0;
                      const pdfsVal = course._pdfCount ?? 0;
                      const progressVal = course.mockProgress ?? 0;
                      return (
                        <div
                          key={course.id}
                          className="group relative rounded-2xl border border-slate-850 bg-slate-900/15 hover:bg-slate-900/35 hover:border-brand-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg"
                        >
                          <Link href={`/courses/${course.id}`} className="absolute inset-0 z-0" aria-label="View Course"></Link>
                          <div className="relative z-10 pointer-events-none">
                            <div className="h-32 sm:h-36 w-full overflow-hidden relative bg-slate-950 group-hover:bg-slate-900 transition-colors duration-500">
                              {(course.coverImage || course.thumbnailUrl) ? (
                                <Image 
                                  src={course.coverImage || course.thumbnailUrl} 
                                  alt={locale === 'ar' ? course.titleAr : course.titleEn} 
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  className="object-cover group-hover:scale-110 group-hover:-rotate-1 transition-all duration-700 opacity-80 group-hover:opacity-100"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-900/20 to-slate-950 group-hover:from-brand-800/40 transition-all duration-700">
                                   <BookOpen className="h-10 w-10 text-brand-500/40 group-hover:text-brand-400 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                              <span className="absolute bottom-4 start-4 text-xs font-semibold px-2.5 py-1 rounded bg-brand-500 text-white shadow-md pointer-events-none">
                                {locale === 'ar' ? course.subjectAr : course.subjectEn}
                              </span>
                            </div>

                            <div className="p-6">
                              <span className="text-xs text-slate-500 font-semibold mb-2 block">
                                {locale === 'ar' ? course.teacherNameAr : course.teacherNameEn}
                              </span>
                              <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-brand-400 transition-colors mb-3">
                                {locale === 'ar' ? course.titleAr : course.titleEn}
                              </h3>
                              <div className="space-y-2 mt-4">
                                <div className="flex justify-between text-xs font-bold">
                                  <span className="text-slate-400">{t('progressLabel')}</span>
                                  <span className="text-brand-500">{progressVal}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-brand-500 to-amber-600 rounded-full"
                                    style={{ width: `${progressVal}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 pt-0 relative z-10 flex flex-col gap-2 pointer-events-auto">
                            <Link href={course._lastVisitedLink || `/courses/${course.id}`} className="group/btn w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-950 border border-slate-850 hover:bg-brand-500 hover:border-brand-500 transition-all duration-300">
                              <span>{t('resumeBtn')}</span>
                              {locale === 'ar' ? (
                                <ChevronLeft className="h-4 w-4 transition-transform group-hover/btn:-translate-x-1" />
                              ) : (
                                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                              )}
                            </Link>
                            
                            
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* My Schedule / Live Sessions Widget */}
            {(() => {
              const allSessions: (LiveSession & { courseTitleAr: string; courseTitleEn: string; isLocked: boolean; courseId: string; discussionGroupLink?: string })[] = [];
              courses.forEach(c => {
                if (c.liveSessions) {
                  c.liveSessions.forEach(ls => {
                    allSessions.push({ 
                      ...ls, 
                      courseTitleAr: c.titleAr, 
                      courseTitleEn: c.titleEn,
                      isLocked: !!c.locked,
                      courseId: c.id,
                      discussionGroupLink: c.discussionGroupLink
                    });
                  });
                }
              });

              allSessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
              if (allSessions.length === 0) return null;

              return (
                <div className="mb-10">
                  <div 
                    className="flex items-center justify-between gap-3 mb-6 cursor-pointer group"
                    onClick={() => setIsScheduleMinimized(!isScheduleMinimized)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30 group-hover:bg-blue-500/30 transition-colors">
                        <Calendar className="h-6 w-6 text-blue-400" />
                      </div>
                      <h2 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                        {locale === 'ar' ? 'جدول الحصص المباشرة التفاعلية' : 'Interactive Live Sessions Schedule'}
                      </h2>
                    </div>
                    <button className="p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:text-white transition-colors">
                      {isScheduleMinimized ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {!isScheduleMinimized && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2">
                      {allSessions.map(session => (
                      <div key={session.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors relative overflow-hidden group">
                        <div className="absolute top-0 start-0 w-1 h-full bg-blue-500"></div>
                        <div>
                          <span className="text-xs font-bold text-blue-400 mb-2 block">
                            {locale === 'ar' ? session.courseTitleAr : session.courseTitleEn}
                          </span>
                          <h3 className="text-base font-bold text-white mb-3">
                            {locale === 'ar' ? session.titleAr : session.titleEn}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(session.startTime).toLocaleString(locale === 'ar' ? 'ar-JO' : 'en-US', {
                                weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        {session.isLocked ? (
                          <Link href={`/${locale}/courses/${session.courseId}`} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl transition-all border border-slate-700">
                            <Lock className="h-4 w-4 text-slate-400" />
                            {locale === 'ar' ? 'اشترك للانضمام' : 'Enroll to Join'}
                          </Link>
                        ) : (
                          <div className="flex flex-col gap-2 w-full mt-2">
                            <a href={session.zoomLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                              <Video className="h-4 w-4" />
                              {locale === 'ar' ? 'انضمام عبر Zoom' : 'Join via Zoom'}
                            </a>
                            
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              );
            })()}
            {/* Semester Tabs */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-500/20 rounded-xl border border-purple-500/30">
                <Compass className="h-6 w-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-black text-white">
                {locale === 'ar' ? 'استكشف الدورات المتوفرة' : 'Discover Available Courses'}
              </h2>
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <button
                onClick={() => setActiveSemester(1)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border ${
                  activeSemester === 1
                    ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {locale === 'ar' ? 'الفصل الأول' : 'Semester 1'}
              </button>
              <button
                onClick={() => setActiveSemester(2)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all border ${
                  activeSemester === 2
                    ? 'bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-600'
                }`}
              >
                {locale === 'ar' ? 'الفصل الثاني' : 'Semester 2'}
              </button>
            </div>

            {courses.filter(c => c.locked && (!c.semester || c.semester === activeSemester)).length === 0 ? (
              <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-3xl p-8">
                <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-600 mb-4">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-300">{t('noCoursesTitle')}</h3>
                <p className="text-sm text-slate-500 mt-2">{t('noCoursesDesc')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.filter(c => c.locked && (!c.semester || c.semester === activeSemester)).map((course: any) => {
                  const lessonsVal = course.mockLessonsCount ?? 0;
                  const quizzesVal = course.mockQuizzesCount ?? 0;
                  const pdfsVal = course._pdfCount ?? 0;
                  
                  return (
                    <div
                      key={course.id}
                      onClick={() => setLockedModalCourse(course)}
                      className="group relative rounded-2xl border border-slate-850 bg-slate-900/15 hover:bg-slate-900/35 hover:border-slate-800/80 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg block cursor-pointer"
                    >
                      <div>
                        <div className="h-32 sm:h-36 w-full overflow-hidden relative bg-slate-950 group-hover:bg-slate-900 transition-colors duration-500">
                          {(course.coverImage || course.thumbnailUrl) ? (
                            <Image 
                              src={course.coverImage || course.thumbnailUrl} 
                              alt={locale === 'ar' ? course.titleAr : course.titleEn} 
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-110 group-hover:-rotate-1 transition-all duration-700 opacity-80 group-hover:opacity-100"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-900/20 to-slate-950 group-hover:from-brand-800/40 transition-all duration-700">
                               <BookOpen className="h-10 w-10 text-brand-500/40 group-hover:text-brand-400 group-hover:scale-125 group-hover:rotate-6 transition-all duration-700" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center pointer-events-none" />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                          
                          <div className="absolute top-3 end-3 p-2 bg-slate-950/80 border border-slate-700 rounded-xl pointer-events-none">
                            <Lock className="h-4 w-4 text-slate-300" />
                          </div>

                          <span className="absolute bottom-4 start-4 text-xs font-semibold px-2.5 py-1 rounded bg-brand-500 text-white shadow-md pointer-events-none">
                            {locale === 'ar' ? course.subjectAr : course.subjectEn}
                          </span>
                        </div>

                        <div className="p-6">
                          <span className="text-xs text-slate-500 font-semibold mb-2 block">
                            {locale === 'ar' ? course.teacherNameAr : course.teacherNameEn}
                          </span>
                          <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-brand-400 transition-colors mb-3">
                            {locale === 'ar' ? course.titleAr : course.titleEn}
                          </h3>
                          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-6">
                            {locale === 'ar' ? course.descriptionAr : course.descriptionEn}
                          </p>

                          <div className="grid grid-cols-3 gap-4 border-t border-slate-850/60 pt-4.5 mt-2 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <PlayCircle className="h-4 w-4 text-brand-500 shrink-0" />
                              <span>{t('lessonsCount', { count: lessonsVal })}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <HelpCircle className="h-4 w-4 text-brand-500 shrink-0" />
                              <span>{t('quizzesCount', { count: quizzesVal })}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <FileText className="h-4 w-4 text-brand-500 shrink-0" />
                              <span>{pdfsVal} {locale === 'ar' ? 'ملفات PDF' : 'PDFs'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        <div className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-500 bg-slate-900 border border-slate-800 cursor-not-allowed">
                          <Lock className="h-4 w-4" />
                          <span>{locale === 'ar' ? 'مقفل / Locked' : 'Locked / مقفل'}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {user?.role === 'STUDENT' && (
              <div className="mt-12">
                <StudyPlanner courses={courses} isRtl={locale === 'ar'} user={user} />
              </div>
            )}
          </div>
        )}
      </main>

      <CourseUnlockModal 
        isOpen={!!lockedModalCourse}
        onClose={() => setLockedModalCourse(null)}
        courseTitleAr={lockedModalCourse?.titleAr}
        courseTitleEn={lockedModalCourse?.titleEn}
        isRtl={locale === 'ar'}
      />
    </div>
  );
}
