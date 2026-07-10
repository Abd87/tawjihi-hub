'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { Globe, GraduationCap, LogOut, LayoutDashboard, Menu, X, BarChart2, Key, BookOpen, ShieldCheck, Users, Settings } from 'lucide-react';
import { useState, useEffect, useLayoutEffect } from 'react';

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

  // Read auth state synchronously before paint to avoid flash
  useLayoutEffect(() => {
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

  // Close mobile menu on route change
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
    window.dispatchEvent(new Event('local-storage-update'));
    setUser(null);
    setMobileOpen(false);
    window.location.href = `/${currentLocale}/login`;
  };

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
        if (targetRole === 'ADMIN' || targetRole === 'TEACHER') redirectPath = `/${currentLocale}/admin/courses`;
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
  const isAdminOrTeacher = isAdmin || isTeacher;

  // Navigate to home page with anchor (works from any page)
  const homeAnchor = (anchor: string) => `/${currentLocale}#${anchor}`;

  return (
    <>
      <header className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 ${
        isScrolled || mobileOpen
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-slate-800/60 shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 cursor-pointer z-10">
            <div className="p-2.5 bg-gradient-to-br from-brand-500 to-amber-600 rounded-xl shadow-md shadow-brand-500/20 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-brand-300 bg-clip-text text-transparent">
              {t('brandName')}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a href={homeAnchor('academic-track')} className="text-sm font-medium text-slate-300 hover:text-brand-500 transition-colors">
              {t('academic')}
            </a>
            <a href={homeAnchor('btec-track')} className="text-sm font-medium text-slate-300 hover:text-brand-500 transition-colors">
              {t('btec')}
            </a>
            {isAdminOrTeacher && (
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors py-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{currentLocale === 'ar' ? 'لوحة الإدارة' : 'Admin'}</span>
                  <svg className="h-3 w-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {/* Dropdown on hover */}
                <div className="absolute top-full start-0 mt-1 w-52 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-black/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
                  <Link href="/admin/analytics" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors rounded-xl mx-1">
                    <BarChart2 className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'الإحصائيات' : 'Analytics'}</span>
                  </Link>
                  <Link href="/admin/courses" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors rounded-xl mx-1">
                    <GraduationCap className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'إدارة الدورات' : 'Courses'}</span>
                  </Link>
                  <Link href="/admin/coupons" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors rounded-xl mx-1">
                    <Key className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'إدارة الكوبونات' : 'Coupons'}</span>
                  </Link>
                  <Link href="/admin/quizzes" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors rounded-xl mx-1">
                    <BookOpen className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'إدارة الاختبارات' : 'Quizzes'}</span>
                  </Link>
                  <Link href="/admin/teachers" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors rounded-xl mx-1">
                    <Users className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'المعلمون' : 'Teachers'}</span>
                  </Link>
                </div>
              </div>
            )}
            {isTeacher && !isAdmin && (
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors py-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{currentLocale === 'ar' ? 'لوحة المعلم' : 'Teacher'}</span>
                  <svg className="h-3 w-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div className="absolute top-full start-0 mt-1 w-48 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
                  <Link href="/admin/courses" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-900 transition-colors rounded-xl mx-1">
                    <GraduationCap className="h-4 w-4 text-amber-400" />
                    <span>{currentLocale === 'ar' ? 'دوراتي' : 'My Courses'}</span>
                  </Link>
                </div>
              </div>
            )}
            {isParent && (
              <Link href="/parent/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors">
                <span>{currentLocale === 'ar' ? 'متابعة ابني' : 'My Child'}</span>
              </Link>
            )}
          </nav>

          {/* Desktop Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-500 hover:bg-slate-800/80 transition-all text-sm font-medium"
              aria-label="Toggle language"
            >
              <Globe className="h-4 w-4 text-brand-500" />
              <span>{currentLocale === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {user ? (
              <>
                {user.isMasterAdmin && (
                  <div className="relative group">
                    <button 
                      disabled={switchingRole}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors px-4 py-2 border border-amber-500/20 rounded-lg bg-amber-500/5"
                    >
                      <span>{currentLocale === 'ar' ? `محاكاة دور: ${user.role}` : `Simulate: ${user.role}`}</span>
                      <svg className="h-3 w-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    <div className="absolute top-full start-0 mt-1 w-32 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
                      {['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'].map(r => (
                        <button
                          key={r}
                          onClick={() => handleRoleSwitch(r)}
                          className={`w-full text-start px-4 py-2 text-xs font-bold transition-colors ${user.role === r ? 'text-brand-500 bg-slate-900' : 'text-slate-300 hover:text-white hover:bg-slate-900'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <Link 
                  href="/dashboard/settings"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2"
                >
                  <Settings className="h-4 w-4 text-slate-500 hover:text-white" />
                  <span>{currentLocale === 'ar' ? 'الإعدادات' : 'Settings'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors px-4 py-2"
                >
                  <LogOut className="h-4 w-4 text-brand-500" />
                  <span>{t('logout') || (currentLocale === 'ar' ? 'تسجيل الخروج' : 'Log Out')}</span>
                </button>
                <Link 
                  href="/settings" 
                  className="inline-flex items-center gap-1.5 justify-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  <span>{currentLocale === 'ar' ? 'الإعدادات' : 'Settings'}</span>
                </Link>
                <Link 
                  href={isParent ? '/parent/dashboard' : (isAdminOrTeacher ? '/admin/courses' : '/dashboard')} 
                  className="inline-flex items-center gap-1.5 justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{currentLocale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                  {t('login')}
                </Link>
                <Link href="/register" className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/35 transition-all">
                  {t('register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Language + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 text-xs font-medium"
            >
              <Globe className="h-3.5 w-3.5 text-brand-500" />
              <span>{currentLocale === 'ar' ? 'EN' : 'ع'}</span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg border border-slate-700/60 bg-slate-900/60 text-slate-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-800/60 bg-slate-950/98 backdrop-blur-md animate-slide-down">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              
              {/* Nav Links */}
              <a
                href={homeAnchor('academic-track')}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/60 transition-all"
              >
                <BookOpen className="h-4 w-4 text-brand-500" />
                {t('academic')}
              </a>
              <a
                href={homeAnchor('btec-track')}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/60 transition-all"
              >
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                {t('btec')}
              </a>

              {/* Admin Links */}
              {isAdminOrTeacher && (
                <>
                  <div className="border-t border-slate-800/60 my-2" />
                  <Link
                    href="/admin/analytics"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-slate-900/60 transition-all"
                  >
                    <BarChart2 className="h-4 w-4" />
                    {currentLocale === 'ar' ? 'لوحة الإحصائيات' : 'Analytics'}
                  </Link>
                  <Link
                    href="/admin/coupons"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-slate-900/60 transition-all"
                  >
                    <Key className="h-4 w-4" />
                    {currentLocale === 'ar' ? 'إدارة الكوبونات' : 'Coupon Manager'}
                  </Link>
                  <Link
                    href="/admin/courses"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-slate-900/60 transition-all"
                  >
                    <GraduationCap className="h-4 w-4" />
                    {currentLocale === 'ar' ? 'إدارة الدورات' : 'Courses'}
                  </Link>
                  <Link
                    href="/admin/quizzes"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-slate-900/60 transition-all"
                  >
                    <BookOpen className="h-4 w-4" />
                    {currentLocale === 'ar' ? 'إدارة الاختبارات' : 'Quizzes'}
                  </Link>
                  <Link
                    href="/admin/teachers"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-amber-400 hover:text-amber-300 hover:bg-slate-900/60 transition-all"
                  >
                    <Users className="h-4 w-4" />
                    {currentLocale === 'ar' ? 'المعلمون' : 'Teachers'}
                  </Link>
                </>
              )}

              {/* Parent Link */}
              {isParent && (
                <>
                  <div className="border-t border-slate-800/60 my-2" />
                  <Link
                    href="/parent/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-teal-400 hover:text-teal-300 hover:bg-slate-900/60 transition-all"
                  >
                    {currentLocale === 'ar' ? 'متابعة ابني' : 'My Child'}
                  </Link>
                </>
              )}

              <div className="border-t border-slate-800/60 my-2" />

              {/* Auth Actions */}
              {user ? (
                <>
                  {user.isMasterAdmin && (
                    <>
                      <div className="border-t border-slate-800/60 my-2" />
                      <p className="px-4 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider">{currentLocale === 'ar' ? 'محاكاة دور' : 'Simulate Role'}</p>
                      <div className="grid grid-cols-2 gap-2 px-4 py-2">
                        {['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'].map(r => (
                          <button
                            key={r}
                            onClick={() => handleRoleSwitch(r)}
                            disabled={switchingRole}
                            className={`flex items-center justify-center py-2 rounded-xl text-xs font-bold transition-all ${user.role === r ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-slate-800/60 my-2" />
                    </>
                  )}
                  <Link
                    href={isParent ? '/parent/dashboard' : (isAdminOrTeacher ? '/admin/courses' : '/dashboard')}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-amber-600"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {currentLocale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:text-white hover:bg-rose-500/10 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    {currentLocale === 'ar' ? 'تسجيل الخروج' : 'Log Out'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-slate-300 border border-slate-800 hover:border-slate-600 hover:text-white transition-all"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-amber-600"
                  >
                    {t('register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
