const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const doc = await prisma.libraryDocument.create({
      data: {
        titleAr: 'Test',
        titleEn: 'Test EN',
        grade: 'GRADE_12',
        subject: 'MATH',
        type: 'SUMMARY',
        fileUrl: 'https://drive.google.com/test'
      }
    });
    console.log('Success:', doc.id);
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
