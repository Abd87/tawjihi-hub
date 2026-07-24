'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateGrade11Question(questionId: string, data: {
  question: string;
  choices: string[];
  correctAnswerIndex: number;
}) {
  try {
    const updated = await prisma.grade11Question.update({
      where: { id: questionId },
      data: {
        question: data.question,
        choices: data.choices,
        correctAnswerIndex: data.correctAnswerIndex
      }
    });
    revalidatePath('/admin/grade11-exams');
    revalidatePath('/grade11-exams');
    return { success: true, question: updated };
  } catch (error: any) {
    console.error('Error updating question:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteGrade11Question(questionId: string) {
  try {
    await prisma.grade11Question.delete({
      where: { id: questionId }
    });
    revalidatePath('/admin/grade11-exams');
    revalidatePath('/grade11-exams');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting question:', error);
    return { success: false, error: error.message };
  }
}
