'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BookOpen, FileText, Search, Loader2, Download, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PublicLibraryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [filterGrade, setFilterGrade] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({ publishedOnly: 'true' });
      if (filterGrade) query.append('grade', filterGrade);
      if (filterSubject) query.append('subject', filterSubject);
      if (filterType) query.append('type', filterType);
      
      const res = await fetch('/api/library?' + query.toString());
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [filterGrade, filterSubject, filterType]);

  const GRADE_LABELS: any = {
    'GRADE_12': isRtl ? 'توجيهي' : 'Grade 12',
    'GRADE_11': isRtl ? 'أول ثانوي' : 'Grade 11',
    'GRADE_10': isRtl ? 'عاشر' : 'Grade 10',
    'FOUNDATION': isRtl ? 'تأسيس' : 'Foundation',
  };

  const SUBJECT_LABELS: any = {
    'MATH': isRtl ? 'رياضيات' : 'Math',
    'PHYSICS': isRtl ? 'فيزياء' : 'Physics',
    'CHEMISTRY': isRtl ? 'كيمياء' : 'Chemistry',
    'BIOLOGY': isRtl ? 'أحياء' : 'Biology',
    'ENGLISH': isRtl ? 'لغة إنجليزية' : 'English',
    'ARABIC': isRtl ? 'لغة عربية' : 'Arabic',
  };

  const TYPE_LABELS: any = {
    'SUMMARY': isRtl ? 'دوسية / ملخص' : 'Summary',
    'WORKSHEET': isRtl ? 'ورقة عمل' : 'Worksheet',
    'EXAM': isRtl ? 'امتحان سابق' : 'Past Paper',
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-brand-500/10 text-brand-400 rounded-full mb-2">
            <BookOpen className="w-10 h-10" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">{isRtl ? 'المكتبة العامة' : 'Public Library'}</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {isRtl ? 'حمل أحدث الدوسيات وأوراق العمل والامتحانات مجاناً لجميع المواد.' : 'Download the latest summaries, worksheets, and past papers for all subjects free of charge.'}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-bold text-slate-300">{isRtl ? 'الصف' : 'Grade'}</label>
            <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white">
              <option value="">{isRtl ? 'الكل' : 'All'}</option>
              <option value="GRADE_12">{isRtl ? 'توجيهي' : 'Grade 12'}</option>
              <option value="GRADE_11">{isRtl ? 'أول ثانوي' : 'Grade 11'}</option>
              <option value="GRADE_10">{isRtl ? 'عاشر' : 'Grade 10'}</option>
              <option value="FOUNDATION">{isRtl ? 'تأسيس' : 'Foundation'}</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-bold text-slate-300">{isRtl ? 'المادة' : 'Subject'}</label>
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white">
              <option value="">{isRtl ? 'الكل' : 'All'}</option>
              <option value="MATH">{isRtl ? 'رياضيات' : 'Math'}</option>
              <option value="PHYSICS">{isRtl ? 'فيزياء' : 'Physics'}</option>
              <option value="CHEMISTRY">{isRtl ? 'كيمياء' : 'Chemistry'}</option>
              <option value="BIOLOGY">{isRtl ? 'أحياء' : 'Biology'}</option>
              <option value="ENGLISH">{isRtl ? 'لغة إنجليزية' : 'English'}</option>
              <option value="ARABIC">{isRtl ? 'لغة عربية' : 'Arabic'}</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm font-bold text-slate-300">{isRtl ? 'النوع' : 'Type'}</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white">
              <option value="">{isRtl ? 'الكل' : 'All'}</option>
              <option value="SUMMARY">{isRtl ? 'دوسية / ملخص' : 'Summary'}</option>
              <option value="WORKSHEET">{isRtl ? 'ورقة عمل' : 'Worksheet'}</option>
              <option value="EXAM">{isRtl ? 'امتحان سابق' : 'Past Paper'}</option>
            </select>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-4" />
              <span>{isRtl ? 'جاري تحميل المكتبة...' : 'Loading library...'}</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-slate-900/30 border border-slate-800 rounded-3xl">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">{isRtl ? 'لا يوجد ملفات' : 'No Documents Found'}</h3>
              <p className="text-slate-400">{isRtl ? 'لم يتم العثور على أي ملفات تطابق بحثك.' : 'No documents match your search criteria.'}</p>
            </div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="group bg-slate-900 border border-slate-800 hover:border-brand-500/50 rounded-3xl p-6 flex flex-col gap-4 transition-all">
                <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">{isRtl ? doc.titleAr : doc.titleEn}</h3>
                  <div className="flex flex-wrap gap-2 text-xs font-bold mt-2">
                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-md">{GRADE_LABELS[doc.grade] || doc.grade}</span>
                    <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded-md">{SUBJECT_LABELS[doc.subject] || doc.subject}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md">{TYPE_LABELS[doc.type] || doc.type}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto pt-4">
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 w-full text-center py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-brand-500/20"
                    >
                      {isRtl ? 'تحميل' : 'Download'}
                    </a>
                    <Link
                      href={`/${locale}/library/${doc.id}`}
                      className="flex-1 w-full text-center py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl transition-colors"
                    >
                      {isRtl ? 'مشاركة' : 'Share'}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}