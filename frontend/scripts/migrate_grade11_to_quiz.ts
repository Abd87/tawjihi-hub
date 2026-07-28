import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const targetCourseId = 'course-1783675239176';
  const unitsToMigrate = [1, 2, 4, 5, 6, 7, 8, 9];

  console.log(`Starting migration to course: ${targetCourseId}`);
  console.log(`Units to migrate: ${unitsToMigrate.join(', ')}`);

  // Verify the course exists
  const course = await prisma.course.findUnique({
    where: { id: targetCourseId }
  });

  if (!course) {
    console.error(`Course with ID ${targetCourseId} not found!`);
    return;
  }

  // Fetch all requested Grade 11 exams with their questions
  const grade11Exams = await prisma.grade11Exam.findMany({
    where: {
      unitNumber: {
        in: unitsToMigrate
      }
    },
    include: {
      questions: {
        orderBy: {
          createdAt: 'asc'
        }
      }
    },
    orderBy: {
      unitNumber: 'asc'
    }
  });

  if (grade11Exams.length === 0) {
    console.log('No Grade 11 exams found to migrate.');
    return;
  }

  for (const exam of grade11Exams) {
    console.log(`Migrating Unit ${exam.unitNumber} (${exam.titleEn})...`);

    // Create the Quiz
    const quiz = await prisma.quiz.create({
      data: {
        courseId: targetCourseId,
        titleAr: exam.titleAr,
        titleEn: exam.titleEn,
        descriptionAr: exam.descriptionAr,
        descriptionEn: exam.descriptionEn,
        cefrLevel: 'B2',
        durationMinutes: 45, // Set default duration for quiz
        
        // Create a single section for this quiz that contains all questions
        sections: {
          create: {
            titleAr: 'القسم الأول',
            titleEn: 'Section 1',
            passageAr: exam.text,
            passageEn: exam.text,
            order: 1,
            
            // Map the questions
            questions: {
              create: exam.questions.map((q) => {
                return {
                  textAr: q.question,
                  textEn: q.question,
                  type: 'MCQ',
                  explanationAr: q.explanation || '',
                  explanationEn: q.explanation || '',
                  
                  // Map the choices
                  choices: {
                    create: q.choices.map((choiceText, cIdx) => {
                      return {
                        textAr: choiceText,
                        textEn: choiceText,
                        isCorrect: q.correctAnswerIndex === cIdx
                      };
                    })
                  }
                };
              })
            }
          }
        }
      }
    });

    console.log(`Successfully created Quiz for Unit ${exam.unitNumber} (Quiz ID: ${quiz.id})`);
  }

  console.log('\nMigration completed successfully!');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
