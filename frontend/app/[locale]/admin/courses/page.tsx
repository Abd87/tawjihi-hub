'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Plus, Trash2, BookOpen, Save,
  ChevronDown, Loader2, CheckCircle2, Video, FileText,
  GraduationCap, Edit3, X, PlusCircle, Eye, EyeOff,
  Lock, Unlock, AlertCircle, Users, Calendar,
} from 'lucide-react';

interface InlineQuestion {
  id: string;
  textAr: string;
  textEn: string;
  choices: { textAr: string; textEn: string; isCorrect: boolean }[];
  explanationAr: string;
  explanationEn: string;
}

interface Lesson {
  id: string;
  titleAr: string;
  titleEn: string;
  videoUrl: string;
  pdfUrl: string;
  durationMinutes: number;
  order: number;
  locked: boolean;
  questions?: InlineQuestion[];
}

interface LiveSession {
  id: string;
  titleAr: string;
  titleEn: string;
  zoomLink: string;
  startTime: string; // ISO string
  durationMinutes: number;
}

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  track: 'BTEC' | 'ACADEMIC';
  semester: 1 | 2;
  subjectAr: string;
  subjectEn: string;
  teacherId: string;
  teacherNameAr: string;
  teacherNameEn: string;
  thumbnailUrl: string;
  lessons: Lesson[];
  liveSessions?: LiveSession[];
  published: boolean;
  locked: boolean;
  createdAt: string;
}

interface AppUser {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';
  trackType?: 'BTEC' | 'ACADEMIC';
  assignedCourseIds?: string[];
  createdAt: string;
}

/* ─── Storage keys ──────────────────────────────────────────────────────── */
const COURSES_KEY = 'admin-courses';
const USERS_KEY = 'admin-users';

/* ─── Default seed data ─────────────────────────────────────────────────── */
const defaultCourses: Course[] = [
  {
    id: 'mock-btec-arabic-s1',
    titleAr: 'اللغة العربية - BTEC الفصل الأول',
    titleEn: 'Arabic Language - BTEC S1',
    descriptionAr: 'دورة شاملة في اللغة العربية لطلاب مسار BTEC للفصل الدراسي الأول.',
    descriptionEn: 'Comprehensive Arabic course for BTEC track - First Semester.',
    track: 'BTEC', semester: 1, subjectAr: 'اللغة العربية', subjectEn: 'Arabic Language',
    teacherId: 'teacher-001', teacherNameAr: 'أ. محمد المهني', teacherNameEn: 'Mr. Mohammad',
    thumbnailUrl: '', published: true, locked: false,
    createdAt: new Date().toISOString(),
    lessons: [
      { id: 'l-ba1', titleAr: 'مقدمة في الأدب العربي', titleEn: 'Intro to Arabic Literature', videoUrl: '', pdfUrl: '', durationMinutes: 45, order: 1, locked: false },
      { id: 'l-ba2', titleAr: 'النحو والصرف', titleEn: 'Grammar & Morphology', videoUrl: '', pdfUrl: '', durationMinutes: 60, order: 2, locked: false },
    ],
  },
  {
    id: 'mock-btec-english-s1',
    titleAr: 'اللغة الإنجليزية - BTEC الفصل الأول',
    titleEn: 'English Language - BTEC S1',
    descriptionAr: 'دورة اللغة الإنجليزية لطلاب مسار BTEC للفصل الدراسي الأول.',
    descriptionEn: 'English Language course for BTEC track - First Semester.',
    track: 'BTEC', semester: 1, subjectAr: 'اللغة الإنجليزية', subjectEn: 'English Language',
    teacherId: 'teacher-001', teacherNameAr: 'أ. محمد المهني', teacherNameEn: 'Mr. Mohammad',
    thumbnailUrl: '', published: true, locked: false,
    createdAt: new Date().toISOString(),
    lessons: [
      { id: 'l-be1', titleAr: 'المهارات الأربع', titleEn: 'The Four Skills', videoUrl: '', pdfUrl: '', durationMinutes: 50, order: 1, locked: false },
    ],
  },
  {
    id: 'mock-btec-history-s1',
    titleAr: 'التاريخ الأردني - BTEC الفصل الأول',
    titleEn: 'Jordan History - BTEC S1',
    descriptionAr: 'التاريخ الأردني والحضارة لطلاب مسار BTEC للفصل الأول.',
    descriptionEn: 'Jordanian History and Civilization for BTEC - Semester 1.',
    track: 'BTEC', semester: 1, subjectAr: 'التاريخ', subjectEn: 'History',
    teacherId: 'teacher-001', teacherNameAr: 'أ. محمد المهني', teacherNameEn: 'Mr. Mohammad',
    thumbnailUrl: '', published: false, locked: false,
    createdAt: new Date().toISOString(), lessons: [],
  },
  {
    id: 'mock-btec-islamic-s2',
    titleAr: 'التربية الإسلامية - BTEC الفصل الثاني',
    titleEn: 'Islamic Education - BTEC S2',
    descriptionAr: 'التربية الإسلامية لطلاب مسار BTEC للفصل الدراسي الثاني.',
    descriptionEn: 'Islamic Education for BTEC track - Second Semester.',
    track: 'BTEC', semester: 2, subjectAr: 'التربية الإسلامية', subjectEn: 'Islamic Education',
    teacherId: 'teacher-001', teacherNameAr: 'أ. محمد المهني', teacherNameEn: 'Mr. Mohammad',
    thumbnailUrl: '', published: false, locked: true,
    createdAt: new Date().toISOString(), lessons: [],
  },
  {
    id: 'mock-acad-math-s1',
    titleAr: 'الرياضيات العلمية - أكاديمي الفصل الأول',
    titleEn: 'Mathematics - Academic S1',
    descriptionAr: 'الرياضيات للصف الثاني عشر العلمي — التفاضل والتكامل والجبر.',
    descriptionEn: 'Grade 12 Scientific Math — Calculus, Algebra, and more.',
    track: 'ACADEMIC', semester: 1, subjectAr: 'الرياضيات', subjectEn: 'Mathematics',
    teacherId: 'teacher-002', teacherNameAr: 'أ. أحمد العلمي', teacherNameEn: 'Dr. Ahmad',
    thumbnailUrl: '', published: true, locked: false,
    createdAt: new Date().toISOString(),
    lessons: [
      { id: 'l-am1', titleAr: 'حدود الدوال', titleEn: 'Limits of Functions', videoUrl: '', pdfUrl: '', durationMinutes: 50, order: 1, locked: false },
      { id: 'l-am2', titleAr: 'المشتقات والتفاضل', titleEn: 'Derivatives & Differentiation', videoUrl: '', pdfUrl: '', durationMinutes: 55, order: 2, locked: false },
      { id: 'l-am3', titleAr: 'التكامل', titleEn: 'Integration', videoUrl: '', pdfUrl: '', durationMinutes: 60, order: 3, locked: true },
    ],
  },
  {
    id: 'mock-acad-physics-s1',
    titleAr: 'الفيزياء - أكاديمي الفصل الأول',
    titleEn: 'Physics - Academic S1',
    descriptionAr: 'الفيزياء للصف الثاني عشر العلمي — الميكانيكا والحركة والطاقة.',
    descriptionEn: 'Grade 12 Physics — Mechanics, Motion, and Energy.',
    track: 'ACADEMIC', semester: 1, subjectAr: 'الفيزياء', subjectEn: 'Physics',
    teacherId: 'teacher-002', teacherNameAr: 'أ. أحمد العلمي', teacherNameEn: 'Dr. Ahmad',
    thumbnailUrl: '', published: true, locked: false,
    createdAt: new Date().toISOString(),
    lessons: [
      { id: 'l-ap1', titleAr: 'قوانين نيوتن', titleEn: "Newton's Laws", videoUrl: '', pdfUrl: '', durationMinutes: 55, order: 1, locked: false },
    ],
  },
  {
    id: 'mock-acad-chemistry-s1',
    titleAr: 'الكيمياء - أكاديمي الفصل الأول',
    titleEn: 'Chemistry - Academic S1',
    descriptionAr: 'الكيمياء العضوية وغير العضوية للصف الثاني عشر.',
    descriptionEn: 'Organic and Inorganic Chemistry for Grade 12.',
    track: 'ACADEMIC', semester: 1, subjectAr: 'الكيمياء', subjectEn: 'Chemistry',
    teacherId: 'teacher-002', teacherNameAr: 'أ. أحمد العلمي', teacherNameEn: 'Dr. Ahmad',
    thumbnailUrl: '', published: false, locked: false,
    createdAt: new Date().toISOString(), lessons: [],
  },
  {
    id: 'mock-acad-biology-s2',
    titleAr: 'الأحياء - أكاديمي الفصل الثاني',
    titleEn: 'Biology - Academic S2',
    descriptionAr: 'علم الأحياء للصف الثاني عشر — الخلية والوراثة والنظم البيئية.',
    descriptionEn: 'Grade 12 Biology — Cells, Genetics, and Ecosystems.',
    track: 'ACADEMIC', semester: 2, subjectAr: 'الأحياء', subjectEn: 'Biology',
    teacherId: 'teacher-002', teacherNameAr: 'أ. أحمد العلمي', teacherNameEn: 'Dr. Ahmad',
    thumbnailUrl: '', published: false, locked: true,
    createdAt: new Date().toISOString(), lessons: [],
  },
];

