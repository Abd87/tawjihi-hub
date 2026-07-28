import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = {
  "ee258f77-71ab-4405-ac57-fe5d4c91798a": {
    correctAnswerIndex: 1,
    explanation: "We use the Future Continuous (will be sleeping) to describe an action that will be in progress at a specific time in the future."
  },
  "3867582e-aad0-4204-aa87-f9de9a1bee14": {
    correctAnswerIndex: 0,
    explanation: "The word 'slimy' means covered in a thick, slippery liquid, which is often unpleasant to touch. (Found in paragraph B)"
  },
  "be5a08fa-94bd-481f-a3f8-ad279dc6f1de": {
    correctAnswerIndex: 0,
    explanation: "We use the Future Perfect (will have died) to talk about an action that will be completed before a certain time in the future (by lunchtime)."
  },
  "c7dbb108-a855-4f07-a3f1-98683be72984": {
    correctAnswerIndex: 3,
    explanation: "An 'omen' is a sign of what is going to happen in the future. The aye aye is seen as a sign of bad luck."
  },
  "9b203723-e3a8-4bdc-8b92-f9ab6b5ee49a": {
    correctAnswerIndex: 2,
    explanation: "A 'fin' is a flattened appendage on various marine animals used for propelling, steering, and balancing. Sharks have a prominent dorsal fin."
  },
  "d6af1017-7137-437f-855c-3a886ae39f33": {
    correctAnswerIndex: 0,
    explanation: "According to paragraph C, pangolin scales are highly prized in traditional Chinese medicine, which makes them a major target for poachers."
  },
  "1fb2076a-d89f-48e9-8207-a8638baf543f": {
    correctAnswerIndex: 0,
    explanation: "Paragraph A states that less well-known creatures don't get enough attention from researchers, resulting in a tiny percentage of available money going to their protection."
  },
  "7852088f-a546-4616-8714-2d66900fc2d9": {
    correctAnswerIndex: 0,
    explanation: "The word 'solitary' means living alone, matching the description of a shy animal that prefers to live and hunt alone."
  },
  "0ae19613-584a-4eb1-9afc-cef1ff0c76eb": {
    correctAnswerIndex: 3,
    explanation: "'Believe' is a stative verb and cannot be used in continuous tenses. The correct future form is the simple future 'will believe'."
  },
  "0d5ad3b6-5f55-4281-b0ed-8cbe86132b32": {
    correctAnswerIndex: 0,
    explanation: "The pronoun 'it' refers back to 'the blobfish', which is the subject of the previous sentence."
  },
  "68ffdaee-3f86-43c6-8571-f608665e814f": {
    correctAnswerIndex: 1,
    choices: [
      "will have spent",
      "are going to spend",
      "spend",
      "will have been spending"
    ],
    explanation: "We use 'are going to' to talk about future plans and intentions. 'are going to spend' fits perfectly here."
  },
  "2dada780-b820-4487-87b0-ebc5ce40876c": {
    correctAnswerIndex: 2,
    explanation: "We use the Present Simple (does / start) to talk about scheduled future events like timetables, matches, or transportation."
  },
  "e6caf682-4039-46f8-aa8b-27bd014efd03": {
    correctAnswerIndex: 0,
    explanation: "We use the Future Perfect (will have gone) because the action of going to bed will be completed before the specified future time (when you come back home)."
  },
  "1c7f96ec-bb26-489f-a4bb-add8b8478ef2": {
    question: "80 percent of the energy we consume is provided by________ , which pollute the atmosphere",
    correctAnswerIndex: 1,
    explanation: "Fossil fuels (like coal and oil) are burned for energy and are a major source of atmospheric pollution."
  },
  "53250427-16af-4d47-8249-59944f507aa4": {
    correctAnswerIndex: 3,
    explanation: "The adjective 'gale-force' is used specifically to describe very strong winds."
  },
  "8f720335-96cf-4b35-848c-fb366869aac8": {
    correctAnswerIndex: 3,
    explanation: "'Unlikely to' means that something probably will not happen, which has the same meaning as 'probably won't'."
  },
  "7c4ebc63-f2ef-4ea1-9999-09f0ddb7c04c": {
    correctAnswerIndex: 2,
    choices: [
      "furry",
      "crustacean",
      "invertebrates",
      "slimy"
    ],
    explanation: "Invertebrates are animals that lack a vertebral column, or backbone, such as insects, spiders, and worms."
  },
  "fb7f6c5a-ab19-457a-aa5e-622939003483": {
    correctAnswerIndex: 1,
    explanation: "The word 'window' has a short 'i' sound (/ɪ/), exactly like the word 'big'. The other options have a long 'e' sound (/i:/)."
  },
  "3578a002-6417-435f-9fbc-afefc1f2218f": {
    correctAnswerIndex: 0,
    explanation: "We use 'are going to' for predictions based on present evidence ('According to these statistics')."
  },
  "73a47bf0-6e09-489e-b3c8-a6aea2e1eab4": {
    correctAnswerIndex: 2,
    explanation: "We use the Future Perfect Continuous (will have been waiting) to show the duration of an action up to a certain point in the future (by the time we reach the entrance)."
  },
  "bf445cfd-6985-489d-889d-d295eefa45c6": {
    correctAnswerIndex: 3,
    explanation: "'Are planning to' expresses an intention or arrangement, which can be rephrased using 'are going to'."
  },
  "fe9b9527-0f3b-4aeb-b80e-681463deebaa": {
    correctAnswerIndex: 1,
    explanation: "A crustacean is a type of animal (like a crab or lobster) that has a hard exoskeleton and jointed legs, typically living in water."
  },
  "b0c02795-b543-4459-9a7e-d58191b67250": {
    correctAnswerIndex: 1,
    explanation: "A poacher is someone who catches or kills animals illegally."
  },
  "dfc78c29-673a-4bab-9405-e270bf2222bd": {
    correctAnswerIndex: 3,
    explanation: "Exhaust fumes are the dangerous gases produced by the engines of vehicles."
  },
  "173bd523-ffc3-4549-af12-7f1d4d5ee307": {
    correctAnswerIndex: 2,
    explanation: "Nocturnal animals are active at night and sleep during the day."
  },
  "e637a195-64e2-4a0e-89e4-667da504fb89": {
    correctAnswerIndex: 0,
    explanation: "Paragraph A states that the popularity of the giant panda enables organisations like the WWF to raise money to support a range of critically endangered species."
  },
  "ce7797b6-bd24-4580-9787-833eff267de3": {
    correctAnswerIndex: 0,
    explanation: "Paragraph B explicitly states that to survive high water pressure, the blobfish has 'tiny fins and no skeleton'."
  },
  "2b9984b4-c88e-4652-a5e2-465dd22eca76": {
    correctAnswerIndex: 0,
    explanation: "This is a critical thinking question. Spreading awareness and education are effective and ethical ways to encourage people to care about all endangered species, regardless of their appearance."
  }
};

async function main() {
  for (const [id, data] of Object.entries(updates)) {
    await prisma.grade11Question.update({
      where: { id },
      data: data
    });
    console.log(`Updated question ${id}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
