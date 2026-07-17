import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || cookies().get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded: any;
    try {
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
      decoded = jwt.verify(token, secret);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Aggregate statistics
    const coursesCount = await prisma.course.count();
    const studentsCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    const totalCoupons = await prisma.coupon.count();
    const activeCoupons = await prisma.coupon.count({ where: { usedById: null } });

    // For average completion, we can use a mock value for now since progress is not deeply tracked yet in DB
    const averageCompletion = 76; 
    const averageQuizScore = 8.4; 

    // Fetch courses with their counts
    const courses = await prisma.course.findMany({
      include: {
        units: {
          include: {
            lessons: {
              include: {
                _count: {
                  select: { questions: true }
                }
              }
            }
          }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    });

    const coursesStats = courses.map(course => {
      const allLessons = course.units.flatMap(u => u.lessons);
      const lessonsCount = allLessons.length;
      const quizzesCount = allLessons.filter(l => l._count.questions > 0).length;

      return {
        id: course.id,
        titleAr: course.titleAr,
        titleEn: course.titleEn,
        lessonsCount,
        quizzesCount,
        enrolledCount: course._count.enrollments,
        averageCompletion: 82, // Placeholder
        averageQuizScore: 8.7, // Placeholder
      };
    });

    // Recent enrollments
    const recentEnrollments = await prisma.enrollment.findMany({
      orderBy: { enrolledAt: 'desc' },
      take: 5,
      include: {
        student: { select: { nameAr: true, email: true } },
        course: { select: { titleAr: true, titleEn: true } }
      }
    });

    const mappedEnrollments = recentEnrollments.map(e => ({
      id: e.id,
      enrolledAt: e.enrolledAt.toISOString(),
      student: { nameAr: e.student.nameAr, email: e.student.email },
      course: { titleAr: e.course.titleAr, titleEn: e.course.titleEn }
    }));

    return NextResponse.json({
      summary: {
        coursesCount,
        studentsCount,
        totalCoupons,
        activeCoupons,
        averageCompletion,
        averageQuizScore
      },
      courses: coursesStats,
      recentActivity: {
        attempts: [], // Placeholder since Quiz attempts model is not fully implemented
        comments: [], // Placeholder
        enrollments: mappedEnrollments
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
