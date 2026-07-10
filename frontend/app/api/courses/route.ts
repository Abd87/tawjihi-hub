import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const revalidate = 60;

export async function GET() {
  try {
    const coursesRaw = await prisma.course.findMany({
      include: { 
        teacher: true, 
        liveSessions: true,
        units: {
          include: {
            lessons: {
              select: {
                id: true,
                videoUrl: true,
                pdfUrl: true,
                _count: {
                  select: { questions: true }
                }
              }
            }
          }
        }
      },
    });

    const courses = coursesRaw.map(c => ({
      ...c,
      lessons: c.units.flatMap(u => u.lessons)
    }));

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
