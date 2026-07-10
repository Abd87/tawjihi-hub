'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import {
  Globe,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  ShieldAlert,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ---------------------------------------------------------------------------
// Hardcoded offline test accounts
// ---------------------------------------------------------------------------
const OFFLINE_ACCOUNTS = [
  {
    email: 'admin@tawjihi.jo',
    password: 'admin123',
    user: {
      id: 'offline-admin-1',
      email: 'admin@tawjihi.jo',
      role: 'ADMIN',
      nameAr: 'مدير النظام',
      nameEn: 'System Admin',
    },
  },
  {
    email: 'btec.teacher@tawjihi.jo',
    password: 'teacher123',
    user: {
      id: 'offline-teacher-btec',
      email: 'btec.teacher@tawjihi.jo',
      role: 'TEACHER',
      nameAr: 'أ. محمد المهني',
      nameEn: 'Mohammed Al-Mehani',
      trackType: 'BTEC',
    },
  },
  {
    email: 'acad.teacher@tawjihi.jo',
    password: 'teacher123',
    user: {
      id: 'offline-teacher-acad',
      email: 'acad.teacher@tawjihi.jo',
      role: 'TEACHER',
      nameAr: 'أ. أحمد العلمي',
      nameEn: 'Ahmad Al-Ilmi',
      trackType: 'ACADEMIC',
    },
  },
  {
    email: 'student@tawjihi.jo',
    password: 'student123',
    user: {
      id: 'offline-student-1',
      email: 'student@tawjihi.jo',
      role: 'STUDENT',
      nameAr: 'سارة الأكاديمية',
      nameEn: 'Sara Academic',
      trackType: 'ACADEMIC',
    },
  },
  {
    email: 'parent@tawjihi.jo',
    password: 'parent123',
    user: {
      id: 'offline-parent-1',
      email: 'parent@tawjihi.jo',
      role: 'PARENT',
      nameAr: 'ولي أمر',
      nameEn: 'Parent User',
      linkedStudentEmail: 'student@tawjihi.jo',
    },
  },
];

// Quick-login pill labels
const QUICK_ACCOUNTS = [
  { label: 'Admin', email: 'admin@tawjihi.jo', password: 'admin123' },
  { label: 'BTEC Teacher', email: 'btec.teacher@tawjihi.jo', password: 'teacher123' },
  { label: 'Acad Teacher', email: 'acad.teacher@tawjihi.jo', password: 'teacher123' },
  { label: 'Student', email: 'student@tawjihi.jo', password: 'student123' },
  { label: 'Parent', email: 'parent@tawjihi.jo', password: 'parent123' },
];

// ---------------------------------------------------------------------------
// Role → redirect path
// ---------------------------------------------------------------------------
function getRedirectPath(role: string, locale: string): string {
  if (role === 'TEACHER') return `/${locale}/admin/courses`;
  if (role === 'PARENT') return `/${locale}/parent/dashboard`;
  return `/${locale}/dashboard`;
}

// ---------------------------------------------------------------------------
// Login Page
// ---------------------------------------------------------------------------
export default function LoginPage() {
  const t = useTranslations('auth');
  const navT = useTranslations('navigation');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  const toggleLanguage = () => {
    const nextLocale = locale === 'ar' ? 'en' : 'ar';
    router.replace('/login', { locale: nextLocale });
  };

  // -------------------------------------------------------------------------
  // Offline login: check admin-users first, then hardcoded fallback
  // -------------------------------------------------------------------------
  function tryOfflineLogin(emailInput: string, passwordInput: string): {
    user: Record<string, unknown>;
    token: string;
  } | null {
    const e = emailInput.trim().toLowerCase();
    const p = passwordInput;

    // 1) Check admin-users localStorage
    try {
      const stored = localStorage.getItem('admin-users');
      if (stored) {
        const users: Array<Record<string, unknown>> = JSON.parse(stored);
        const found = users.find(
          (u) =>
            (u.email as string)?.toLowerCase() === e &&
            (u.password as string) === p
        );
        if (found) {
          const payload = { ...found };
          delete payload.password;
          const stringified = JSON.stringify(payload);
          const base64 = window.btoa(unescape(encodeURIComponent(stringified)));
          const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64}.mock-signature`;
          return { user: payload, token };
        }
      }
    } catch {
      // ignore JSON errors
    }

    // 2) Hardcoded fallbacks
    const match = OFFLINE_ACCOUNTS.find(
      (a) => a.email === e && a.password === p
    );
    if (match) {
      const payload = { ...match.user };
      const stringified = JSON.stringify(payload);
      const base64 = window.btoa(unescape(encodeURIComponent(stringified)));
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${base64}.mock-signature`;
      return { user: payload as Record<string, unknown>, token };
    }

    return null;
  }

  // -------------------------------------------------------------------------
  // Submit handler
  // -------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('errorGeneric'));
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('local-storage-update'));

      const role = data.user?.role || 'STUDENT';
      window.location.href = getRedirectPath(role, locale);
    } catch {
      // Try offline
      const offline = tryOfflineLogin(email, password);
      if (offline) {
        localStorage.setItem('token', offline.token);
        localStorage.setItem('user', JSON.stringify(offline.user));
        window.dispatchEvent(new Event('local-storage-update'));
        const role = (offline.user.role as string) || 'STUDENT';
        window.location.href = getRedirectPath(role, locale);
        return;
      }

      setError(
        locale === 'ar'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Quick fill
  // -------------------------------------------------------------------------
  const quickFill = (acc: { email: string; password: string }) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError(null);
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-[#020617] flex flex-col justify-between overflow-hidden selection:bg-brand-500/30 selection:text-brand-300">

      {/* Decorative Blur Circles */}
      <div className="absolute top-[-10%] start-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />



      {/* Main card */}
      <main className="flex-grow flex items-center justify-center p-4 pt-32 z-10">
        <div className="relative w-full max-w-md">
          {/* Neon glow border */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-brand-500 to-amber-600 opacity-20 blur pointer-events-none" />

          <div className="relative bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl">

            {/* Title & Badge */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-xs font-semibold mb-3">
                <Sparkles className="h-3 w-3" />
                <span>Grade 12 E-Learning</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {t('loginTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                {t('loginSub')}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-300 text-xs sm:text-sm mb-6 animate-shake">
                <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-slate-300">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4.5 w-4.5" />
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
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-300">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-slate-800 bg-slate-950/80 py-3 ps-11 pe-4 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-all"
                    placeholder={t('passwordPlaceholder')}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span>{t('loginBtn')}</span>
                )}
              </button>
            </form>

            {/* Register link */}
            <div className="mt-6 text-center text-xs sm:text-sm text-slate-400">
              <span>{t('dontHaveAccount')}{' '}</span>
              <Link href="/register" className="text-brand-500 hover:text-brand-400 font-bold transition-colors">
                {t('registerBtn')}
              </Link>
            </div>

            {/* ── Quick Login Section ── */}
            <div className="mt-6 border-t border-slate-800/60 pt-4">
              <button
                type="button"
                onClick={() => setQuickOpen((v) => !v)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                <Zap className="h-3 w-3" />
                <span>{locale === 'ar' ? 'تسجيل دخول سريع (حسابات تجريبية)' : 'Quick Login (Test Accounts)'}</span>
                {quickOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>

              {quickOpen && (
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {QUICK_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => quickFill(acc)}
                      className="px-2.5 py-1 rounded-full text-xs bg-slate-900 border border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-all"
                    >
                      {acc.label}
                    </button>
                  ))}
                </div>
              )}
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
