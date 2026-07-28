import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 8 },
    include: { questions: true }
  });

  if (!exam) {
    console.error('Unit 8 Exam not found.');
    return;
  }

  fs.writeFileSync('unit8_exam.json', JSON.stringify(exam, null, 2));
  console.log('Exam dumped to unit8_exam.json');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
