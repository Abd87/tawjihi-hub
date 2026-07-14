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

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || (!user.isMasterAdmin && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    // Map questions to Prisma format
    const dataToInsert = questions.map(q => ({
      lessonId,
      text: q.text,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || null,
    }));

    // Use Prisma createMany to insert all at once
    const result = await prisma.question.createMany({
      data: dataToInsert,
      skipDuplicates: true, // Prevents blowing up if unique constraints fail
    });

    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Bulk questions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
