import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;
    const userId = decoded.userId;

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
      include: { course: { select: { id: true, titleAr: true, titleEn: true } } }
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    }

    if (!coupon.isActive || coupon.usedById) {
      // If the same user re-redeems their own active coupon (idempotent)
      if (coupon.usedById === userId) {
        return NextResponse.json({ 
          success: true, 
          courseId: coupon.courseId, 
          course: coupon.course,
          expiresAt: coupon.expiresAt 
        });
      }
      return NextResponse.json({ error: 'Coupon is inactive or already used' }, { status: 400 });
    }

    // Update coupon and create enrollment
    const result = await prisma.$transaction(async (tx: any) => {
      const updatedCoupon = await tx.coupon.update({
        where: { id: coupon.id },
        data: {
          usedById: userId,
          usedAt: new Date(),
          isActive: false,
        },
      });

      // Avoid unique constraint violation if enrollment already exists
      const existing = await tx.enrollment.findUnique({
        where: { studentId_courseId: { studentId: userId, courseId: coupon.courseId } }
      });

      let enrollment = existing;
      if (!existing) {
        enrollment = await tx.enrollment.create({
          data: {
            studentId: userId,
            courseId: coupon.courseId,
          },
        });
      }

      return { updatedCoupon, enrollment };
    });

    return NextResponse.json({ 
      success: true, 
      courseId: coupon.courseId, 
      course: coupon.course,
      expiresAt: coupon.expiresAt 
    });
  } catch (error) {
    console.error('Redeem coupon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
