import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// 1. Admin/Teacher: Create a new Quiz
export const createQuiz = async (req: AuthRequest, res: Response) => {
  const { titleAr, titleEn, descriptionAr, descriptionEn, cefrLevel, durationMinutes, courseId, lessonId } = req.body;

  try {
    if (!titleAr || !titleEn) {
      return res.status(400).json({ error: 'Quiz titles in Arabic and English are required' });
    }

    const quiz = await prisma.quiz.create({
      data: {
        titleAr,
        titleEn,
        descriptionAr: descriptionAr || null,
        descriptionEn: descriptionEn || null,
        cefrLevel: cefrLevel || null,
        durationMinutes: durationMinutes ? parseInt(durationMinutes) : null,
        courseId: courseId || null,
        lessonId: lessonId || null,
      }
    });

    return res.status(201).json({
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    return res.status(500).json({ error: 'Internal server error creating quiz' });
  }
};

// 2. Admin/Teacher: Add a Question to a Quiz
export const createQuestion = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // Quiz ID
  const { textAr, textEn, type, choices, correctAnswer, explanationAr, explanationEn } = req.body;

  try {
    if (!textAr || !textEn || !type) {
      return res.status(400).json({ error: 'Question text and type are required' });
    }

    // Validate MCQ choices
    if (type === 'MCQ') {
      if (!choices || !Array.isArray(choices) || choices.length < 2) {
        return res.status(400).json({ error: 'MCQ questions require at least two choice options' });
      }
      const hasCorrect = choices.some(c => c.isCorrect === true);
      if (!hasCorrect) {
        return res.status(400).json({ error: 'At least one choice option must be marked as correct (isCorrect: true)' });
      }
    }

    if (type === 'SHORT_ANSWER' && !correctAnswer) {
      return res.status(400).json({ error: 'Short answer questions require a correctAnswer string' });
    }

    // Insert Question
    const question = await prisma.question.create({
      data: {
        quizId: id,
        textAr,
        textEn,
        type,
        correctAnswer: type === 'SHORT_ANSWER' ? correctAnswer.trim() : null,
        explanationAr: explanationAr || null,
        explanationEn: explanationEn || null,
        // Nested relation for MCQ choices
        choices: type === 'MCQ' ? {
          create: choices.map((c: any) => ({
            textAr: c.textAr,
            textEn: c.textEn,
            isCorrect: c.isCorrect || false
          }))
        } : undefined
      },
      include: {
        choices: true
      }
    });

    return res.status(201).json({
      message: 'Question added to quiz successfully',
      question
    });
  } catch (error) {
    console.error('Create question error:', error);
    return res.status(500).json({ error: 'Internal server error adding question' });
  }
};

// 3. Student: Retrieve Quiz Details (questions and choices)
export const getQuizDetails = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            choices: {
              select: {
                id: true,
                textAr: true,
                textEn: true,
                // Omit isCorrect to prevent client-side cheating
              }
            }
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    return res.json({ quiz });
  } catch (error) {
    console.error('Fetch quiz error:', error);
    return res.status(500).json({ error: 'Internal server error fetching quiz details' });
  }
};

// 4. Student: Submit Quiz and get Graded immediately
export const submitQuiz = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized quiz submission' });
  }

  const { id } = req.params; // Quiz ID
  const { answers } = req.body; // Array of { questionId, selectedChoiceId, textAnswer }

  try {
    // Retrieve full quiz questions with correct answers to verify
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            choices: true
          }
        }
      }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    let score = 0;
    const maxScore = quiz.questions.length;
    const breakdown: any[] = [];

    // Loop through questions to grade
    for (const question of quiz.questions) {
      const studentAnswer = answers?.find((a: any) => a.questionId === question.id);
      let isCorrect = false;
      let userDisplayVal = '';
      let correctDisplayVal = '';

      if (question.type === 'MCQ') {
        const correctChoice = question.choices.find(c => c.isCorrect);
        const selectedChoice = question.choices.find(c => c.id === studentAnswer?.selectedChoiceId);

        isCorrect = selectedChoice?.isCorrect || false;
        userDisplayVal = selectedChoice ? selectedChoice.textAr : '';
        correctDisplayVal = correctChoice ? correctChoice.textAr : '';
      } else {
        // Short Answer comparison
        const cleanUserAnswer = (studentAnswer?.textAnswer || '').trim().toLowerCase();
        const cleanCorrectAnswer = (question.correctAnswer || '').trim().toLowerCase();
        
        isCorrect = cleanUserAnswer === cleanCorrectAnswer && cleanCorrectAnswer !== '';
        userDisplayVal = studentAnswer?.textAnswer || '';
        correctDisplayVal = question.correctAnswer || '';
      }

      if (isCorrect) {
        score++;
      }

      breakdown.push({
        questionId: question.id,
        textAr: question.textAr,
        textEn: question.textEn,
        type: question.type,
        isCorrect,
        userSelection: userDisplayVal,
        correctSelection: correctDisplayVal,
        explanationAr: question.explanationAr,
        explanationEn: question.explanationEn,
      });
    }

    // Save Attempt to Database
    const attempt = await prisma.quizAttempt.create({
      data: {
        studentId: req.user.id,
        quizId: id,
        score: parseFloat(score.toFixed(2)),
        maxScore: parseFloat(maxScore.toFixed(2))
      }
    });

    return res.status(200).json({
      message: 'Quiz evaluated successfully',
      score,
      maxScore,
      percent: parseFloat(((score / maxScore) * 100).toFixed(1)),
      attemptId: attempt.id,
      breakdown
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    return res.status(500).json({ error: 'Internal server error grading quiz' });
  }
};
