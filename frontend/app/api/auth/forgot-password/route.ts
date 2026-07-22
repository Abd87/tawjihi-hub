import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { sendPasswordResetEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    // Max 3 password reset requests per 15 minutes per IP
    if (!rateLimit(ip + '_forgot_password', 3, 15 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { email, locale = 'ar' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // To prevent account enumeration, always return success even if user not found
    if (!user) {
      return NextResponse.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is missing');
    }

    // Signed token valid for 1 hour
    const token = jwt.sign(
      { userId: user.id, email: user.email, action: 'reset_password' },
      secret,
      { expiresIn: '1h' }
    );

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tawjihihub.com';
    const resetUrl = `${baseUrl}/${locale}/reset-password?token=${token}`;

    const userName = user.nameAr || user.nameEn || 'طالبنا العزيز';
    await sendPasswordResetEmail({ email: user.email, name: userName, resetUrl });

    return NextResponse.json({ success: true, message: 'If the email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
