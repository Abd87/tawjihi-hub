export interface Teacher {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  bioAr: string;
  bioEn: string;
  image: string;
  imageBgColor: string;
  stats: {
    studentsAr: string;
    studentsEn: string;
    experienceAr: string;
    experienceEn: string;
  };
}

export const teachersData: Teacher[] = [
  {
    id: 'abd',
    nameAr: 'أ. عبد',
    nameEn: 'Mr. Abd',
    roleAr: 'خبير لغة إنجليزية',
    roleEn: 'English Expert',
    bioAr: 'أستاذ خبير في تدريس اللغة الإنجليزية لمرحلة التوجيهي والـ BTEC. يتميز بأسلوب تفاعلي مبسط يضمن وصول المعلومة وتثبيتها من خلال التطبيق العملي والتدريب المستمر على أسئلة الوزارة.',
    bioEn: 'An expert English teacher for Tawjihi and BTEC students. Known for his interactive and simplified teaching style that ensures deep understanding through practical application and continuous training on ministerial questions.',
    image: '/teacher-abd.png',
    imageBgColor: 'bg-gradient-to-t from-orange-600 to-amber-500', // Orange background
    stats: {
      studentsAr: '+10,000 طالب',
      studentsEn: '10k+ Students',
      experienceAr: 'خبرة 10 سنوات',
      experienceEn: '10+ Years Exp',
    }
  }
];
