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
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const token = headerToken || cookieStore.get('token')?.value;
    
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    
    let studentId;
    try {
      const decoded = jwt.verify(token, secret) as any;
      studentId = decoded.userId || decoded.id; // Support both just in case
    } catch (e) {
      console.error('JWT verify error:', e);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

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
    const mistakesToLog: string[] = [];

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

      if (isCorrect) {
        score += 1;
      } else {
        mistakesToLog.push(q.id);
      }

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

    // Save mistakes to Mistake Bank
    for (const qId of mistakesToLog) {
      await prisma.mistake.upsert({
        where: {
          userId_questionId: {
            userId: studentId,
            questionId: qId
          }
        },
        create: {
          userId: studentId,
          questionId: qId,
          mistakeCount: 1
        },
        update: {
          mistakeCount: { increment: 1 },
          lastAttemptDate: new Date()
        }
      });
    }

    return NextResponse.json({ 
      result: {
        score,
        maxScore,
        percent,
        breakdown
      }
    });
  } catch (error: any) {
    console.error('Submit quiz error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error', stack: error.stack, errorString: String(error) }, { status: 500 });
  }
}
