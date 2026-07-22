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

    // 1. Fetch wrong quiz answers submitted by students
    const wrongAnswers = await prisma.quizAnswer.findMany({
      where: {
        isCorrect: false,
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
        attempt: {
          include: {
            student: {
              select: { id: true, nameAr: true, nameEn: true, email: true },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
      take: 100,
    });

    // 2. Fetch recorded mistakes table
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
          select: { id: true, nameAr: true, nameEn: true, email: true },
        },
      },
      orderBy: { mistakeCount: 'desc' },
      take: 50,
    });

    // 3. Build comprehensive question map
    const questionMap: Record<string, any> = {};

    // Process wrong quiz answers
    wrongAnswers.forEach((ans) => {
      const q = ans.question;
      const qId = q.id;

      if (!questionMap[qId]) {
        questionMap[qId] = {
          questionId: qId,
          textAr: q.textAr,
          textEn: q.textEn,
          type: q.type || 'MCQ',
          explanationAr: q.explanationAr,
          explanationEn: q.explanationEn,
          correctAnswer: q.correctAnswer,
          courseTitleAr: q.section.quiz.course.titleAr,
          courseTitleEn: q.section.quiz.course.titleEn,
          quizTitleAr: q.section.quiz.titleAr,
          quizTitleEn: q.section.quiz.titleEn,
          totalMistakes: 0,
          affectedStudentsMap: new Set<string>(),
          choiceSelectionCounts: {} as Record<string, number>,
          wrongTextAnswers: [] as string[],
          choices: q.choices,
        };
      }

      questionMap[qId].totalMistakes += 1;
      if (ans.attempt?.student?.id) {
        questionMap[qId].affectedStudentsMap.add(ans.attempt.student.id);
      }

      if (ans.selectedChoiceId) {
        questionMap[qId].choiceSelectionCounts[ans.selectedChoiceId] =
          (questionMap[qId].choiceSelectionCounts[ans.selectedChoiceId] || 0) + 1;
      }

      if (ans.textAnswer && !questionMap[qId].wrongTextAnswers.includes(ans.textAnswer)) {
        questionMap[qId].wrongTextAnswers.push(ans.textAnswer);
      }
    });

    // Process mistakes table
    mistakes.forEach((m) => {
      const q = m.question;
      const qId = q.id;

      if (!questionMap[qId]) {
        questionMap[qId] = {
          questionId: qId,
          textAr: q.textAr,
          textEn: q.textEn,
          type: q.type || 'MCQ',
          explanationAr: q.explanationAr,
          explanationEn: q.explanationEn,
          correctAnswer: q.correctAnswer,
          courseTitleAr: q.section.quiz.course.titleAr,
          courseTitleEn: q.section.quiz.course.titleEn,
          quizTitleAr: q.section.quiz.titleAr,
          quizTitleEn: q.section.quiz.titleEn,
          totalMistakes: 0,
          affectedStudentsMap: new Set<string>(),
          choiceSelectionCounts: {} as Record<string, number>,
          wrongTextAnswers: [] as string[],
          choices: q.choices,
        };
      }

      questionMap[qId].totalMistakes += m.mistakeCount;
      if (m.userId) {
        questionMap[qId].affectedStudentsMap.add(m.userId);
      }
    });

    // Format output
    const bottlenecks = Object.values(questionMap)
      .map((q) => {
        const choicesFormatted = q.choices.map((c: any) => ({
          ...c,
          timesSelectedByMistake: q.choiceSelectionCounts[c.id] || 0,
        }));

        return {
          questionId: q.questionId,
          textAr: q.textAr,
          textEn: q.textEn,
          type: q.type,
          explanationAr: q.explanationAr,
          explanationEn: q.explanationEn,
          correctAnswer: q.correctAnswer,
          courseTitleAr: q.courseTitleAr,
          courseTitleEn: q.courseTitleEn,
          quizTitleAr: q.quizTitleAr,
          quizTitleEn: q.quizTitleEn,
          totalMistakes: q.totalMistakes,
          affectedStudentsCount: q.affectedStudentsMap.size || 1,
          choices: choicesFormatted,
          wrongTextAnswers: q.wrongTextAnswers.slice(0, 5),
        };
      })
      .sort((a, b) => b.totalMistakes - a.totalMistakes);

    const totalMistakesCount = bottlenecks.reduce((sum, b) => sum + b.totalMistakes, 0);

    return NextResponse.json({
      bottlenecks,
      totalMistakesRecorded: totalMistakesCount,
    });
  } catch (error: any) {
    console.error('Teacher bottleneck analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
