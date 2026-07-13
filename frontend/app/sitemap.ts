import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tawjihihub.com';

  const routes = [
    '',
    '/btec-guide',
    '/login',
    '/register',
    '/dashboard',
    '/redeem',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
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

  return sitemapEntries;
}
