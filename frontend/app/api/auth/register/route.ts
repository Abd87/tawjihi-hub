import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

import { sendWelcomeEmail, sendAdminNewUserAlert } from '@/lib/email';

const registerSchema = z.object({
  nameAr: z.string().min(2, 'nameArRequired'),
  nameEn: z.string().optional(),
  email: z.string().email('invalidEmail'),
  password: z.string().min(6, 'passwordMinLength'),
  phoneNumber: z.string().min(8, 'phoneNumberRequired'),
  role: z.enum(['STUDENT', 'TEACHER', 'ADMIN', 'PARENT']).optional(),
  trackType: z.enum(['ACADEMIC', 'BTEC']).optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    // Max 5 registration requests per 15 minutes
    if (!rateLimit(ip + '_register', 5, 15 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ fieldErrors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { nameAr, nameEn, email, password, role, phoneNumber, trackType } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ fieldErrors: { email: ['emailExists'] } }, { status: 400 });
    }

    if (phoneNumber) {
      const existingPhone = await prisma.user.findUnique({
        where: { phoneNumber },
      });
      if (existingPhone) {
        return NextResponse.json({ fieldErrors: { phoneNumber: ['phoneNumberExists'] } }, { status: 400 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Only allow ADMIN creation if absolutely no ADMINs exist in the system (bootstrapping)
    // Otherwise, completely block privilege escalation
    let isMasterAdmin = false;
    let finalRole = role || 'STUDENT';

    if (role === 'ADMIN' || role === 'TEACHER') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount === 0 && role === 'ADMIN') {
        isMasterAdmin = true;
      } else {
        return NextResponse.json({ error: 'Forbidden: Cannot register as Admin or Teacher' }, { status: 403 });
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        nameAr,
        nameEn,
        role: finalRole,
        trackType: finalRole === 'STUDENT' ? trackType : null,
        phoneNumber,
        isMasterAdmin,
      }
    });

    // Send welcome email to student and admin alert to admin@tawjihihub.com
    sendWelcomeEmail({ email: user.email, name: user.nameAr || user.nameEn || 'طالبنا العزيز' }).catch(err => console.error('Welcome email error:', err));
    sendAdminNewUserAlert({ name: user.nameAr || user.nameEn || 'مستخدم جديد', email: user.email, role: user.role, trackType: user.trackType }).catch(err => console.error('Admin user alert email error:', err));

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
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
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
