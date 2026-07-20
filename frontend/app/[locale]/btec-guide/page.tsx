import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import {
  Monitor,
  HardHat,
  PlaneTakeoff,
  Palette,
  Sparkles,
  Leaf,
  Briefcase,
  Building,
  ConciergeBell,
  Video,
  Trophy,
  HeartPulse,
  Baby,
  ArrowRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps) {
  const t = await getTranslations({ locale, namespace: 'btecGuide.meta' });
  
  return {
    metadataBase: new URL('https://tawjihihub.com'),
    alternates: {
      canonical: `/${locale}/btec-guide`,
      languages: {
        'ar': `/ar/btec-guide`,
        'en': `/en/btec-guide`,
      },
    },
    title: t('title'),
    description: t('description'),
    keywords: ['BTEC Jordan', 'تخصصات BTEC', 'بيتك الأردن', 'التعليم المهني', 'Pearson BTEC'],
  };
}

export default function BtecGuidePage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations('btecGuide');
  const isRtl = locale === 'ar';

  const specialties = [
    { key: 'it', icon: Monitor, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'group-hover:border-blue-500/50' },
    { key: 'engineering', icon: HardHat, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'group-hover:border-amber-500/50' },
    { key: 'tourism', icon: PlaneTakeoff, color: 'text-teal-400', bg: 'bg-teal-400/10', border: 'group-hover:border-teal-500/50' },
    { key: 'art', icon: Palette, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'group-hover:border-purple-500/50' },
    { key: 'beauty', icon: Sparkles, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'group-hover:border-pink-500/50' },
    { key: 'agriculture', icon: Leaf, color: 'text-green-400', bg: 'bg-green-400/10', border: 'group-hover:border-green-500/50' },
    { key: 'business', icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'group-hover:border-indigo-500/50' },
    { key: 'construction', icon: Building, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'group-hover:border-orange-500/50' },
    { key: 'hospitality', icon: ConciergeBell, color: 'text-red-400', bg: 'bg-red-400/10', border: 'group-hover:border-red-500/50' },
    { key: 'media', icon: Video, color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', border: 'group-hover:border-fuchsia-500/50' },
    { key: 'sports', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'group-hover:border-yellow-500/50' },
    { key: 'health', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'group-hover:border-rose-500/50' },
    { key: 'childhood', icon: Baby, color: 'text-sky-400', bg: 'bg-sky-400/10', border: 'group-hover:border-sky-500/50' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-brand-500/30 selection:text-brand-300">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-brand-500/20 via-brand-500/5 to-transparent blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-500/10 text-brand-400 text-sm font-semibold mb-6 border border-brand-500/20">
            {t('hero.badge')}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="py-20 bg-slate-950/50 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {specialties.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <Link 
                  key={spec.key}
                  href={['engineering', 'it', 'business', 'agriculture', 'hospitality', 'beauty'].includes(spec.key) ? `/btec-guide/${spec.key}` : `/register?track=BTEC`}
                  className={`group relative flex flex-col p-8 rounded-3xl bg-slate-900 border border-slate-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-500/10 ${spec.border}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${spec.bg} ${spec.color}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-4 group-hover:text-brand-400 transition-colors">
                    {t(`specialties.${spec.key}.title`)}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                    {t(`specialties.${spec.key}.description`)}
                  </p>
                  
                  <div className="mt-auto flex items-center text-sm font-semibold text-brand-500 group-hover:text-brand-400 transition-colors">
                    {isRtl ? 'عرض الدورات المتاحة' : 'View Available Courses'}
                    {isRtl ? (
                      <ArrowLeft className="w-4 h-4 ms-2 transition-transform duration-300 group-hover:-translate-x-1" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ms-2 transition-transform duration-300 group-hover:translate-x-1" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-600/10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <Link 
            href="/register?track=BTEC"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:-translate-y-1"
          >
            {t('cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
}
