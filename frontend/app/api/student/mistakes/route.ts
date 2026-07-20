import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const token = headerToken || cookieStore.get('token')?.value;
    
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    
    let studentId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      studentId = decoded.userId || decoded.id;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const mistakes = await prisma.mistake.findMany({
      where: { userId: studentId },
      include: {
        question: {
          include: {
            section: {
              include: {
                quiz: {
                  include: {
                    course: true
                  }
                }
              }
            },
            choices: true
          }
        }
      },
      orderBy: { lastAttemptDate: 'desc' }
    });

    return NextResponse.json({ mistakes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const cookieStore = cookies();
    const token = headerToken || cookieStore.get('token')?.value;
    
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing');
    
    let studentId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
      studentId = decoded.userId || decoded.id;
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const url = new URL(request.url);
    const mistakeId = url.searchParams.get('id');

    if (!mistakeId) return NextResponse.json({ error: 'Missing mistake ID' }, { status: 400 });

    await prisma.mistake.delete({
      where: {
        id: mistakeId,
        userId: studentId // ensure they only delete their own mistake
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
