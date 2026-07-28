const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 2 },
    include: { questions: true }
  });

  if (!exam) {
    console.log('Unit 2 exam not found');
    return;
  }

  console.log('Found Exam: Unit 2');
  fs.writeFileSync('unit2_exam.json', JSON.stringify(exam, null, 2));
  console.log('Saved to unit2_exam.json');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
