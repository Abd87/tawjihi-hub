import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(
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
    const body = await request.json();
    const { textAr, textEn, type, correctAnswer, explanationAr, explanationEn, choices } = body;

    const question = await prisma.quizQuestion.create({
      data: {
        quizId,
        textAr,
        textEn,
        type,
        correctAnswer: type === 'SHORT_ANSWER' ? correctAnswer : null,
        explanationAr,
        explanationEn,
        choices: type === 'MCQ' && choices ? {
          create: choices.map((c: any) => ({
            textAr: c.textAr,
            textEn: c.textEn,
            isCorrect: c.isCorrect
          }))
        } : undefined
      },
      include: {
        choices: true
      }
    });

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Add quiz question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
