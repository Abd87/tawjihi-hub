import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const DEFAULT_PROMO_SETTINGS = {
  enabled: true,
  originalPrice: 20,
  discountPrice: 10,
  titleAr: "عرض خاص!",
  titleEn: "Special Offer!",
  descriptionAr: "خصم لمادة اللغة الانجليزية نظام BTEC للفصل الواحد. هذا الخصم ساري لمدة شهر واحد فقط بـ 10 دنانير بدلاً من 20 دينار.",
  descriptionEn: "Discount for the English Language subject (BTEC system) for one semester. This offer is valid for one month only, at 10 JOD instead of 20 JOD."
};

export async function GET(request: Request) {
  try {
    let setting = await prisma.setting.findUnique({
      where: { key: 'promo_offer' }
    });

    if (!setting) {
      setting = await prisma.setting.create({
        data: {
          id: 'promo_offer',
          key: 'promo_offer',
          value: JSON.stringify(DEFAULT_PROMO_SETTINGS)
        }
      });
    }

    return NextResponse.json(JSON.parse(setting.value));
  } catch (error) {
    console.error('Error fetching promo settings:', error);
    return NextResponse.json(DEFAULT_PROMO_SETTINGS); // Fallback so UI doesn't break
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;

    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const settingValue = JSON.stringify({
      enabled: Boolean(body.enabled),
      originalPrice: Number(body.originalPrice) || 20,
      discountPrice: Number(body.discountPrice) || 10,
      titleAr: String(body.titleAr || ''),
      titleEn: String(body.titleEn || ''),
      descriptionAr: String(body.descriptionAr || ''),
      descriptionEn: String(body.descriptionEn || '')
    });

    const setting = await prisma.setting.upsert({
      where: { key: 'promo_offer' },
      update: { value: settingValue },
      create: {
        id: 'promo_offer',
        key: 'promo_offer',
        value: settingValue
      }
    });

    return NextResponse.json(JSON.parse(setting.value));
  } catch (error) {
    console.error('Error updating promo settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
