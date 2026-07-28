import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    id: "7a98fe58-50e3-41af-92bb-ca8b0f6656ef",
    question: "It was very foggy this morning; I could barely ________ the traffic lights.",
    choices: ["make out", "put off", "come to terms with", "spread the word"],
    correctAnswerIndex: 0,
    explanation: "\"Make out\" means to manage to see or hear something with difficulty."
  },
  {
    id: "0f833e3b-c8a6-42fe-a564-ede915d46f1c",
    question: "We stopped ________ some water because we were very thirsty after the run.",
    choices: ["buying", "to buy", "buy", "bought"],
    correctAnswerIndex: 1,
    explanation: "\"Stop to buy\" means to pause an action in order to buy something. \"Stop buying\" would mean to cease buying entirely."
  },
  {
    id: "1514aa39-3297-4ad7-8285-e227680034be",
    question: "Some people are ________ ; they cannot distinguish between red and green.",
    choices: ["short-sighted", "colour-blind", "hard of hearing", "capable"],
    correctAnswerIndex: 1,
    explanation: "\"Colour-blind\" refers to the inability to distinguish certain colours, like red and green."
  },
  {
    id: "9160f5a9-6b45-42fd-b79b-a84197ea7080",
    question: "The kitten’s fur was soft and ________ , unlike the rough skin of the lizard.",
    choices: ["coarse", "prickly", "fluffy", "bland"],
    correctAnswerIndex: 2,
    explanation: "\"Fluffy\" is the opposite of rough and commonly describes soft animal fur."
  },
  {
    id: "0ece3d9a-e659-4ceb-81db-b215ff01c961",
    question: "The soup smells delicious; it has a wonderful ________ that makes me hungry.",
    choices: ["stench", "aroma", "texture", "eyesight"],
    correctAnswerIndex: 1,
    explanation: "\"Aroma\" is a pleasant smell, especially from food."
  },
  {
    id: "cef7bd91-38ca-4841-8c92-8017ff01244e",
    question: "You had better ________ harder if you want to pass the final exam.",
    choices: ["study", "to study", "studying", "studied"],
    correctAnswerIndex: 0,
    explanation: "\"Had better\" is followed by the bare infinitive (base form of the verb without 'to')."
  },
  {
    id: "8da7de5a-3349-46ed-974a-5cd96e4df9d7",
    question: "Listen to loud music or sounds can result in ________",
    choices: ["hearing loss", "eyesight improvement", "colour-blindness", "perceiving things better"],
    correctAnswerIndex: 0,
    explanation: "Exposure to loud noises can damage the ears, leading to hearing loss."
  },
  {
    id: "6b03eea9-072d-42f8-bd12-b37908ea69ec",
    question: "She ________ waking up early now because she has been doing it for months.",
    choices: ["used to", "use to", "uses to", "is used to"],
    correctAnswerIndex: 3,
    explanation: "\"Is used to\" means being accustomed to something in the present. It is followed by a noun or an -ing verb."
  },
  {
    id: "86acd339-566e-4a35-a9c2-44955e16d05d",
    question: "I am planning ________ my grandparents this weekend.",
    choices: ["visit", "visiting", "to visit", "visited"],
    correctAnswerIndex: 2,
    explanation: "The verb \"plan\" is followed by the to-infinitive."
  },
  {
    id: "d328819a-8879-42cb-b8a7-b921f8bab743",
    question: "When I was a child, I ________ hate vegetables, but now I love them.",
    choices: ["used to", "am used to", "use to", "get used to"],
    correctAnswerIndex: 0,
    explanation: "\"Used to\" describes a past habit or state that is no longer true."
  },
  {
    id: "c0690495-03bc-4872-b88d-129ea20970a5",
    question: "The food that my friend prepared had no flavour, it was ________ .",
    choices: ["mouth-watering", "savoury", "bland", "spicy"],
    correctAnswerIndex: 2,
    explanation: "\"Bland\" means lacking strong features or characteristics, such as flavour."
  },
  {
    id: "a8c1c61b-af20-443f-ba99-6c1770439cfb",
    question: "If you eat too much spicy food, it might irritate your ________ .",
    choices: ["taste buds", "hearing loss", "vision", "spectacles"],
    correctAnswerIndex: 0,
    explanation: "\"Taste buds\" are sensory organs on your tongue that can be irritated by very spicy food."
  },
  {
    id: "72008676-89f2-4cfe-9e4a-40f28d3e0f42",
    question: "He admitted ________ the vase, even though it was an accident.",
    choices: ["break", "to break", "breaking", "broken"],
    correctAnswerIndex: 2,
    explanation: "The verb \"admit\" is followed by a gerund (-ing form)."
  },
  {
    id: "b3f66d93-92e5-4a72-9662-c88aad7e60b1",
    question: "Find a word in the text which means \"extremely bad or unkind\".",
    choices: ["cruel", "blind", "desperate", "capable"],
    correctAnswerIndex: 0,
    explanation: "\"Cruel\" means wilfully causing pain or suffering to others, or feeling no concern about it."
  },
  {
    id: "995b6ed9-2ac9-4ab2-b780-ca2e15bc275c",
    question: "Ali moved to London a year ago. He is still ________ driving on the left.",
    choices: ["used to", "getting used to", "be used to", "use to"],
    correctAnswerIndex: 1,
    explanation: "\"Getting used to\" refers to the ongoing process of becoming accustomed to something new."
  },
  {
    id: "ffd28241-4cc4-46df-9bde-0db8b119e152",
    question: "Critical Thinking: The text suggests that disabilities can be turned into opportunities to help others. Which of the following best supports this statement based on Sabriye's story?",
    choices: [
      "She used her own experience with blindness to create a Tibetan Braille system and help others.",
      "She decided to hide her blindness to avoid being treated poorly by others.",
      "She realized that blind people were capable of doing the same things as everyone else.",
      "She moved to Tibet to avoid the difficulties she faced at her first school."
    ],
    correctAnswerIndex: 0,
    explanation: "Sabriye used her own challenges to create a solution (Tibetan Braille) that benefited many blind children in Tibet."
  },
  {
    id: "57dd85ad-c1d9-4a73-8b32-7e7d3e613b39",
    question: "It took him a long time to ________ living in a different country with a new culture.",
    choices: ["adjust to", "pursue", "verify", "expose"],
    correctAnswerIndex: 0,
    explanation: "\"Adjust to\" means to adapt to a new situation or environment."
  },
  {
    id: "7f4d0b79-31d1-42f3-ab9e-3b392e75c477",
    question: "What does the underlined pronoun \"She\" in the second paragraph refer to?",
    choices: ["Sabriye Tenberken", "Paul Kronenberg", "The teacher", "A blind child"],
    correctAnswerIndex: 0,
    explanation: "\"She\" refers to the subject of the previous sentences, which is Sabriye Tenberken."
  },
  {
    id: "ab1c20f4-c49a-4dfb-902e-666661cb498c",
    question: "She decided to travel to rural Tibet, to spread the word ________ her Braille system.",
    choices: ["with", "to", "about", "of"],
    correctAnswerIndex: 2,
    explanation: "The phrase is \"spread the word about\", meaning to tell many people about something."
  },
  {
    id: "8e1cf49c-32c1-46b8-940d-75defb5c2011",
    question: "My father avoids ________ during rush hour to escape the traffic.",
    choices: ["drive", "to drive", "driving", "driven"],
    correctAnswerIndex: 2,
    explanation: "The verb \"avoid\" is followed by a gerund (-ing form)."
  },
  {
    id: "3c76de93-86b1-41e7-b5ec-99bed08c7340",
    question: "Find a phrase in the first paragraph that means \"to accept a difficult situation\".",
    choices: ["come to terms with", "fit in", "hide her blindness", "capable of doing"],
    correctAnswerIndex: 0,
    explanation: "\"Come to terms with\" means to gradually accept a sad or difficult situation."
  },
  {
    id: "505cacfd-4f53-4e43-bb49-375a420906b5",
    question: "The teacher made the students ________ the essay again.",
    choices: ["to write", "writing", "write", "wrote"],
    correctAnswerIndex: 2,
    explanation: "\"Make someone do something\" uses the bare infinitive (without 'to')."
  },
  {
    id: "17a017a8-bba6-41e2-83ed-36daf8abbd83",
    question: "What are the two main goals of Sabriye's school, 'Braille Without Borders'?",
    choices: [
      "To help blind children adjust to their blindness and learn skills.",
      "To teach Tibetan children how to speak German and English.",
      "To cure blindness in the mountainous regions of China.",
      "To help blind children hide their blindness from society."
    ],
    correctAnswerIndex: 0,
    explanation: "The text states its vision is \"to help blind children to adjust to their blindness and to learn many of the same skills that she had learnt as a girl.\""
  },
  {
    id: "14347a06-1c3f-4262-b1fb-50948a07cbcb",
    question: "I can't afford ________ a new car this year.",
    choices: ["buying", "to buy", "buy", "bought"],
    correctAnswerIndex: 1,
    explanation: "The verb \"afford\" is followed by a to-infinitive."
  },
  {
    id: "acdbec74-fac9-4d74-88b6-da61579d1047",
    question: "According to the text, what were the two main reasons for the high rate of eyesight problems among Tibetan people?",
    choices: [
      "Their diet and the damaging sun at high altitudes.",
      "The cold weather and lack of hospitals.",
      "Reading in the dark and using too much technology.",
      "Genetic conditions and lack of sleep."
    ],
    correctAnswerIndex: 0,
    explanation: "The text explicitly mentions \"partly because of their diet but mainly because of the damaging sun at high altitudes.\""
  },
  {
    id: "534683ad-1e61-45de-9a8e-b9ea84bdc2db",
    question: "We need to ________ the meeting until next week because the manager is ill.",
    choices: ["put off", "tell apart", "adjust to", "realise"],
    correctAnswerIndex: 0,
    explanation: "\"Put off\" is a phrasal verb meaning to postpone or delay an event."
  },
  {
    id: "dc71f37a-12ba-4e75-b86d-2c58086fae1b",
    question: "Find a word in the text which means \"unable to see\".",
    choices: ["blind", "damaging", "cruel", "capable"],
    correctAnswerIndex: 0,
    explanation: "The word \"blind\" means unable to see."
  }
];

async function main() {
  for (const update of updates) {
    await prisma.grade11Question.update({
      where: { id: update.id },
      data: {
        question: update.question,
        choices: update.choices,
        correctAnswerIndex: update.correctAnswerIndex,
        explanation: update.explanation,
      }
    });
    console.log(`Updated question ${update.id}`);
  }
  console.log('All updates complete.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
