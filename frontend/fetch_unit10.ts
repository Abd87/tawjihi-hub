import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 10 },
    include: { questions: true },
  });

  console.log(JSON.stringify(exam, null, 2));
  fs.writeFileSync('unit10_exam.json', JSON.stringify(exam, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
