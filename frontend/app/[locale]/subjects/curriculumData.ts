export type Lesson = {
  id: string;
  titleAr: string;
  titleEn: string;
};

export type Unit = {
  id: string;
  titleAr: string;
  titleEn: string;
  lessons: Lesson[];
};

export type Subject = {
  id: string;
  titleAr: string;
  titleEn: string;
  color: string;
  iconType: string;
  track: 'academic' | 'btec';
  units: Unit[];
};

export const subjectsData: Subject[] = [
  // ACADEMIC TRACK
  {
    id: 'math-sci',
    titleAr: 'الرياضيات (علمي/صناعي)',
    titleEn: 'Mathematics (Sci/Ind)',
    color: 'blue',
    iconType: 'calculator',
    track: 'academic',
    units: [
      {
        id: 'math-u1',
        titleAr: 'الوحدة الأولى: التفاضل',
        titleEn: 'Unit 1: Differentiation',
        lessons: [
          { id: 'math-u1-l1', titleAr: 'الاشتقاق', titleEn: 'Differentiation' },
          { id: 'math-u1-l2', titleAr: 'مشتقتا الضرب والقسمة', titleEn: 'Product and Quotient Rules' },
          { id: 'math-u1-l3', titleAr: 'قاعدة السلسلة', titleEn: 'Chain Rule' }
        ]
      },
      {
        id: 'math-u2',
        titleAr: 'الوحدة الثانية: تطبيقات التفاضل',
        titleEn: 'Unit 2: Applications of Differentiation',
        lessons: [
          { id: 'math-u2-l1', titleAr: 'المعدلات المرتبطة بالزمن', titleEn: 'Related Rates' },
          { id: 'math-u2-l2', titleAr: 'تطبيقات القيم القصوى', titleEn: 'Optimization' }
        ]
      },
      {
        id: 'math-u3',
        titleAr: 'الوحدة الثالثة: الأعداد المركبة',
        titleEn: 'Unit 3: Complex Numbers',
        lessons: [
          { id: 'math-u3-l1', titleAr: 'مفهوم الأعداد المركبة', titleEn: 'Concept of Complex Numbers' },
          { id: 'math-u3-l2', titleAr: 'العمليات على الأعداد المركبة', titleEn: 'Operations on Complex Numbers' }
        ]
      },
      {
        id: 'math-u4',
        titleAr: 'الوحدة الرابعة: التكامل',
        titleEn: 'Unit 4: Integration',
        lessons: [
          { id: 'math-u4-l1', titleAr: 'التكامل غير المحدود', titleEn: 'Indefinite Integration' },
          { id: 'math-u4-l2', titleAr: 'التكامل المحدود', titleEn: 'Definite Integration' },
          { id: 'math-u4-l3', titleAr: 'تطبيقات التكامل', titleEn: 'Applications of Integration' }
        ]
      }
    ]
  },
  {
    id: 'physics',
    titleAr: 'الفيزياء',
    titleEn: 'Physics',
    color: 'indigo',
    iconType: 'atom',
    track: 'academic',
    units: [
      {
        id: 'phys-u1',
        titleAr: 'الوحدة الأولى: الزخم الخطي والتصادمات',
        titleEn: 'Unit 1: Momentum & Collisions',
        lessons: [
          { id: 'phys-u1-l1', titleAr: 'الزخم الخطي والدفع', titleEn: 'Momentum and Impulse' },
          { id: 'phys-u1-l2', titleAr: 'التصادمات', titleEn: 'Collisions' }
        ]
      },
      {
        id: 'phys-u2',
        titleAr: 'الوحدة الثانية: الحركة الدورانية',
        titleEn: 'Unit 2: Rotational Motion',
        lessons: [
          { id: 'phys-u2-l1', titleAr: 'العزم والاتزان السكوني', titleEn: 'Torque and Static Equilibrium' },
          { id: 'phys-u2-l2', titleAr: 'الديناميكا الدورانية', titleEn: 'Rotational Dynamics' }
        ]
      },
      {
        id: 'phys-u3',
        titleAr: 'الوحدة الثالثة: التيار الكهربائي',
        titleEn: 'Unit 3: Electric Current',
        lessons: [
          { id: 'phys-u3-l1', titleAr: 'المقاومة والقوة الدافعة', titleEn: 'Resistance and EMF' },
          { id: 'phys-u3-l2', titleAr: 'قاعدتا كيرشوف', titleEn: 'Kirchhoff Laws' }
        ]
      }
    ]
  },
  {
    id: 'chemistry',
    titleAr: 'الكيمياء',
    titleEn: 'Chemistry',
    color: 'emerald',
    iconType: 'flask',
    track: 'academic',
    units: [
      {
        id: 'chem-u1',
        titleAr: 'الوحدة الأولى: الحموض والقواعد',
        titleEn: 'Unit 1: Acids & Bases',
        lessons: [
          { id: 'chem-u1-l1', titleAr: 'مفاهيم الحموض والقواعد', titleEn: 'Acid/Base Concepts' },
          { id: 'chem-u1-l2', titleAr: 'الرقم الهيدروجيني', titleEn: 'pH' }
        ]
      },
      {
        id: 'chem-u2',
        titleAr: 'الوحدة الثانية: التأكسد والاختزال',
        titleEn: 'Unit 2: Redox Reactions',
        lessons: [
          { id: 'chem-u2-l1', titleAr: 'مفهوم التأكسد والاختزال', titleEn: 'Redox Concept' },
          { id: 'chem-u2-l2', titleAr: 'الخلايا الغلفانية', titleEn: 'Galvanic Cells' }
        ]
      }
    ]
  },
  {
    id: 'biology',
    titleAr: 'العلوم الحياتية',
    titleEn: 'Biology',
    color: 'rose',
    iconType: 'heart',
    track: 'academic',
    units: [
      {
        id: 'bio-u1',
        titleAr: 'الوحدة الأولى: الوراثة',
        titleEn: 'Unit 1: Genetics',
        lessons: [
          { id: 'bio-u1-l1', titleAr: 'الوراثة المندلية', titleEn: 'Mendelian Genetics' },
          { id: 'bio-u1-l2', titleAr: 'الوراثة غير المندلية', titleEn: 'Non-Mendelian Genetics' }
        ]
      },
      {
        id: 'bio-u2',
        titleAr: 'الوحدة الثانية: تكنولوجيا الجينات',
        titleEn: 'Unit 2: Gene Technology',
        lessons: [
          { id: 'bio-u2-l1', titleAr: 'أدوات تكنولوجيا الجينات', titleEn: 'Tools of Gene Technology' },
          { id: 'bio-u2-l2', titleAr: 'تطبيقات تكنولوجيا الجينات', titleEn: 'Applications of Gene Technology' }
        ]
      }
    ]
  },
  {
    id: 'arabic-skills',
    titleAr: 'اللغة العربية (مهارات)',
    titleEn: 'Arabic Skills',
    color: 'amber',
    iconType: 'book',
    track: 'academic',
    units: [
      {
        id: 'ar-u1',
        titleAr: 'الوحدة الأولى: آيات من سورة آل عمران',
        titleEn: 'Unit 1: Aal Imran Verses',
        lessons: [
          { id: 'ar-u1-l1', titleAr: 'شرح الآيات', titleEn: 'Verses Explanation' },
          { id: 'ar-u1-l2', titleAr: 'القواعد: النداء', titleEn: 'Grammar: Calling' }
        ]
      },
      {
        id: 'ar-u2',
        titleAr: 'الوحدة الثانية: فن السرور',
        titleEn: 'Unit 2: Art of Joy',
        lessons: [
          { id: 'ar-u2-l1', titleAr: 'النص وتحليله', titleEn: 'Text Analysis' },
          { id: 'ar-u2-l2', titleAr: 'القواعد: اسم الفاعل واسم المفعول', titleEn: 'Grammar: Participles' }
        ]
      }
    ]
  },
  
  // BTEC TRACK
  {
    id: 'btec-it',
    titleAr: 'تكنولوجيا المعلومات (IT)',
    titleEn: 'Information Technology (IT)',
    color: 'slate',
    iconType: 'monitor',
    track: 'btec',
    units: [
      {
        id: 'bit-u1',
        titleAr: 'الوحدة الأولى: أنظمة المعلومات',
        titleEn: 'Unit 1: Information Systems',
        lessons: [
          { id: 'bit-u1-l1', titleAr: 'تطوير أنظمة المعلومات', titleEn: 'Developing Information Systems' },
          { id: 'bit-u1-l2', titleAr: 'إدارة قواعد البيانات', titleEn: 'Database Management' }
        ]
      },
      {
        id: 'bit-u2',
        titleAr: 'الوحدة الثانية: الشبكات',
        titleEn: 'Unit 2: Networking',
        lessons: [
          { id: 'bit-u2-l1', titleAr: 'أساسيات الشبكات', titleEn: 'Networking Basics' },
          { id: 'bit-u2-l2', titleAr: 'أمن الشبكات', titleEn: 'Network Security' }
        ]
      }
    ]
  },
  {
    id: 'btec-business',
    titleAr: 'الأعمال (Business)',
    titleEn: 'Business',
    color: 'brand',
    iconType: 'landmark',
    track: 'btec',
    units: [
      {
        id: 'bb-u1',
        titleAr: 'الوحدة الأولى: بيئة الأعمال',
        titleEn: 'Unit 1: Business Environment',
        lessons: [
          { id: 'bb-u1-l1', titleAr: 'هياكل الأعمال', titleEn: 'Business Structures' },
          { id: 'bb-u1-l2', titleAr: 'البيئة الاقتصادية', titleEn: 'Economic Environment' }
        ]
      },
      {
        id: 'bb-u2',
        titleAr: 'الوحدة الثانية: التسويق',
        titleEn: 'Unit 2: Marketing',
        lessons: [
          { id: 'bb-u2-l1', titleAr: 'حملات التسويق', titleEn: 'Marketing Campaigns' },
          { id: 'bb-u2-l2', titleAr: 'التسويق الرقمي', titleEn: 'Digital Marketing' }
        ]
      }
    ]
  },
  {
    id: 'btec-engineering',
    titleAr: 'الهندسة (Engineering)',
    titleEn: 'Engineering',
    color: 'orange',
    iconType: 'sprout',
    track: 'btec',
    units: [
      {
        id: 'be-u1',
        titleAr: 'الوحدة الأولى: مبادئ الهندسة',
        titleEn: 'Unit 1: Engineering Principles',
        lessons: [
          { id: 'be-u1-l1', titleAr: 'الرياضيات الهندسية', titleEn: 'Engineering Math' },
          { id: 'be-u1-l2', titleAr: 'الميكانيكا الأساسية', titleEn: 'Basic Mechanics' }
        ]
      },
      {
        id: 'be-u2',
        titleAr: 'الوحدة الثانية: التصميم الهندسي',
        titleEn: 'Unit 2: Engineering Design',
        lessons: [
          { id: 'be-u2-l1', titleAr: 'الرسم الهندسي بمساعدة الحاسوب (CAD)', titleEn: 'CAD Design' }
        ]
      }
    ]
  }
];
