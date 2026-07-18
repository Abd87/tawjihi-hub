'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createManualBlogPost(formData: FormData) {
  try {
    const titleAr = formData.get('titleAr') as string;
    const titleEn = formData.get('titleEn') as string;
    const contentAr = formData.get('contentAr') as string;
    const contentEn = formData.get('contentEn') as string;
    const excerptAr = formData.get('excerptAr') as string;
    const excerptEn = formData.get('excerptEn') as string;
    const keywords = formData.get('keywords') as string;
    const slug = formData.get('slug') as string || `manual-post-${Date.now()}`;
    
    // In real app, we'd get the actual admin's ID
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!admin) {
      return { success: false, error: 'No admin user found' };
    }

    await prisma.blogPost.create({
      data: {
        slug,
        titleAr,
        titleEn: titleEn || titleAr,
        contentAr,
        contentEn: contentEn || contentAr,
        excerptAr,
        excerptEn: excerptEn || excerptAr,
        keywords,
        authorId: admin.id,
        published: true,
      }
    });

    revalidatePath('/ar/admin/blog');
    revalidatePath('/en/admin/blog');
    revalidatePath('/ar/blog');
    revalidatePath('/en/blog');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message };
  }
}
