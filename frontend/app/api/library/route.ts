import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');
    const type = searchParams.get('type');
    const publishedOnly = searchParams.get('publishedOnly') === 'true';

    const where: any = {};
    if (grade) where.grade = grade;
    if (subject) where.subject = subject;
    if (type) where.type = type;
    if (publishedOnly) where.isPublished = true;

    const documents = await prisma.libraryDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Fetch Library Documents Error:', error);
    return NextResponse.json({ error: 'Failed to fetch library documents' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    if (decoded.role !== 'ADMIN' && decoded.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const document = await prisma.libraryDocument.create({
      data: {
        titleAr: body.titleAr,
        titleEn: body.titleEn,
        descriptionAr: body.descriptionAr,
        descriptionEn: body.descriptionEn,
        grade: body.grade,
        subject: body.subject,
        type: body.type,
        fileUrl: body.fileUrl,
        isPublished: body.isPublished !== undefined ? body.isPublished : true,
      }
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('Create Library Document Error:', error);
    return NextResponse.json({ error: 'Failed to create library document' }, { status: 500 });
  }
}
