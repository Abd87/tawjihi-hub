import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 4 },
    include: { questions: true }
  });
  
  fs.writeFileSync('unit4_dump.json', JSON.stringify(exam, null, 2));
  console.log("Dumped unit4_dump.json");
}

main().catch(console.error).finally(() => prisma.$disconnect());
