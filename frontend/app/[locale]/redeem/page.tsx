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

  const [studentCoupons, setStudentCoupons] = useState<any[]>([]);

  const fetchStudentCoupons = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/student/coupons', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudentCoupons(data.coupons || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStudentCoupons();
    }
  }, [user]);

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
        fetchStudentCoupons(); // Refresh the list
        return;
      }
      setErrorMsg(data.error || (isRtl ? 'كود غير صحيح' : 'Invalid code'));
      setStatus('error');
    } catch (err) {
      setErrorMsg(isRtl ? 'خطأ في الاتصال بالسيرفر' : 'Connection error');
      setStatus('error');
    }
  };

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

        <div className={`flex items-center gap-3 p-4 rounded-2xl border mb-6 bg-amber-500/5 border-amber-500/20 text-amber-300`}>
          <Calendar className="h-4 w-4 shrink-0" />
          <p className="text-xs font-semibold">
            {isRtl ? 'الكوبون صالح لغاية تاريخ الانتهاء المحدد له' : 'Coupons are valid until their specified expiration date'}
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
                  <li>{isRtl ? '• الكوبونات تنتهي صلاحيتها في تاريخ الانتهاء المحدد لها' : '• Coupons expire on their specified expiration date'}</li>
                  <li>{isRtl ? '• الكوبون مرتبط بمادة دراسية واحدة' : '• Each coupon unlocks one specific course'}</li>
                  <li>{isRtl ? '• لا يمكن نقل الكوبون لطالب آخر' : '• Coupons cannot be transferred to another student'}</li>
                </ul>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Codes Section */}
        {user && (
          <div className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">
              {isRtl ? 'الكوبونات المفعلة الخاصة بك' : 'Your Redeemed Coupons'}
            </h2>
            {studentCoupons.length === 0 ? (
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl text-center text-sm text-slate-500">
                {isRtl ? 'لا توجد كوبونات مفعلة حتى الآن' : 'No redeemed coupons yet'}
              </div>
            ) : (
              <div className="space-y-3">
                {studentCoupons.map((coupon, idx) => {
                  const endsAt = coupon.expiresAt 
                    ? new Date(coupon.expiresAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US', { dateStyle: 'long' })
                    : (isRtl ? 'غير محدد' : 'Not specified');
                  
                  return (
                    <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="h-4 w-4 text-brand-500 shrink-0" />
                          <h3 className="text-sm font-bold text-white truncate">
                            {isRtl ? coupon.course?.titleAr : coupon.course?.titleEn}
                          </h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="font-mono text-slate-300">{coupon.code}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {isRtl ? `ينتهي في: ${endsAt}` : `Ends at: ${endsAt}`}
                          </span>
                        </div>
                      </div>
                      <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-3xs font-bold uppercase tracking-wider shrink-0">
                        {isRtl ? 'مفعل' : 'Active'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
