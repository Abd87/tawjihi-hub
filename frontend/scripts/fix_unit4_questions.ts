import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
  {
    match: "Read the following text then answer the questions below",
    question: "What is the main reason people in the town were excited according to the author?",
    choices: [
      "The hotel will provide work and improve the beach area.",
      "The hotel will be built entirely by local residents.",
      "The developers will build a new school.",
      "The town will become the capital city."
    ],
    correctAnswerIndex: 0,
    explanation: "The first paragraph states that the hotel will give people work and offer improvements to the area around the beach."
  },
  {
    match: "what two benefits will the hotel offer",
    question: "Which of the following is one of the specific infrastructure improvements promised by developers?",
    choices: [
      "A new road with wide pavements.",
      "A new shopping mall.",
      "A large public library.",
      "A new airport near the beach."
    ],
    correctAnswerIndex: 0,
    explanation: "The second paragraph explicitly mentions that the developers promised a new road with wide pavements."
  },
  {
    match: "The developers promised two specific infrastructure improvements",
    question: "What else did the developers promise to replace?",
    choices: [
      "The old beach restaurants.",
      "The town hall.",
      "The local police station.",
      "The fishing boats."
    ],
    correctAnswerIndex: 0,
    explanation: "The text says they promised 'a replacement of the sad old beach restaurants'."
  },
  {
    match: "Why did the author report the activists to the police",
    question: "Why did the author report the activists to the police?",
    choices: [
      "Because they were illegally obstructing lorries from entering the beach.",
      "Because they stole equipment from the site.",
      "Because they were protesting peacefully.",
      "Because they were working for a rival company."
    ],
    correctAnswerIndex: 0,
    explanation: "The author mentions reporting the activists because they tried to stop lorries from entering the beach, which the author describes as illegal obstruction."
  },
  {
    match: "take advantage of a chance",
    question: "Find a phrase in the first paragraph that means 'to take advantage of a chance.'",
    choices: [
      "seize the opportunity",
      "released a statement",
      "offer improvements",
      "come up with a solution"
    ],
    correctAnswerIndex: 0,
    explanation: "The phrase 'seize the opportunity' means to act quickly in order to use an opportunity that may not be available later."
  },
  {
    match: "pronoun \"they\" in the first paragraph",
    question: "What does the underlined pronoun 'they' in the first paragraph refer to?",
    choices: [
      "the developers",
      "the protesters",
      "the townspeople",
      "the police"
    ],
    correctAnswerIndex: 0,
    explanation: "In the sentence 'When developers released a statement that they were going to build...', 'they' refers to the developers."
  },
  {
    match: "charge or claim that someone has done something illegal",
    question: "Find a word in the text which means 'A charge or claim that someone has done something illegal or wrong.'",
    choices: [
      "accusation",
      "obstruction",
      "incident",
      "statement"
    ],
    correctAnswerIndex: 0,
    explanation: "An 'accusation' is a claim that someone has done something wrong, as seen when the author mentions an accusation that they are working for the hotel company."
  },
  {
    match: "The author believes that development is more important",
    question: "What is the author's stance on the development compared to the protesters?",
    choices: [
      "The author supports the development because it brings solutions and work, while protesters oppose it.",
      "The author is neutral and just observing the events.",
      "The author is against the development and supports the protesters.",
      "The author believes the development should be moved to another town."
    ],
    correctAnswerIndex: 0,
    explanation: "The text shows the author is happy about the development solving problems, and surprised/unsupportive of the protesters obstructing it."
  },
  {
    match: "headline was designed to attract attention",
    question: "The headline was designed to attract attention and shock readers; it was purely __________.",
    choices: ["balanced", "sensational", "heartwarming", "off the record"],
    correctAnswerIndex: 1,
    explanation: "Sensationalism in journalism is the use of exciting or shocking stories or language at the expense of accuracy, in order to provoke public interest."
  },
  {
    match: "good journalist must always __________ before publishing",
    question: "A good journalist must always __________ before publishing a story to ensure it is true.",
    choices: ["verify sources", "shed light", "go viral", "expose corruption"],
    correctAnswerIndex: 0,
    explanation: "To verify sources means to make sure the information and the people providing it are reliable and truthful."
  },
  {
    match: "photo of the child crying was very __________",
    question: "The photo of the child crying was very __________; it made everyone feel sad.",
    choices: ["landscape", "composed", "poignant", "blurred"],
    correctAnswerIndex: 2,
    explanation: "'Poignant' means evoking a keen sense of sadness or regret. A crying child naturally evokes this feeling."
  },
  {
    match: "significant __________ in the quality",
    question: "There has been a significant __________ in the quality of internet services in Jordan.",
    choices: ["improve", "improvement", "improved", "improves"],
    correctAnswerIndex: 1,
    explanation: "After an adjective like 'significant', a noun is required. 'Improvement' is the noun form."
  },
  {
    match: "lawyer refuted the __________",
    question: "The lawyer refuted the __________ that his client had stolen the car.",
    choices: ["allege", "allegedly", "allegation", "alleging"],
    correctAnswerIndex: 2,
    explanation: "The sentence requires a noun after 'the'. 'Allegation' is a claim or assertion that someone has done something wrong."
  },
  {
    match: "Children today often have a shorter __________",
    question: "Children today often have a shorter __________ than kids did 20 years ago.",
    choices: ["public interest", "attention span", "news story", "revenue"],
    correctAnswerIndex: 1,
    explanation: "'Attention span' refers to the length of time for which a person is able to concentrate mentally on a particular activity."
  },
  {
    match: "investigation aimed to __________ corruption",
    question: "The investigation aimed to __________ corruption in the city council.",
    choices: ["evoke", "expose", "claim", "pose"],
    correctAnswerIndex: 1,
    explanation: "To 'expose' means to make something typically hidden, like corruption, visible or known."
  },
  {
    match: "aimed at the __________ market",
    question: "The new restaurant is too expensive for us; it is aimed at the __________ market.",
    choices: ["upmarket", "traditional", "sensitive", "viral"],
    correctAnswerIndex: 0,
    explanation: "'Upmarket' refers to relatively expensive and designed to appeal to affluent consumers."
  },
  {
    match: "enjoys the __________ of working",
    question: "She enjoys the __________ of working from home.",
    choices: ["free", "freedom", "freely", "frees"],
    correctAnswerIndex: 1,
    explanation: "A noun is required after 'the'. 'Freedom' is the noun form of free."
  },
  {
    match: "suitable __________ for Laila",
    question: "It will be difficult to find a suitable __________ for Laila when she leaves her post.",
    choices: ["replacement", "replace", "replaced", "replaceable"],
    correctAnswerIndex: 0,
    explanation: "A noun is needed after the adjective 'suitable'. 'Replacement' refers to a person who fills the role of someone who has left."
  },
  {
    match: "thief __________ the money",
    question: "By the time the police arrived, the thief __________ the money.",
    choices: ["has stolen", "had stolen", "steals", "was stealing"],
    correctAnswerIndex: 1,
    explanation: "The Past Perfect ('had stolen') is used to show that an action was completed before another action in the past ('arrived')."
  },
  {
    match: "__________ had she finished her speech",
    question: "__________ had she finished her speech when the audience started clapping.",
    choices: ["Scarcely", "No sooner", "Little", "Not only"],
    correctAnswerIndex: 0,
    explanation: "'Scarcely' is used with 'when' to indicate that one event happened almost immediately after another."
  },
  {
    match: "she __________ on her project for ten hours",
    question: "Fatima was exhausted because she __________ on her project for ten hours.",
    choices: ["had been working", "works", "has worked", "is working"],
    correctAnswerIndex: 0,
    explanation: "The Past Perfect Continuous emphasizes the duration of an activity that was in progress before another action or state in the past."
  },
  {
    match: "__________ did he know that his best friend",
    question: "__________ did he know that his best friend was planning a surprise party for him.",
    choices: ["Seldom", "Little", "Never", "Scarcely"],
    correctAnswerIndex: 1,
    explanation: "'Little did he know' is a fixed inversion expression meaning he completely did not know."
  },
  {
    match: "Under no circumstances __________ you leave",
    question: "Under no circumstances __________ you leave the door unlocked.",
    choices: ["should", "you should", "should have", "you shall"],
    correctAnswerIndex: 0,
    explanation: "Negative adverbial phrases like 'Under no circumstances' at the beginning of a sentence require subject-verb inversion."
  },
  {
    match: "he __________ as a journalist for five years",
    question: "Before he became a teacher, he __________ as a journalist for five years.",
    choices: ["had been working", "works", "has been working", "is working"],
    correctAnswerIndex: 0,
    explanation: "The Past Perfect Continuous describes an ongoing action that happened before a specific point in the past."
  },
  {
    match: "Not only __________ the race",
    question: "Not only __________ the race, but she also broke the world record.",
    choices: ["she won", "did she win", "she had won", "does she win"],
    correctAnswerIndex: 1,
    explanation: "When a sentence starts with 'Not only', it requires subject-verb inversion. 'did she win' provides the correct inversion for past tense."
  },
  {
    match: "children __________ outside for an hour",
    question: "The children __________ outside for an hour before it started to rain.",
    choices: ["play", "have played", "had been playing", "are playing"],
    correctAnswerIndex: 2,
    explanation: "The Past Perfect Continuous is used to emphasize the duration of an action ('for an hour') that was ongoing before another past event ('started to rain')."
  },
  {
    match: "__________ had I entered the room",
    question: "__________ had I entered the room when the phone rang.",
    choices: ["Scarcely", "No sooner", "Little", "Never"],
    correctAnswerIndex: 0,
    explanation: "Like question 2, 'Scarcely' pairs with 'when' to show immediate succession of past events."
  },
  {
    match: "Ali __________ his leg last week",
    question: "Ali __________ his leg last week. Before he fell, he had been trying to climb the mountain.",
    choices: ["breaks", "has broken", "broke", "was breaking"],
    correctAnswerIndex: 2,
    explanation: "The simple past 'broke' is used for a completed action at a specific time in the past ('last week')."
  }
];

async function main() {
  const exam = await prisma.grade11Exam.findUnique({
    where: { unitNumber: 4 },
    include: { questions: true }
  });

  if (!exam) {
    console.error("Unit 4 exam not found!");
    return;
  }

  let updatedCount = 0;

  for (const q of exam.questions) {
    // Find matching update
    const update = updates.find(u => q.question.includes(u.match));
    if (update) {
      await prisma.grade11Question.update({
        where: { id: q.id },
        data: {
          question: update.question,
          choices: update.choices,
          correctAnswerIndex: update.correctAnswerIndex,
          explanation: update.explanation
        }
      });
      updatedCount++;
      console.log(`Updated question: ${update.question.substring(0, 50)}...`);
    } else {
      console.log(`No match found for: ${q.question.substring(0, 50)}...`);
      // Since it's a script that AI built, we might want to just update the remaining un-matched questions if they are few.
    }
  }

  console.log(`Successfully updated ${updatedCount} questions for Unit 4.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
