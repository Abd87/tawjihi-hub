'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Radio, 
  Send, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Users, 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2, 
  Layers,
  Sparkles,
  Flame,
  Info
} from 'lucide-react';

interface Broadcast {
  id: string;
  titleAr: string;
  titleEn?: string;
  contentAr: string;
  contentEn?: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  courseId?: string;
  course?: { titleAr: string; titleEn: string };
  recipientCount: number;
  createdAt: string;
}

export default function StudioBroadcastsPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [courses, setCourses] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [courseId, setCourseId] = useState('');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch teacher's courses
      const coursesRes = await fetch('/api/admin/courses');
      if (coursesRes.ok) {
        const cData = await coursesRes.json();
        setCourses(cData.courses || []);
      }

      // Fetch past broadcasts
      const bRes = await fetch('/api/studio/broadcasts');
      if (bRes.ok) {
        const bData = await bRes.json();
        setBroadcasts(bData.broadcasts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!titleAr.trim() || !contentAr.trim()) {
      setFeedback({ type: 'error', msg: isRtl ? 'يرجى إدخال عنوان وتفاصيل الإعلان بالعربية' : 'Title and content are required' });
      return;
    }

    setSending(true);

    try {
      const res = await fetch('/api/studio/broadcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleAr,
          titleEn: titleEn || titleAr,
          contentAr,
          contentEn: contentEn || contentAr,
          courseId: courseId || null,
          priority,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isRtl ? 'فشل إرسال الإعلان' : 'Failed to send broadcast'));
      }

      setFeedback({ type: 'success', msg: isRtl ? 'تم إرسال الإعلان وتوجيهه للطلاب بنجاح! 📢' : 'Broadcast sent successfully! 📢' });
      
      // Reset form
      setTitleAr('');
      setTitleEn('');
      setContentAr('');
      setContentEn('');
      setCourseId('');
      setPriority('NORMAL');

      // Refresh list
      const bRes = await fetch('/api/studio/broadcasts');
      if (bRes.ok) {
        const bData = await bRes.json();
        setBroadcasts(bData.broadcasts || []);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', msg: err.message });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteBroadcast = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت تأكد من حذف هذا الإعلان؟' : 'Are you sure you want to delete this broadcast?')) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/studio/broadcasts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBroadcasts(broadcasts.filter((b) => b.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold mb-3">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{isRtl ? 'استوديو الإعلانات المباشرة' : 'Direct Broadcast Studio'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {isRtl ? 'إعلانات وتنبيهات الطلاب المباشرة' : 'Direct Broadcast Announcements'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRtl
              ? 'إرسال إعلانات فورية وتنبيهات هامة للطلاب المشتركين في دوراتك التعليمية'
              : 'Broadcast targeted announcements directly to students enrolled in your courses'}
          </p>
        </div>

        <Link
          href={`/${locale}/studio`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-slate-700 text-sm font-bold transition-all w-fit"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRtl ? 'العودة للاستوديو' : 'Back to Studio'}</span>
        </Link>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-brand-400" />
                {isRtl ? 'إنشاء إعلان جديد' : 'Compose Broadcast'}
              </h2>

              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <Users className="w-3.5 h-3.5 text-brand-400" />
                {courseId
                  ? (isRtl ? 'موجه لدورة محددة' : 'Specific Course')
                  : (isRtl ? 'موجه لجميع طلابك' : 'All Enrolled Students')}
              </span>
            </div>

            {feedback && (
              <div
                className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                }`}
              >
                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{feedback.msg}</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-5">
              {/* Target Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {isRtl ? 'الجمهور المستهدف (الدورة) *' : 'Target Audience / Course *'}
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-brand-500"
                >
                  <option value="">{isRtl ? '📢 جميع الطلاب المشتركين في كافة دوراتي' : '📢 All Students Across All My Courses'}</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      📚 {c.titleAr} ({c.titleEn || c.titleAr})
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {isRtl ? 'درجة أهمية الإعلان *' : 'Priority Level *'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPriority('NORMAL')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      priority === 'NORMAL'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Info className="w-4 h-4 text-blue-400" />
                    <span>{isRtl ? 'عادي (Normal)' : 'Normal'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriority('HIGH')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      priority === 'HIGH'
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>{isRtl ? 'هام (High)' : 'High'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPriority('URGENT')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      priority === 'URGENT'
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-lg shadow-rose-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>{isRtl ? 'عاجل 🔥' : 'Urgent 🔥'}</span>
                  </button>
                </div>
              </div>

              {/* Title Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isRtl ? 'عنوان الإعلان (بالعربية) *' : 'Announcement Title (Arabic) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder={isRtl ? 'مثال: موعد اختبار نهاية الوحدة وتنبيه هام' : 'Title in Arabic'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">
                    {isRtl ? 'عنوان الإعلان (بالإنجليزية) - اختياري' : 'Announcement Title (English) - Optional'}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Title in English"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Content Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isRtl ? 'نص وتفاصيل الإعلان (بالعربية) *' : 'Announcement Message (Arabic) *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={contentAr}
                    onChange={(e) => setContentAr(e.target.value)}
                    placeholder={isRtl ? 'اكتب تفاصيل الإعلان والتنبيهات الموجهة لطلابك هنا...' : 'Write message content...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-brand-500 custom-scrollbar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">
                    {isRtl ? 'نص الإعلان (بالإنجليزية) - اختياري' : 'Announcement Message (English) - Optional'}
                  </label>
                  <textarea
                    rows={3}
                    value={contentEn}
                    onChange={(e) => setContentEn(e.target.value)}
                    placeholder="Message in English..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 outline-none focus:border-brand-500 custom-scrollbar"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={sending}
                  className="px-8 py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isRtl ? 'جاري إرسال الإعلان...' : 'Sending Broadcast...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{isRtl ? 'إرسال الإعلان الآن 📢' : 'Send Broadcast Now 📢'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* History Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                {isRtl ? 'سجل الإعلانات المرسلة' : 'Broadcast History'}
              </h2>
              <span className="text-xs text-slate-400 font-bold">
                {broadcasts.length} {isRtl ? 'إعلان' : 'Broadcasts'}
              </span>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar pr-1">
              {broadcasts.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-all relative"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            b.priority === 'URGENT'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : b.priority === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}
                        >
                          {b.priority}
                        </span>

                        <span className="text-[11px] text-slate-500 font-semibold">
                          {new Date(b.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US')}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white leading-snug">
                        {isRtl ? b.titleAr : b.titleEn || b.titleAr}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDeleteBroadcast(b.id)}
                      disabled={deletingId === b.id}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title={isRtl ? 'حذف الإعلان' : 'Delete'}
                    >
                      {deletingId === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {isRtl ? b.contentAr : b.contentEn || b.contentAr}
                  </p>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 pt-2 border-t border-slate-900">
                    <span className="truncate max-w-[200px]">
                      {b.course ? `📚 ${isRtl ? b.course.titleAr : b.course.titleEn}` : (isRtl ? '📢 جميع الطلاب' : '📢 All Students')}
                    </span>

                    <span className="flex items-center gap-1 text-brand-400 font-bold">
                      <Users className="w-3.5 h-3.5" />
                      {b.recipientCount} {isRtl ? 'طالب' : 'Students'}
                    </span>
                  </div>
                </div>
              ))}

              {broadcasts.length === 0 && (
                <div className="py-12 text-center text-slate-500 space-y-2">
                  <Radio className="w-8 h-8 text-slate-700 mx-auto" />
                  <p className="text-xs font-bold">
                    {isRtl ? 'لم تقم بإرسال أي إعلانات بعد' : 'No broadcasts sent yet.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
