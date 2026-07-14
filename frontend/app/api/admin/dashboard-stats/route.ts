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
    if (decoded.role !== 'ADMIN' && !decoded.isMasterAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Real Stats
    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalCourses = await prisma.course.count();
    const activeCoupons = await prisma.coupon.count({ where: { isActive: true } });

    // Recent Activities (Mix of new users and new teacher applications)
    const recentApplications = await prisma.teacherApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const recentUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });

    const activities = [];

    // Format recent applications
    for (const app of recentApplications) {
      activities.push({
        textAr: `طلب انضمام جديد من المعلم: ${app.fullName}`,
        textEn: `New teacher application from: ${app.fullName}`,
        time: app.createdAt.toISOString(),
        color: 'bg-emerald-500/20 text-emerald-400',
        type: 'application'
      });
    }

    // Format recent students
    for (const user of recentUsers) {
      activities.push({
        textAr: `طالب جديد انضم للمنصة: ${user.nameAr}`,
        textEn: `New student joined: ${user.nameEn || user.nameAr}`,
        time: user.createdAt.toISOString(),
        color: 'bg-brand-500/20 text-brand-400',
        type: 'student'
      });
    }

    // Sort combined activities by date descending
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Format the time client-side nicely or use a simple string, but here we can just return ISO and parse it client side
    return NextResponse.json({
      stats: {
        totalStudents,
        totalCourses,
        activeCoupons
      },
      recentActivities: activities.slice(0, 5) // top 5
    });

  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
