import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/parent/'],
    },
    sitemap: 'https://tawjihihub.com/sitemap.xml',
  };
}
