import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const studentId = decoded.userId;

    // Fetch quiz attempts for the student
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { studentId },
      orderBy: { createdAt: 'asc' },
      include: {
        quiz: {
          select: { titleAr: true, titleEn: true, course: { select: { titleAr: true, titleEn: true } } }
        }
      }
    });

    // We only need the percent, createdAt, and quiz title for charts
    const formattedAttempts = quizAttempts.map(attempt => ({
      id: attempt.id,
      scorePercent: attempt.percent,
      date: attempt.createdAt.toISOString(),
      quizTitleAr: attempt.quiz.titleAr,
      quizTitleEn: attempt.quiz.titleEn,
      courseTitleAr: attempt.quiz.course?.titleAr,
      courseTitleEn: attempt.quiz.course?.titleEn,
    }));

    return NextResponse.json({ quizAttempts: formattedAttempts });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
