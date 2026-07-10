import { Router } from 'express';
import { getLessonComments, createComment, deleteComment } from '../controllers/comment.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Retrieve comments for a lesson
router.get('/lesson/:lessonId', authenticateJWT, getLessonComments);

// Post a comment/reply under a lesson
router.post('/lesson/:lessonId', authenticateJWT, createComment);

// Delete a comment
router.delete('/:id', authenticateJWT, deleteComment);

export default router;
