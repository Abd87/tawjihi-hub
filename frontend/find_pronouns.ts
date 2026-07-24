import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findPronounQuestions() {
  const exams = await prisma.grade11Exam.findMany({
    include: { questions: true }
  });

  for (const exam of exams) {
    for (const q of exam.questions) {
      if (q.question.toLowerCase().includes('underline') || q.question.toLowerCase().includes('pronoun')) {
        console.log(`Unit ${exam.unitNumber}: ${q.question}`);
        console.log(`---`);
      }
    }
  }
}

findPronounQuestions().finally(() => prisma.$disconnect());
