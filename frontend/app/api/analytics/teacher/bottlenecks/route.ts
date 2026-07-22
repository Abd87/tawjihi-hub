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
    if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const teacherId = currentUser.id;

    // Fetch all courses for this teacher
    const courses = await prisma.course.findMany({
      where: { teacherId },
      select: { id: true, titleAr: true, titleEn: true },
    });

    const courseIds = courses.map((c) => c.id);

    if (courseIds.length === 0) {
      return NextResponse.json({ bottlenecks: [], totalMistakesRecorded: 0 });
    }

    // Query mistakes recorded for questions belonging to this teacher's courses
    const mistakes = await prisma.mistake.findMany({
      where: {
        question: {
          section: {
            quiz: {
              courseId: { in: courseIds },
            },
          },
        },
      },
      include: {
        question: {
          include: {
            section: {
              include: {
                quiz: {
                  include: {
                    course: {
                      select: { titleAr: true, titleEn: true },
                    },
                  },
                },
              },
            },
            choices: true,
          },
        },
        user: {
          select: { nameAr: true, nameEn: true, email: true },
        },
      },
      orderBy: { mistakeCount: 'desc' },
      take: 20,
    });

    // Group mistakes by question ID to calculate total failure frequency across all students
    const questionMap: Record<string, any> = {};

    mistakes.forEach((m) => {
      const qId = m.questionId;
      if (!questionMap[qId]) {
        questionMap[qId] = {
          questionId: qId,
          textAr: m.question.textAr,
          textEn: m.question.textEn,
          courseTitleAr: m.question.section.quiz.course.titleAr,
          courseTitleEn: m.question.section.quiz.course.titleEn,
          quizTitleAr: m.question.section.quiz.titleAr,
          quizTitleEn: m.question.section.quiz.titleEn,
          totalMistakes: 0,
          affectedStudentsCount: 0,
          choices: m.question.choices,
        };
      }
      questionMap[qId].totalMistakes += m.mistakeCount;
      questionMap[qId].affectedStudentsCount += 1;
    });

    const bottlenecks = Object.values(questionMap).sort((a, b) => b.totalMistakes - a.totalMistakes);

    return NextResponse.json({
      bottlenecks,
      totalMistakesRecorded: mistakes.length,
    });
  } catch (error: any) {
    console.error('Teacher bottleneck analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
