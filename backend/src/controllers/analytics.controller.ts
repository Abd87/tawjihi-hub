import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// Get analytics dashboard overview for Admin/Teacher
export const getTeacherAnalytics = async (req: AuthRequest, res: Response) => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER')) {
    return res.status(403).json({ error: 'Access denied: requires Teacher or Admin role' });
  }

  try {
    const isTeacher = req.user.role === 'TEACHER';

    // 1. Fetch courses owned by the user (if teacher) or all courses (if admin)
    const courses = await prisma.course.findMany({
      where: isTeacher ? { teacherId: req.user.id } : {},
      select: {
        id: true,
        titleAr: true,
        titleEn: true,
        lessons: { select: { id: true } },
        quizzes: { select: { id: true } }
      }
    });

    const courseIds = courses.map(c => c.id);

    // 2. Total student enrollments (unique students enrolled in these courses)
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      select: { studentId: true, courseId: true }
    });
    
    const uniqueStudentIds = Array.from(new Set(enrollments.map(e => e.studentId)));
    const totalStudentsEnrolled = uniqueStudentIds.length;

    // 3. Coupon redemption counts
    const totalCouponsCount = await prisma.coupon.count({
      where: { courseId: { in: courseIds } }
    });

    const activeCouponsCount = await prisma.coupon.count({
      where: { courseId: { in: courseIds }, isActive: true }
    });

    // 4. Calculate stats per course
    const coursesStats = [];
    let totalScoreSum = 0;
    let totalAttemptsCount = 0;
    let overallCompletionsSum = 0;

    for (const course of courses) {
      const courseLessons = course.lessons.map(l => l.id);
      const courseQuizzes = course.quizzes.map(q => q.id);
      const studentCount = enrollments.filter(e => e.courseId === course.id).length;

      // Average completion rate
      let avgCompletionRate = 0;
      if (studentCount > 0 && courseLessons.length > 0) {
        const completedLessonsCount = await prisma.lessonProgress.count({
          where: {
            lessonId: { in: courseLessons },
            completed: true
          }
        });
        const maxPossibleCompletions = studentCount * courseLessons.length;
        avgCompletionRate = Math.round((completedLessonsCount / maxPossibleCompletions) * 100);
      }
      overallCompletionsSum += avgCompletionRate;

      // Average quiz score
      let avgScore = 0;
      if (courseQuizzes.length > 0) {
        const attempts = await prisma.quizAttempt.aggregate({
          where: { quizId: { in: courseQuizzes } },
          _avg: { score: true },
          _count: { score: true }
        });
        avgScore = attempts._avg.score ? Math.round(attempts._avg.score * 10) / 10 : 0;
        
        if (attempts._avg.score) {
          totalScoreSum += attempts._avg.score;
          totalAttemptsCount++;
        }
      }

      coursesStats.push({
        id: course.id,
        titleAr: course.titleAr,
        titleEn: course.titleEn,
        lessonsCount: course.lessons.length,
        quizzesCount: course.quizzes.length,
        enrolledCount: studentCount,
        averageCompletion: avgCompletionRate,
        averageQuizScore: avgScore
      });
    }

    // 5. Overall aggregates
    const overallAverageQuizScore = totalAttemptsCount > 0 
      ? Math.round((totalScoreSum / totalAttemptsCount) * 10) / 10 
      : 0;

    const overallAverageCompletion = courses.length > 0 
      ? Math.round(overallCompletionsSum / courses.length) 
      : 0;

    // 6. Recent activity (attempts, enrollments, comments)
    const recentAttempts = await prisma.quizAttempt.findMany({
      where: { quiz: { courseId: { in: courseIds } } },
      take: 5,
      orderBy: { submittedAt: 'desc' },
      include: {
        student: { select: { nameAr: true, email: true } },
        quiz: { select: { titleAr: true, titleEn: true } }
      }
    });

    const recentComments = await prisma.comment.findMany({
      where: { lesson: { courseId: { in: courseIds } } },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { nameAr: true, role: true } },
        lesson: { select: { titleAr: true, titleEn: true } }
      }
    });

    const recentEnrollments = await prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: {
        student: { select: { nameAr: true, email: true } },
        course: { select: { titleAr: true, titleEn: true } }
      }
    });

    return res.json({
      summary: {
        coursesCount: courses.length,
        studentsCount: totalStudentsEnrolled,
        totalCoupons: totalCouponsCount,
        activeCoupons: activeCouponsCount,
        averageCompletion: overallAverageCompletion,
        averageQuizScore: overallAverageQuizScore
      },
      courses: coursesStats,
      recentActivity: {
        attempts: recentAttempts,
        comments: recentComments,
        enrollments: recentEnrollments
      }
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return res.status(500).json({ error: 'Internal server error calculating analytics' });
  }
};
