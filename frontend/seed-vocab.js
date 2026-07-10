const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // First ensure there is at least one teacher to own the course
  let teacher = await prisma.user.findFirst({
    where: { role: 'TEACHER' }
  });

  if (!teacher) {
    teacher = await prisma.user.create({
      data: {
        email: 'vocab.teacher@tawjihi.jo',
        passwordHash: 'dummy',
        nameAr: 'قسم اللغة الإنجليزية BTEC',
        nameEn: 'BTEC English Dept',
        role: 'TEACHER'
      }
    });
  }

  const courseId = 'vocab-btec';

  await prisma.course.upsert({
    where: { id: courseId },
    update: {},
    create: {
      id: courseId,
      titleAr: 'تدريب مصطلحات اللغة الإنجليزية BTEC',
      titleEn: 'BTEC English Vocabulary Training',
      descriptionAr: 'كورس تفاعلي لحفظ وتدريب جميع المصطلحات والتمارين الخاصة بمنهاج اللغة الإنجليزية لنظام BTEC.',
      descriptionEn: 'Interactive course for memorizing and practicing all English vocabulary for the BTEC curriculum.',
      track: 'BTEC',
      subjectAr: 'اللغة الإنجليزية',
      subjectEn: 'English Language',
      coverImage: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=60',
      published: true,
      locked: false,
      teacherId: teacher.id
    }
  });

  console.log('Vocab course inserted successfully.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
