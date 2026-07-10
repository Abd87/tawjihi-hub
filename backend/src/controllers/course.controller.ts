import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// Retrieve courses filtered by the student's track selection
export const getCourses = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized course fetch' });
  }

  const { role, trackType } = req.user;
  const queryTrack = req.query.track as string;

  try {
    let filterTrack: any = null;

    if (role === 'STUDENT') {
      // Students can ONLY view courses in their designated track
      if (!trackType) {
        return res.status(400).json({ error: 'Student profile has no assigned track type' });
      }
      filterTrack = trackType;
    } else {
      // Admins/Teachers can filter optionally via query, or view all
      if (queryTrack && ['ACADEMIC', 'BTEC'].includes(queryTrack)) {
        filterTrack = queryTrack;
      }
    }

    const courses = await prisma.course.findMany({
      where: filterTrack ? {
        subject: {
          track: {
            key: filterTrack
          }
        }
      } : {},
      include: {
        subject: {
          select: {
            id: true,
            key: true,
            nameAr: true,
            nameEn: true,
          }
        },
        teacher: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            email: true,
          }
        },
        _count: {
          select: {
            lessons: true,
            quizzes: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    return res.json({
      track: filterTrack || 'ALL',
      courses,
    });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return res.status(500).json({ error: 'Internal server error fetching courses' });
  }
};

// Retrieve detailed course view containing lessons and attached quizzes
export const getCourseDetails = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized course fetch' });
  }

  const { id } = req.params;
  const { role, trackType } = req.user;

  try {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        subject: {
          include: {
            track: true,
          }
        },
        teacher: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            email: true,
          }
        },
        lessons: {
          orderBy: {
            order: 'asc'
          },
          include: {
            quizzes: {
              select: {
                id: true,
                titleAr: true,
                titleEn: true,
                cefrLevel: true,
              }
            }
          }
        },
        quizzes: {
          where: {
            lessonId: null // Course-level final quizzes
          },
          select: {
            id: true,
            titleAr: true,
            titleEn: true,
            cefrLevel: true,
            durationMinutes: true,
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Authorization: Block students from accessing other tracks' courses
    if (role === 'STUDENT' && course.subject.track.key !== trackType) {
      return res.status(403).json({ error: 'Access denied: Course track mismatch' });
    }

    let enrolled = false;
    if (role === 'STUDENT') {
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId: req.user.id,
            courseId: id
          }
        }
      });
      enrolled = !!enrollment;
    } else {
      enrolled = true;
    }

    return res.json({ course, enrolled });
  } catch (error) {
    console.error('Fetch course details error:', error);
    return res.status(500).json({ error: 'Internal server error fetching course details' });
  }
};
