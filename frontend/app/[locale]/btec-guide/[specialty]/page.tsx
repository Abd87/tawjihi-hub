import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Mail, Sparkles, BookOpen, Clock, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface Props {
  params: { locale: string; specialty: string };
}

// Allowed specialties for SEO
const validSpecialties = ['engineering', 'it', 'business', 'agriculture', 'hospitality', 'beauty'];

export async function generateMetadata({ params: { locale, specialty } }: Props): Promise<Metadata> {
  if (!validSpecialties.includes(specialty)) return { title: 'Not Found' };
  
  const arTitle = `تخصص BTEC ${specialty.toUpperCase()} - منهاج وشرح توجيهي الأردن`;
  const enTitle = `BTEC ${specialty.toUpperCase()} Specialization - Tawjihi Jordan Guide`;
  
  return {
    title: locale === 'ar' ? arTitle : enTitle,
    description: locale === 'ar' 
      ? `سجل الآن لتصلك إشعارات إطلاق دورات BTEC ${specialty.toUpperCase()} على منصة توجيهي هب.`
      : `Join the waitlist for BTEC ${specialty.toUpperCase()} courses on Tawjihi Hub.`,
    openGraph: {
      title: locale === 'ar' ? arTitle : enTitle,
      images: ['/api/og'] // generic OG
    }
  };
}

export default async function BtecSpecialtyPage({ params: { locale, specialty } }: Props) {
  unstable_setRequestLocale(locale);
  if (!validSpecialties.includes(specialty)) {
    notFound();
  }

  const titleAr = `تخصص ${specialty.toUpperCase()} المهني BTEC`;
  const titleEn = `BTEC ${specialty.toUpperCase()} Specialization`;
  
  return (
    <div className="min-h-screen bg-[#020617] font-sans">
      <Navbar locale={locale} />
      
      {/* Hero Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-[10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Link href="/btec-guide" className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium mb-8 transition-colors">
          {locale === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {locale === 'ar' ? 'العودة إلى الدليل الشامل' : 'Back to General Guide'}
        </Link>
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            BTEC Jordan 2026/2027
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
            {locale === 'ar' ? titleAr : titleEn}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            {locale === 'ar' 
              ? 'نعمل حالياً على تجهيز أقوى الشروحات والملخصات وأسئلة السنوات المخصصة لهذا المسار مع نخبة من الأساتذة.'
              : 'We are currently preparing the strongest explanations, summaries, and past papers dedicated to this track with elite educators.'}
          </p>
        </div>

        {/* Lead Capture Form */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-brand-500/10 blur-[100px] pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <Mail className="w-12 h-12 text-brand-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {locale === 'ar' ? 'سجل في قائمة الانتظار الحصرية' : 'Join the Exclusive Waitlist'}
            </h3>
            <p className="text-slate-400">
              {locale === 'ar' 
                ? 'كن أول من يعلم عند إطلاق الدورات الخاصة بتخصصك واحصل على خصم 50% للمسجلين المبكرين.'
                : 'Be the first to know when courses for your specialization launch and get a 50% early-bird discount.'}
            </p>
          </div>

          <form className="max-w-md mx-auto relative z-10 space-y-4" onSubmit={(e) => { e.preventDefault(); alert(locale === 'ar' ? 'تم التسجيل بنجاح! سنقوم بالتواصل معك قريباً.' : 'Successfully registered! We will contact you soon.'); }}>
            <input 
              type="text" 
              placeholder={locale === 'ar' ? 'الاسم الكامل' : 'Full Name'}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            <input 
              type="email" 
              placeholder={locale === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            <input 
              type="tel" 
              placeholder={locale === 'ar' ? 'رقم الهاتف (اختياري)' : 'Phone Number (Optional)'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
            />
            <button 
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold shadow-xl shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              {locale === 'ar' ? 'سجلني الآن' : 'Register Me Now'}
            </button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500 relative z-10">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> {locale === 'ar' ? 'نحترم خصوصيتك' : 'We respect your privacy'}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500" /> {locale === 'ar' ? 'مقاعد الخصم محدودة' : 'Discount seats are limited'}</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-brand-500" /> {locale === 'ar' ? 'محتوى معتمد' : 'Verified Content'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
