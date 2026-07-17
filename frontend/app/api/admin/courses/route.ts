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

    if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const coursesRaw = await prisma.course.findMany({
      include: {
        teacher: true,
        liveSessions: true,
        units: {
          include: {
            lessons: {
              include: {
                questions: {
                  include: {
                    choices: true
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map `teacher` properties into flat fields so admin/courses/page.tsx works out of the box
    const courses = coursesRaw.map(c => ({
      ...c,
      teacherNameAr: c.teacher?.nameAr || '',
      teacherNameEn: c.teacher?.nameEn || '',
    }));

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Fetch admin courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
