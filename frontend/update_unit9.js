const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  {
    id: "71411a83-0077-41f5-8e0f-28194836134a",
    question: "Aldi ________ that his boss would rescue him quickly because it had happened before.",
    choices: ["made himself understood", "took it for granted", "had no choice but to", "kept him going"],
    correctAnswerIndex: 1,
    explanation: "The phrase 'took it for granted' means to assume something will happen without questioning it, matching the passage's description of Aldi's initial reaction."
  },
  {
    id: "425a2907-71c4-4e37-a382-effb6c070906",
    question: "In most professional situations, she is incapable of ________ that she is wrong.",
    choices: ["acknowledging", "making", "offering", "taking"],
    correctAnswerIndex: 0,
    explanation: "The verb 'acknowledge' means to admit or accept that something is true. After the preposition 'of', we use the -ing form."
  },
  {
    id: "d5f8f272-14ac-424c-8d05-5145308b63af",
    question: "If I ________ you, I would take that lucrative job offer.",
    choices: ["am", "was", "were", "will be"],
    correctAnswerIndex: 2,
    explanation: "This is a Second Conditional sentence giving advice. In conditional sentences, we often use 'were' instead of 'was' for all subjects ('If I were you')."
  },
  {
    id: "faf04efd-b25d-40bb-944a-40aab917a093",
    question: "When his supplies ran out, Aldi ________ drink sea water to stay alive.",
    choices: ["got off relatively lightly", "had no choice but to", "considered his options", "kept him going"],
    correctAnswerIndex: 1,
    explanation: "'had no choice but to' implies that this was his only option for survival."
  },
  {
    id: "fde1747c-b353-4032-8189-04aa47e5399f",
    question: "If we had arrived at the airport earlier, we ________ our flight.",
    choices: ["won't miss", "wouldn't miss", "wouldn't have missed", "didn't miss"],
    correctAnswerIndex: 2,
    explanation: "This is a Third Conditional sentence describing a hypothetical past situation. The structure is 'If + Past Perfect, would have + past participle'."
  },
  {
    id: "ea298174-3c09-494c-b60a-6598dc91f2eb",
    question: "After a hazardous journey, they were relieved to get home ________ .",
    choices: ["ups and downs", "safe and sound", "give and take", "there and then"],
    correctAnswerIndex: 1,
    explanation: "The binomial 'safe and sound' means uninjured and out of danger, which perfectly fits getting home after a dangerous journey."
  },
  {
    id: "93f4ac49-c6e0-448f-9235-75bb47d38c40",
    question: "If she ________ harder last semester, she would have passed all her exams.",
    choices: ["studies", "studied", "had studied", "would study"],
    correctAnswerIndex: 2,
    explanation: "This is a Third Conditional sentence. The if-clause requires the Past Perfect tense ('had studied') to refer to a hypothetical situation in the past."
  },
  {
    id: "88d596a4-e03f-4442-abfb-7d610c3d0868",
    question: "Why did Aldi and his family eventually decide that he should stay on dry land? (2 points)",
    choices: ["Because the job was too dangerous after his terrifying ordeal.", "Because he found a better paying job on a larger ship.", "Because the floating trap was destroyed and could not be replaced.", "Because he wanted to move to a different country."],
    correctAnswerIndex: 0,
    explanation: "According to the final paragraph, despite the job being relatively lucrative, Aldi and his family decided 'it simply wasn't worth the risk' after drifting three times."
  },
  {
    id: "994fffc4-df03-4bf0-89e4-120c0e5e802d",
    question: "If you spend a few weeks researching your business idea, your hard work will eventually ________ .",
    choices: ["mess up", "pay off", "blunder", "get nowhere"],
    correctAnswerIndex: 1,
    explanation: "The phrasal verb 'pay off' means to yield good results or succeed, which fits the context of hard work."
  },
  {
    id: "419c51f2-1022-4cc8-929d-a5cbd96d1fa3",
    question: "Filtering the sea water through his clothes ________ because it helped him survive until it rained.",
    choices: ["took its toll on him", "must have done the trick", "was a lucky break", "ran the risk"],
    correctAnswerIndex: 1,
    explanation: "The phrase 'done the trick' means to achieve the desired result, referring to filtering the salt out of the water successfully."
  },
  {
    id: "58e8336d-c91b-4723-b2a7-f407f31ce0fe",
    question: "If you ________ yellow and blue, you get green.",
    choices: ["mixed", "mix", "had mixed", "would mix"],
    correctAnswerIndex: 1,
    explanation: "This is a Zero Conditional sentence expressing a general truth or fact. Both clauses use the Present Simple tense."
  },
  {
    id: "aa1a7c04-33f0-4cc6-a283-46a0c88f5fe3",
    question: "If I ________ more money, I would buy a brand new car.",
    choices: ["have", "had", "had had", "will have"],
    correctAnswerIndex: 1,
    explanation: "This is a Second Conditional sentence (If + Past Simple, would + base verb) describing a hypothetical present/future situation."
  },
  {
    id: "6de22021-39ce-45e0-bf6d-5afb1b4f28f3",
    question: "The text mentions that Aldi was lost at sea three times. Compare the duration of the first two times with the third. (2 points)",
    choices: ["The first two times were relatively short (a week and two days), while the third time lasted 49 days.", "The first two times lasted over a month, but the third was only a week.", "He was lost for exactly two weeks each time.", "The duration was roughly the same for all three times."],
    correctAnswerIndex: 0,
    explanation: "The first paragraph states: 'he was drifting for a week, and the second time for two days. However, on the third occasion, he was alone in the ocean for 49 long days.'"
  },
  {
    id: "e02b22fb-47a4-4041-914c-f3c123678556",
    question: "The neighborhood is filled with ________ residents who often donate large sums to charity.",
    choices: ["costly", "affluent", "lucrative", "extravagant"],
    correctAnswerIndex: 1,
    explanation: "'Affluent' means wealthy or having a lot of money, which makes sense for residents who donate large sums."
  },
  {
    id: "bd8a9598-ae0f-428f-8562-0f953fede7f9",
    question: "\"If I had studied harder, I would have passed the exam last year.\" The function of this Third Conditional sentence is:",
    choices: ["To talk about a present condition affecting a past result.", "To describe a possible future event.", "To describe an unreal or hypothetical situation in the past.", "To state a general fact that is always true."],
    correctAnswerIndex: 2,
    explanation: "The Third Conditional is used to imagine a different past. It expresses a hypothetical condition and its hypothetical result in the past."
  },
  {
    id: "0c5df332-dd0e-4cf0-b71e-5373bcf2615a",
    question: "Aldi's job was ________ , as he earned $134 a month, which was a good amount for his family.",
    choices: ["extravagant", "costly", "lucrative", "well-off"],
    correctAnswerIndex: 2,
    explanation: "'Lucrative' means producing a great deal of profit or making good money, which matches the description in the final paragraph."
  },
  {
    id: "25fce8bd-fb9e-4877-902b-94dfe06fd823",
    question: "\"If I won the lottery, I'd travel the world.\" What is the function of using the Second Conditional in this sentence?",
    choices: ["To talk about a past habit.", "To describe a real and likely future event.", "To describe an unreal or hypothetical situation in the present or future.", "To express a scientific truth."],
    correctAnswerIndex: 2,
    explanation: "The Second Conditional is used to talk about imaginary, unlikely, or hypothetical situations in the present or future."
  },
  {
    id: "1dee0ad8-2ac0-468f-84c5-02627f69634c",
    question: "What does the underlined pronoun \"he\" (in paragraph 3) refer to? (2 points)",
    choices: ["Aldi", "his boss", "the captain", "the rescuer"],
    correctAnswerIndex: 1,
    explanation: "The sentence says: 'his boss would come and rescue him, as he had done before.' 'He' refers to 'his boss'."
  },
  {
    id: "ab5ff61b-e452-42ee-ab62-707e20630fe8",
    question: "At some point, you will have to make a decision. The correct binomial that can replace 'At some point' in the above sentence is ________",
    choices: ["Sooner or later", "More or less", "Touch and go", "Ups and downs"],
    correctAnswerIndex: 0,
    explanation: "'Sooner or later' is a binomial meaning eventually or at some point in the future."
  },
  {
    id: "808112e8-1bf0-462c-b771-9eb98d26b839",
    question: "If you ________ ice in the sun, it melts.",
    choices: ["heat", "heated", "had heated", "would heat"],
    correctAnswerIndex: 0,
    explanation: "This is a Zero Conditional (expressing a general fact), which uses Present Simple in both clauses: 'If you heat... it melts'."
  },
  {
    id: "854f4f5f-aa57-48c6-8a45-c6d7d2780c41",
    question: "\"If it rains tomorrow, we will stay inside.\" The use of the First Conditional here indicates:",
    choices: ["A real and possible situation that is likely to happen.", "An impossible situation in the present.", "A hypothetical situation in the past.", "A general scientific fact."],
    correctAnswerIndex: 0,
    explanation: "The First Conditional is used to express possible conditions and their probable results in the future."
  },
  {
    id: "94a4c843-7041-490d-b2e6-d714854fba96",
    question: "The fishing trap Aldi worked on, called a ________ , is a hut that floats but is attached to the sea bed.",
    choices: ["rompong", "vessel", "canoe", "yacht"],
    correctAnswerIndex: 0,
    explanation: "In the second paragraph, the text states: 'working on a fishing trap, known as a rompong'."
  },
  {
    id: "378f4d32-cf61-4112-a188-92a97f0a96b0",
    question: "If I ________ the lottery, I would travel around the world.",
    choices: ["win", "won", "had won", "will win"],
    correctAnswerIndex: 1,
    explanation: "This is a Second Conditional sentence (If + past simple, would + base form)."
  },
  {
    id: "aafe7401-7d37-4e7e-acc5-23dd0536d9cf",
    question: "If he ________ daily, he will win the championship next month.",
    choices: ["trains", "trained", "had trained", "would train"],
    correctAnswerIndex: 0,
    explanation: "This is a First Conditional sentence. The if-clause takes the Present Simple tense ('trains')."
  },
  {
    id: "f0f40357-06c9-4231-9903-5409db5bcd52",
    question: "Critical Thinking: In your opinion, why is mental strength as important as physical skills in a survival situation? (4 points)",
    choices: ["Mental strength prevents panic and helps a person make rational decisions to survive.", "Mental strength is not as important as having the right equipment.", "It only matters if you are trained in survival techniques.", "Physical strength is the only thing that matters in a survival situation."],
    correctAnswerIndex: 0,
    explanation: "The text shows that mental strength (singing, reading, hope of seeing his parents) kept Aldi from giving up, which is crucial for survival."
  },
  {
    id: "96334567-d910-48bb-901f-03e5530172f8",
    question: "It is not easy to ________ your mistakes and say sorry to those you have hurt.",
    choices: ["offer", "take", "make", "acknowledge"],
    correctAnswerIndex: 3,
    explanation: "To 'acknowledge' a mistake means to admit or recognize it. You don't 'offer' or 'make' a mistake in this context, you acknowledge it."
  },
  {
    id: "849d821b-f077-4eca-b42a-fd1e21bbee93",
    question: "If it rains later today, we ________ at home.",
    choices: ["stayed", "will stay", "would stay", "had stayed"],
    correctAnswerIndex: 1,
    explanation: "This is a First Conditional sentence (If + Present Simple, will + base form). The correct choice is 'will stay'."
  },
  {
    id: "a9601699-efbc-4b1f-b975-ff3330f7cc98",
    question: "What was the specific cause that led to Aldi drifting away for the third time? (2 points)",
    choices: ["The rope attaching his floating trap to the seabed snapped.", "He fell asleep and his boat drifted away with the tide.", "The engine of his small boat broke down.", "A storm destroyed his navigation equipment."],
    correctAnswerIndex: 0,
    explanation: "The third paragraph clearly states: 'One day, the rope attaching his rompong to the bottom of the sea broke and he started to drift'."
  },
  {
    id: "bb215df6-c8bf-4399-abd9-e5816bae74a6",
    question: "When you touch a hot stove, you ________ your hand.",
    choices: ["burned", "would burn", "burn", "had burned"],
    correctAnswerIndex: 2,
    explanation: "This is a Zero Conditional representing a factual result (When/If + Present Simple, Present Simple)."
  },
  {
    id: "815504a3-f381-4819-bbf2-80168779d6d6",
    question: "Many parents are disappointed when their children engage in ________ spending on luxury items.",
    choices: ["well-off", "extravagant", "lucrative", "costly"],
    correctAnswerIndex: 1,
    explanation: "'Extravagant' spending means spending money carelessly or excessively, which fits the context of parents being disappointed."
  },
  {
    id: "0e57b90e-800c-4985-85e1-9ab940498b33",
    question: "Find a word in the text that means 'profitable' or 'making a lot of money'. (2 points)",
    choices: ["lucrative", "hazardous", "isolated", "makeshift"],
    correctAnswerIndex: 0,
    explanation: "In the final paragraph, 'lucrative' is used to describe his job which paid $134 a month."
  },
  {
    id: "27f47d46-1318-45c5-b9ff-f656c5273fcd",
    question: "The 49 days of isolation in the ocean ________ on Aldi's mental health.",
    choices: ["must have done the trick", "took its toll", "kept him going", "got off relatively lightly"],
    correctAnswerIndex: 1,
    explanation: "The phrase 'take its toll' means to cause damage or wear down over time. The passage mentions 'The isolation took its toll on him'."
  },
  {
    id: "a70108e6-3a95-4363-a92f-95802f99e2f1",
    question: "\"If you heat water to 100°C, it boils.\" What is the function of this sentence?",
    choices: ["To describe a hypothetical situation in the past.", "To describe a situation that the speaker considers is generally true.", "To give advice about a future event.", "To express regret about a present situation."],
    correctAnswerIndex: 1,
    explanation: "This is a Zero Conditional, which is used to state general truths or scientific facts."
  },
  {
    id: "18b2f738-1b07-433c-aef1-d748daee16b8",
    question: "Aldi used two creative methods to survive when his supplies ran out. What were they? (2 points)",
    choices: ["He caught fish and filtered sea water through his clothes.", "He found an island and gathered coconuts.", "He flagged down a passing boat and asked for supplies.", "He used a solar still to create fresh water."],
    correctAnswerIndex: 0,
    explanation: "Paragraph 4 explains: 'He caught fish and used parts of his wooden hut to make a fire and cook them' and 'he filtered the sea water through his clothes to reduce the amount of salt'."
  },
  {
    id: "701b5a3b-1492-4e94-b8a9-3e8f3514135c",
    question: "As soon as I heard about the international trip, I decided to ________ to go on it.",
    choices: ["a lucky break", "take the blame", "take its toll", "grab the chance"],
    correctAnswerIndex: 3,
    explanation: "'grab the chance' means to quickly accept a good opportunity, which fits perfectly with acting on hearing about an international trip."
  },
  {
    id: "462d88b2-3954-4383-8e12-391a17b05a98",
    question: "After a hazardous journey across the mountains, the hikers were relieved to get home ________ .",
    choices: ["ups and downs", "safe and sound", "give and take", "there and then"],
    correctAnswerIndex: 1,
    explanation: "The binomial 'safe and sound' means uninjured and out of danger."
  },
  {
    id: "45bc3222-ef16-472b-9c6b-6627d499c7d4",
    question: "\"When you arrive at the station, I will pick you up.\" Why is \"when\" used instead of \"if\" in this First Conditional sentence?",
    choices: ["Because the situation is impossible.", "Because the condition is more certain to happen.", "Because it is a past regret.", "Because it is a scientific law."],
    correctAnswerIndex: 1,
    explanation: "We use 'when' instead of 'if' when we consider the event to be certain to happen, whereas 'if' implies a possibility."
  },
  {
    id: "7b05c517-cc13-421e-891a-557e6f490bbc",
    question: "The company’s new marketing strategy was a complete ________ ; it didn't increase sales at all.",
    choices: ["masterstroke", "pay off", "flop", "flourish"],
    correctAnswerIndex: 2,
    explanation: "A 'flop' is a total failure, which accurately describes a strategy that didn't increase sales at all."
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
        explanation: update.explanation
      }
    });
  }
  console.log('Successfully updated questions');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
