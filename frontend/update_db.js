const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  {
    id: "57255561-1f95-48d7-b676-258e33cd2d2c",
    correctAnswerIndex: 2,
    explanation: "To flunk means to fail an exam or course."
  },
  {
    id: "124675ff-b749-4632-b3fe-c485b9e7744b",
    correctAnswerIndex: 1,
    explanation: "To blow things out of proportion means to exaggerate a problem."
  },
  {
    id: "7c3fca00-478e-43da-89ae-81fd36bd9c6c",
    correctAnswerIndex: 2,
    explanation: "'in which' replaces 'where' correctly. You don't use 'where' and 'in' together in this way."
  },
  {
    id: "d694e431-059a-4da9-91e5-8a521908be62",
    correctAnswerIndex: 0,
    explanation: "A 'row' means a noisy argument or fight."
  },
  {
    id: "7ffb94be-f2da-416c-bfe6-4832ec0175ea",
    correctAnswerIndex: 0,
    explanation: "A bigoted person is obstinately or unreasonably attached to a belief, opinion, or faction."
  },
  {
    id: "fdda553d-b67e-4eaa-96eb-b0ce8ba134ae",
    correctAnswerIndex: 0,
    explanation: "'didn't use to' is used for past states or habits that are no longer true."
  },
  {
    id: "6fbfc211-f384-49be-8455-168f2a22c189",
    correctAnswerIndex: 1,
    explanation: "To make fun of someone means to mock or laugh at them."
  },
  {
    id: "8177dc98-1e25-4a7b-9806-07617597d70a",
    correctAnswerIndex: 2,
    explanation: "Compassionate means feeling or showing sympathy and concern for others."
  },
  {
    id: "599c41c2-f2ec-4c7f-875e-0bfdc8a905fe",
    correctAnswerIndex: 0,
    explanation: "'Will' is used to express predictable behavior or habits."
  },
  {
    id: "a5697d7c-58f4-47ad-b5c0-fb4edd851d1f",
    choices: [
      "They had to work long hours and were often beaten.",
      "They somehow managed a subsistence, living day-to-day, huddled together to keep warm.",
      "They were given plenty of food but no warm clothes.",
      "They had a sense of belonging at the house and looked after each other."
    ],
    correctAnswerIndex: 1,
    explanation: "The text says 'people somehow managed a subsistence, living day-to-day, huddled together to keep warm.'"
  },
  {
    id: "82f8d9ba-b5ba-4731-8983-9bbfc9eea2b2",
    correctAnswerIndex: 1,
    explanation: "To relocate means to move to a new place and establish one's home or business there."
  },
  {
    id: "5ab1a9f8-b0d7-4305-88ad-545903f4e47a",
    correctAnswerIndex: 1,
    explanation: "The past participle 'designed' replaces the passive relative clause 'which was designed'."
  },
  {
    id: "90f924d5-836f-419e-8dd3-c58e86c9f833",
    correctAnswerIndex: 1,
    explanation: "Conceited means excessively proud of oneself; vain."
  },
  {
    id: "754addef-1e63-4230-bed0-33f020c96dbc",
    correctAnswerIndex: 1,
    explanation: "'Would' is used to describe repeated actions or habits in the past."
  },
  {
    id: "66f6a368-f576-4896-b70e-5efb72e20348",
    correctAnswerIndex: 3,
    explanation: "'Would' can be used for past habits or repeated actions, but unlike 'used to', it cannot be used for past states."
  },
  {
    id: "f2ae1650-adf3-4069-bb65-46f75353ad64",
    correctAnswerIndex: 0,
    explanation: "The present continuous with 'always' is used to express an annoying habit."
  },
  {
    id: "380b1a19-1c8c-4472-a6b5-0d5a8a8dd084",
    correctAnswerIndex: 3,
    explanation: "The past continuous with 'constantly' or 'always' expresses an annoying habit in the past."
  },
  {
    id: "6b893e6c-d541-4f0f-a268-38b666b676e2",
    choices: ["subsistence", "make ends meet", "huddled", "malnourished"],
    correctAnswerIndex: 1,
    explanation: "The text mentions 'to make ends meet', which means to have just enough money to pay for the things that you need."
  },
  {
    id: "4919dfd3-df81-43f9-9b4b-4168cc8333d7",
    correctAnswerIndex: 1,
    explanation: "A housekeeper is a person employed to manage a household."
  },
  {
    id: "529f8591-c57f-4b6f-b93c-5a1758bd345d",
    choices: ["To run away from the workhouse.", "To beg for more food.", "To steal from the managers.", "To refuse to work."],
    correctAnswerIndex: 1,
    explanation: "The text states 'they encouraged Oliver to beg for more food, but this made the managers of the workhouse angry.'"
  },
  {
    id: "c7625df6-9c7c-465a-91b3-df1b2837d839",
    correctAnswerIndex: 0,
    explanation: "'Handle' means to deal with a situation or problem."
  },
  {
    id: "6b95f93d-9635-4ddf-a3e5-5e6a1e555871",
    correctAnswerIndex: 3,
    explanation: "The present participle 'standing' is used to reduce the relative clause 'who is standing'."
  },
  {
    id: "9906a65e-8d65-4677-87c5-9d2c60ed5928",
    choices: ["Fagin", "Mr Brownlow", "Jack Dawkins", "Monks"],
    correctAnswerIndex: 2,
    explanation: "The text says 'he met another boy called Jack Dawkins. He showed Oliver the way to the city.'"
  },
  {
    id: "6abd964f-7108-4150-91a2-a0220e46ef8c",
    correctAnswerIndex: 3,
    explanation: "'Which' is a relative pronoun used for things."
  },
  {
    id: "c176e5d5-110c-467c-956e-9bb482d5e866",
    correctAnswerIndex: 2,
    explanation: "'Whose' is a relative pronoun indicating possession."
  },
  {
    id: "95d89ad1-03ed-450b-af79-d60a218ed8c2",
    correctAnswerIndex: 1,
    explanation: "'Who' is the correct relative pronoun for a person. We don't use 'that' in a non-defining relative clause."
  },
  {
    id: "d24bbf22-7e6c-4431-a54e-fde78e201bd8",
    choices: ["Jack Dawkins and Fagin", "Mr Brownlow and the police officer", "The managers and the housekeeper", "Mr Sikes and the police officer"],
    correctAnswerIndex: 0,
    explanation: "The text says 'he watched Oliver and made sure that he met Jack Dawkins, and then Fagin.'"
  },
  {
    id: "84e40e89-89b7-4c42-9d53-923c9fdd4db7",
    correctAnswerIndex: 1,
    explanation: "The past participle 'written' is used to reduce the passive relative clause 'which was written'."
  },
  {
    id: "5e12b4bb-ca5d-43a4-a2ab-d9509cd2e357",
    correctAnswerIndex: 1,
    explanation: "The present participle 'using' replaces 'who are still using'."
  },
  {
    id: "ee06024c-f5e2-48b6-a7a8-ccb4e3fde644",
    choices: ["Provide them with quality education and safe housing.", "Ignore them and let them fend for themselves.", "Send them to work in factories at a young age.", "Encourage them to join gangs for protection."],
    correctAnswerIndex: 0,
    explanation: "Providing education and a safe environment addresses the root causes of vulnerability and prevents orphans from turning to crime."
  },
  {
    id: "cea2aaf6-4f18-4850-b6d2-5f6eb0b7c607",
    choices: ["The boys gathered together to give the old man watches and jewellery.", "Oliver was shocked when he saw the boys take things from people’s pockets.", "Fagin then told Oliver to go into the streets with the other boys and learn from them.", "He understood that they were thieves!"],
    correctAnswerIndex: 1,
    explanation: "This sentence describes the exact moment Oliver witnessed their criminal acts and realized what they were doing."
  },
  {
    id: "e989e315-ec26-49e7-8c2e-57dbd4969098",
    choices: ["Because Oliver was crying loudly.", "Because Mr Brownlow saw that Oliver had not taken anything.", "Because Mr Brownlow knew Oliver's mother.", "Because Oliver was friends with Jack Dawkins."],
    correctAnswerIndex: 1,
    explanation: "The text states 'a man, Mr Brownlow, told the police officer that Oliver had not taken anything.'"
  }
];

async function main() {
  for (const update of updates) {
    const data = {
      correctAnswerIndex: update.correctAnswerIndex,
      explanation: update.explanation
    };
    if (update.choices) {
      data.choices = update.choices;
    }
    await prisma.grade11Question.update({
      where: { id: update.id },
      data
    });
  }
  console.log("Updated all questions successfully.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
