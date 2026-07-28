const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const updates = [
  {
    id: "897f8628-74bd-4883-aaed-da6d58ed479f",
    choices: ["take in", "spell out", "figure out", "get across"],
    correctAnswerIndex: 1,
    explanation: "\"spell out\" means to explain something in a very clear and detailed way. \"take in\" means to understand, \"figure out\" means to solve, and \"get across\" means to communicate an idea."
  },
  {
    id: "f53610b1-c9d6-4997-adc2-68f9d4cc1f2e",
    choices: ["maintain contact", "lose contact", "make contact", "pass on the message"],
    correctAnswerIndex: 2,
    explanation: "\"make contact\" means to begin communication with someone, which fits the context of trying to reach them."
  },
  {
    id: "3b0d893a-12fb-4612-ae52-246d507c5287",
    choices: ["impressed", "confused", "saddened", "angered"],
    correctAnswerIndex: 1,
    explanation: "\"Bewildered\" means extremely confused or puzzled."
  },
  {
    id: "8a606400-bd7c-4100-9e85-3e4e0386e690",
    choices: ["hit it off", "took to you", "came across as", "created a bond"],
    correctAnswerIndex: 3,
    explanation: "\"Created a bond\" refers to developing a strong relationship or connection over time."
  },
  {
    id: "60eefce4-737c-4240-8fcf-ae488c2ccfde",
    choices: ["Do", "Did", "Are", "Have"],
    correctAnswerIndex: 0,
    explanation: "We use \"Do\" as an auxiliary verb to form questions in the present simple tense with plural subjects like \"they\"."
  },
  {
    id: "5bfba9bc-11aa-4891-993e-49341c9d3c01",
    choices: ["put somebody on the spot", "refused to let something drop", "paid a compliment", "hit it off"],
    correctAnswerIndex: 2,
    explanation: "\"To pay a compliment\" means to say something nice to or about someone."
  },
  {
    id: "8540fbc9-7c3d-4f05-9309-4c9bf63a50b9",
    choices: ["have / finished", "did / finished", "are / finishing", "will / finish"],
    correctAnswerIndex: 0,
    explanation: "The word \"already\" is a keyword for the present perfect tense, which is formed with have/has + past participle (finished)."
  },
  {
    id: "794696f1-d9a8-4a4e-96a5-8625247a13ef",
    choices: ["create it", "protect it", "destroy it", "ignore it"],
    correctAnswerIndex: 2,
    explanation: "\"Wipe out\" is a phrasal verb meaning to destroy or remove something completely."
  },
  {
    id: "2375cf2d-f449-4a2e-8ce8-78949dd8ee24",
    choices: ["surprised", "frightened", "sad", "confused"],
    correctAnswerIndex: 1,
    explanation: "\"Terrified\" means very frightened or scared."
  },
  {
    id: "1c6737ec-d820-4a64-888d-ed0239e7eba3",
    choices: ["came across", "pointed out", "took in", "wiped out"],
    correctAnswerIndex: 1,
    explanation: "\"Point out\" means to draw attention to something, such as a mistake."
  },
  {
    id: "2d809127-e81a-4c4a-abf0-504be74cc513",
    choices: ["chimpanzees", "humans", "emotions", "researchers"],
    correctAnswerIndex: 0,
    explanation: "In the text, \"they\" refers back to the \"groups of chimpanzees\" who were having battles."
  },
  {
    id: "9e059fcf-74a6-4f32-88dd-d603120c617d",
    choices: ["sets", "set", "is setting", "has set"],
    correctAnswerIndex: 0,
    explanation: "We use the present simple (\"sets\") for facts and general truths."
  },
  {
    id: "2b3027cb-075e-4458-a23b-e85fd4417876",
    choices: ["Through her calmness.", "By offering them food and playing with their young.", "By building a shelter near their natural habitat.", "By imitating their sounds and behaviors."],
    correctAnswerIndex: 0,
    explanation: "The text states that \"it is highly likely that her calmness gained their trust.\""
  },
  {
    id: "a4494540-7d53-445a-9ff9-3827e53232cd",
    choices: ["Understanding animal communication helps us protect endangered species and their habitats.", "It is not important because humans are fundamentally different from animals.", "Animals do not have meaningful communication, so studying it is useless.", "It is only useful for training pets to obey commands."],
    correctAnswerIndex: 0,
    explanation: "This is a critical thinking question; understanding animal communication helps in conservation and protecting their natural habitats."
  },
  {
    id: "d5c71047-f7f3-4f54-8936-e501c7dade8d",
    choices: ["that chimpanzees have a complex system of communication and that they can show emotions", "that they can communicate by touch and sound, and even use sign language.", "that chimpanzees prefer to live in isolation and avoid humans", "that chimpanzees cannot learn new skills from other animals"],
    correctAnswerIndex: 1,
    explanation: "The text explicitly mentions that they can communicate by touch and sound, and that they could use sign language."
  },
  {
    id: "2ac62a1b-8ee9-4dea-a665-1b7d30394946",
    choices: ["Because of Jane's work, people had to change the way they thought about animals.", "In my opinion, Jane Goodall brought about a complete change in the way people understood how animals can communicate.", "The chimpanzees eventually allowed her to come closer.", "Her discoveries were published in scientific journals worldwide."],
    correctAnswerIndex: 1,
    explanation: "This sentence directly matches the statement that her work caused a complete change in understanding."
  },
  {
    id: "48e16845-3f8e-40ee-bfdd-ac1fdc32d7f0",
    choices: ["lose contact", "maintain contact", "spread the message", "convey a message"],
    correctAnswerIndex: 1,
    explanation: "\"Maintain contact\" means to continue communicating with someone, which is important with friends and family."
  },
  {
    id: "5a34fc22-729c-46b5-83ac-a5a094d70e1c",
    choices: ["stay in touch", "spread the message", "make contact", "lose contact"],
    correctAnswerIndex: 0,
    explanation: "\"Stay in touch\" is a common idiom meaning to maintain communication over time."
  },
  {
    id: "9d8e153b-9ce4-47cc-80f6-d73d144ad448",
    choices: ["aren’t eating", "don't eat", "didn’t eat", "haven't eaten"],
    correctAnswerIndex: 2,
    explanation: "\"Last night\" is a past time marker, so we use the past simple negative form \"didn't eat\"."
  },
  {
    id: "2e9296aa-8ce1-4b52-870e-fdeb21fc921b",
    choices: ["was cooking", "cooked", "have cooked", "will cook"],
    correctAnswerIndex: 0,
    explanation: "The word \"While\" is typically followed by the past continuous tense (\"was cooking\") to describe an ongoing action in the past."
  },
  {
    id: "9a2873e2-9ac2-45fa-8097-d8ec15fcdcca",
    choices: ["I was tired.", "Ahmad has finished his dinner.", "The man finished his book last night.", "none of the above."],
    correctAnswerIndex: 2,
    explanation: "\"The man finished his book last night\" uses the past simple tense for a completed action at a specific past time (\"last night\")."
  },
  {
    id: "2178d9ad-e120-41fb-8ed4-46f4393b13aa",
    choices: ["were playing", "played", "have played", "will play"],
    correctAnswerIndex: 0,
    explanation: "\"were playing\" (past continuous) is used to emphasize the duration of an action in the past (\"all afternoon\")."
  },
  {
    id: "6cda6871-2bc8-4c9b-ac21-1d7fdf1fb36f",
    choices: ["She discovered that chimpanzees eat meat and make tools.", "She discovered that they are omnivores and that they use tools.", "She learned that chimpanzees prefer sleeping during the day.", "She noticed that chimpanzees have a lifespan similar to humans."],
    correctAnswerIndex: 1,
    explanation: "The text states that Jane watched them using sticks to take ants (using tools) and taught us that they are omnivores."
  },
  {
    id: "40943e6e-6e75-4e83-a508-ad5eaecddc8a",
    choices: ["is raining", "rained", "has rained", "will rain"],
    correctAnswerIndex: 0,
    explanation: "The phrase \"right now\" indicates an action happening at the moment of speaking, which requires the present continuous tense (\"is raining\")."
  },
  {
    id: "3bf625e7-bbf5-4fd2-aff3-8d906dbb9920",
    choices: ["doesn't like", "didn't like", "isn't liking", "hasn't liked"],
    correctAnswerIndex: 0,
    explanation: "\"Like\" is a stative verb and is normally used in the present simple tense (\"doesn't like\") to express a general preference."
  },
  {
    id: "6901d320-306d-42e4-b52e-22ae068c2d24",
    choices: ["are", "were", "will have", "have been"],
    correctAnswerIndex: 0,
    explanation: "\"are you doing\" is the present continuous tense used for future arrangements (\"this weekend\")."
  },
  {
    id: "6a5c4af9-9d55-4c4f-baf5-6ebd9dc28dd2",
    choices: ["do", "did", "am doing", "have done"],
    correctAnswerIndex: 0,
    explanation: "The present simple \"do you do\" is used to ask about someone's routine or permanent situation, like their profession."
  },
  {
    id: "024bda57-4f2f-432c-af84-dde3f818acfd",
    choices: ["He lives in Irbid.", "They always go to school by bus.", "Turn right, then take the second exit.", "The class starts at 8:00 AM."],
    correctAnswerIndex: 2,
    explanation: "\"Turn right, then take the second exit\" is an imperative sentence, which is used for giving instructions."
  },
  {
    id: "cec78377-52b8-4349-808d-dab7ee0a6c74",
    choices: ["aren't watching", "didn't watch", "haven't watched", "won't watch"],
    correctAnswerIndex: 0,
    explanation: "The phrase \"at the moment\" is a keyword for the present continuous tense."
  },
  {
    id: "2c6d56a0-ec2e-46ec-850b-64202b51cf8b",
    choices: ["went", "goes", "is going", "has gone"],
    correctAnswerIndex: 0,
    explanation: "The word \"yesterday\" indicates a completed action in the past, so the past simple \"went\" is required."
  },
  {
    id: "ae6dc380-1b16-4b98-8f35-777471b296ed",
    choices: ["wasn't sleeping", "didn't sleep", "haven't slept", "won't sleep"],
    correctAnswerIndex: 0,
    explanation: "\"At 10 o'clock last night\" specifies a precise time in the past when an action was ongoing, which requires the past continuous."
  },
  {
    id: "8d6df34b-2a8e-4c0e-877b-6cc60a67e0d4",
    choices: ["He doesn’t like apples.", "They were studying all night.", "The pack of wolves are dangerous.", "I have already watched that movie."],
    correctAnswerIndex: 2,
    explanation: "\"The pack of wolves\" is a collective noun functioning as a single unit here, so it should take the singular verb \"is\", not \"are\"."
  },
  {
    id: "0dd667b3-c26c-4155-9723-e81f089797bf",
    choices: ["are playing", "played", "have played", "will play"],
    correctAnswerIndex: 0,
    explanation: "The phrase \"right now\" requires the present continuous tense."
  },
  {
    id: "7417e967-696e-4d93-942f-1907c3d295e6",
    question: "Which of the following expresses temporary situation.",
    choices: ["He lives in Amman.", "Water boils at 100 degrees.", "I am staying with my friend for a few days.", "The train leaves at 5."],
    correctAnswerIndex: 2,
    explanation: "Present continuous is used for temporary situations (e.g., \"I am staying with my friend for a few days\")."
  },
  {
    id: "8b189bf0-a262-4519-a242-00ea7bedeb2f",
    choices: ["were swimming", "swam", "have swum", "will swim"],
    correctAnswerIndex: 0,
    explanation: "The past continuous (\"were swimming\") is used for a longer action that was interrupted by a shorter action in the past simple (\"started\")."
  },
  {
    id: "7c74ed59-8b31-4255-862e-70cf0fe60823",
    choices: ["hasn't eaten", "didn't eat", "isn't eating", "won't eat"],
    correctAnswerIndex: 0,
    explanation: "The word \"yet\" is typically used with the present perfect tense in negative statements and questions."
  },
  {
    id: "b49aad7e-1479-4e03-8125-d255ee1a9215",
    question: "Why did Jane Goodall go to Africa in her 20s?",
    choices: ["Because she had a scientific degree in zoology.", "Because she was inspired by a book about Dr Dolittle.", "Because her mother forced her to go.", "Because she wanted to write a book about Tanzania."],
    correctAnswerIndex: 1,
    explanation: "The text says: \"Jane loved reading books about a fictional character called Dr Dolittle... Perhaps this is what inspired her to go to Africa when she was in her 20s.\""
  },
  {
    id: "b6241a93-d33a-4883-834d-8eaa3c184f5d",
    choices: ["realise", "demonstrate", "communicate", "observe"],
    correctAnswerIndex: 0,
    explanation: "In the context of the text, \"realised\" means to become fully aware of something as a fact."
  }
];

async function main() {
  for (const update of updates) {
    const dataToUpdate = {
      choices: update.choices,
      correctAnswerIndex: update.correctAnswerIndex,
      explanation: update.explanation
    };
    if (update.question) {
      dataToUpdate.question = update.question;
    }
    await prisma.grade11Question.update({
      where: { id: update.id },
      data: dataToUpdate
    });
  }
  console.log("Successfully updated all Grade 11 Unit 1 questions.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
