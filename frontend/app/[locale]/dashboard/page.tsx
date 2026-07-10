'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import PromoPopup from '@/components/PromoPopup';
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
  Loader2,
  Sparkles,
  Lock,
  Users,
  Calendar,
  Video,
  Key,
  Settings,
  BarChart2,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import RoleSimulator from '@/components/RoleSimulator';

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
  const [error, setError] = useState<string | null>(null);
  const [activeSemester, setActiveSemester] = useState<1 | 2>(1);
  const [selectedTrack, setSelectedTrack] = useState<'ACADEMIC' | 'BTEC' | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('dashboardTrack');
      if (stored === 'ACADEMIC' || stored === 'BTEC') return stored;
    }
    return null;
  });

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
        
        if (!profileRes.ok) {
          throw new Error('Authentication expired');
        }
        
        const profileData = await profileRes.json();
        const activeUser = profileData.user;
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
                  onClick={() => {
                    const next = isBtec ? 'ACADEMIC' : 'BTEC';
                    setSelectedTrack(next);
                    localStorage.setItem('dashboardTrack', next);
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
                   <h3 className="text-3xl font-black text-white">1,248</h3>
                   <p className="text-emerald-500 text-xs mt-3 flex items-center gap-1 font-bold"><TrendingUp className="h-3 w-3" /> +12% {locale === 'ar' ? 'هذا الأسبوع' : 'this week'}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-lg">
                   <div className="absolute top-0 end-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <BookOpen className="h-20 w-20" />
                   </div>
                   <p className="text-slate-400 text-sm font-semibold mb-1">{locale === 'ar' ? 'الدورات الفعالة' : 'Active Courses'}</p>
                   <h3 className="text-3xl font-black text-white">{courses.length}</h3>
                   <p className="text-emerald-500 text-xs mt-3 flex items-center gap-1 font-bold"><TrendingUp className="h-3 w-3" /> +2 {locale === 'ar' ? 'هذا الأسبوع' : 'this week'}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-lg">
                   <div className="absolute top-0 end-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <HelpCircle className="h-20 w-20" />
                   </div>
                   <p className="text-slate-400 text-sm font-semibold mb-1">{locale === 'ar' ? 'اختبارات تم حلها' : 'Quizzes Taken'}</p>
                   <h3 className="text-3xl font-black text-white">5,892</h3>
                   <p className="text-emerald-500 text-xs mt-3 flex items-center gap-1 font-bold"><TrendingUp className="h-3 w-3" /> +841 {locale === 'ar' ? 'هذا الأسبوع' : 'this week'}</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-slate-700 transition-colors shadow-lg">
                   <div className="absolute top-0 end-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                      <Sparkles className="h-20 w-20" />
                   </div>
                   <p className="text-slate-400 text-sm font-semibold mb-1">{locale === 'ar' ? 'الإيرادات (تقريبي)' : 'Revenue (Est)'}</p>
                   <h3 className="text-3xl font-black text-white">12.4K <span className="text-sm text-slate-500">JOD</span></h3>
                   <p className="text-emerald-500 text-xs mt-3 flex items-center gap-1 font-bold"><TrendingUp className="h-3 w-3" /> +4.2% {locale === 'ar' ? 'هذا الشهر' : 'this month'}</p>
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
                 </div>
             </div>

             {/* Recent Activity Feed */}
             <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                   <Activity className="h-5 w-5 text-brand-500" />
                   {locale === 'ar' ? 'أحدث النشاطات' : 'Recent Activity'}
                </h3>
                <div className="space-y-4">
                  {[
                    { textAr: 'قام أحمد محمود بالتسجيل في دورة الفيزياء', textEn: 'Ahmad Mahmoud enrolled in Physics', time: '10 min ago', color: 'bg-emerald-500/20 text-emerald-400' },
                    { textAr: 'حصلت سارة كمال على 95% في اختبار الكيمياء', textEn: 'Sara Kamal scored 95% in Chemistry quiz', time: '1 hour ago', color: 'bg-brand-500/20 text-brand-400' },
                    { textAr: 'تم تفعيل 15 كوبون جديد عن طريق المكتبة', textEn: '15 new coupons redeemed by Bookstore', time: '3 hours ago', color: 'bg-blue-500/20 text-blue-400' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-850">
                       <div className={`p-2 rounded-full ${act.color} shrink-0`}>
                          <Sparkles className="h-4 w-4" />
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-200">{locale === 'ar' ? act.textAr : act.textEn}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{act.time}</p>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-10 animate-fade-in pb-20">
            {/* Dashboard Content */}

            {/* Continue Learning Widget */}
            {courses.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30">
                    <PlayCircle className="h-6 w-6 text-brand-400" />
                  </div>
                  <h2 className="text-xl font-black text-white">
                    {locale === 'ar' ? 'متابعة التعلم (Resume Learning)' : 'Resume Learning'}
                  </h2>
                </div>
                
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden group">
                   <div className="absolute top-0 end-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/20 transition-all duration-700" />
                   
                   <div className="h-24 w-24 sm:h-32 sm:w-32 shrink-0 rounded-2xl overflow-hidden relative border-2 border-slate-700/50 shadow-md">
                     {courses[0]?.coverImage ? (
                        <Image src={courses[0].coverImage} alt="Cover" fill className="object-cover" />
                     ) : (
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center"><BookOpen className="text-slate-500 h-10 w-10" /></div>
                     )}
                   </div>
                   
                   <div className="flex-1 space-y-3 text-center md:text-start z-10">
                      <span className="text-brand-500 text-xs font-bold px-3 py-1 bg-brand-500/10 rounded-lg">
                        {locale === 'ar' ? 'آخر دورة تم فتحها' : 'Last Accessed'}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{locale === 'ar' ? courses[0]?.titleAr : courses[0]?.titleEn}</h3>
                      <p className="text-sm text-slate-400 max-w-xl">
                        {locale === 'ar' ? 'أنت على وشك إكمال الدورة، واصل تقدمك الآن لتحقيق أفضل النتائج!' : 'You are making great progress! Continue where you left off.'}
                      </p>
                   </div>
                   
                   <div className="shrink-0 w-full md:w-auto z-10">
                      <Link 
                        href={`/courses/${courses[0]?.id}`}
                        className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-500/20 group-hover:scale-105"
                      >
                         <PlayCircle className="h-5 w-5" />
                         {locale === 'ar' ? 'متابعة الدرس' : 'Resume Course'}
                      </Link>
                   </div>
                </div>
              </div>
            )}


        {/* My Schedule / Live Sessions Widget */}
        {(() => {
          // Extract all live sessions from enrolled courses
          const allSessions: (LiveSession & { courseTitleAr: string; courseTitleEn: string })[] = [];
          courses.forEach(c => {
            if (c.liveSessions) {
              c.liveSessions.forEach(ls => {
                allSessions.push({ ...ls, courseTitleAr: c.titleAr, courseTitleEn: c.titleEn });
              });
            }
          });

          // Sort chronologically
          allSessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

          if (allSessions.length === 0) return null;

          return (
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-500/20 rounded-xl border border-blue-500/30">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-black text-white">
                  {locale === 'ar' ? 'جدول المواعيد (My Schedule)' : 'My Schedule'}
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <a href={session.zoomLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all">
                      <Video className="h-4 w-4" />
                      {locale === 'ar' ? 'انضمام عبر Zoom' : 'Join via Zoom'}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Student Coupon CTA */}
        {user?.role === 'STUDENT' && (
          <div className="mb-6">
            <Link
              href="/redeem"
              className="flex items-center gap-4 p-4 rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-500/5 to-amber-500/5 hover:from-brand-500/10 hover:to-amber-500/10 hover:border-brand-500/40 transition-all group"
            >
              <div className="p-3 bg-gradient-to-br from-brand-500/20 to-amber-500/20 rounded-xl text-brand-400 group-hover:scale-110 transition-transform shrink-0">
                <Key className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-semibold mb-0.5">
                  {locale === 'ar' ? 'هل لديك كوبون دخول؟' : 'Have an access coupon?'}
                </p>
                <p className="text-sm font-bold text-white">
                  {locale === 'ar' ? 'أدخل الكود لفتح مادتك الدراسية' : 'Enter your code to unlock a course'}
                </p>
              </div>
              <div className="text-slate-500 group-hover:text-brand-400 transition-colors">
                {locale === 'ar' ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </div>
            </Link>
          </div>
        )}

        {/* Semester Tabs */}
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

        {courses.filter(c => !c.semester || c.semester === activeSemester).length === 0 ? (
          <div className="text-center py-20 bg-slate-900/10 border border-slate-900 rounded-3xl p-8">
            <div className="h-16 w-16 mx-auto flex items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-600 mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-300">{t('noCoursesTitle')}</h3>
            <p className="text-sm text-slate-500 mt-2">{t('noCoursesDesc')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.filter(c => !c.semester || c.semester === activeSemester).map((course: any) => {
              const lessonsVal = course.mockLessonsCount ?? 0;
              const quizzesVal = course.mockQuizzesCount ?? 0;
              const pdfsVal = course._pdfCount ?? 0;
              const progressVal = course.mockProgress ?? 0;

              return (
                <Link
                  key={course.id}
                  href={course.locked ? '#' : `/courses/${course.id}`}
                  onClick={course.locked ? (e) => e.preventDefault() : undefined}
                  className={`group relative rounded-2xl border border-slate-850 bg-slate-900/15 hover:bg-slate-900/35 hover:border-slate-800/80 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg block ${course.locked ? 'cursor-not-allowed' : ''}`}
                >
                  <div>
                    {/* Course Banner Cover */}
                    <div className="h-32 sm:h-36 w-full overflow-hidden relative bg-slate-950 group-hover:bg-slate-900 transition-colors duration-500">
                      {course.coverImage ? (
                        <Image 
                          src={course.coverImage} 
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
                      
                      {/* Shading overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />
                      
                      {/* Locked overlay */}
                      {course.locked && (
                        <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center pointer-events-none" />
                      )}

                      {/* Lock badge (top-right) */}
                      {course.locked && (
                        <div className="absolute top-3 end-3 p-2 bg-slate-950/80 border border-slate-700 rounded-xl pointer-events-none">
                          <Lock className="h-4 w-4 text-slate-300" />
                        </div>
                      )}

                      {/* Subject Tag */}
                      <span className="absolute bottom-4 start-4 text-xs font-semibold px-2.5 py-1 rounded bg-brand-500 text-white shadow-md pointer-events-none">
                        {locale === 'ar' ? course.subjectAr : course.subjectEn}
                      </span>
                    </div>

                    {/* Course Info */}
                    <div className="p-6">
                      {/* Teacher name */}
                      <span className="text-xs text-slate-500 font-semibold mb-2 block">
                        {locale === 'ar' ? course.teacherNameAr : course.teacherNameEn}
                      </span>
                      
                      {/* Course Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-brand-400 transition-colors mb-3">
                        {locale === 'ar' ? course.titleAr : course.titleEn}
                      </h3>
                      
                      {/* Course Description */}
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-6">
                        {locale === 'ar' ? course.descriptionAr : course.descriptionEn}
                      </p>

                      {/* Course Metadata Stats */}
                      <div className="grid grid-cols-3 gap-4 border-y border-slate-850/60 py-4.5 mb-6 text-xs text-slate-400">
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

                      {/* Progress Bar widget */}
                      <div className="space-y-2">
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

                  {/* Course Action */}
                  <div className="p-6 pt-0">
                    {course.locked ? (
                      <div className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold text-slate-500 bg-slate-900 border border-slate-800 cursor-not-allowed">
                        <Lock className="h-4 w-4" />
                        <span>{locale === 'ar' ? 'مقفل / Locked' : 'Locked / مقفل'}</span>
                      </div>
                    ) : (
                      <div className="group/btn w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-950 border border-slate-850 hover:bg-brand-500 hover:border-brand-500 transition-all duration-300 cursor-pointer">
                        <span>{t('resumeBtn')}</span>
                        {locale === 'ar' ? (
                          <ChevronLeft className="h-4 w-4 transition-transform group-hover/btn:-translate-x-1" />
                        ) : (
                          <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

          </div>
        )}

      </main>

    </div>
  );
}
