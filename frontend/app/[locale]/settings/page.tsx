'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Lock, Save, Loader2, User, Key, CheckCircle2, ArrowRight, ArrowLeft, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export default function SettingsPage() {
  const t = useTranslations('auth'); // Using auth translations since it's related
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [user, setUser] = useState<any>(null);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  
  // Password change state
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
    setUser(JSON.parse(userStr));

    // Fetch analytics
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/student/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(d => {
        if (d.quizAttempts) setQuizAttempts(d.quizAttempts);
      })
      .catch(e => console.error(e));

      // Fetch basic courses for progress
      fetch('/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(r => r.json())
      .then(d => {
        if (d.courses) {
           const parsed = JSON.parse(localStorage.getItem('user') || '{}');
           const track = parsed.trackType || 'ACADEMIC';
           let filtered = d.courses.filter((c: any) => c.published && c.track === track);
           
           // very simple compute
           let completedLessonIds = [];
           try {
             const stored = localStorage.getItem(`completed-lessons-${parsed.id}`);
             if (stored) completedLessonIds = JSON.parse(stored);
           } catch(e) {}
           
           filtered = filtered.map((c: any) => {
             if (c.lessons) {
                const total = c.lessons.length || 1;
                const mastered = c.lessons.filter((l: any) => completedLessonIds.includes(l.id)).length;
                c.mockProgress = Math.round((mastered / total) * 100);
             }
             return c;
           });
           setCourses(filtered);
        }
      })
      .catch(e => console.error(e));
    }
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
        

        {/* Performance & Analytics Section */}
        {user?.role === 'STUDENT' && (
          <div className="mb-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mt-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-brand-500/20 rounded-xl border border-brand-500/30">
                <TrendingUp className="h-6 w-6 text-brand-400" />
              </div>
              <h2 className="text-xl font-black text-white">
                {locale === 'ar' ? 'تحليل الأداء والمتابعة' : 'Performance & Analytics'}
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Course Progress Chart */}
              <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-5">
                <h3 className="text-slate-300 font-bold mb-6 text-sm">
                  {locale === 'ar' ? 'نسبة الإنجاز في المواد' : 'Course Progress Completion'}
                </h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={courses.filter((c: any) => !c.locked && c.mockProgress !== undefined && c.mockProgress > 0)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey={locale === 'ar' ? 'titleAr' : 'titleEn'} 
                        stroke="#64748b" 
                        fontSize={12} 
                        tickFormatter={(val: string) => val.length > 15 ? val.substring(0, 15) + '...' : val}
                      />
                      <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                        formatter={(value: any) => [`${value}%`, locale === 'ar' ? 'الإنجاز' : 'Progress']}
                      />
                      <Bar dataKey="mockProgress" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quiz Scores Chart */}
              <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-5">
                <h3 className="text-slate-300 font-bold mb-6 text-sm">
                  {locale === 'ar' ? 'نتائج الاختبارات الأخيرة' : 'Recent Quiz Scores'}
                </h3>
                {quizAttempts.length > 0 ? (
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={quizAttempts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis 
                          dataKey="date" 
                          stroke="#64748b" 
                          fontSize={12}
                          tickFormatter={(val: string) => new Date(val).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US', { month: 'short', day: 'numeric' })}
                        />
                        <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                          labelFormatter={(label: any) => new Date(label).toLocaleString(locale === 'ar' ? 'ar-JO' : 'en-US')}
                          formatter={(value: any, name: any, props: any) => [`${value}%`, props.payload[locale === 'ar' ? 'quizTitleAr' : 'quizTitleEn']]}
                        />
                        <Line type="monotone" dataKey="scorePercent" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b', strokeWidth: 0 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[250px] w-full flex items-center justify-center text-slate-500 text-sm">
                    {locale === 'ar' ? 'لم تقم بتقديم أي اختبارات بعد.' : 'You have not attempted any quizzes yet.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 mb-8 flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-500 to-amber-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
            {user.nameAr.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{isRtl ? user.nameAr : user.nameEn || user.nameAr}</h2>
            <p className="text-slate-400 text-sm mt-1">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-brand-400">
              <User className="h-3 w-3" />
              <span>{user.role}</span>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Key className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {isRtl ? 'تغيير كلمة المرور' : 'Change Password'}
            </h3>
          </div>
          
          <form onSubmit={handlePasswordChange} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">
                {isRtl ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 ps-11 pe-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">
                {isRtl ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 ps-11 pe-4 text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300">
                {isRtl ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-700 bg-slate-950/50 py-3.5 ps-11 pe-4 text-sm text-white placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {status === 'error' && errorMsg && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-sm text-rose-400 font-medium">
                {errorMsg}
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-sm text-emerald-400 font-medium">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span>{isRtl ? 'تم تغيير كلمة المرور بنجاح!' : 'Password successfully updated!'}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 mt-4"
            >
              {status === 'loading' ? (
                <><Loader2 className="h-5 w-5 animate-spin" /><span>{isRtl ? 'جاري الحفظ...' : 'Saving...'}</span></>
              ) : (
                <><Save className="h-5 w-5" /><span>{isRtl ? 'حفظ التغييرات' : 'Save Changes'}</span></>
              )}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
