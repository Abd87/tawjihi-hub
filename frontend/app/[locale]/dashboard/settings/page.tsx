'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { User, Lock, Phone, Save, Loader2, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SettingsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  
  const [user, setUser] = useState<any>(null);
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
    </div>
  );
}
