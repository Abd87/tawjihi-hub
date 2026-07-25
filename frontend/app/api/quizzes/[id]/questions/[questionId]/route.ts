import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;
    
    if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, questionId } = params;

    await prisma.quizQuestion.delete({
      where: { id: questionId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete quiz question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string; questionId: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;
    
    if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { questionId } = params;
    const body = await request.json();

    const updated = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        textAr: body.textAr,
        textEn: body.textEn,
        type: body.type,
        explanationAr: body.explanationAr,
        explanationEn: body.explanationEn
      }
    });

    if (body.choices && Array.isArray(body.choices)) {
      await prisma.quizChoice.deleteMany({
        where: { questionId }
      });
      await prisma.quizChoice.createMany({
        data: body.choices.map((c: any) => ({
          questionId,
          textAr: c.textAr || '',
          textEn: c.textEn || '',
          isCorrect: c.isCorrect || false
        }))
      });
    }

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Update quiz question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
