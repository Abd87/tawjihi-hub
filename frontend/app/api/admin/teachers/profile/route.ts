import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const profiles = await prisma.teacherProfile.findMany({
      include: {
        user: {
          select: { nameAr: true, nameEn: true, email: true }
        }
      }
    });
    return NextResponse.json({ profiles });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    if (decoded.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { userId, roleTitleAr, roleTitleEn, bioAr, bioEn, imageUrl, imageBgColor, studentsCountAr, studentsCountEn, experienceAr, experienceEn } = body;

    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    const profile = await prisma.teacherProfile.upsert({
      where: { userId },
      update: {
        roleTitleAr, roleTitleEn, bioAr, bioEn, imageUrl, imageBgColor,
        studentsCountAr, studentsCountEn, experienceAr, experienceEn
      },
      create: {
        userId, roleTitleAr, roleTitleEn, bioAr, bioEn, imageUrl, imageBgColor,
        studentsCountAr, studentsCountEn, experienceAr, experienceEn
      }
    });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
