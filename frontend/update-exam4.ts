import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    id: "62645824-1f31-4a0c-8d7c-8c44196fa3cd",
    correctAnswerIndex: 2,
    explanation: "The sentence requires a noun after 'the'. 'Allegation' is the correct noun form."
  },
  {
    id: "a27054ee-797a-4884-bfc8-7ca7d1f5023c",
    correctAnswerIndex: 1,
    explanation: "The noun form of 'free' is required after the article 'the'. 'Freedom' is the correct noun."
  },
  {
    id: "3be22f52-bbe3-4d54-abd3-7886b06ed368",
    correctAnswerIndex: 0,
    explanation: "The adjective 'suitable' must be followed by a noun. 'Replacement' is the correct noun."
  },
  {
    id: "3baa3504-aceb-43e8-8e48-c78b46371beb",
    correctAnswerIndex: 0,
    explanation: "The text states: 'The developers have promised ... a replacement of the sad old beach restaurants'."
  },
  {
    id: "c2ab227d-54dd-4c79-ab0a-aca763042967",
    correctAnswerIndex: 1,
    explanation: "The phrase 'Little did he know' is a fixed expression with inversion, used to say that someone didn't know something at all."
  },
  {
    id: "7bb3adc0-8ab4-43b3-9f54-b239eb5f24de",
    correctAnswerIndex: 0,
    explanation: "The author expresses happiness about the development and says protesters are illegally obstructing it."
  },
  {
    id: "5877e6bc-7765-4218-b97d-eda4c6ef0c15",
    correctAnswerIndex: 2,
    explanation: "The word 'poignant' means evoking a keen sense of sadness or regret, which fits the context."
  },
  {
    id: "826460ef-322a-43db-9599-6f0d90975040",
    correctAnswerIndex: 0,
    explanation: "The past perfect continuous is used to show the cause of a past state ('was exhausted')."
  },
  {
    id: "1a2c5803-fdb2-4abf-9422-083a3a09e356",
    correctAnswerIndex: 1,
    explanation: "The collocation 'attention span' refers to the amount of time someone can concentrate on a task."
  },
  {
    id: "71d16cbf-fb44-4bc0-bca2-460ac376d131",
    correctAnswerIndex: 2,
    explanation: "We use the past simple 'broke' for a completed action in the past."
  },
  {
    id: "1b72f0e0-37d5-4287-af7f-97b11d2cbfda",
    correctAnswerIndex: 1,
    explanation: "A headline designed to shock rather than inform is described as 'sensational'."
  },
  {
    id: "cbd731a7-137a-4934-9b78-5f85acfdaca1",
    correctAnswerIndex: 0,
    explanation: "The context 'too expensive for us' implies the restaurant is 'upmarket' (appealing to wealthy consumers)."
  },
  {
    id: "a68eb549-566d-4132-8642-403799b29f3c",
    correctAnswerIndex: 0,
    explanation: "An accusation is a claim that someone has done something wrong or illegal."
  },
  {
    id: "ba24ea5f-8e7a-4968-9f03-93c3ffd48c31",
    correctAnswerIndex: 1,
    explanation: "The past perfect 'had stolen' is used for an action that happened before another past action ('arrived')."
  },
  {
    id: "f6b535b9-e410-47d7-b09b-fad1f170c591",
    correctAnswerIndex: 0,
    explanation: "The text states the developers promised 'a new road with wide pavements'."
  },
  {
    id: "02a3d6d6-3180-4ce9-97e1-cf858fde182c",
    correctAnswerIndex: 0,
    explanation: "The structure 'Scarcely had + subject + past participle ... when ...' is used for events that happen one right after another."
  },
  {
    id: "2720e50b-61fb-449f-b1c5-eb9f7391c7e8",
    correctAnswerIndex: 1,
    explanation: "To 'expose corruption' means to reveal illegal or dishonest behavior."
  },
  {
    id: "429ea725-7d07-4ef8-9307-28d4bc102bdf",
    correctAnswerIndex: 0,
    explanation: "The past perfect continuous describes an ongoing action that occurred before another past action."
  },
  {
    id: "ced3deea-6052-4406-b583-115b31177b5b",
    correctAnswerIndex: 0,
    explanation: "The phrase 'seize the opportunity' means to take advantage of a chance quickly."
  },
  {
    id: "5322f041-4f45-46dc-8728-8ab3df1c0daf",
    correctAnswerIndex: 2,
    explanation: "The past perfect continuous is used to emphasize the duration of an activity before another past event."
  },
  {
    id: "2023c57c-e9ed-4fea-aa77-a58455558e99",
    correctAnswerIndex: 0,
    explanation: "In the sentence, 'they' refers to the developers who released the statement."
  },
  {
    id: "c0d1e958-68a6-400b-8f18-c6f80cb306a5",
    correctAnswerIndex: 0,
    explanation: "Negative adverbial phrases like 'Under no circumstances' require subject-auxiliary inversion ('should you leave')."
  },
  {
    id: "c77f0a86-3cf1-4256-b46c-5e4518ed2da6",
    correctAnswerIndex: 0,
    explanation: "The author explicitly states they reported the incident because the activists tried to stop lorries, which was illegal obstruction."
  },
  {
    id: "145615de-56e7-4fc2-a081-7dc1f5620e18",
    correctAnswerIndex: 0,
    explanation: "Journalists must 'verify sources' to make sure the information they publish is true."
  },
  {
    id: "ddb8fff2-7b32-4e23-ab0a-ff872535c028",
    correctAnswerIndex: 1,
    explanation: "When 'Not only' is used at the beginning of a sentence, it requires inversion ('did she win')."
  },
  {
    id: "030085ce-adeb-446e-ad0e-e86de8dd2af3",
    correctAnswerIndex: 1,
    explanation: "After the adjective 'significant', a noun is required. 'Improvement' is the correct noun."
  },
  {
    id: "8c91343d-5de5-440c-a1cd-3ec9deee7b2f",
    correctAnswerIndex: 0,
    explanation: "The word 'Scarcely' pairs with 'when' to mean that one thing happened almost immediately after another."
  }
];

async function main() {
  let updatedCount = 0;
  for (const update of updates) {
    try {
      await prisma.grade11Question.update({
        where: { id: update.id },
        data: {
          correctAnswerIndex: update.correctAnswerIndex,
          explanation: update.explanation
        }
      });
      updatedCount++;
      console.log(`Updated question ${update.id}`);
    } catch (e) {
      console.error(`Failed to update question ${update.id}`, e);
    }
  }
  console.log(`Successfully updated ${updatedCount} questions.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
