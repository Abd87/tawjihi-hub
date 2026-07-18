import { Metadata } from 'next';
import { BookOpen, Calculator, FlaskConical, Atom, Globe2, Landmark, Code2, HeartPulse, Palette, MonitorPlay, Sprout, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'مواد التوجيهي الأردني | المنهاج الجديد - Tawjihi Hub',
  description: 'دليل شامل لجميع مواد التوجيهي الأردني للفرعين العلمي والأدبي والفروع المهنية. شروحات تفصيلية لمواد الرياضيات، الفيزياء، الكيمياء، الأحياء، واللغتين العربية والإنجليزية.',
  keywords: ['توجيهي', 'الأردن', 'مواد التوجيهي', 'رياضيات علمي', 'فيزياء', 'كيمياء', 'عربي تخصص', 'تاريخ الأردن', 'منصة تعليمية', 'Tawjihi Jordan', 'الفرع العلمي', 'الفرع الأدبي'],
};

const subjects = [
  // Core Subjects
  {
    id: 'math',
    titleAr: 'الرياضيات',
    titleEn: 'Mathematics',
    icon: <Calculator className="h-8 w-8" />,
    color: 'bg-blue-500/10 text-blue-500',
    streams: ['العلمي', 'الأدبي', 'الصناعي'],
    descriptionAr: 'من أهم المواد الأساسية في التوجيهي الأردني، تتضمن حساب التفاضل والتكامل، الهندسة التحليلية، والإحصاء. تركز على بناء مهارات حل المشكلات والتفكير المنطقي.',
  },
  {
    id: 'physics',
    titleAr: 'الفيزياء',
    titleEn: 'Physics',
    icon: <Atom className="h-8 w-8" />,
    color: 'bg-indigo-500/10 text-indigo-500',
    streams: ['العلمي', 'الصناعي'],
    descriptionAr: 'المادة الأساسية لفهم القوانين الطبيعية في المنهاج الأردني. تغطي الميكانيكا، الكهرومغناطيسية، والفيزياء الحديثة بأسلوب يربط النظرية بالتطبيقات العملية.',
  },
  {
    id: 'chemistry',
    titleAr: 'الكيمياء',
    titleEn: 'Chemistry',
    icon: <FlaskConical className="h-8 w-8" />,
    color: 'bg-emerald-500/10 text-emerald-500',
    streams: ['العلمي', 'الزراعي', 'الاقتصاد المنزلي'],
    descriptionAr: 'تغطي مفاهيم سرعة التفاعل، الاتزان الكيميائي، الحموض والقواعد، والكيمياء العضوية. ضرورية للطلبة الراغبين بدراسة التخصصات الطبية والهندسية.',
  },
  {
    id: 'biology',
    titleAr: 'العلوم الحياتية (الأحياء)',
    titleEn: 'Biology',
    icon: <HeartPulse className="h-8 w-8" />,
    color: 'bg-rose-500/10 text-rose-500',
    streams: ['العلمي', 'الزراعي'],
    descriptionAr: 'دراسة الكائنات الحية، الوراثة، أجهزة جسم الإنسان، والتنوع الحيوي. تعتبر المادة الأهم للراغبين في الالتحاق بكليات الطب والصيدلة في الجامعات الأردنية.',
  },
  {
    id: 'arabic',
    titleAr: 'اللغة العربية (مهارات)',
    titleEn: 'Arabic Language',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'bg-amber-500/10 text-amber-500',
    streams: ['مشترك لجميع الفروع'],
    descriptionAr: 'مادة إجبارية لجميع طلبة التوجيهي. تركز على مهارات المطالعة، القواعد النحوية والصرفية، البلاغة، وتذوق النصوص الأدبية والقصائد.',
  },
  {
    id: 'english',
    titleAr: 'اللغة الإنجليزية',
    titleEn: 'English Language',
    icon: <Globe2 className="h-8 w-8" />,
    color: 'bg-cyan-500/10 text-cyan-500',
    streams: ['مشترك لجميع الفروع'],
    descriptionAr: 'تغطي مهارات القراءة (Reading)، القواعد (Grammar)، والكتابة (Writing). مادة مفصلية للنجاح في امتحان الثانوية العامة الأردني بمعدل مرتفع.',
  },
  {
    id: 'islamic',
    titleAr: 'التربية الإسلامية',
    titleEn: 'Islamic Education',
    icon: <Landmark className="h-8 w-8" />,
    color: 'bg-teal-500/10 text-teal-500',
    streams: ['مشترك لجميع الفروع'],
    descriptionAr: 'تشمل العقيدة، التلاوة والتجويد، الفقه الإسلامي، والسيرة النبوية. من المواد التي يسهل على الطالب الأردني تحقيق العلامة الكاملة فيها.',
  },
  {
    id: 'history_jo',
    titleAr: 'تاريخ الأردن',
    titleEn: 'History of Jordan',
    icon: <Landmark className="h-8 w-8" />,
    color: 'bg-orange-500/10 text-orange-500',
    streams: ['مشترك لجميع الفروع'],
    descriptionAr: 'مادة وطنية إجبارية تسلط الضوء على تاريخ المملكة الأردنية الهاشمية، إنجازات الملوك الهاشميين، وتطور الدولة الأردنية سياسياً واقتصادياً.',
  },
  // Literary specific
  {
    id: 'arabic_special',
    titleAr: 'اللغة العربية (تخصص)',
    titleEn: 'Arabic (Specialization)',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'bg-amber-600/10 text-amber-600',
    streams: ['الأدبي', 'الشرعي'],
    descriptionAr: 'مادة معمقة في اللغة العربية تشمل النحو والصرف المتقدم، القضايا الأدبية في العصور المختلفة، البلاغة، والنقد الأدبي.',
  },
  {
    id: 'computer',
    titleAr: 'علوم الحاسوب',
    titleEn: 'Computer Science',
    icon: <Code2 className="h-8 w-8" />,
    color: 'bg-slate-400/10 text-slate-400',
    streams: ['الأدبي', 'العلمي (اختياري)'],
    descriptionAr: 'تتضمن أنظمة العد (الثنائي والعشري)، البوابات المنطقية، وأساسيات البرمجة وتصميم الخوارزميات وفق منهاج وزارة التربية والتعليم.',
  },
  {
    id: 'geography',
    titleAr: 'الجغرافيا',
    titleEn: 'Geography',
    icon: <Globe2 className="h-8 w-8" />,
    color: 'bg-lime-500/10 text-lime-500',
    streams: ['الأدبي'],
    descriptionAr: 'دراسة الظواهر الطبيعية والبشرية، الخرائط، المناخ، والجغرافيا الاقتصادية والسياسية مع التركيز على جغرافية الأردن والوطن العربي.',
  },
  {
    id: 'financial',
    titleAr: 'الثقافة المالية',
    titleEn: 'Financial Literacy',
    icon: <Landmark className="h-8 w-8" />,
    color: 'bg-green-500/10 text-green-500',
    streams: ['الأدبي'],
    descriptionAr: 'تعنى بالمفاهيم المالية الحديثة، البنوك، الاستثمار، إعداد الموازنات، وإدارة المخاطر المالية لمساعدة الطالب في حياته العملية.',
  }
];

