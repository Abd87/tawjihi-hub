import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 9 },
    include: { questions: {
        orderBy: { createdAt: 'asc' }
    } }
  });
  console.log(JSON.stringify(exam, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
