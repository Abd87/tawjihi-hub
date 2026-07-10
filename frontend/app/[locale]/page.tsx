import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import { Link } from '@/i18n/routing';
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
  ArrowUpRight
} from 'lucide-react';

interface PageProps {
  params: { locale: string };
}

export default function HomePage({ params: { locale } }: PageProps) {
  unstable_setRequestLocale(locale);
  const t = useTranslations();

  // Helper to determine arrow direction based on locale
  const renderForwardArrow = () => {
    return locale === 'ar' ? (
      <ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-1" />
    ) : (
      <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
    );
  };

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-x-hidden font-sans selection:bg-brand-500/30 selection:text-brand-300">
      
      {/* Background Decorative Glowing Blobs (Premium Aesthetic) */}
      <div className="absolute top-[-10%] start-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] end-[-15%] w-[45vw] h-[45vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] start-[20%] w-[40vw] h-[40vw] rounded-full bg-brand-600/5 blur-[120px] pointer-events-none" />

      {/* Navigation Bar */}
      <Navbar />

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
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
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
              <Link href="/register?track=BTEC" className="group w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white bg-slate-950 border border-slate-800 group-hover:border-brand-500/50 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
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
              <Link href="/register?track=ACADEMIC" className="group w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold text-white bg-slate-950 border border-slate-800 group-hover:border-blue-500/50 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <span>{t('tracks.chooseTrack')}</span>
                {renderForwardArrow()}
              </Link>
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
                  <h4 className="text-white text-sm sm:text-base font-semibold">
                    {locale === 'ar'
                      ? 'اختر الزمن الصحيح للفعل في الجملة التالية:'
                      : 'Choose the correct form of the verb to complete the sentence:'}
                  </h4>
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
                  <h4 className="text-white text-sm sm:text-base font-semibold">
                    {locale === 'ar'
                      ? 'اكتب إجابة موجزة تحدد السبب الرئيسي للثورة العربية الكبرى.'
                      : 'Write a short answer explaining the concept of photosynthesis.'}
                  </h4>
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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-brand-500" />
            <span className="font-semibold text-slate-400">توجيهي هب / Tawjihi Hub</span>
          </div>
          <p>© {new Date().getFullYear()} Tawjihi Hub. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#tracks-section" className="hover:text-slate-300 transition-colors">{t('navigation.academic')}</a>
            <a href="#tracks-section" className="hover:text-slate-300 transition-colors">{t('navigation.btec')}</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
