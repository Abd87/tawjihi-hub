'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function RoleSimulator() {
  const params = useParams();
  const router = useRouter();
  const currentLocale = (params?.locale as string) || 'ar';
  const isRtl = currentLocale === 'ar';

  const [user, setUser] = useState<{ role: string; isMasterAdmin?: boolean } | null>(null);
  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  if (!user || !user.isMasterAdmin) return null;

  const handleRoleSwitch = async (targetRole: string) => {
    if (targetRole === user.role) return;
    setSwitching(true);
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
        if (targetRole === 'TEACHER') redirectPath = `/${currentLocale}/admin/courses`;
        if (targetRole === 'PARENT') redirectPath = `/${currentLocale}/parent/dashboard`;
        
        window.location.href = redirectPath;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-400">
            {isRtl ? 'محاكي الأدوار (للمدير فقط)' : 'Role Simulator (Admin Only)'}
          </h3>
          <p className="text-xs text-amber-500/70">
            {isRtl ? 'غيّر دورك الحالي لاختبار المنصة دون الحاجة لتسجيل الخروج' : 'Switch your role instantly to test the platform without logging out'}
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        {['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'].map((r) => (
          <button
            key={r}
            disabled={switching}
            onClick={() => handleRoleSwitch(r)}
            className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              user.role === r 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                : 'bg-slate-900 border border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-amber-400'
            }`}
          >
            {switching && user.role !== r ? <Loader2 className="h-3 w-3 animate-spin mx-auto" /> : r}
          </button>
        ))}
      </div>
    </div>
  );
}
