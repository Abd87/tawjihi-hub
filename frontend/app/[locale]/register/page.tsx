'use client';

import { useState, useEffect, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams, useSearchParams } from 'next/navigation';
import {
  Globe,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  Users,
  Compass,
  Layers,
  BookOpen,
  ShieldAlert,
  Sparkles,
  Loader2,
  CheckCircle2,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function saveUserToAdminUsers(user: Record<string, unknown>, passwordRaw: string) {
  try {
    const stored = localStorage.getItem('admin-users');
    const users: Array<Record<string, unknown>> = stored ? JSON.parse(stored) : [];
    // Avoid duplicates
    const exists = users.some((u) => (u.email as string)?.toLowerCase() === (user.email as string)?.toLowerCase());
    if (!exists) {
      users.push({ ...user, password: passwordRaw });
      localStorage.setItem('admin-users', JSON.stringify(users));
    }
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Main Form component
// ---------------------------------------------------------------------------
function RegisterForm() {
  const t = useTranslations('auth');
  const navT = useTranslations('navigation');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const searchParams = useSearchParams();

  // step: 0 = Role select, 1 = Track select (students only), 2 = Account details
  const [step, setStep] = useState(0);
  const [roleType, setRoleType] = useState<'STUDENT' | 'PARENT' | null>(null);
  const [trackType, setTrackType] = useState<'ACADEMIC' | 'BTEC' | null>(null);

  useEffect(() => {
    const trackParam = searchParams.get('track');
    if (trackParam === 'ACADEMIC' || trackParam === 'BTEC') {
      setTrackType(trackParam);
    }
  }, [searchParams]);

  // Account fields
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [linkedStudentEmail, setLinkedStudentEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace('/register', { locale: nextLocale });
  };

  // ── Breadcrumb helpers ──
  // Student: Step 0 → Step 1 → Step 2  (3 steps, breadcrumb shows 1,2,3)
  // Parent:  Step 0 → Step 2            (2 steps, breadcrumb shows 1,2)
  const isStudent = roleType === 'STUDENT';
  const isParent = roleType === 'PARENT';

  // Display step number for breadcrumb
  function breadcrumbActive(crumbStep: 0 | 1 | 2) {
    return step === crumbStep;
  }
  function breadcrumbDone(crumbStep: 0 | 1 | 2) {
    return step > crumbStep;
  }

  // ── Navigation ──
  const goNext = () => { setError(null); setStep((s) => s + 1); };
  const goPrev = () => { setError(null); setStep((s) => s - 1); };

  const handleRoleSelect = (role: 'STUDENT' | 'PARENT') => {
    setRoleType(role);
    setError(null);
  };

  const handleRoleContinue = () => {
    if (!roleType) {
      setError(locale === 'ar' ? 'يرجى تحديد نوع الحساب' : 'Please select an account type');
      return;
    }
    if (roleType === 'STUDENT') {
      setStep(1); // → track selection
    } else {
      setStep(2); // → account details
    }
  };

  const handleTrackContinue = () => {
    if (!trackType) {
      setError(locale === 'ar' ? 'يرجى تحديد المسار أولاً للمتابعة' : 'Please select a track to proceed');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handlePrevFromDetails = () => {
    setError(null);
    if (isStudent) {
      setStep(1);
    } else {
      setStep(0);
    }
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    const role = roleType || 'STUDENT';
    const bodyPayload: Record<string, unknown> = {
      email,
      password,
      nameAr,
      nameEn: nameEn || undefined,
      phoneNumber: phoneNumber || undefined,
      role,
    };
    if (role === 'STUDENT') bodyPayload.trackType = trackType;
    if (role === 'PARENT') bodyPayload.linkedStudentEmail = linkedStudentEmail;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.fieldErrors) {
          const errorsObj: Record<string, string> = {};
          for (const key in data.fieldErrors) {
             errorsObj[key] = data.fieldErrors[key][0];
          }
          setFieldErrors(errorsObj);
          throw new Error('ValidationFailed');
        }
        throw new Error(data.error || t('errorGeneric'));
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('dashboardTrack');
      saveUserToAdminUsers(data.user, password);
      window.dispatchEvent(new Event('local-storage-update'));

      const redirect = role === 'PARENT' ? `/${locale}/parent/dashboard` : `/${locale}/dashboard`;
      window.location.href = redirect;
    } catch (err: any) {
      if (err.message !== 'ValidationFailed') {
        setError(err.message || (locale === 'ar' ? 'حدث خطأ أثناء التسجيل' : 'Registration failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const renderArrow = (direction: 'forward' | 'backward') => {
    if (direction === 'forward') {
      return locale === 'ar' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />;
    }
    return locale === 'ar' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />;
  };

  // ── Breadcrumb ──
  const renderBreadcrumb = () => {
    // Steps shown to user
    const studentSteps = [
      { key: 0, label: locale === 'ar' ? 'نوع الحساب' : 'Role' },
      { key: 1, label: locale === 'ar' ? 'المسار' : 'Track' },
      { key: 2, label: locale === 'ar' ? 'البيانات' : 'Details' },
    ];
    const parentSteps = [
      { key: 0, label: locale === 'ar' ? 'نوع الحساب' : 'Role' },
      { key: 2, label: locale === 'ar' ? 'البيانات' : 'Details' },
    ];
    const steps = isParent ? parentSteps : studentSteps;

    return (
      <div className="flex items-center justify-center gap-2 mb-8 text-xs font-semibold uppercase tracking-wider">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full transition-colors ${
                step === s.key
                  ? 'text-brand-400 bg-brand-500/10 border border-brand-500/20'
                  : step > s.key
                  ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  : 'text-slate-500 border border-slate-800'
              }`}
            >
              {step > s.key ? <CheckCircle2 className="h-3 w-3 inline me-1" /> : null}
              {s.label}
            </span>
            {i < steps.length - 1 && <span className="h-px w-6 bg-slate-800" />}
          </div>
        ))}
      </div>
    );
  };

  // ── Card max width ──
  const cardMaxW = step === 1 ? 'max-w-3xl' : 'max-w-md';

  return (
    <div className="relative min-h-screen bg-[#020617] flex flex-col justify-between overflow-hidden selection:bg-brand-500/30 selection:text-brand-300">

      {/* Decorative blurs */}
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />



      {/* Main content */}
      <main className="flex-grow flex items-center justify-center p-4 pt-32 z-10 my-8">
        <div className={`relative w-full transition-all duration-300 ${cardMaxW}`}>
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-brand-500 to-amber-600 opacity-20 blur pointer-events-none" />

          <div className="relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl">

            {/* Breadcrumb */}
            {renderBreadcrumb()}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-300 text-xs sm:text-sm mb-6">
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* ══════════ STEP 0: Role Selection ══════════ */}
            {step === 0 && (
              <div>
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-xs font-semibold mb-3">
                    <Sparkles className="h-3 w-3" />
                    <span>{locale === 'ar' ? 'إنشاء حساب جديد' : 'Create Account'}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {locale === 'ar' ? 'من أنت؟' : 'Who are you?'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    {locale === 'ar' ? 'اختر نوع حسابك للمتابعة' : 'Choose your account type to continue'}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                  {/* Student card */}
                  <div
                    onClick={() => handleRoleSelect('STUDENT')}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-3 shadow-lg ${
                      roleType === 'STUDENT'
                        ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/30'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-600'
                    }`}
                  >
                    {roleType === 'STUDENT' && (
                      <CheckCircle2 className="absolute top-4 end-4 h-5 w-5 text-amber-500" />
                    )}
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">
                        {locale === 'ar' ? 'طالب' : 'Student'}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {locale === 'ar'
                          ? 'سجّل كطالب توجيهي للوصول إلى الدروس والمحتوى التعليمي'
                          : 'Register as a Tawjihi student to access lessons and learning content'}
                      </p>
                    </div>
                    <div className="mt-auto pt-3 border-t border-slate-900 flex items-center gap-2 text-xs text-slate-500">
                      <BookOpen className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>{locale === 'ar' ? 'المسار العلمي أو المهني' : 'Academic or BTEC track'}</span>
                    </div>
                  </div>

                  {/* Parent card */}
                  <div
                    onClick={() => handleRoleSelect('PARENT')}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col gap-3 shadow-lg ${
                      roleType === 'PARENT'
                        ? 'border-teal-500 bg-teal-500/5 ring-1 ring-teal-500/30'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-600'
                    }`}
                  >
                    {roleType === 'PARENT' && (
                      <CheckCircle2 className="absolute top-4 end-4 h-5 w-5 text-teal-500" />
                    )}
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-500/10 text-teal-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-1">
                        {locale === 'ar' ? 'ولي أمر' : 'Parent'}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {locale === 'ar'
                          ? 'سجّل كولي أمر لمتابعة تقدم ابنك/ابنتك الدراسي'
                          : 'Register as a parent to track your child\'s learning progress'}
                      </p>
                    </div>
                    <div className="mt-auto pt-3 border-t border-slate-900 flex items-center gap-2 text-xs text-slate-500">
                      <Users className="h-4 w-4 text-teal-500 shrink-0" />
                      <span>{locale === 'ar' ? 'عرض التقارير والتقدم فقط' : 'Read-only progress reports'}</span>
                    </div>
                  </div>
                </div>

                {/* Teachers/Admins note */}
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-500 text-xs mb-6">
                  <Info className="h-4 w-4 shrink-0 mt-0.5 text-slate-600" />
                  <span>
                    {locale === 'ar'
                      ? 'حسابات المعلمين والمديرين يتم إنشاؤها من قبل المسؤول فقط.'
                      : 'Teacher and Admin accounts are created by administrators only.'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRoleContinue}
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-lg shadow-brand-500/20 transition-all"
                >
                  <span>{locale === 'ar' ? 'المتابعة' : 'Continue'}</span>
                  {renderArrow('forward')}
                </button>
              </div>
            )}

            {/* ══════════ STEP 1: Track Selection (Students only) ══════════ */}
            {step === 1 && (
              <div>
                <div className="text-center mb-10">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {t('chooseTrackTitle')}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    {t('chooseTrackDesc')}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* BTEC */}
                  <div
                    onClick={() => { setTrackType('BTEC'); setError(null); }}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-lg ${
                      trackType === 'BTEC'
                        ? 'border-brand-500 bg-brand-500/5 ring-1 ring-brand-500/30'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-600'
                    }`}
                  >
                    {trackType === 'BTEC' && <CheckCircle2 className="absolute top-4 end-4 h-5 w-5 text-brand-500" />}
                    <div>
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 mb-4">
                        <Compass className="h-5 w-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2">{t('btecOptionTitle')}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed">{t('btecOptionDesc')}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-2 text-xs text-slate-500">
                      <Layers className="h-4 w-4 text-brand-500 shrink-0" />
                      <span>{locale === 'ar' ? 'يحتوي فقط على 4 مواد وزارية أساسية' : 'Contains only 4 ministry subjects'}</span>
                    </div>
                  </div>

                  {/* Academic */}
                  <div
                    onClick={() => { setTrackType('ACADEMIC'); setError(null); }}
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-lg ${
                      trackType === 'ACADEMIC'
                        ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/30'
                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-600'
                    }`}
                  >
                    {trackType === 'ACADEMIC' && <CheckCircle2 className="absolute top-4 end-4 h-5 w-5 text-blue-500" />}
                    <div>
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-4">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2">{t('academicOptionTitle')}</h3>
                      <p className="text-xs sm:text-sm text-slate-400 mb-4 leading-relaxed">{t('academicOptionDesc')}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center gap-2 text-xs text-slate-500">
                      <Layers className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>{locale === 'ar' ? 'الرياضيات، الفيزياء، الكيمياء، الأحياء والمزيد' : 'Math, Physics, Chem, Bio & more'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-950 text-slate-300 text-sm font-semibold transition-all shrink-0"
                  >
                    {renderArrow('backward')}
                  </button>
                  <button
                    type="button"
                    onClick={handleTrackContinue}
                    className="flex-grow flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-xl shadow-brand-500/25 transition-all"
                  >
                    <span>{locale === 'ar' ? 'المتابعة لتسجيل البيانات' : 'Continue to Details'}</span>
                    {renderArrow('forward')}
                  </button>
                </div>
              </div>
            )}

            {/* ══════════ STEP 2: Account Details ══════════ */}
            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {t('registerTitle')}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    {t('registerSub')}
                  </p>

                  {/* Selected role/track pill */}
                  <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full border border-slate-800 bg-slate-950 text-xs text-slate-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    {isStudent && trackType && (
                      <>
                        <span>{locale === 'ar' ? 'المسار المحدد:' : 'Track:'}</span>
                        <span className="font-bold text-brand-500">
                          {trackType === 'ACADEMIC' ? t('academicOptionTitle') : t('btecOptionTitle')}
                        </span>
                      </>
                    )}
                    {isParent && (
                      <span className="font-bold text-teal-400">
                        {locale === 'ar' ? 'ولي أمر' : 'Parent Account'}
                      </span>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Arabic Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="nameAr" className="block text-xs sm:text-sm font-semibold text-slate-300">
                      {t('nameArLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="nameAr"
                        required
                        value={nameAr}
                        onChange={(e) => setNameAr(e.target.value)}
                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 ps-11 pe-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                        placeholder={t('nameArPlaceholder')}
                      />
                    </div>
                    {fieldErrors.nameAr && <p className="text-red-500 text-xs mt-1">{t(fieldErrors.nameAr)}</p>}
                  </div>

                  {/* English Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="nameEn" className="block text-xs sm:text-sm font-semibold text-slate-300">
                      {t('nameEnLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-500">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="nameEn"
                        value={nameEn}
                        onChange={(e) => setNameEn(e.target.value)}
                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 ps-11 pe-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                        placeholder={t('nameEnPlaceholder')}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-300">
                      {t('emailLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-500">
                        <Mail className="h-4 w-4" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 ps-11 pe-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                        placeholder={t('emailPlaceholder')}
                      />
                    </div>
                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{t(fieldErrors.email)}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-300">
                      {t('passwordLabel')}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 ps-11 pe-11 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                        placeholder={t('passwordPlaceholder')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{t(fieldErrors.password)}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label htmlFor="phoneNumber" className="block text-xs sm:text-sm font-semibold text-slate-300">
                      {locale === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-500">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        id="phoneNumber"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="block w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 ps-11 pe-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                        placeholder={locale === 'ar' ? '079XXXXXXX' : '079XXXXXXX'}
                        dir="ltr"
                      />
                    </div>
                    {fieldErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{t(fieldErrors.phoneNumber)}</p>}
                  </div>

                  {/* Linked Student Email — Parents only */}
                  {isParent && (
                    <div className="space-y-1.5">
                      <label htmlFor="linkedStudentEmail" className="block text-xs sm:text-sm font-semibold text-slate-300">
                        {locale === 'ar' ? 'البريد الإلكتروني للطالب المرتبط' : 'Linked Student Email'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-500">
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <input
                          type="email"
                          id="linkedStudentEmail"
                          required
                          value={linkedStudentEmail}
                          onChange={(e) => setLinkedStudentEmail(e.target.value)}
                          className="block w-full rounded-xl border border-teal-900/50 bg-teal-950/20 py-3 ps-11 pe-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all"
                          placeholder={locale === 'ar' ? 'student@tawjihi.jo' : 'student@tawjihi.jo'}
                        />
                      </div>
                      <p className="text-xs text-slate-600 ps-1">
                        {locale === 'ar'
                          ? 'أدخل البريد الإلكتروني لحساب ابنك/ابنتك الطالب'
                          : "Enter your child's registered student email"}
                      </p>
                    </div>
                  )}

                  {/* Privacy Policy Checkbox */}
                  <div className="flex items-start gap-2 pt-2">
                    <input 
                      type="checkbox" 
                      id="privacyPolicy" 
                      required 
                      className="mt-0.5 shrink-0 accent-brand-500 w-4 h-4 rounded border-slate-700 bg-slate-900"
                    />
                    <label htmlFor="privacyPolicy" className="text-xs text-slate-400 leading-tight">
                      {locale === 'ar' ? 'لقد قرأت وأوافق على ' : 'I have read and agree to the '}
                      <Link href="/privacy-policy" target="_blank" className="text-brand-500 hover:text-brand-400 underline underline-offset-2">
                        {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
                      </Link>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handlePrevFromDetails}
                      className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-600 bg-slate-950 text-slate-300 text-sm font-semibold transition-all shrink-0"
                    >
                      {renderArrow('backward')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-grow flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-lg shadow-brand-500/20 transition-all disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>{t('registerBtn')}</span>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Login redirect */}
            <div className="mt-8 text-center text-xs sm:text-sm text-slate-400">
              <span>{t('alreadyHaveAccount')}{' '}</span>
              <Link href="/login" className="text-brand-500 hover:text-brand-400 font-bold transition-colors">
                {t('loginBtn')}
              </Link>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 flex items-center justify-center z-10">
        <Link href="/" className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors">
          {locale === 'ar' ? (
            <>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <span>العودة للرئيسية</span>
            </>
          ) : (
            <>
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to home</span>
            </>
          )}
        </Link>
      </footer>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Suspense wrapper (preserves original pattern)
// ---------------------------------------------------------------------------
export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
