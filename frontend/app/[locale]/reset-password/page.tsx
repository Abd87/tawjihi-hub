'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle, ShieldAlert, ArrowLeft, ArrowRight } from 'lucide-react';

export default function ResetPasswordPage({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError(isRtl ? 'رابط إعادة التعيين غير صالح' : 'Invalid reset link');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(isRtl ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError(isRtl ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isRtl ? 'حدث خطأ أثناء تحديث كلمة المرور' : 'Error updating password'));
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h1 className="text-xl font-bold text-white">
            {isRtl ? 'رابط غير صالح' : 'Invalid Link'}
          </h1>
          <p className="text-sm text-slate-400">
            {isRtl
              ? 'الرابط المستخدم غير مكتمل أو منتهي الصلاحية. يرجى طلب رابط جديد.'
              : 'The link is missing or expired. Please request a new link.'}
          </p>
          <Link
            href={`/${locale}/forgot-password`}
            className="inline-block px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl"
          >
            {isRtl ? 'طلب رابط جديد' : 'Request New Link'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-brand-500/10 blur-[100px] pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-400">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isRtl ? 'تعيين كلمة مرور جديدة' : 'Reset New Password'}
          </h1>
          <p className="text-sm text-slate-400">
            {isRtl ? 'أدخل كلمة المرور الجديدة لحسابك' : 'Enter your new account password'}
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-sm text-slate-200 font-bold">
              {isRtl ? 'تم تغيير كلمة المرور بنجاح! 🎉' : 'Password changed successfully! 🎉'}
            </p>
            <Link
              href={`/${locale}/login`}
              className="inline-block w-full py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl transition-colors mt-4"
            >
              {isRtl ? 'تسجيل الدخول الآن' : 'Log In Now'}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="newPassword" className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  id="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 ps-11 pe-4 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? 'تأكيد كلمة المرور' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <Lock className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 ps-11 pe-4 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/20 transition-all duration-300 disabled:opacity-50"
            >
              {loading
                ? (isRtl ? 'جاري الحفظ...' : 'Saving...')
                : (isRtl ? 'حفظ كلمة المرور الجديدة' : 'Save New Password')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
