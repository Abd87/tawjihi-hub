'use server';

import prisma from '@/lib/prisma';

export async function getGrade11Exams() {
  try {
    const exams = await prisma.grade11Exam.findMany({
      orderBy: { unitNumber: 'asc' },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });
    
    // Map it to the old format for seamless frontend integration
    return exams.map((exam) => ({
      id: exam.id,
      unitNumber: exam.unitNumber,
      titleAr: exam.titleAr,
      titleEn: exam.titleEn,
      descriptionAr: exam.descriptionAr,
      descriptionEn: exam.descriptionEn,
      durationMinutes: exam.durationMinutes,
      questionsCount: exam._count.questions
    }));
  } catch (error) {
    console.error('Error fetching Grade 11 exams:', error);
    return [];
  }
}

export async function getGrade11ExamById(examId: string) {
  try {
    const exam = await prisma.grade11Exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { createdAt: 'asc' } // Keep order deterministic, though we didn't add an order field
        }
      }
    });
    
    if (!exam) return null;
    return exam;
  } catch (error) {
    console.error('Error fetching Grade 11 exam by id:', error);
    return null;
  }
}

export async function getGrade11ExamByUnit(unitNumber: number) {
  try {
    const exam = await prisma.grade11Exam.findUnique({
      where: { unitNumber },
      include: {
        questions: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });
    
    if (!exam) return null;
    return exam;
  } catch (error) {
    console.error('Error fetching Grade 11 exam by unit:', error);
    return null;
  }
}
