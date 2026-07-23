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

    const currentUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!currentUser || (currentUser.role !== 'TEACHER' && currentUser.role !== 'ADMIN' && !currentUser.isMasterAdmin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const teacherId = currentUser.id;

    // Fetch broadcasts sent by this teacher
    const broadcasts = await prisma.broadcast.findMany({
      where: { teacherId },
      include: {
        course: {
          select: { id: true, titleAr: true, titleEn: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate recipient audience counts for each broadcast
    const enrichedBroadcasts = await Promise.all(
      broadcasts.map(async (b) => {
        let recipientCount = 0;
        if (b.courseId) {
          recipientCount = await prisma.enrollment.count({
            where: { courseId: b.courseId },
          });
        } else {
          // Get distinct students enrolled across all teacher's courses
          const teacherCourses = await prisma.course.findMany({
            where: { teacherId },
            select: { id: true },
          });
          const courseIds = teacherCourses.map((c) => c.id);
          const enrollments = await prisma.enrollment.groupBy({
            by: ['userId'],
            where: { courseId: { in: courseIds } },
          });
          recipientCount = enrollments.length;
        }

        return {
          ...b,
          recipientCount,
        };
      })
    );

    return NextResponse.json({ broadcasts: enrichedBroadcasts });
  } catch (error: any) {
    console.error('Fetch broadcasts error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const currentUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!currentUser || (currentUser.role !== 'TEACHER' && currentUser.role !== 'ADMIN' && !currentUser.isMasterAdmin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { titleAr, titleEn, contentAr, contentEn, courseId, priority = 'NORMAL' } = await request.json();

    if (!titleAr || !contentAr) {
      return NextResponse.json({ error: 'Title and content in Arabic are required' }, { status: 400 });
    }

    const broadcast = await prisma.broadcast.create({
      data: {
        teacherId: currentUser.id,
        courseId: courseId || null,
        titleAr,
        titleEn: titleEn || titleAr,
        contentAr,
        contentEn: contentEn || contentAr,
        priority: priority || 'NORMAL',
      },
      include: {
        course: {
          select: { titleAr: true, titleEn: true },
        },
      },
    });

    return NextResponse.json({ success: true, broadcast });
  } catch (error: any) {
    console.error('Create broadcast error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
