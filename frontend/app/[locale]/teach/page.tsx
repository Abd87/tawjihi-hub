'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Sparkles, GraduationCap, Users, BookOpen, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function TeachPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    subject: '',
    experience: '',
    resumeLink: '',
  });

  const [status, setStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SUBMITTING');
    try {
      const res = await fetch('/api/teacher-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('SUCCESS');
        setFormData({ fullName: '', email: '', phoneNumber: '', subject: '', experience: '', resumeLink: '' });
      } else {
        setStatus('ERROR');
      }
    } catch (error) {
      setStatus('ERROR');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#020617] font-sans selection:bg-brand-500/30 selection:text-brand-300">
      {/* Decorative Gradients */}
      <div className="fixed top-0 start-0 w-[50vw] h-[50vw] rounded-full bg-brand-500/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 end-0 w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <main className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Hero Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              {isRtl ? 'فرصة رائعة للمعلمين' : 'Great Opportunity for Teachers'}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              {isRtl ? 'انضم إلى نخبة' : 'Join the Elite'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-500">
                {isRtl ? 'معلمي توجيهي هب' : 'Tawjihi Hub Teachers'}
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              {isRtl 
                ? 'نحن نبحث عن معلمين متميزين ومبدعين لتقديم محتوى تعليمي استثنائي لطلاب التوجيهي والـ BTEC في الأردن. سجل الآن وكن جزءاً من منصة التعليم الأسرع نمواً.'
                : 'We are looking for exceptional and creative teachers to provide outstanding educational content for Tawjihi and BTEC students in Jordan. Register now and be part of the fastest-growing educational platform.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              {[
                { icon: Users, title: isRtl ? 'آلاف الطلاب' : 'Thousands of Students', desc: isRtl ? 'الوصول إلى شريحة واسعة' : 'Reach a massive audience' },
                { icon: BookOpen, title: isRtl ? 'أدوات ذكية' : 'Smart Tools', desc: isRtl ? 'منصة متقدمة لتسهيل عملك' : 'Advanced platform to ease your work' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-sm">
                  <feature.icon className="h-6 w-6 text-brand-500 mb-3" />
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Application Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-500/20 to-purple-600/20 rounded-[2.5rem] blur-xl opacity-50" />
            
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-[2rem] p-6 sm:p-10 shadow-2xl">
              
              {status === 'SUCCESS' ? (
                <div className="text-center py-16 space-y-4 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white">{isRtl ? 'تم إرسال طلبك بنجاح!' : 'Application Submitted!'}</h2>
                  <p className="text-slate-400">{isRtl ? 'سيقوم فريقنا بمراجعة طلبك والتواصل معك قريباً.' : 'Our team will review your application and contact you soon.'}</p>
                  <button onClick={() => setStatus('IDLE')} className="mt-8 text-brand-400 font-bold hover:underline">
                    {isRtl ? 'إرسال طلب آخر' : 'Submit another application'}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-6">
                    {isRtl ? 'نموذج التقديم' : 'Application Form'}
                  </h2>

                  {status === 'ERROR' && (
                    <div className="mb-6 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold">
                      <AlertCircle className="w-5 h-5" />
                      {isRtl ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' : 'An error occurred while submitting the form. Please try again.'}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1.5">{isRtl ? 'الاسم الرباعي' : 'Full Name'}</label>
                      <input required name="fullName" value={formData.fullName} onChange={handleChange} type="text" 
                        className="w-full bg-slate-950/50 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-3 text-white transition-all outline-none" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1.5">{isRtl ? 'البريد الإلكتروني' : 'Email'}</label>
                        <input required name="email" value={formData.email} onChange={handleChange} type="email" dir="ltr"
                          className="w-full bg-slate-950/50 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-3 text-white transition-all outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-300 mb-1.5">{isRtl ? 'رقم الهاتف' : 'Phone Number'}</label>
                        <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} type="tel" dir="ltr"
                          className="w-full bg-slate-950/50 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-3 text-white transition-all outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1.5">{isRtl ? 'المادة التي ترغب بتدريسها' : 'Subject you want to teach'}</label>
                      <input required name="subject" value={formData.subject} onChange={handleChange} type="text" 
                        className="w-full bg-slate-950/50 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-3 text-white transition-all outline-none" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1.5">{isRtl ? 'نبذة عن خبرتك' : 'Brief about your experience'}</label>
                      <textarea required name="experience" value={formData.experience} onChange={handleChange} rows={3}
                        className="w-full bg-slate-950/50 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-3 text-white transition-all outline-none resize-none" />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-300 mb-1.5">{isRtl ? 'رابط السيرة الذاتية أو حسابك (اختياري)' : 'Resume Link or Social Profile (Optional)'}</label>
                      <input name="resumeLink" value={formData.resumeLink} onChange={handleChange} type="url" dir="ltr"
                        className="w-full bg-slate-950/50 border border-slate-700 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 rounded-xl px-4 py-3 text-white transition-all outline-none" />
                    </div>

                    <button 
                      type="submit" 
                      disabled={status === 'SUBMITTING'}
                      className="w-full mt-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
                    >
                      {status === 'SUBMITTING' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      {isRtl ? 'إرسال الطلب' : 'Submit Application'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
