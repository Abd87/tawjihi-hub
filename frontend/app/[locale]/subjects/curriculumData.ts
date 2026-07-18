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
  {
    id: 'btec-accounting',
    titleAr: 'المحاسبة',
    titleEn: 'Accounting',
    color: 'brand',
    iconType: 'landmark',
    track: 'btec',
    units: [
      {
        id: 'btec-accounting-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-accounting-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-accounting-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-accounting-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-accounting-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-accounting-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-agricultural-business',
    titleAr: 'الأعمال الزراعية',
    titleEn: 'Agricultural Business',
    color: 'emerald',
    iconType: 'sprout',
    track: 'btec',
    units: [
      {
        id: 'btec-agricultural-business-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-agricultural-business-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-agricultural-business-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-agricultural-business-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-agricultural-business-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-agricultural-business-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-animal-husbandry',
    titleAr: 'الإنتاج الحيواني',
    titleEn: 'Animal Husbandry',
    color: 'emerald',
    iconType: 'sprout',
    track: 'btec',
    units: [
      {
        id: 'btec-animal-husbandry-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-animal-husbandry-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-animal-husbandry-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-animal-husbandry-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-animal-husbandry-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-animal-husbandry-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-beauty-therapy',
    titleAr: 'العناية بالبشرة والتجميل',
    titleEn: 'Beauty Therapy',
    color: 'rose',
    iconType: 'heart',
    track: 'btec',
    units: [
      {
        id: 'btec-beauty-therapy-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-beauty-therapy-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-beauty-therapy-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-beauty-therapy-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-beauty-therapy-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-beauty-therapy-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-cad-design',
    titleAr: 'التصميم بمساعدة الحاسوب (CAD)',
    titleEn: 'CAD Design',
    color: 'slate',
    iconType: 'monitor',
    track: 'btec',
    units: [
      {
        id: 'btec-cad-design-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-cad-design-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-cad-design-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-cad-design-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-cad-design-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-cad-design-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-construction-coach',
    titleAr: 'البناء والتشييد',
    titleEn: 'Construction',
    color: 'orange',
    iconType: 'sprout',
    track: 'btec',
    units: [
      {
        id: 'btec-construction-coach-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-construction-coach-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-construction-coach-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-construction-coach-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-construction-coach-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-construction-coach-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-crop-production',
    titleAr: 'الإنتاج النباتي',
    titleEn: 'Crop Production',
    color: 'emerald',
    iconType: 'sprout',
    track: 'btec',
    units: [
      {
        id: 'btec-crop-production-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-crop-production-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-crop-production-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-crop-production-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-crop-production-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-crop-production-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-cybersecurity',
    titleAr: 'الأمن السيبراني',
    titleEn: 'Cybersecurity',
    color: 'slate',
    iconType: 'monitor',
    track: 'btec',
    units: [
      {
        id: 'btec-cybersecurity-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-cybersecurity-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-cybersecurity-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-cybersecurity-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-cybersecurity-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-cybersecurity-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-digital-media',
    titleAr: 'الإعلام الرقمي',
    titleEn: 'Digital Media',
    color: 'indigo',
    iconType: 'monitor',
    track: 'btec',
    units: [
      {
        id: 'btec-digital-media-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-digital-media-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-digital-media-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-digital-media-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-digital-media-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-digital-media-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-electronics',
    titleAr: 'الإلكترونيات',
    titleEn: 'Electronics',
    color: 'blue',
    iconType: 'atom',
    track: 'btec',
    units: [
      {
        id: 'btec-electronics-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-electronics-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-electronics-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-electronics-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-electronics-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-electronics-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-engineering-design',
    titleAr: 'التصميم الهندسي',
    titleEn: 'Engineering Design',
    color: 'orange',
    iconType: 'sprout',
    track: 'btec',
    units: [
      {
        id: 'btec-engineering-design-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-engineering-design-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-engineering-design-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-engineering-design-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-engineering-design-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-engineering-design-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-engineering-principles',
    titleAr: 'مبادئ الهندسة',
    titleEn: 'Engineering Principles',
    color: 'orange',
    iconType: 'sprout',
    track: 'btec',
    units: [
      {
        id: 'btec-engineering-principles-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-engineering-principles-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-engineering-principles-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-engineering-principles-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-engineering-principles-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-engineering-principles-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-entrepreneurship',
    titleAr: 'ريادة الأعمال',
    titleEn: 'Entrepreneurship',
    color: 'brand',
    iconType: 'landmark',
    track: 'btec',
    units: [
      {
        id: 'btec-entrepreneurship-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-entrepreneurship-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-entrepreneurship-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-entrepreneurship-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-entrepreneurship-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-entrepreneurship-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-event-management',
    titleAr: 'إدارة الفعاليات',
    titleEn: 'Event Management',
    color: 'amber',
    iconType: 'landmark',
    track: 'btec',
    units: [
      {
        id: 'btec-event-management-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-event-management-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-event-management-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-event-management-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-event-management-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-event-management-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-fine-arts',
    titleAr: 'الفنون الجميلة',
    titleEn: 'Fine Arts',
    color: 'rose',
    iconType: 'book',
    track: 'btec',
    units: [
      {
        id: 'btec-fine-arts-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-fine-arts-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-fine-arts-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-fine-arts-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-fine-arts-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-fine-arts-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-food-beverage',
    titleAr: 'إنتاج الطعام والشراب',
    titleEn: 'Food & Beverage',
    color: 'amber',
    iconType: 'flask',
    track: 'btec',
    units: [
      {
        id: 'btec-food-beverage-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-food-beverage-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-food-beverage-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-food-beverage-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-food-beverage-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-food-beverage-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-graphic-design',
    titleAr: 'التصميم الجرافيكي',
    titleEn: 'Graphic Design',
    color: 'indigo',
    iconType: 'monitor',
    track: 'btec',
    units: [
      {
        id: 'btec-graphic-design-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-graphic-design-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-graphic-design-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-graphic-design-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-graphic-design-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-graphic-design-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-hair-styling',
    titleAr: 'تصفيف الشعر',
    titleEn: 'Hair Styling',
    color: 'rose',
    iconType: 'heart',
    track: 'btec',
    units: [
      {
        id: 'btec-hair-styling-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-hair-styling-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-hair-styling-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-hair-styling-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-hair-styling-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-hair-styling-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-hospitality-mgmt',
    titleAr: 'إدارة الضيافة',
    titleEn: 'Hospitality Management',
    color: 'brand',
    iconType: 'landmark',
    track: 'btec',
    units: [
      {
        id: 'btec-hospitality-mgmt-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-hospitality-mgmt-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-hospitality-mgmt-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-hospitality-mgmt-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-hospitality-mgmt-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-hospitality-mgmt-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-makeup-artistry',
    titleAr: 'فن المكياج',
    titleEn: 'Makeup Artistry',
    color: 'rose',
    iconType: 'heart',
    track: 'btec',
    units: [
      {
        id: 'btec-makeup-artistry-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-makeup-artistry-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-makeup-artistry-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-makeup-artistry-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-makeup-artistry-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-makeup-artistry-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-marketing',
    titleAr: 'التسويق',
    titleEn: 'Marketing',
    color: 'brand',
    iconType: 'landmark',
    track: 'btec',
    units: [
      {
        id: 'btec-marketing-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-marketing-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-marketing-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-marketing-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-marketing-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-marketing-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-networking',
    titleAr: 'إدارة الشبكات',
    titleEn: 'Networking',
    color: 'slate',
    iconType: 'monitor',
    track: 'btec',
    units: [
      {
        id: 'btec-networking-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-networking-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-networking-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-networking-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-networking-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-networking-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-photography',
    titleAr: 'التصوير الفوتوغرافي',
    titleEn: 'Photography',
    color: 'indigo',
    iconType: 'monitor',
    track: 'btec',
    units: [
      {
        id: 'btec-photography-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-photography-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-photography-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-photography-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-photography-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-photography-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-programming',
    titleAr: 'البرمجة',
    titleEn: 'Programming',
    color: 'slate',
    iconType: 'code',
    track: 'btec',
    units: [
      {
        id: 'btec-programming-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-programming-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-programming-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-programming-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-programming-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-programming-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'btec-tourism-coach',
    titleAr: 'السياحة والسفر',
    titleEn: 'Tourism',
    color: 'amber',
    iconType: 'landmark',
    track: 'btec',
    units: [
      {
        id: 'btec-tourism-coach-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'btec-tourism-coach-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-tourism-coach-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'btec-tourism-coach-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'btec-tourism-coach-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'btec-tourism-coach-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-arabic',
    titleAr: 'اللغة العربية (مهارات) - الأول الثانوي',
    titleEn: 'Arabic Skills - G11',
    color: 'amber',
    iconType: 'book',
    track: 'academic',
    units: [
      {
        id: 'g11-arabic-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-arabic-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-arabic-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-arabic-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-arabic-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-arabic-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-biology',
    titleAr: 'العلوم الحياتية - الأول الثانوي',
    titleEn: 'Biology - G11',
    color: 'rose',
    iconType: 'heart',
    track: 'academic',
    units: [
      {
        id: 'g11-biology-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-biology-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-biology-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-biology-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-biology-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-biology-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-chemistry',
    titleAr: 'الكيمياء - الأول الثانوي',
    titleEn: 'Chemistry - G11',
    color: 'emerald',
    iconType: 'flask',
    track: 'academic',
    units: [
      {
        id: 'g11-chemistry-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-chemistry-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-chemistry-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-chemistry-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-chemistry-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-chemistry-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-digital-skills',
    titleAr: 'المهارات الرقمية - الأول الثانوي',
    titleEn: 'Digital Skills - G11',
    color: 'slate',
    iconType: 'monitor',
    track: 'academic',
    units: [
      {
        id: 'g11-digital-skills-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-digital-skills-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-digital-skills-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-digital-skills-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-digital-skills-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-digital-skills-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-earth-science',
    titleAr: 'علوم الأرض والبيئة - الأول الثانوي',
    titleEn: 'Earth Science - G11',
    color: 'emerald',
    iconType: 'globe',
    track: 'academic',
    units: [
      {
        id: 'g11-earth-science-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-earth-science-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-earth-science-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-earth-science-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-earth-science-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-earth-science-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-english',
    titleAr: 'اللغة الإنجليزية - الأول الثانوي',
    titleEn: 'English Language - G11',
    color: 'cyan',
    iconType: 'globe',
    track: 'academic',
    units: [
      {
        id: 'g11-english-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-english-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-english-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-english-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-english-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-english-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-financial-literacy',
    titleAr: 'الثقافة المالية - الأول الثانوي',
    titleEn: 'Financial Literacy - G11',
    color: 'green',
    iconType: 'landmark',
    track: 'academic',
    units: [
      {
        id: 'g11-financial-literacy-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-financial-literacy-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-financial-literacy-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-financial-literacy-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-financial-literacy-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-financial-literacy-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-islamic',
    titleAr: 'التربية الإسلامية - الأول الثانوي',
    titleEn: 'Islamic Education - G11',
    color: 'teal',
    iconType: 'landmark',
    track: 'academic',
    units: [
      {
        id: 'g11-islamic-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-islamic-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-islamic-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-islamic-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-islamic-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-islamic-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-jordan-history',
    titleAr: 'تاريخ الأردن - الأول الثانوي',
    titleEn: 'History of Jordan - G11',
    color: 'orange',
    iconType: 'landmark',
    track: 'academic',
    units: [
      {
        id: 'g11-jordan-history-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-jordan-history-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-jordan-history-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-jordan-history-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-jordan-history-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-jordan-history-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-math',
    titleAr: 'الرياضيات - الأول الثانوي',
    titleEn: 'Mathematics - G11',
    color: 'blue',
    iconType: 'calculator',
    track: 'academic',
    units: [
      {
        id: 'g11-math-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-math-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-math-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-math-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-math-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-math-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g11-physics',
    titleAr: 'الفيزياء - الأول الثانوي',
    titleEn: 'Physics - G11',
    color: 'indigo',
    iconType: 'atom',
    track: 'academic',
    units: [
      {
        id: 'g11-physics-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g11-physics-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-physics-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g11-physics-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g11-physics-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g11-physics-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-arabic',
    titleAr: 'اللغة العربية (مهارات) - التوجيهي',
    titleEn: 'Arabic Skills - G12',
    color: 'amber',
    iconType: 'book',
    track: 'academic',
    units: [
      {
        id: 'g12-arabic-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-arabic-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-arabic-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-arabic-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-arabic-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-arabic-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-arabic-specialized',
    titleAr: 'اللغة العربية (تخصص) - التوجيهي',
    titleEn: 'Arabic (Specialized) - G12',
    color: 'amber',
    iconType: 'book',
    track: 'academic',
    units: [
      {
        id: 'g12-arabic-specialized-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-arabic-specialized-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-arabic-specialized-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-arabic-specialized-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-arabic-specialized-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-arabic-specialized-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-biology',
    titleAr: 'العلوم الحياتية - التوجيهي',
    titleEn: 'Biology - G12',
    color: 'rose',
    iconType: 'heart',
    track: 'academic',
    units: [
      {
        id: 'g12-biology-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-biology-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-biology-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-biology-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-biology-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-biology-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-business-math',
    titleAr: 'رياضيات الأعمال - التوجيهي',
    titleEn: 'Business Math - G12',
    color: 'blue',
    iconType: 'calculator',
    track: 'academic',
    units: [
      {
        id: 'g12-business-math-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-business-math-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-business-math-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-business-math-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-business-math-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-business-math-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-chemistry',
    titleAr: 'الكيمياء - التوجيهي',
    titleEn: 'Chemistry - G12',
    color: 'emerald',
    iconType: 'flask',
    track: 'academic',
    units: [
      {
        id: 'g12-chemistry-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-chemistry-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-chemistry-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-chemistry-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-chemistry-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-chemistry-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-digital-skills',
    titleAr: 'المهارات الرقمية - التوجيهي',
    titleEn: 'Digital Skills - G12',
    color: 'slate',
    iconType: 'monitor',
    track: 'academic',
    units: [
      {
        id: 'g12-digital-skills-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-digital-skills-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-digital-skills-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-digital-skills-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-digital-skills-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-digital-skills-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-earth-science',
    titleAr: 'علوم الأرض والبيئة - التوجيهي',
    titleEn: 'Earth Science - G12',
    color: 'emerald',
    iconType: 'globe',
    track: 'academic',
    units: [
      {
        id: 'g12-earth-science-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-earth-science-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-earth-science-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-earth-science-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-earth-science-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-earth-science-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-english-advanced',
    titleAr: 'اللغة الإنجليزية (متقدم) - التوجيهي',
    titleEn: 'Advanced English - G12',
    color: 'cyan',
    iconType: 'globe',
    track: 'academic',
    units: [
      {
        id: 'g12-english-advanced-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-english-advanced-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-english-advanced-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-english-advanced-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-english-advanced-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-english-advanced-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-financial-literacy',
    titleAr: 'الثقافة المالية - التوجيهي',
    titleEn: 'Financial Literacy - G12',
    color: 'green',
    iconType: 'landmark',
    track: 'academic',
    units: [
      {
        id: 'g12-financial-literacy-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-financial-literacy-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-financial-literacy-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-financial-literacy-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-financial-literacy-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-financial-literacy-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-geography',
    titleAr: 'الجغرافيا - التوجيهي',
    titleEn: 'Geography - G12',
    color: 'lime',
    iconType: 'globe',
    track: 'academic',
    units: [
      {
        id: 'g12-geography-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-geography-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-geography-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-geography-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-geography-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-geography-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-history',
    titleAr: 'التاريخ - التوجيهي',
    titleEn: 'History - G12',
    color: 'orange',
    iconType: 'book',
    track: 'academic',
    units: [
      {
        id: 'g12-history-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-history-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-history-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-history-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-history-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-history-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-islamic',
    titleAr: 'التربية الإسلامية - التوجيهي',
    titleEn: 'Islamic Education - G12',
    color: 'teal',
    iconType: 'landmark',
    track: 'academic',
    units: [
      {
        id: 'g12-islamic-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-islamic-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-islamic-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-islamic-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-islamic-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-islamic-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-islamic-specialized',
    titleAr: 'العلوم الإسلامية (تخصص) - التوجيهي',
    titleEn: 'Islamic Sciences (Specialized) - G12',
    color: 'teal',
    iconType: 'landmark',
    track: 'academic',
    units: [
      {
        id: 'g12-islamic-specialized-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-islamic-specialized-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-islamic-specialized-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-islamic-specialized-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-islamic-specialized-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-islamic-specialized-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-jordan-history',
    titleAr: 'تاريخ الأردن - التوجيهي',
    titleEn: 'History of Jordan - G12',
    color: 'orange',
    iconType: 'landmark',
    track: 'academic',
    units: [
      {
        id: 'g12-jordan-history-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-jordan-history-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-jordan-history-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-jordan-history-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-jordan-history-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-jordan-history-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-math',
    titleAr: 'الرياضيات - التوجيهي',
    titleEn: 'Mathematics - G12',
    color: 'blue',
    iconType: 'calculator',
    track: 'academic',
    units: [
      {
        id: 'g12-math-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-math-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-math-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-math-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-math-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-math-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-philosophy',
    titleAr: 'الفلسفة - التوجيهي',
    titleEn: 'Philosophy - G12',
    color: 'slate',
    iconType: 'book',
    track: 'academic',
    units: [
      {
        id: 'g12-philosophy-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-philosophy-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-philosophy-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-philosophy-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-philosophy-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-philosophy-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-physics',
    titleAr: 'الفيزياء - التوجيهي',
    titleEn: 'Physics - G12',
    color: 'indigo',
    iconType: 'atom',
    track: 'academic',
    units: [
      {
        id: 'g12-physics-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-physics-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-physics-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-physics-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-physics-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-physics-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
  {
    id: 'g12-sociology',
    titleAr: 'علم الاجتماع - التوجيهي',
    titleEn: 'Sociology - G12',
    color: 'slate',
    iconType: 'book',
    track: 'academic',
    units: [
      {
        id: 'g12-sociology-u1',
        titleAr: 'الوحدة الأولى',
        titleEn: 'Unit 1',
        lessons: [
          { id: 'g12-sociology-u1-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-sociology-u1-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      },
      {
        id: 'g12-sociology-u2',
        titleAr: 'الوحدة الثانية',
        titleEn: 'Unit 2',
        lessons: [
          { id: 'g12-sociology-u2-l1', titleAr: 'الدرس الأول', titleEn: 'Lesson 1' },
          { id: 'g12-sociology-u2-l2', titleAr: 'الدرس الثاني', titleEn: 'Lesson 2' }
        ]
      }
    ]
  },
];
