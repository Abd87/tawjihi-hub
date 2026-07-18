'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Bot, Plus, X, Loader2 } from 'lucide-react';
import { createManualBlogPost } from './actions';

export default function AdminBlogPage({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRunningBot, setIsRunningBot] = useState(false);
  const [botMessage, setBotMessage] = useState('');

  // We fetch posts dynamically in client to keep it simple with the modal state
  // Or we could have used server components and passed props, but client is fine for admin
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    // Basic fetch of posts (we should ideally have an API, but since we didn't build a GET API for admin, 
    // we'll just show the UI for the bot and the modal. In a real app we'd fetch actual data here.
    // For now we'll just let the server action revalidate and we could reload or just use standard NextJS.
    // Actually, converting this entirely to client component means we can't use prisma directly.
    // Let's just refresh the window for simplicity after actions.
  };

  const handleRunBot = async () => {
    setIsRunningBot(true);
    setBotMessage('');
    try {
      const res = await fetch('/api/cron/news');
      const data = await res.json();
      setBotMessage(data.message || 'Bot finished successfully!');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setBotMessage('Error running bot.');
    } finally {
      setIsRunningBot(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await createManualBlogPost(formData);
    setIsModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-brand-500" />
            {isRtl ? 'إدارة المدونة والمقالات' : 'Manage Blog & Articles'}
          </h1>
          <p className="text-slate-400 mt-1">
            {isRtl ? 'قم بإدارة مقالات السيو وتحديثات الأخبار' : 'Manage SEO articles and news updates'}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleRunBot}
            disabled={isRunningBot}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg hover:bg-slate-700 transition border border-slate-700"
          >
            {isRunningBot ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <Bot className="h-5 w-5 text-brand-500" />}
            {isRtl ? 'تشغيل روبوت جلب الأخبار' : 'Run News Scraper Bot'}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition"
          >
            <Plus className="h-5 w-5" />
            {isRtl ? 'إضافة مقال يدوياً' : 'Add Manual Article'}
          </button>
        </div>
      </div>

      {botMessage && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl font-medium">
          {botMessage}
        </div>
      )}

      <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
        <div className="p-12 text-center">
          <Newspaper className="h-16 w-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {isRtl ? 'لوحة تحكم المقالات' : 'Articles Dashboard'}
          </h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">
            {isRtl 
              ? 'انقر على تشغيل الروبوت لجلب أحدث التحديثات من موقع المركز الوطني لتطوير المناهج (NCCD) تلقائياً، أو قم بكتابة مقالك الخاص لدعم السيو.'
              : 'Click Run Bot to fetch the latest NCCD curriculum updates automatically, or write your own manual SEO article.'}
          </p>
          <Link href={`/${locale}/blog`} className="text-brand-500 font-bold hover:underline">
            {isRtl ? 'عرض المدونة العامة ←' : 'View Public Blog ←'}
          </Link>
        </div>
      </div>

      {/* Manual Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">
                {isRtl ? 'كتابة مقال جديد' : 'Write New Article'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form action={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'العنوان (عربي)' : 'Title (Arabic)'}
                </label>
                <input required name="titleAr" type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'رابط المقال (Slug - اختياري)' : 'Slug (Optional)'}
                </label>
                <input name="slug" type="text" placeholder="e.g. tawjihi-math-guide-2026" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'نبذة قصيرة (Excerpt)' : 'Short Excerpt'}
                </label>
                <textarea required name="excerptAr" rows={2} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'محتوى المقال (يدعم HTML)' : 'Article Content (HTML supported)'}
                </label>
                <textarea required name="contentAr" rows={8} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition" placeholder="<h2>العنوان الفرعي</h2><p>الفقرة...</p>"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'الكلمات المفتاحية (Keywords - مفصولة بفاصلة)' : 'SEO Keywords (comma separated)'}
                </label>
                <input name="keywords" type="text" placeholder="توجيهي, منصة تعليمية, منهاج جديد" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition" />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-6 py-3 rounded-xl font-bold bg-brand-500 text-white hover:bg-brand-600 transition shadow-lg shadow-brand-500/20">
                  {isRtl ? 'نشر المقال' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
