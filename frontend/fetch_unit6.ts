import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 6 },
    include: { questions: true }
  });
  
  if (!exam) {
    console.log("Exam not found");
    return;
  }
  
  fs.writeFileSync('unit6_data.json', JSON.stringify(exam, null, 2));
  console.log("Saved to unit6_data.json");
}

main().catch(console.error).finally(() => prisma.$disconnect());
