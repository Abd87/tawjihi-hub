import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secret) as any;

    const currentUser = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!currentUser || (currentUser.role !== 'TEACHER' && currentUser.role !== 'ADMIN' && !currentUser.isMasterAdmin)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const broadcast = await prisma.broadcast.findUnique({
      where: { id: params.id },
    });

    if (!broadcast) {
      return NextResponse.json({ error: 'Broadcast not found' }, { status: 404 });
    }

    // Verify ownership or master admin
    if (broadcast.teacherId !== currentUser.id && !currentUser.isMasterAdmin && currentUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.broadcast.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete broadcast error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
}
