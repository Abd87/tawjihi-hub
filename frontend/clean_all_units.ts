import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAllUnits() {
  const unitsToClean = [3, 4, 5, 6, 7, 8, 9, 10];

  for (const unit of unitsToClean) {
    const exam = await prisma.grade11Exam.findUnique({
      where: { unitNumber: unit },
      include: { questions: true }
    });

    if (!exam) continue;

    let deletedCount = 0;
    let updatedCount = 0;

    for (const q of exam.questions) {
      // 1. Delete questions that are purely instructions
      const qText = q.question.trim();
      const isInstruction = 
        qText.toLowerCase().includes('read the following text') ||
        qText.toLowerCase().includes('read the previous text') ||
        qText.toLowerCase().includes('answer the questions') ||
        qText.toLowerCase().includes('based on the text') ||
        /vocabulary\s*\(\s*\/\s*\d+\s*\)\s*marks/i.test(qText) ||
        /grammar\s*\(\s*\/\s*\d+\s*\)\s*marks/i.test(qText) ||
        qText === 'Vocabulary :' ||
        qText === 'Grammar :' ||
        qText.startsWith('Reading Comprehension');

      if (isInstruction && qText.length < 150) {
        await prisma.grade11Question.delete({ where: { id: q.id } });
        deletedCount++;
        continue;
      }

      // 2. Clean dotted lines and blanks
      let newQText = qText;
      // Remove massive dotted lines
      newQText = newQText.replace(/(?:[.…]{4,}|_+)/g, ' ________ ');
      // Clean up multiple spaces
      newQText = newQText.replace(/\s+/g, ' ').trim();

      // 3. Clean choices
      const newChoices = q.choices.map(c => {
        let cleaned = c;
        // remove leading/trailing punctuation and spaces like "  ` word  \t "
        cleaned = cleaned.replace(/^[`'"\s]+|[`'"\s]+$/g, '');
        // collapse spaces
        cleaned = cleaned.replace(/\s+/g, ' ');
        return cleaned;
      });

      if (newQText !== q.question || JSON.stringify(newChoices) !== JSON.stringify(q.choices)) {
        await prisma.grade11Question.update({
          where: { id: q.id },
          data: {
            question: newQText,
            choices: newChoices
          }
        });
        updatedCount++;
      }
    }
    
    console.log(`Unit ${unit}: Deleted ${deletedCount} instructions, Updated ${updatedCount} formatting.`);
  }
}

cleanAllUnits().finally(() => prisma.$disconnect());
