import { PrismaClient, TrackType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding English Grade 11 Course...');

  // Find a teacher
  const teacher = await prisma.user.findFirst({
    where: { role: 'TEACHER' }
  });

  if (!teacher) {
    console.error('No teacher found in the database. Please create one first.');
    process.exit(1);
  }

  // Find or create Academic Track
  let track = await prisma.track.findFirst({
    where: { key: 'ACADEMIC' }
  });

  if (!track) {
    track = await prisma.track.create({
      data: {
        key: 'ACADEMIC',
        nameAr: 'المسار الأكاديمي',
        nameEn: 'Academic Track'
      }
    });
  }

  // Find or create English Subject
  let subject = await prisma.subject.findFirst({
    where: { nameEn: { contains: 'English' } }
  });

  if (!subject) {
    subject = await prisma.subject.create({
      data: {
        nameAr: 'اللغة الإنجليزية',
        nameEn: 'English Language',
        trackId: track.id,
        icon: 'BookOpen'
      }
    });
  }

  // Create Course
  const course = await prisma.course.create({
    data: {
      titleAr: 'اللغة الإنجليزية - الصف الحادي عشر (أكاديمي)',
      titleEn: 'English - Grade 11 (Academic)',
      descriptionAr: 'منهج اللغة الإنجليزية الشامل للصف الحادي عشر المسار الأكاديمي',
      descriptionEn: 'Comprehensive English curriculum for Grade 11 Academic stream',
      teacherId: teacher.id,
      subjectId: subject.id,
    }
  });

  console.log(`Course created: ${course.id}`);

  // Create 10 Units (Lessons)
  const units = [
    { ar: 'الوحدة 1', en: 'Unit 1' },
    { ar: 'الوحدة 2', en: 'Unit 2' },
    { ar: 'الوحدة 3', en: 'Unit 3' },
    { ar: 'الوحدة 4', en: 'Unit 4' },
    { ar: 'الوحدة 5', en: 'Unit 5' },
    { ar: 'الوحدة 6', en: 'Unit 6' },
    { ar: 'الوحدة 7', en: 'Unit 7' },
    { ar: 'الوحدة 8', en: 'Unit 8' },
    { ar: 'الوحدة 9', en: 'Unit 9' },
    { ar: 'الوحدة 10', en: 'Unit 10' }
  ];

  for (let i = 0; i < units.length; i++) {
    const lesson = await prisma.lesson.create({
      data: {
        titleAr: units[i].ar,
        titleEn: units[i].en,
        order: i + 1,
        courseId: course.id,
      }
    });
    console.log(`Created lesson: ${lesson.titleEn}`);
  }

  console.log('Successfully seeded English course!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
