'use client';

import { useState } from 'react';
import { Mail, Send, Users, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

export default function AdminBroadcastPage({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [targetGroup, setTargetGroup] = useState('ALL'); // ALL, ACADEMIC, BTEC, TEACHER
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(isRtl ? `هل أنت تأكد من إرسال هذا البريد لجميع مستخدمي فئة (${targetGroup})؟` : `Are you sure you want to send this email to (${targetGroup})?`)) {
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content, targetGroup }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isRtl ? 'حدث خطأ أثناء إرسال البريد' : 'Failed to send broadcast'));
      }

      setResult({ success: true, count: data.count || 0 });
      setSubject('');
      setContent('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            {isRtl ? 'نظام البث الجماعي' : 'Mass Broadcast Engine'}
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            {isRtl ? 'إرسال بريد جماعي للمستخدمين' : 'Send Broadcast Email'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRtl
              ? 'قم بإرسال إعلانات وتحديثات هامة لجميع الطلاب أو فئات محددة مباشرة إلى بريدهم الإلكتروني عبر support@tawjihihub.com'
              : 'Send important updates & announcements directly to user inboxes via support@tawjihihub.com'}
          </p>
        </div>
      </div>

      {result && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
          <div>
            <p className="font-bold text-sm">
              {isRtl ? `تم إرسال البريد الإلكتروني بنجاح إلى ${result.count} مستخدم! 🎉` : `Broadcast email sent successfully to ${result.count} users! 🎉`}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 shrink-0 text-rose-400" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Broadcast Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        
        {/* Target Audience */}
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">
            {isRtl ? 'الفئة المستهدفة' : 'Target Audience'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'ALL', labelAr: 'جميع المستخدمين', labelEn: 'All Users' },
              { id: 'ACADEMIC', labelAr: 'طلاب الأكاديمي', labelEn: 'Academic Students' },
              { id: 'BTEC', labelAr: 'طلاب BTEC', labelEn: 'BTEC Students' },
              { id: 'TEACHER', labelAr: 'المعلمين', labelEn: 'Teachers' },
            ].map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setTargetGroup(group.id)}
                className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${
                  targetGroup === group.id
                    ? 'bg-brand-500/20 border-brand-500 text-brand-400 shadow-lg shadow-brand-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                {isRtl ? group.labelAr : group.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Email Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-semibold text-slate-300 mb-2">
            {isRtl ? 'عنوان الرسالة (الموضوع)' : 'Email Subject'}
          </label>
          <div className="relative">
            <Mail className="absolute start-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              id="subject"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3.5 ps-11 pe-4 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder={isRtl ? 'مثال: إطلاق الدورة المكثفة لمادة الرياضيات 2026' : 'e.g. Launch of Math Crash Course 2026'}
            />
          </div>
        </div>

        {/* Email Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-slate-300 mb-2">
            {isRtl ? 'محتوى الرسالة' : 'Email Message Content'}
          </label>
          <textarea
            id="content"
            required
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 leading-relaxed"
            placeholder={isRtl ? 'أكتب نص الرسالة هنا...' : 'Write your email body message here...'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-xl shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? (isRtl ? 'جاري إرسال البريد...' : 'Sending Broadcast...') : (isRtl ? 'إرسال الرسالة الجماعية الآن' : 'Send Mass Broadcast Now')}</span>
        </button>
      </form>
    </div>
  );
}
