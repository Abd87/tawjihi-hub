import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding English Grade 11 Course to Neon Database...');

  // Find a teacher
  const teacher = await prisma.user.findFirst({
    where: { role: 'TEACHER' }
  });

  if (!teacher) {
    console.error('No teacher found in the database. Please create one first.');
    process.exit(1);
  }

  // Create Course
  const course = await prisma.course.create({
    data: {
      titleAr: 'اللغة الإنجليزية - الصف الحادي عشر (أكاديمي)',
      titleEn: 'English - Grade 11 (Academic)',
      descriptionAr: 'منهج اللغة الإنجليزية الشامل للصف الحادي عشر المسار الأكاديمي',
      descriptionEn: 'Comprehensive English curriculum for Grade 11 Academic stream based on the standard booklets',
      track: 'ACADEMIC',
      subjectAr: 'اللغة الإنجليزية',
      subjectEn: 'English Language',
      teacher: { connect: { id: teacher.id } },
      published: false
    }
  });

  console.log(`Course created: ${course.id}`);

  // Create 10 Units
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
    { ar: 'الوحدة 10 (مع القواعد)', en: 'Unit 10 (with Grammar)' }
  ];

  for (let i = 0; i < units.length; i++) {
    const unit = await prisma.unit.create({
      data: {
        titleAr: units[i].ar,
        titleEn: units[i].en,
        order: i + 1,
        courseId: course.id,
      }
    });
    console.log(`Created unit: ${unit.titleEn}`);

    // Create a few standard empty lessons per unit
    const lessonTitles = [
      { en: 'Reading Comprehension', ar: 'الاستيعاب القرائي' },
      { en: 'Vocabulary & Grammar', ar: 'المفردات والقواعد' },
      { en: 'Practice Questions', ar: 'أسئلة تدريبية' }
    ];

    for (let j = 0; j < lessonTitles.length; j++) {
      await prisma.lesson.create({
        data: {
          titleEn: lessonTitles[j].en,
          titleAr: lessonTitles[j].ar,
          order: j + 1,
          unitId: unit.id,
        }
      });
    }
  }

  console.log('Successfully seeded English course structure!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
