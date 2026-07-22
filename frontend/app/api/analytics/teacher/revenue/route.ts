import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const { searchParams } = new URL(request.url);
    const requestedTeacherId = searchParams.get('teacherId');

    const currentUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Determine target teacher ID
    let targetTeacherId = currentUser.id;
    if (requestedTeacherId && (currentUser.role === 'ADMIN' || currentUser.isMasterAdmin)) {
      targetTeacherId = requestedTeacherId;
    }

    const teacher = await prisma.user.findUnique({
      where: { id: targetTeacherId },
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        email: true,
        revenueSharePercent: true,
      },
    });

    if (!teacher) {
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
    }

    const revenueSharePercent = teacher.revenueSharePercent ?? 70.0;

    // Fetch courses for teacher
    const courses = await prisma.course.findMany({
      where: { teacherId: targetTeacherId },
      include: {
        coupons: {
          where: { isActive: true, usedById: { not: null } },
          include: {
            usedBy: {
              select: { id: true, nameAr: true, email: true },
            },
          },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    let totalGrossRevenue = 0;
    let totalCouponsRedeemed = 0;

    const courseBreakdown = courses.map((course) => {
      const redeemedCount = course.coupons.length;
      const coursePrice = course.price ?? 35.0;
      
      const gross = course.coupons.reduce((sum, coupon) => {
        return sum + (coupon.priceAtRedemption ?? coursePrice);
      }, 0);

      const teacherNet = gross * (revenueSharePercent / 100);

      totalGrossRevenue += gross;
      totalCouponsRedeemed += redeemedCount;

      return {
        id: course.id,
        titleAr: course.titleAr,
        titleEn: course.titleEn,
        track: course.track,
        price: coursePrice,
        enrolledStudents: course._count.enrollments,
        redeemedCoupons: redeemedCount,
        grossRevenue: gross,
        teacherNetPayout: teacherNet,
      };
    });

    const teacherNetPayout = totalGrossRevenue * (revenueSharePercent / 100);
    const platformKeep = totalGrossRevenue - teacherNetPayout;

    // Aggregate monthly redemption chart data
    const allCoupons = courses.flatMap((c) => c.coupons);
    const monthlyMap: Record<string, { month: string; gross: number; teacherNet: number; count: number }> = {};

    allCoupons.forEach((coupon) => {
      const date = coupon.usedAt ? new Date(coupon.usedAt) : new Date(coupon.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('ar-JO', { month: 'short', year: 'numeric' });
      const itemPrice = coupon.priceAtRedemption ?? (courses.find(c => c.id === coupon.courseId)?.price ?? 35.0);

      if (!monthlyMap[key]) {
        monthlyMap[key] = { month: monthLabel, gross: 0, teacherNet: 0, count: 0 };
      }

      monthlyMap[key].gross += itemPrice;
      monthlyMap[key].teacherNet += itemPrice * (revenueSharePercent / 100);
      monthlyMap[key].count += 1;
    });

    const monthlyChart = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

    return NextResponse.json({
      teacher,
      revenueSharePercent,
      stats: {
        totalGrossRevenue,
        teacherNetPayout,
        platformKeep,
        totalCouponsRedeemed,
        totalCourses: courses.length,
      },
      courseBreakdown,
      monthlyChart,
    });
  } catch (error: any) {
    console.error('Teacher revenue analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
