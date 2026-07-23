import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { Calendar, User, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true },
    });

    if (!post) {
      return { title: 'Not Found' };
    }

    const isRtl = params.locale === 'ar';
    const title = isRtl ? post.titleAr : post.titleEn;
    const description = isRtl ? post.excerptAr : post.excerptEn;
    const keywords = post.keywords ? post.keywords.split(',').map(k => k.trim()) : [];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description: description || '',
        type: 'article',
        url: `https://tawjihihub.com/${params.locale}/blog/${post.slug}`,
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch (e) {
    return { title: 'Tawjihi Blog' };
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string; locale: string } }) {
  const isRtl = params.locale === 'ar';

  let post: any = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug, published: true },
      include: { author: true },
    });
  } catch (e) {
    console.error('Failed to fetch blog post by slug:', e);
  }

  if (!post) {
    notFound();
  }

  const title = isRtl ? post.titleAr : post.titleEn;
  const content = isRtl ? post.contentAr : post.contentEn;
  const authorName = isRtl ? post.author?.nameAr : post.author?.nameEn || 'Tawjihi Hub';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.createdAt.toISOString(),
    author: {
      '@type': 'Person',
      name: authorName,
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-20 lg:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${params.locale}/blog`}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-400 mb-8 transition-colors"
        >
          {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          <span>{isRtl ? 'العودة للمدونة' : 'Back to Blog'}</span>
        </Link>

        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
          {title}
        </h1>

        <div className="flex items-center gap-6 text-sm font-semibold text-slate-400 border-b border-slate-800 pb-8 mb-8">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-400" />
            {new Date(post.createdAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US')}
          </span>
          <span className="flex items-center gap-2">
            <User className="h-4 w-4 text-brand-400" />
            {authorName}
          </span>
        </div>

        {post.coverImage && (
          <div className="relative h-64 md:h-96 w-full rounded-3xl overflow-hidden mb-12 border border-slate-800 shadow-2xl">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div 
          className="prose prose-invert prose-brand max-w-none text-slate-300 text-lg leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
    </div>
  );
}
