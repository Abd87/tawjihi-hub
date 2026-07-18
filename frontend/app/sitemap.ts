import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tawjihihub.com';

  const staticRoutes = [
    '',
    '/btec-guide',
    '/login',
    '/register',
    '/dashboard',
    '/redeem',
    '/blog',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Routes
  staticRoutes.forEach((route) => {
    // Arabic Version
    sitemapEntries.push({
      url: `${baseUrl}/ar${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar${route}`,
          en: `${baseUrl}/en${route}`,
        },
      },
    });
    // English Version
    sitemapEntries.push({
      url: `${baseUrl}/en${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar${route}`,
          en: `${baseUrl}/en${route}`,
        },
      },
    });
  });

  try {
    // 2. Dynamic Course Routes
    const courses = await prisma.course.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    });

    courses.forEach((course) => {
      sitemapEntries.push({
        url: `${baseUrl}/ar/courses/${course.id}`,
        lastModified: course.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/courses/${course.id}`,
            en: `${baseUrl}/en/courses/${course.id}`,
          },
        },
      });
      sitemapEntries.push({
        url: `${baseUrl}/en/courses/${course.id}`,
        lastModified: course.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/courses/${course.id}`,
            en: `${baseUrl}/en/courses/${course.id}`,
          },
        },
      });
    });

    // 3. Dynamic Blog Routes
    const blogs = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    blogs.forEach((blog) => {
      sitemapEntries.push({
        url: `${baseUrl}/ar/blog/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/blog/${blog.slug}`,
            en: `${baseUrl}/en/blog/${blog.slug}`,
          },
        },
      });
      sitemapEntries.push({
        url: `${baseUrl}/en/blog/${blog.slug}`,
        lastModified: blog.updatedAt,
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: {
          languages: {
            ar: `${baseUrl}/ar/blog/${blog.slug}`,
            en: `${baseUrl}/en/blog/${blog.slug}`,
          },
        },
      });
    });
  } catch (err) {
    console.error('Error fetching dynamic routes for sitemap', err);
  }

  return sitemapEntries;
}
