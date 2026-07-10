'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import Link from 'next/link';
import {
  GraduationCap,
  Key,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  XCircle
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  courseId: string;
  course: { titleAr: string; titleEn: string };
  isActive: boolean;
  expiresAt?: string;
  usedBy?: { studentId: string; nameAr: string; nameEn?: string; email: string } | null;
  usedAt?: string | null;
  createdAt: string;
}

export default function RedeemCouponPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [redeemedCourse, setRedeemedCourse] = useState<{ titleAr: string; titleEn: string } | null>(null);
  const [user, setUser] = useState<{ id: string; nameAr: string; nameEn?: string; email: string; role: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.replace('/login');
      return;
    }
    const parsedUser = JSON.parse(userStr);
    setUser(parsedUser);
  }, [router]);

  const addCourseToStudentLocally = (courseId: string, course: { titleAr: string; titleEn: string }) => {
    if (!user) return;
    const key = `student-redeemed-courses-${user.id}`;
    const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (!existing.includes(courseId)) {
      existing.push(courseId);
      localStorage.setItem(key, JSON.stringify(existing));
    }
    const globalKey = 'student-redeemed-courses-global';
    const global: { studentId: string; courseId: string; redeemedAt: string }[] =
      JSON.parse(localStorage.getItem(globalKey) || '[]');
    global.push({ studentId: user.id, courseId, redeemedAt: new Date().toISOString() });
    localStorage.setItem(globalKey, JSON.stringify(global));
  };

  const redeemOffline = (trimmedCode: string) => {
    const EXPIRY = new Date('2026-07-31T23:59:59.000Z');
    const now = new Date();
    try {
      const stored = localStorage.getItem('admin-coupons');
      const coupons: Coupon[] = stored ? JSON.parse(stored) : [];
      const coupon = coupons.find(c => c.code.toUpperCase() === trimmedCode);

      if (!coupon) {
        setErrorMsg(isRtl ? 'الكود غير موجود أو غير صحيح' : 'Code not found or invalid');
        setStatus('error');
        return;
      }

      const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : EXPIRY;
      if (now > expiresAt) {
        setErrorMsg(isRtl ? 'انتهت صلاحية هذا الكوبون' : 'This coupon expired');
        setStatus('error');
        return;
      }

      if (!coupon.isActive) {
        if (coupon.usedBy?.studentId === user?.id) {
          setRedeemedCourse(coupon.course);
          addCourseToStudentLocally(coupon.courseId, coupon.course);
          setStatus('success');
          return;
        }
        setErrorMsg(isRtl ? 'تم استخدام هذا الكوبون بالفعل من قِبل طالب آخر' : 'This coupon has already been used by another student');
        setStatus('error');
        return;
      }

      const updatedCoupons = coupons.map(c => {
        if (c.id === coupon.id) {
          return {
            ...c,
            isActive: false,
            usedBy: {
              studentId: user!.id,
              nameAr: user!.nameAr,
              nameEn: user!.nameEn,
              email: user!.email
            },
            usedAt: new Date().toISOString()
          };
        }
        return c;
      });

      localStorage.setItem('admin-coupons', JSON.stringify(updatedCoupons));
      addCourseToStudentLocally(coupon.courseId, coupon.course);
      setRedeemedCourse(coupon.course);
      setStatus('success');
    } catch {
      setErrorMsg(isRtl ? 'خطأ في التحقق. حاول مرة أخرى.' : 'Verification error. Please try again.');
      setStatus('error');
    }
  };

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode || !user) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ code: trimmedCode })
      });
      const data = await res.json();
      if (res.ok) {
        setRedeemedCourse(data.course);
        addCourseToStudentLocally(data.courseId, data.course);
        setStatus('success');
        return;
      }
      setErrorMsg(data.error || (isRtl ? 'كود غير صحيح' : 'Invalid code'));
      setStatus('error');
      return;
    } catch {}
    redeemOffline(trimmedCode);
  };

  const EXPIRY_DATE = new Date('2026-07-31T23:59:59.000Z');
  const isExpired = new Date() > EXPIRY_DATE;

  return (
    <div className={`min-h-screen bg-[#020617] font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            {isRtl
              ? <><ArrowRight className="h-4 w-4" /><span>لوحة التحكم</span></>
              : <><ArrowLeft className="h-4 w-4" /><span>Dashboard</span></>
            }
          </Link>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-br from-brand-500 to-amber-600 rounded-lg text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-base font-bold text-white">Tawjihi Hub</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-12 pb-20 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/20 to-amber-500/20 border border-brand-500/30 mb-4">
            <Key className="h-8 w-8 text-brand-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            {isRtl ? 'استخدم كوبون الدخول' : 'Redeem Access Coupon'}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {isRtl ? 'أدخل كود الكوبون الخاص بك للوصول إلى المادة الدراسية' : 'Enter your coupon code to unlock access to your course'}
          </p>
        </div>

        <div className={`flex items-center gap-3 p-4 rounded-2xl border mb-6 ${isExpired ? 'bg-rose-500/5 border-rose-500/20 text-rose-300' : 'bg-amber-500/5 border-amber-500/20 text-amber-300'}`}>
          <Calendar className="h-4 w-4 shrink-0" />
          <p className="text-xs font-semibold">
            {isExpired ? (isRtl ? 'انتهت صلاحية جميع الكوبونات في 31 يوليو 2026' : 'All coupons expired on July 31, 2026') : (isRtl ? 'صلاحية الكوبونات تنتهي في 31 يوليو 2026' : 'Coupons are valid until July 31, 2026')}
          </p>
        </div>

        {status === 'success' && redeemedCourse && (
          <div className="text-center p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-xl font-black text-emerald-400 mb-2">{isRtl ? 'تم تفعيل الكوبون!' : 'Coupon Activated!'}</h2>
            <p className="text-slate-300 text-sm mb-1">{isRtl ? 'تم فتح الوصول إلى:' : 'Access unlocked for:'}</p>
            <p className="text-white font-bold text-base mb-6">{isRtl ? redeemedCourse.titleAr : redeemedCourse.titleEn}</p>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard" className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all">
                <BookOpen className="h-4 w-4" />
                {isRtl ? 'ابدأ الدراسة الآن' : 'Start Learning Now'}
              </Link>
              <button onClick={() => { setStatus('idle'); setCode(''); setRedeemedCourse(null); }} className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl transition-all">
                <Sparkles className="h-4 w-4" />
                {isRtl ? 'استخدام كوبون آخر' : 'Redeem Another Coupon'}
              </button>
            </div>
          </div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleRedeem} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isRtl ? 'كود الكوبون' : 'Coupon Code'}
              </label>
              <input type="text" value={code} onChange={e => { setCode(e.target.value.toUpperCase()); if (status === 'error') setStatus('idle'); }} placeholder={isRtl ? 'مثال: HUB-MATH-2026' : 'e.g. HUB-MATH-2026'} dir="ltr" className={`w-full py-4 px-5 text-center text-xl font-black font-mono tracking-[0.2em] bg-slate-900 border-2 rounded-2xl text-white placeholder:text-slate-700 focus:outline-none transition-all ${status === 'error' ? 'border-rose-500/60' : 'border-slate-700 focus:border-brand-500'}`} autoComplete="off" spellCheck={false} />
            </div>
            {status === 'error' && errorMsg && (
              <div className="flex items-start gap-3 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                <XCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-300 font-medium">{errorMsg}</p>
              </div>
            )}
            <button type="submit" disabled={!code.trim() || status === 'loading'} className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-brand-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-base">
              {status === 'loading' ? <><Loader2 className="h-5 w-5 animate-spin" /><span>{isRtl ? 'جاري التحقق...' : 'Verifying...'}</span></> : <><Key className="h-5 w-5" /><span>{isRtl ? 'تفعيل الكوبون' : 'Activate Coupon'}</span></>}
            </button>
          </form>
        )}

        {status !== 'success' && (
          <div className="mt-8 p-5 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-slate-300 mb-2">{isRtl ? 'ملاحظات مهمة:' : 'Important Notes:'}</p>
                <ul className="text-xs text-slate-500 space-y-1">
                  <li>{isRtl ? '• كل كوبون يُستخدم مرة واحدة فقط' : '• Each coupon can only be used once'}</li>
                  <li>{isRtl ? '• الكوبونات تنتهي صلاحيتها في نهاية يوليو 2026' : '• Coupons expire at end of July 2026'}</li>
                  <li>{isRtl ? '• الكوبون مرتبط بمادة دراسية واحدة' : '• Each coupon unlocks one specific course'}</li>
                  <li>{isRtl ? '• لا يمكن نقل الكوبون لطالب آخر' : '• Coupons cannot be transferred to another student'}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
