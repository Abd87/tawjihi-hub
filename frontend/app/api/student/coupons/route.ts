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

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;
    const userId = decoded.userId;

    const coupons = await prisma.coupon.findMany({
      where: { usedById: userId },
      include: {
        course: { select: { titleAr: true, titleEn: true } },
      },
      orderBy: { usedAt: 'desc' }
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error('Fetch student coupons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
