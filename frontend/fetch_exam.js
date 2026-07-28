const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 3 },
  });
  console.log(exam.text);
}

main().catch(console.error).finally(() => prisma.$disconnect());
