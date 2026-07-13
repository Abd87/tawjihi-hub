'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, Plus, Trash2, Save, Loader2,
  CheckCircle2, AlertCircle, X, Users, Mail, Lock,
  BookOpen, UserPlus, GraduationCap, ChevronDown,
  Edit3, Eye, EyeOff,
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────────────────────── */
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

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  track: 'BTEC' | 'ACADEMIC';
  semester: 1 | 2;
  subjectAr: string;
  subjectEn: string;
  teacherId: string;
  teacherNameAr: string;
  teacherNameEn: string;
  published: boolean;
  locked: boolean;
  createdAt: string;
  lessons: unknown[];
  thumbnailUrl: string;
  descriptionAr: string;
  descriptionEn: string;
}

/* ─── Storage keys ──────────────────────────────────────────────────────── */
const USERS_KEY = 'admin-users';
const COURSES_KEY = 'admin-courses';

/* ─── Default seed data ─────────────────────────────────────────────────── */
const defaultUsers: AppUser[] = [
  {
    id: 'teacher-001',
    nameAr: 'أ. محمد المهني',
    nameEn: 'Mr. Mohammad',
    email: 'btec.teacher@tawjihi.jo',
    password: 'teacher123',
    role: 'TEACHER',
    assignedCourseIds: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'teacher-002',
    nameAr: 'أ. أحمد العلمي',
    nameEn: 'Dr. Ahmad',
    email: 'acad.teacher@tawjihi.jo',
    password: 'teacher123',
    role: 'TEACHER',
    assignedCourseIds: [],
    createdAt: new Date().toISOString(),
  },
];

/* ─── Storage helpers ───────────────────────────────────────────────────── */
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

function loadCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCourses(courses: Course[]) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

/* ─── Toast type ────────────────────────────────────────────────────────── */
type ToastState = { msg: string; type: 'success' | 'error' } | null;

