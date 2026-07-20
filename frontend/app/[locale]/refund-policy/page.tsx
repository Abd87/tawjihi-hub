import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RefreshCcw, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function RefundPolicy({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';

  return (
    <div className={`min-h-screen bg-[#020617] text-slate-300 font-sans ${isRtl ? 'rtl' : 'ltr'} pb-24`}>
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <RefreshCcw className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            {isRtl ? 'سياسة استرجاع المبالغ' : 'Refund Policy'}
          </h1>
          <p className="text-lg text-slate-400">
            {isRtl 
              ? 'نحن في منصة توجيهي هب (Tawjihi Hub) نلتزم بتجربة تعلم عالية الجودة، ونضع سياسات واضحة لتعزيز الثقة وحماية حقوق جميع الأطراف.'
              : 'At Tawjihi Hub, we are committed to providing a high-quality learning experience with clear policies to build trust and protect everyone\'s rights.'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        
        <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <CheckCircle className="w-6 h-6 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? '1. أهلية الاسترجاع وشروطها' : '1. Refund Eligibility & Conditions'}
            </h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed" dir="auto">
            <p>{isRtl ? 'لتكون مطالبة الاسترجاع مؤهلة، يجب الالتزام بالشروط التالية:' : 'For a refund request to be eligible, the following conditions must be met:'}</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong className="text-slate-200">{isRtl ? 'فترة الطلب:' : 'Request Period:'}</strong> {isRtl ? 'يمكن تقديم طلب استرجاع خلال ثلاث (3) أيام عمل من تاريخ الشراء.' : 'Refund requests must be submitted within three (3) business days of purchase.'}</li>
              <li><strong className="text-slate-200">{isRtl ? 'نسبة استكمال المحتوى:' : 'Completion Percentage:'}</strong> {isRtl ? 'يجب ألا تكون نسبة استكمال المحتوى في الدورة قد تجاوزت 20%. إذا تم تجاوز هذه النسبة، يصبح الطلب غير مؤهل.' : 'Course completion must not exceed 20%. Requests exceeding this are ineligible.'}</li>
              <li><strong className="text-slate-200">{isRtl ? 'المشكلة الفنية:' : 'Technical Issues:'}</strong> {isRtl ? 'وجود خلل فني حقيقي وموثَّق في محتوى الدورة لم يتم حلّه خلال 48 ساعة من الإبلاغ.' : 'A documented, genuine technical issue that remains unresolved 48 hours after reporting.'}</li>
              <li><strong className="text-slate-200">{isRtl ? 'العروض الخاصة:' : 'Special Offers:'}</strong> {isRtl ? 'الدورات المشتراة ضمن عروض تخفيضية تمنع الاسترجاع غير مؤهلة.' : 'Courses purchased during special non-refundable promotions are ineligible.'}</li>
            </ul>
          </div>
        </section>

        <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? '2. الحالات غير المؤهلة للاسترجاع' : '2. Ineligible Cases'}
            </h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed" dir="auto">
            <p>{isRtl ? 'لا تعتبر المطالبة مؤهلة في الحالات التالية:' : 'A request is considered ineligible if:'}</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>{isRtl ? 'تجاوز نسبة إنجاز الدورة 20%.' : 'Course completion exceeds 20%.'}</li>
              <li>{isRtl ? 'سبب الطلب هو "عدم الاهتمام بالدورة" بدون وجود خلل فني.' : 'The reason for the refund is simply "loss of interest" without a technical fault.'}</li>
              <li>{isRtl ? 'تحميل أو تنزيل المواد الدراسية بنجاح إلى جهاز الطالب.' : 'Study materials have been successfully downloaded to the student\'s device.'}</li>
            </ul>
          </div>
        </section>

        <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Clock className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? '3. وقت المراجعة والمعالجة' : '3. Review & Processing Time'}
            </h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed" dir="auto">
            <p>{isRtl ? 'يتم التعامل مع الطلبات وفق الجدول الزمني التالي:' : 'Requests are handled on the following timeline:'}</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong className="text-slate-200">{isRtl ? 'التقييم:' : 'Evaluation:'}</strong> {isRtl ? 'يتم تقييم الطلب والرد بالقبول أو الرفض خلال 2-5 أيام عمل.' : 'Requests are evaluated and responded to within 2-5 business days.'}</li>
              <li><strong className="text-slate-200">{isRtl ? 'إعادة المبالغ:' : 'Refund:'}</strong> {isRtl ? 'في حال الموافقة، يتم إرجاع المبلغ إلى نفس وسيلة الدفع خلال 7 أيام عمل، مع مراعاة أوقات المعالجة البنكية.' : 'If approved, refunds are credited to the original payment method within 7 business days, subject to bank processing times.'}</li>
            </ul>
          </div>
        </section>

        <section className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800/50 hover:border-brand-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isRtl ? '4. كيفية تقديم الطلب' : '4. How to Apply'}
            </h2>
          </div>
          <div className="space-y-4 text-slate-400 leading-relaxed" dir="auto">
            <p>{isRtl ? 'لتقديم طلب استرجاع، يرجى التواصل معنا عبر البريد الإلكتروني أو الواتساب، وتزويدنا بالمعلومات التالية:' : 'To request a refund, please contact us via email or WhatsApp and provide:'}</p>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>{isRtl ? 'الاسم ورقم الحساب (رقم الهاتف).' : 'Name and Account Number (Phone).'}</li>
              <li>{isRtl ? 'اسم الدورة المراد استرجاعها.' : 'Name of the course to be refunded.'}</li>
              <li>{isRtl ? 'سبب الاسترجاع (مع إرفاق صور إن وجدت للمشكلة الفنية).' : 'Reason for refund (with screenshots if applicable).'}</li>
            </ul>
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg inline-block">
              <p className="text-brand-400 font-semibold mb-1">{isRtl ? 'البريد الإلكتروني:' : 'Email:'} support@tawjihihub.com</p>
            </div>
          </div>
        </section>

      </div>

      <div className="max-w-4xl mx-auto px-6 mt-8 flex justify-center">
        <Link 
          href={`/${locale}`}
          className="flex items-center gap-2 px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20"
        >
          {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          {isRtl ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
        </Link>
      </div>

    </div>
  );
}
