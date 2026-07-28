const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  {
    id: "ee258f77-71ab-4405-ac57-fe5d4c91798a",
    choices: ["will have slept", "will be sleeping", "had slept", "is going to sleep"],
    correctAnswerIndex: 1,
    explanation: "Use the future continuous tense ('will be sleeping') to describe an action that will be in progress at a specific time in the future."
  },
  {
    id: "3867582e-aad0-4204-aa87-f9de9a1bee14",
    choices: ["slimy", "cuddly", "attractive", "ugly"],
    correctAnswerIndex: 0,
    explanation: "In the passage, 'slimy' refers to something covered in a thick, wet liquid that is unpleasant to touch, like the blobfish."
  },
  {
    id: "be5a08fa-94bd-481f-a3f8-ad279dc6f1de",
    choices: ["will have died", "is going to die", "will be dying", "will been dying"],
    correctAnswerIndex: 0,
    explanation: "The future perfect tense ('will have died') is used to describe an action that will be completed before a certain time in the future (by lunchtime)."
  },
  {
    id: "c7dbb108-a855-4f07-a3f1-98683be72984",
    choices: ["nocturnal", "slimy", "cuddly", "omen"],
    correctAnswerIndex: 3,
    explanation: "An 'omen' is a sign of what is going to happen in the future. In many cultures, certain animals are considered omens of bad luck."
  },
  {
    id: "9b203723-e3a8-4bdc-8b92-f9ab6b5ee49a",
    choices: ["invertebrates", "scales", "fin", "skeleton"],
    correctAnswerIndex: 2,
    explanation: "A 'fin' is a thin, flat part that sticks out from the body of a fish or shark, often visible above the water."
  },
  {
    id: "d6af1017-7137-437f-855c-3a886ae39f33",
    choices: ["these scales are highly prized in traditional Chinese medicine", "they are the world's largest nocturnal primate", "they are considered an omen of bad luck", "they get swept into the nets accidentally"],
    correctAnswerIndex: 0,
    explanation: "According to paragraph C, pangolins are targeted by poachers because their scales are highly prized in traditional Chinese medicine."
  },
  {
    id: "1fb2076a-d89f-48e9-8207-a8638baf543f",
    choices: ["because they don't get enough attention from researchers.", "because they are far from attractive and have slimy bodies.", "because they live deep in the ocean where pressure is very high.", "because they are considered an omen of bad luck by local people."],
    correctAnswerIndex: 0,
    explanation: "Paragraph A states that less well-known or 'exciting' creatures don't get enough attention from researchers, which is why they receive a tiny percentage of protection money."
  },
  {
    id: "7852088f-a546-4616-8714-2d66900fc2d9",
    choices: ["They are solitary creatures, furry, and harmless but unfortunately, they are often killed.", "Found only on the island of Madagascar, the aye aye is the world's largest nocturnal primate.", "During the day they sleep in nests in the trees, coming out to hunt at night.", "Other creatures become endangered precisely because people find them ugly."],
    correctAnswerIndex: 0,
    explanation: "The word 'solitary' in the sentence indicates that the aye-aye prefers to live and hunt alone."
  },
  {
    id: "0ae19613-584a-4eb1-9afc-cef1ff0c76eb",
    choices: ["will be believing", "’ll have been believing", "believes", "will believe"],
    correctAnswerIndex: 3,
    explanation: "'Believe' is a stative verb and is generally not used in the continuous form. Therefore, 'will believe' is the correct future tense."
  },
  {
    id: "0d5ad3b6-5f55-4281-b0ed-8cbe86132b32",
    choices: ["the blobfish", "the giant panda", "the skeleton", "the ocean"],
    correctAnswerIndex: 0,
    explanation: "In paragraph B, the pronoun 'it' refers back to 'the blobfish' (or 'this marine creature'), which has tiny fins and no skeleton."
  },
  {
    id: "68ffdaee-3f86-43c6-8571-f608665e814f",
    choices: ["are going to spend", "will have spent", "spend", "will have been spending"],
    correctAnswerIndex: 0,
    explanation: "Use 'are going to' + base verb to talk about future plans and intentions."
  },
  {
    id: "2dada780-b820-4487-87b0-ebc5ce40876c",
    choices: ["does / start", "will / have started", "did / start", "does / starts"],
    correctAnswerIndex: 0,
    explanation: "The present simple ('does it start') is used for scheduled future events, such as a match or a train departure."
  },
  {
    id: "e6caf682-4039-46f8-aa8b-27bd014efd03",
    choices: ["will / have gone", "will / be going", "had / gone", "is / going to go"],
    correctAnswerIndex: 0,
    explanation: "The future perfect ('will have gone') is used for an action that will be completed before a certain time in the future."
  },
  {
    id: "1c7f96ec-bb26-489f-a4bb-add8b8478ef2",
    choices: ["fossil fuels", "acid rain", "renewable energy", "toxic waste"],
    correctAnswerIndex: 0,
    explanation: "Fossil fuels (like coal, oil, and gas) are sources of energy that cause pollution when burned."
  },
  {
    id: "53250427-16af-4d47-8249-59944f507aa4",
    choices: ["winds", "rain", "snow", "heat"],
    correctAnswerIndex: 0,
    explanation: "'Gale-force' is an adjective specifically used to describe very strong winds."
  },
  {
    id: "8f720335-96cf-4b35-848c-fb366869aac8",
    choices: ["She probably won't attend the meeting.", "She will probably attend the meeting.", "She will definitely attend the meeting.", "She might attend the meeting."],
    correctAnswerIndex: 0,
    explanation: "'Unlikely to' means that something probably won't happen."
  },
  {
    id: "7c4ebc63-f2ef-4ea1-9999-09f0ddb7c04c",
    choices: ["invertebrates", "furry", "crustaceans", "slimy"],
    correctAnswerIndex: 0,
    explanation: "Invertebrates are animals that lack a backbone or spinal column, such as insects."
  },
  {
    id: "fb7f6c5a-ab19-457a-aa5e-622939003483",
    choices: ["window", "seen", "please", "mean"],
    correctAnswerIndex: 0,
    explanation: "The word 'window' contains the short 'i' sound (/ɪ/), similar to the word 'big'. The other words have a long 'e' sound (/i:/)."
  },
  {
    id: "3578a002-6417-435f-9fbc-afefc1f2218f",
    choices: ["’re going to continue", "continues", "’ll have continued", "’ll be continued"],
    correctAnswerIndex: 0,
    explanation: "When making a prediction based on present evidence ('these statistics'), we use 'are going to'."
  },
  {
    id: "73a47bf0-6e09-489e-b3c8-a6aea2e1eab4",
    choices: ["will have been waiting", "were going to wait", "had been waited", "would have been waiting"],
    correctAnswerIndex: 0,
    explanation: "The future perfect continuous ('will have been waiting') is used to show how long an action will have been in progress up to a certain point in the future."
  },
  {
    id: "bf445cfd-6985-489d-889d-d295eefa45c6",
    choices: ["They are going to take a trip to Paris.", "They have planned a trip to Paris.", "They will plan a trip to Paris.", "They visit Paris."],
    correctAnswerIndex: 0,
    explanation: "'Are going to' expresses a future intention or plan that has already been decided."
  },
  {
    id: "fe9b9527-0f3b-4aeb-b80e-681463deebaa",
    choices: ["crustacean", "reptile", "mammal", "primate"],
    correctAnswerIndex: 0,
    explanation: "A crustacean is an aquatic animal with a hard shell and several pairs of legs, such as a lobster or crab."
  },
  {
    id: "b0c02795-b543-4459-9a7e-d58191b67250",
    choices: ["poachers", "primates", "naturalists", "endangered species"],
    correctAnswerIndex: 0,
    explanation: "A poacher is someone who catches or kills animals illegally."
  },
  {
    id: "dfc78c29-673a-4bab-9405-e270bf2222bd",
    choices: ["exhaust fumes", "wind turbine", "fossil fuels", "endangered species"],
    correctAnswerIndex: 0,
    explanation: "'Exhaust fumes' are the harmful gases released by a vehicle's engine."
  },
  {
    id: "173bd523-ffc3-4549-af12-7f1d4d5ee307",
    choices: ["nocturnal", "furry", "marine", "solitary"],
    correctAnswerIndex: 0,
    explanation: "A 'nocturnal' animal is one that is active during the night and sleeps during the day."
  },
  {
    id: "e637a195-64e2-4a0e-89e4-667da504fb89",
    choices: ["to raise money and support a range of critically endangered species.", "to find new animals and protect them from natural predators.", "to build shelters and provide medical care to all animals.", "to hire more researchers and scientists to study the animals."],
    correctAnswerIndex: 0,
    explanation: "According to paragraph A, the popularity of the giant panda enables organisations to raise money to support a range of critically endangered species."
  },
  {
    id: "ce7797b6-bd24-4580-9787-833eff267de3",
    choices: ["tiny fins and no skeleton", "big mouth and slimy pink body", "tiny eyes and big mouth", "thick skin and large fins"],
    correctAnswerIndex: 0,
    explanation: "Paragraph B explicitly states that the blobfish has 'tiny fins and no skeleton, which keeps it from being crushed by the water pressure'."
  },
  {
    id: "2b9984b4-c88e-4652-a5e2-465dd22eca76",
    choices: ["By spreading awareness about their ecological importance and creating educational campaigns.", "By moving all ugly animals to zoos and keeping them away from humans.", "By changing their appearance to make them look more like pandas.", "By hunting their predators to increase their population."],
    correctAnswerIndex: 0,
    explanation: "This is a critical thinking question. Spreading awareness and education are logical, practical ways to increase public care for less attractive animals."
  }
];

async function main() {
  console.log('Starting updates for Unit 2 questions...');
  let updatedCount = 0;
  for (const update of updates) {
    await prisma.grade11Question.update({
      where: { id: update.id },
      data: {
        choices: update.choices,
        correctAnswerIndex: update.correctAnswerIndex,
        explanation: update.explanation
      }
    });
    updatedCount++;
  }
  console.log(`Successfully updated ${updatedCount} questions.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
