import { Router } from 'express';
import { createQuiz, createQuestion, getQuizDetails, submitQuiz } from '../controllers/quiz.controller';
import { authenticateJWT, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Admin: Create quiz
router.post('/', authenticateJWT, requireRole(['ADMIN', 'TEACHER']), createQuiz);

// Admin: Add question to quiz
router.post('/:id/questions', authenticateJWT, requireRole(['ADMIN', 'TEACHER']), createQuestion);

// Student: Fetch quiz details
router.get('/:id', authenticateJWT, getQuizDetails);

// Student: Submit quiz and get graded
router.post('/:id/submit', authenticateJWT, submitQuiz);

export default router;
