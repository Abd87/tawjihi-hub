import { MetadataRoute } from 'next';
import { subjectsData } from './[locale]/subjects/curriculumData';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tawjihihub.com';

  const staticRoutes = [
    '',
    '/courses',
    '/blog',
    '/subjects',
    '/foundation',
    '/grade11-exams',
    '/calculator'
  ];

  const entries: MetadataRoute.Sitemap = [];

  const createEntry = (routePath: string, changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' = 'weekly', priority: number = 0.8, lastModified: Date = new Date()): MetadataRoute.Sitemap[0] => {
    return {
      url: `${baseUrl}/ar${routePath}`,
      lastModified,
      changeFrequency: changeFreq,
      priority,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar${routePath}`,
          en: `${baseUrl}/en${routePath}`,
          'x-default': `${baseUrl}/ar${routePath}`,
        },
      },
    };
  };

  staticRoutes.forEach((route) => {
    entries.push(createEntry(route, route === '' || route === '/courses' ? 'daily' : 'weekly', route === '' ? 1 : 0.8));
  });

  subjectsData.forEach((subject) => {
    entries.push(createEntry(`/subjects/${subject.id}`, 'weekly', 0.9));
  });

  try {
    const courses = await prisma.course.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    });

    courses.forEach((course) => {
      entries.push(createEntry(`/courses/${course.id}`, 'weekly', 0.8, course.updatedAt || new Date()));
    });

    const blogs = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });

    blogs.forEach((blog) => {
      entries.push(createEntry(`/blog/${blog.slug}`, 'weekly', 0.7, blog.updatedAt || new Date()));
    });
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }

  return entries;
}