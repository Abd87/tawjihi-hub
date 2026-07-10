import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'tawjihi-hub-super-secret-key-2026';

// Register a new user
export const register = async (req: Request, res: Response) => {
  const { email, password, nameAr, nameEn, role, trackType } = req.body;

  try {
    // 1. Basic validation
    if (!email || !password || !nameAr) {
      return res.status(400).json({ error: 'Email, password, and Arabic name are required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // 2. Validate roles and track requirements
    const targetRole = role || 'STUDENT';
    if (!['STUDENT', 'TEACHER', 'ADMIN'].includes(targetRole)) {
      return res.status(400).json({ error: 'Invalid user role selected' });
    }

    if (targetRole === 'STUDENT' && !trackType) {
      return res.status(400).json({ error: 'Track type (ACADEMIC or BTEC) is required for student registration' });
    }

    if (trackType && !['ACADEMIC', 'BTEC'].includes(trackType)) {
      return res.status(400).json({ error: 'Invalid track type (must be ACADEMIC or BTEC)' });
    }

    // 3. Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email address already exists' });
    }

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        nameAr,
        nameEn: nameEn || null,
        role: targetRole,
        trackType: targetRole === 'STUDENT' ? trackType : null,
      },
    });

    // 6. Sign JWT
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      trackType: user.trackType,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    // 7. Return payload (excluding password hash)
    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        nameAr: user.nameAr,
        nameEn: user.nameEn,
        role: user.role,
        trackType: user.trackType,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required fields' });
    }

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password credentials' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password credentials' });
    }

    // 4. Sign JWT
    const tokenPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      trackType: user.trackType,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    // 5. Return payload
    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        nameAr: user.nameAr,
        nameEn: user.nameEn,
        role: user.role,
        trackType: user.trackType,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
};

// Get current user profile (protected)
export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized profile access' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        nameAr: true,
        nameEn: true,
        role: true,
        trackType: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    return res.json({ user });
  } catch (error) {
    console.error('Fetch profile error:', error);
    return res.status(500).json({ error: 'Internal server error fetching user profile' });
  }
};
