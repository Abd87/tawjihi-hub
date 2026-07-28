import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Get user from token if available
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || cookies().get('token')?.value;
    
    let userId = null;
    let userRole = 'STUDENT';

    if (token) {
      try {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret) as any;
        userId = decoded.userId;
        userRole = decoded.role;
      } catch (e) {
        console.error('Invalid token during courses fetch');
      }
    }

    // 2. Fetch all courses
    const coursesRaw = await prisma.course.findMany({
      include: { 
        teacher: true, 
        liveSessions: true,
        units: {
          include: {
            lessons: {
              select: {
                id: true,
                videoUrl: true,
                pdfUrl: true,
                isFreeTrial: true,
                _count: {
                  select: { questions: true }
                }
              }
            }
          }
        }
      },
    });

    // 3. Fetch user enrollments if student
    let enrolledCourseIds = new Set<string>();
    if (userId && userRole === 'STUDENT') {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: userId },
        select: { courseId: true }
      });
      enrollments.forEach(e => enrolledCourseIds.add(e.courseId));
    }

    // 4. Map and apply lock logic
    const courses = coursesRaw.map(c => {
      // Determine effective lock status
      let isLocked = c.locked;
      if (userRole === 'ADMIN' || userRole === 'TEACHER') {
        isLocked = false; // Admins and teachers bypass locks
      } else if (enrolledCourseIds.has(c.id)) {
        isLocked = false; // Enrolled students bypass locks
      }

      return {
        ...c,
        locked: isLocked, // Override DB lock with effective lock
        hasFreeTrial: c.units.some(u => u.lessons.some(l => l.isFreeTrial)),
        lessons: c.units.flatMap(u => u.lessons)
      };
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
