import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
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
        // Token expired or invalid, fall back to public/general announcements
      }
    }

    // Fetch broadcasts: either general broadcasts (courseId == null) OR targeted to student's enrolled courses
    const broadcasts = await prisma.broadcast.findMany({
      where: {
        OR: [
          { courseId: null },
          courseIds.length > 0 ? { courseId: { in: courseIds } } : undefined,
        ].filter(Boolean) as any,
      },
      include: {
        teacher: {
          select: { nameAr: true, nameEn: true },
        },
        course: {
          select: { titleAr: true, titleEn: true },
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
