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

export async function GET(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const tasks = await prisma.btecTask.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const admin = await checkAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { major, titleAr, titleEn, descriptionAr, passCriteria, meritCriteria, distinctionCriteria, templateUrl } = body;

    const task = await prisma.btecTask.create({
      data: {
        major,
        titleAr,
        titleEn,
        descriptionAr,
        passCriteria,
        meritCriteria,
        distinctionCriteria,
        templateUrl
      }
    });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}
