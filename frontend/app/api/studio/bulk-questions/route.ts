import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { lessonId, questions } = await request.json();

    if (!lessonId || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
    }

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || (!user.isMasterAdmin && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    const transactions = questions.map(q => {
      return prisma.inlineQuestion.create({
        data: {
          lessonId,
          textAr: q.text,
          textEn: q.text,
          explanationAr: q.explanation || null,
          explanationEn: q.explanation || null,
          choices: {
            create: [
              { textAr: q.optionA, textEn: q.optionA, isCorrect: q.correctAnswer === 'A' },
              { textAr: q.optionB, textEn: q.optionB, isCorrect: q.correctAnswer === 'B' },
              { textAr: q.optionC, textEn: q.optionC, isCorrect: q.correctAnswer === 'C' },
              { textAr: q.optionD, textEn: q.optionD, isCorrect: q.correctAnswer === 'D' },
            ].filter(c => c.textAr) // Only create choices that have text
          }
        }
      });
    });

    await prisma.$transaction(transactions);

    return NextResponse.json({ success: true, count: questions.length });
  } catch (error) {
    console.error('Bulk questions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
