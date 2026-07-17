import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// GET all progress for a course
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || cookies().get('token')?.value;
    
    if (!token) return NextResponse.json({ items: [] });

    let userId = null;
    try {
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret) as any;
      userId = decoded.userId;
    } catch (e) {
      return NextResponse.json({ items: [] });
    }

    const progressRecords = await prisma.progress.findMany({
      where: {
        studentId: userId,
        courseId: courseId
      }
    });

    const items = progressRecords.map(p => p.itemId);
    
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Fetch progress error:', error);
    return NextResponse.json({ items: [] });
  }
}

// POST to save a completed item
export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1] || cookies().get('token')?.value;
    
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let userId = null;
    try {
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret) as any;
      userId = decoded.userId;
    } catch (e) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, itemId } = body;

    if (!courseId || !itemId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Upsert the progress record to avoid unique constraint violations
    await prisma.progress.upsert({
      where: {
        studentId_itemId: {
          studentId: userId,
          itemId: itemId
        }
      },
      update: {},
      create: {
        studentId: userId,
        courseId: courseId,
        itemId: itemId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save progress error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
