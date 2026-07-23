import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import GpaCalculator from '@/components/GpaCalculator';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CalculatorPageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: CalculatorPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'calculator' });
  
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDesc'),
    }
  };
}

export default async function CalculatorPage({ params: { locale } }: CalculatorPageProps) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('calculator');
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-[#020617] font-sans">
      
      {/* Hero Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-32 pb-20 md:pt-36 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div>
          <Link
            href={`/${locale}/dashboard`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900/60 hover:bg-slate-800 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold"
          >
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            <span>{isRtl ? 'العودة للوحة التحكم' : 'Back to Dashboard'}</span>
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            {t('title')}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <GpaCalculator />
      </div>
    </div>
  );
}
