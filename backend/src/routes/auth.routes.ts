import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Registration route
router.post('/register', register);

// Login route
router.post('/login', login);

// Get current profile (Protected)
router.get('/me', authenticateJWT, getMe);

export default router;
