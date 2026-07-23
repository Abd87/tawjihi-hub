import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  Calculator, 
  Beaker, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Users, 
  Compass, 
  Laptop, 
  Wrench, 
  Briefcase, 
  Film, 
  Hotel, 
  Palette,
  Award,
  Radio,
  FileText,
  Flame,
  Check,
  ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import TypewriterTitle from '@/components/btec/TypewriterTitle';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';
  return {
    title: isRtl ? 'منصة BTEC الأولى والوحيدة في الأردن | توجيهي هب' : 'The #1 Dedicated BTEC Platform in Jordan | Tawjihi Hub',
    description: isRtl 
      ? 'المنصة الأولى المتخصصة بالكامل لطلاب نظام BTEC في الأردن. شرح دراسي مبسط، بنك الأخطاء التفاعلي، إرشادات تقارير Pearson، وحاسبة معدل BTEC المعتمدة.'
      : 'The only dedicated learning platform for BTEC Vocational students in Jordan. Simplified Pearson notes, Mistake Bank, assignment guides, and BTEC GPA calculator.',
    keywords: [
      'BTEC Jordan', 'BTEC Tawjihi', 'بتيك الأردن', 'منهاج BTEC', 'توجيهي BTEC', 
      'حاسبة معدل BTEC', 'تقارير BTEC', 'BTEC IT Jordan', 'BTEC Engineering Jordan', 
      'توجيهي مهني BTEC', 'تكنولوجيا معلومات BTEC', 'هندسة BTEC'
    ],
  };
}

