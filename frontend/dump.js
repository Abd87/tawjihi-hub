const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 3 },
    include: { questions: true }
  });
  fs.writeFileSync('questions.json', JSON.stringify(exam.questions, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
