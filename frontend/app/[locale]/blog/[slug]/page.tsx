import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { Calendar, User, ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { slug: string; locale: string } }): Promise<Metadata> {
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
}

export default async function BlogPostPage({ params }: { params: { slug: string; locale: string } }) {
  const isRtl = params.locale === 'ar';

  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, published: true },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  const title = isRtl ? post.titleAr : post.titleEn;
  const content = isRtl ? post.contentAr : post.contentEn;
  const authorName = isRtl ? post.author.nameAr : post.author.nameEn || 'Tawjihi Hub';

  // JSON-LD Structured Data for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: [{
        '@type': 'Person',
        name: authorName,
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Tawjihi Hub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tawjihihub.com/favicon.png'
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <Link 
          href={`/${params.locale}/blog`}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-500 transition-colors mb-8"
        >
          {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {isRtl ? 'العودة للمدونة' : 'Back to Blog'}
        </Link>

        {post.coverImage && (
          <div className="relative w-full h-64 md:h-96 rounded-3xl overflow-hidden mb-10 shadow-2xl border border-slate-800">
            <Image
              src={post.coverImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
            {title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-500 border-y border-slate-800 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-500" />
              <time dateTime={post.createdAt.toISOString()}>
                {new Date(post.createdAt).toLocaleDateString(isRtl ? 'ar-JO' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-brand-500" />
              <span>{authorName}</span>
            </div>
          </div>
        </header>

        {/* Prose Content */}
        <article className="prose prose-invert prose-brand max-w-none prose-headings:font-black prose-a:text-brand-500 hover:prose-a:text-brand-400 prose-img:rounded-2xl">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </main>
    </div>
  );
}
