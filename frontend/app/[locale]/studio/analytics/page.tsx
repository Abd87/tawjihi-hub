'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  AlertTriangle, 
  HelpCircle, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  Users,
  Sparkles
} from 'lucide-react';

export default function StudentBottlenecksStudioPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBottlenecks();
  }, []);

  const fetchBottlenecks = async () => {
    try {
      const res = await fetch('/api/analytics/teacher/bottlenecks');
      if (!res.ok) throw new Error('Failed to fetch bottleneck analytics');
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-10 text-center">
        <p className="text-rose-400">{error || 'No data found'}</p>
      </div>
    );
  }

  const { bottlenecks, totalMistakesRecorded } = data;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isRtl ? 'تحليلات الأخطاء الشائعة' : 'Student Bottlenecks Engine'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {isRtl ? 'تحليلات الأسئلة الأكثر تعثراً للطلاب' : 'Student Bottlenecks & Hard Questions'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRtl
              ? 'تتيح لك هذه الصفحة معرفة الأسئلة التي واجه الطلاب صعوبة بها لتتمكن من إضافة فيديوهات توضيحية مكثفة لها'
              : 'Identify questions with the highest failure rates so you can enhance your video explanations'}
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

      {/* Summary KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'إجمالي الأخطاء المسجلة' : 'Total Registered Student Mistakes'}
            </span>
            <p className="text-3xl font-black text-white mt-1">
              {totalMistakesRecorded.toLocaleString()} <span className="text-sm font-bold text-slate-400">{isRtl ? 'خطأ' : 'Mistakes'}</span>
            </p>
          </div>
          <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl">
            <XCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'عدد الأسئلة الحرجة' : 'Critical Bottleneck Questions'}
            </span>
            <p className="text-3xl font-black text-white mt-1">
              {bottlenecks.length} <span className="text-sm font-bold text-slate-400">{isRtl ? 'سؤال' : 'Questions'}</span>
            </p>
          </div>
          <div className="p-4 bg-brand-500/10 text-brand-400 rounded-2xl">
            <HelpCircle className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          {isRtl ? 'ترتيب الأسئلة حسب تكرار الخطأ' : 'Top Failed Questions Ranked'}
        </h2>

        {bottlenecks.map((item: any, index: number) => (
          <div
            key={item.questionId}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-sm flex items-center justify-center">
                  #{index + 1}
                </span>
                <div>
                  <span className="text-xs font-bold text-brand-400 block">
                    {isRtl ? item.courseTitleAr : item.courseTitleEn} • {isRtl ? item.quizTitleAr : item.quizTitleEn}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {isRtl ? item.textAr : item.textEn}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>{item.totalMistakes} {isRtl ? 'خطأ كلي' : 'Total Errors'}</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{item.affectedStudentsCount} {isRtl ? 'طلاب تكرر معهم' : 'Students'}</span>
                </div>
              </div>
            </div>

            {/* Answer Choices preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {item.choices.map((c: any) => (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between border ${
                    c.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span>{isRtl ? c.textAr : c.textEn}</span>
                  {c.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        ))}

        {bottlenecks.length === 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-400">
              {isRtl ? 'ممتاز! لا يوجد أخطاء متكررة أو تعثرات بين الطلاب حالياً' : 'Great! No recorded recurring mistakes yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
