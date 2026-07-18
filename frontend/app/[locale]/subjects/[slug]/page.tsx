import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BookOpen, Calculator, FlaskConical, Atom, Landmark, Code2, HeartPulse, MonitorPlay, Sprout, BookMarked, Globe2, ChevronRight } from 'lucide-react';
import { subjectsData } from '../curriculumData';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const subject = subjectsData.find(s => s.id === params.slug);
  if (!subject) return { title: 'Subject Not Found' };
  
  const title = params.locale === 'ar' ? subject.titleAr : subject.titleEn;
  const track = subject.track === 'btec' ? 'BTEC' : (params.locale === 'ar' ? 'أكاديمي' : 'Academic');

  return {
    title: `${title} | ${track} - Tawjihi Hub`,
    description: `استكشف منهاج مادة ${subject.titleAr} بالتفصيل. عرض لجميع الوحدات والدروس الخاصة بمادة ${subject.titleAr} لمرحلة التوجيهي.`,
    keywords: ['توجيهي', 'منهاج', subject.titleAr, track, 'الأردن', 'Tawjihi'],
    alternates: {
      canonical: `/${params.locale}/subjects/${params.slug}`,
      languages: {
        'ar': `/ar/subjects/${params.slug}`,
        'en': `/en/subjects/${params.slug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  return subjectsData.flatMap(subject => [
    { locale: 'ar', slug: subject.id },
    { locale: 'en', slug: subject.id }
  ]);
}

const renderIcon = (type: string) => {
  switch(type) {
    case 'calculator': return <Calculator className="h-8 w-8" />;
    case 'atom': return <Atom className="h-8 w-8" />;
    case 'flask': return <FlaskConical className="h-8 w-8" />;
    case 'heart': return <HeartPulse className="h-8 w-8" />;
    case 'book': return <BookOpen className="h-8 w-8" />;
    case 'monitor': return <MonitorPlay className="h-8 w-8" />;
    case 'landmark': return <Landmark className="h-8 w-8" />;
    case 'sprout': return <Sprout className="h-8 w-8" />;
    case 'globe': return <Globe2 className="h-8 w-8" />;
    case 'code': return <Code2 className="h-8 w-8" />;
    default: return <BookMarked className="h-8 w-8" />;
  }
};

export default function SubjectPage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
  const isRtl = locale === 'ar';
  const subject = subjectsData.find(s => s.id === slug);
  
  if (!subject) {
    notFound();
  }

  const colorTheme: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    rose: 'text-rose-500 bg-rose-500/10',
    amber: 'text-amber-500 bg-amber-500/10',
    slate: 'text-slate-300 bg-slate-500/10',
    brand: 'text-brand-500 bg-brand-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    cyan: 'text-cyan-500 bg-cyan-500/10',
    green: 'text-green-500 bg-green-500/10',
    teal: 'text-teal-500 bg-teal-500/10',
    lime: 'text-lime-500 bg-lime-500/10',
  };
  const themeClass = colorTheme[subject.color] || colorTheme.brand;

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Breadcrumbs */}
        <div className={`flex items-center gap-2 mb-8 text-slate-400 text-sm ${isRtl ? 'flex-row-reverse' : ''}`}>
          <Link href={`/${locale}/subjects`} className="hover:text-brand-400 transition-colors">
            {isRtl ? 'تصفح المواد' : 'Subjects Explorer'}
          </Link>
          <ChevronRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          <span className="text-slate-200 font-semibold">{isRtl ? subject.titleAr : subject.titleEn}</span>
        </div>

        {/* Header */}
        <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-8 flex items-center gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className={`h-20 w-20 rounded-2xl flex items-center justify-center shrink-0 ${themeClass}`}>
            {renderIcon(subject.iconType)}
          </div>
          <div className={`flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-block px-3 py-1 bg-slate-800 text-brand-400 rounded-full text-sm font-semibold mb-3">
              {subject.track === 'btec' ? 'BTEC' : (isRtl ? 'المسار الأكاديمي' : 'Academic Track')}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              {isRtl ? subject.titleAr : subject.titleEn}
            </h1>
            <p className="text-slate-400">
              {isRtl ? 'تصفح خطة المقرر التفصيلية والوحدات والدروس أدناه.' : 'Explore the detailed curriculum plan, units, and lessons below.'}
            </p>
          </div>
        </div>

        {/* Curriculum Content */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8" dir={isRtl ? 'rtl' : 'ltr'}>
          <h2 className="text-2xl font-bold text-white mb-6">
            {isRtl ? 'خطة المقرر' : 'Curriculum Plan'}
          </h2>
          
          {subject.units.length > 0 ? (
            <div className="space-y-8">
              {subject.units.map((unit) => (
                <div key={unit.id} className="space-y-4">
                  <h3 className="text-xl font-bold text-brand-400 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500" />
                    {isRtl ? unit.titleAr : unit.titleEn}
                  </h3>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${isRtl ? 'border-r-2 border-slate-800 pr-5 mr-3' : 'border-l-2 border-slate-800 pl-5 ml-3'}`}>
                    {unit.lessons.map((lesson) => (
                      <div key={lesson.id} className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-xl flex items-center gap-4 hover:border-slate-700 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                          <BookOpen className="h-4 w-4 text-slate-400" />
                        </div>
                        <span className="text-base font-medium text-slate-200">
                          {isRtl ? lesson.titleAr : lesson.titleEn}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-slate-800 rounded-xl">
              <p className="text-slate-400 text-lg">
                {isRtl ? 'لم يتم إضافة تفاصيل الخطة الدراسية لهذه المادة بعد.' : 'The curriculum details for this subject have not been added yet.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
