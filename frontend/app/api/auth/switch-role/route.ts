import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { targetRole } = await request.json();

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    // Only Master Admin or normal ADMIN can use the role switcher.
    // If they switched to STUDENT, they still retain isMasterAdmin or can switch back using the API if they kept their token?
    // Wait, if they are already STUDENT, they can only switch if they are isMasterAdmin.
    if (!user || (!user.isMasterAdmin && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { role: targetRole },
    });

    const newToken = jwt.sign({ 
      userId: updatedUser.id, 
      email: updatedUser.email, 
      role: updatedUser.role, 
      isMasterAdmin: updatedUser.isMasterAdmin 
    }, secret, { expiresIn: '7d' });

    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    const response = NextResponse.json({ success: true, user: userWithoutPassword, token: newToken });
    
    response.cookies.set('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Role switch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
