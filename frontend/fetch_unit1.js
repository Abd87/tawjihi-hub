const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 1 },
    include: { questions: true }
  });
  
  fs.writeFileSync('unit1_exam.json', JSON.stringify(exam, null, 2));
  console.log('Exam saved to unit1_exam.json');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
