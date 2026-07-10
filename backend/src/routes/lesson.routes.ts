import { Router } from 'express';
import { getLessonDetails } from '../controllers/lesson.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Retrieve details for a single lesson
router.get('/:id', authenticateJWT, getLessonDetails);

export default router;
