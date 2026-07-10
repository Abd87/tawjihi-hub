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
  PlusCircle
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
  usedBy?: {
    nameAr: string;
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
  
  // Form states
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedStream, setSelectedStream] = useState<'BTEC' | 'ACADEMIC'>('BTEC');
  const [customCode, setCustomCode] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [subjectOpen, setSubjectOpen] = useState(false);

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
      if (token.startsWith('mock-')) {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      }
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
        // Fetch courses list
        const coursesRes = await fetch('http://localhost:5000/api/courses', {
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
        const couponsRes = await fetch('http://localhost:5000/api/coupons', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (couponsRes.ok) {
          const couponsData = await couponsRes.json();
          setCoupons(couponsData.coupons);
        }
      } catch (err) {
        // Offline / Unreachable fallback
        // ── BTEC Stream (4 Ministry subjects) ──────────────────────────────
        const allMockCourses: Course[] = [
          // BTEC mandatory subjects
          { id: 'mock-btec-arabic',   titleAr: '── مسار BTEC ── اللغة العربية', titleEn: '── BTEC ── Arabic Language', track: 'BTEC' },
          { id: 'mock-btec-english',  titleAr: 'اللغة الإنجليزية المشتركة BTEC', titleEn: 'Core English for BTEC', track: 'BTEC' },
          { id: 'mock-btec-history',  titleAr: 'تاريخ الأردن والعرب - BTEC', titleEn: 'Jordan & Arab History - BTEC', track: 'BTEC' },
          { id: 'mock-btec-islamic',  titleAr: 'التربية الإسلامية - BTEC', titleEn: 'Islamic Education - BTEC', track: 'BTEC' },
          // Academic Stream – Scientific branch
          { id: 'mock-acad-arabic',   titleAr: '── مسار أكاديمي ── اللغة العربية', titleEn: '── Academic ── Arabic Language', track: 'ACADEMIC' },
          { id: 'mock-acad-english',  titleAr: 'اللغة الإنجليزية الأكاديمي', titleEn: 'English Language - Academic', track: 'ACADEMIC' },
          { id: 'mock-acad-math',     titleAr: 'الرياضيات العلمية', titleEn: 'Scientific Mathematics', track: 'ACADEMIC' },
          { id: 'mock-acad-physics',  titleAr: 'الفيزياء - الكهرباء والمغناطيسية', titleEn: 'Physics - Electromagnetism', track: 'ACADEMIC' },
          { id: 'mock-acad-chem',     titleAr: 'الكيمياء التخصصية', titleEn: 'Advanced Chemistry', track: 'ACADEMIC' },
          { id: 'mock-acad-bio',      titleAr: 'الأحياء والوراثة', titleEn: 'Biology & Genetics', track: 'ACADEMIC' },
          { id: 'mock-acad-geology',  titleAr: 'علم الأرض والبيئة', titleEn: 'Earth Science & Environment', track: 'ACADEMIC' },
          { id: 'mock-acad-history',  titleAr: 'تاريخ الأردن والعرب - أكاديمي', titleEn: 'Jordan & Arab History - Academic', track: 'ACADEMIC' },
          { id: 'mock-acad-islamic',  titleAr: 'التربية الإسلامية - أكاديمي', titleEn: 'Islamic Education - Academic', track: 'ACADEMIC' },
          { id: 'mock-acad-national', titleAr: 'التربية الوطنية والمدنية', titleEn: 'National & Civic Education', track: 'ACADEMIC' },
          { id: 'mock-acad-lit-arab', titleAr: 'الأدب العربي - الأدبي', titleEn: 'Arabic Literature - Literary Branch', track: 'ACADEMIC' },
          { id: 'mock-acad-socio',    titleAr: 'الاجتماعيات والجغرافيا', titleEn: 'Social Studies & Geography', track: 'ACADEMIC' },
        ];
        const customSubjects = loadCustomSubjects();
        setCourses([...allMockCourses, ...customSubjects]);
        setSelectedCourseId('mock-btec-arabic');
        setSelectedStream('BTEC');

        const stored = localStorage.getItem('admin-coupons');
        if (stored) {
          setCoupons(JSON.parse(stored));
        } else {
          const initialMockCoupons: Coupon[] = [
            {
              id: 'c1',
              code: 'HUB-BTEC-2026',
              courseId: 'mock-btec-1',
              course: { titleAr: 'تاريخ الأردن للتوجيهي والمهني BTEC', titleEn: 'Jordan History for Grade 12 BTEC' },
              isActive: true,
              createdAt: new Date().toISOString()
            },
            {
              id: 'c2',
              code: 'HUB-MATH-2026',
              courseId: 'mock-acad-1',
              course: { titleAr: 'الرياضيات العلمية - الفصل الأول', titleEn: 'Scientific Calculus - Term 1' },
              isActive: true,
              createdAt: new Date().toISOString()
            },
            {
              id: 'c3',
              code: 'TAWJIHI2026',
              courseId: 'mock-acad-1',
              course: { titleAr: 'الرياضيات العلمية - الفصل الأول', titleEn: 'Scientific Calculus - Term 1' },
              isActive: false,
              usedBy: { nameAr: 'خالد التوجيهي', email: 'khaled@tawjihi.jo' },
              usedAt: new Date(Date.now() - 3600000).toISOString(),
              createdAt: new Date(Date.now() - 7200000).toISOString()
            }
          ];
          setCoupons(initialMockCoupons);
          localStorage.setItem('admin-coupons', JSON.stringify(initialMockCoupons));
        }
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
        const res = await fetch('http://localhost:5000/api/coupons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            courseId: selectedCourseId,
            code: customCode.trim() || undefined
          })
        });

        const data = await res.json();
        
        if (res.ok) {
          setSuccess(tAnalytics('generateSuccess'));
          setCustomCode('');
          // Refresh list
          const refreshRes = await fetch('http://localhost:5000/api/coupons', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            setCoupons(refreshData.coupons);
          }
          return;
        } else {
          setError(data.error || 'Failed to generate coupon');
        }
      }
      throw new Error('Offline');
    } catch (err) {
      const cleanTitle = (title: string) => title.replace(/^──[^──]*──\s*/, '');
      const course = courses.find(c => c.id === selectedCourseId);
      if (!course) { setFormLoading(false); return; }

      const shortCode = course.titleEn.replace(/[^A-Z]/gi, '').substring(0, 4).toUpperCase() || 'SUBJ';
      const newCode = customCode.trim().toUpperCase() || `HUB-${shortCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      const cleanedAr = cleanTitle(course.titleAr);
      const cleanedEn = cleanTitle(course.titleEn);
      
      const newCoupon: Coupon = {
        id: `c-mock-${Date.now()}`,
        code: newCode,
        courseId: selectedCourseId,
        course: {
          titleAr: cleanedAr,
          titleEn: cleanedEn,
        },
        isActive: true,
        createdAt: new Date().toISOString()
      };

      const updated = [newCoupon, ...coupons];
      setCoupons(updated);
      localStorage.setItem('admin-coupons', JSON.stringify(updated));
      setSuccess(tAnalytics('generateSuccess'));
      setCustomCode('');
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
      
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            {isRtl ? (
              <><ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" /><span>لوحة القيادة</span></>
            ) : (
              <><ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-1" /><span>Dashboard</span></>
            )}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400">
              Admin Mode
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-10 z-10 relative space-y-8">
        
        {/* Page Title */}
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

        {/* Generate Form Box */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-visible">
          <div className="absolute top-0 start-0 w-[3px] h-full bg-brand-500 rounded-s-2xl" />
          
          <h2 className="text-sm sm:text-base font-extrabold text-white mb-5 flex items-center gap-2">
            <Plus className="h-4 w-4 text-brand-500" />
            <span>{tAnalytics('createCouponBtn')}</span>
          </h2>

          {/* ── Step 1: Stream Toggle ─────────────────────────────── */}
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

          {/* ── Step 2: Subject + Code + Generate ─────────────────── */}
          <form onSubmit={handleGenerateCoupon} className="space-y-4">

            {/* Subject picker — inline expand, no floating/clipping issues */}
            <div>
              <p className="text-xs font-bold text-slate-400 mb-2">
                {isRtl ? 'الخطوة 2 — اختر المادة الدراسية' : 'Step 2 — Choose Subject'}
              </p>

              {/* Selected subject display + toggle */}
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
                    return (isRtl ? sel.titleAr : sel.titleEn).replace(/^──[^──]*──\s*/, '');
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

            {/* Optional custom code + Generate button */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2 space-y-1.5">
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
              <button
                type="submit"
                disabled={formLoading || !selectedCourseId}
                className={`py-3 px-4 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${
                  selectedCourseId
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

        {/* ── Manage Subjects Card ─────────────────────────────────── */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl shadow-xl overflow-hidden">
          {/* Header toggle */}
          <button
            type="button"
            onClick={() => setManageOpen(prev => !prev)}
            className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-3 hover:bg-slate-900/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-xl">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <div className="text-start">
                <p className="text-sm font-extrabold text-white">
                  {isRtl ? 'إدارة المواد الدراسية' : 'Manage Subjects'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isRtl
                    ? `${courses.filter(c => !c.id.startsWith('mock-')).length} مادة مضافة • اضغط لإضافة أو حذف المواد`
                    : `${courses.filter(c => !c.id.startsWith('mock-')).length} custom subject(s) • click to add or remove`
                  }
                </p>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${manageOpen ? 'rotate-180' : ''}`} />
          </button>

          {manageOpen && (
            <div className="border-t border-slate-900 p-5 sm:p-6 space-y-6">

              {/* Add new subject form */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isRtl ? 'إضافة مادة جديدة' : 'Add New Subject'}
                </p>

                {/* Stream selector for new subject */}
                <div className="flex gap-2">
                  {(['BTEC', 'ACADEMIC'] as const).map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setNewSubjectStream(s)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all ${
                        newSubjectStream === s
                          ? s === 'BTEC'
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {s === 'BTEC' ? '🟠 BTEC' : isRtl ? '🔵 أكاديمي' : '🔵 Academic'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">
                      {isRtl ? 'اسم المادة بالعربية *' : 'Arabic Name *'}
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      placeholder={isRtl ? 'مثال: الكيمياء التحليلية' : 'e.g. الكيمياء التحليلية'}
                      value={newSubjectAr}
                      onChange={e => setNewSubjectAr(e.target.value)}
                      className="w-full py-2.5 px-3 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">
                      {isRtl ? 'اسم المادة بالإنجليزية *' : 'English Name *'}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="e.g. Analytical Chemistry"
                      value={newSubjectEn}
                      onChange={e => setNewSubjectEn(e.target.value)}
                      className="w-full py-2.5 px-3 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                {subjectError && (
                  <p className="text-xs text-rose-400 font-semibold">{subjectError}</p>
                )}

                <button
                  type="button"
                  onClick={handleAddSubject}
                  className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-violet-500/20"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>{isRtl ? 'إضافة المادة' : 'Add Subject'}</span>
                </button>
              </div>

              {/* Existing subjects list */}
              <div className="space-y-3">
                {(['BTEC', 'ACADEMIC'] as const).map(stream => {
                  const streamCourses = courses.filter(c =>
                    c.track === stream || c.id.startsWith(`mock-${stream.toLowerCase()}-`)
                  );
                  return (
                    <div key={stream}>
                      <p className={`text-xs font-extrabold uppercase tracking-widest mb-2 ${
                        stream === 'BTEC' ? 'text-brand-400' : 'text-blue-400'
                      }`}>
                        {stream === 'BTEC'
                          ? (isRtl ? '🟠 مسار BTEC المهني' : '🟠 BTEC Vocational')
                          : (isRtl ? '🔵 المسار الأكاديمي' : '🔵 Academic Stream')
                        }
                        {' '}({streamCourses.length})
                      </p>
                      <div className="space-y-1">
                        {streamCourses.map(course => {
                          const label = (isRtl ? course.titleAr : course.titleEn).replace(/^──[^──]*──\s*/, '');
                          return (
                            <div
                              key={course.id}
                              className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border ${
                                course.custom
                                  ? 'border-violet-500/20 bg-violet-500/5'
                                  : 'border-slate-800/60 bg-slate-900/20'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <BookOpen className={`h-3.5 w-3.5 shrink-0 ${
                                  course.custom ? 'text-violet-400' : 'text-slate-500'
                                }`} />
                                <span className="text-xs font-semibold text-slate-300 truncate">{label}</span>
                                {course.custom && (
                                  <span className="text-3xs font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 shrink-0">
                                    {isRtl ? 'مضافة' : 'custom'}
                                  </span>
                                )}
                              </div>
                              {course.custom ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubject(course.id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
                                  title={isRtl ? 'حذف المادة' : 'Delete subject'}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              ) : (
                                <span className="text-3xs text-slate-600 font-bold shrink-0">
                                  {isRtl ? 'افتراضي' : 'default'}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>

        {/* Coupons List Table */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          
          <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="h-4.5 w-4.5 text-brand-500" />
            <span>{tAnalytics('viewCoupons')}</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-900 text-slate-500 text-2xs font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-4 text-start">{tAnalytics('code')}</th>
                  <th className="py-3 px-4 text-start">{tAnalytics('courseTitle')}</th>
                  <th className="py-3 px-4 text-start">{tAnalytics('status')}</th>
                  <th className="py-3 px-4 text-start">{tAnalytics('redeemedBy')}</th>
                  <th className="py-3 px-4 text-start">{tAnalytics('redeemedAt')}</th>
                  <th className="py-3 px-4 text-start">{locale === 'ar' ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950/40">
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-slate-900/5 transition-colors">
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
                    <td className="py-3.5 px-4 text-slate-300 font-semibold max-w-[200px] truncate">
                      {isRtl ? coupon.course.titleAr : coupon.course.titleEn}
                    </td>
                    <td className="py-3.5 px-4">
                      {coupon.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-bold text-3xs uppercase tracking-wider">
                          <ShieldCheck className="h-3 w-3" />
                          <span>{tAnalytics('active')}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-800 bg-slate-900 text-slate-500 font-bold text-3xs uppercase tracking-wider">
                          <span>{tAnalytics('used')}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">
                      {coupon.usedBy ? (
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="h-3.5 w-3.5 text-slate-500" />
                          <span>{coupon.usedBy.nameAr}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium text-xs">
                      {coupon.usedAt 
                        ? new Date(coupon.usedAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) 
                        : '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      {coupon.isActive && (
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
                          {locale === 'ar' ? 'إلغاء التفعيل' : 'Revoke'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {coupons.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-650 font-semibold">
                      {locale === 'ar' ? 'لم يتم إنشاء أي كوبونات بعد. اختر مادة من الأعلى.' : 'No coupon keys generated yet. Select a subject above to generate one.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </main>

    </div>
  );
}
