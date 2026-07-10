import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;
    if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const coupons = await prisma.coupon.findMany({
      include: {
        course: { select: { titleAr: true, titleEn: true } },
        usedBy: { select: { nameAr: true, nameEn: true, email: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Fetch coupons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    const { courseId, code, expiresAt } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    let finalCode = code;
    if (!finalCode) {
      // Generate a random code if not provided
      finalCode = `HUB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: finalCode,
        courseId,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        course: { select: { titleAr: true, titleEn: true } },
      }
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
