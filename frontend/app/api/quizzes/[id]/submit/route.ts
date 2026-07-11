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
    const studentId = decoded.id;

    const quizId = params.id;
    const body = await request.json();
    const { answers } = body; // Array of { questionId, selectedChoiceId, textAnswer }

    // Fetch full quiz with answers from DB for grading
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        sections: {
          include: {
            questions: {
              include: {
                choices: true
              }
            }
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const allQuestions = quiz.sections.flatMap(s => s.questions);

    let score = 0;
    const maxScore = allQuestions.length;
    const breakdown = [];
    const answerRecords = [];

    for (const q of allQuestions) {
      const studentAns = answers.find((a: any) => a.questionId === q.id);
      let isCorrect = false;
      let userSelection = '';
      let correctSelection = '';

      if (q.type === 'MCQ') {
        const correctChoice = q.choices.find(c => c.isCorrect);
        correctSelection = correctChoice ? (correctChoice.textEn || correctChoice.textAr) : '';
        
        if (studentAns?.selectedChoiceId) {
          const selectedChoice = q.choices.find(c => c.id === studentAns.selectedChoiceId);
          userSelection = selectedChoice ? (selectedChoice.textEn || selectedChoice.textAr) : '';
          
          if (studentAns.selectedChoiceId === correctChoice?.id) {
            isCorrect = true;
          }
        }
      } else if (q.type === 'SHORT_ANSWER') {
        correctSelection = q.correctAnswer || '';
        userSelection = studentAns?.textAnswer || '';
        
        if (userSelection.trim().toLowerCase() === correctSelection.trim().toLowerCase()) {
          isCorrect = true;
        }
      }

      if (isCorrect) score += 1;

      breakdown.push({
        questionId: q.id,
        textAr: q.textAr,
        textEn: q.textEn,
        type: q.type,
        isCorrect,
        userSelection,
        correctSelection,
        explanationAr: q.explanationAr,
        explanationEn: q.explanationEn
      });

      answerRecords.push({
        questionId: q.id,
        selectedChoiceId: studentAns?.selectedChoiceId || null,
        textAnswer: studentAns?.textAnswer || null,
        isCorrect
      });
    }

    const percent = maxScore > 0 ? (score / maxScore) * 100 : 0;

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId,
        studentId,
        score,
        maxScore,
        percent,
        answers: {
          create: answerRecords
        }
      }
    });

    return NextResponse.json({ 
      result: {
        score,
        maxScore,
        percent,
        breakdown
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
