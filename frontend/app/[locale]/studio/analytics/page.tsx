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
  Sparkles,
  Video,
  FileText
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
            <span>{isRtl ? 'تحليلات الأخطاء الإجابات الشائعة' : 'Student Bottlenecks Engine'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {isRtl ? 'تحليلات الأسئلة الأكثر تعثراً وإجابات الطلاب الخاطئة' : 'Student Bottlenecks & Mistakes'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRtl
              ? 'عرض نص السؤال بالكامل، الخيار الخاطئ الأكثر تكراراً بين الطلاب، والإجابة النموذجية مع توضيح الحل'
              : 'Detailed breakdown of question texts, most picked incorrect choices by students, and correct answers'}
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
              {isRtl ? 'إجمالي عدد الإجابات الخاطئة المسجلة' : 'Total Registered Student Mistakes'}
            </span>
            <p className="text-3xl font-black text-white mt-1">
              {totalMistakesRecorded.toLocaleString()} <span className="text-sm font-bold text-slate-400">{isRtl ? 'إجابة خاطئة' : 'Wrong Answers'}</span>
            </p>
          </div>
          <div className="p-4 bg-rose-500/10 text-rose-400 rounded-2xl">
            <XCircle className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'عدد الأسئلة الحرجة بالدورة' : 'Critical Bottleneck Questions'}
            </span>
            <p className="text-3xl font-black text-white mt-1">
              {bottlenecks.length} <span className="text-sm font-bold text-slate-400">{isRtl ? 'سؤال معثّر' : 'Questions'}</span>
            </p>
          </div>
          <div className="p-4 bg-amber-500/10 text-amber-400 rounded-2xl">
            <HelpCircle className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          {isRtl ? 'تفاصيل الأسئلة الخاطئة وتحليل الإجابات' : 'Detailed Failed Questions Analysis'}
        </h2>

        {bottlenecks.map((item: any, index: number) => (
          <div
            key={item.questionId}
            className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 hover:border-slate-700 transition-all"
          >
            {/* Header: Course, Quiz, and Ranking */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold text-sm flex items-center justify-center shrink-0 mt-1">
                  #{index + 1}
                </span>
                <div>
                  <span className="text-xs font-bold text-brand-400 block mb-1">
                    {isRtl ? item.courseTitleAr : item.courseTitleEn} • {isRtl ? item.quizTitleAr : item.quizTitleEn}
                  </span>
                  <h3 className="text-lg font-bold text-white leading-relaxed">
                    {isRtl ? item.textAr : item.textEn}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" />
                  <span>{item.totalMistakes} {isRtl ? 'خطأ كلي' : 'Total Errors'}</span>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{item.affectedStudentsCount} {isRtl ? 'طلاب أخطأوا' : 'Students'}</span>
                </div>
              </div>
            </div>

            {/* MCQ Choices Breakdown */}
            {item.choices && item.choices.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  {isRtl ? 'خيارات الإجابة وتحليل الأخطاء:' : 'Answer Choices & Error Breakdown:'}
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {item.choices.map((c: any) => (
                    <div
                      key={c.id}
                      className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border transition-all ${
                        c.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-sm'
                          : c.timesSelectedByMistake > 0
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {c.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : c.timesSelectedByMistake > 0 ? (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <span>{isRtl ? c.textAr : c.textEn}</span>
                      </div>

                      {c.isCorrect ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px]">
                          {isRtl ? 'الإجابة الصحيحة ✓' : 'Correct Answer'}
                        </span>
                      ) : c.timesSelectedByMistake > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-extrabold text-[10px]">
                          {isRtl ? `أخطأ باختياره ${c.timesSelectedByMistake} مرة` : `Picked by mistake ${c.timesSelectedByMistake}x`}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Short Answer Type formatting */}
            {item.type === 'SHORT_ANSWER' && (
              <div className="space-y-3 pt-2">
                {item.correctAnswer && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    <span className="font-bold block mb-1">{isRtl ? 'الإجابة الصحيحة النموذجية:' : 'Correct Text Answer:'}</span>
                    <p className="font-mono text-sm">{item.correctAnswer}</p>
                  </div>
                )}

                {item.wrongTextAnswers && item.wrongTextAnswers.length > 0 && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                    <span className="font-bold block">{isRtl ? 'أبرز الإجابات الخاطئة التي كتبها الطلاب:' : 'Sample Wrong Answers Entered by Students:'}</span>
                    <ul className="list-disc list-inside space-y-1 font-mono text-xs">
                      {item.wrongTextAnswers.map((txt: string, idx: number) => (
                        <li key={idx}>"{txt}"</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Explanation Note if present */}
            {(item.explanationAr || item.explanationEn) && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-bold text-amber-400 block">{isRtl ? 'توضيح وشرح السؤال:' : 'Question Explanation:'}</span>
                <p>{isRtl ? item.explanationAr || item.explanationEn : item.explanationEn || item.explanationAr}</p>
              </div>
            )}
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
