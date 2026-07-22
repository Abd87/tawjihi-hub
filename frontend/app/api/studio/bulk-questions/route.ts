import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { lessonId, quizId, questions } = await request.json();

    if ((!lessonId && !quizId) || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'quizId or lessonId and questions array are required.' }, { status: 400 });
    }

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN' && !user.isMasterAdmin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (quizId) {
      // Find or create default section for this Quiz
      let defaultSection = await prisma.quizSection.findFirst({
        where: { quizId },
      });

      if (!defaultSection) {
        defaultSection = await prisma.quizSection.create({
          data: {
            quizId,
            titleAr: 'قسم الأسئلة العام',
            titleEn: 'General Questions Section',
            order: 1,
          },
        });
      }

      const createdQuestions = [];

      for (const q of questions) {
        const textAr = q.textAr || q.text || 'سؤال';
        const textEn = q.textEn || q.text || textAr;
        const explanationAr = q.explanationAr || q.explanation || null;
        const explanationEn = q.explanationEn || q.explanation || null;

        let choicesData = [];
        if (q.choices && Array.isArray(q.choices)) {
          choicesData = q.choices.map((c: any) => ({
            textAr: c.textAr || 'خيار',
            textEn: c.textEn || c.textAr || 'Option',
            isCorrect: Boolean(c.isCorrect),
          }));
        } else {
          choicesData = [
            { textAr: q.optionA, textEn: q.optionA, isCorrect: q.correctAnswer === 'A' },
            { textAr: q.optionB, textEn: q.optionB, isCorrect: q.correctAnswer === 'B' },
            { textAr: q.optionC, textEn: q.optionC, isCorrect: q.correctAnswer === 'C' },
            { textAr: q.optionD, textEn: q.optionD, isCorrect: q.correctAnswer === 'D' },
          ].filter((c) => c.textAr);
        }

        const newQ = await prisma.quizQuestion.create({
          data: {
            sectionId: defaultSection.id,
            textAr,
            textEn,
            type: q.type || 'MCQ',
            explanationAr,
            explanationEn,
            choices: {
              create: choicesData,
            },
          },
        });

        createdQuestions.push(newQ);
      }

      return NextResponse.json({ success: true, count: createdQuestions.length });
    }

    if (lessonId) {
      const transactions = questions.map((q) => {
        return prisma.inlineQuestion.create({
          data: {
            lessonId,
            textAr: q.textAr || q.text,
            textEn: q.textEn || q.text,
            explanationAr: q.explanationAr || q.explanation || null,
            explanationEn: q.explanationEn || q.explanation || null,
            choices: {
              create: (q.choices || [
                { textAr: q.optionA, textEn: q.optionA, isCorrect: q.correctAnswer === 'A' },
                { textAr: q.optionB, textEn: q.optionB, isCorrect: q.correctAnswer === 'B' },
                { textAr: q.optionC, textEn: q.optionC, isCorrect: q.correctAnswer === 'C' },
                { textAr: q.optionD, textEn: q.optionD, isCorrect: q.correctAnswer === 'D' },
              ]).map((c: any) => ({
                textAr: c.textAr || c.text,
                textEn: c.textEn || c.textAr || c.text,
                isCorrect: Boolean(c.isCorrect),
              })),
            },
          },
        });
      });

      await prisma.$transaction(transactions);
      return NextResponse.json({ success: true, count: questions.length });
    }

    return NextResponse.json({ error: 'No quizId or lessonId provided' }, { status: 400 });
  } catch (error: any) {
    console.error('Bulk questions error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
