import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

// Generate a new coupon code (Admin/Teacher only)
export const createCoupon = async (req: AuthRequest, res: Response) => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER')) {
    return res.status(403).json({ error: 'Access denied: requires Admin or Teacher role' });
  }

  const { courseId, code } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Generate a code if not provided
    const couponCode = code 
      ? code.trim().toUpperCase() 
      : `HUB-${course.titleEn.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Check if code already exists
    const existing = await prisma.coupon.findUnique({
      where: { code: couponCode }
    });

    if (existing) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: couponCode,
        courseId,
        isActive: true
      }
    });

    return res.status(201).json({
      message: 'Coupon created successfully',
      coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    return res.status(500).json({ error: 'Internal server error creating coupon' });
  }
};

// Redeem coupon to enroll in a course (Student/Any user)
export const redeemCoupon = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized coupon redemption' });
  }

  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Coupon code is required' });
  }

  const normalizedCode = code.trim().toUpperCase();

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
      include: { course: true }
    });

    if (!coupon) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    if (!coupon.isActive || coupon.usedById) {
      return res.status(400).json({ error: 'Coupon has already been used or is inactive' });
    }

    // Check if already enrolled in this course
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: req.user.id,
          courseId: coupon.courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'You are already enrolled in this course' });
    }

    // Perform transaction: Update coupon and create enrollment
    const result = await prisma.$transaction(async (tx) => {
      // 1. Mark coupon as used
      const updatedCoupon = await tx.coupon.update({
        where: { id: coupon.id },
        data: {
          isActive: false,
          usedById: req.user?.id,
          usedAt: new Date()
        }
      });

      // 2. Create enrollment
      const enrollment = await tx.enrollment.create({
        data: {
          studentId: req.user?.id || '',
          courseId: coupon.courseId
        }
      });

      return { updatedCoupon, enrollment };
    });

    return res.json({
      message: 'Course unlocked successfully',
      courseId: coupon.courseId,
      courseTitleAr: coupon.course.titleAr,
      courseTitleEn: coupon.course.titleEn
    });

  } catch (error) {
    console.error('Redeem coupon error:', error);
    return res.status(500).json({ error: 'Internal server error redeeming coupon' });
  }
};

// Get list of coupons (Admin/Teacher only)
export const getCoupons = async (req: AuthRequest, res: Response) => {
  if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'TEACHER')) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { courseId } = req.query;

  try {
    const coupons = await prisma.coupon.findMany({
      where: courseId ? { courseId: String(courseId) } : {},
      include: {
        course: {
          select: {
            titleAr: true,
            titleEn: true
          }
        },
        usedBy: {
          select: {
            nameAr: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ coupons });
  } catch (error) {
    console.error('Get coupons error:', error);
    return res.status(500).json({ error: 'Internal server error listing coupons' });
  }
};
