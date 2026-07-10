import { Router } from 'express';
import { getCourses, getCourseDetails } from '../controllers/course.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Retrieve all courses relevant to the students track
router.get('/', authenticateJWT, getCourses);

// Retrieve details for a single course
router.get('/:id', authenticateJWT, getCourseDetails);

export default router;
