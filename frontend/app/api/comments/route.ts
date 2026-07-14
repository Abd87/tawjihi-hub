import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
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
        authorId: user.id,
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
