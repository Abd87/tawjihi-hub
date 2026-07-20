import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Calendar, User, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute for fresh news

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';
  
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return (
    <div className="min-h-screen bg-slate-950">
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
            {isRtl ? 'مدونة وأخبار التوجيهي' : 'Tawjihi Blog & News'}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {isRtl 
              ? 'تابع أحدث القرارات الوزارية، ومقالات التفوق الدراسي، ونصائح المذاكرة من خبراء منصة توجيهي هب.'
              : 'Follow the latest ministerial decisions, academic excellence articles, and study tips from Tawjihi Hub experts.'}
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-slate-800">
            <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-300">
              {isRtl ? 'لا توجد مقالات بعد' : 'No articles yet'}
            </h3>
            <p className="text-slate-500 mt-2">
              {isRtl ? 'قريباً سيتم نشر أحدث الأخبار هنا.' : 'Latest news will be published here soon.'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${locale}/blog/${post.slug}`}
                className="group flex flex-col bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden hover:border-brand-500/50 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-300"
              >
                <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={isRtl ? post.titleAr : post.titleEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-900/40 to-slate-900 flex items-center justify-center">
                      <BookOpen className="h-10 w-10 text-brand-500/50" />
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(post.createdAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      <span>{isRtl ? post.author.nameAr : post.author.nameEn || 'Tawjihi Hub'}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors line-clamp-2">
                    {isRtl ? post.titleAr : post.titleEn}
                  </h2>
                  
                  <p className="text-slate-400 text-sm mb-6 line-clamp-3 flex-1">
                    {isRtl ? post.excerptAr : post.excerptEn}
                  </p>

                  <div className="flex items-center gap-2 text-brand-500 font-bold text-sm mt-auto">
                    <span>{isRtl ? 'اقرأ المزيد' : 'Read more'}</span>
                    {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
