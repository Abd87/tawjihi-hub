import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 4 },
    include: { questions: true }
  });

  if (!exam) {
    console.log("Exam not found");
    return;
  }
  
  fs.writeFileSync('exam4-data.json', JSON.stringify(exam, null, 2));
  console.log("Exam saved to exam4-data.json");
}

main().catch(console.error).finally(() => prisma.$disconnect());
