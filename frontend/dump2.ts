import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 2 },
    include: { questions: { orderBy: { createdAt: 'asc' } } }
  });
  console.log(JSON.stringify(exam?.questions, null, 2));
}

main().finally(() => prisma.$disconnect());
