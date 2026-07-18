import { MetadataRoute } from 'next';
import { subjectsData } from './[locale]/subjects/curriculumData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tawjihi-hub.com';

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

  // Default redirect root
  entries.push({
    url: `${baseUrl}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  });

  return entries;
}
