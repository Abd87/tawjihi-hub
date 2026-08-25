import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, trackType, linkedStudentEmail } = body;

    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData: any = {};
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (trackType !== undefined) updateData.trackType = trackType;
    if (linkedStudentEmail !== undefined) updateData.parentEmail = linkedStudentEmail;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    const { passwordHash: _, parentEmail, ...userWithoutPassword } = updatedUser;
    const responseUser = {
      ...userWithoutPassword,
      linkedStudentEmail: parentEmail
    };

    return NextResponse.json({ success: true, user: responseUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
