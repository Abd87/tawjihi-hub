import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || '');
    if (!decoded.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    // Anyone logged in can view BTEC tasks for now.
    const tasks = await prisma.btecTask.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
