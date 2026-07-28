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
      try {
        // Validate teacher exists to avoid foreign key constraints failing on mock data
        let teacherExists = await prisma.user.findUnique({ where: { id: course.teacherId } });
        if (!teacherExists) {
          console.warn(`Teacher ${course.teacherId} not found for course ${course.id}. Assigning to fallback user.`);
          const fallback = await prisma.user.findFirst({ where: { role: { in: ['ADMIN', 'TEACHER'] } } });
          if (!fallback) continue;
          course.teacherId = fallback.id;
        }

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
          price: typeof course.price === 'number' ? course.price : 35.0,
          subjectAr: course.subjectAr,
          subjectEn: course.subjectEn,
          teacherId: course.teacherId,
          thumbnailUrl: course.thumbnailUrl,
          coverImage: course.coverImage,
          published: course.published,
          locked: course.locked,
          discussionGroupLink: course.discussionGroupLink,
        },
        create: {
          id: course.id,
          titleAr: course.titleAr,
          titleEn: course.titleEn,
          descriptionAr: course.descriptionAr,
          descriptionEn: course.descriptionEn,
          track: course.track || 'ACADEMIC',
          semester: course.semester,
          price: typeof course.price === 'number' ? course.price : 35.0,
          subjectAr: course.subjectAr,
          subjectEn: course.subjectEn,
          teacherId: course.teacherId,
          thumbnailUrl: course.thumbnailUrl,
          coverImage: course.coverImage,
          published: course.published,
          locked: course.locked,
          discussionGroupLink: course.discussionGroupLink,
        }
      });

      // To handle nested data simply in this migration, we will clear existing units and live sessions and recreate them.
      // Deleting units cascades to lessons
      await prisma.unit.deleteMany({ where: { courseId: course.id } });
      await prisma.liveSession.deleteMany({ where: { courseId: course.id } });

      if (course.liveSessions && course.liveSessions.length > 0) {
        await prisma.liveSession.createMany({
          data: course.liveSessions.map((session: any) => ({
            id: session.id,
            courseId: course.id,
            titleAr: session.titleAr,
            titleEn: session.titleEn,
            zoomLink: session.zoomLink,
            startTime: new Date(session.startTime),
            durationMinutes: session.durationMinutes,
          }))
        });
      }

      for (const unit of course.units || []) {
        const createdUnit = await prisma.unit.create({
          data: {
            id: unit.id,
            courseId: course.id,
            titleAr: unit.titleAr,
            titleEn: unit.titleEn,
            order: unit.order,
          }
        });

        for (const lesson of unit.lessons || []) {
          const createdLesson = await prisma.lesson.create({
            data: {
              id: lesson.id,
              unitId: createdUnit.id,
              titleAr: lesson.titleAr,
              titleEn: lesson.titleEn,
              videoUrl: lesson.videoUrl,
              pdfUrl: lesson.pdfUrl,
              durationMinutes: lesson.durationMinutes,
              order: lesson.order,
              locked: lesson.locked,
              isFreeTrial: lesson.isFreeTrial || false,
              explanationAr: lesson.explanationAr,
              explanationEn: lesson.explanationEn,
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
        } // Close lesson loop
      } // Close unit loop
      } catch (err) {
        console.error(`Failed to sync course ${course.id}:`, err);
        // Continue to the next course instead of failing the entire sync request
      }
    }

    return NextResponse.json({ success: true, synced: courses.length });
  } catch (error: any) {
    console.error('Sync courses error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
