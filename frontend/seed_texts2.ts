import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function seedTexts() {
  const data = JSON.parse(fs.readFileSync('C:\\Users\\fastb\\.gemini\\antigravity\\brain\\6fdf2a84-72c6-49c9-b783-4e5991154430\\scratch\\texts2.json', 'utf-8'));

  for (const [unitStr, text] of Object.entries(data)) {
    const unitNumber = parseInt(unitStr);
    if (text) {
      await prisma.grade11Exam.update({
        where: { unitNumber },
        data: { text: text as string }
      });
      console.log(`Updated text for Unit ${unitNumber}`);
    }
  }
}

seedTexts().finally(() => prisma.$disconnect());
