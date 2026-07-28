const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 9 },
    include: { questions: true }
  });

  fs.writeFileSync('unit9.json', JSON.stringify(exam, null, 2));
  console.log('Saved to unit9.json');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
