import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import PromoPopup from '@/components/PromoPopup';
import HeroVideoBackground from '@/components/HeroVideoBackground';
import HomeAuthRedirect from '@/components/HomeAuthRedirect';
import { Link } from '@/i18n/routing';
import prisma from '@/lib/prisma';
import { teachersData } from '@/data/teachers';
import { 
  ArrowRight, 
  ArrowLeft, 
  Video, 
  FileDown, 
  Layers, 
  Compass, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  FileText,
  BadgeAlert,
  ArrowUpRight,
  Users,
  User
} from 'lucide-react';

interface PageProps {
  params: { locale: string };
}

export default async function HomePage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations(); // Actually useTranslations works inside async components in next-intl v3? No, getTranslations is safer in Server Components. Wait, next-intl's `useTranslations` can be used in async Server Components if configured correctly. Let's stick to getTranslations.
  // Wait, I will just keep `useTranslations` because the component might be relying on it. Actually Next-intl requires `getTranslations` in async Server Components.


  const renderForwardArrow = () => {
    return locale === 'ar' ? (
      <ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-1" />
    ) : (
      <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
    );
  };

  let latestPosts: any[] = [];
  try {
    latestPosts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  } catch (err) {
    console.error('Error fetching blog posts for home page:', err);
  }

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-x-hidden font-sans selection:bg-brand-500/30 selection:text-brand-300">
      <HomeAuthRedirect />
      
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#020617]">
        <Image 
          src="/og-image.webp"
          alt="Background"
          fill
          priority
          quality={60}
          className="object-cover opacity-40 scale-105"
        />
        <HeroVideoBackground />
        {/* Dark Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/80 to-[#020617] pointer-events-none" />
      </div>

      {/* Background Decorative Glowing Blobs (Premium Aesthetic) */}
      <div className="absolute top-[-10%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[20%] end-[-15%] w-[45vw] h-[45vw] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] start-[20%] w-[40vw] h-[40vw] rounded-full bg-brand-600/10 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10">
        <PromoPopup />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* Ministry Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/5 text-brand-300 text-xs sm:text-sm font-semibold tracking-wide animate-pulse mb-8">
          <span className="flex h-2 w-2 rounded-full bg-brand-500" />
          {t('hero.badge')}
        </div>

        {/* Dynamic Typography Main Header */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          {t('hero.titleFirst')}{' '}
          <span className="bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 bg-clip-text text-transparent drop-shadow-sm">
            {t('hero.titleGradient')}
          </span>
          <br />
          <span className="text-slate-100">{t('hero.titleSecond')}</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* Hero Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4.5 w-full sm:w-auto">
          <a
            href="#tracks-section"
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-60 px-6 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 shadow-xl shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300"
          >
            <span>{t('hero.ctaPrimary')}</span>
            {renderForwardArrow()}
          </a>
          <a
            href="#features-section"
            className="inline-flex items-center justify-center w-full sm:w-60 px-6 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300"
          >
            {t('hero.ctaSecondary')}
          </a>
        </div>

        {/* Platform Stat Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full border-t border-slate-900 pt-10">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">4K Ultra HD</span>
            <span className="text-xs text-slate-500 mt-1">{t('features.videoTitle')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">100% Pearson</span>
            <span className="text-xs text-slate-500 mt-1">{t('features.pdfTitle')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">CEFR Std</span>
            <span className="text-xs text-slate-500 mt-1">{t('features.quizTitle')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">12th Grade Only</span>
            <span className="text-xs text-slate-500 mt-1">Focus & Specialization</span>
          </div>
        </div>

      </section>

      {/* Tracks Section (Strict Separator Bridge) */}
      <section id="tracks-section" className="py-20 md:py-28 relative border-t border-slate-900 bg-gradient-to-b from-[#020617] via-slate-950/40 to-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-brand-500 text-xs sm:text-sm font-extrabold uppercase tracking-widest bg-brand-500/5 px-4 py-1.5 rounded-full border border-brand-500/10">
              {t('tracks.badge')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
              {t('tracks.title')}
            </h2>
            <p className="text-slate-400 mt-4 text-base sm:text-lg">
              {t('tracks.subtitle')}
            </p>
          </div>

          {/* Features Marquee */}
          <div className="relative w-full overflow-hidden mb-16 md:mb-20 flex items-center py-5 bg-slate-900/20 border-y border-slate-800/40">
            {/* Left and Right Gradients for smooth fade */}
            <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#020617] to-transparent z-10" />
            <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#020617] to-transparent z-10" />
            
            <div className={`flex w-max items-center space-x-12 px-6 whitespace-nowrap ${locale === 'ar' ? 'animate-marquee-rtl space-x-reverse' : 'animate-marquee'}`}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`flex items-center space-x-12 ${locale === 'ar' ? 'space-x-reverse' : ''}`}>
                  <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-brand-500" />
                    <span className="text-slate-300 font-bold">{locale === 'ar' ? 'نخبة من الأساتذة' : 'Elite Teachers'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-brand-500" />
                    <span className="text-slate-300 font-bold">{locale === 'ar' ? 'مناهج Pearson المعتمدة' : 'Certified Pearson Curriculum'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-brand-500" />
                    <span className="text-slate-300 font-bold">{locale === 'ar' ? 'أقوى نظام تقييم ذكي' : 'Smart Evaluation System'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-brand-500" />
                    <span className="text-slate-300 font-bold">{locale === 'ar' ? 'ملخصات وأسئلة سنوات' : 'Summaries & Past Papers'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-brand-500" />
                    <span className="text-slate-300 font-bold">{locale === 'ar' ? 'متابعة شاملة لأولياء الأمور' : 'Parent Tracking'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Bridge Grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            
            {/* Track 1: BTEC Vocational Track */}
            <div id="btec-track" className="relative group rounded-3xl p-6.5 sm:p-8 border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-brand-500/50 transition-all duration-500 flex flex-col justify-between shadow-2xl overflow-hidden">
              {/* Glow backdrop overlay */}
              <div className="absolute top-0 end-0 w-48 h-48 bg-gradient-to-bl from-brand-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
              
              <div>
                {/* Track Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 group-hover:scale-110 transition-transform">
                    <Compass className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 border border-slate-800 px-3 py-1 rounded-full uppercase">
                    Ministry Stream
                  </span>
                </div>

                {/* Track Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-brand-400 transition-colors">
                  {t('tracks.btecTitle')}
                </h3>
                
                {/* Track Description */}
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                  {t('tracks.btecDesc')}
                </p>

                {/* Subjects Structure Container */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 mb-8">
                  <div className="flex items-center gap-2 mb-3 text-brand-400 font-semibold text-xs sm:text-sm">
                    <Layers className="h-4.5 w-4.5" />
                    <span>{t('tracks.btecSubjects')}</span>
                  </div>
                  <p className="text-white text-sm sm:text-base font-medium tracking-wide">
                    {t('tracks.btecKeySubjects')}
                  </p>
                  
                  {/* Additional info badge */}
                  <div className="mt-4 pt-3 border-t border-slate-900 text-xs text-slate-500 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Focus strictly on these four ministry subjects to guarantee success without additional curriculum clutter.</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link 
                href="/register?track=BTEC" 
                aria-label={`${t('tracks.chooseTrack')} ${t('tracks.btecTitle')}`}
                className="group w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white bg-slate-950 border border-slate-800 group-hover:border-brand-500/50 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                <span>{t('tracks.chooseTrack')}</span>
                {renderForwardArrow()}
              </Link>
            </div>

            {/* Track 2: Academic Track (Tawjihi) */}
            <div id="academic-track" className="relative group rounded-3xl p-6.5 sm:p-8 border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 hover:border-blue-500/50 transition-all duration-500 flex flex-col justify-between shadow-2xl overflow-hidden">
              {/* Glow backdrop overlay */}
              <div className="absolute top-0 end-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
              
              <div>
                {/* Track Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-brand-400 bg-brand-500/10 border border-brand-500/20 px-3 py-1 rounded-full uppercase">
                    {t('tracks.popular')}
                  </span>
                </div>

                {/* Track Title */}
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {t('tracks.academicTitle')}
                </h3>
                
                {/* Track Description */}
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
                  {t('tracks.academicDesc')}
                </p>

                {/* Subjects Structure Container */}
                <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 mb-8">
                  <div className="flex items-center gap-2 mb-3 text-blue-400 font-semibold text-xs sm:text-sm">
                    <BookOpen className="h-4.5 w-4.5" />
                    <span>{t('tracks.academicSubjects')}</span>
                  </div>
                  <p className="text-white text-sm sm:text-base font-medium tracking-wide">
                    {t('tracks.academicKeySubjects')}
                  </p>

                  {/* Additional info badge */}
                  <div className="mt-4 pt-3 border-t border-slate-900 text-xs text-slate-500 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>Tailored specifically for Scientific, Literary, and traditional fields using Pearson curriculum frameworks.</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Link 
                href="/register?track=ACADEMIC" 
                aria-label={`${t('tracks.chooseTrack')} ${t('tracks.academicTitle')}`}
                className="group w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white bg-slate-950 border border-slate-800 group-hover:border-blue-500/50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <span>{t('tracks.chooseTrack')}</span>
                {renderForwardArrow()}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Grade 11 Free Lead Magnet Exam Section */}
      <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 border-y border-slate-800/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-gradient-to-r from-brand-950/80 via-slate-900/90 to-amber-950/80 border border-brand-500/30 rounded-3xl p-8 md:p-12 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-400 text-xs font-extrabold">
                <GraduationCap className="w-4 h-4" />
                <span>{locale === 'ar' ? '🎁 جديد حصري أول ثانوي (Action Pack 11)' : '🎁 New Grade 11 Free Unit Exams'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {locale === 'ar'
                  ? 'اختبر نفسك مجاناً في امتحانات أول ثانوي لـ 10 وحدات كاملة!'
                  : 'Free Grade 11 Unit Exams for All 10 Units!'}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {locale === 'ar'
                  ? 'حضّر نفسك مسبقاً لمرحلة التوجيهي وقس مستواك في مفردات وقواعد الوحدات من Unit 1 إلى Unit 10 بحساب وتصحيح تلقائي وتخزين أخطائك في بنك الأخطاء.'
                  : 'Prepare early for Tawjihi and test your English proficiency across Units 1 to 10 with instant feedback and automatic error tracking.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/grade11-exams"
                  className="px-6 py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-500/25 transition-all inline-flex items-center gap-2"
                >
                  <span>{locale === 'ar' ? 'تصفح امتحانات أول ثانوي المجانية 🚀' : 'Explore Free Grade 11 Exams 🚀'}</span>
                  {renderForwardArrow()}
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 shrink-0 w-full sm:w-auto">
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
                <span className="text-2xl font-black text-brand-400">10</span>
                <span className="text-[11px] text-slate-400 font-bold block">{locale === 'ar' ? 'وحدات دراسية' : 'Units'}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
                <span className="text-2xl font-black text-amber-400">195+</span>
                <span className="text-[11px] text-slate-400 font-bold block">{locale === 'ar' ? 'سؤال وزارى' : 'Questions'}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
                <span className="text-2xl font-black text-emerald-400">100%</span>
                <span className="text-[11px] text-slate-400 font-bold block">{locale === 'ar' ? 'مجاني بالكامل' : 'Free Access'}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-center space-y-1">
                <span className="text-2xl font-black text-cyan-400">CEFR</span>
                <span className="text-[11px] text-slate-400 font-bold block">{locale === 'ar' ? 'معايير دولية' : 'Standards'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz Engine & Interactive Assessment Showcase */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative border-t border-slate-900">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Content Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-semibold">
              Assessment Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {locale === 'ar' 
                ? 'محرك اختبارات ذكي يحاكي معايير CEFR العالمية' 
                : 'Smart Assessment Engine Aligned with CEFR Standards'}
            </h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              {locale === 'ar'
                ? 'اختبر مهاراتك من خلال أسئلة الاختيار من متعدد والأسئلة المقالية القصيرة التي تقيس الفهم الفعلي. تتضمن كل اختباراتنا تصحيحاً تلقائياً وتفسيرات وافية للإجابات.'
                : 'Challenge your learning with multiple-choice and short-answer questions designed to evaluate true proficiency. Complete with auto-grading and clear solution breakdowns.'}
            </p>

            <ul className="space-y-3.5 text-sm sm:text-base text-slate-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0" />
                <span>{locale === 'ar' ? 'تصحيح مقالي ذكي للأسئلة القصيرة' : 'AI-assisted short answer grading'}</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0" />
                <span>{locale === 'ar' ? 'مستويات صعوبة متدرجة (A1 - C2)' : 'Graded difficulty levels (A1 to C2)'}</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-brand-500 shrink-0" />
                <span>{locale === 'ar' ? 'تحليل تفصيلي لنقاط القوة والضعف' : 'In-depth performance analytics'}</span>
              </li>
            </ul>
          </div>

          {/* Interactive Simulation Panel */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-500 to-amber-600 opacity-20 blur-xl pointer-events-none" />
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 sm:p-8 shadow-2xl">
              
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-850 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">CEFR Level: B2</span>
                  <span className="text-xs text-slate-500">English Grammar Diagnostic</span>
                </div>
                <span className="text-xs font-mono text-slate-400">08:45 Remaining</span>
              </div>

              {/* Question 1 (MCQ) */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded h-fit">Q1</span>
                  <h3 className="text-white text-sm sm:text-base font-semibold">
                    {locale === 'ar'
                      ? 'اختر الزمن الصحيح للفعل في الجملة التالية:'
                      : 'Choose the correct form of the verb to complete the sentence:'}
                  </h3>
                </div>
                <p className="text-slate-300 italic text-sm ps-7">
                  "By the time the professor arrived, the students ________ the physics lab assignment."
                </p>
                
                {/* MCQ Choices */}
                <div className="grid gap-3 ps-7">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-850 bg-slate-900/40 text-xs sm:text-sm text-slate-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 text-xs text-slate-500 font-semibold">A</span>
                    <span>finish</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-xs sm:text-sm text-emerald-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white font-semibold">B</span>
                    <span>had finished</span>
                    <span className="ms-auto text-xs text-emerald-400 font-semibold">{locale === 'ar' ? 'إجابة صحيحة' : 'Correct'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-850 bg-slate-900/40 text-xs sm:text-sm text-slate-300">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-700 text-xs text-slate-500 font-semibold">C</span>
                    <span>will finish</span>
                  </div>
                </div>
              </div>

              {/* Question 2 (Short Answer) */}
              <div className="space-y-4 pt-4 border-t border-slate-850">
                <div className="flex gap-2">
                  <span className="text-xs font-bold text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded h-fit">Q2</span>
                  <h3 className="text-white text-sm sm:text-base font-semibold">
                    {locale === 'ar'
                      ? 'اكتب إجابة موجزة تحدد السبب الرئيسي للثورة العربية الكبرى.'
                      : 'Write a short answer explaining the concept of photosynthesis.'}
                  </h3>
                </div>
                
                <div className="ps-7">
                  <textarea 
                    rows={2} 
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs sm:text-sm text-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                    placeholder={locale === 'ar' ? 'اكتب إجابتك هنا...' : 'Type your answer here...'}
                  />
                  <div className="flex justify-end mt-3">
                    <button className="px-4 py-2 rounded-lg bg-brand-500 text-white text-xs font-bold shadow hover:bg-brand-600 transition-all">
                      {locale === 'ar' ? 'تقديم الإجابة' : 'Submit Answer'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features Overview */}
      <section id="features-section" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {t('features.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: 4K Videos */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/15 p-6 hover:bg-slate-900/35 transition-all">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 mb-5">
              <Video className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('features.videoTitle')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t('features.videoDesc')}</p>
          </div>

          {/* Card 2: Pearson Sheets */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/15 p-6 hover:bg-slate-900/35 transition-all">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 mb-5">
              <FileDown className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('features.pdfTitle')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t('features.pdfDesc')}</p>
          </div>

          {/* Card 3: CEFR Assessments */}
          <div className="rounded-2xl border border-slate-850 bg-slate-900/15 p-6 hover:bg-slate-900/35 transition-all">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 mb-5">
              <HelpCircle className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('features.quizTitle')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{t('features.quizDesc')}</p>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section id="teachers-section" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-[#020617] relative">
        <div className="absolute top-[10%] end-[10%] w-[40vw] h-[40vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none z-0" />
        
        <div className="relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand-500 text-xs sm:text-sm font-extrabold uppercase tracking-widest bg-brand-500/5 px-4 py-1.5 rounded-full border border-brand-500/10">
              {locale === 'ar' ? 'نخبة الأساتذة' : 'Expert Teachers'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              {locale === 'ar' ? 'تعلم مع أفضل المعلمين الخبراء' : 'Learn from the Best Experts'}
            </h2>
            <p className="text-slate-400 mt-4 text-base sm:text-lg">
              {locale === 'ar' 
                ? 'فريقنا يتكون من معلمين ذوي خبرة طويلة في مناهج التوجيهي والـ BTEC.'
                : 'Our team consists of highly experienced teachers specializing in Tawjihi and BTEC curriculums.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {teachersData.map((teacher, index) => (
              <div key={teacher.id} className="col-span-1 rounded-3xl border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-all duration-500 shadow-xl overflow-hidden group hover:-translate-y-2 relative">
                {/* Image Section */}
                <div className={`relative h-72 sm:h-80 w-full overflow-hidden ${teacher.imageBgColor}`}>
                  <Image 
                    src={teacher.image}
                    alt={teacher.nameEn}
                    fill
                    className="object-contain object-bottom transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2 origin-bottom drop-shadow-2xl"
                  />
                  {/* Subtle vignette over the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                  
                  {/* Title & Badge */}
                  <div className="absolute bottom-4 start-6 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-black text-white mb-1.5 tracking-tight drop-shadow-lg">
                      {locale === 'ar' ? teacher.nameAr : teacher.nameEn}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-sm border border-white/10 text-brand-300 text-xs font-bold shadow-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                      <span>{locale === 'ar' ? teacher.roleAr : teacher.roleEn}</span>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6">
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                    {locale === 'ar' ? teacher.bioAr : teacher.bioEn}
                  </p>
                  
                  {/* Stats Footer */}
                  <div className="pt-5 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                      <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-emerald-500/20 transition-colors">
                        <Users className="w-4 h-4" />
                      </div>
                      <span>{locale === 'ar' ? teacher.stats.studentsAr : teacher.stats.studentsEn}</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                      <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-blue-500/20 transition-colors">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span>{locale === 'ar' ? teacher.stats.experienceAr : teacher.stats.experienceEn}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* About Us Section */}
      <section id="about-us-section" className="py-20 md:py-28 relative border-t border-slate-900 bg-[#020617]">
        <div className="absolute top-[20%] start-[20%] w-[30vw] h-[30vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <span className="text-brand-500 text-xs sm:text-sm font-extrabold uppercase tracking-widest bg-brand-500/5 px-4 py-1.5 rounded-full border border-brand-500/10">
              {t('about.title')}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
              {t('about.subtitle')}
            </h2>
            <p className="text-slate-400 mt-6 text-base sm:text-lg leading-relaxed">
              {t('about.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="rounded-3xl p-8 border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-all duration-500 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-brand-500/10 blur-3xl pointer-events-none rounded-full" />
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 mb-6 group-hover:scale-110 transition-transform">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('about.visionTitle')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{t('about.visionDesc')}</p>
            </div>
            
            <div className="rounded-3xl p-8 border border-slate-800 bg-slate-900/20 hover:bg-slate-900/40 transition-all duration-500 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 end-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none rounded-full" />
              <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Layers className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('about.missionTitle')}</h3>
              <p className="text-slate-400 leading-relaxed text-lg">{t('about.missionDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Study Resources Hub Section */}
      <section id="resources-section" className="py-16 border-t border-slate-900 bg-[#020617]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {locale === 'ar' ? 'أهم مصادر التوجيهي والمراجعات' : 'Top Tawjihi Study Resources'}
            </h2>
            <p className="text-slate-400 mt-3">
              {locale === 'ar' ? 'تصفح أحدث الملخصات، أسئلة السنوات، ونماذج الامتحانات.' : 'Browse the latest revision notes, past papers, and mock exams.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { en: "Tawjihi Biology Past Papers", ar: "أسئلة سنوات أحياء توجيهي" },
              { en: "2026 Mathematics Revision Notes", ar: "ملخصات رياضيات توجيهي 2026" },
              { en: "How to Study for Chemistry", ar: "كيف تدرس لامتحان الكيمياء" },
              { en: "BTEC Vocational Syllabus Guide", ar: "دليل تخصص BTEC المهني" },
              { en: "Tawjihi Physics Formulas PDF", ar: "ملخص قوانين الفيزياء توجيهي" },
              { en: "Ministry Mock Exams 2025", ar: "امتحانات الوزارة التجريبية 2025" }
            ].map((resource, i) => (
              <a 
                key={i} 
                href="#tracks-section" 
                className="flex items-center gap-3 p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-brand-500/30 transition-all text-slate-300 hover:text-white"
              >
                <FileText className="h-5 w-5 text-brand-500 shrink-0" />
                <span className="text-sm font-semibold">{locale === 'ar' ? resource.ar : resource.en}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SEO FAQ Section with JSON-LD Schema */}
      <section id="faq-section" className="py-16 border-t border-slate-900 bg-gradient-to-b from-[#020617] to-slate-950/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {locale === 'ar' ? 'الأسئلة الشائعة حول توجيهي هب' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q_en: "Are Tawjihi past papers included?",
                a_en: "Yes, our platform includes a massive bank of Tawjihi past papers seamlessly integrated into our CEFR-aligned quizzes.",
                q_ar: "هل تتوفر أسئلة سنوات سابقة للتوجيهي؟",
                a_ar: "نعم، المنصة تحتوي على بنك ضخم من أسئلة السنوات السابقة مدمجة في نظام الامتحانات الإلكترونية."
              },
              {
                q_en: "Do you support the BTEC vocational track?",
                a_en: "Absolutely. We are the first platform in Jordan to fully support the modern BTEC technical track with its 4 core ministry subjects.",
                q_ar: "هل تدعمون تخصص BTEC المهني؟",
                a_ar: "بالتأكيد، نحن أول منصة في الأردن تدعم مسار BTEC المهني بالكامل بمواده الوزارية الأربعة."
              },
              {
                q_en: "Can I download revision notes as PDF?",
                a_en: "Yes, all Pearson study guides and summaries are available as downloadable PDFs for offline studying.",
                q_ar: "هل يمكنني تحميل الملخصات كملفات PDF؟",
                a_ar: "نعم، جميع ملخصات Pearson وأوراق العمل متاحة للتحميل المباشر والدراسة دون اتصال بالإنترنت."
              }
            ].map((faq, i) => (
              <details key={i} className="group border border-slate-800 bg-slate-900/30 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex items-center justify-between p-5 text-white font-semibold outline-none hover:bg-slate-900/50 transition-colors">
                  <span>{locale === 'ar' ? faq.q_ar : faq.q_en}</span>
                  <ArrowRight className={`h-4 w-4 transition-transform group-open:rotate-90 ${locale === 'ar' ? 'rotate-180 group-open:-rotate-90' : ''}`} />
                </summary>
                <div className="px-5 pb-5 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4 bg-slate-900/10">
                  {locale === 'ar' ? faq.a_ar : faq.a_en}
                </div>
              </details>
            ))}
          </div>

          {/* Inject JSON-LD Schema for SEO FAQ */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": locale === 'ar' ? "هل تتوفر أسئلة سنوات سابقة للتوجيهي؟" : "Are Tawjihi past papers included?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": locale === 'ar' ? "نعم، المنصة تحتوي على بنك ضخم من أسئلة السنوات السابقة مدمجة في نظام الامتحانات الإلكترونية." : "Yes, our platform includes a massive bank of Tawjihi past papers seamlessly integrated into our CEFR-aligned quizzes."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": locale === 'ar' ? "هل تدعمون تخصص BTEC المهني؟" : "Do you support the BTEC vocational track?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": locale === 'ar' ? "بالتأكيد، نحن أول منصة في الأردن تدعم مسار BTEC المهني بالكامل بمواده الوزارية الأربعة." : "Absolutely. We are the first platform in Jordan to fully support the modern BTEC technical track with its 4 core ministry subjects."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": locale === 'ar' ? "هل يمكنني تحميل الملخصات كملفات PDF؟" : "Can I download revision notes as PDF?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": locale === 'ar' ? "نعم، جميع ملخصات Pearson وأوراق العمل متاحة للتحميل المباشر والدراسة دون اتصال بالإنترنت." : "Yes, all Pearson study guides and summaries are available as downloadable PDFs for offline studying."
                    }
                  }
                ]
              })
            }}
          />
        </div>
      </section>

      {/* Latest Blog & News Section */}
      {latestPosts.length > 0 && (
        <section className="relative py-20 bg-[#020617] border-t border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                  {locale === 'ar' ? 'أحدث الأخبار والمقالات' : 'Latest News & Articles'}
                </h2>
                <p className="text-slate-400 text-lg">
                  {locale === 'ar' 
                    ? 'تابع أهم قرارات وزارة التربية والتعليم ونصائح المذاكرة من خبراء توجيهي هب.'
                    : 'Follow the latest MOE decisions and study tips from Tawjihi Hub experts.'}
                </p>
              </div>
              <Link
                href="/blog"
                className="mt-6 md:mt-0 flex items-center gap-2 text-brand-500 font-bold hover:text-brand-400 transition"
              >
                {locale === 'ar' ? 'عرض كل المقالات' : 'View All Articles'}
                {renderForwardArrow()}
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-slate-900/50 rounded-3xl border border-slate-800 overflow-hidden hover:border-brand-500/50 hover:bg-slate-900 transition-all duration-300"
                >
                  {post.coverImage && (
                    <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt={locale === 'ar' ? post.titleAr : post.titleEn}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs font-semibold text-brand-500 mb-3">
                      {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US')}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors line-clamp-2">
                      {locale === 'ar' ? post.titleAr : post.titleEn}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                      {locale === 'ar' ? post.excerptAr : post.excerptEn}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-300 mt-auto">
                      {locale === 'ar' ? 'اقرأ التفاصيل' : 'Read Details'}
                      {renderForwardArrow()}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Premium Footer */}
      <footer className="border-t border-slate-900 bg-[#020617] pt-24 pb-12 relative overflow-hidden mt-12">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center justify-center text-center space-y-8 mb-16">
            <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
              <Image src="/logo.svg" alt="Tawjihi Hub Logo" width={180} height={60} className="h-16 w-auto" />
            </Link>
            
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed text-sm">
              {locale === 'ar' 
                ? 'المنصة التعليمية الأولى المصممة لتمكين طلاب التوجيهي الأكاديمي والمهني (BTEC) في الأردن من خلال التكنولوجيا الحديثة.'
                : 'The premier platform empowering Academic and BTEC Tawjihi students in Jordan with cutting-edge technology.'}
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium">
              <Link href="/about" className="text-slate-400 hover:text-white transition-colors">{locale === 'ar' ? 'عن المنصة' : 'About Us'}</Link>
              <a href="#tracks-section" className="text-slate-400 hover:text-white transition-colors">{t('navigation.academic')}</a>
              <a href="#tracks-section" className="text-slate-400 hover:text-white transition-colors">{t('navigation.btec')}</a>
              <Link href="/privacy-policy" className="text-slate-400 hover:text-white transition-colors">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
              <Link href="/refund-policy" className="text-slate-400 hover:text-white transition-colors">{locale === 'ar' ? 'سياسة الاسترجاع' : 'Refund Policy'}</Link>
              <a href="mailto:support@tawjihihub.com" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                <span>{locale === 'ar' ? 'تواصل معنا:' : 'Support:'}</span>
                <span className="text-brand-400 hover:underline">support@tawjihihub.com</span>
              </a>
            </div>
          </div>

          <div className="border-t border-slate-900/80 pt-8 flex flex-col items-center justify-center gap-6 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} Tawjihi Hub. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 hover:text-slate-400 transition-colors cursor-pointer">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                {locale === 'ar' ? 'جميع الأنظمة تعمل' : 'All systems operational'}
              </span>
            </div>
          </div>
        </div>
      </footer>

      </div> {/* End relative z-10 wrapper */}
    </div>
  );
}
