import { Router } from 'express';
import { createCoupon, redeemCoupon, getCoupons } from '../controllers/coupon.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// Create new coupon (Admin/Teacher only)
router.post('/', authenticateJWT, createCoupon);

// Redeem coupon to enroll (All authenticated users)
router.post('/redeem', authenticateJWT, redeemCoupon);

// Get coupon list (Admin/Teacher only)
router.get('/', authenticateJWT, getCoupons);

export default router;
