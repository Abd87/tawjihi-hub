const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = {
  "After years of traveling, they decided to ________ and buy a house.": {
    correctAnswerIndex: 2,
    explanation: "\"Settle down\" means to establish a permanent home and live a stable life."
  },
  "She lives in a ________ town, which is not too big and not too small.": {
    correctAnswerIndex: 1,
    explanation: "\"Medium-sized\" perfectly fits the description of being neither too big nor too small."
  },
  "He rents a desk at a ________ to separate his work life from his home life.": {
    correctAnswerIndex: 0,
    choices: ["co-working space", "on the move", "public library", "cafe"],
    explanation: "A \"co-working space\" is an environment where independent professionals work together."
  },
  "Living in a small home has two main effects on a person's life. What are they? (2 points) ________ ________ ________": {
    correctAnswerIndex: 0,
    choices: [
      "You have to get rid of your excess possessions and it forces you to go out and engage with the rest of the world.",
      "You have to buy more furniture and spend more time indoors.",
      "You have to spend more money and buy a larger house eventually.",
      "It reduces the space available for belongings and increases your carbon footprint."
    ],
    explanation: "The passage explicitly states: \"Living in a small space means that you have to get rid of your excess possessions. It also forces you to go out and engage with the rest of the world.\""
  },
  "I have to ________ quickly, before my father comes back.": {
    correctAnswerIndex: 0,
    explanation: "With separable phrasal verbs, pronoun objects (like \"them\") must be placed between the verb and the particle."
  },
  "I read ________ interesting book last night. The book was about ancient history.": {
    correctAnswerIndex: 1,
    explanation: "\"An\" is used before singular countable nouns starting with a vowel sound (interesting)."
  },
  "He felt ________ in the small, restricted room with no windows.": {
    correctAnswerIndex: 1,
    choices: ["spacious", "confined", "excess", "medium-sized"],
    explanation: "\"Confined\" means restricted in area or volume, which fits the description of a small, windowless room."
  },
  "The 'tiny house movement' is a new social trend that has benefits. Write down two of these benefits. (4 points) ________ ________ ________": {
    correctAnswerIndex: 0,
    choices: [
      "It's a way to afford a home, and it offers a way of living more ecologically and less wastefully.",
      "It is a social trend that encourages living in very large homes and consuming more.",
      "It allows people to buy more possessions and stay indoors.",
      "It increases the cost of living and requires buying multiple homes."
    ],
    explanation: "The text states: \"For some, it’s the only way to afford a home, but for others it’s a lifestyle choice, offering a way of living more ecologically and less wastefully.\""
  },
  "The capital of France is ________ Paris.": {
    correctAnswerIndex: 3,
    explanation: "We do not use articles (Ø) before names of cities."
  },
  "He wants to ________ in this community and start a family.": {
    correctAnswerIndex: 1,
    explanation: "\"Put down roots\" is an idiom meaning to settle in a place and form lasting connections, which fits with starting a family."
  },
  "The car was so ________ with luggage that there was no room for me.": {
    correctAnswerIndex: 2,
    explanation: "\"Cramped\" means uncomfortably small or crowded."
  },
  "She feels ________ because her job requires her to be in the office every day.": {
    correctAnswerIndex: 0,
    explanation: "\"Tied down to one place\" means restricted by obligations, preventing free movement."
  },
  "My new apartment is small, but it's very ________ , with everything fitting neatly into the space.": {
    correctAnswerIndex: 0,
    explanation: "\"Compact\" describes things neatly arranged in a small space, usually with a positive connotation."
  },
  "It takes ________ hour to get there by bus.": {
    correctAnswerIndex: 1,
    explanation: "The word \"hour\" begins with a vowel sound (the 'h' is silent), so \"an\" is required."
  },
  "We had to cancel the picnic because of the ________ of rain.": {
    correctAnswerIndex: 2,
    explanation: "\"Excess\" means an amount that is more than necessary or normal."
  },
  "The Japanese have come up with two ingenious space-saving solutions. Write them down. (2 points) ________ ________ ________": {
    correctAnswerIndex: 0,
    choices: [
      "The use of deep wardrobes and cupboards for storage, and the use of sliding doors.",
      "Building taller houses and digging deep basements.",
      "Creating open-plan layouts with no interior walls.",
      "Using mirrors to make the space look larger."
    ],
    explanation: "The passage mentions \"the use of deep wardrobes and cupboards for storage\" and \"the use of sliding doors which can divide the room\" as their solutions."
  },
  "The first person to arrive was ________ oldest person in the room.": {
    correctAnswerIndex: 2,
    explanation: "\"The\" is used before superlative adjectives like \"oldest\"."
  },
  "My car ________ on the way to work, so I had to call a tow truck.": {
    correctAnswerIndex: 1,
    explanation: "\"Broke down\" is a phrasal verb meaning a machine or vehicle stopped working."
  },
  "Many people now ________ , which allows them to live wherever they choose.": {
    correctAnswerIndex: 0,
    explanation: "Working \"remotely\" means working from a distance, allowing geographical flexibility."
  },
  "We should spend less on ________ clothes and more on ________ healthy food.": {
    correctAnswerIndex: 3,
    explanation: "Plural (clothes) and uncountable nouns (food) used in a general sense do not take an article (Ø)."
  },
  "My father travels frequently for work, but he still enjoys the simple ________ like a warm bed and a home-cooked meal.": {
    correctAnswerIndex: 1,
    explanation: "\"Home comforts\" are things that make life easier and more pleasant, usually found in a home."
  },
  "She's a digital nomad, so she's always ________ .": {
    correctAnswerIndex: 1,
    explanation: "\"On the move\" means constantly traveling or changing locations, which fits the lifestyle of a digital nomad."
  },
  "I met ________ man last night, ________ man was kind and helpful.": {
    correctAnswerIndex: 2,
    explanation: "Use \"a\" when mentioning someone for the first time, and \"the\" when referring back to them specifically."
  },
  "The city is so ________ that there are always crowds of people on the streets.": {
    correctAnswerIndex: 3,
    explanation: "\"Densely-populated\" means containing a lot of people in a given area."
  },
  "Find a word in the report that means \"smart and original\". (2 points) ________": {
    correctAnswerIndex: 0,
    explanation: "The word \"ingenious\" in paragraph B is used to describe clever, original space-saving solutions."
  },
  "Mount Everest is ________ highest mountain in the world.": {
    correctAnswerIndex: 2,
    explanation: "\"The\" is required before superlative adjectives (highest)."
  },
  "Suggest two tips for someone who wants to live in a small space. (2 points) ________ ________ ________ Vocabulary ( /10) marks": {
    question: "Suggest two tips for someone who wants to live in a small space. (2 points) ________ ________ ________",
    correctAnswerIndex: 0,
    choices: [
      "Declutter regularly and choose multi-functional furniture.",
      "Buy more storage boxes and rent a storage unit.",
      "Spend most of your time outdoors and avoid buying groceries.",
      "Build an extension to the house and buy smaller appliances."
    ],
    explanation: "Based on the ideas in the text, getting rid of excess possessions (decluttering) and finding space-saving solutions are the best tips."
  },
  "Do you enjoy listening to ________ music?": {
    correctAnswerIndex: 3,
    explanation: "\"Music\" is an uncountable noun used in a general sense here, so no article (Ø) is needed."
  },
  "He has a lot of experience because he has worked with ________ people.": {
    correctAnswerIndex: 3,
    explanation: "\"People\" is a plural noun used generally, so it takes zero article (Ø)."
  },
  "The writer of this report mentions that living in a small space forces you to engage more with the world. In your opinion, what is a disadvantage of a tiny home? (4 points) ________ ________ ________": {
    correctAnswerIndex: 0,
    choices: [
      "Lack of privacy and limited space for guests.",
      "They are too expensive to build.",
      "They require too much cleaning.",
      "They are only suitable for large families."
    ],
    explanation: "A logical disadvantage of a tiny home is the lack of personal space and difficulty in accommodating guests."
  },
  "The children always go to ________ school on weekdays.": {
    correctAnswerIndex: 3,
    explanation: "We do not use an article (Ø) with \"school\" when referring to its primary purpose (attending classes)."
  },
  "My friend wants to become ________ astronaut.": {
    correctAnswerIndex: 1,
    explanation: "We use \"a/an\" for professions. \"Astronaut\" starts with a vowel sound, so \"an\" is correct."
  },
  "Write down the sentence which states that living in a tiny home is a choice for some people, related to how they want to live. (2 points) ________ ________ ________": {
    correctAnswerIndex: 0,
    choices: [
      "For some, it’s the only way to afford a home, but for others it’s a lifestyle choice, offering a way of living more ecologically and less wastefully.",
      "Living in a small space means that you have to get rid of your excess possessions.",
      "That is the size of a so-called ‘tiny home’, which has become a big craze in some parts of the world.",
      "Living small requires careful planning and who better to turn to for inspiration than the Japanese."
    ],
    explanation: "This sentence explicitly mentions that it is a \"lifestyle choice\" for some people."
  },
  "My brother bought ________ new car yesterday.": {
    correctAnswerIndex: 0,
    explanation: "Mentioning a singular countable noun for the first time takes \"a\" or \"an\". \"New\" starts with a consonant sound, so we use \"a\"."
  },
  "They were married in ________ 1990s.": {
    correctAnswerIndex: 2,
    explanation: "\"The\" is used before decades (e.g., the 1990s)."
  },
  "What does the underlined pronoun \"They\" refer to? (2 points) ________": {
    correctAnswerIndex: 0,
    choices: [
      "many people (in Tokyo)",
      "tiny houses",
      "deep wardrobes",
      "sliding doors"
    ],
    explanation: "\"They\" refers to the people living in Tokyo mentioned in the previous sentence who came up with space-saving solutions."
  },
  "My father is still ________ head of the family.": {
    correctAnswerIndex: 2,
    explanation: "\"The\" is used for unique positions or titles within a specific context (the head of the family)."
  },
  "She needs to find ________ work soon.": {
    correctAnswerIndex: 3,
    explanation: "\"Work\" is an uncountable noun in this context, so it does not take an article (Ø)."
  }
};

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 6 },
    include: { questions: true },
  });

  if (!exam) {
    console.log('Exam not found');
    return;
  }

  for (const q of exam.questions) {
    const updateData = updates[q.question];
    if (updateData) {
      await prisma.grade11Question.update({
        where: { id: q.id },
        data: {
          question: updateData.question || q.question,
          correctAnswerIndex: updateData.correctAnswerIndex,
          choices: updateData.choices || q.choices,
          explanation: updateData.explanation
        }
      });
      console.log(`Updated: ${q.question.substring(0, 30)}...`);
    } else {
      console.log(`No update found for: ${q.question}`);
    }
  }

  console.log('All updates finished.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
