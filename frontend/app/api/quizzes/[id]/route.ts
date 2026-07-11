import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const quizId = params.id;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            choices: {
              select: {
                id: true,
                textAr: true,
                textEn: true,
                // NEVER return isCorrect to the frontend!
              }
            }
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Strip sensitive fields from questions before sending to frontend
    const sanitizedQuiz = {
      ...quiz,
      questions: quiz.questions.map(q => ({
        id: q.id,
        textAr: q.textAr,
        textEn: q.textEn,
        type: q.type,
        choices: q.choices
        // We DO NOT send correctAnswer, explanationAr, explanationEn
      }))
    };

    return NextResponse.json({ quiz: sanitizedQuiz });
  } catch (error) {
    console.error('Fetch quiz error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
