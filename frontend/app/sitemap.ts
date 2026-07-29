import { MetadataRoute } from 'next';
import { subjectsData } from './[locale]/subjects/curriculumData';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tawjihihub.com';

  const staticRoutes = [
    '',
    '/courses',
    '/login',
    '/register',
    '/dashboard',
    '/redeem',
    '/blog',
    '/subjects',
  ];

  const locales = ['ar', 'en'];
  
  const entries: MetadataRoute.Sitemap = [];

  // Generate localized URLs for static routes
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/courses' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
      });
    });
  });

  // Generate localized URLs for all subjects (SEO goldmine)
  subjectsData.forEach((subject) => {
    locales.forEach((locale) => {
      entries.push({
        url: `${baseUrl}/${locale}/subjects/${subject.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    });
  });

  // Fetch dynamic courses and blogs from database
  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    });

    courses.forEach((course) => {
      locales.forEach((locale) => {
        entries.push({
          url: `${baseUrl}/${locale}/courses/${course.id}`,
          lastModified: course.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      });
    });

    const blogs = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    blogs.forEach((blog) => {
      locales.forEach((locale) => {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${blog.slug}`,
          lastModified: blog.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    });
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }

  // Default redirect root
  entries.push({
    url: `${baseUrl}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  return entries;
}