/* ─── Empty teacher factory ─────────────────────────────────────────────── */
const emptyTeacher = (): Omit<AppUser, 'id' | 'createdAt'> => ({
  nameAr: '', nameEn: '', email: '', password: '', role: 'TEACHER', assignedCourseIds: [],
});

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function AdminTeachersPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const [teachers, setTeachers] = useState<AppUser[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  const [toast, setToast] = useState<ToastState>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeacher, setNewTeacher] = useState(emptyTeacher());
  const [showPassword, setShowPassword] = useState(false);

  // Expanded/assign state per teacher
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<AppUser | null>(null);
  const [editShowPw, setEditShowPw] = useState(false);

  /* ── Auth ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    const token = localStorage.getItem('token');
    let user: AppUser | null = null;
    try { user = JSON.parse(localStorage.getItem('user') || 'null'); } catch { /* noop */ }

    if (!token || !user) { router.replace('/login'); return; }
    if (user.role !== 'ADMIN') { router.replace('/dashboard'); return; }

    const fetchTeachers = async () => {
      try {
        const res = await fetch('/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setTeachers(data.users.filter((u: any) => u.role === 'TEACHER'));
        }
      } catch (err) {
        console.error(err);
      }
      const allCourses = loadCourses();
      setCourses(allCourses);
      setAuthorized(true);
      setLoading(false);
    };

    fetchTeachers();
  }, [router]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Helpers ────────────────────────────────────────────────────────── */
  const persistUsers = (updated: AppUser[]) => {
    const allUsers = loadUsers();
    // Replace teachers in full user list
    const nonTeachers = allUsers.filter(u => u.role !== 'TEACHER');
    saveUsers([...nonTeachers, ...updated]);
    setTeachers(updated);
  };

  const getAssignedCourses = (teacherId: string) =>
    courses.filter(c => c.teacherId === teacherId);

  /* ── Add teacher ──────────────────────────────────────────────────── */
  const handleAddTeacher = async () => {
    if (!newTeacher.nameAr || !newTeacher.nameEn) {
      showToast(isRtl ? 'يرجى إدخال اسم المعلم' : 'Teacher name is required', 'error'); return;
    }
    if (!newTeacher.email) {
      showToast(isRtl ? 'يرجى إدخال البريد الإلكتروني' : 'Email is required', 'error'); return;
    }
    if (!newTeacher.password || newTeacher.password.length < 6) {
      showToast(isRtl ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters', 'error'); return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameAr: newTeacher.nameAr,
          nameEn: newTeacher.nameEn,
          email: newTeacher.email,
          password: newTeacher.password,
          role: 'TEACHER'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || (isRtl ? 'حدث خطأ' : 'Error adding teacher'), 'error');
        return;
      }

      setTeachers([data.user, ...teachers]);
      setNewTeacher(emptyTeacher());
      setShowAddForm(false);
      showToast(isRtl ? 'تمت إضافة المعلم بنجاح' : 'Teacher added successfully');
    } catch (err) {
      showToast(isRtl ? 'حدث خطأ في الاتصال' : 'Connection error', 'error');
    }
  };

  /* ── Delete teacher ───────────────────────────────────────────────── */
  const handleDeleteTeacher = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من حذف هذا المعلم؟ سيتم إلغاء تعيين دوراته.' : 'Delete this teacher? Their courses will be unassigned.')) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        showToast(isRtl ? 'حدث خطأ أثناء الحذف' : 'Error deleting teacher', 'error');
        return;
      }

      // Unassign courses from this teacher locally
      const updatedCourses = courses.map(c =>
        c.teacherId === id
          ? { ...c, teacherId: '', teacherNameAr: '', teacherNameEn: '' }
          : c
      );
      saveCourses(updatedCourses);
      setCourses(updatedCourses);

      setTeachers(teachers.filter(t => t.id !== id));
      showToast(isRtl ? 'تم حذف المعلم' : 'Teacher deleted');
    } catch (err) {
      showToast(isRtl ? 'حدث خطأ في الاتصال' : 'Connection error', 'error');
    }
  };

  /* ── Assign / unassign course ─────────────────────────────────────── */
  const handleToggleCourse = (teacher: AppUser, courseId: string) => {
    const assigned = teacher.assignedCourseIds || [];
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    let updatedCourses = [...courses];
    let updatedTeacher: AppUser;

    if (assigned.includes(courseId)) {
      // Unassign
      updatedTeacher = { ...teacher, assignedCourseIds: assigned.filter(id => id !== courseId) };
      updatedCourses = updatedCourses.map(c =>
        c.id === courseId ? { ...c, teacherId: '', teacherNameAr: '', teacherNameEn: '' } : c
      );
    } else {
      // Assign — remove from previous teacher first
      const prevTeacherId = course.teacherId;
      if (prevTeacherId && prevTeacherId !== teacher.id) {
        const prevTeacher = teachers.find(t => t.id === prevTeacherId);
        if (prevTeacher) {
          const updatedPrev = { ...prevTeacher, assignedCourseIds: (prevTeacher.assignedCourseIds || []).filter(id => id !== courseId) };
          const updatedAll = teachers.map(t => t.id === updatedPrev.id ? updatedPrev : t);
          setTeachers(updatedAll);
        }
      }
      updatedTeacher = { ...teacher, assignedCourseIds: [...assigned, courseId] };
      updatedCourses = updatedCourses.map(c =>
        c.id === courseId
          ? { ...c, teacherId: teacher.id, teacherNameAr: teacher.nameAr, teacherNameEn: teacher.nameEn }
          : c
      );
    }

    saveCourses(updatedCourses);
    setCourses(updatedCourses);

    const updated = teachers.map(t => t.id === teacher.id ? updatedTeacher : t);
    persistUsers(updated);
    showToast(
      assigned.includes(courseId)
        ? (isRtl ? 'تم إلغاء تعيين الدورة' : 'Course unassigned')
        : (isRtl ? 'تم تعيين الدورة للمعلم' : 'Course assigned to teacher')
    );
  };

  /* ── Inline edit teacher ──────────────────────────────────────────── */
  const startEdit = (teacher: AppUser) => {
    setEditDraft(JSON.parse(JSON.stringify(teacher)));
    setEditingId(teacher.id);
    setExpandedId(teacher.id);
    setEditShowPw(false);
  };
  const cancelEdit = () => { setEditingId(null); setEditDraft(null); };
  const saveEdit = () => {
    if (!editDraft) return;
    if (!editDraft.nameAr || !editDraft.nameEn) {
      showToast(isRtl ? 'الاسم مطلوب' : 'Name is required', 'error'); return;
    }
    if (!editDraft.email) {
      showToast(isRtl ? 'البريد الإلكتروني مطلوب' : 'Email is required', 'error'); return;
    }
    const updated = teachers.map(t => t.id === editDraft.id ? editDraft : t);
    persistUsers(updated);
    setEditingId(null); setEditDraft(null);
    showToast(isRtl ? 'تم تحديث بيانات المعلم' : 'Teacher updated');
  };

  /* ── Loading / guard ──────────────────────────────────────────────── */
  if (!authorized || loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-10 w-10 text-violet-500 animate-spin mb-4" />
        <span className="text-sm font-semibold">{isRtl ? 'جارٍ التحميل...' : 'Loading...'}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] font-sans pb-20 text-white" dir={isRtl ? 'rtl' : 'ltr'}>

      {/* Decorative glows */}
      <div className="fixed top-0 start-1/4 w-[50vw] h-[40vw] rounded-full bg-violet-500/5 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 end-0 w-[35vw] h-[35vw] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 start-0 w-[25vw] h-[25vw] rounded-full bg-indigo-500/4 blur-[100px] pointer-events-none" />

      {/* ── Toast ────────────────────────────────────────────────────── */}
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



      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 space-y-6 relative z-10">

        <h1 className="text-3xl font-extrabold text-white mb-2">
          {isRtl ? 'إدارة المعلمين' : 'Teacher Management'}
        </h1>

        {/* ── Stats row ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: isRtl ? 'إجمالي المعلمين' : 'Total Teachers', value: teachers.length, icon: Users },
            { label: isRtl ? 'إجمالي الدورات' : 'Total Courses', value: courses.length, icon: BookOpen },
            { label: isRtl ? 'دورات معينة' : 'Assigned Courses', value: courses.filter(c => c.teacherId).length, icon: GraduationCap },
            { label: isRtl ? 'دورات غير معينة' : 'Unassigned', value: courses.filter(c => !c.teacherId).length, icon: AlertCircle },
          ].map(stat => (
            <div key={stat.label} className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-1">
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <stat.icon className="h-4 w-4 text-slate-600 mt-1" />
              </div>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Top bar ────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              {isRtl ? `${teachers.length} معلم مسجل` : `${teachers.length} registered teacher(s)`}
            </p>
          </div>
          <button
            onClick={() => { setShowAddForm(true); setExpandedId(null); setEditingId(null); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            <span>{isRtl ? 'إضافة معلم جديد' : 'Add New Teacher'}</span>
          </button>
        </div>

        {/* ── Add Teacher Form ────────────────────────────────────────── */}
        {showAddForm && (
          <div className="bg-slate-900/50 border border-violet-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xl shadow-violet-500/5 backdrop-blur-sm animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-violet-500/15"><UserPlus className="h-4 w-4 text-violet-400" /></div>
                {isRtl ? 'إضافة معلم جديد' : 'Add New Teacher'}
              </h2>
              <button onClick={() => setShowAddForm(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TField label={isRtl ? 'الاسم بالعربية *' : 'Arabic Name *'} dir="rtl"
                value={newTeacher.nameAr} onChange={v => setNewTeacher({ ...newTeacher, nameAr: v })}
                placeholder="مثال: أ. محمد أحمد" />
              <TField label={isRtl ? 'الاسم بالإنجليزية *' : 'English Name *'} dir="ltr"
                value={newTeacher.nameEn} onChange={v => setNewTeacher({ ...newTeacher, nameEn: v })}
                placeholder="e.g. Mr. Mohammad" />
            </div>

            <TField label={isRtl ? 'البريد الإلكتروني *' : 'Email *'} dir="ltr" type="email"
              value={newTeacher.email} onChange={v => setNewTeacher({ ...newTeacher, email: v })}
              placeholder="teacher@tawjihi.jo" />

            <div className="relative">
              <TField label={isRtl ? 'كلمة المرور *' : 'Password *'} dir="ltr"
                type={showPassword ? 'text' : 'password'}
                value={newTeacher.password} onChange={v => setNewTeacher({ ...newTeacher, password: v })}
                placeholder={isRtl ? '٦ أحرف على الأقل' : 'At least 6 characters'} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 bottom-2.5 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={handleAddTeacher}
                className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20">
                <Save className="h-4 w-4" />{isRtl ? 'حفظ المعلم' : 'Save Teacher'}
              </button>
              <button onClick={() => setShowAddForm(false)}
                className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition-all">
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* ── Teacher cards ───────────────────────────────────────────── */}
        {teachers.length === 0 && (
          <div className="py-20 text-center">
            <Users className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-semibold text-sm">
              {isRtl ? 'لا يوجد معلمون. أضف معلمًا جديدًا!' : 'No teachers yet. Add one above!'}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {teachers.map(teacher => {
            const isOpen = expandedId === teacher.id;
            const isEditing = editingId === teacher.id;
            const draft = isEditing ? editDraft! : teacher;
            const assignedCourses = getAssignedCourses(teacher.id);

            return (
              <div key={teacher.id}
                className="rounded-2xl border border-violet-500/15 hover:border-violet-500/30 bg-slate-900/30 shadow-xl backdrop-blur-sm transition-all overflow-hidden">

                {/* ── Teacher header ─────────────────────────────────── */}
                <div className="px-4 sm:px-5 py-4 flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                    <span className="text-base font-black text-violet-300">
                      {(isRtl ? teacher.nameAr : teacher.nameEn).charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                      {isRtl ? teacher.nameAr : teacher.nameEn}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail className="h-2.5 w-2.5" />
                        {teacher.email}
                      </span>
                      <span className="text-slate-700 text-xs">•</span>
                      <span className="text-xs text-violet-400 flex items-center gap-1">
                        <GraduationCap className="h-2.5 w-2.5" />
                        {isRtl
                          ? `${assignedCourses.length} دورة معينة`
                          : `${assignedCourses.length} course(s) assigned`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => isEditing ? cancelEdit() : startEdit(teacher)}
                      className={`p-2 rounded-lg transition-all ${isEditing ? 'text-white bg-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                      {isEditing ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => handleDeleteTeacher(teacher.id)}
                      className="p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setExpandedId(isOpen ? null : teacher.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* ── Expanded ───────────────────────────────────────── */}
                {isOpen && (
                  <div className="border-t border-slate-800/50 p-4 sm:p-5 space-y-5 animate-fade-in">

                    {/* ── Edit mode ─────────────────────────────────── */}
                    {isEditing && draft && (
                      <div className="space-y-4 pb-4 border-b border-slate-800/50">
                        <p className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                          {isRtl ? 'تعديل بيانات المعلم' : 'Edit Teacher Info'}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <TField label={isRtl ? 'الاسم (عربي)' : 'Arabic Name'} dir="rtl"
                            value={draft.nameAr} onChange={v => setEditDraft({ ...draft, nameAr: v })}
                            placeholder="الاسم بالعربية" />
                          <TField label={isRtl ? 'الاسم (إنجليزي)' : 'English Name'} dir="ltr"
                            value={draft.nameEn} onChange={v => setEditDraft({ ...draft, nameEn: v })}
                            placeholder="Name in English" />
                        </div>
                        <TField label={isRtl ? 'البريد الإلكتروني' : 'Email'} dir="ltr" type="email"
                          value={draft.email} onChange={v => setEditDraft({ ...draft, email: v })}
                          placeholder="teacher@tawjihi.jo" />

                        <div className="relative">
                          <TField label={isRtl ? 'كلمة المرور' : 'Password'} dir="ltr"
                            type={editShowPw ? 'text' : 'password'}
                            value={draft.password} onChange={v => setEditDraft({ ...draft, password: v })}
                            placeholder="••••••••" />
                          <button
                            type="button"
                            onClick={() => setEditShowPw(!editShowPw)}
                            className="absolute end-3 bottom-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {editShowPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>

                        <div className="flex gap-3">
                          <button onClick={saveEdit}
                            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-violet-500/20">
                            <Save className="h-4 w-4" />{isRtl ? 'حفظ' : 'Save'}
                          </button>
                          <button onClick={cancelEdit}
                            className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-sm font-bold rounded-xl transition-all">
                            {isRtl ? 'إلغاء' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ── Course assignment section ──────────────────── */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-violet-400" />
                          {isRtl ? 'تعيين الدورات' : 'Assign Courses'}
                        </p>
                        <span className="text-xs text-slate-600 font-medium">
                          {isRtl
                            ? `${assignedCourses.length} من ${courses.length}`
                            : `${assignedCourses.length} of ${courses.length}`}
                        </span>
                      </div>

                      {courses.length === 0 ? (
                        <p className="text-xs text-slate-600 italic">
                          {isRtl ? 'لا توجد دورات بعد.' : 'No courses available yet.'}
                        </p>
                      ) : (
                        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                          {/* Group by track */}
                          {(['BTEC', 'ACADEMIC'] as const).map(track => {
                            const trackCourses = courses.filter(c => c.track === track);
                            if (trackCourses.length === 0) return null;
                            return (
                              <div key={track} className="space-y-1.5">
                                <p className={`text-3xs font-extrabold uppercase tracking-widest px-1 ${track === 'BTEC' ? 'text-brand-400' : 'text-blue-400'}`}>
                                  {track === 'BTEC' ? '🟠 BTEC' : `🔵 ${isRtl ? 'أكاديمي' : 'Academic'}`}
                                </p>
                                {trackCourses.map(course => {
                                  const isAssigned = course.teacherId === teacher.id;
                                  const assignedToOther = course.teacherId && course.teacherId !== teacher.id;
                                  const otherTeacher = assignedToOther
                                    ? teachers.find(t => t.id === course.teacherId)
                                    : null;

                                  return (
                                    <label key={course.id}
                                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                                        isAssigned
                                          ? 'border-violet-500/30 bg-violet-500/8'
                                          : assignedToOther
                                          ? 'border-slate-800/40 bg-slate-950/30 opacity-60'
                                          : 'border-slate-800/60 bg-slate-950/40 hover:border-slate-700'
                                      }`}>
                                      <input
                                        type="checkbox"
                                        checked={isAssigned}
                                        onChange={() => handleToggleCourse(teacher, course.id)}
                                        className="w-4 h-4 rounded accent-violet-500 cursor-pointer"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-slate-300 truncate">
                                          {isRtl ? course.titleAr : course.titleEn}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                          <span className="text-3xs text-slate-600">
                                            {isRtl ? `الفصل ${course.semester}` : `S${course.semester}`}
                                          </span>
                                          {(course.subjectAr || course.subjectEn) && (
                                            <span className="text-3xs text-slate-600">
                                              • {isRtl ? course.subjectAr : course.subjectEn}
                                            </span>
                                          )}
                                          {assignedToOther && otherTeacher && (
                                            <span className="text-3xs text-amber-500/80">
                                              • {isRtl ? `معين لـ ${otherTeacher.nameAr}` : `Assigned to ${otherTeacher.nameEn}`}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      {isAssigned && (
                                        <span className="text-3xs font-bold text-violet-400 bg-violet-500/12 px-1.5 py-0.5 rounded-md shrink-0">
                                          {isRtl ? 'معين' : 'Assigned'}
                                        </span>
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* ── Assigned courses summary ───────────────────── */}
                    {assignedCourses.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/40">
                        <p className="text-xs font-bold text-slate-500 mb-2">
                          {isRtl ? 'الدورات المعينة:' : 'Assigned Courses:'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {assignedCourses.map(c => (
                            <span key={c.id} className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                              c.track === 'BTEC'
                                ? 'bg-brand-500/10 border-brand-500/20 text-brand-400'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            }`}>
                              <BookOpen className="h-2.5 w-2.5" />
                              {isRtl ? c.subjectAr || c.titleAr : c.subjectEn || c.titleEn}
                              <span className="text-slate-600 font-normal">S{c.semester}</span>
                            </span>
                          ))}
                        </div>
                      </div>
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

/* ─── TField: reusable input for teacher form ───────────────────────────── */
function TField({ label, value, onChange, placeholder, dir, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; dir?: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500">{label}</label>
      <input
        dir={dir} type={type} value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2.5 px-3 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all"
      />
    </div>
  );
}
