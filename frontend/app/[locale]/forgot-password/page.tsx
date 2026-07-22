'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, CheckCircle, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isRtl ? 'حدث خطأ ما، يرجى المحاولة لاحقاً' : 'An error occurred'));
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-brand-500/10 blur-[100px] pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-400">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {isRtl ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
          </h1>
          <p className="text-sm text-slate-400">
            {isRtl
              ? 'أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.'
              : 'Enter your email and we will send you a password reset link.'}
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <p className="text-sm text-slate-300 font-medium">
              {isRtl
                ? 'تم إرسال تعليمات إعادة التعيين إلى بريدك الإلكتروني إذا كان مسجلاً لدينا.'
                : 'Reset instructions have been sent to your email if registered.'}
            </p>
            <p className="text-xs text-slate-500">
              {isRtl ? 'يرجى تفقد صندوق الوارد وصندوق الرسائل غير المرغوب فيها (Spam).' : 'Please check your Inbox and Spam folder.'}
            </p>
            <Link
              href={`/${locale}/login`}
              className="inline-flex items-center gap-2 mt-4 text-brand-400 hover:text-brand-300 font-bold text-sm"
            >
              {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
              {isRtl ? 'العودة إلى تسجيل الدخول' : 'Return to Login'}
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
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isRtl ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 ps-11 pe-4 text-sm text-slate-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  placeholder={isRtl ? 'example@domain.com' : 'example@domain.com'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/20 transition-all duration-300 disabled:opacity-50"
            >
              {loading
                ? (isRtl ? 'جاري الإرسال...' : 'Sending...')
                : (isRtl ? 'إرسال رابط إعادة التعيين' : 'Send Reset Link')}
            </button>

            <div className="text-center pt-2">
              <Link
                href={`/${locale}/login`}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                {isRtl ? 'العودة لصفحة الدخول' : 'Back to Login'}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
