const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 7 },
    include: { questions: true }
  });

  if (!exam) {
    console.log("Exam not found");
    return;
  }

  fs.writeFileSync('unit7-exam.json', JSON.stringify(exam, null, 2));
  console.log("Saved to unit7-exam.json");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
