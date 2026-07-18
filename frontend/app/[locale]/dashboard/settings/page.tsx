'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { User, Lock, Phone, Save, Loader2, CheckCircle2, ShieldAlert, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

export default function SettingsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  
  const [user, setUser] = useState<any>(null);
  const [quizAttempts, setQuizAttempts] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (data.user.phoneNumber) {
            setPhoneNumber(data.user.phoneNumber);
          }
          
          // Fetch analytics & courses
          const token = localStorage.getItem('token');
          if (token && data.user.role === 'STUDENT') {
            fetch('/api/student/analytics', { headers: { 'Authorization': `Bearer ${token}` }})
            .then(r => r.json()).then(d => { if(d.quizAttempts) setQuizAttempts(d.quizAttempts); })
            .catch(e => console.error(e));

            fetch('/api/courses', { headers: { 'Authorization': `Bearer ${token}` }})
            .then(r => r.json()).then(d => {
              if (d.courses) {
                 const track = data.user.trackType || 'ACADEMIC';
                 let filtered = d.courses.filter((c: any) => c.published && c.track === track);
                 let completedLessonIds: string[] = [];
                 try {
                   const stored = localStorage.getItem(`completed-lessons-${data.user.id}`);
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
            }).catch(e=>console.error(e));
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    setError(null);
    setProfileSuccess(false);

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }
      
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPassword(true);
    setError(null);
    setPasswordSuccess(false);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to change password');
      }
      
      setOldPassword('');
      setNewPassword('');
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          {locale === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
        </h1>
        <p className="text-slate-400">
          {locale === 'ar' ? 'إدارة معلوماتك الشخصية وكلمة المرور.' : 'Manage your personal info and password.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <ShieldAlert className="h-5 w-5" />
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Settings */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 start-0 w-1 h-full bg-brand-500"></div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User className="h-5 w-5 text-brand-400" />
            {locale === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
          </h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {locale === 'ar' ? 'الاسم' : 'Name'}
              </label>
              <input
                type="text"
                disabled
                value={locale === 'ar' ? user.nameAr : (user.nameEn || user.nameAr)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-500 cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <input
                type="text"
                disabled
                value={user.email}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-2.5 px-4 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 start-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-slate-500 group-focus-within:text-brand-500 transition-colors" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-slate-600"
                  placeholder={locale === 'ar' ? '079XXXXXXX' : '079XXXXXXX'}
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingProfile}
              className="w-full flex items-center justify-center gap-2 py-3 mt-6 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {loadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
            </button>
            
            {profileSuccess && (
              <p className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1 mt-2">
                <CheckCircle2 className="h-3 w-3" />
                {locale === 'ar' ? 'تم الحفظ بنجاح' : 'Saved successfully'}
              </p>
            )}
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 start-0 w-1 h-full bg-blue-500"></div>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-400" />
            {locale === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
          </h2>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {locale === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {locale === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loadingPassword}
              className="w-full flex items-center justify-center gap-2 py-3 mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
            >
              {loadingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {locale === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
            </button>

            {passwordSuccess && (
              <p className="text-emerald-400 text-xs font-bold flex items-center justify-center gap-1 mt-2">
                <CheckCircle2 className="h-3 w-3" />
                {locale === 'ar' ? 'تم تحديث كلمة المرور' : 'Password updated'}
              </p>
            )}
          </form>
        </div>

      </div>

      {/* Performance & Analytics Section */}
      {user?.role === 'STUDENT' && (
        <div className="mb-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mt-8 col-span-1 md:col-span-2">
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

    </div>
  );
}
