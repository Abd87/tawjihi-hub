import prisma from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const isRtl = locale === 'ar';
  
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { author: true },
    });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
  }

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
                      <BookOpen className="h-12 w-12 text-brand-400/40" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-brand-400" />
                        {new Date(post.createdAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-brand-400" />
                        {isRtl ? post.author?.nameAr : post.author?.nameEn || 'توجيهي هب'}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-brand-400 transition-colors leading-snug">
                      {isRtl ? post.titleAr : post.titleEn}
                    </h2>

                    <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-6">
                      {isRtl ? post.excerptAr : post.excerptEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-brand-400 group-hover:text-brand-300">
                    <span>{isRtl ? 'اقرأ المقال كامل' : 'Read Full Article'}</span>
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