export default async function BtecLandingPage({ params: { locale } }: { params: { locale: string } }) {
  unstable_setRequestLocale(locale);
  const isRtl = locale === 'ar';

  const btecSpecialties = [
    {
      id: 'it',
      icon: Laptop,
      color: 'from-blue-500 to-cyan-500',
      titleAr: 'تكنولوجيا المعلومات (Information Technology)',
      titleEn: 'Information Technology (IT)',
      descAr: 'شامل لوحدات البرمجة، الشبكات، البرمجيات، وتطوير الأنظمة وفق أعلى معايير Pearson.',
      badgeAr: 'الأكثر طلباً 🚀',
      badgeEn: 'Most Popular 🚀',
      slug: 'btec-it',
    },
    {
      id: 'engineering',
      icon: Wrench,
      color: 'from-amber-500 to-orange-500',
      titleAr: 'الهندسة والتصنيع (Engineering)',
      titleEn: 'Engineering & Manufacturing',
      descAr: 'تغطية متكاملة لمبادئ الهندسة الكهربائية، الميكانيكية، الرسم الهندسي وتطبيقات الورش.',
      badgeAr: 'مسار هندسي ⚙️',
      badgeEn: 'Engineering Track ⚙️',
      slug: 'btec-engineering',
    },
    {
      id: 'business',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-500',
      titleAr: 'إدارة الأعمال (Business)',
      titleEn: 'Business & Management',
      descAr: 'شرح مبسط لوحدات التسويق، المحاسبة المالية، الموارد البشرية، وإدارة المشاريع الريادية.',
      badgeAr: 'مسار إداري 💼',
      badgeEn: 'Business Track 💼',
      slug: 'btec-business',
    },
    {
      id: 'media',
      icon: Film,
      color: 'from-purple-500 to-pink-500',
      titleAr: 'الوسائط الرقمية والخلاقة (Creative Media)',
      titleEn: 'Creative Digital Media',
      descAr: 'إنتاج الجرافيك، المونتاج المرئي، تصميم الصوت، والوسائط التفاعلية الحديثة.',
      badgeAr: 'مسار إبداعي 🎬',
      badgeEn: 'Creative Track 🎬',
      slug: 'btec-creative-media',
    },
    {
      id: 'hospitality',
      icon: Hotel,
      color: 'from-rose-500 to-red-500',
      titleAr: 'الضيافة والسياحة (Hospitality)',
      titleEn: 'Hospitality & Tourism',
      descAr: 'إدارة الفنادق، خدمات الأغذية والمشروبات، وتنظيم الفعاليات والمهرجانات السياحية.',
      badgeAr: 'مسار فندقي 🏨',
      badgeEn: 'Hospitality Track 🏨',
      slug: 'btec-hospitality',
    },
    {
      id: 'art',
      icon: Palette,
      color: 'from-violet-500 to-indigo-500',
      titleAr: 'الفنون والتصميم (Art & Design)',
      titleEn: 'Art & Design',
      descAr: 'أساسيات الرسم والتصميم ثلاثي الأبعاد، البورتفوليو، والمعارض الفنية التطبيقية.',
      badgeAr: 'مسار فني 🎨',
      badgeEn: 'Art Track 🎨',
      slug: 'btec-art-design',
    },
  ];

  const exclusiveFeatures = [
    {
      icon: BookOpen,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      titleAr: 'بنك الأخطاء والتمارين التفاعلي',
      titleEn: 'Interactive Mistake Bank',
      descAr: 'النظام الوحيد في الأردن الذي يحتفظ تلقائياً بكافة التمارين والأسئلة التي أخطأت بها لإعادة إتقانها ومراجعتها قبل الامتحان النهائي.',
      descEn: 'The only system in Jordan that automatically saves wrong answers for targeted re-testing before official exams.',
    },
    {
      icon: Calculator,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      titleAr: 'حاسبة معدل BTEC المخصصة للأردن',
      titleEn: 'Custom Jordan BTEC GPA Calculator',
      descAr: 'حاسبة دقيقة مبنية خصيصاً وفق معايير التقييم (Pass, Merit, Distinction) ومعادلة وزارة التربية والتعليم الأردنية.',
      descEn: 'Built specifically for Jordan’s BTEC Pass/Merit/Distinction grading rules and Ministry equivalency.',
    },
    {
      icon: FileText,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      titleAr: 'إرشادات وتقارير تكليفات Pearson',
      titleEn: 'Pearson BTEC Assignment Guides',
      descAr: 'شرح خطوة بخطوة لكيفية صياغة التقارير واستيفاء كافة معايير التكليفات للحصول على تقدير الامتياز (Distinction).',
      descEn: 'Step-by-step guidance on fulfilling Pearson criteria to achieve Distinction grades on report assignments.',
    },
    {
      icon: Radio,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      titleAr: 'إعلانات وتنبيهات مباشرة من المهندسين والمعلمين',
      titleEn: 'Direct Teacher & Engineer Broadcasts',
      descAr: 'تواصل وتنبيهات فورية من أفضل مهندسي ومعلمي BTEC في الأردن لإرشادك حول المواعيد والتقارير والامتحانات.',
      descEn: 'Direct broadcasts and urgent updates from Jordan’s top BTEC engineers and teachers.',
    },
    {
      icon: Beaker,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      titleAr: 'المختبرات والورش الافتراضية المصورة',
      titleEn: 'Virtual Practical Labs & Workshops',
      descAr: 'تجارب وتطبيقات مصورة تخدم التخصصات الهندسية والتقنية والوسائط لتسهيل فهم المادة العملية بسهولة.',
      descEn: 'Visual practical demonstrations and virtual lab exercises for engineering and technical BTEC tracks.',
    },
    {
      icon: ShieldCheck,
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
      titleAr: 'تغطية 100% لمناهج Pearson المعتمدة',
      titleEn: '100% Pearson Approved Curriculum Coverage',
      descAr: 'محتوى دراسي منظم مقسم حسب الوحدات والتكليفات الرسمية لضمان أعلى درجات الفهم والاستيعاب.',
      descEn: 'Organized course content structured according to official Pearson unit assignments and specifications.',
    },
  ];

  const faqs = [
    {
      qAr: 'كيف تختلف منصة توجيهي هب عن المنصات التعليمية التقليدية في الأردن؟',
      qEn: 'How is Tawjihi Hub different from traditional learning platforms in Jordan?',
      aAr: 'المنصات التقليدية تركز فقط على المسار الأكاديمي وتهمل طلاب BTEC. في توجيهي هب، صممنا المنصة بالكامل لخدمة نظام BTEC، ووفرنا خصائص حصرية مثل بنك الأخطاء، وحاسبة معدل BTEC، وتوجيهات تقارير Pearson.',
      aEn: 'Traditional platforms only focus on academic Tawjihi and ignore BTEC. Tawjihi Hub is purpose-built for BTEC in Jordan with unique features like the Mistake Bank, BTEC GPA Calculator, and Pearson assignment guides.',
    },
    {
      qAr: 'هل تغطي المنصة جميع تخصصات BTEC المعتمدة في الأردن؟',
      qEn: 'Does the platform cover all BTEC tracks approved in Jordan?',
      aAr: 'نعم، المنصة تغطي كافة التخصصات الرئيسية: تكنولوجيا المعلومات (IT)، الهندسة، إدارة الأعمال، الوسائط الرقمية والخلاقة، الضيافة والسياحة، والفنون والتصميم.',
      aEn: 'Yes, we cover Information Technology (IT), Engineering, Business, Creative Media, Hospitality, and Art & Design.',
    },
    {
      qAr: 'كيف تساعدني المنصة في حل وتسليم التكليفات والتقارير (Assignments)؟',
      qEn: 'How does Tawjihi Hub help with BTEC Assignments and Reports?',
      aAr: 'توفر المنصة شرحاً مفصلاً لكل تكليف مع توضيح المعايير المطلوبة لتحقيق Pass وMerit وDistinction، مما يساعدك على إعداد تقرير متكامل واحترافي بنفسك.',
      aEn: 'We provide detailed breakdowns of assignment rubrics, showing you exactly how to structure your reports to meet Pass, Merit, and Distinction criteria.',
    },
    {
      qAr: 'هل حاسبة معدل BTEC في المنصة دقيقة ومعتمدة في الأردن؟',
      qEn: 'Is the BTEC Calculator on the platform accurate for Jordan?',
      aAr: 'بالتأكيد، تم تطوير الحاسبة وفق نظام التقييم الرسمي والمعادلة المعتمدة لطلاب BTEC في الأردن لتحديد معدلك الدقيق وتوقع قبولاتك الجامعية.',
      aEn: 'Absolutely. It is built strictly according to Jordan’s official BTEC grading framework to help you predict your final equivalency score.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-brand-500/30 selection:text-brand-300 relative overflow-x-hidden">
      {/* Background Neon Lighting */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-[80vw] max-w-7xl h-[500px] bg-gradient-to-b from-brand-500/15 via-cyan-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-brand-500/30 text-brand-400 text-xs sm:text-sm font-bold shadow-lg shadow-brand-500/10 backdrop-blur-xl">
            <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
            <span>{isRtl ? 'المنصة الأولى والوحيدة المتخصصة لطلاب BTEC في الأردن 🔥' : 'The #1 Dedicated BTEC Platform in Jordan 🔥'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.15] tracking-tight">
            {isRtl ? (
              <>
                بينما تهمل المنصات الأخرى طلاب BTEC.. <br />
                <TypewriterTitle isRtl={true} />
              </>
            ) : (
              <>
                Empowering BTEC Students in Jordan <br />
                <TypewriterTitle isRtl={false} />
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            {isRtl
              ? 'توقف عن البحث في المنصات الأكاديمية العادية. توجيهي هب تمنحك شرحاً مفصلاً لمناهج Pearson العالمية، توجيهات التكليفات والتقارير، بنك الأخطاء التفاعلي، وحاسبة معدل BTEC المعتمدة.'
              : 'Stop relying on generic academic platforms. Tawjihi Hub is custom-built for Pearson BTEC in Jordan with specialized notes, assignment rubrics, Mistake Bank, and BTEC GPA calculation.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center justify-center gap-3 group"
            >
              <span>{isRtl ? 'انضم مجاناً وادرس BTEC الآن' : 'Join Free & Start BTEC Now'}</span>
              {isRtl ? (
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </Link>

            <Link
              href="/calculator"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2.5 backdrop-blur-xl"
            >
              <Calculator className="w-5 h-5 text-brand-400" />
              <span>{isRtl ? 'احسب معدلك في BTEC' : 'Calculate BTEC GPA'}</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/80">
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center">
              <span className="text-xl sm:text-2xl font-black text-white block">100%</span>
              <span className="text-xs text-slate-400 font-semibold">{isRtl ? 'منهاج Pearson المعتمد' : 'Pearson Curriculum'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-400 block">6</span>
              <span className="text-xs text-slate-400 font-semibold">{isRtl ? 'تخصصات BTEC رئيسية' : 'BTEC Tracks'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center">
              <span className="text-xl sm:text-2xl font-black text-brand-400 block">Distinction</span>
              <span className="text-xs text-slate-400 font-semibold">{isRtl ? 'توجيهات التقارير العليا' : 'Report Criteria'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 block">24/7</span>
              <span className="text-xs text-slate-400 font-semibold">{isRtl ? 'بنك أخطاء تفاعلي' : 'Mistake Bank Access'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>{isRtl ? 'خصائص مخصصة لطلاب BTEC فقط' : 'Exclusive BTEC Platform Features'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            {isRtl ? 'لماذا توجيهي هب هي المنصة الأولى لطلاب BTEC؟' : 'Why Tawjihi Hub is the #1 Choice for BTEC Students'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            {isRtl
              ? 'صممنا أدوات تعليمية فريدة لا توجد في أي منصة أخرى لضمان تفوقك وتسهيل دراستك اليومية'
              : 'We developed specialized educational tools unmatched by standard platforms.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exclusiveFeatures.map((f, idx) => {
            const IconComp = f.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 hover:border-brand-500/40 rounded-3xl p-8 space-y-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-black/40 group relative overflow-hidden"
              >
                <div className={`p-4 rounded-2xl border w-fit ${f.color} group-hover:scale-110 transition-transform`}>
                  <IconComp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
                  {isRtl ? f.titleAr : f.titleEn}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {isRtl ? f.descAr : f.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* BTEC Specialties Explorer Grid */}
      <section className="py-20 bg-slate-950/80 border-y border-slate-800/80 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
              <Compass className="w-4 h-4" />
              <span>{isRtl ? 'تخصصات BTEC المعتمدة في الأردن' : 'Jordan BTEC Approved Specialties'}</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              {isRtl ? 'اختر تخصصك وابدأ التعلم بتوجيه احترافي' : 'Explore Your BTEC Track & Master Your Units'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {isRtl
                ? 'تغطية شاملة لكافة المسارات المهنية والهندسية والإدارية المعتمدة في التوجيهي المهني'
                : 'Comprehensive unit coverage across all vocational BTEC streams in Jordan.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {btecSpecialties.map((spec) => {
              const SpecIcon = spec.icon;
              return (
                <div
                  key={spec.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-6 hover:border-slate-700 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3.5 rounded-2xl bg-gradient-to-r ${spec.color} text-white shadow-md`}>
                        <SpecIcon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-amber-400 font-extrabold text-[11px]">
                        {isRtl ? spec.badgeAr : spec.badgeEn}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white leading-snug group-hover:text-brand-400 transition-colors">
                      {isRtl ? spec.titleAr : spec.titleEn}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                      {isRtl ? spec.descAr : spec.descEn}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 flex items-center justify-between">
                    <Link
                      href={`/btec-guide/${spec.slug}`}
                      className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <span>{isRtl ? 'عرض تفاصيل التخصص' : 'Specialty Details'}</span>
                      {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </Link>

                    <Link
                      href="/register"
                      className="px-4 py-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 hover:bg-brand-500 hover:text-white text-xs font-extrabold transition-all"
                    >
                      {isRtl ? 'تسجيل للدورة' : 'Enroll'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Assignment & Distinction Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-800 rounded-3xl p-8 md:p-14 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRtl ? 'توجيهات التكليفات والتقارير (Pearson Rubrics)' : 'Pearson Report Rubrics'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {isRtl ? (
                <>
                  كيف تضمن الحصول على تقدير <br />
                  <span className="text-emerald-400">Distinction (امتياز)</span> في جميع تقاريرك؟
                </>
              ) : (
                <>
                  Achieve Top <span className="text-emerald-400">Distinction Grades</span> <br />
                  in Your BTEC Assignments
                </>
              )}
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
              {isRtl
                ? 'تقارير BTEC ليست مجرد كتابة عادية! في توجيهي هب نساعدك على استيفاء كافة المعايير المطلوبة من Pearson خطوة بخطوة، لتسليم تقرير متكامل واحترافي يضمن لك أعلى علامة.'
                : 'BTEC assignments require fulfilling strict Pearson criteria. Tawjihi Hub breaks down each assignment task step-by-step so you achieve Distinction confidently.'}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/register"
                className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <span>{isRtl ? 'سجل وابدأ إعداد تقاريرك الآن' : 'Start BTEC Assignments'}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-96 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shrink-0 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              {isRtl ? 'مستويات التقييم المعتمدة:' : 'BTEC Grading Scale:'}
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between">
                <span>Distinction (امتياز)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">D* / D</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-between">
                <span>Merit (جيد جداً)</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">M</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-between">
                <span>Pass (مقبول)</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">P</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent & Student FAQ Accordion */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>{isRtl ? 'الأسئلة الشائعة حول BTEC في الأردن' : 'BTEC Jordan FAQ'}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            {isRtl ? 'كل ما يحتاجه الطالب وأولي الأمر معرفته' : 'Frequently Asked Questions'}
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-start gap-3">
                <span className="text-brand-400 font-black">Q.</span>
                <span>{isRtl ? faq.qAr : faq.qEn}</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium pe-4">
                {isRtl ? faq.aAr : faq.aEn}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky High-Conversion Bottom Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <div className="bg-gradient-to-r from-brand-600 via-amber-600 to-brand-700 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-2xl shadow-brand-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight max-w-3xl mx-auto">
            {isRtl
              ? 'جاهز لتكون من أوائل طلاب BTEC في الأردن؟ 🔥'
              : 'Ready to Become a Top BTEC Scholar in Jordan? 🔥'}
          </h2>

          <p className="text-brand-100 text-sm sm:text-base max-w-2xl mx-auto font-medium">
            {isRtl
              ? 'سجل حسابك الآن مجاناً واستفد من الشروحات المفصلة، بنك الأخطاء، وحاسبة المعدل المخصصة.'
              : 'Create your free account today and get instant access to BTEC lessons, Mistake Bank, and GPA Calculator.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-10 py-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all"
            >
              {isRtl ? 'إنشاء حساب جديد مجاناً' : 'Create Free Account'}
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-10 py-4 bg-slate-950/40 hover:bg-slate-950/60 border border-white/20 text-white font-bold text-base rounded-2xl transition-all"
            >
              {isRtl ? 'تسجيل الدخول' : 'Log In'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
