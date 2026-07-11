'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Layers, 
  Sparkles, 
  Save, 
  Loader2, 
  CheckCircle2, 
  HelpCircle,
  Key,
  ShieldCheck,
  UserCheck,
  Copy,
  Check,
  ChevronDown,
  BookOpen,
  X,
  PlusCircle,
  Printer,
  Calendar,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  track?: 'BTEC' | 'ACADEMIC';
  custom?: boolean;
}

interface Coupon {
  id: string;
  code: string;
  courseId: string;
  course: {
    titleAr: string;
    titleEn: string;
  };
  isActive: boolean;
  expiresAt?: string;
  usedBy?: {
    studentId?: string;
    nameAr: string;
    nameEn?: string;
    email: string;
  } | null;
  usedAt?: string | null;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const t = useTranslations('admin');
  const tCoupon = useTranslations('coupon');
  const tAnalytics = useTranslations('analytics');
  const navT = useTranslations('navigation');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [authorized, setAuthorized] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState(false);
  const [selectedForPrint, setSelectedForPrint] = useState<string[]>([]);
  
  // Form states
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedStream, setSelectedStream] = useState<'BTEC' | 'ACADEMIC'>('BTEC');
  const [customCode, setCustomCode] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [couponExpiry, setCouponExpiry] = useState('2026-07-31');

  const COUPON_EXPIRY = couponExpiry ? new Date(couponExpiry + 'T23:59:59.000Z').toISOString() : '2026-07-31T23:59:59.000Z';

  // Manage Subjects panel
  const [manageOpen, setManageOpen] = useState(false);
  const [newSubjectAr, setNewSubjectAr] = useState('');
  const [newSubjectEn, setNewSubjectEn] = useState('');
  const [newSubjectStream, setNewSubjectStream] = useState<'BTEC' | 'ACADEMIC'>('BTEC');
  const [subjectError, setSubjectError] = useState<string | null>(null);

  const CUSTOM_SUBJECTS_KEY = 'admin-custom-subjects';

  const loadCustomSubjects = (): Course[] => {
    try { return JSON.parse(localStorage.getItem(CUSTOM_SUBJECTS_KEY) || '[]'); }
    catch { return []; }
  };

  const handleAddSubject = () => {
    const ar = newSubjectAr.trim();
    const en = newSubjectEn.trim();
    if (!ar || !en) { setSubjectError(locale === 'ar' ? 'يرجى تعبئة الاسم بالعربية والإنجليزية' : 'Please fill in both Arabic and English names'); return; }
    setSubjectError(null);
    const newSubject: Course = {
      id: `custom-${newSubjectStream.toLowerCase()}-${Date.now()}`,
      titleAr: ar,
      titleEn: en,
      track: newSubjectStream,
      custom: true,
    };
    const existing = loadCustomSubjects();
    const updated = [...existing, newSubject];
    localStorage.setItem(CUSTOM_SUBJECTS_KEY, JSON.stringify(updated));
    setCourses(prev => [...prev, newSubject]);
    setNewSubjectAr('');
    setNewSubjectEn('');
  };

  const handleDeleteSubject = (id: string) => {
    const existing = loadCustomSubjects();
    const updated = existing.filter(s => s.id !== id);
    localStorage.setItem(CUSTOM_SUBJECTS_KEY, JSON.stringify(updated));
    setCourses(prev => prev.filter(c => c.id !== id));
    if (selectedCourseId === id) setSelectedCourseId('');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
        return;
      }

      const decoded = decodeToken(token);
      const hasAccess = decoded?.role === 'ADMIN' || decoded?.role === 'TEACHER';
      
      if (!hasAccess) {
        router.replace('/dashboard');
        return;
      }

      setAuthorized(true);

      try {
        // Fetch courses list from admin API (to get all courses in DB)
        const coursesRes = await fetch('/api/admin/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData.courses);
          if (coursesData.courses.length > 0) {
            setSelectedCourseId(coursesData.courses[0].id);
          }
        }

        // Fetch coupons list
        const couponsRes = await fetch('/api/coupons', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (couponsRes.ok) {
          const couponsData = await couponsRes.json();
          setCoupons(couponsData.coupons);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [router]);

  const handleGenerateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    setFormLoading(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    
    try {
      if (token) {
        const res = await fetch('/api/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            courseId: selectedCourseId,
            code: customCode.trim() || undefined,
            expiresAt: COUPON_EXPIRY
          })
        });

        const data = await res.json();
        
        if (res.ok) {
          setSuccess(tAnalytics('generateSuccess'));
          setCustomCode('');
          setCoupons([data.coupon, ...coupons]);
        } else {
          setError(data.error || 'Failed to generate coupon');
        }
      }
    } catch (err) {
      console.error(err);
      setError('Connection error');
    } finally {
      setFormLoading(false);
    }
  };

  if (!authorized || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
        <span>Loading Admin Panel...</span>
      </div>
    );
  }

  const isRtl = locale === 'ar';

  return (
    <div className="relative min-h-screen bg-[#020617] font-sans pb-16 selection:bg-brand-500/30 selection:text-brand-300">
      
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none print:hidden" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none print:hidden" />



      <main className="max-w-4xl mx-auto px-4 pt-32 z-10 relative space-y-8 print:hidden">
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl">
            <Key className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {tAnalytics('couponTitle')}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Generate scratch card coupons and unlock codes for grade 12 subject materials
            </p>
          </div>
        </div>

        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-visible">
          <div className="absolute top-0 start-0 w-[3px] h-full bg-brand-500 rounded-s-2xl" />
          
          <h2 className="text-sm sm:text-base font-extrabold text-white mb-5 flex items-center gap-2">
            <Plus className="h-4 w-4 text-brand-500" />
            <span>{tAnalytics('createCouponBtn')}</span>
          </h2>

          <div className="mb-5">
            <p className="text-xs font-bold text-slate-400 mb-2">
              {isRtl ? 'الخطوة 1 — اختر المسار التعليمي' : 'Step 1 — Choose Stream'}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedStream('BTEC');
                  setSelectedCourseId('');
                  setSubjectOpen(false);
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${
                  selectedStream === 'BTEC'
                    ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-brand-500/50 hover:text-brand-400'
                }`}
              >
                <span>🟠</span>
                <span>{isRtl ? 'مسار BTEC المهني' : 'BTEC Vocational'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedStream('ACADEMIC');
                  setSelectedCourseId('');
                  setSubjectOpen(false);
                }}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${
                  selectedStream === 'ACADEMIC'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-blue-500/50 hover:text-blue-400'
                }`}
              >
                <span>🔵</span>
                <span>{isRtl ? 'المسار الأكاديمي' : 'Academic Tawjihi'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleGenerateCoupon} className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">
                {isRtl ? 'الخطوة 2 — اختر المادة الدراسية' : 'Step 2 — Choose Subject'}
              </p>

              <button
                type="button"
                onClick={() => setSubjectOpen(prev => !prev)}
                className={`w-full py-3 px-4 text-sm bg-slate-950 border rounded-xl font-semibold focus:outline-none transition-all flex items-center justify-between gap-2 text-start ${
                  subjectOpen
                    ? selectedStream === 'BTEC'
                      ? 'border-brand-500 text-white rounded-b-none'
                      : 'border-blue-500 text-white rounded-b-none'
                    : selectedCourseId
                      ? 'border-slate-700 text-white'
                      : 'border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span className="truncate">
                  {(() => {
                    const sel = courses.find(c => c.id === selectedCourseId);
                    if (!sel) return isRtl ? '— اختر المادة الدراسية —' : '— Select a subject —';
                    return (isRtl ? sel.titleAr : sel.titleEn);
                  })()}
                </span>
                <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                  subjectOpen
                    ? selectedStream === 'BTEC' ? 'rotate-180 text-brand-400' : 'rotate-180 text-blue-400'
                    : 'text-slate-500'
                }`} />
              </button>

              {/* Inline subject list — expands below trigger, no clipping possible */}
              {subjectOpen && (
                <div className={`border rounded-b-xl overflow-hidden ${
                  selectedStream === 'BTEC' ? 'border-brand-500/60' : 'border-blue-500/60'
                }`}>
                  {courses
                    .filter(c => {
                      const t = (c as any).track;
                      if (selectedStream === 'BTEC') return t === 'BTEC' || c.id.startsWith('mock-btec-');
                      return t === 'ACADEMIC' || c.id.startsWith('mock-acad-');
                    })
                    .map((course, idx, arr) => {
                      const label = (isRtl ? course.titleAr : course.titleEn).replace(/^──[^──]*──\s*/, '');
                      const isSel = selectedCourseId === course.id;
                      return (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => { setSelectedCourseId(course.id); setSubjectOpen(false); }}
                          className={`w-full text-start px-5 py-3.5 text-sm font-semibold transition-all flex items-center gap-3 ${
                            idx < arr.length - 1 ? 'border-b border-slate-800/60' : ''
                          } ${
                            isSel
                              ? selectedStream === 'BTEC'
                                ? 'bg-brand-500/20 text-brand-200'
                                : 'bg-blue-500/20 text-blue-200'
                              : 'bg-slate-950 text-slate-300 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          {isSel
                            ? <Check className={`h-4 w-4 shrink-0 ${ selectedStream === 'BTEC' ? 'text-brand-400' : 'text-blue-400' }`} />
                            : <span className="w-4 shrink-0" />
                          }
                          <span>{label}</span>
                        </button>
                      );
                    })
                  }
                </div>
              )}
            </div>

            {/* Step 3: Custom Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400">
                {isRtl ? 'الخطوة 3 — كود مخصص (اختياري، سيُنشأ تلقائياً)' : 'Step 3 — Custom Code (optional, auto-generated if empty)'}
              </label>
              <input
                type="text"
                placeholder={isRtl ? 'مثال: HUB-CHEM-7890' : 'e.g. HUB-CHEM-7890'}
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                className="w-full py-3 px-4 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-brand-500 transition-colors uppercase tracking-wider"
              />
            </div>

            {/* Step 4: Expiry Date + Generate button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-brand-500" />
                  {isRtl ? 'الخطوة 4 — تاريخ انتهاء الصلاحية' : 'Step 4 — Expiry Date'}
                </label>
                <input
                  type="date"
                  value={couponExpiry}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCouponExpiry(e.target.value)}
                  className="w-full py-3 px-4 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-brand-500 transition-colors [color-scheme:dark]"
                />
                <p className="text-xs text-slate-600">
                  {couponExpiry
                    ? (isRtl
                        ? `ينتهي في: ${new Date(couponExpiry + 'T00:00:00').toLocaleDateString('ar-JO', { day: 'numeric', month: 'long', year: 'numeric' })}`
                        : `Expires: ${new Date(couponExpiry + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`
                      )
                    : (isRtl ? 'اختر تاريخ الانتهاء' : 'Choose expiry date')
                  }
                </p>
              </div>
              <button
                type="submit"
                disabled={formLoading || !selectedCourseId || !couponExpiry}
                className={`py-3 px-4 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
                  selectedCourseId && couponExpiry
                    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30'
                    : 'bg-slate-900 text-slate-600 cursor-not-allowed'
                }`}
              >
                {formLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{isRtl ? 'إنشاء كوبون' : 'Generate'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Feedback */}
            {error && (
              <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

          </form>
        </div>

        {/* Coupons List Table */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-brand-500" />
              <span>{tAnalytics('viewCoupons')}</span>
              <span className="text-xs font-normal text-slate-500 ml-1">({coupons.length})</span>
            </h2>

            {/* Print Cards Button */}
            <div className="flex items-center gap-2">
              {printMode && (
                <span className="text-xs text-amber-400 font-semibold">
                  {selectedForPrint.length} {locale === 'ar' ? 'محدد' : 'selected'}
                </span>
              )}
              <button
                onClick={() => {
                  if (!printMode) {
                    setPrintMode(true);
                    setSelectedForPrint(coupons.filter(c => c.isActive).map(c => c.id));
                  } else {
                    if (selectedForPrint.length === 0) { setPrintMode(false); return; }
                    
                    // Change title for PDF save name
                    const originalTitle = document.title;
                    const firstCoupon = coupons.find(c => c.id === selectedForPrint[0]);
                    if (firstCoupon) {
                      document.title = `${firstCoupon.course.titleEn || firstCoupon.course.titleAr} Code`;
                    }
                    
                    setTimeout(() => {
                      window.print();
                      setTimeout(() => { document.title = originalTitle; }, 100);
                    }, 50);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600/10 border border-violet-500/20 text-violet-400 hover:bg-violet-600/20 transition-all"
              >
                <Printer className="h-4 w-4" />
                {printMode
                  ? (locale === 'ar' ? 'طباعة الكروت المحددة' : 'Print Selected Cards')
                  : (locale === 'ar' ? 'طباعة الكروت' : 'Print Cards')
                }
              </button>
              {printMode && (
                <button
                  onClick={() => { setPrintMode(false); setSelectedForPrint([]); }}
                  className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors border border-slate-800 hover:border-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 text-2xs font-extrabold uppercase tracking-wider">
                  {printMode && <th className="py-3 px-3 text-start w-8"></th>}
                  <th className="py-3 px-4 text-start">{tAnalytics('code')}</th>
                  <th className="py-3 px-4 text-start">{tAnalytics('courseTitle')}</th>
                  <th className="py-3 px-4 text-start">{tAnalytics('status')}</th>
                  <th className="py-3 px-4 text-start">{locale === 'ar' ? 'الصلاحية' : 'Expiry'}</th>
                  <th className="py-3 px-4 text-start">{tAnalytics('redeemedBy')}</th>
                  <th className="py-3 px-4 text-start">{tAnalytics('redeemedAt')}</th>
                  <th className="py-3 px-4 text-start">{locale === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950/40">
                {coupons.map((coupon) => {
                  const isExpired = coupon.expiresAt ? new Date() > new Date(coupon.expiresAt) : false;
                  const expiryDisplay = coupon.expiresAt
                    ? new Date(coupon.expiresAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '31 Jul 2026';

                  return (
                    <tr key={coupon.id} className={`hover:bg-slate-900/5 transition-colors ${printMode && selectedForPrint.includes(coupon.id) ? 'bg-violet-500/5' : ''}`}>
                      {printMode && (
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={selectedForPrint.includes(coupon.id)}
                            onChange={e => {
                              if (e.target.checked) setSelectedForPrint(prev => [...prev, coupon.id]);
                              else setSelectedForPrint(prev => prev.filter(id => id !== coupon.id));
                            }}
                            className="rounded border-slate-600 bg-slate-900 text-brand-500 focus:ring-brand-500"
                          />
                        </td>
                      )}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-brand-400 uppercase tracking-wide text-xs sm:text-sm">{coupon.code}</span>
                          <button
                            onClick={() => handleCopyCode(coupon.code)}
                            className="p-1 rounded text-slate-600 hover:text-brand-400 transition-colors"
                            title={locale === 'ar' ? 'نسخ الكود' : 'Copy code'}
                          >
                            {copiedCode === coupon.code ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-semibold max-w-[180px] truncate">
                        {isRtl ? coupon.course.titleAr : coupon.course.titleEn}
                      </td>
                      <td className="py-3.5 px-4">
                        {coupon.isActive && !isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold text-3xs uppercase tracking-wider">
                            <ShieldCheck className="h-3 w-3" />
                            <span>{tAnalytics('active')}</span>
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-rose-500/20 bg-rose-500/5 text-rose-400 font-bold text-3xs uppercase tracking-wider">
                            <AlertTriangle className="h-3 w-3" />
                            <span>{locale === 'ar' ? 'منتهي' : 'Expired'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-500 font-bold text-3xs uppercase tracking-wider">
                            <span>{tAnalytics('used')}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className={`flex items-center gap-1.5 text-xs font-semibold ${isExpired ? 'text-rose-400' : 'text-slate-400'}`}>
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{expiryDisplay}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-medium">
                        {coupon.usedBy ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <UserCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                              <span className="text-xs font-bold text-slate-300">{coupon.usedBy.nameAr}</span>
                            </div>
                            <p className="text-xs text-slate-600 ps-5">{coupon.usedBy.email}</p>
                          </div>
                        ) : (
                          <span className="text-slate-700">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium text-xs">
                        {coupon.usedAt ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1 text-slate-400">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span>{new Date(coupon.usedAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <p className="ps-4">{new Date(coupon.usedAt).toLocaleTimeString(isRtl ? 'ar-JO' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        ) : '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        {coupon.isActive && !isExpired && (
                          <button
                            onClick={() => {
                              const updated = coupons.map(c =>
                                c.id === coupon.id ? { ...c, isActive: false } : c
                              );
                              setCoupons(updated);
                              localStorage.setItem('admin-coupons', JSON.stringify(updated));
                            }}
                            className="px-2.5 py-1 rounded-lg text-2xs font-bold text-rose-400 border border-rose-500/20 hover:bg-rose-500/10 transition-all"
                          >
                            {locale === 'ar' ? 'إلغاء' : 'Revoke'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-600 font-semibold">
                      {locale === 'ar' ? 'لم يتم إنشاء أي كوبونات بعد. اختر مادة من الأعلى.' : 'No coupon keys generated yet. Select a subject above to generate one.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        

      </main>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PRINT CARDS — hidden in normal view, shown only on print   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="hidden print:flex w-full bg-white min-h-screen absolute top-0 left-0 z-50 p-8 justify-center">
          <div style={{ fontFamily: 'Arial, sans-serif', width: '100%', maxWidth: '800px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
              {coupons
                .filter(c => !printMode || selectedForPrint.includes(c.id))
                .map(coupon => {
                  const expiryStr = coupon.expiresAt 
                    ? new Date(coupon.expiresAt).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                    : (locale === 'ar' ? 'غير محدد' : 'Never');
                  
                  return (
                    <div key={`print-${coupon.id}`} style={{
                      border: '3px solid #e2e8f0',
                      borderRight: '16px solid #f97316',
                      borderRadius: '24px',
                      padding: '40px',
                      background: '#ffffff',
                      color: '#0f172a',
                      pageBreakInside: 'avoid',
                      position: 'relative',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      width: '100%',
                    }}>
                      
                      {/* Header: Logo and Website */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #f1f5f9', paddingBottom: '20px', marginBottom: '24px' }}>
                        <img src="/logo.png" alt="Tawjihi Hub" style={{ height: '48px', objectFit: 'contain' }} />
                        <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#64748b' }}>www.tawjihihub.com</span>
                      </div>
                      
                      {/* Course Information */}
                      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px 0', direction: 'rtl' }}>
                          {coupon.course.titleAr}
                        </h3>
                        <p style={{ fontSize: '18px', color: '#64748b', margin: 0 }}>
                          {coupon.course.titleEn}
                        </p>
                      </div>
                      
                      {/* Code Box */}
                      <div style={{ 
                        background: '#fff7ed', 
                        border: '3px dashed #fdba74', 
                        borderRadius: '16px', 
                        padding: '32px', 
                        textAlign: 'center', 
                        marginBottom: '32px' 
                      }}>
                        <p style={{ fontSize: '14px', color: '#ea580c', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
                          {locale === 'ar' ? 'كود التفعيل / Access Code' : 'Access Code / كود التفعيل'}
                        </p>
                        <p style={{ fontSize: '40px', fontWeight: 900, color: '#c2410c', letterSpacing: '8px', fontFamily: 'monospace', margin: 0 }}>
                          {coupon.code}
                        </p>
                      </div>
                      
                      {/* Footer: Expiry and Disclaimer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                        <div style={{ color: '#ef4444', fontWeight: 'bold' }}>
                          ⏰ {locale === 'ar' ? 'ينتهي في:' : 'Expires:'} <span style={{ color: '#0f172a' }}>{expiryStr}</span>
                        </div>
                        <div style={{ color: '#94a3b8' }}>
                          {locale === 'ar' ? 'استخدام لمرة واحدة' : 'Single Use Only'}
                        </div>
                      </div>

                    </div>
                  );
                })}
            </div>
          </div>
        </div>

    </div>
  );
}

