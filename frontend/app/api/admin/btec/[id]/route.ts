import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

async function checkAdmin(request: Request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || (!user.isMasterAdmin && user.role !== 'ADMIN')) return null;
    return user;
  } catch (e) {
    return null;
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.btecTask.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
