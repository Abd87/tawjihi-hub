import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// Toggle completion status for a lesson and recalculate course progress
export const toggleLessonProgress = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized progress update' });
  }

  const { id } = req.params; // Lesson ID
  const { completed } = req.body; // boolean

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      select: { courseId: true }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Update or Insert progress
    await prisma.lessonProgress.upsert({
      where: {
        studentId_lessonId: {
          studentId: req.user.id,
          lessonId: id
        }
      },
      update: {
        completed: completed === true
      },
      create: {
        studentId: req.user.id,
        lessonId: id,
        completed: completed === true
      }
    });

    // Recalculate total course progress percentage
    const courseLessons = await prisma.lesson.findMany({
      where: { courseId: lesson.courseId },
      select: { id: true }
    });

    const totalLessons = courseLessons.length;
    const lessonIds = courseLessons.map(l => l.id);

    const completedCount = await prisma.lessonProgress.count({
      where: {
        studentId: req.user.id,
        lessonId: { in: lessonIds },
        completed: true
      }
    });

    const progressPercent = totalLessons > 0 
      ? Math.round((completedCount / totalLessons) * 100) 
      : 0;

    return res.json({
      message: 'Progress updated successfully',
      lessonId: id,
      completed: completed === true,
      progressPercent
    });

  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({ error: 'Internal server error updating progress' });
  }
};

// Retrieve student progress for a specific course
export const getCourseProgress = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized progress fetch' });
  }

  const { courseId } = req.params;

  try {
    const courseLessons = await prisma.lesson.findMany({
      where: { courseId },
      select: { id: true, order: true }
    });

    const lessonIds = courseLessons.map(l => l.id);

    const progresses = await prisma.lessonProgress.findMany({
      where: {
        studentId: req.user.id,
        lessonId: { in: lessonIds }
      },
      select: {
        lessonId: true,
        completed: true
      }
    });

    return res.json({ progresses });
  } catch (error) {
    console.error('Fetch progress error:', error);
    return res.status(500).json({ error: 'Internal server error fetching progress' });
  }
};
