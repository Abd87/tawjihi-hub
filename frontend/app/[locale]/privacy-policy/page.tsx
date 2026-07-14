import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, Globe, Scale } from 'lucide-react';

export default function PrivacyPolicy({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-300 font-sans ${isRtl ? 'rtl' : 'ltr'} pb-24`}>
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="text-lg text-slate-400">
            {isRtl 
              ? 'نحن في منصة توجيهي هب (Tawjihi Hub) نلتزم بحماية خصوصيتك وبياناتك الشخصية بأعلى معايير الأمان.'
              : 'At Tawjihi Hub, we are committed to protecting your privacy and personal data with the highest security standards.'}
          </p>
          <p className="text-sm text-slate-500 mt-4">
            {isRtl ? 'آخر تحديث: يوليو 2024' : 'Last Updated: July 2024'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        
        {/* Section 1 */}
        <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? '1. البيانات التي نجمعها' : '1. Information We Collect'}
            </h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed" dir="auto">
            <p>{isRtl ? 'عند تسجيلك كطالب أو ولي أمر في المنصة، نقوم بجمع:' : 'When you register as a student or parent on the platform, we collect:'}</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>{isRtl ? 'المعلومات الشخصية الأساسية (الاسم، البريد الإلكتروني، رقم الهاتف).' : 'Basic personal information (Name, Email, Phone Number).'}</li>
              <li>{isRtl ? 'المعلومات الأكاديمية (الفرع الدراسي: أكاديمي أو BTEC).' : 'Academic information (Study track: Academic or BTEC).'}</li>
              <li>{isRtl ? 'بيانات الاستخدام والتقدم الدراسي لمتابعة أدائك عبر المنصة.' : 'Usage data and study progress to track your performance across the platform.'}</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Eye className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? '2. كيف نستخدم معلوماتك' : '2. How We Use Your Information'}
            </h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed" dir="auto">
            <p>{isRtl ? 'تُستخدم بياناتك للأغراض التالية:' : 'Your data is used for the following purposes:'}</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>{isRtl ? 'توفير تجربة تعليمية مخصصة وعرض الدورات المناسبة لتخصصك.' : 'Providing a personalized learning experience and showing courses relevant to your track.'}</li>
              <li>{isRtl ? 'إرسال تقارير الأداء الدوري لأولياء الأمور المرتبطين بحساب الطالب.' : 'Sending periodic performance reports to parents linked to the student\'s account.'}</li>
              <li>{isRtl ? 'تحسين جودة المنصة وخدماتها التعليمية.' : 'Improving the platform\'s quality and educational services.'}</li>
              <li>{isRtl ? 'التواصل معك بخصوص التحديثات الهامة والعروض.' : 'Communicating with you regarding important updates and offers.'}</li>
            </ul>
          </div>
        </section>

        {/* Section 3 */}
        <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <Lock className="w-6 h-6 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? '3. حماية البيانات والأمان' : '3. Data Protection and Security'}
            </h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed" dir="auto">
            <p>{isRtl ? 'نحن نتخذ كافة التدابير التقنية والتنظيمية لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح أو الإتلاف. تشمل هذه التدابير:' : 'We take all technical and organizational measures to protect your data from unauthorized access, modification, disclosure, or destruction. These measures include:'}</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>{isRtl ? 'تشفير كلمات المرور والبيانات الحساسة.' : 'Encryption of passwords and sensitive data.'}</li>
              <li>{isRtl ? 'استخدام خوادم آمنة وبروتوكولات اتصال مشفرة (HTTPS).' : 'Use of secure servers and encrypted communication protocols (HTTPS).'}</li>
              <li>{isRtl ? 'تقييد وصول الموظفين والمعلمين للبيانات إلا للضرورة القصوى لتأدية خدماتهم.' : 'Restricting staff and teacher access to data strictly to what is necessary for providing services.'}</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Globe className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? '4. مشاركة البيانات مع أطراف ثالثة' : '4. Data Sharing with Third Parties'}
            </h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed" dir="auto">
            <p>{isRtl ? 'نحن لا نبيع أو نؤجر معلوماتك الشخصية لأي جهة. قد نشارك بياناتك فقط في الحالات التالية:' : 'We do not sell or rent your personal information to anyone. We may only share your data in the following cases:'}</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>{isRtl ? 'مع مزودي الخدمات الذين يساعدوننا في تشغيل المنصة (تحت اتفاقيات سرية صارمة).' : 'With service providers who help us operate the platform (under strict confidentiality agreements).'}</li>
              <li>{isRtl ? 'بناءً على طلب قانوني من الجهات الحكومية المختصة وفقاً لقوانين المملكة الأردنية الهاشمية.' : 'Upon legal request from competent governmental authorities in accordance with the laws of the Hashemite Kingdom of Jordan.'}</li>
              <li>{isRtl ? 'مع ولي أمرك (إذا كان حسابك مرتبطاً بحساب ولي أمر).' : 'With your parent (if your account is linked to a parent account).'}</li>
            </ul>
          </div>
        </section>

        {/* Section 5 */}
        <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-brand-500/10 rounded-xl">
              <Scale className="w-6 h-6 text-brand-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? '5. حقوق المستخدم (الطلاب وأولياء الأمور)' : '5. User Rights (Students and Parents)'}
            </h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed" dir="auto">
            <p>{isRtl ? 'يحق لك في أي وقت:' : 'You have the right at any time to:'}</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>{isRtl ? 'الوصول إلى بياناتك الشخصية وتحديثها عبر لوحة التحكم الخاصة بك.' : 'Access and update your personal data via your dashboard.'}</li>
              <li>{isRtl ? 'طلب حذف حسابك وكافة البيانات المرتبطة به بالتواصل مع فريق الدعم.' : 'Request the deletion of your account and all associated data by contacting our support team.'}</li>
              <li>{isRtl ? 'سحب موافقتك على استلام الرسائل الترويجية.' : 'Withdraw your consent to receive promotional messages.'}</li>
            </ul>
          </div>
        </section>

      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 flex justify-center">
        <Link 
          href={`/${locale}`}
          className="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20"
        >
          {isRtl ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
        </Link>
      </div>

    </div>
  );
}
