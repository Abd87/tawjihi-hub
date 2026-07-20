'use client'

import { Mail } from 'lucide-react'

export default function WaitlistForm({ locale }: { locale: string }) {
  return (
    <form 
      className="max-w-md mx-auto relative z-10 space-y-4" 
      onSubmit={(e) => { 
        e.preventDefault(); 
        alert(locale === 'ar' ? 'تم التسجيل بنجاح! سنقوم بالتواصل معك قريباً.' : 'Successfully registered! We will contact you soon.'); 
      }}
    >
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
  )
}
