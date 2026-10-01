'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, notFound } from 'next/navigation';
import Link from 'next/link';

function VerifyContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams?.get('email');

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const isAr = locale === 'ar';

  useEffect(() => {
    if (!email) {
      router.push(`/${locale}/login`);
    }
  }, [email, router, locale]);

  if (!email) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setError(isAr ? 'الرجاء إدخال الرمز المكون من 6 أرقام' : 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'));
      }

      // Success
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('dashboardTrack');
      window.dispatchEvent(new Event('local-storage-update'));

      const role = data.user?.role || 'STUDENT';
      if (role === 'TEACHER') {
        window.location.href = `/${locale}/studio/courses`;
      } else if (role === 'PARENT') {
        window.location.href = `/${locale}/parent/dashboard`;
      } else {
        window.location.href = `/${locale}/dashboard`;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setResendMessage('');

    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || (isAr ? 'حدث خطأ أثناء الإرسال' : 'Error resending code'));
      }

      setResendMessage(isAr ? 'تم إرسال الرمز الجديد بنجاح!' : 'New code sent successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md p-8 bg-[#0f172a] rounded-2xl border border-slate-800 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">
            {isAr ? 'تأكيد البريد الإلكتروني' : 'Verify Email'}
          </h1>
          <p className="text-slate-400 text-sm">
            {isAr ? 'أدخل الرمز المكون من 6 أرقام المرسل إلى:' : 'Enter the 6-digit code sent to:'}
            <br />
            <span className="font-semibold text-sky-400">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/50 rounded-xl text-rose-500 text-sm">
            {error}
          </div>
        )}

        {resendMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl text-emerald-500 text-sm">
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="w-full text-center text-3xl tracking-[1em] font-bold bg-[#020617] border border-slate-700 rounded-xl p-4 text-slate-100 focus:outline-none focus:border-sky-500 transition-colors"
              dir="ltr"
            />
          </div>

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (isAr ? 'جاري التأكيد...' : 'Verifying...') : (isAr ? 'تأكيد الحساب' : 'Verify Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm mb-4">
            {isAr ? 'لم يصلك الرمز؟' : 'Didn\'t receive the code?'}
          </p>
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sky-400 hover:text-sky-300 font-medium text-sm disabled:opacity-50 transition-colors"
          >
            {resendLoading ? (isAr ? 'جاري الإرسال...' : 'Resending...') : (isAr ? 'إرسال الرمز مجدداً' : 'Resend Code')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage({ params }: { params: { locale: string } }) {
  const safeLocale = params.locale === 'en' ? 'en' : 'ar';
  
  return (
    <div className="min-h-screen bg-[#020617] py-20 px-4">
      <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}>
        <VerifyContent locale={safeLocale} />
      </Suspense>
    </div>
  );
}
