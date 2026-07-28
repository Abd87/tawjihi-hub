const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  // Reading Comprehension
  {
    questionMatches: "Read the following text then answer the questions below",
    choices: [
      "She started a crowdfunding campaign and opened a small bakery.",
      "She took out a large bank loan and hired experienced chefs.",
      "She partnered with a major food corporation and launched a franchise.",
      "She sold her recipes to a publishing company and wrote a cookbook."
    ],
    correctAnswerIndex: 0,
    explanation: "The text states that Lisa raised money through a 24-hour fund-raising activity to open her bakery, which is a form of crowdfunding."
  },
  {
    questionMatches: "two main steps Lisa Ludwinski took",
    choices: [
      "She took a business class and raised money through a fund-raising activity.",
      "She applied for a bank loan and rented a commercial kitchen.",
      "She moved to a new city and started a blog.",
      "She sold her family recipes and hired a manager."
    ],
    correctAnswerIndex: 0,
    explanation: "According to the passage, Lisa took a business class, took on an intern, and raised money via a 24-hour fund-raising activity."
  },
  {
    questionMatches: "Pie it Forward",
    choices: [
      "Customers can purchase a coupon for strangers who may not have enough money to buy a slice of pie.",
      "Customers receive a free pie after buying ten slices.",
      "Customers donated pies to local schools and hospitals.",
      "Customers baked pies and brought them to the shop to share."
    ],
    correctAnswerIndex: 0,
    explanation: "The text states that the 'Pie it Forward' system allows customers to purchase a coupon that is kept on the wall for strangers without enough money to use."
  },
  {
    questionMatches: "sentence which states how much money Lisa raised",
    choices: [
      "\"She even did a 24-hour fund-raising activity, bringing in $26,593, which allowed her to open Sister Pie in April, 2015.\"",
      "\"In the Autumn of 2012, Lisa Ludwinski started her business from her parents’ kitchen when she made and sold 40 pies.\"",
      "\"Due to this, she operates a ‘Pie it Forward’ system where customers can purchase a coupon.\"",
      "\"What followed was an industrious few years.\""
    ],
    correctAnswerIndex: 0,
    explanation: "This specific sentence explicitly mentions the exact amount of money she raised ($26,593) during her fund-raising activity."
  },
  {
    questionMatches: "What made Lisa decide to continue",
    choices: [
      "The positive reaction and support from the local community after selling her first 40 pies.",
      "The high profit margins and potential for expansion.",
      "The desire to become a famous pastry chef.",
      "The lack of competition in the area."
    ],
    correctAnswerIndex: 0,
    explanation: "The passage notes that 'The reaction to them was so positive that she kept going' after she initially sold 40 pies."
  },
  {
    questionMatches: "underlined pronoun \"They\" refer to",
    choices: [
      "the guides",
      "the climbers",
      "the customers",
      "the pies"
    ],
    correctAnswerIndex: 0,
    explanation: "In the text 'They receive footwear and equipment', 'They' refers to the guides who are being helped by the Kili Summit Club."
  },
  {
    questionMatches: "money paid to an employee for transacting",
    choices: [
      "commission",
      "proceeds",
      "intern",
      "anonymous"
    ],
    correctAnswerIndex: 0,
    explanation: "A 'commission' is a fee or percentage of sales paid to a salesperson or agent for their services."
  },
  {
    questionMatches: "why is it important for a business like Sister Pie to be \"part of the community\"",
    choices: [
      "Giving back to the community builds loyalty, helps those in need, and creates a positive social impact.",
      "It is not important; businesses should only focus on maximizing profits.",
      "It is a good marketing strategy to attract more wealthy customers.",
      "It distracts the business from its core operations and reduces efficiency."
    ],
    correctAnswerIndex: 0,
    explanation: "Being part of the community, like with the 'Pie it Forward' system, creates a supportive environment and helps those in need, which reflects a socially responsible business philosophy."
  },

  // Vocabulary
  {
    questionMatches: "money raised from the bake sale, the ________",
    choices: [
      "proceeds",
      "commission",
      "foundation",
      "intern"
    ],
    correctAnswerIndex: 0,
    explanation: "The word 'proceeds' means the money obtained from an event or activity, such as a bake sale."
  },
  {
    questionMatches: "working as an ____________ at the tech company",
    choices: [
      "intern",
      "commission",
      "proceeds",
      "foundation"
    ],
    correctAnswerIndex: 0,
    explanation: "An 'intern' is a student or trainee who works, sometimes without pay, in order to gain work experience in a particular field."
  },
  {
    questionMatches: "factory was so ____________ that it did not have the necessary safety equipment",
    choices: [
      "ill-equipped",
      "integral",
      "industrious",
      "anonymous"
    ],
    correctAnswerIndex: 0,
    explanation: "'Ill-equipped' means not having the necessary resources, equipment, or skills for a particular purpose."
  },
  {
    questionMatches: "received a 5% ____________ on the total cost",
    choices: [
      "commission",
      "foundation",
      "proceeds",
      "intern"
    ],
    correctAnswerIndex: 0,
    explanation: "A 'commission' is a payment made to an employee or agent based on a percentage of the total sales or project cost."
  },
  {
    questionMatches: "generous donor wished to remain ____________",
    choices: [
      "anonymous",
      "integral",
      "industrious",
      "ill-equipped"
    ],
    correctAnswerIndex: 0,
    explanation: "'Anonymous' means (of a person) not identified by name; of unknown name."
  },
  {
    questionMatches: "repair the broken dam after the heavy rains.",
    choices: [
      "set out",
      "set up",
      "proved",
      "tested"
    ],
    correctAnswerIndex: 0,
    explanation: "To 'set out' means to begin a journey or a task with a particular aim in mind."
  },
  {
    questionMatches: "$5,000 in revenue this quarter",
    choices: [
      "over",
      "above",
      "set out",
      "tested"
    ],
    correctAnswerIndex: 0,
    explanation: "The preposition 'over' is used to indicate a quantity greater than a specified amount, so 'over $5,000'."
  },
  {
    questionMatches: "achieved _________ from the strict rules",
    choices: [
      "freedom",
      "free",
      "freely",
      "freed"
    ],
    correctAnswerIndex: 0,
    explanation: "The noun form 'freedom' is required here to function as the object of the verb 'achieved'."
  },
  {
    questionMatches: "responsible for creating and enforcing laws.",
    choices: [
      "government",
      "governing",
      "governmental",
      "governs"
    ],
    correctAnswerIndex: 0,
    explanation: "The noun 'government' is needed here as the subject representing the institution."
  },
  {
    questionMatches: "we need to _________ how decisions are made",
    choices: [
      "clarify",
      "clarity",
      "clarified",
      "clear"
    ],
    correctAnswerIndex: 0,
    explanation: "The infinitive verb 'clarify' is required after 'need to' to mean 'to make something easier to understand'."
  },
  {
    questionMatches: "The main _________ of the presentation was",
    choices: [
      "conclusion",
      "conclusive",
      "concludes",
      "conclude"
    ],
    correctAnswerIndex: 0,
    explanation: "The noun 'conclusion' is required here, referring to the final summary or point."
  },
  {
    questionMatches: "highly _________ and can be easily adapted",
    choices: [
      "flexible",
      "flex",
      "flexibility",
      "flexed"
    ],
    correctAnswerIndex: 0,
    explanation: "The adjective 'flexible' is used to describe something that can be easily modified or adapted."
  },
  {
    questionMatches: "project was highly _________ , resulting in a large profit",
    choices: [
      "productive",
      "product",
      "production",
      "produce"
    ],
    correctAnswerIndex: 0,
    explanation: "The adjective 'productive' is needed to describe the project as yielding good or profitable results."
  },
  {
    questionMatches: "especially for young graduates entering the job market",
    choices: [
      "work opportunities",
      "health facilities",
      "environmental problems",
      "racism"
    ],
    correctAnswerIndex: 0,
    explanation: "'Work opportunities' fits the context of young graduates looking for employment."
  },
  {
    questionMatches: "massive earthquake and tsunami are examples of",
    choices: [
      "natural disasters",
      "homelessness",
      "environmental problems",
      "broken pipes"
    ],
    correctAnswerIndex: 0,
    explanation: "Earthquakes and tsunamis are classic examples of 'natural disasters'."
  },

  // Grammar
  {
    questionMatches: "The teacher said, \"I will check your assignments tomorrow.\"",
    choices: [
      "The teacher said that she would check our assignments the next day.",
      "The teacher said that she would check my assignments the next day.",
      "The teacher said that I will check my assignments the next day.",
      "The teacher said that she checked my assignments the next day."
    ],
    correctAnswerIndex: 0,
    explanation: "In reported speech, 'will' changes to 'would', 'tomorrow' changes to 'the next day', and pronouns are adjusted based on context (your -> our/my)."
  },
  {
    questionMatches: "He said, \"I have finished my project.\"",
    choices: [
      "He said that he had finished his project.",
      "He said that he has finished his project.",
      "He said that he finished his project.",
      "He said that I had finished his project."
    ],
    correctAnswerIndex: 0,
    explanation: "The present perfect 'have finished' shifts back a tense to the past perfect 'had finished' in reported speech."
  },
  {
    questionMatches: "She said, \"The train arrived ten minutes ago.\"",
    choices: [
      "She said that the train had arrived ten minutes before.",
      "She said that the train arrived ten minutes before.",
      "She said that the train had arrived ten minutes ago.",
      "She said that the train arrives ten minutes before."
    ],
    correctAnswerIndex: 0,
    explanation: "The past simple 'arrived' changes to past perfect 'had arrived', and 'ago' changes to 'before'."
  },
  {
    questionMatches: "The book says, \"Honesty is the best policy.\"",
    choices: [
      "The book says that honesty is the best policy.",
      "The book says that honesty was the best policy.",
      "The book says that honesty would be the best policy.",
      "The book says that honesty has been the best policy."
    ],
    correctAnswerIndex: 0,
    explanation: "When the reporting verb is in the present tense ('says'), or when reporting a general truth or proverb, the tense inside the quotes does not change."
  },
  {
    questionMatches: "He said, \"I may come to the party, but don't wait for me.\"",
    choices: [
      "He said that he might come to the party, but told them not to wait for him.",
      "He said that he may come to the party and not to wait for him.",
      "He said that he might come to the party, but he asked them don't wait for him.",
      "He said that he might come to the party and told them not to wait for me."
    ],
    correctAnswerIndex: 0,
    explanation: "The modal 'may' changes to 'might', and the imperative \"don't wait\" becomes the infinitive phrase \"not to wait\"."
  },
  {
    questionMatches: "My brother said, \"I must submit this report immediately.\"",
    choices: [
      "My brother said that he had to submit that report immediately.",
      "My brother said that he must submit that report immediately.",
      "My brother said that he would submit this report immediately.",
      "My brother said that he had to submit this report at once."
    ],
    correctAnswerIndex: 0,
    explanation: "In reported speech, 'must' (indicating obligation) usually changes to 'had to', and 'this' changes to 'that'."
  },
  {
    questionMatches: "The manager said, \"I have to attend a crucial meeting now.\"",
    choices: [
      "The manager said that he had to attend a crucial meeting then.",
      "The manager said that he has to attend a crucial meeting now.",
      "The manager said that he had to attend a crucial meeting now.",
      "The manager said that he would have to attend a crucial meeting then."
    ],
    correctAnswerIndex: 0,
    explanation: "'Have to' changes to 'had to', and 'now' changes to 'then' in reported speech."
  },
  {
    questionMatches: "My friend said, \"I finished reading the novel yesterday.\"",
    choices: [
      "My friend said that he had finished reading the novel the day before.",
      "My friend said that he finished reading the novel the day before.",
      "My friend said that he had finished reading the novel yesterday.",
      "My friend said that he has finished reading the novel the day before."
    ],
    correctAnswerIndex: 0,
    explanation: "The past simple 'finished' changes to past perfect 'had finished', and 'yesterday' changes to 'the day before' or 'the previous day'."
  }
];

async function updateUnit7Questions() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 7 },
    include: { questions: true }
  });

  if (!exam) {
    console.error("Exam for Unit 7 not found in DB.");
    return;
  }

  console.log(`Found exam with ${exam.questions.length} questions.`);

  let updatedCount = 0;

  for (const q of exam.questions) {
    const match = updates.find(u => q.question.includes(u.questionMatches));
    if (match) {
      await prisma.grade11Question.update({
        where: { id: q.id },
        data: {
          choices: match.choices,
          correctAnswerIndex: match.correctAnswerIndex,
          explanation: match.explanation
        }
      });
      updatedCount++;
    } else {
      console.warn(`No match found for question: ${q.question.substring(0, 50)}...`);
    }
  }

  console.log(`Successfully updated ${updatedCount} questions for Unit 7.`);
}

updateUnit7Questions()
  .catch(e => {
    console.error("Error updating DB:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
