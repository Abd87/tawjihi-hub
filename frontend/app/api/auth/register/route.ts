import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { nameAr, nameEn, email, password, role, phoneNumber, trackType } = await request.json();

    if (!email || !password || !nameAr) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // The very first ADMIN created in the system becomes the Master Admin
    let isMasterAdmin = false;
    if (role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount === 0) {
        isMasterAdmin = true;
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nameAr,
        nameEn,
        role: role || 'STUDENT',
        trackType: role === 'STUDENT' ? trackType : null,
        phoneNumber: phoneNumber || null,
        isMasterAdmin,
      }
    });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role, isMasterAdmin: user.isMasterAdmin, trackType: user.trackType }, secret, { expiresIn: '7d' });

    const { passwordHash: _, ...userWithoutPassword } = user;

    const response = NextResponse.json({ token, user: userWithoutPassword });
    
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
