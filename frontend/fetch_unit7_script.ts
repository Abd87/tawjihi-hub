import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 7 },
    include: { questions: true }
  });

  if (!exam) {
    console.log("Unit 7 not found");
    return;
  }

  fs.writeFileSync('unit7_exam.json', JSON.stringify(exam, null, 2));
  console.log("Saved to unit7_exam.json");
}

main().catch(console.error).finally(() => prisma.$disconnect());
