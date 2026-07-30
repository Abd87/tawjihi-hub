export type Flashcard = {
  id: string;
  frontAr: string;
  frontEn: string;
  backAr: string;
  backEn: string;
};

export type SpotMistakeQuestion = {
  id: string;
  sentence: string; // The full sentence with mistake
  wrongWordIndex: number; // 0-indexed word that is wrong
  correction: string; // The correct word
  explanationAr: string;
  explanationEn: string;
};

export type FoundationModule = {
  id: string;
  titleAr: string;
  titleEn: string;
  type: 'FLASHCARDS' | 'SPOT_MISTAKE';
  descriptionAr: string;
  descriptionEn: string;
  flashcards?: Flashcard[];
  spotMistakes?: SpotMistakeQuestion[];
};

export const grammarFoundationData: FoundationModule[] = [
  {
    id: 'mod-1',
    titleAr: 'أساسيات الأفعال المساعدة',
    titleEn: 'Auxiliary Verbs Basics',
    type: 'FLASHCARDS',
    descriptionAr: 'تعرف على أهم الأفعال المساعدة التي ستحتاجها لبناء الجمل الصحيحة.',
    descriptionEn: 'Learn the most important auxiliary verbs needed to build correct sentences.',
    flashcards: [
      {
        id: 'fc-1',
        frontAr: 'الفعل (يكون) مع المفرد الغائب (He, She, It)',
        frontEn: 'The verb "to be" with third-person singular (He, She, It)',
        backAr: 'Is (يكون)',
        backEn: 'Is'
      },
      {
        id: 'fc-2',
        frontAr: 'الفعل (يملك) مع الجمع و (I, You)',
        frontEn: 'The verb "to have" with plural and (I, You)',
        backAr: 'Have (يملك)',
        backEn: 'Have'
      },
      {
        id: 'fc-3',
        frontAr: 'الماضي من الفعل (Do)',
        frontEn: 'The past tense of the verb "Do"',
        backAr: 'Did (فعل)',
        backEn: 'Did'
      },
      {
        id: 'fc-4',
        frontAr: 'الفعل (يكون) في الماضي مع الجمع',
        frontEn: 'The verb "to be" in the past tense with plural',
        backAr: 'Were (كانوا)',
        backEn: 'Were'
      }
    ]
  },
  {
    id: 'mod-2',
    titleAr: 'تحدي الأخطاء: المضارع البسيط',
    titleEn: 'Spot the Mistake: Present Simple',
    type: 'SPOT_MISTAKE',
    descriptionAr: 'اقرأ الجملة واضغط على الكلمة الخاطئة.',
    descriptionEn: 'Read the sentence and click on the wrong word.',
    spotMistakes: [
      {
        id: 'sm-1',
        sentence: "He don't like playing football.",
        wrongWordIndex: 1, // "don't"
        correction: "doesn't",
        explanationAr: 'مع المفرد (He, She, It) نستخدم doesn\'t وليس don\'t.',
        explanationEn: 'With singular subjects (He, She, It) we use "doesn\'t", not "don\'t".'
      },
      {
        id: 'sm-2',
        sentence: "They is going to the market every Friday.",
        wrongWordIndex: 1, // "is"
        correction: "are",
        explanationAr: 'الفاعل They جمع، لذلك يأخذ الفعل المساعد are.',
        explanationEn: 'The subject "They" is plural, so it takes the auxiliary verb "are".'
      },
      {
        id: 'sm-3',
        sentence: "She read a book every night before sleeping.",
        wrongWordIndex: 1, // "read"
        correction: "reads",
        explanationAr: 'في المضارع البسيط، نضيف حرف s للفعل عندما يكون الفاعل مفرداً.',
        explanationEn: 'In Present Simple, we add "s" to the verb when the subject is singular.'
      }
    ]
  },
  {
    id: 'mod-3',
    titleAr: 'تحدي الأخطاء: الماضي البسيط',
    titleEn: 'Spot the Mistake: Past Simple',
    type: 'SPOT_MISTAKE',
    descriptionAr: 'اكتشف الخطأ في الجمل التي تتحدث عن الماضي.',
    descriptionEn: 'Find the mistake in sentences talking about the past.',
    spotMistakes: [
      {
        id: 'sm-4',
        sentence: "I didn't went to the school yesterday.",
        wrongWordIndex: 2, // "went"
        correction: "go",
        explanationAr: 'بعد الفعل المساعد didn\'t يجب أن يأتي الفعل مجرداً (التصريف الأول).',
        explanationEn: 'After the auxiliary verb "didn\'t", the main verb must be in its base form (infinitive).'
      },
      {
        id: 'sm-5',
        sentence: "We was very happy with the results.",
        wrongWordIndex: 1, // "was"
        correction: "were",
        explanationAr: 'الضمير We يأخذ were في صيغة الماضي وليس was.',
        explanationEn: 'The pronoun "We" takes "were" in the past tense, not "was".'
      }
    ]
  }
];
