import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    id: '891eee73-a1a1-413c-bc85-6eb4ff46797a',
    choices: [
      "They signal that there are spoilers in their reviews.",
      "They summarize the entire article in one sentence.",
      "They trick readers into clicking on advertisements.",
      "They provide a detailed analysis of the news event."
    ],
    correctAnswerIndex: 0,
    explanation: "The first paragraph states: 'News sites are usually careful to at least signal that there are spoilers in their reviews'."
  },
  {
    id: '0b1679a3-5eb9-423d-943e-cb9dc26d1241',
    choices: [
      "crack a few jokes",
      "be a must watch",
      "heckle somebody",
      "catch up on"
    ],
    correctAnswerIndex: 1,
    explanation: "'You can't miss this film' means it is so good that it should be a 'must watch'."
  },
  {
    id: '359cdac8-0d83-46c4-8097-bb96142f686c',
    choices: [
      "Brief introductions which subtly 'spoilt' the plots.",
      "A summary of the characters' personalities.",
      "Extra time to finish reading the stories.",
      "A different ending for each story."
    ],
    correctAnswerIndex: 0,
    explanation: "According to the second paragraph, the second group was given 'brief introductions which subtly “spoilt” the plots.'"
  },
  {
    id: '78a538f9-d943-4518-a603-5208d108448a',
    choices: [
      "enormous",
      "spherical",
      "curved",
      "miniature"
    ],
    correctAnswerIndex: 0,
    explanation: "'Enormous' means very large. If the sculpture couldn't fit through a normal entrance and required massive doors, it must be enormous."
  },
  {
    id: '13e9a1e5-8e81-4948-96d4-e532ea357bef',
    choices: [
      "exceptional",
      "comical",
      "cheesy",
      "unconvincing"
    ],
    correctAnswerIndex: 1,
    explanation: "'Comical' means funny or amusing. Since the speaker couldn't stop laughing, the costume must have been comical."
  },
  {
    id: '59b23d30-7f95-469f-9ddd-e67098619850',
    choices: [
      "exceptional",
      "lively",
      "cheesy",
      "miniature"
    ],
    correctAnswerIndex: 2,
    explanation: "'Cheesy' jokes are predictable, unoriginal, and usually not very funny."
  },
  {
    id: '3f6d9176-4f1e-4c5f-8f8e-74f459715d1b',
    choices: [
      "in suspense",
      "on purpose",
      "by accident",
      "at least"
    ],
    correctAnswerIndex: 2,
    explanation: "The phrase 'He didn't mean to' indicates that the action was unintentional, so it was done 'by accident'."
  },
  {
    id: 'cdce6a98-3a6d-4913-b7a5-e10dd27fdf9f',
    choices: [
      "the kind of people who avoid spoilers",
      "the stories",
      "the authors",
      "the participants in the study"
    ],
    correctAnswerIndex: 0,
    explanation: "The pronoun 'They' refers to the subject of the previous sentence: 'the kind of people who are keen to avoid spoilers'."
  },
  {
    id: 'd8dc3bff-a901-4225-9ad3-6ae070edd5e9',
    choices: [
      "deliver the punchline",
      "be a must watch",
      "catch up on the latest episode",
      "crack a few jokes"
    ],
    correctAnswerIndex: 2,
    explanation: "To 'catch up on' means to watch or read something that you missed earlier."
  },
  {
    id: '9481a020-6f51-40a2-bbde-f3c419c3ada7',
    choices: [
      "Because they are free to notice more of the detail.",
      "Because they forgot what happened at the end.",
      "Because they want to find plot holes in the narrative.",
      "Because they want to impress their friends."
    ],
    correctAnswerIndex: 0,
    explanation: "The third paragraph states: 'we enjoy it more the second time because we are free to notice more of the detail'."
  },
  {
    id: '7d0bb72f-2951-4a03-ad24-2911f39793b2',
    choices: [
      "historical",
      "historic",
      "classic",
      "classical"
    ],
    correctAnswerIndex: 1,
    explanation: "'Historic' means important or significant in history, whereas 'historical' means relating to the past."
  },
  {
    id: '0108687e-d4f7-4c81-8a85-4db2db2b2b99',
    choices: [
      "offensive",
      "unconvincing",
      "exceptional",
      "classical"
    ],
    correctAnswerIndex: 2,
    explanation: "'Exceptional' means unusually good or outstanding. Since her performance was 'far better than anyone else', it was exceptional."
  },
  {
    id: 'f24e8a81-3a65-4f54-be25-beeba67bc737',
    choices: [
      "plot line",
      "spoiler",
      "suspense",
      "review"
    ],
    correctAnswerIndex: 0,
    explanation: "A 'plot line' or 'plot' refers to the storyline or the main events of a play, novel, or movie."
  },
  {
    id: 'e2980835-2464-4e83-8b64-963d3c02f130',
    choices: [
      "deliver the punchline",
      "be a must watch",
      "play the lead",
      "catch up on"
    ],
    correctAnswerIndex: 0,
    explanation: "To 'deliver the punchline' means to say the final, funny part of a joke."
  },
  {
    id: '3d4749e0-ee4a-48ce-bf13-4194000d4365',
    choices: [
      "sitcom",
      "plot",
      "cast",
      "punchline"
    ],
    correctAnswerIndex: 3,
    explanation: "A 'punchline' is the final phrase or sentence of a joke, providing the humor."
  },
  {
    id: '4193fa8e-e69a-4a6b-b336-9ce7e9e8241c',
    choices: [
      "It lets readers focus on how the events unfold rather than just what happens.",
      "It ruins the suspense and makes the story less interesting.",
      "It is only useful for academic reading, not for entertainment.",
      "It helps readers read faster and skip boring parts."
    ],
    correctAnswerIndex: 0,
    explanation: "Knowing the ending removes the pressure of suspense, allowing the reader to appreciate the details, writing style, and character development."
  },
  {
    id: 'aa305b62-e6ca-41b4-9454-3b2fcbef1985',
    choices: [
      "it was the second group who claimed the greatest reading satisfaction.",
      "News sites are usually careful to at least signal that there are spoilers in their reviews.",
      "They are very emotionally involved with what they are reading.",
      "Some people are under the impression that it’s because we are in suspense about what is going to happen"
    ],
    correctAnswerIndex: 0,
    explanation: "The sentence '...surprisingly, it was the second group who claimed the greatest reading satisfaction' shows that knowing the outcome (having the plot spoilt) actually made the experience more enjoyable."
  }
];

async function main() {
  for (const update of updates) {
    await prisma.grade11Question.update({
      where: { id: update.id },
      data: {
        choices: update.choices,
        correctAnswerIndex: update.correctAnswerIndex,
        explanation: update.explanation,
      },
    });
    console.log(`Updated question ${update.id}`);
  }
  console.log('All Unit 10 questions successfully updated!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
