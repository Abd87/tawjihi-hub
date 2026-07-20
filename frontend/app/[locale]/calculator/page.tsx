import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import GpaCalculator from '@/components/GpaCalculator';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';

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

  return (
    <div className="min-h-screen bg-[#020617] font-sans">
      <Navbar locale={locale} />
      
      {/* Hero Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
