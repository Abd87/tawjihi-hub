import { Router } from 'express';
import { toggleLessonProgress, getCourseProgress } from '../controllers/progress.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Toggle completion status for a lesson
router.post('/:id/progress', authenticateJWT, toggleLessonProgress);

// Get student progresses for a course
router.get('/course/:courseId/progress', authenticateJWT, getCourseProgress);

export default router;
