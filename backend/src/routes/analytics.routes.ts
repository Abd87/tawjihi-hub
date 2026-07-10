import { Router } from 'express';
import { getTeacherAnalytics } from '../controllers/analytics.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Get teacher dashboard analytics metrics (Admin/Teacher only)
router.get('/teacher', authenticateJWT, getTeacherAnalytics);

export default router;
