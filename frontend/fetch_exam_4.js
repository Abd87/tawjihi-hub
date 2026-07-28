const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 4 },
    include: { questions: true }
  });
  fs.writeFileSync('unit4_exam.json', JSON.stringify(exam, null, 2));
  console.log('Exam written to unit4_exam.json');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
