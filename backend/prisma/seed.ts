import { PrismaClient, Role, TrackType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Hash password for mock teachers
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('teacher123', salt);

  // 1. Create Mock Teachers
  const teacherBtec = await prisma.user.upsert({
    where: { email: 'btec.teacher@tawjihihub.com' },
    update: {},
    create: {
      email: 'btec.teacher@tawjihihub.com',
      passwordHash,
      nameAr: 'أ. محمد المهني',
      nameEn: 'Mr. Mohammad BTEC',
      role: Role.TEACHER,
    },
  });

  const teacherAcad = await prisma.user.upsert({
    where: { email: 'acad.teacher@tawjihihub.com' },
    update: {},
    create: {
      email: 'acad.teacher@tawjihihub.com',
      passwordHash,
      nameAr: 'أ. أحمد العلمي',
      nameEn: 'Dr. Ahmad Academic',
      role: Role.TEACHER,
    },
  });

  console.log('Mock Teachers created.');

  // 2. Create Tracks
  const trackBtec = await prisma.track.upsert({
    where: { key: TrackType.BTEC },
    update: {},
    create: {
      key: TrackType.BTEC,
      nameAr: 'مسار BTEC المهني والتقني',
      nameEn: 'BTEC Vocational & Technical Track',
    },
  });

  const trackAcad = await prisma.track.upsert({
    where: { key: TrackType.ACADEMIC },
    update: {},
    create: {
      key: TrackType.ACADEMIC,
      nameAr: 'المسار الأكاديمي (التوجيهي)',
      nameEn: 'Academic Track (Tawjihi)',
    },
  });

  console.log('Tracks seeded.');

  // 3. Create Subjects
  // --- BTEC Subjects ---
  const subBtecAr = await prisma.subject.upsert({
    where: { key: 'BTEC_ARABIC' },
    update: {},
    create: {
      key: 'BTEC_ARABIC',
      nameAr: 'اللغة العربية (المشتركة)',
      nameEn: 'Core Arabic',
      trackId: trackBtec.id,
    },
  });

  const subBtecEn = await prisma.subject.upsert({
    where: { key: 'BTEC_ENGLISH' },
    update: {},
    create: {
      key: 'BTEC_ENGLISH',
      nameAr: 'اللغة الإنجليزية (المشتركة)',
      nameEn: 'Core English',
      trackId: trackBtec.id,
    },
  });

  const subBtecHist = await prisma.subject.upsert({
    where: { key: 'BTEC_HISTORY' },
    update: {},
    create: {
      key: 'BTEC_HISTORY',
      nameAr: 'تاريخ الأردن (المشترك)',
      nameEn: 'Jordan History',
      trackId: trackBtec.id,
    },
  });

  const subBtecRel = await prisma.subject.upsert({
    where: { key: 'BTEC_RELIGION' },
    update: {},
    create: {
      key: 'BTEC_RELIGION',
      nameAr: 'التربية الإسلامية (المشتركة)',
      nameEn: 'Islamic Studies',
      trackId: trackBtec.id,
    },
  });

  // --- Academic Subjects ---
  const subAcadMath = await prisma.subject.upsert({
    where: { key: 'ACAD_MATH' },
    update: {},
    create: {
      key: 'ACAD_MATH',
      nameAr: 'الرياضيات العلمية والرياضية',
      nameEn: 'Scientific Mathematics',
      trackId: trackAcad.id,
    },
  });

  const subAcadPhys = await prisma.subject.upsert({
    where: { key: 'ACAD_PHYSICS' },
    update: {},
    create: {
      key: 'ACAD_PHYSICS',
      nameAr: 'الفيزياء التخصصية',
      nameEn: 'Advanced Physics',
      trackId: trackAcad.id,
    },
  });

  const subAcadChem = await prisma.subject.upsert({
    where: { key: 'ACAD_CHEMISTRY' },
    update: {},
    create: {
      key: 'ACAD_CHEMISTRY',
      nameAr: 'الكيمياء التخصصية',
      nameEn: 'Advanced Chemistry',
      trackId: trackAcad.id,
    },
  });

  const subAcadBio = await prisma.subject.upsert({
    where: { key: 'ACAD_BIOLOGY' },
    update: {},
    create: {
      key: 'ACAD_BIOLOGY',
      nameAr: 'العلوم الحياتية (الأحياء)',
      nameEn: 'Scientific Biology',
      trackId: trackAcad.id,
    },
  });

  console.log('Subjects seeded.');

  // Clean up existing courses before seeding to avoid duplicates
  await prisma.course.deleteMany();

  // 4. Create Courses
  // --- BTEC Courses ---
  const courseBtecHist = await prisma.course.create({
    data: {
      titleAr: 'تاريخ الأردن للتوجيهي والمهني BTEC',
      titleEn: 'Jordan History for Grade 12',
      descriptionAr: 'دورة شاملة ومبسطة لشرح منهاج تاريخ الأردن المعتمد لطلبة المسار المهني.',
      descriptionEn: 'Comprehensive guide covering Jordan historical events tailored for vocational students.',
      coverImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=60',
      teacherId: teacherBtec.id,
      subjectId: subBtecHist.id,
      lessons: {
        create: [
          {
            titleAr: 'المقدمة: استقلال المملكة الأردنية الهاشمية',
            titleEn: 'Introduction: Independence of Jordan',
            videoUrl: 'https://vimeo.com/example/independence',
            videoDuration: 1800,
            pdfUrl: 'https://tawjihihub.com/syllabus/history-ch1.pdf',
            order: 1,
          },
          {
            titleAr: 'الملوك الهاشميون وتأسيس الدولة',
            titleEn: 'Hashemite Kings and State Formation',
            videoUrl: 'https://vimeo.com/example/kings',
            videoDuration: 2200,
            pdfUrl: 'https://tawjihihub.com/syllabus/history-ch2.pdf',
            order: 2,
          },
        ],
      },
    },
  });

  const courseBtecAr = await prisma.course.create({
    data: {
      titleAr: 'اللغة العربية المشتركة BTEC',
      titleEn: 'Core Arabic for Grade 12',
      descriptionAr: 'منهاج اللغة العربية المشترك لتنمية مهارات التواصل اللغوي والأدبي.',
      descriptionEn: 'Core Arabic communication, grammar, and literature syllabus for vocational students.',
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=60',
      teacherId: teacherBtec.id,
      subjectId: subBtecAr.id,
      lessons: {
        create: [
          {
            titleAr: 'مهارات الاتصال وقواعد الجملة العربية',
            titleEn: 'Arabic Sentence Structure & Communication',
            videoUrl: 'https://vimeo.com/example/arabic-grammar',
            videoDuration: 2000,
            pdfUrl: 'https://tawjihihub.com/syllabus/arabic-ch1.pdf',
            order: 1,
          }
        ]
      }
    }
  });

  const courseBtecEn = await prisma.course.create({
    data: {
      titleAr: 'اللغة الإنجليزية المشتركة BTEC',
      titleEn: 'Core English for Grade 12 BTEC',
      descriptionAr: 'منهاج اللغة الإنجليزية المشترك لتعزيز مهارات القراءة والكتابة والمحادثة المهنية.',
      descriptionEn: 'Focus on communication, core grammar structures and vocational English writing.',
      coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=60',
      teacherId: teacherBtec.id,
      subjectId: subBtecEn.id,
      lessons: {
        create: [
          {
            titleAr: 'قواعد اللغة الإنجليزية: الأزمنة الأساسية',
            titleEn: 'English Grammar: Basic Tenses',
            videoUrl: 'https://vimeo.com/example/english-tenses',
            videoDuration: 2400,
            pdfUrl: 'https://tawjihihub.com/syllabus/english-ch1.pdf',
            order: 1,
          }
        ]
      }
    }
  });

  const courseBtecRel = await prisma.course.create({
    data: {
      titleAr: 'التربية الإسلامية - المستوى الثالث',
      titleEn: 'Islamic Studies for Grade 12 BTEC',
      descriptionAr: 'شرح مبسط وواضح للمنهاج المقرر للتربية الإسلامية والثقافة الدينية.',
      descriptionEn: 'Islamic concepts, jurisprudence, and ethical structures for core education.',
      coverImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=60',
      teacherId: teacherBtec.id,
      subjectId: subBtecRel.id,
      lessons: {
        create: [
          {
            titleAr: 'التربية الإسلامية: عقيدة وأخلاق',
            titleEn: 'Islamic Creed & General Ethics',
            videoUrl: 'https://vimeo.com/example/islamic-ethics',
            videoDuration: 1900,
            pdfUrl: 'https://tawjihihub.com/syllabus/religion-ch1.pdf',
            order: 1,
          }
        ]
      }
    }
  });

  // --- Academic Courses ---
  const courseAcadMath = await prisma.course.create({
    data: {
      titleAr: 'الرياضيات العلمية - الفصل الأول',
      titleEn: 'Scientific Calculus - Term 1',
      descriptionAr: 'شرح مكثف وتفصيلي للنهايات والاشتقاق وتطبيقات التفاضل.',
      descriptionEn: 'Rigorous course on limits, derivatives and applications of differentiation.',
      coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60',
      teacherId: teacherAcad.id,
      subjectId: subAcadMath.id,
      lessons: {
        create: [
          {
            titleAr: 'مفهوم النهايات والاتصال',
            titleEn: 'Introduction to Limits and Continuity',
            videoUrl: 'https://vimeo.com/example/limits',
            videoDuration: 3000,
            pdfUrl: 'https://tawjihihub.com/syllabus/math-limits.pdf',
            order: 1,
          },
          {
            titleAr: 'قواعد الاشتقاق الأساسية',
            titleEn: 'Basic Rules of Differentiation',
            videoUrl: 'https://vimeo.com/example/diff',
            videoDuration: 2700,
            pdfUrl: 'https://tawjihihub.com/syllabus/math-diff.pdf',
            order: 2,
          },
        ],
      },
    },
  });

  const courseAcadPhys = await prisma.course.create({
    data: {
      titleAr: 'الفيزياء العلمية - الكهرباء والمغناطيسية',
      titleEn: 'Scientific Physics - Electromagnetism',
      descriptionAr: 'تغطية شاملة لقوانين كيرشوف، المجال المغناطيسي، والتيار المتردد.',
      descriptionEn: 'Complete breakdown of Kirchhoffs laws, magnetic fields, and electromagnetic induction.',
      coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=60',
      teacherId: teacherAcad.id,
      subjectId: subAcadPhys.id,
      lessons: {
        create: [
          {
            titleAr: 'قوانين كيرشوف وتحليل الدارات',
            titleEn: 'Kirchhoffs Laws & Circuit Analysis',
            videoUrl: 'https://vimeo.com/example/kirchhoff',
            videoDuration: 3200,
            pdfUrl: 'https://tawjihihub.com/syllabus/phys-kirchhoff.pdf',
            order: 1,
          },
        ],
      },
    },
  });

  const courseAcadChem = await prisma.course.create({
    data: {
      titleAr: 'الكيمياء التخصصية - سرعة التفاعلات',
      titleEn: 'Advanced Chemistry - Reaction Rates',
      descriptionAr: 'دراسة سرعة التفاعلات الكيميائية، الاتزان الديناميكي وحسابات الأحماض والقواعد.',
      descriptionEn: 'Chemical kinetics, dynamic equilibrium, and pH calculation guides.',
      coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60',
      teacherId: teacherAcad.id,
      subjectId: subAcadChem.id,
      lessons: {
        create: [
          {
            titleAr: 'سرعة التفاعل الكيميائي ونظرية التصادم',
            titleEn: 'Reaction Rates & Collision Theory',
            videoUrl: 'https://vimeo.com/example/chem-rates',
            videoDuration: 2800,
            pdfUrl: 'https://tawjihihub.com/syllabus/chem-ch1.pdf',
            order: 1,
          }
        ]
      }
    }
  });

  const courseAcadBio = await prisma.course.create({
    data: {
      titleAr: 'العلوم الحياتية - الأحياء التخصصية',
      titleEn: 'Scientific Biology - Genetics',
      descriptionAr: 'وراثة الصفات الجينية، طفرات الكروموسومات وتكنولوجيا الجينات الحديثة.',
      descriptionEn: 'Inheritance of traits, chromosome mutations, and modern gene technology.',
      coverImage: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&auto=format&fit=crop&q=60',
      teacherId: teacherAcad.id,
      subjectId: subAcadBio.id,
      lessons: {
        create: [
          {
            titleAr: 'قوانين مندل للوراثة',
            titleEn: 'Mendelian Genetics & Inheritance Laws',
            videoUrl: 'https://vimeo.com/example/biology-genetics',
            videoDuration: 2900,
            pdfUrl: 'https://tawjihihub.com/syllabus/bio-ch1.pdf',
            order: 1,
          }
        ]
      }
    }
  });

  console.log('Courses & Lessons seeded.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
