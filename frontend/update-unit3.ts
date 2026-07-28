import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    search: "Read the following text then answer the questions below",
    question: "Based on the text, what was life like for people in the workhouses?",
    choices: [
      "They managed a subsistence, living day-to-day.",
      "They were well fed and had easy lives.",
      "They were given plenty of money.",
      "They had their own private rooms."
    ],
    correctAnswerIndex: 0,
    explanation: "The passage states that 'life in the workhouses was not easy, where people somehow managed a subsistence, living day-to-day, huddled together to keep warm.'"
  },
  {
    search: "Life in the workhouses was described as not being easy",
    question: "According to the text, why did Oliver leave the orphans' house at age nine?",
    choices: [
      "He was sent to a workhouse to work.",
      "He wanted to travel to London.",
      "He was adopted by a rich family.",
      "He escaped because he was hungry."
    ],
    correctAnswerIndex: 0,
    explanation: "The passage mentions: 'he was sent to a house for orphans until he was nine. Then he was sent to a workhouse to work.'"
  },
  {
    search: "Monks wanted to ensure Oliver never became an honest person",
    question: "Who did Monks make sure Oliver met so that he would become dishonest?",
    choices: [
      "Jack Dawkins and Fagin",
      "Mr Brownlow and the housekeeper",
      "The police officer and Mr Sikes",
      "His mother and the nurse"
    ],
    correctAnswerIndex: 0,
    explanation: "The text states: 'he watched Oliver and made sure that he met Jack Dawkins, and then Fagin. In this way, Oliver would never be honest'."
  },
  {
    search: "What did the other boys encourage Oliver to do",
    question: "What action by Oliver caused the managers of the workhouse to become angry?",
    choices: [
      "He begged for more food.",
      "He stole a handkerchief.",
      "He escaped to London.",
      "He refused to work."
    ],
    correctAnswerIndex: 0,
    explanation: "The text says: 'One day, they encouraged Oliver to beg for more food, but this made the managers of the workhouse angry.'"
  },
  {
    search: "Why did Mr. Brownlow convince the police officer not to arrest Oliver",
    question: "Why did Mr. Brownlow tell the police not to arrest Oliver?",
    choices: [
      "Because Oliver had not taken anything.",
      "Because Oliver was too young.",
      "Because he was Oliver's father.",
      "Because he wanted Oliver to work for him."
    ],
    correctAnswerIndex: 0,
    explanation: "According to the passage: 'Mr Brownlow, told the police officer that Oliver had not taken anything.'"
  },
  {
    search: "Write down the sentence which states exactly when Oliver realized",
    question: "When did Oliver realize that Fagin’s boys were criminals?",
    choices: [
      "When he saw them take things from people's pockets.",
      "When they gave Fagin watches and jewellery.",
      "When the police officer tried to arrest him.",
      "When Mr Sikes told him to climb through a window."
    ],
    correctAnswerIndex: 0,
    explanation: "The passage says: 'Oliver was shocked when he saw the boys take things from people’s pockets. He understood that they were thieves!'"
  },
  {
    search: "What does the underlined pronoun",
    question: "What does the pronoun 'He' in the sentence 'He showed Oliver the way to the city' refer to?",
    choices: [
      "Jack Dawkins",
      "Fagin",
      "Mr Brownlow",
      "Monks"
    ],
    correctAnswerIndex: 0,
    explanation: "The previous sentence mentions 'another boy called Jack Dawkins', making him the referent of 'He'."
  },
  {
    search: "Find a word that means",
    question: "Which word or phrase from the text means 'to have just enough money or food to survive'?",
    choices: [
      "managed a subsistence",
      "make ends meet",
      "lived hand-to-mouth",
      "All of the above"
    ],
    correctAnswerIndex: 3,
    explanation: "The text uses 'managed a subsistence', 'make ends meet', and 'lived hand-to-mouth' to describe the extreme poverty and survival conditions."
  },
  {
    search: "The story highlights the vulnerability of children",
    question: "The story highlights the vulnerability of children who have no family to support them. Suggest two tips for how society can better protect orphans to prevent them from turning to crime.",
    choices: [
      "Implement stronger child protection laws and offer community support programs.",
      "Send them to work in factories.",
      "Ignore the problem as it will solve itself.",
      "Teach them how to steal effectively."
    ],
    correctAnswerIndex: 0,
    explanation: "Providing community support and protection laws helps vulnerable children avoid turning to crime, which is a key theme in Oliver Twist."
  },
  {
    search: "he refuses to accept anyone who has a different opinion",
    correctAnswerIndex: 0,
    explanation: "The word 'bigoted' describes someone who is unreasonably attached to a belief and intolerant of other opinions."
  },
  {
    search: "If you don't study hard, you might",
    correctAnswerIndex: 2,
    explanation: "To 'flunk' means to fail an examination or course. The context of not studying fits this meaning."
  },
  {
    search: "It is not polite to",
    correctAnswerIndex: 1,
    explanation: "To 'make fun of' someone means to mock or ridicule them, which fits the context of doing something impolite when they make a mistake."
  },
  {
    search: "she is always telling everyone how great she is",
    correctAnswerIndex: 1,
    explanation: "The word 'conceited' means excessively proud of oneself, matching the description of someone bragging about their greatness."
  },
  {
    search: "My sister and I never fight",
    correctAnswerIndex: 0,
    explanation: "A 'row' is a noisy or serious argument. Since they never fight, they never have a row."
  },
  {
    search: "Nurses need to be",
    correctAnswerIndex: 2,
    explanation: "Being 'compassionate' means feeling or showing sympathy and concern for others, an essential trait for nurses."
  },
  {
    search: "When the company closed down",
    correctAnswerIndex: 1,
    explanation: "To 'relocate' means to move to a new place and establish one's home or business there."
  },
  {
    search: "Don't worry about the problem; you just need to",
    correctAnswerIndex: 0,
    explanation: "To 'handle' a situation means to manage or deal with it."
  },
  {
    search: "whenever he gets a small cut, he acts like he is dying!",
    correctAnswerIndex: 1,
    explanation: "To 'blow things out of proportion' means to exaggerate the importance or severity of something."
  },
  {
    search: "person whose job is to look after a house",
    correctAnswerIndex: 1,
    explanation: "A 'housekeeper' is a person employed to manage a household."
  },
  {
    search: "borrowing my clothes without asking! It is so annoying.",
    correctAnswerIndex: 0,
    explanation: "We use 'is always + -ing' to describe an annoying habit in the present."
  },
  {
    search: "When we were children, we .................... go to the beach",
    correctAnswerIndex: 1,
    explanation: "'would + infinitive' is used to talk about repeated actions or habits in the past."
  },
  {
    search: "like vegetables when I was young",
    correctAnswerIndex: 0,
    explanation: "We use 'didn't use to' for past states that are no longer true. We cannot use 'wouldn't' for past states."
  },
  {
    search: "won the prize, was very happy.",
    correctAnswerIndex: 2,
    explanation: "'whose' is a relative pronoun used to show possession (the student's project)."
  },
  {
    search: "I bought last week is already broken.",
    correctAnswerIndex: 3,
    explanation: "'which' is used as a relative pronoun for things (the car)."
  },
  {
    search: "is a doctor, works at the city hospital.",
    correctAnswerIndex: 1,
    explanation: "In a non-defining relative clause about a person, we must use 'who' (not 'that')."
  },
  {
    search: "next to the door is my uncle.",
    correctAnswerIndex: 3,
    explanation: "This is a present participle clause ('standing next to the door') which replaces 'who is standing'."
  },
  {
    search: "by Charles Dickens is very famous.",
    correctAnswerIndex: 1,
    explanation: "This is a past participle clause ('written by') which replaces a passive relative clause ('which was written by')."
  },
  {
    search: "My friend is so predictable.",
    correctAnswerIndex: 0,
    explanation: "'will' can be used to describe typical or predictable behavior in the present."
  },
  {
    search: "Which sentence is grammatically correct?",
    correctAnswerIndex: 2,
    explanation: "We can say 'in which' or 'where', but not 'where... in'. 'The city in which I was born' is correct."
  },
  {
    search: "Which of the following statements expresses “an annoying habit in the past”?",
    correctAnswerIndex: 3,
    explanation: "'was constantly + -ing' expresses an annoying habit in the past."
  },
  {
    search: "has the function:",
    correctAnswerIndex: 3,
    explanation: "'would' is used for past habits and repeated actions, but unlike 'used to', it cannot be used for past states."
  },
  {
    search: "The flip phone, which was designed in the 1990s",
    correctAnswerIndex: 1,
    explanation: "The passive relative clause 'which was designed' is reduced to the past participle 'designed'."
  },
  {
    search: "There are very few people who are still using analogue televisions",
    correctAnswerIndex: 1,
    explanation: "The active relative clause 'who are still using' is reduced to the present participle 'using'."
  }
];

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 3 },
    include: { questions: true }
  });

  if (!exam) {
    console.error("Exam Unit 3 not found!");
    process.exit(1);
  }

  for (const q of exam.questions) {
    const updateDef = updates.find(u => q.question.includes(u.search));
    if (updateDef) {
      await prisma.grade11Question.update({
        where: { id: q.id },
        data: {
          question: updateDef.question || q.question,
          choices: updateDef.choices || q.choices,
          correctAnswerIndex: updateDef.correctAnswerIndex,
          explanation: updateDef.explanation
        }
      });
      console.log(`Updated question: ${updateDef.question || q.question}`);
    } else {
      console.log(`No match for: ${q.question}`);
    }
  }

  console.log("Finished updating Unit 3 questions.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
