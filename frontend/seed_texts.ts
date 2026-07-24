import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function seedExamTexts() {
  const jsonPath = path.join(__dirname, 'data', 'grade11_unit_exams.json');
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  for (const unit of data) {
    if (unit.text) {
      await prisma.grade11Exam.update({
        where: { unitNumber: unit.unitNumber },
        data: { text: unit.text }
      });
      console.log(`Updated text for Unit ${unit.unitNumber}`);
    } else {
      console.log(`No text found in JSON for Unit ${unit.unitNumber}`);
    }
  }
}

seedExamTexts().finally(() => prisma.$disconnect());
