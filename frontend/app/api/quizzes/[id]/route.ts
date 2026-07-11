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
        sections: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              include: {
                choices: {
                  select: {
                    id: true,
                    textAr: true,
                    textEn: true,
                  }
                }
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
      sections: quiz.sections.map(section => ({
        ...section,
        questions: section.questions.map(q => ({
          id: q.id,
          textAr: q.textAr,
          textEn: q.textEn,
          type: q.type,
          choices: q.choices
        }))
      }))
    };

    return NextResponse.json({ quiz: sanitizedQuiz });
  } catch (error) {
    console.error('Fetch quiz error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;
    if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const quizId = params.id;

    await prisma.quiz.delete({
      where: { id: quizId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete quiz error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
