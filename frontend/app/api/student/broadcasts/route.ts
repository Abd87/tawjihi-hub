import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ broadcasts: [] });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const studentId = decoded.userId;

    // Get all courses student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: studentId },
      include: {
        course: {
          select: { id: true, teacherId: true },
        },
      },
    });

    if (enrollments.length === 0) {
      return NextResponse.json({ broadcasts: [] });
    }

    const courseIds = enrollments.map((e) => e.courseId);
    const teacherIds = Array.from(new Set(enrollments.map((e) => e.course.teacherId)));

    // Fetch broadcasts matching enrolled courses or general teacher announcements
    const broadcasts = await prisma.broadcast.findMany({
      where: {
        OR: [
          { courseId: { in: courseIds } },
          { courseId: null, teacherId: { in: teacherIds } },
        ],
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
      take: 10,
    });

    return NextResponse.json({ broadcasts });
  } catch (error: any) {
    console.error('Fetch student broadcasts error:', error);
    return NextResponse.json({ broadcasts: [] });
  }
}
