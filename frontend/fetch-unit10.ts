import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findFirst({
    where: { unitNumber: 10 },
    include: { questions: true }
  });
  
  fs.writeFileSync('unit10-exam.json', JSON.stringify(exam, null, 2));
  console.log('Exam written to unit10-exam.json');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
