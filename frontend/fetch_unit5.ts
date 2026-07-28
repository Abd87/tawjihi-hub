import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 5 },
    include: { questions: true }
  });

  fs.writeFileSync('unit5_dump.json', JSON.stringify(exam, null, 2));
  console.log('Dumped unit 5 to unit5_dump.json');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
