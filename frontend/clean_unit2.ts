import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanUnit2() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 2 },
    include: { questions: { orderBy: { createdAt: 'asc' } } }
  });

  if (!exam) return;

  for (const q of exam.questions) {
    let newQ = q.question;

    // 1. Remove instructional blocks at the end like "Vocabulary ( /10) marks"
    newQ = newQ.replace(/Vocabulary\s*\(\s*\/\d+\s*\)\s*marks/gi, '');
    newQ = newQ.replace(/Grammar\s*\(\s*\/\d+\s*\)\s*marks/gi, '');

    // 2. Remove points indicators like "(1 points)" or "(2 points)"
    newQ = newQ.replace(/\(\s*\d+\s*points?\s*\)/gi, '');

    // 3. Replace multiple underscores, dots, or weird chars with a single standard blank ________ ONLY IF it's in the middle of words. 
    // If it's at the end, just remove it entirely.
    
    // First normalize all weird dots and lines to underscores
    newQ = newQ.replace(/[…\.]{3,}/g, '________');
    newQ = newQ.replace(/_{3,}/g, '________');
    
    // If the blank is at the end of the string (possibly with spaces), remove it.
    newQ = newQ.replace(/(________\s*)+$/g, '');
    
    // Clean up trailing dots or spaces
    newQ = newQ.replace(/[\s\.]+$/, '');
    newQ = newQ.replace(/\?\s*________/g, '?');

    // 4. Instructional questions to delete
    const isInstruction = /Read the previous text|Based on the text, answer|Choose the correct answer/i.test(newQ);

    const cleanedChoices = q.choices.map((c: string) => c.replace(/[\t`\s]+$/g, '').trim());
    const choicesChanged = JSON.stringify(q.choices) !== JSON.stringify(cleanedChoices);

    if (isInstruction) {
      console.log(`\n[DELETE] ${q.question}`);
      await prisma.grade11Question.delete({ where: { id: q.id } });
    } else {
      if (newQ !== q.question || choicesChanged) {
        console.log(`\n[UPDATE] \nOLD: ${q.question}\nNEW: ${newQ}`);
        if (choicesChanged) console.log(`CHOICES CHANGED`);
        await prisma.grade11Question.update({ 
          where: { id: q.id }, 
          data: { question: newQ, choices: cleanedChoices } 
        });
      } else {
        console.log(`\n[KEEP] ${q.question}`);
      }
    }
  }
}

cleanUnit2().finally(() => prisma.$disconnect());
