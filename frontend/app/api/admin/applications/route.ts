import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;
    if (decoded.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const applications = await prisma.teacherApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
