import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const secret = process.env.JWT_SECRET || 'tawjihi-hub-secret-key-for-jwt-2024';
    const decoded = jwt.verify(token, secret) as any;
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, content, parentId } = body;

    if (!lessonId || !content) {
      return NextResponse.json({ error: 'Lesson ID and content are required' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content,
        authorId: decoded.userId,
        lessonId: lessonId,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            nameAr: true,
            nameEn: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
