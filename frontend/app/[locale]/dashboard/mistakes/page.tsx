'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { BrainCircuit, BookOpen, Clock, Trash2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface Mistake {
  id: string;
  question: {
    textAr: string;
    textEn: string;
    type: string;
    explanationAr?: string;
    explanationEn?: string;
    section?: {
      titleAr: string;
      titleEn: string;
      quiz?: {
        titleAr: string;
        titleEn: string;
      }
    }
  };
  mistakeCount: number;
  lastAttemptDate: string;
}

export default function MistakesDashboard({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('dashboard');
  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMistakes();
  }, []);

  const fetchMistakes = async () => {
    try {
      const res = await fetch('/api/student/mistakes');
      if (res.ok) {
        const data = await res.json();
        setMistakes(data.mistakes);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removeMistake = async (id: string) => {
    try {
      await fetch(`/api/student/mistakes?id=${id}`, { method: 'DELETE' });
      setMistakes(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans">
      
      <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <BrainCircuit className="w-8 h-8 text-brand-500" />
              <h1 className="text-3xl font-bold text-white">
                {locale === 'ar' ? 'بنك الأخطاء' : 'Mistake Bank'}
              </h1>
            </div>
            <p className="text-slate-400 max-w-xl">
              {locale === 'ar' 
                ? 'يتم هنا حفظ الأسئلة التي أخطأت فيها أثناء حل الاختبارات. راجعها باستمرار لضمان عدم تكرار الخطأ.'
                : 'Questions you answered incorrectly are automatically saved here. Review them to master your weak points.'}
            </p>
          </div>
          
          <button 
            disabled={mistakes.length === 0}
            onClick={() => alert(locale === 'ar' ? 'جاري العمل على هذه الخاصية' : 'Coming soon')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${mistakes.length > 0 ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/25' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
          >
            <Sparkles className="w-5 h-5" />
            {locale === 'ar' ? 'توليد اختبار ذكي' : 'Generate Smart Quiz'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : mistakes.length === 0 ? (
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-12 text-center">
            <AlertCircle className="w-12 h-12 text-brand-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {locale === 'ar' ? 'بنك الأخطاء فارغ' : 'Your Mistake Bank is Empty!'}
            </h3>
            <p className="text-slate-400">
              {locale === 'ar' ? 'رائع! ليس لديك أي أخطاء مسجلة حالياً.' : 'Great job! You have no recorded mistakes.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {mistakes.map(mistake => (
              <div key={mistake.id} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 group hover:border-slate-700 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-rose-500/10 text-rose-400 rounded-full">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {locale === 'ar' ? 'أخطأت فيها' : 'Failed'} {mistake.mistakeCount} {locale === 'ar' ? 'مرات' : 'times'}
                  </div>
                  <button 
                    onClick={() => removeMistake(mistake.id)}
                    className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title={locale === 'ar' ? 'حذف من البنك' : 'Remove from bank'}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <h4 className="text-lg text-white font-medium mb-2" dangerouslySetInnerHTML={{ __html: locale === 'ar' ? mistake.question.textAr : mistake.question.textEn }} />
                
                {(mistake.question.explanationAr || mistake.question.explanationEn) && (
                  <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <p className="text-sm text-brand-400 font-semibold mb-1">{locale === 'ar' ? 'الشرح:' : 'Explanation:'}</p>
                    <p className="text-sm text-slate-300" dangerouslySetInnerHTML={{ __html: (locale === 'ar' ? mistake.question.explanationAr : mistake.question.explanationEn) || '' }} />
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {locale === 'ar' ? mistake.question.section?.quiz?.titleAr : mistake.question.section?.quiz?.titleEn}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {new Date(mistake.lastAttemptDate).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