const defaultUsers: AppUser[] = [
  { id: 'teacher-001', nameAr: 'أ. محمد المهني', nameEn: 'Mr. Mohammad', email: 'btec.teacher@tawjihi.jo', password: 'teacher123', role: 'TEACHER', assignedCourseIds: [], createdAt: new Date().toISOString() },
  { id: 'teacher-002', nameAr: 'أ. أحمد العلمي', nameEn: 'Dr. Ahmad', email: 'acad.teacher@tawjihi.jo', password: 'teacher123', role: 'TEACHER', assignedCourseIds: [], createdAt: new Date().toISOString() },
];

/* ─── Storage helpers ───────────────────────────────────────────────────── */
function loadCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(COURSES_KEY, JSON.stringify(defaultCourses));
    return defaultCourses;
  } catch { return defaultCourses; }
}

function saveCourses(courses: Course[]) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  // Fire and forget sync to the live database
  fetch('/api/admin/courses/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ courses })
  }).catch(err => console.error('Failed to sync to database:', err));
}

function loadUsers(): AppUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  } catch { return defaultUsers; }
}

function saveUsers(users: AppUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ─── Empty factories ───────────────────────────────────────────────────── */
const emptyLesson = (): Lesson => ({
  id: `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  titleAr: '', titleEn: '', videoUrl: '', pdfUrl: '', durationMinutes: 45, order: 1, locked: false,
  questions: [],
});

const emptyLiveSession = (): LiveSession => ({
  id: `live-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  titleAr: '', titleEn: '', zoomLink: '', startTime: new Date().toISOString().slice(0, 16), durationMinutes: 60,
});

const emptyCourse = (teachers: AppUser[]): Course => ({
  id: `course-${Date.now()}`,
  titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '',
  track: 'ACADEMIC', semester: 1,
  subjectAr: '', subjectEn: '',
  teacherId: teachers[0]?.id || '',
  teacherNameAr: teachers[0]?.nameAr || '',
  teacherNameEn: teachers[0]?.nameEn || '',
  thumbnailUrl: '', published: false, locked: false,
  createdAt: new Date().toISOString(), lessons: [], liveSessions: [],
});

/* ─── Toast ─────────────────────────────────────────────────────────────── */
type ToastState = { msg: string; type: 'success' | 'error' } | null;

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function AdminCoursesPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<AppUser[]>([]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Course | null>(null);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourse, setNewCourse] = useState<Course | null>(null);

  const [toast, setToast] = useState<ToastState>(null);
  const [filterTrack, setFilterTrack] = useState<'ALL' | 'BTEC' | 'ACADEMIC'>('ALL');
  const [filterSemester, setFilterSemester] = useState<'ALL' | 1 | 2>('ALL');

  /* ── Auth ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const token = localStorage.getItem('token');
    let user: AppUser | null = null;
    try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch { /* noop */ }

    if (!token || !user) { router.replace('/login'); return; }
    if (user.role !== 'ADMIN' && user.role !== 'TEACHER') { router.replace('/dashboard'); return; }

    const allCourses = loadCourses();

    setCurrentUser(user);
    setIsAdmin(user.role === 'ADMIN');

    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        const teacherList = data.users ? data.users.filter((u: any) => u.role === 'TEACHER') : [];
        setTeachers(teacherList);

        // ADMIN sees all; TEACHER sees only their own
        const visible = user.role === 'ADMIN'
          ? allCourses
          : allCourses.filter((c: any) => c.teacherId === user!.id);

        setCourses(visible);
        setNewCourse(emptyCourse(teacherList));
        setAuthorized(true);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setAuthorized(true);
        setLoading(false);
      });
  }, [router]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── CRUD ──────────────────────────────────────────────────────────────── */
  const persist = (updated: Course[]) => {
    // ADMIN saves all; teacher only sees their own slice, but we must merge with full list
    if (isAdmin) {
      setCourses(updated);
      saveCourses(updated);
    } else {
      const all = loadCourses();
      const merged = all.map(c => updated.find(u => u.id === c.id) || c);
      saveCourses(merged);
      setCourses(updated);
    }
  };

  const handleDeleteCourse = (id: string) => {
    if (!isAdmin) return;
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذه الدورة؟' : 'Delete this course?')) return;
    const updated = courses.filter(c => c.id !== id);
    persist(updated);
    showToast(isRtl ? 'تم حذف الدورة' : 'Course deleted');
  };

  const handleTogglePublish = (id: string) => {
    if (!isAdmin) return;
    const updated = courses.map(c => c.id === id ? { ...c, published: !c.published } : c);
    persist(updated);
  };

  const handleToggleLock = (id: string) => {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    if (!isAdmin && course.teacherId !== currentUser?.id) return;
    const updated = courses.map(c => c.id === id ? { ...c, locked: !c.locked } : c);
    persist(updated);
    const now = courses.find(c => c.id === id)!;
    showToast(now.locked
      ? (isRtl ? 'تم فتح الدورة' : 'Course unlocked')
      : (isRtl ? 'تم قفل الدورة' : 'Course locked'));
  };

  /* Edit */
  const startEdit = (course: Course) => {
    if (!isAdmin && course.teacherId !== currentUser?.id) return;
    setEditDraft(JSON.parse(JSON.stringify(course)));
    setEditingId(course.id);
    setExpandedId(course.id);
  };
  const cancelEdit = () => { setEditingId(null); setEditDraft(null); };
  const saveEdit = () => {
    if (!editDraft) return;
    if (!editDraft.titleAr || !editDraft.titleEn) {
      showToast(isRtl ? 'يرجى إدخال عنوان الدورة' : 'Course title is required', 'error'); return;
    }
    const updated = courses.map(c => c.id === editDraft.id ? editDraft : c);
    persist(updated);
    setEditingId(null); setEditDraft(null);
    showToast(isRtl ? 'تم حفظ التغييرات' : 'Changes saved');
  };

  /* Draft lesson helpers */
  const addLessonToDraft = () => {
    if (!editDraft) return;
    const l = emptyLesson(); l.order = editDraft.lessons.length + 1;
    setEditDraft({ ...editDraft, lessons: [...editDraft.lessons, l] });
  };
  const updateDraftLesson = (lid: string, field: keyof Lesson, value: any) => {
    if (!editDraft) return;
    setEditDraft({ ...editDraft, lessons: editDraft.lessons.map(l => l.id === lid ? { ...l, [field]: value } : l) });
  };
  const deleteDraftLesson = (lid: string) => {
    if (!editDraft) return;
    setEditDraft({ ...editDraft, lessons: editDraft.lessons.filter(l => l.id !== lid) });
  };

  /* Add course */
  const handleAddCourse = () => {
    if (!isAdmin || !newCourse) return;
    if (!newCourse.titleAr || !newCourse.titleEn) {
      showToast(isRtl ? 'يرجى إدخال عنوان الدورة بالعربية والإنجليزية' : 'Title in both languages is required', 'error'); return;
    }
    const teacher = teachers.find(t => t.id === newCourse.teacherId);
    const courseToSave: Course = {
      ...newCourse,
      teacherNameAr: teacher?.nameAr || '',
      teacherNameEn: teacher?.nameEn || '',
    };

    const all = loadCourses();
    const updatedAll = [courseToSave, ...all];
    saveCourses(updatedAll);

    // Update teacher's assignedCourseIds
    const allUsers = loadUsers();
    const updatedUsers = allUsers.map(u =>
      u.id === courseToSave.teacherId
        ? { ...u, assignedCourseIds: [...(u.assignedCourseIds || []), courseToSave.id] }
        : u
    );
    saveUsers(updatedUsers);
    setTeachers(updatedUsers.filter(u => u.role === 'TEACHER'));

    setCourses([courseToSave, ...courses]);
    setNewCourse(emptyCourse(teachers));
    setShowAddCourse(false);
    showToast(isRtl ? 'تمت إضافة الدورة بنجاح' : 'Course added successfully');
  };

  const addLessonToNew = () => {
    if (!newCourse) return;
    const l = emptyLesson(); l.order = newCourse.lessons.length + 1;
    setNewCourse({ ...newCourse, lessons: [...newCourse.lessons, l] });
  };
  const updateNewLesson = (lid: string, field: keyof Lesson, value: any) => {
    if (!newCourse) return;
    setNewCourse({ ...newCourse, lessons: newCourse.lessons.map(l => l.id === lid ? { ...l, [field]: value } : l) });
  };
  const deleteNewLesson = (lid: string) => {
    if (!newCourse) return;
    setNewCourse({ ...newCourse, lessons: newCourse.lessons.filter(l => l.id !== lid) });
  };

  /* ── Loading / Unauth ──────────────────────────────────────────────────── */
  if (!authorized || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-10 w-10 text-brand-500 animate-spin mb-4" />
        <span className="text-sm font-semibold">{isRtl ? 'جارٍ التحميل...' : 'Loading...'}</span>
      </div>
    );
  }

  /* ── Filtered list ──────────────────────────────────────────────────────── */
  const filtered = courses.filter(c => {
    if (filterTrack !== 'ALL' && c.track !== filterTrack) return false;
    if (filterSemester !== 'ALL' && c.semester !== filterSemester) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#020617] font-sans pb-20 text-white" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Decorative glows */}
      <div className="fixed top-0 start-0 w-[50vw] h-[50vw] rounded-full bg-brand-500/5 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 end-0 w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[30vw] rounded-full bg-slate-800/10 blur-[180px] pointer-events-none" />

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      {toast && (
        <div className={`fixed top-6 inset-x-0 mx-auto w-fit z-[9999] px-5 py-3 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-2.5 animate-slide-down border ${
          toast.type === 'success'
            ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-300 shadow-emerald-900/40'
            : 'bg-rose-950/95 border-rose-500/30 text-rose-300 shadow-rose-900/40'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle2 className="h-4 w-4 shrink-0" />
            : <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors">
            {isRtl
              ? <><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /><span>لوحة القيادة</span></>
              : <><ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /><span>Dashboard</span></>}
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-brand-500/15">
              <GraduationCap className="h-5 w-5 text-brand-400" />
            </div>
            <h1 className="text-base font-black text-white">{isRtl ? 'إدارة الدورات التعليمية' : 'Course Manager'}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isAdmin
                ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                : 'bg-blue-500/10 border-blue-500/25 text-blue-400'
            }`}>
              {isAdmin ? 'Admin' : (isRtl ? 'معلم' : 'Teacher')}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-5 relative z-10">

        {/* ── Stats row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: isRtl ? 'إجمالي الدورات' : 'Total Courses', value: courses.length, color: 'brand' },
            { label: isRtl ? 'دورات BTEC' : 'BTEC Courses', value: courses.filter(c => c.track === 'BTEC').length, color: 'orange' },
            { label: isRtl ? 'دورات أكاديمي' : 'Academic Courses', value: courses.filter(c => c.track === 'ACADEMIC').length, color: 'blue' },
            { label: isRtl ? 'منشورة' : 'Published', value: courses.filter(c => c.published).length, color: 'emerald' },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filter bar + Add button ─────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Track filters */}
            {(['ALL', 'BTEC', 'ACADEMIC'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilterTrack(t)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  filterTrack === t
                    ? t === 'BTEC' ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/25'
                      : t === 'ACADEMIC' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? (isRtl ? '📚 الكل' : '📚 All') : t === 'BTEC' ? '🟠 BTEC' : `🔵 ${isRtl ? 'أكاديمي' : 'Academic'}`}
                <span className="ms-1.5 opacity-60 font-normal">
                  ({t === 'ALL' ? courses.length : courses.filter(c => c.track === t).length})
                </span>
              </button>
            ))}

            {/* Semester divider */}
            <div className="w-px h-5 bg-slate-800 hidden sm:block" />

            {/* Semester tabs */}
            <div className="flex items-center bg-slate-950/60 border border-slate-800 rounded-xl p-0.5">
              {(['ALL', 1, 2] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterSemester(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    filterSemester === s
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s === 'ALL' ? (isRtl ? 'كلاهما' : 'Both') : `${isRtl ? 'الفصل' : 'S'}${s}`}
                </button>
              ))}
            </div>
          </div>

          {isAdmin && (
            <button
              onClick={() => { setShowAddCourse(true); setExpandedId(null); setEditingId(null); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>{isRtl ? 'إضافة دورة جديدة' : 'Add New Course'}</span>
            </button>
          )}
        </div>

        {/* ── Add New Course Form ───────────────────────────────────────────── */}
        {showAddCourse && isAdmin && newCourse && (
          <div className="bg-slate-900/50 border border-brand-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl shadow-brand-500/5 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-500/15"><PlusCircle className="h-4 w-4 text-brand-400" /></div>
                {isRtl ? 'إضافة دورة جديدة' : 'New Course'}
              </h2>
              <button onClick={() => setShowAddCourse(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>

            <CourseForm
              course={newCourse}
              onChange={setNewCourse}
              teachers={teachers}
              isRtl={isRtl}
              onAddLesson={addLessonToNew}
              onUpdateLesson={updateNewLesson}
              onDeleteLesson={deleteNewLesson}
              onAddLiveSession={() => setNewCourse({ ...newCourse, liveSessions: [...(newCourse.liveSessions || []), emptyLiveSession()] })}
              onUpdateLiveSession={(id, field, val) => setNewCourse({ ...newCourse, liveSessions: (newCourse.liveSessions || []).map(ls => ls.id === id ? { ...ls, [field]: val } : ls) })}
              onDeleteLiveSession={(id) => setNewCourse({ ...newCourse, liveSessions: (newCourse.liveSessions || []).filter(ls => ls.id !== id) })}
            />

            <div className="flex gap-3 pt-2">
              <button onClick={handleAddCourse}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20">
                <Save className="h-4 w-4" />{isRtl ? 'حفظ الدورة' : 'Save Course'}
              </button>
              <button onClick={() => setShowAddCourse(false)}
                className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition-all">
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* ── Course list ─────────────────────────────────────────────────── */}
        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <BookOpen className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold text-sm">
              {isRtl ? 'لا توجد دورات مطابقة للفلتر' : 'No courses match the current filter'}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filtered.map(course => {
            const isOpen = expandedId === course.id;
            const isEditing = editingId === course.id;
            const draft = isEditing ? editDraft! : course;
            const canEdit = isAdmin || course.teacherId === currentUser?.id;

            return (
              <div key={course.id} className={`rounded-2xl border shadow-xl transition-all overflow-hidden backdrop-blur-sm ${
                course.track === 'BTEC'
                  ? 'border-brand-500/20 hover:border-brand-500/35'
                  : 'border-blue-500/20 hover:border-blue-500/35'
              } bg-slate-900/30`}>

                {/* ── Course header row ──────────────────────────────────── */}
                <div className="px-4 sm:px-5 py-4 flex items-center gap-3">

                  {/* Icon */}
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    course.track === 'BTEC' ? 'bg-brand-500/12 text-brand-400' : 'bg-blue-500/12 text-blue-400'
                  }`}>
                    <BookOpen className="h-4 w-4" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      {/* Track badge */}
                      <span className={`text-3xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                        course.track === 'BTEC' ? 'text-brand-400 bg-brand-500/12' : 'text-blue-400 bg-blue-500/12'
                      }`}>{course.track}</span>
                      {/* Semester badge */}
                      <span className="text-3xs font-bold px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400 flex items-center gap-0.5">
                        <Calendar className="h-2.5 w-2.5" />
                        {isRtl ? `الفصل ${course.semester}` : `S${course.semester}`}
                      </span>
                      {/* Lock badge */}
                      {course.locked && (
                        <span className="text-3xs font-bold px-1.5 py-0.5 rounded-md bg-amber-500/12 text-amber-400 flex items-center gap-0.5">
                          <Lock className="h-2.5 w-2.5" />{isRtl ? 'مقفول' : 'Locked'}
                        </span>
                      )}
                      {/* Draft badge */}
                      {!course.published && (
                        <span className="text-3xs font-bold px-1.5 py-0.5 rounded-md bg-slate-700/80 text-slate-400">
                          {isRtl ? 'مسودة' : 'Draft'}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-white truncate">
                      {isRtl ? course.titleAr : course.titleEn}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>{isRtl ? `${course.lessons.length} درس` : `${course.lessons.length} lesson(s)`}</span>
                      {(course.subjectAr || course.subjectEn) && <span className="text-slate-700">•</span>}
                      {(course.subjectAr || course.subjectEn) && (
                        <span>{isRtl ? course.subjectAr : course.subjectEn}</span>
                      )}
                      {course.teacherNameAr && <span className="text-slate-700">•</span>}
                      {course.teacherNameAr && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {isRtl ? course.teacherNameAr : course.teacherNameEn}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* ── Actions ─────────────────────────────────────────── */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Lock/Unlock */}
                    {canEdit && (
                      <button
                        onClick={() => handleToggleLock(course.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          course.locked
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                            : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50'
                        }`}>
                        {course.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                        <span>{course.locked ? (isRtl ? 'مغلق للجميع' : 'Locked') : (isRtl ? 'مفتوح للجميع' : 'Unlocked')}</span>
                      </button>
                    )}

                    {/* Publish toggle — Admin only */}
                    {isAdmin && (
                      <button
                        onClick={() => handleTogglePublish(course.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          course.published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:bg-slate-700/50'
                        }`}>
                        {course.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        <span>{course.published ? (isRtl ? 'منشور للطلاب' : 'Published') : (isRtl ? 'مسودة' : 'Draft')}</span>
                      </button>
                    )}

                    {/* Edit */}
                    {canEdit && (
                      <button
                        onClick={() => isEditing ? cancelEdit() : startEdit(course)}
                        className={`p-2 rounded-lg transition-all ${isEditing ? 'text-white bg-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                        {isEditing ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                      </button>
                    )}

                    {/* Delete — Admin only */}
                    {isAdmin && (
                      <button onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Expand */}
                    <button
                      onClick={() => setExpandedId(isOpen ? null : course.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* ── Expanded content ────────────────────────────────────── */}
                {isOpen && (
                  <div className="border-t border-slate-800/50 p-4 sm:p-5 space-y-5 animate-fade-in">
                    {isEditing ? (
                      /* Edit mode */
                      <>
                        <CourseForm
                          course={draft}
                          onChange={setEditDraft}
                          teachers={teachers}
                          isRtl={isRtl}
                          onAddLesson={addLessonToDraft}
                          onUpdateLesson={updateDraftLesson}
                          onDeleteLesson={deleteDraftLesson}
                          onAddLiveSession={() => setEditDraft({ ...draft, liveSessions: [...(draft.liveSessions || []), emptyLiveSession()] })}
                          onUpdateLiveSession={(id, field, val) => setEditDraft({ ...draft, liveSessions: (draft.liveSessions || []).map(ls => ls.id === id ? { ...ls, [field]: val } : ls) })}
                          onDeleteLiveSession={(id) => setEditDraft({ ...draft, liveSessions: (draft.liveSessions || []).filter(ls => ls.id !== id) })}
                        />
                        <div className="flex gap-3 pt-2">
                          <button onClick={saveEdit}
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                            <Save className="h-4 w-4" />{isRtl ? 'حفظ التغييرات' : 'Save Changes'}
                          </button>
                          <button onClick={cancelEdit}
                            className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition-all">
                            {isRtl ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </>
                    ) : (
                      /* View mode */
                      <>
                        {/* Thumbnail */}
                        {course.thumbnailUrl && (
                          <img src={course.thumbnailUrl} alt={isRtl ? course.titleAr : course.titleEn}
                            className="w-full h-36 object-cover rounded-xl opacity-80" />
                        )}

                        {/* Description */}
                        {(isRtl ? course.descriptionAr : course.descriptionEn) && (
                          <p className="text-sm text-slate-400 leading-relaxed" dir={isRtl ? 'rtl' : 'ltr'}>
                            {isRtl ? course.descriptionAr : course.descriptionEn}
                          </p>
                        )}

                        {/* Lesson list */}
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {isRtl ? 'قائمة الدروس' : 'Lessons'}
                          </p>
                          {course.lessons.length === 0 ? (
                            <p className="text-xs text-slate-600 italic">
                              {isRtl ? 'لا توجد دروس. اضغط تعديل لإضافة دروس.' : 'No lessons yet. Click edit to add lessons.'}
                            </p>
                          ) : (
                            course.lessons
                              .slice()
                              .sort((a, b) => a.order - b.order)
                              .map((lesson, idx) => (
                                <div key={lesson.id} className="flex items-center gap-3 px-4 py-2.5 bg-slate-950/50 border border-slate-800/50 rounded-xl hover:border-slate-700 transition-all">
                                  <span className="text-xs font-black text-slate-600 w-5 shrink-0 text-center">{idx + 1}</span>
                                  <Video className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                  <span className="text-xs font-semibold text-slate-300 flex-1 truncate">
                                    {isRtl ? lesson.titleAr : lesson.titleEn}
                                  </span>
                                  {lesson.pdfUrl && <FileText className="h-3 w-3 text-blue-400 shrink-0" />}
                                  {lesson.locked && <Lock className="h-3 w-3 text-amber-400 shrink-0" />}
                                  <span className="text-xs text-slate-600 shrink-0">{lesson.durationMinutes}m</span>
                                </div>
                              ))
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

/* ─── CourseForm sub-component ──────────────────────────────────────────── */
function CourseForm({
  course, onChange, teachers, isRtl,
  onAddLesson, onUpdateLesson, onDeleteLesson,
  onAddLiveSession, onUpdateLiveSession, onDeleteLiveSession,
}: {
  course: Course;
  onChange: (c: Course) => void;
  teachers: AppUser[];
  isRtl: boolean;
  onAddLesson: () => void;
  onUpdateLesson: (id: string, field: keyof Lesson, val: any) => void;
  onDeleteLesson: (id: string) => void;
  onAddLiveSession: () => void;
  onUpdateLiveSession: (id: string, field: keyof LiveSession, val: any) => void;
  onDeleteLiveSession: (id: string) => void;
}) {
  const setField = <K extends keyof Course>(key: K, val: Course[K]) => onChange({ ...course, [key]: val });

  const handleTeacherChange = (tid: string) => {
    const t = teachers.find(t => t.id === tid);
    onChange({ ...course, teacherId: tid, teacherNameAr: t?.nameAr || '', teacherNameEn: t?.nameEn || '' });
  };

  return (
    <div className="space-y-4">
      {/* Track + Semester toggles */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{isRtl ? 'المسار' : 'Track'}</label>
          <div className="flex gap-2">
            {(['BTEC', 'ACADEMIC'] as const).map(s => (
              <button key={s} type="button" onClick={() => setField('track', s)}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  course.track === s
                    ? s === 'BTEC' ? 'bg-brand-500 border-brand-500 text-white' : 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}>{s === 'BTEC' ? '🟠 BTEC' : isRtl ? '🔵 أكاديمي' : '🔵 Academic'}</button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">{isRtl ? 'الفصل الدراسي' : 'Semester'}</label>
          <div className="flex gap-2">
            {([1, 2] as const).map(s => (
              <button key={s} type="button" onClick={() => setField('semester', s)}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  course.semester === s
                    ? 'bg-slate-600 border-slate-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                }`}>{isRtl ? `الفصل ${s}` : `Semester ${s}`}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Bilingual titles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label={isRtl ? 'عنوان الدورة (عربي) *' : 'Arabic Title *'} dir="rtl"
          value={course.titleAr} onChange={v => setField('titleAr', v)} placeholder="مثال: الرياضيات العلمية" />
        <Field label={isRtl ? 'عنوان الدورة (إنجليزي) *' : 'English Title *'} dir="ltr"
          value={course.titleEn} onChange={v => setField('titleEn', v)} placeholder="e.g. Scientific Mathematics" />
      </div>

      {/* Subject */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label={isRtl ? 'المادة الدراسية (عربي)' : 'Subject (Arabic)'} dir="rtl"
          value={course.subjectAr} onChange={v => setField('subjectAr', v)} placeholder="مثال: الرياضيات" />
        <Field label={isRtl ? 'المادة الدراسية (إنجليزي)' : 'Subject (English)'} dir="ltr"
          value={course.subjectEn} onChange={v => setField('subjectEn', v)} placeholder="e.g. Mathematics" />
      </div>

      {/* Descriptions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TextAreaField label={isRtl ? 'وصف الدورة (عربي)' : 'Description (Arabic)'} dir="rtl"
          value={course.descriptionAr} onChange={v => setField('descriptionAr', v)} />
        <TextAreaField label={isRtl ? 'وصف الدورة (إنجليزي)' : 'Description (English)'} dir="ltr"
          value={course.descriptionEn} onChange={v => setField('descriptionEn', v)} />
      </div>

      {/* Thumbnail + Teacher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label={isRtl ? 'رابط صورة الغلاف (اختياري)' : 'Thumbnail URL (optional)'} dir="ltr"
          value={course.thumbnailUrl} onChange={v => setField('thumbnailUrl', v)} placeholder="https://..." />
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500">{isRtl ? 'المعلم المسؤول' : 'Assigned Teacher'}</label>
          <select
            value={course.teacherId}
            onChange={e => handleTeacherChange(e.target.value)}
            className="w-full py-2.5 px-3 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="">{isRtl ? '-- اختر معلمًا --' : '-- Select Teacher --'}</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {isRtl ? t.nameAr : t.nameEn} ({t.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Published + Locked toggles */}
      <div className="flex items-center gap-4 flex-wrap">
        <ToggleField
          label={isRtl ? 'منشورة للطلاب' : 'Published for Students'}
          checked={course.published}
          onChange={v => setField('published', v)}
          colorOn="emerald"
        />
        <ToggleField
          label={isRtl ? 'مقفولة للجميع' : 'Globally Locked'}
          checked={course.locked}
          onChange={v => setField('locked', v)}
          colorOn="amber"
        />
      </div>

      {/* Lessons builder */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {isRtl ? `الدروس (${course.lessons.length})` : `Lessons (${course.lessons.length})`}
          </p>
          <button onClick={onAddLesson}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors px-2.5 py-1 rounded-lg hover:bg-brand-500/10">
            <Plus className="h-3.5 w-3.5" />{isRtl ? 'إضافة درس' : 'Add Lesson'}
          </button>
        </div>
        {course.lessons.map((lesson, idx) => (
          <LessonEditor
            key={lesson.id} lesson={lesson} idx={idx} isRtl={isRtl}
            onChange={(field, val) => onUpdateLesson(lesson.id, field, val)}
            onDelete={() => onDeleteLesson(lesson.id)}
          />
        ))}
      </div>

      {/* Live Sessions builder */}
      <div className="space-y-3 pt-4 border-t border-slate-800/50">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5 text-blue-400" />
            {isRtl ? `الجلسات المباشرة (Zoom) (${course.liveSessions?.length || 0})` : `Live Sessions (Zoom) (${course.liveSessions?.length || 0})`}
          </p>
          <button onClick={onAddLiveSession}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors px-2.5 py-1 rounded-lg hover:bg-blue-500/10">
            <Plus className="h-3.5 w-3.5" />{isRtl ? 'إضافة جلسة' : 'Add Session'}
          </button>
        </div>
        {(course.liveSessions || []).map((session, idx) => (
          <LiveSessionEditor
            key={session.id} session={session} idx={idx} isRtl={isRtl}
            onChange={(field, val) => onUpdateLiveSession(session.id, field, val)}
            onDelete={() => onDeleteLiveSession(session.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Field components ──────────────────────────────────────────────────── */
function Field({ label, value, onChange, placeholder, dir }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; dir?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <input dir={dir} type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full py-2.5 px-3 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all" />
    </div>
  );
}

function TextAreaField({ label, value, onChange, dir }: {
  label: string; value: string; onChange: (v: string) => void; dir?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <textarea dir={dir} value={value} onChange={e => onChange(e.target.value)} rows={3}
        className="w-full py-2.5 px-3 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all resize-none" />
    </div>
  );
}

function ToggleField({ label, checked, onChange, colorOn = 'emerald' }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; colorOn?: string;
}) {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    brand: 'bg-brand-500',
  };
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-all duration-200 ${checked ? (colors[colorOn] || 'bg-emerald-500') : 'bg-slate-700'}`}
      >
        <div className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-all duration-200 ${checked ? 'start-[calc(100%-1.25rem)]' : 'start-0.5'}`} />
      </div>
      <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>
    </label>
  );
}

function LessonEditor({ lesson, idx, isRtl, onChange, onDelete }: {
  lesson: Lesson; idx: number; isRtl: boolean;
  onChange: (field: keyof Lesson, val: any) => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4 bg-slate-950/70 border border-slate-800/70 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <BookOpen className="h-3 w-3" />
          {isRtl ? `الدرس ${idx + 1}` : `Lesson ${idx + 1}`}
        </span>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <LessonInput dir="rtl" value={lesson.titleAr} placeholder={isRtl ? 'عنوان الدرس (عربي)' : 'Lesson title (Arabic)'}
          onChange={v => onChange('titleAr', v)} />
        <LessonInput dir="ltr" value={lesson.titleEn} placeholder="Lesson title (English)"
          onChange={v => onChange('titleEn', v)} />
      </div>

      {/* URLs + Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="space-y-1">
          <label className="text-3xs text-slate-600 flex items-center gap-1"><Video className="h-2.5 w-2.5" />{isRtl ? 'رابط الفيديو' : 'Video URL'}</label>
          <LessonInput dir="ltr" value={lesson.videoUrl} placeholder="https://youtube.com/..."
            onChange={v => onChange('videoUrl', v)} />
        </div>
        <div className="space-y-1">
          <label className="text-3xs text-slate-600 flex items-center gap-1"><FileText className="h-2.5 w-2.5" />{isRtl ? 'رابط PDF' : 'PDF URL'}</label>
          <LessonInput dir="ltr" value={lesson.pdfUrl} placeholder="https://..."
            onChange={v => onChange('pdfUrl', v)} />
        </div>
        <div className="space-y-1">
          <label className="text-3xs text-slate-600">{isRtl ? 'المدة (دقيقة)' : 'Duration (min)'}</label>
          <input type="number" min="1" value={lesson.durationMinutes}
            onChange={e => onChange('durationMinutes', parseInt(e.target.value) || 1)}
            className="w-full py-1.5 px-2.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-500 transition-colors" />
        </div>
      </div>

      {/* Lesson lock toggle */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange('locked', !lesson.locked)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
            lesson.locked
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/25'
              : 'text-slate-500 border-slate-800 hover:border-slate-600'
          }`}
        >
          {lesson.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
          {lesson.locked ? (isRtl ? 'مقفول' : 'Locked') : (isRtl ? 'مفتوح' : 'Unlocked')}
        </button>
      </div>

      {/* Questions section */}
      <div className="pt-3 border-t border-slate-800/70 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">{isRtl ? 'الأسئلة التفاعلية' : 'Interactive Questions'}</span>
          <button
            type="button"
            onClick={() => {
              const newQ: InlineQuestion = {
                id: `q-${Date.now()}`, textAr: '', textEn: '', choices: [], explanationAr: '', explanationEn: ''
              };
              onChange('questions', [...(lesson.questions || []), newQ]);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors px-2.5 py-1 rounded-lg hover:bg-brand-500/10"
          >
            <Plus className="h-3 w-3" />{isRtl ? 'إضافة سؤال' : 'Add Question'}
          </button>
        </div>
        {(lesson.questions || []).map((q, qIdx) => (
          <div key={q.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2 relative">
            <button
              type="button"
              onClick={() => {
                const newQs = (lesson.questions || []).filter(item => item.id !== q.id);
                onChange('questions', newQs);
              }}
              className="absolute top-2 end-2 p-1 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="h-3 w-3" />
            </button>
            <div className="pe-8 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <LessonInput dir="rtl" value={q.textAr} placeholder={isRtl ? 'نص السؤال (عربي)' : 'Question text (Arabic)'}
                  onChange={v => {
                    const newQs = [...(lesson.questions || [])];
                    newQs[qIdx] = { ...q, textAr: v };
                    onChange('questions', newQs);
                  }} />
                <LessonInput dir="ltr" value={q.textEn} placeholder="Question text (English)"
                  onChange={v => {
                    const newQs = [...(lesson.questions || [])];
                    newQs[qIdx] = { ...q, textEn: v };
                    onChange('questions', newQs);
                  }} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{isRtl ? 'الخيارات' : 'Choices'}</span>
                  <button type="button" onClick={() => {
                    const newQs = [...(lesson.questions || [])];
                    newQs[qIdx] = { ...q, choices: [...q.choices, { textAr: '', textEn: '', isCorrect: false }] };
                    onChange('questions', newQs);
                  }} className="text-[10px] text-brand-400 font-bold hover:underline">
                    + {isRtl ? 'خيار' : 'Choice'}
                  </button>
                </div>
                {q.choices.map((c, cIdx) => (
                  <div key={cIdx} className="flex gap-2 items-center">
                    <button type="button" onClick={() => {
                      const newQs = [...(lesson.questions || [])];
                      const newChoices = q.choices.map((ch, idx) => ({ ...ch, isCorrect: idx === cIdx }));
                      newQs[qIdx] = { ...q, choices: newChoices };
                      onChange('questions', newQs);
                    }} className={`p-1.5 rounded-md border ${c.isCorrect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-700 text-slate-600'} transition-colors`}>
                      <CheckCircle2 className="h-3 w-3" />
                    </button>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input dir="rtl" type="text" value={c.textAr} placeholder={isRtl ? "خيار (عربي)" : "Choice (Ar)"}
                        onChange={(e) => {
                          const newQs = [...(lesson.questions || [])];
                          const newChoices = [...q.choices];
                          newChoices[cIdx] = { ...c, textAr: e.target.value };
                          newQs[qIdx] = { ...q, choices: newChoices };
                          onChange('questions', newQs);
                        }} className="w-full py-1 px-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-white focus:outline-none focus:border-brand-500" />
                      <input dir="ltr" type="text" value={c.textEn} placeholder="Choice (En)"
                        onChange={(e) => {
                          const newQs = [...(lesson.questions || [])];
                          const newChoices = [...q.choices];
                          newChoices[cIdx] = { ...c, textEn: e.target.value };
                          newQs[qIdx] = { ...q, choices: newChoices };
                          onChange('questions', newQs);
                        }} className="w-full py-1 px-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-white focus:outline-none focus:border-brand-500" />
                    </div>
                    <button type="button" onClick={() => {
                      const newQs = [...(lesson.questions || [])];
                      const newChoices = q.choices.filter((_, idx) => idx !== cIdx);
                      newQs[qIdx] = { ...q, choices: newChoices };
                      onChange('questions', newQs);
                    }} className="p-1 text-slate-600 hover:text-rose-400">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <LessonInput dir="rtl" value={q.explanationAr} placeholder={isRtl ? 'الشرح للإجابة (عربي)' : 'Explanation (Arabic)'}
                  onChange={v => {
                    const newQs = [...(lesson.questions || [])];
                    newQs[qIdx] = { ...q, explanationAr: v };
                    onChange('questions', newQs);
                  }} />
                <LessonInput dir="ltr" value={q.explanationEn} placeholder="Explanation (English)"
                  onChange={v => {
                    const newQs = [...(lesson.questions || [])];
                    newQs[qIdx] = { ...q, explanationEn: v };
                    onChange('questions', newQs);
                  }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LiveSessionEditor({
  session, idx, isRtl, onChange, onDelete
}: {
  session: LiveSession; idx: number; isRtl: boolean;
  onChange: (field: keyof LiveSession, val: any) => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4 bg-slate-950/70 border border-slate-800/70 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          {isRtl ? `جلسة مباشرة ${idx + 1}` : `Live Session ${idx + 1}`}
        </span>
        <button onClick={onDelete} className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <LessonInput dir="rtl" value={session.titleAr} placeholder={isRtl ? 'عنوان الجلسة (عربي)' : 'Session title (Arabic)'}
          onChange={v => onChange('titleAr', v)} />
        <LessonInput dir="ltr" value={session.titleEn} placeholder="Session title (English)"
          onChange={v => onChange('titleEn', v)} />
      </div>

      <div className="space-y-1">
        <label className="text-3xs text-slate-600 flex items-center gap-1"><Video className="h-2.5 w-2.5 text-blue-400" />{isRtl ? 'رابط Zoom' : 'Zoom Link'}</label>
        <LessonInput dir="ltr" value={session.zoomLink} placeholder="https://zoom.us/j/..."
          onChange={v => onChange('zoomLink', v)} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-3xs text-slate-600 flex items-center gap-1">{isRtl ? 'وقت البدء' : 'Start Time'}</label>
          <input type="datetime-local" value={session.startTime.slice(0, 16)}
            onChange={e => onChange('startTime', new Date(e.target.value).toISOString())}
            className="w-full py-1.5 px-2.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
        <div className="space-y-1">
          <label className="text-3xs text-slate-600">{isRtl ? 'المدة (دقيقة)' : 'Duration (min)'}</label>
          <input type="number" min="1" value={session.durationMinutes}
            onChange={e => onChange('durationMinutes', parseInt(e.target.value) || 1)}
            className="w-full py-1.5 px-2.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors" />
        </div>
      </div>
    </div>
  );
}

function LessonInput({ dir, value, placeholder, onChange }: {
  dir?: string; value: string; placeholder: string; onChange: (v: string) => void;
}) {
  return (
    <input dir={dir} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full py-1.5 px-2.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder:text-slate-700 focus:outline-none focus:border-brand-500 transition-colors" />
  );
}
