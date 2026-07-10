import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// Retrieve detailed view for a single lesson
export const getLessonDetails = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized lesson fetch' });
  }

  const { id } = req.params;
  const { role, trackType } = req.user;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            subject: {
              include: {
                track: true,
              }
            }
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // Authorization: Block students from accessing other tracks' lessons
    if (role === 'STUDENT' && lesson.course.subject.track.key !== trackType) {
      return res.status(403).json({ error: 'Access denied: Lesson track mismatch' });
    }

    return res.json({ lesson });
  } catch (error) {
    console.error('Fetch lesson details error:', error);
    return res.status(500).json({ error: 'Internal server error fetching lesson details' });
  }
};
