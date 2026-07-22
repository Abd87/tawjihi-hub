import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is missing');
    }

    let decoded: any;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid or expired reset token. Please request a new link.' }, { status: 401 });
    }

    if (decoded.action !== 'reset_password' || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid reset token format.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // Single-use check: Verify the token was generated for the PREVIOUS password
    // If the password was already changed, hashSig won't match user.passwordHash.slice(-12)
    if (decoded.hashSig && decoded.hashSig !== user.passwordHash.slice(-12)) {
      return NextResponse.json({ error: 'This password reset link has already been used. Please request a new one.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { passwordHash },
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
