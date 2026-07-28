import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const exams = await prisma.grade11Exam.findMany({
    include: {
      questions: true
    },
    orderBy: {
      unitNumber: 'asc'
    }
  });

  console.log('--- Explanation Progress Report ---');
  let totalProcessed = 0;
  let totalQuestions = 0;

  for (const exam of exams) {
    let processed = 0;
    for (const q of exam.questions) {
      if (q.explanation) {
        processed++;
      }
    }
    totalQuestions += exam.questions.length;
    totalProcessed += processed;
    
    console.log(`Unit ${exam.unitNumber}: ${processed}/${exam.questions.length} questions updated with explanations.`);
  }

  console.log(`\nTotal: ${totalProcessed}/${totalQuestions} questions updated.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
