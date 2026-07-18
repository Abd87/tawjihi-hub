import prisma from '@/lib/prisma';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function AdminBlogPage({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          {isRtl ? 'إدارة المدونة والمقالات' : 'Manage Blog & Articles'}
        </h1>
        <button className="bg-brand-500 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-brand-600 transition">
          {isRtl ? '+ إضافة مقال جديد' : '+ Add New Article'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'العنوان' : 'Title'}</th>
              <th className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'الرابط' : 'Slug'}</th>
              <th className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'الحالة' : 'Status'}</th>
              <th className={`px-6 py-4 ${isRtl ? 'text-right' : 'text-left'}`}>{isRtl ? 'الإجراءات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  {isRtl ? 'لا توجد مقالات بعد. يمكنك جلب الأخبار تلقائياً.' : 'No articles yet. You can auto-fetch news.'}
                  <br />
                  <a href="/api/cron/news" target="_blank" className="text-brand-500 hover:underline mt-2 inline-block font-bold">
                    {isRtl ? 'تشغيل روبوت جلب الأخبار (Cron)' : 'Run News Fetcher Cron'}
                  </a>
                </td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {isRtl ? post.titleAr : post.titleEn}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    /{locale}/blog/{post.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      post.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {post.published ? (isRtl ? 'منشور' : 'Published') : (isRtl ? 'مسودة' : 'Draft')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/${locale}/blog/${post.slug}`} className="text-brand-500 hover:underline font-semibold">
                      {isRtl ? 'عرض' : 'View'}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
