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
    const { titleAr, titleEn, passageAr, passageEn, order } = body;

    if (!titleAr || !titleEn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const section = await prisma.quizSection.create({
      data: {
        quizId,
        titleAr,
        titleEn,
        passageAr: passageAr || null,
        passageEn: passageEn || null,
        order: order || 0
      }
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (error) {
    console.error('Create quiz section error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
