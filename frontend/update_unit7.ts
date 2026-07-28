import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates: Record<string, any> = {
  "3f571b5d-6796-4114-8625-88d2a9bbcb75": {
    choices: ["flexible", "flexibility", "flexed", "flex"],
    correctAnswerIndex: 0,
    explanation: "The adverb 'highly' must be followed by an adjective. 'Flexible' is the adjective form describing the software."
  },
  "a4f77289-97b8-49de-99d5-d1954df4c3cd": {
    choices: ["anonymous", "integral", "industrious", "ill-equipped"],
    correctAnswerIndex: 0,
    explanation: "Anonymous means not identified by name, which fits the context of a donor not wanting their name linked."
  },
  "d6570d15-15b6-4008-80b6-e7310fcfb62b": {
    choices: ["productive", "production", "produce", "product"],
    correctAnswerIndex: 0,
    explanation: "The adverb 'highly' must be followed by an adjective. 'Productive' is the adjective form meaning producing good results."
  },
  "d57b9685-dda4-4389-813f-6120ba689e34": {
    choices: [
      "The manager said that he had to attend a crucial meeting then.",
      "The manager said that he has to attend a crucial meeting now.",
      "The manager said that he had to attend a crucial meeting now.",
      "The manager said that he would have to attend a crucial meeting then."
    ],
    correctAnswerIndex: 0,
    explanation: "When changing to reported speech, 'have to' becomes 'had to', and 'now' changes to 'then'."
  },
  "5bc4f0ba-f430-4bd5-a6d0-b4a253575253": {
    question: "Write down the sentence which states how much money Lisa raised during her 24-hour fund-raising activity.",
    choices: [
      "She even did a 24-hour fund-raising activity, bringing in $26,593, which allowed her to open Sister Pie in April, 2015.",
      "Through crowdfunding, she raised enough money to open her first shop.",
      "The 'Pie it Forward' system was an instant success in the neighborhood.",
      "She worked long hours to ensure every pie was perfect."
    ],
    correctAnswerIndex: 0,
    explanation: "This is a direct quote from the text: 'She even did a 24-hour fund-raising activity, bringing in $26,593...'"
  },
  "a2c54cab-34df-4822-a08c-deacf5084ca9": {
    choices: ["natural disasters", "homelessness", "environmental problems", "broken pipes"],
    correctAnswerIndex: 0,
    explanation: "Earthquakes and tsunamis are naturally occurring destructive events, so 'natural disasters' is the correct term."
  },
  "1829e669-4f31-4966-a5b7-ebcea1ae4975": {
    choices: [
      "Lisa took a business class, took on an intern and raised money for her own bakery.",
      "She started a crowdfunding campaign and opened a small bakery.",
      "She took out a large bank loan and hired experienced chefs.",
      "She partnered with a major food corporation and launched a franchise."
    ],
    correctAnswerIndex: 0,
    explanation: "The text states: 'Lisa took a business class, took on an intern and raised money for her own bakery...'"
  },
  "2dc0337b-cc28-4775-8dcd-8f4596cef35b": {
    choices: ["work opportunities", "health facilities", "environmental problems", "racism"],
    correctAnswerIndex: 0,
    explanation: "In the context of the job market and young graduates, 'work opportunities' is the most logical collocation."
  },
  "30ae1f28-f1d1-4b25-8109-04b7410f66d7": {
    choices: ["freedom", "free", "freely", "freed"],
    correctAnswerIndex: 0,
    explanation: "The verb 'achieved' requires a noun as its object. 'Freedom' is the noun form."
  },
  "2a0d51d0-3e9b-45ae-aee9-849923a3393a": {
    choices: ["government", "governing", "governmental", "governs"],
    correctAnswerIndex: 0,
    explanation: "The possessive 'country\\'s' must be followed by a noun. 'Government' is the noun form representing the ruling body."
  },
  "c5dd0498-0abd-4f5d-af2e-124699044d8b": {
    choices: ["over", "above", "set out", "tested"],
    correctAnswerIndex: 0,
    explanation: "When talking about an amount of money that is more than a certain figure, 'over' is commonly used (e.g., 'over $5,000')."
  },
  "5ab6bedf-984f-4a94-8649-593be6589947": {
    question: "In your opinion, why is it important for a business like Sister Pie to be \"part of the community\"?",
    choices: [
      "Giving back to the community builds loyalty and creates a positive impact.",
      "It is not important; businesses should only focus on maximizing profits.",
      "It is a good marketing strategy to attract more wealthy customers.",
      "It distracts the business from its core operations and reduces efficiency."
    ],
    correctAnswerIndex: 0,
    explanation: "Being part of the community, as shown by the 'Pie it Forward' system, helps people in need and builds strong local relationships."
  },
  "fe38f04a-c1d7-407f-aeb3-35e6c327c590": {
    choices: [
      "He said that he had finished his project.",
      "He said that he has finished his project.",
      "He said that he finished his project.",
      "He said that I had finished his project."
    ],
    correctAnswerIndex: 0,
    explanation: "In reported speech, the present perfect ('have finished') backshifts to the past perfect ('had finished'), and the pronoun 'I' changes to 'he'."
  },
  "a79e68a1-3914-4ea3-aba0-70501201dad9": {
    choices: [
      "Customers purchase a coupon kept on the wall to be used by strangers who don't have enough money.",
      "Customers received a free pie after buying ten slices.",
      "Customers donated pies to local schools and hospitals.",
      "Customers baked pies and brought them to the shop to share."
    ],
    correctAnswerIndex: 0,
    explanation: "The text explains: '...where customers can purchase a coupon. This is then kept on the wall and can be used by strangers...'"
  },
  "6629306d-046b-4474-9e5c-637915a63eaa": {
    choices: [
      "The teacher said that she would check my assignments the next day.",
      "The teacher said that she would check your assignments tomorrow.",
      "The teacher said that I will check my assignments the next day.",
      "The teacher said that she checked my assignments the next day."
    ],
    correctAnswerIndex: 0,
    explanation: "In reported speech, 'will' changes to 'would', 'tomorrow' changes to 'the next day', and 'your' changes to 'my' (or 'our')."
  },
  "cb982a7f-35d9-4020-8e20-db45a8717e69": {
    question: "Find a word in the text that means \"money paid to an employee for transacting a piece of business or performing a service.\"",
    choices: ["commission", "crowdfunding", "proceeds", "campaign"],
    correctAnswerIndex: 0,
    explanation: "In the text, the guides receive 'commission from sales', which matches the definition of money paid for performing a business service."
  },
  "80f9cd46-9aa8-4b51-abbc-5a91c4cef32b": {
    choices: ["proceeds", "commission", "foundation", "intern"],
    correctAnswerIndex: 0,
    explanation: "The word 'proceeds' refers to the money obtained from an event or activity."
  },
  "17440893-649b-4af4-aa35-178d052fa5f6": {
    choices: ["conclusion", "conclusive", "concludes", "conclude"],
    correctAnswerIndex: 0,
    explanation: "The adjective 'main' must be followed by a noun. 'Conclusion' is the noun form."
  },
  "e4ef4a66-7dd5-466c-91e1-fd1fa0d30b04": {
    choices: ["set out", "set up", "proved", "tested"],
    correctAnswerIndex: 0,
    explanation: "The phrasal verb 'set out' means to begin a journey or start an activity with a particular aim, fitting the context of starting to repair."
  },
  "e84e7700-e504-40c8-b517-07a7ac9d03d9": {
    choices: [
      "My friend said that he had finished reading the novel the day before.",
      "My friend said that he finished reading the novel the day before.",
      "My friend said that he had finished reading the novel yesterday.",
      "My friend said that he has finished reading the novel the day before."
    ],
    correctAnswerIndex: 0,
    explanation: "In reported speech, past simple ('finished') backshifts to past perfect ('had finished'), and 'yesterday' changes to 'the day before'."
  },
  "d706d1c0-7b84-4c4d-ba6b-5f0f0f5b4437": {
    choices: ["intern", "foundation", "commission", "proceeds"],
    correctAnswerIndex: 0,
    explanation: "An 'intern' is a student or trainee who works to gain experience, which perfectly matches the context."
  },
  "34249eb3-32f8-431e-ad4d-8ee921905732": {
    choices: ["clarify", "clarity", "clarified", "clear"],
    correctAnswerIndex: 0,
    explanation: "The infinitive marker 'to' should be followed by a base verb. 'Clarify' is the verb form meaning to make clear."
  },
  "30bd3a33-a526-4551-8755-972ab6ddd3f8": {
    choices: [
      "The book says that honesty is the best policy.",
      "The book says that honesty was the best policy.",
      "The book says that honesty would be the best policy.",
      "The book says that honesty has been the best policy."
    ],
    correctAnswerIndex: 0,
    explanation: "When the reporting verb is in the present tense ('says'), the tense in the reported clause does not change. Also, general truths don't change tense."
  },
  "b37c8f05-877c-431f-acea-1b2dd36e1b3d": {
    choices: ["ill-equipped", "integral", "industrious", "anonymous"],
    correctAnswerIndex: 0,
    explanation: "The adjective 'ill-equipped' means not having the necessary equipment or resources, matching the lack of safety equipment."
  },
  "36f41274-e45a-428b-99ee-41fb8844265e": {
    choices: ["commission", "foundation", "proceeds", "intern"],
    correctAnswerIndex: 0,
    explanation: "A 'commission' is a percentage of money paid to someone for their service."
  },
  "95b7fd13-e942-42bc-b6a4-4c4caf8cbb8b": {
    choices: [
      "The reaction to them was so positive that she kept going.",
      "The high profit margins and potential for expansion.",
      "The desire to become a famous pastry chef.",
      "The lack of competition in the area."
    ],
    correctAnswerIndex: 0,
    explanation: "The text states: 'The reaction to them was so positive that she kept going.'"
  },
  "bb35667a-c6a8-4c22-965a-9a197070dbd3": {
    choices: [
      "She said that the train had arrived ten minutes before.",
      "She said that the train arrived ten minutes before.",
      "She said that the train had arrived ten minutes ago.",
      "She said that the train arrives ten minutes before."
    ],
    correctAnswerIndex: 0,
    explanation: "In reported speech, past simple ('arrived') backshifts to past perfect ('had arrived'), and 'ago' changes to 'before'."
  },
  "b4f4c849-ffd9-457f-9243-7ca2b842b428": {
    choices: ["the guides", "customers", "pies", "ingredients"],
    correctAnswerIndex: 0,
    explanation: "In the text, 'They receive footwear and equipment' refers to the guides who are being helped by the Kili Summit Club."
  },
  "8d69c270-1629-4a0c-b704-abe936a1b5df": {
    choices: [
      "He said that he might come to the party, but told them not to wait for him.",
      "He said that he may come to the party and not to wait for him.",
      "He said that he might come to the party, but he asked them don't wait for him.",
      "He said that he might come to the party and told them not to wait for me."
    ],
    correctAnswerIndex: 0,
    explanation: "In reported speech, 'may' backshifts to 'might', 'don't wait' becomes 'not to wait', and pronouns 'I' and 'me' change to 'he' and 'him'."
  },
  "6a03ab7c-f872-40a4-9152-df241ff58cf0": {
    choices: [
      "My brother said that he had to submit that report immediately.",
      "My brother said that he must submit that report immediately.",
      "My brother said that he would submit this report immediately.",
      "My brother said that he had to submit this report at once."
    ],
    correctAnswerIndex: 0,
    explanation: "In reported speech, 'must' usually backshifts to 'had to', and 'this' changes to 'that'."
  }
};

async function updateDB() {
  for (const [id, data] of Object.entries(updates)) {
    await prisma.grade11Question.update({
      where: { id },
      data
    });
    console.log(`Updated question ${id}`);
  }
}

updateDB()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
