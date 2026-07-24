import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, '..', 'data', 'grade11_unit_exams.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const exams = JSON.parse(rawData);

  console.log(`Read ${exams.length} exams from JSON...`);

  // Clear existing to avoid duplicates
  await prisma.grade11Exam.deleteMany({});
  console.log('Cleared existing Grade 11 exams from DB.');

  for (const examData of exams) {
    const exam = await prisma.grade11Exam.create({
      data: {
        unitNumber: examData.unitNumber,
        titleAr: examData.titleAr,
        titleEn: examData.titleEn,
        descriptionAr: examData.descriptionAr,
        descriptionEn: examData.descriptionEn,
        durationMinutes: examData.durationMinutes || 1800,
      }
    });

    console.log(`Created Exam for Unit ${exam.unitNumber}. Inserting ${examData.questions.length} questions...`);

    const questionCreatePromises = examData.questions.map((q: any) => {
      return prisma.grade11Question.create({
        data: {
          examId: exam.id,
          question: q.question,
          choices: q.choices,
          correctAnswerIndex: q.correctAnswerIndex || 0
        }
      });
    });

    await Promise.all(questionCreatePromises);
    console.log(`✅ Successfully seeded Unit ${exam.unitNumber}.`);
  }

  console.log('🎉 Seeding completely finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
