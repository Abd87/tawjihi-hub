import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;
    if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { courseId, titleAr, titleEn, descriptionAr, descriptionEn, cefrLevel, durationMinutes } = await request.json();

    if (!courseId || (!titleAr && !titleEn)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        courseId,
        titleAr,
        titleEn,
        descriptionAr,
        descriptionEn,
        cefrLevel: cefrLevel || 'B2',
        durationMinutes: parseInt(durationMinutes) || 30
      }
    });

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error('Create quiz error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;
    if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const quizzes = await prisma.quiz.findMany({
      include: {
        course: { select: { titleAr: true, titleEn: true } },
        sections: {
          include: {
            questions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Map stats (total questions, etc)
    const formattedQuizzes = quizzes.map(q => {
      const totalQuestions = q.sections.reduce((acc, s) => acc + s.questions.length, 0);
      return {
        id: q.id,
        titleAr: q.titleAr,
        titleEn: q.titleEn,
        courseTitleAr: q.course.titleAr,
        courseTitleEn: q.course.titleEn,
        totalSections: q.sections.length,
        totalQuestions,
        createdAt: q.createdAt
      };
    });

    return NextResponse.json({ quizzes: formattedQuizzes });
  } catch (error) {
    console.error('Fetch quizzes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
