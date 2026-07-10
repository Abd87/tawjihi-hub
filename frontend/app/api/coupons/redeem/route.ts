import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { code, userId } = await request.json();

    if (!code || !userId) {
      return NextResponse.json({ error: 'Code and user ID are required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    }

    if (!coupon.isActive || coupon.usedById) {
      return NextResponse.json({ error: 'Coupon is inactive or already used' }, { status: 400 });
    }

    // Update coupon and create enrollment
    const result = await prisma.$transaction(async (tx) => {
      const updatedCoupon = await tx.coupon.update({
        where: { id: coupon.id },
        data: {
          usedById: userId,
          usedAt: new Date(),
          isActive: false,
        },
      });

      const enrollment = await tx.enrollment.create({
        data: {
          studentId: userId,
          courseId: coupon.courseId,
        },
      });

      return { updatedCoupon, enrollment };
    });

    return NextResponse.json({ success: true, courseId: coupon.courseId });
  } catch (error) {
    console.error('Redeem coupon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