export default function SubjectsPage({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-brand-500/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-500/20 via-slate-950 to-slate-950"></div>
        <div className="container relative mx-auto px-4 z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-brand-400 font-medium mb-6">
            <BookOpen className="h-4 w-4" />
            <span>{isRtl ? 'منهاج وزارة التربية والتعليم الأردنية' : 'Jordanian Ministry of Education Curriculum'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            {isRtl ? 'مواد التوجيهي الأردني' : 'Jordanian Tawjihi Subjects'}
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {isRtl 
              ? 'دليل شامل لجميع المواد الدراسية لطلبة الثانوية العامة (التوجيهي) في الأردن. تعرف على تفاصيل المواد المشتركة ومواد التخصص للفرعين العلمي والأدبي والفروع المهنية لمساعدتك في تحقيق أعلى المعدلات.'
              : 'A comprehensive guide to all subjects for high school (Tawjihi) students in Jordan. Explore core and elective subjects for Scientific, Literary, and Vocational streams to help you achieve top grades.'}
          </p>
        </div>
      </section>

      {/* Subjects Grid */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div key={subject.id} className="bg-slate-900 rounded-3xl border border-slate-800 p-8 hover:border-brand-500/50 transition-all hover:shadow-2xl hover:-translate-y-1 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                
                <div className={`w-16 h-16 rounded-2xl ${subject.color} flex items-center justify-center mb-6`}>
                  {subject.icon}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">
                  {isRtl ? subject.titleAr : subject.titleEn}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {subject.streams.map((stream, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold rounded-full">
                      {stream}
                    </span>
                  ))}
                </div>
                
                <p className="text-slate-400 leading-relaxed text-sm" dir="rtl">
                  {subject.descriptionAr}
                </p>
                
                <div className="mt-8 pt-6 border-t border-slate-800/50">
                  <Link href={`/${locale}/courses`} className="text-brand-500 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                    {isRtl ? 'تصفح دورات المادة ←' : 'Browse Courses →'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Footer Text */}
      <section className="py-12 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              {isRtl ? 'لماذا منصة Tawjihi Hub؟' : 'Why Tawjihi Hub?'}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed" dir={isRtl ? 'rtl' : 'ltr'}>
              {isRtl 
                ? 'توفر منصتنا أحدث الشروحات والدورات التفاعلية المطابقة تماماً للمنهاج الأردني المعتمد من قبل المركز الوطني لتطوير المناهج (NCCD) ووزارة التربية والتعليم. سواء كنت في الفرع العلمي تبحث عن شروحات الفيزياء والكيمياء، أو في الفرع الأدبي ترغب بتقوية مهاراتك في الجغرافيا وتاريخ الأردن، أو حتى طالب مسار مهني BTEC، فإننا نقدم لك أقوى البطاقات التعليمية، أوراق العمل، وامتحانات وزارية سابقة لضمان تفوقك وحصولك على مقعد في الجامعات الأردنية الحكومية.'
                : 'Our platform provides the latest interactive courses fully aligned with the Jordanian curriculum approved by NCCD and the Ministry of Education. Whether you are in the scientific stream looking for Physics and Chemistry, or the literary stream focusing on Geography and History of Jordan, we offer top educational cards, worksheets, and past ministerial exams to ensure your success.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
