'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { 
  BarChart2, 
  BookOpen, 
  HelpCircle, 
  Users, 
  Settings, 
  GraduationCap, 
  Ticket, 
  FileText,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Globe,
  PenTool,
  Newspaper,
  Send
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function AdminSidebar() {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  const router = useRouter();
  
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ nameAr: string; nameEn: string; role: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}

    const handleToggle = () => setCollapsed(prev => !prev);
    window.addEventListener('toggle-admin-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-admin-sidebar', handleToggle);
  }, []);

  // Ensure it's collapsed on mobile initially
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  const navItems = [
    { href: '/admin/analytics', icon: BarChart2, labelEn: 'Analytics', labelAr: 'التحليلات', roles: ['ADMIN'] },
    { href: '/admin/courses', icon: BookOpen, labelEn: 'Courses', labelAr: 'الدورات', roles: ['ADMIN', 'TEACHER'] },
    { href: '/admin/quizzes', icon: HelpCircle, labelEn: 'Quizzes', labelAr: 'الاختبارات', roles: ['ADMIN', 'TEACHER'] },
    { href: '/admin/users', icon: Users, labelEn: 'Users', labelAr: 'المستخدمين', roles: ['ADMIN'] },
    { href: '/admin/teachers', icon: GraduationCap, labelEn: 'Teachers', labelAr: 'المعلمين', roles: ['ADMIN'] },
    { href: '/admin/coupons', icon: Ticket, labelEn: 'Coupons', labelAr: 'الكوبونات', roles: ['ADMIN'] },
    { href: '/admin/applications', icon: FileText, labelEn: 'Applications', labelAr: 'طلبات التوظيف', roles: ['ADMIN'] },
    { href: '/admin/broadcast', icon: Send, labelEn: 'Broadcast Emails', labelAr: 'الرسائل الجماعية', roles: ['ADMIN'] },
    { href: '/admin/blog', icon: Newspaper, labelEn: 'Blog & News', labelAr: 'المدونة والأخبار', roles: ['ADMIN'] },
    { href: '/studio', icon: PenTool, labelEn: 'Studio', labelAr: 'الاستوديو', roles: ['ADMIN', 'TEACHER'] },
    { href: '/studio/grade11-exams', icon: BookOpen, labelEn: 'Grade 11 Exams', labelAr: 'امتحانات الأول ثانوي', roles: ['ADMIN'] },
    { href: '/admin/settings', icon: Settings, labelEn: 'Settings', labelAr: 'الإعدادات', roles: ['ADMIN'] },
  ];

  const visibleItems = navItems.filter(item => user && item.roles.includes(user.role));

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = `/${locale}/login`;
  };

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {!collapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-[#020617]/60 z-40 backdrop-blur-sm" 
          onClick={() => setCollapsed(true)}
        />
      )}
      
      <aside className={`print:hidden fixed lg:relative inset-y-0 start-0 h-[100dvh] lg:h-full bg-[#020617] border-${isRtl ? 'l' : 'r'} border-slate-800 transition-transform duration-300 flex flex-col shrink-0 z-50 
        ${collapsed ? (isRtl ? 'translate-x-full lg:translate-x-0 lg:w-20' : '-translate-x-full lg:translate-x-0 lg:w-20') : 'translate-x-0 w-64'}
      `}>
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        {!collapsed && (
          <Link href="/" className="font-bold text-lg bg-gradient-to-r from-brand-400 to-amber-500 bg-clip-text text-transparent truncate hover:opacity-80 transition-opacity">
            {isRtl ? 'توجيهي هب' : 'Tawjihi Hub'}
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ms-auto"
        >
          {collapsed 
            ? (isRtl ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />)
            : (isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />)
          }
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-4 space-y-1 px-3 custom-scrollbar">
        {visibleItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive 
                  ? 'bg-brand-500/10 text-brand-400 font-semibold' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              title={collapsed ? (isRtl ? item.labelAr : item.labelEn) : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
              {!collapsed && (
                <span className="truncate">{isRtl ? item.labelAr : item.labelEn}</span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-800 space-y-2 shrink-0">
        <button 
          onClick={toggleLanguage}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? (isRtl ? 'English' : 'العربية') : undefined}
        >
          <Globe className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{isRtl ? 'English' : 'العربية'}</span>}
        </button>
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? (isRtl ? 'تسجيل الخروج' : 'Logout') : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>}
        </button>
        </div>
      </aside>
    </>
  );
}
