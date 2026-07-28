import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 2 },
    include: { questions: true }
  });
  
  if (!exam) {
    console.log('No exam found for Unit 2');
    return;
  }
  
  fs.writeFileSync('unit2_exam.json', JSON.stringify(exam, null, 2));
  console.log('Saved to unit2_exam.json');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
