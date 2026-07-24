import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    q: "The popularity of animals like the giant panda helps conservation organizations in two ways. Write down these two ways",
    choices: [
      "to raise money to support a range of critically endangered species.",
      "to find new animals and protect them from natural predators.",
      "to build shelters and provide medical care to all animals.",
      "to hire more researchers and scientists to study the animals."
    ]
  },
  {
    q: "The blobfish has specific physical features that help it survive high water pressure. Write down two of these features",
    choices: [
      "tiny fins and no skeleton",
      "big mouth and slimy pink body",
      "tiny eyes and big mouth",
      "thick skin and large fins"
    ]
  },
  {
    q: "Why are pangolins specifically targeted by poachers?",
    choices: [
      "these scales are highly prized in traditional Chinese medicine",
      "they are the world's largest nocturnal primate",
      "they are considered an omen of bad luck",
      "they get swept into the nets accidentally"
    ]
  },
  {
    q: "What is the main reason why invertebrates receive less protection money than other animals?",
    choices: [
      "because they don't get enough attention from researchers.",
      "because they are far from attractive and have slimy bodies.",
      "because they live deep in the ocean where pressure is very high.",
      "because they are considered an omen of bad luck by local people."
    ]
  },
  {
    q: "Write down the sentence which states that the aye-aye is a shy animal that prefers to live and hunt alone",
    choices: [
      "They are solitary creatures, furry, and harmless but unfortunately, they are often killed.",
      "Found only on the island of Madagascar, the aye aye is the world's largest nocturnal primate.",
      "During the day they sleep in nests in the trees, coming out to hunt at night.",
      "Other creatures become endangered precisely because people find them ugly."
    ]
  },
  {
    q: "What does the underlined pronoun \"it\" in paragraph B refer to?",
    choices: [
      "the blobfish",
      "the giant panda",
      "the marine creature",
      "the ocean"
    ]
  },
  {
    q: "Find a word that means \" covered in liquid and not nice to touch \"",
    choices: [
      "slimy",
      "cuddly",
      "attractive",
      "ugly"
    ]
  },
  {
    q: "Conservation often focuses on \"cute\" animals while \"ugly\" ones are ignored or killed. Suggest two ways to encourage people to care more about less attractive endangered species",
    choices: [
      "By spreading awareness about their ecological importance and creating educational campaigns.",
      "By moving all ugly animals to zoos and keeping them away from humans.",
      "By changing their appearance to make them look more like pandas.",
      "By hunting their predators to increase their population."
    ]
  }
];

async function updateReadingChoices() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 2 },
    include: { questions: true }
  });

  if (!exam) return;

  for (const update of updates) {
    const q = exam.questions.find((question: any) => question.question.includes(update.q));
    if (q) {
      await prisma.grade11Question.update({
        where: { id: q.id },
        data: {
          choices: update.choices,
          correctAnswerIndex: 0 // The correct answer is always index 0 in the above
        }
      });
      console.log(`Updated choices for: ${update.q}`);
    } else {
      console.log(`Question not found: ${update.q}`);
    }
  }
}

updateReadingChoices().finally(() => prisma.$disconnect());
