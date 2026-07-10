import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const courseId = params.id;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // 1. Get user from token if available
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || cookies().get('token')?.value;
    
    let userId = null;
    let userRole = 'STUDENT';

    if (token) {
      try {
        const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
        const decoded = jwt.verify(token, secret) as any;
        userId = decoded.userId;
        userRole = decoded.role;
      } catch (e) {
        console.error('Invalid token during course fetch');
      }
    }

    const courseRaw = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        teacher: true,
        liveSessions: true,
        exams: true,
        units: {
          include: {
            lessons: {
              include: {
                questions: {
                  include: {
                    choices: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!courseRaw) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // 2. Determine effective lock status
    let isLocked = courseRaw.locked;
    if (userRole === 'ADMIN' || userRole === 'TEACHER') {
      isLocked = false;
    } else if (userId && userRole === 'STUDENT') {
      const enrollment = await prisma.enrollment.findUnique({
        where: { studentId_courseId: { studentId: userId, courseId: courseId } }
      });
      if (enrollment) {
        isLocked = false;
      }
    }

    const course = {
      ...courseRaw,
      locked: isLocked, // Override DB lock with effective lock
      lessons: courseRaw.units.flatMap(u => u.lessons)
    };
    
    return NextResponse.json(course);
  } catch (error) {
    console.error('Fetch course error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
