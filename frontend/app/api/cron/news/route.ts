import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as cheerio from 'cheerio'; 

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) {
      return NextResponse.json({ error: 'No admin user found to author posts' }, { status: 400 });
    }

    let createdCount = 0;

    // 1. Fetch MOE RSS Feed
    const moeUrl = 'https://moe.gov.jo/rss.xml';

    try {
      const response = await fetch(moeUrl, { next: { revalidate: 3600 } });
      const xml = await response.text();
      
      const $ = cheerio.load(xml, { xmlMode: true });
      const items = $('item').slice(0, 10); // Grab up to 10 latest news items

      const articlesToCreate: any[] = [];

      items.each((i, el) => {
        const titleAr = $(el).find('title').text().trim();
        const link = $(el).find('link').text().trim();
        const descriptionHtml = $(el).find('description').text().trim();
        const pubDate = $(el).find('pubDate').text().trim();

        // Parse the inner HTML of the description
        const $$ = cheerio.load(descriptionHtml);
        let imageSrc = $$('img').first().attr('src');
        if (imageSrc && !imageSrc.startsWith('http')) {
          imageSrc = `https://moe.gov.jo${imageSrc.startsWith('/') ? '' : '/'}${imageSrc}`;
        }
        
        // Clean text for excerpt
        const rawText = $$('body').text().trim() || $$('*').text().trim();
        const excerptAr = rawText.substring(0, 150) + '...';

        // Base64 slug to ensure uniqueness without Arabic character routing issues
        // or just use a timestamp based slug if title is too complex
        const hash = Buffer.from(link).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        const slug = `moe-news-${hash}`;

        const contentAr = `
          <h2>${titleAr}</h2>
          ${descriptionHtml}
          <div style="margin-top: 30px; padding: 15px; background-color: rgba(255,255,255,0.05); border-radius: 8px; border-right: 4px solid #3b82f6;">
            <p style="margin: 0; font-size: 0.875rem; color: #94a3b8; font-style: italic;">
              المصدر الأصلي: <a href="${link}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: none;">وزارة التربية والتعليم الأردنية (MOE)</a>
              <br/>
              <span style="font-size: 0.75rem;">جميع الحقوق محفوظة للمصدر الأصلي. تم النشر لأغراض إخبارية وتعليمية.</span>
            </p>
          </div>
        `;

        articlesToCreate.push({
          slug,
          titleAr: titleAr,
          titleEn: 'MOE Jordan News Update', // Generic fallback
          contentAr: contentAr,
          contentEn: `<p>Please refer to the Arabic version for this official MOE update.</p>`,
          excerptAr: excerptAr,
          excerptEn: 'Official news update from the Ministry of Education.',
          keywords: 'وزارة التربية والتعليم, أخبار التوجيهي, MOE Jordan, تحديثات',
          coverImage: imageSrc || 'https://moe.gov.jo/sites/default/files/logo_1_2.png',
        });
      });

      for (const article of articlesToCreate) {
        const exists = await prisma.blogPost.findUnique({ where: { slug: article.slug } });
        if (!exists) {
          await prisma.blogPost.create({
            data: {
              slug: article.slug,
              titleAr: article.titleAr,
              titleEn: article.titleEn,
              contentAr: article.contentAr,
              contentEn: article.contentEn,
              excerptAr: article.excerptAr,
              excerptEn: article.excerptEn,
              keywords: article.keywords,
              coverImage: article.coverImage,
              authorId: admin.id,
              published: true,
            }
          });
          createdCount++;
        }
      }

    } catch (fetchError) {
      console.error("Failed to parse MOE RSS", fetchError);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Scraping and SEO generation complete. Created ${createdCount} new articles using the MOE parser.` 
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
