import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const specificCourseId = searchParams.get('courseId');

    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const cookieStore = cookies();
    const token = headerToken || cookieStore.get('token')?.value;

    let studentId: string | null = null;
    let courseIds: string[] = [];

    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        studentId = decoded.userId;

        const enrollments = await prisma.enrollment.findMany({
          where: { userId: studentId },
          select: { courseId: true },
        });
        courseIds = enrollments.map((e) => e.courseId);
      } catch (e) {
        // Token invalid
      }
    }

    if (specificCourseId && !courseIds.includes(specificCourseId)) {
      courseIds.push(specificCourseId);
    }

    // Build flexible query matching general broadcasts or course-specific broadcasts
    const orConditions: any[] = [{ courseId: null }];

    if (courseIds.length > 0) {
      orConditions.push({ courseId: { in: courseIds } });
    }

    if (specificCourseId) {
      orConditions.push({ courseId: specificCourseId });
    }

    const broadcasts = await prisma.broadcast.findMany({
      where: {
        OR: orConditions,
      },
      include: {
        teacher: {
          select: { nameAr: true, nameEn: true },
        },
        course: {
          select: { id: true, titleAr: true, titleEn: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    return NextResponse.json({ broadcasts });
  } catch (error: any) {
    console.error('Fetch student broadcasts error:', error);
    return NextResponse.json({ broadcasts: [] });
  }
}
