'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { 
  Globe, 
  GraduationCap, 
  LogOut, 
  LayoutDashboard, 
  Menu, 
  X, 
  BarChart2, 
  Key, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Settings, 
  Sparkles, 
  Beaker, 
  Calculator,
  Radio,
  DollarSign,
  AlertTriangle,
  UploadCloud,
  ChevronDown,
  UserCheck,
  Award,
  Ticket
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const t = useTranslations('navigation');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = (params?.locale as string) || 'ar';
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ nameAr: string; role: string; isMasterAdmin?: boolean } | null>(null);
  const [switchingRole, setSwitchingRole] = useState(false);

  useEffect(() => {
    const checkUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };
    checkUser();
    window.addEventListener('local-storage-update', checkUser);
    window.addEventListener('storage', checkUser);
    return () => {
      window.removeEventListener('local-storage-update', checkUser);
      window.removeEventListener('storage', checkUser);
    };
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggleLanguage = () => {
    const nextLocale = currentLocale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

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
    setUser(null);
    setMobileOpen(false);
    window.location.href = `/${currentLocale}/login`;
  };

  if (pathname.includes('/quizzes/') && !pathname.includes('/admin/')) {
    return null;
  }

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleRoleSwitch = async (targetRole: string) => {
    if (targetRole === user?.role) return;
    setSwitchingRole(true);
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('local-storage-update'));
        
        let redirectPath = `/${currentLocale}/dashboard`;
        if (targetRole === 'TEACHER') redirectPath = `/${currentLocale}/studio`;
        if (targetRole === 'ADMIN') redirectPath = `/${currentLocale}/admin/courses`;
        if (targetRole === 'PARENT') redirectPath = `/${currentLocale}/parent/dashboard`;
        
        window.location.href = redirectPath;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSwitchingRole(false);
    }
  };

  const isAdmin = user?.role === 'ADMIN';
  const isTeacher = user?.role === 'TEACHER';
  const isParent = user?.role === 'PARENT';
  const isStudent = user?.role === 'STUDENT';
  const isAdminOrTeacher = isAdmin || isTeacher;

  if (pathname.includes('/courses/')) {
    return null;
  }

  const homeAnchor = (anchor: string) => `/${currentLocale}#${anchor}`;
  const isHome = pathname === `/${currentLocale}` || pathname === `/${currentLocale}/`;
  const isAuthPage = pathname.endsWith('/login') || pathname.endsWith('/register');
  const isSimplifiedHeader = isAuthPage || (isHome && !user);

  if (isSimplifiedHeader) {
    return (
      <header className="fixed top-0 inset-x-0 z-50 bg-transparent pointer-events-none print:hidden">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between pointer-events-auto">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.svg" alt="Tawjihi Hub Logo" width={256} height={96} sizes="(max-width: 640px) 140px, 200px" className="h-16 sm:h-20 w-auto object-contain drop-shadow-md" priority />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-600 transition-all text-xs font-semibold"
            >
              <Globe className="h-3.5 w-3.5 text-brand-500" />
              <span>{currentLocale === 'ar' ? 'English' : 'العربية'}</span>
            </button>
            {isHome && !user && (
              <div className="hidden sm:flex items-center gap-3 ml-2">
                <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-colors px-3.5 py-2">
                  {t('login') || (currentLocale === 'ar' ? 'تسجيل الدخول' : 'Log In')}
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all">
                  {t('register') || (currentLocale === 'ar' ? 'إنشاء حساب' : 'Register')}
                </Link>
              </div>
            )}
            {isHome && user && (
              <div className="flex items-center gap-2 ml-2">
                <Link href={isStudent ? '/dashboard' : (isTeacher ? '/studio' : (isParent ? '/parent/dashboard' : '/admin/courses'))} className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-lg shadow-brand-500/25 transition-all">
                  <LayoutDashboard className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {currentLocale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 print:hidden ${
        isScrolled || mobileOpen
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer z-10">
            <Image 
              src="/logo.svg" 
              alt="Tawjihi Hub Logo" 
              width={256} 
              height={96} 
              sizes="(max-width: 640px) 140px, 200px"
              className="h-16 sm:h-20 w-auto object-contain drop-shadow-md"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Student Navigation */}
            {isStudent && (
              <>
                <Link href="/dashboard" className="text-xs font-bold text-slate-300 hover:text-brand-400 transition-colors flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4 text-brand-500" />
                  <span>{currentLocale === 'ar' ? 'لوحتي التعليمية' : 'My Dashboard'}</span>
                </Link>
                <Link href="/dashboard/mistakes" className="text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>{currentLocale === 'ar' ? 'بنك الأخطاء' : 'Mistake Bank'}</span>
                </Link>
                <Link href="/redeem" className="text-xs font-bold text-slate-300 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <Ticket className="w-4 h-4 text-emerald-500" />
                  <span>{currentLocale === 'ar' ? 'تفعيل بطاقة' : 'Redeem Code'}</span>
                </Link>
              </>
            )}

            {/* Teacher Navigation & Studio 2.0 Hub */}
            {isTeacher && (
              <div className="relative group">
                <Link href="/studio" className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 border border-brand-500/30 rounded-xl text-xs font-extrabold text-brand-400 hover:bg-brand-500/20 transition-all">
                  <Sparkles className="w-4 h-4" />
                  <span>{currentLocale === 'ar' ? 'استوديو المعلم 2.0' : 'Teacher Studio 2.0'}</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </Link>

                {/* Dropdown Menu */}
                <div className="absolute top-full start-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                  <Link href="/studio" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900 rounded-xl">
                    <LayoutDashboard className="w-4 h-4 text-brand-400" />
                    <span>{currentLocale === 'ar' ? 'لوحة تحكم الاستوديو' : 'Studio Hub'}</span>
                  </Link>
                  <Link href="/studio/course-builder" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900 rounded-xl">
                    <BookOpen className="w-4 h-4 text-brand-400" />
                    <span>{currentLocale === 'ar' ? 'منشئ ومحرر الدورات' : 'Course Builder'}</span>
                  </Link>
                  <Link href="/studio/broadcasts" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900 rounded-xl">
                    <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>{currentLocale === 'ar' ? 'إعلانات وتنبيهات الطلاب' : 'Direct Broadcasts'}</span>
                  </Link>
                  <Link href="/studio/revenue" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900 rounded-xl">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>{currentLocale === 'ar' ? 'المالية وتتبع الأرباح' : 'Revenue Analytics'}</span>
                  </Link>
                  <Link href="/studio/analytics" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'الأسئلة الأكثر تعثراً' : 'Student Bottlenecks'}</span>
                  </Link>
                  <Link href="/studio/quiz-bulk" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-900 rounded-xl">
                    <UploadCloud className="w-4 h-4 text-blue-400" />
                    <span>{currentLocale === 'ar' ? 'رفع وتوليد بنك الأسئلة' : 'Bulk Quiz Uploader'}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* General Public Links */}
            <a href={homeAnchor('academic-track')} className="text-xs font-medium text-slate-300 hover:text-brand-400 transition-colors">
              {t('academic')}
            </a>
            <a href={homeAnchor('btec-track')} className="text-xs font-medium text-slate-300 hover:text-brand-400 transition-colors">
              {t('btec')}
            </a>
            <Link href="/grade11-exams" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLocale === 'ar' ? 'امتحانات 11 مجانية' : 'Free Grade 11 Exams'}</span>
            </Link>
            <Link href="/btec-guide" className="text-xs font-medium text-slate-300 hover:text-brand-400 transition-colors flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              {t('btecGuide') || (currentLocale === 'ar' ? 'دليل BTEC' : 'BTEC Guide')}
            </Link>
            <Link href="/calculator" className="text-xs font-medium text-slate-300 hover:text-brand-400 transition-colors flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 text-brand-500" />
              {t('calculator') || (currentLocale === 'ar' ? 'حاسبة المعدل' : 'GPA Calculator')}
            </Link>
            <Link href="/subjects" className="text-xs font-medium text-slate-300 hover:text-brand-400 transition-colors">
              {currentLocale === 'ar' ? 'المواد' : 'Subjects'}
            </Link>
            <Link href="/labs" className="text-xs font-medium text-slate-300 hover:text-brand-400 transition-colors">
              {currentLocale === 'ar' ? 'المختبرات' : 'Labs'}
            </Link>

            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors py-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{currentLocale === 'ar' ? 'لوحة الإدارة' : 'Admin'}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                <div className="absolute top-full start-0 mt-1 w-52 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
                  <Link href="/admin/analytics" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl mx-1">
                    <BarChart2 className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'الإحصائيات' : 'Analytics'}</span>
                  </Link>
                  <Link href="/admin/courses" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl mx-1">
                    <GraduationCap className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'إدارة الدورات' : 'Courses'}</span>
                  </Link>
                  <Link href="/admin/users" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl mx-1">
                    <Users className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</span>
                  </Link>
                  <Link href="/admin/coupons" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl mx-1">
                    <Key className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'إدارة الكوبونات' : 'Coupons'}</span>
                  </Link>
                  <Link href="/admin/applications" className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 rounded-xl mx-1 border-t border-slate-800/60 mt-1 pt-2.5">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span>{currentLocale === 'ar' ? 'طلبات التوظيف' : 'Applications'}</span>
                  </Link>
                </div>
              </div>
            )}
          </nav>

          {/* Desktop Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-bold"
              aria-label="Toggle language"
            >
              <Globe className="h-3.5 w-3.5 text-brand-500" />
              <span>{currentLocale === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                {user.isMasterAdmin && (
                  <div className="relative group">
                    <button 
                      disabled={switchingRole}
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-400 hover:text-amber-300 transition-colors px-3 py-1.5 border border-amber-500/30 rounded-xl bg-amber-500/10"
                    >
                      <span>{currentLocale === 'ar' ? `محاكاة: ${user.role}` : `Role: ${user.role}`}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <div className="absolute top-full start-0 mt-1 w-36 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-1 z-50">
                      {['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'].map(r => (
                        <button
                          key={r}
                          onClick={() => handleRoleSwitch(r)}
                          className={`w-full text-start px-3 py-2 text-xs font-bold rounded-lg transition-colors ${user.role === r ? 'text-brand-400 bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Pill */}
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-900/80 border border-slate-800 rounded-2xl">
                  <div className="w-7 h-7 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                    {(user?.nameAr || user?.nameEn || 'U').charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-200 max-w-[100px] truncate">
                    {user?.nameAr || user?.nameEn || 'مستخدم'}
                  </span>
                  
                  <Link 
                    href="/dashboard/settings"
                    className="p-1 text-slate-400 hover:text-white transition-colors"
                    title={currentLocale === 'ar' ? 'الإعدادات' : 'Settings'}
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </Link>

                  <button 
                    onClick={handleLogout}
                    className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                    title={currentLocale === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>

                <Link 
                  href={isStudent ? '/dashboard' : (isTeacher ? '/studio' : (isParent ? '/parent/dashboard' : '/admin/courses'))} 
                  className="inline-flex items-center gap-1.5 justify-center px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-md shadow-brand-500/20 transition-all"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>{currentLocale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                </Link>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-xs font-bold text-slate-300 hover:text-white transition-colors px-3.5 py-2">
                  {t('login')}
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-lg shadow-brand-500/25 transition-all">
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 text-xs font-bold"
              aria-label="Toggle language"
            >
              <Globe className="h-3.5 w-3.5 text-brand-500" />
              <span>{currentLocale === 'ar' ? 'EN' : 'ع'}</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-800/60 bg-slate-950/98 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {/* User badge mobile */}
              {user && (
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center">
                      {(user?.nameAr || user?.nameEn || 'U').charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{user?.nameAr || user?.nameEn || 'مستخدم'}</p>
                      <span className="text-[10px] text-brand-400 font-semibold uppercase">{user?.role}</span>
                    </div>
                  </div>

                  <Link href="/dashboard/settings" onClick={() => setMobileOpen(false)} className="p-2 text-slate-400 hover:text-white">
                    <Settings className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Master Admin Mobile Role Switcher */}
              {user?.isMasterAdmin && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-3">
                  <p className="text-[10px] font-bold text-amber-500 uppercase mb-2">
                    {currentLocale === 'ar' ? 'تغيير الدور (للمدير)' : 'Switch Role (Admin)'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'].map(r => (
                      <button
                        key={r}
                        onClick={() => handleRoleSwitch(r)}
                        className={`px-2 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${
                          user.role === r 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Student Mobile Links */}
              {isStudent && (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900">
                    <LayoutDashboard className="w-4 h-4 text-brand-500" />
                    <span>{currentLocale === 'ar' ? 'لوحتي التعليمية' : 'My Dashboard'}</span>
                  </Link>
                  <Link href="/dashboard/mistakes" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>{currentLocale === 'ar' ? 'بنك الأخطاء والتمارين' : 'Mistake Bank'}</span>
                  </Link>
                  <Link href="/redeem" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-200 hover:bg-slate-900">
                    <Ticket className="w-4 h-4 text-emerald-500" />
                    <span>{currentLocale === 'ar' ? 'تفعيل بطاقة دورة' : 'Redeem Code'}</span>
                  </Link>
                </>
              )}

              {/* Teacher Mobile Links */}
              {isTeacher && (
                <>
                  <div className="p-1 bg-brand-500/10 border border-brand-500/20 rounded-2xl space-y-1 mb-2">
                    <span className="px-3 py-1 text-[10px] font-extrabold text-brand-400 uppercase block">{currentLocale === 'ar' ? 'استوديو المعلم 2.0' : 'Teacher Studio 2.0'}</span>
                    <Link href="/studio" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-slate-900">
                      <LayoutDashboard className="w-4 h-4 text-brand-400" />
                      <span>{currentLocale === 'ar' ? 'لوحة تحكم الاستوديو' : 'Studio Hub'}</span>
                    </Link>
                    <Link href="/studio/course-builder" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-slate-900">
                      <BookOpen className="w-4 h-4 text-brand-400" />
                      <span>{currentLocale === 'ar' ? 'منشئ ومحرر الدورات' : 'Course Builder'}</span>
                    </Link>
                    <Link href="/studio/broadcasts" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-slate-900">
                      <Radio className="w-4 h-4 text-purple-400" />
                      <span>{currentLocale === 'ar' ? 'إعلانات وتنبيهات الطلاب' : 'Direct Broadcasts'}</span>
                    </Link>
                    <Link href="/studio/revenue" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-slate-900">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                      <span>{currentLocale === 'ar' ? 'المالية وتتبع الأرباح' : 'Revenue Analytics'}</span>
                    </Link>
                    <Link href="/studio/analytics" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold text-white hover:bg-slate-900">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>{currentLocale === 'ar' ? 'الأسئلة الأكثر تعثراً' : 'Student Bottlenecks'}</span>
                    </Link>
                  </div>
                </>
              )}

              {/* Public Links */}
              <a href={homeAnchor('academic-track')} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white">
                <BookOpen className="h-4 w-4 text-brand-500" />
                {t('academic')}
              </a>
              <a href={homeAnchor('btec-track')} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                {t('btec')}
              </a>
              <Link href="/grade11-exams" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{currentLocale === 'ar' ? 'امتحانات 11 مجانية' : 'Free Grade 11 Exams'}</span>
              </Link>
              <Link href="/btec-guide" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>{t('btecGuide') || (currentLocale === 'ar' ? 'دليل BTEC' : 'BTEC Guide')}</span>
              </Link>
              <Link href="/calculator" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white">
                <Calculator className="w-4 h-4 text-brand-500" />
                <span>{t('calculator') || (currentLocale === 'ar' ? 'حاسبة المعدل' : 'GPA Calculator')}</span>
              </Link>

              <div className="border-t border-slate-800/60 my-2" />

              {/* Auth Actions Mobile */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{currentLocale === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 border border-slate-800">
                    {t('login')}
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600">
                    {t('register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
