'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import Link from 'next/link';
import { 
  User, 
  Lock, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Loader2,
  Shield
} from 'lucide-react';

export default function SettingsPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [user, setUser] = useState<any>(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.replace('/login');
      return;
    }
    try {
      setUser(JSON.parse(userStr));
    } catch (e) {}
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg(isRtl ? 'كلمات المرور الجديدة لا تتطابق' : 'New passwords do not match');
      setStatus('error');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg(isRtl ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setErrorMsg(data.error || (isRtl ? 'خطأ في تغيير كلمة المرور' : 'Error changing password'));
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg(isRtl ? 'خطأ في الاتصال بالخادم' : 'Server connection error');
      setStatus('error');
    }
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-[#020617] font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{isRtl ? 'لوحة التحكم' : 'Dashboard'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">{isRtl ? 'إعدادات الحساب' : 'Account Settings'}</span>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-12 pb-20 relative z-10">
        {/* Profile Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 mb-8 flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-amber-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
            {(user?.nameAr || user?.nameEn || 'U').charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{isRtl ? (user?.nameAr || 'مستخدم') : (user?.nameEn || user?.nameAr || 'User')}</h2>
            <p className="text-slate-400 text-sm mt-1">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-brand-400">
              <User className="h-3 w-3" />
              <span>{user.role}</span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <Shield className="h-5 w-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">
              {isRtl ? 'تغيير كلمة المرور' : 'Change Password'}
            </h3>
          </div>

          {status === 'success' && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{isRtl ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!'}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isRtl ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                {isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Key className="h-4 w-4" />
                  <span>{isRtl ? 'حفظ كلمة المرور الجديدة' : 'Update Password'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
