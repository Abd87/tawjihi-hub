import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { courses } = await request.json();

    if (!courses || !Array.isArray(courses)) {
      return NextResponse.json({ error: 'Courses array is required' }, { status: 400 });
    }

    for (const course of courses) {
      // Upsert Course
      await prisma.course.upsert({
        where: { id: course.id },
        update: {
          titleAr: course.titleAr,
          titleEn: course.titleEn,
          descriptionAr: course.descriptionAr,
          descriptionEn: course.descriptionEn,
          track: course.track || 'ACADEMIC',
          semester: course.semester,
          subjectAr: course.subjectAr,
          subjectEn: course.subjectEn,
          teacherId: course.teacherId,
          thumbnailUrl: course.thumbnailUrl,
          coverImage: course.coverImage,
          published: course.published,
          locked: course.locked,
        },
        create: {
          id: course.id,
          titleAr: course.titleAr,
          titleEn: course.titleEn,
          descriptionAr: course.descriptionAr,
          descriptionEn: course.descriptionEn,
          track: course.track || 'ACADEMIC',
          semester: course.semester,
          subjectAr: course.subjectAr,
          subjectEn: course.subjectEn,
          teacherId: course.teacherId,
          thumbnailUrl: course.thumbnailUrl,
          coverImage: course.coverImage,
          published: course.published,
          locked: course.locked,
        }
      });

      // To handle nested data simply in this migration, we will clear existing lessons and recreate them.
      await prisma.lesson.deleteMany({ where: { courseId: course.id } });

      for (const lesson of course.lessons || []) {
        const createdLesson = await prisma.lesson.create({
          data: {
            id: lesson.id,
            courseId: course.id,
            titleAr: lesson.titleAr,
            titleEn: lesson.titleEn,
            videoUrl: lesson.videoUrl,
            pdfUrl: lesson.pdfUrl,
            durationMinutes: lesson.durationMinutes,
            order: lesson.order,
            locked: lesson.locked,
          }
        });

        if (lesson.questions && lesson.questions.length > 0) {
          for (const q of lesson.questions) {
            const createdQ = await prisma.inlineQuestion.create({
              data: {
                id: q.id,
                lessonId: createdLesson.id,
                textAr: q.textAr,
                textEn: q.textEn,
                explanationAr: q.explanationAr,
                explanationEn: q.explanationEn,
              }
            });

            if (q.choices && q.choices.length > 0) {
              await prisma.choice.createMany({
                data: q.choices.map((c: any) => ({
                  questionId: createdQ.id,
                  textAr: c.textAr,
                  textEn: c.textEn,
                  isCorrect: c.isCorrect
                }))
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Sync courses error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
