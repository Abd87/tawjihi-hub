'use client';

import { usePathname } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';

export default function AdminTopNav() {
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  
  // Basic mapping of paths to titles
  const titles: Record<string, { en: string, ar: string }> = {
    '/admin/analytics': { en: 'Analytics', ar: 'التحليلات' },
    '/admin/courses': { en: 'Courses', ar: 'إدارة الدورات' },
    '/admin/quizzes': { en: 'Quizzes', ar: 'إدارة الاختبارات' },
    '/admin/users': { en: 'Users', ar: 'المستخدمين' },
    '/admin/teachers': { en: 'Teachers', ar: 'المعلمين' },
    '/admin/coupons': { en: 'Coupons', ar: 'الكوبونات' },
    '/admin/applications': { en: 'Applications', ar: 'طلبات التوظيف' },
    '/admin/settings': { en: 'Settings', ar: 'الإعدادات' },
  };

  const currentTitle = titles[pathname] || { en: 'Admin Dashboard', ar: 'لوحة التحكم' };

  return (
    <header className="print:hidden h-16 flex items-center px-6 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10 shrink-0 gap-4">
      <button 
        className="lg:hidden p-2 -ms-2 hover:bg-slate-800 rounded-lg text-slate-300 transition-colors"
        onClick={() => window.dispatchEvent(new Event('toggle-admin-sidebar'))}
      >
        <Menu className="h-6 w-6" />
      </button>
      <h1 className="text-xl font-bold text-white">
        {isRtl ? currentTitle.ar : currentTitle.en}
      </h1>
      {/* Additional top right elements can go here if needed */}
    </header>
  );
}
