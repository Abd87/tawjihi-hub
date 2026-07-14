import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const application = await prisma.teacherApplication.update({
      where: { id: params.id },
      data: { status }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error('Update application status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
