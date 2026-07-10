'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Settings, Save, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const t = useTranslations('admin');
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [settings, setSettings] = useState({
    enabled: true,
    originalPrice: 20,
    discountPrice: 10,
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings/promo')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setToast(null);
    try {
      const res = await fetch('/api/admin/settings/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed to save');
      setToast({ msg: isRtl ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully', type: 'success' });
    } catch (error) {
      setToast({ msg: isRtl ? 'حدث خطأ أثناء الحفظ' : 'Error saving settings', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-brand-500/30">
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 shadow-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            {isRtl ? (
              <><ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" /><span>لوحة القيادة</span></>
            ) : (
              <><ArrowLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-1" /><span>Dashboard</span></>
            )}
          </Link>
          <div className="flex items-center gap-2.5">
            <Settings className="h-5 w-5 text-brand-500" />
            <h1 className="text-base font-bold text-white">{isRtl ? 'إعدادات المنصة' : 'Platform Settings'}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-10 pb-20 relative z-10">
        
        {toast && (
          <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold animate-fade-in ${
            toast.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {toast.msg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
            <div className="p-5 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white">{isRtl ? 'إعدادات العرض الترويجي' : 'Promo Offer Settings'}</h2>
                <p className="text-xs text-slate-400 mt-1">{isRtl ? 'تحكم في النافذة المنبثقة التي تظهر للزوار' : 'Control the popup shown to visitors'}</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm font-semibold text-slate-300">{isRtl ? 'مُفعّل' : 'Enabled'}</span>
                <input 
                  type="checkbox" 
                  name="enabled"
                  checked={settings.enabled} 
                  onChange={handleChange}
                  className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-brand-500 focus:ring-brand-500 focus:ring-offset-slate-900 transition-colors"
                />
              </label>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">{isRtl ? 'السعر الأصلي (JOD)' : 'Original Price (JOD)'}</label>
                  <input 
                    type="number" 
                    name="originalPrice"
                    value={settings.originalPrice}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5">{isRtl ? 'سعر الخصم (JOD)' : 'Discount Price (JOD)'}</label>
                  <input 
                    type="number" 
                    name="discountPrice"
                    value={settings.discountPrice}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{isRtl ? 'العنوان (عربي)' : 'Title (Arabic)'}</label>
                <input 
                  type="text" 
                  name="titleAr"
                  value={settings.titleAr}
                  onChange={handleChange}
                  dir="rtl"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{isRtl ? 'العنوان (إنجليزي)' : 'Title (English)'}</label>
                <input 
                  type="text" 
                  name="titleEn"
                  value={settings.titleEn}
                  onChange={handleChange}
                  dir="ltr"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{isRtl ? 'الوصف (عربي)' : 'Description (Arabic)'}</label>
                <textarea 
                  name="descriptionAr"
                  value={settings.descriptionAr}
                  onChange={handleChange}
                  dir="rtl"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">{isRtl ? 'الوصف (إنجليزي)' : 'Description (English)'}</label>
                <textarea 
                  name="descriptionEn"
                  value={settings.descriptionEn}
                  onChange={handleChange}
                  dir="ltr"
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="p-5 border-t border-slate-800 bg-slate-900 flex justify-end">
              <button 
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>{isRtl ? 'حفظ التغييرات' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>

      </main>
    </div>
  );
}
