'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Bot, Plus, X, Loader2, Edit, Trash2 } from 'lucide-react';
import { createManualBlogPost, getBlogPosts, updateBlogPost, deleteBlogPost } from './actions';

export default function AdminBlogPage({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isRunningBot, setIsRunningBot] = useState(false);
  const [botMessage, setBotMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    const res = await getBlogPosts();
    if (res.success) {
      setPosts(res.posts || []);
    }
    setIsLoading(false);
  };

  const handleRunBot = async () => {
    setIsRunningBot(true);
    setBotMessage('');
    try {
      const res = await fetch('/api/cron/news');
      const data = await res.json();
      setBotMessage(data.message || 'Bot finished successfully!');
      fetchPosts();
    } catch (error) {
      setBotMessage('Error running bot.');
    } finally {
      setIsRunningBot(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (editingPost) {
      await updateBlogPost(editingPost.id, formData);
    } else {
      await createManualBlogPost(formData);
    }
    closeModal();
    fetchPosts();
  };

  const handleDelete = async (id: string) => {
    if (confirm(isRtl ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this post?')) {
      await deleteBlogPost(id);
      fetchPosts();
    }
  };

  const openEditModal = (post: any) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingPost(null);
    setIsModalOpen(false);
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

      {/* Articles Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            {isRtl ? 'لوحة تحكم المقالات' : 'Articles Dashboard'}
          </h3>
          <Link href="/blog" className="text-brand-500 font-bold text-sm hover:underline">
            {isRtl ? 'عرض المدونة العامة ←' : 'View Public Blog ←'}
          </Link>
        </div>
        
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-12 text-center">
            <Newspaper className="h-16 w-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">
              {isRtl ? 'لا يوجد مقالات حتى الآن' : 'No articles yet'}
            </h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {isRtl 
                ? 'انقر على تشغيل الروبوت لجلب الأخبار أو أضف مقالاً يدوياً.'
                : 'Click Run Bot or add an article manually.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-slate-800/50 text-slate-400 text-sm border-b border-slate-800">
                  <th className={`p-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'العنوان' : 'Title'}</th>
                  <th className={`p-4 font-medium ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'تاريخ النشر' : 'Date'}</th>
                  <th className="p-4 font-medium text-center">{isRtl ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition group">
                    <td className="p-4">
                      <div className="font-bold text-white">{post.titleAr}</div>
                      <div className="text-sm text-slate-500 truncate max-w-md">{post.slug}</div>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(post.createdAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US')}
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      <button 
                        onClick={() => openEditModal(post)}
                        className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-500/10 rounded-lg transition"
                        title={isRtl ? 'تعديل' : 'Edit'}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                        title={isRtl ? 'حذف' : 'Delete'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Manual Article Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl border border-slate-700 w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">
                {editingPost ? (isRtl ? 'تعديل المقال' : 'Edit Article') : (isRtl ? 'كتابة مقال جديد' : 'Write New Article')}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form action={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'العنوان (عربي)' : 'Title (Arabic)'}
                </label>
                <input required name="titleAr" defaultValue={editingPost?.titleAr} type="text" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'رابط المقال (Slug - اختياري)' : 'Slug (Optional)'}
                </label>
                <input name="slug" type="text" defaultValue={editingPost?.slug} placeholder="e.g. tawjihi-math-guide-2026" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'نبذة قصيرة (Excerpt)' : 'Short Excerpt'}
                </label>
                <textarea required name="excerptAr" defaultValue={editingPost?.excerptAr} rows={2} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'محتوى المقال (يدعم HTML)' : 'Article Content (HTML supported)'}
                </label>
                <textarea required name="contentAr" defaultValue={editingPost?.contentAr} rows={8} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition" placeholder="<h2>العنوان الفرعي</h2><p>الفقرة...</p>"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {isRtl ? 'الكلمات المفتاحية (Keywords - مفصولة بفاصلة)' : 'SEO Keywords (comma separated)'}
                </label>
                <input name="keywords" type="text" defaultValue={editingPost?.keywords} placeholder="توجيهي, منصة تعليمية, منهاج جديد" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500 transition" />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:bg-slate-800 transition">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" className="px-6 py-3 rounded-xl font-bold bg-brand-500 text-white hover:bg-brand-600 transition shadow-lg shadow-brand-500/20">
                  {editingPost ? (isRtl ? 'حفظ التعديلات' : 'Save Changes') : (isRtl ? 'نشر المقال' : 'Publish Article')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
