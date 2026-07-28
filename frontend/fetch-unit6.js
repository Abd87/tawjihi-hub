const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 6 },
    include: { questions: true },
  });

  if (!exam) {
    console.log('Unit 6 exam not found.');
    return;
  }

  console.log(`Exam Text: ${exam.text?.substring(0, 200)}...`);
  
  fs.writeFileSync('unit6_exam.json', JSON.stringify(exam, null, 2));
  console.log('Saved to unit6_exam.json');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
