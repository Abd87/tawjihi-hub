'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useParams } from 'next/navigation';
import { 
  GraduationCap, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  Layers, 
  Sparkles, 
  Save, 
  FileText, 
  CheckSquare, 
  ShieldAlert, 
  Loader2, 
  CheckCircle2, 
  HelpCircle,
  RefreshCw,
  Pencil,
  Eye,
  X
} from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
}

interface ChoiceInput {
  textAr: string;
  textEn: string;
  isCorrect: boolean;
}

export default function AdminQuizPage() {
  const t = useTranslations('admin');
  const navT = useTranslations('navigation');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';

  const [authorized, setAuthorized] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quiz Form states
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [cefrLevel, setCefrLevel] = useState('B2');
  const [durationMinutes, setDurationMinutes] = useState('30');
  const [courseId, setCourseId] = useState('');
  const [createdQuizId, setCreatedQuizId] = useState<string | null>(null);

  
  // Section Form states
  const [sectionTitleAr, setSectionTitleAr] = useState('');
  const [sectionTitleEn, setSectionTitleEn] = useState('');
  const [passageAr, setPassageAr] = useState('');
  const [passageEn, setPassageEn] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [sections, setSections] = useState<any[]>([]);

  // Tabs & Quizzes list
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [quizzesList, setQuizzesList] = useState<any[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  // Fetch quizzes
  const fetchQuizzesList = async () => {
    setLoadingQuizzes(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/quizzes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuizzesList(data.quizzes || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  useEffect(() => {
    if (authorized && activeTab === 'manage') {
      fetchQuizzesList();
    }
  }, [authorized, activeTab]);


  const handleEditQuiz = async (quizId: string) => {
    setLoadingQuizzes(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const quiz = data.quiz;
        
        setTitleAr(quiz.titleAr || '');
        setTitleEn(quiz.titleEn || '');
        setDescriptionAr(quiz.descriptionAr || '');
        setDescriptionEn(quiz.descriptionEn || '');
        setCefrLevel(quiz.cefrLevel || 'B2');
        setDurationMinutes(quiz.durationMinutes?.toString() || '30');
        setCourseId(quiz.courseId);
        
        setCreatedQuizId(quiz.id);
        setSections(quiz.sections || []);
        
        // Extract all questions from sections
        let allQuestions: any[] = [];
        quiz.sections.forEach((s: any) => {
          if (s.questions) {
            allQuestions = [...allQuestions, ...s.questions];
          }
        });
        setAddedQuestions(allQuestions);
        
        if (quiz.sections && quiz.sections.length > 0) {
          setActiveSectionId(quiz.sections[quiz.sections.length - 1].id);
        }
        
        setActiveTab('create');
        setSuccessMessage(locale === 'ar' ? 'تم فتح الاختبار للتعديل' : 'Quiz loaded for editing');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to load quiz');
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا القسم وكل أسئلته؟' : 'Are you sure you want to delete this section and all its questions?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/quizzes/${createdQuizId}/sections/${sectionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setSections(sections.filter(s => s.id !== sectionId));
        if (activeSectionId === sectionId) setActiveSectionId(null);
      }
    } catch(e) { console.error(e); }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this question?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/quizzes/${createdQuizId}/questions/${questionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAddedQuestions(addedQuestions.filter(q => q.id !== questionId));
      }
    } catch(e) { console.error(e); }
  };

  const handleDeleteQuiz = async (id: string) => {
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا الاختبار؟' : 'Are you sure you want to delete this quiz?')) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/quizzes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setQuizzesList(prev => prev.filter(q => q.id !== id));
        if (createdQuizId === id) {
          setCreatedQuizId(null);
          setTitleAr('');
          setTitleEn('');
          setDescriptionAr('');
          setDescriptionEn('');
          setSections([]);
          setAddedQuestions([]);
          setActiveSectionId(null);
        }
      } else {
        alert('Failed to delete quiz');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Question Form states

  const [qTextAr, setQTextAr] = useState('');
  const [qTextEn, setQTextEn] = useState('');
  const [qType, setQType] = useState<'MCQ' | 'SHORT_ANSWER'>('MCQ');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [qExplanationAr, setQExplanationAr] = useState('');
  const [qExplanationEn, setQExplanationEn] = useState('');
  const [choices, setChoices] = useState<ChoiceInput[]>([
    { textAr: '', textEn: '', isCorrect: false },
    { textAr: '', textEn: '', isCorrect: false }
  ]);

  const [addedQuestions, setAddedQuestions] = useState<any[]>([]);

  useEffect(() => {
    const checkRoleAndFetchCourses = async () => {
      const token = localStorage.getItem('token');
      const cachedUser = localStorage.getItem('user');

      if (!token || !cachedUser) {
        router.replace('/login');
        return;
      }

      const parsedUser = JSON.parse(cachedUser);
      if (parsedUser.role !== 'ADMIN' && parsedUser.role !== 'TEACHER') {
        // Enforce Admin / Teacher RBAC check
        setError(locale === 'ar' ? 'غير مصرح لك بالوصول لهذه الصفحة.' : 'Access Denied: Only Admin/Teachers can access this panel.');
        setLoading(false);
        return;
      }

      setAuthorized(true);

      try {
        // Fetch courses list to map
        const response = await fetch('/api/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
          if (data.courses.length > 0) setCourseId(data.courses[0].id);
        } else {
          // Fallback mocks
          setCourses([
            { id: 'mock-btec-1', titleAr: 'تاريخ الأردن المهني BTEC', titleEn: 'Jordan History BTEC' },
            { id: 'mock-acad-1', titleAr: 'الرياضيات العلمية', titleEn: 'Scientific Mathematics' }
          ]);
          setCourseId('mock-btec-1');
        }
      } catch (err) {
        setCourses([
          { id: 'mock-btec-1', titleAr: 'تاريخ الأردن المهني BTEC', titleEn: 'Jordan History BTEC' },
          { id: 'mock-acad-1', titleAr: 'الرياضيات العلمية', titleEn: 'Scientific Mathematics' }
        ]);
        setCourseId('mock-btec-1');
      } finally {
        setLoading(false);
      }
    };

    checkRoleAndFetchCourses();
  }, [router, locale]);

  // Quiz submission handler
  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleAr && !titleEn) {
      setError(locale === 'ar' ? 'يجب إدخال عنوان واحد على الأقل (عربي أو إنجليزي)' : 'Please provide at least one title (Ar or En)');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titleAr,
          titleEn,
          descriptionAr,
          descriptionEn,
          cefrLevel,
          durationMinutes: parseInt(durationMinutes),
          courseId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create quiz');
      }

      setCreatedQuizId(data.quiz.id);
      setSuccessMessage(locale === 'ar' ? 'تم إنشاء الاختبار بنجاح! يمكنك الآن إضافة أسئلة.' : 'Quiz created! Now add questions below.');
    } catch (err: any) {
      setError(err.message || (locale === 'ar' ? 'فشل إنشاء الاختبار' : 'Failed to create quiz'));
    }
  };

  // Choice inputs modifications
  const handleChoiceChange = (index: number, field: keyof ChoiceInput, value: any) => {
    const updated = [...choices];
    if (field === 'isCorrect') {
      // Toggle checkboxes so only one is correct (or multiple, but standard MCQ has 1)
      updated.forEach((c, idx) => {
        c.isCorrect = idx === index ? value : false;
      });
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setChoices(updated);
  };

  const addChoiceRow = () => {
    setChoices([...choices, { textAr: '', textEn: '', isCorrect: false }]);
  };

  const removeChoiceRow = (index: number) => {
    if (choices.length <= 2) return; // Keep minimum of 2
    setChoices(choices.filter((_, idx) => idx !== index));
  };

  
  // Section submission handler
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdQuizId) return;
    if (!sectionTitleAr && !sectionTitleEn) {
      setError(locale === 'ar' ? 'يجب إدخال عنوان قسم واحد على الأقل' : 'Please provide at least one section title');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/quizzes/${createdQuizId}/sections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          titleAr: sectionTitleAr,
          titleEn: sectionTitleEn,
          passageAr,
          passageEn,
          order: sections.length
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create section');
      }

      setSections([...sections, data.section]);
      setActiveSectionId(data.section.id);
      setSuccessMessage(locale === 'ar' ? 'تم إنشاء القسم بنجاح! يمكنك الآن إضافة أسئلة إليه.' : 'Section created! Now add questions to it.');
      setSectionTitleAr('');
      setSectionTitleEn('');
      setPassageAr('');
      setPassageEn('');
    } catch (err: any) {
      setError(err.message || (locale === 'ar' ? 'فشل إنشاء القسم' : 'Failed to create section'));
    }
  };

  // Question submission handler

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSectionId) return;
    if (!qTextAr && !qTextEn) {
      setError(locale === 'ar' ? 'يجب إدخال نص سؤال واحد على الأقل' : 'Please provide at least one question text');
      return;
    }
    setError(null);
    setSuccessMessage(null);

    if (qType === 'MCQ' && !choices.some(c => c.isCorrect)) {
      setError(locale === 'ar' ? 'يجب تحديد إجابة صحيحة واحدة على الأقل' : 'Please mark at least one choice as correct');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/quizzes/${createdQuizId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          textAr: qTextAr,
          textEn: qTextEn,
          type: qType,
          correctAnswer: qType === 'SHORT_ANSWER' ? correctAnswer : undefined,
          explanationAr: qExplanationAr,
          explanationEn: qExplanationEn,
          choices: qType === 'MCQ' ? choices : undefined,
          sectionId: activeSectionId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add question');
      }

      setAddedQuestions([...addedQuestions, data.question]);
      setSuccessMessage(locale === 'ar' ? 'تمت إضافة السؤال بنجاح!' : 'Question added successfully!');
      resetQuestionFields();
    } catch (err: any) {
      setError(err.message || (locale === 'ar' ? 'فشل إضافة السؤال' : 'Failed to add question'));
    }
  };

  const resetQuestionFields = () => {
    setQTextAr('');
    setQTextEn('');
    setCorrectAnswer('');
    setQExplanationAr('');
    setQExplanationEn('');
    setChoices([
      { textAr: '', textEn: '', isCorrect: false },
      { textAr: '', textEn: '', isCorrect: false }
    ]);
  };

  if (loading) {
    return (
      <div className="bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
        <span>Loading Admin Panel...</span>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="bg-[#020617] flex flex-col items-center justify-center text-slate-400 p-6">
        <ShieldAlert className="h-12 w-12 text-rose-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-200">{error}</h3>
        <Link href="/" className="mt-6 px-5 py-2.5 bg-slate-900 border border-slate-800 text-white rounded-xl text-sm font-semibold hover:border-slate-500 transition-all">
          {locale === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
        </Link>
      </div>
    );
  }

  const isRtl = locale === 'ar';

  return (
    <div className="relative bg-[#020617] overflow-x-hidden font-sans pb-16 selection:bg-brand-500/30 selection:text-brand-300">
      
      {/* Glow backgrounds */}
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />



      {/* Admin Panel Body */}
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8  z-10 relative">
        
        {/* Title and Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-xs font-semibold mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Curriculum Creator Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">{t('panelTitle')}</h1>
            <p className="text-slate-400 mt-2">{t('panelSub')}</p>
          </div>
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 shrink-0">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'create' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {locale === 'ar' ? 'إنشاء اختبار' : 'Create Quiz'}
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'manage' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {locale === 'ar' ? 'إدارة الاختبارات' : 'Manage Quizzes'}
            </button>
          </div>
        </div>

        {activeTab === 'manage' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-500" />
              {locale === 'ar' ? 'الاختبارات الحالية' : 'Current Quizzes'}
            </h2>
            {loadingQuizzes ? (
              <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-brand-500" /></div>
            ) : quizzesList.length === 0 ? (
              <p className="text-slate-400 text-center py-8">{locale === 'ar' ? 'لا يوجد اختبارات حالياً.' : 'No quizzes found.'}</p>
            ) : (
              <div className="grid gap-4">
                {quizzesList.map(quiz => (
                  <div key={quiz.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-white text-lg">{(locale === 'ar') ? quiz.titleAr : quiz.titleEn}</h3>
                      <p className="text-sm text-brand-400">{(locale === 'ar') ? quiz.courseTitleAr : quiz.courseTitleEn}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span>{quiz.totalSections} {locale === 'ar' ? 'أقسام' : 'Sections'}</span>
                        <span>&bull;</span>
                        <span>{quiz.totalQuestions} {locale === 'ar' ? 'أسئلة' : 'Questions'}</span>
                        <span>&bull;</span>
                        <span>{new Date(quiz.createdAt).toLocaleDateString(locale)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditQuiz(quiz.id)}
                        className="p-2.5 bg-brand-500/10 hover:bg-brand-500 text-brand-500 hover:text-white rounded-lg transition-colors border border-brand-500/20 hover:border-brand-500"
                        title={locale === 'ar' ? 'تعديل الاختبار' : 'Edit Quiz'}
                      >
                        <Pencil className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-colors border border-rose-500/20 hover:border-rose-500"
                        title={locale === 'ar' ? 'حذف الاختبار' : 'Delete Quiz'}
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="grid xl:grid-cols-2 gap-8 w-full max-w-7xl mx-auto items-start">
          
          <div className="w-full">
        {/* Feedback alerts */}
        {successMessage && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 text-emerald-300 text-xs sm:text-sm mb-8">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-10">
          
          {/* STEP 1: Quiz Form */}
          <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-brand-500" />
                <span>{t('createQuizHeader')}</span>
              </h3>
              {createdQuizId && (
                <button
                  type="button"
                  onClick={() => {
                    setCreatedQuizId(null);
                    setTitleAr('');
                    setTitleEn('');
                    setDescriptionAr('');
                    setDescriptionEn('');
                    setSections([]);
                    setAddedQuestions([]);
                    setActiveSectionId(null);
                    setSuccessMessage(locale === 'ar' ? 'تمت تهيئة النماذج لاختبار جديد' : 'Ready to create a new quiz');
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                >
                  {locale === 'ar' ? 'إنشاء اختبار جديد' : 'Start New Quiz'}
                </button>
              )}
            </div>

            <form onSubmit={handleCreateQuiz} className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t('quizTitleAr')}</label>
                <input 
                  type="text" 
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  disabled={createdQuizId !== null}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none disabled:opacity-50"
                  placeholder="مثال: اختبار نهايات التفاضل"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t('quizTitleEn')}</label>
                <input 
                  type="text" 
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  disabled={createdQuizId !== null}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none disabled:opacity-50"
                  placeholder="e.g. Limits & Continuity Quiz"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t('cefrLabel')}</label>
                <select
                  value={cefrLevel}
                  onChange={(e) => setCefrLevel(e.target.value)}
                  disabled={createdQuizId !== null}
                  className="w-full py-3 px-4 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-white font-semibold focus:outline-none focus:border-brand-500 transition-colors disabled:opacity-50"
                >
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t('durationLabel')}</label>
                <input 
                  type="number" 
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  disabled={createdQuizId !== null}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none disabled:opacity-50"
                  placeholder="30"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t('courseSelect')}</label>
                <select 
                  value={courseId} 
                  onChange={(e) => setCourseId(e.target.value)}
                  disabled={createdQuizId !== null}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400 focus:border-brand-500 focus:outline-none disabled:opacity-50"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{isRtl ? c.titleAr : c.titleEn}</option>
                  ))}
                </select>
              </div>

              {createdQuizId === null && (
                <div className="md:col-span-2 pt-3 flex justify-end">
                  <button 
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 transition-all shadow-md shadow-brand-500/20"
                  >
                    <Save className="h-4.5 w-4.5" />
                    <span>{locale === 'ar' ? 'إنشاء الاختبار' : 'Register Quiz Package'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>


          {/* STEP 2: Section Form (Only active after Quiz created) */}
          {createdQuizId !== null && (
            <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white border-b border-slate-850 pb-4 mb-6 flex items-center gap-2">
                <Layers className="h-5 w-5 text-brand-500" />
                <span>{locale === 'ar' ? 'إضافة قسم جديد (مهم للنص المقروء)' : 'Add New Section (For Reading Passages)'}</span>
              </h3>

              <form onSubmit={handleCreateSection} className="grid md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{locale === 'ar' ? 'عنوان القسم (عربي)' : 'Section Title (Ar)'}</label>
                  <input type="text" value={sectionTitleAr} onChange={e => setSectionTitleAr(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{locale === 'ar' ? 'عنوان القسم (انجليزي)' : 'Section Title (En)'}</label>
                  <input type="text" value={sectionTitleEn} onChange={e => setSectionTitleEn(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none" />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{locale === 'ar' ? 'النص المقروء (عربي - اختياري)' : 'Reading Passage (Ar - Optional)'}</label>
                  <RichTextEditor value={passageAr} onChange={setPassageAr} dir="rtl" placeholder="Enter Arabic passage..." />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{locale === 'ar' ? 'النص المقروء (انجليزي - اختياري)' : 'Reading Passage (En - Optional)'}</label>
                  <RichTextEditor value={passageEn} onChange={setPassageEn} dir="ltr" placeholder="Enter English passage..." />
                </div>
                <div className="md:col-span-2 pt-3 flex justify-end">
                  <button type="submit" className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 transition-all shadow-md">
                    <Plus className="h-4.5 w-4.5" />
                    <span>{locale === 'ar' ? 'إضافة القسم' : 'Add Section'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Questions Form (Only active after Section created) */}
          {activeSectionId !== null && (

            <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-lg font-bold text-white border-b border-slate-850 pb-4 mb-6 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-brand-500" />
                <span>{t('addQuestionHeader')}</span>
              </h3>

              <form onSubmit={handleAddQuestion} className="space-y-5">
                {/* Question Type Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">{t('questionType')}</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setQType('MCQ')}
                      className={`py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                        qType === 'MCQ' 
                          ? 'border-brand-500 bg-brand-500/5 text-brand-400' 
                          : 'border-slate-800 bg-slate-950 text-slate-450 text-slate-400'
                      }`}
                    >
                      {t('mcqOption')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQType('SHORT_ANSWER')}
                      className={`py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all ${
                        qType === 'SHORT_ANSWER' 
                          ? 'border-brand-500 bg-brand-500/5 text-brand-400' 
                          : 'border-slate-800 bg-slate-950 text-slate-450 text-slate-400'
                      }`}
                    >
                      {t('shortAnswerOption')}
                    </button>
                  </div>
                </div>

                {/* Question Texts */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{t('questionTextAr')}</label>
                    <RichTextEditor 
                      value={qTextAr}
                      onChange={setQTextAr}
                      dir="rtl"
                      placeholder="ما هي مشتقة الدالة..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{t('questionTextEn')}</label>
                    <RichTextEditor 
                      value={qTextEn}
                      onChange={setQTextEn}
                      dir="ltr"
                      placeholder="What is the derivative of..."
                    />
                  </div>
                </div>

                {/* MCQ Choices Builder */}
                {qType === 'MCQ' && (
                  <div className="space-y-4 pt-3 border-t border-slate-900">
                    <label className="text-xs font-bold text-slate-300 block">{t('choicesHeader')}</label>
                    
                    <div className="space-y-3">
                      {choices.map((choice, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-xl border border-slate-850 bg-slate-950/40">
                          
                          {/* Choice Inputs */}
                          <input 
                            type="text" 
                            value={choice.textAr}
                            onChange={(e) => handleChoiceChange(index, 'textAr', e.target.value)}
                            className="flex-grow rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
                            placeholder={isRtl ? 'الخيار بالعربية' : 'Option in Arabic'}
                          />
                          <input 
                            type="text" 
                            value={choice.textEn}
                            onChange={(e) => handleChoiceChange(index, 'textEn', e.target.value)}
                            className="flex-grow rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
                            placeholder={isRtl ? 'الخيار بالإنجليزية' : 'Option in English'}
                          />

                          {/* Correct solution checkbox */}
                          <div className="flex items-center justify-between gap-2 px-2.5">
                            <label className="text-2xs text-slate-500 sm:hidden">{t('isCorrectLabel')}</label>
                            <input 
                              type="checkbox" 
                              checked={choice.isCorrect}
                              onChange={(e) => handleChoiceChange(index, 'isCorrect', e.target.checked)}
                              className="h-4.5 w-4.5 rounded border-slate-800 bg-slate-950 text-brand-500 focus:ring-brand-500"
                            />
                          </div>

                          {/* Remove choice button */}
                          <button 
                            type="button" 
                            onClick={() => removeChoiceRow(index)}
                            disabled={choices.length <= 2}
                            className="p-2 text-slate-500 hover:text-rose-500 disabled:opacity-30 disabled:hover:text-slate-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>

                        </div>
                      ))}
                    </div>

                    <button 
                      type="button" 
                      onClick={addChoiceRow}
                      className="inline-flex items-center gap-1.5 text-xs text-brand-500 hover:text-brand-400 font-bold transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>{t('addChoiceBtn')}</span>
                    </button>
                  </div>
                )}

                {/* Short Answer exact solution key */}
                {qType === 'SHORT_ANSWER' && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-900">
                    <label className="text-xs font-bold text-slate-300">{t('correctShortAnswer')}</label>
                    <input 
                      type="text" 
                      required
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
                      placeholder="e.g. x^2, photosynthesis"
                    />
                  </div>
                )}

                {/* Explanation text */}
                <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-slate-900">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{t('explanationArLabel')}</label>
                    <textarea 
                      rows={2}
                      value={qExplanationAr}
                      onChange={(e) => setQExplanationAr(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
                      placeholder="اشرح حل السؤال بالعربية..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{t('explanationEnLabel')}</label>
                    <textarea 
                      rows={2}
                      value={qExplanationEn}
                      onChange={(e) => setQExplanationEn(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
                      placeholder="Explain the solution breakdown in English..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3">
                  <button 
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 transition-all shadow shadow-brand-500/10"
                  >
                    <Plus className="h-4.5 w-4.5" />
                    <span>{t('saveQuestionBtn')}</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* List of added questions */}
          {addedQuestions.length > 0 && (
            <div className="bg-slate-900/10 border border-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-base sm:text-lg font-bold text-white mb-6 border-b border-slate-850 pb-4">
                {isRtl ? `الأسئلة المضافة حالياً (${addedQuestions.length})` : `Added Questions (${addedQuestions.length})`}
              </h3>

              <div className="space-y-4">
                {addedQuestions.map((q, index) => (
                  <div key={q.id || index} className="p-4 rounded-xl border border-slate-850 bg-slate-950/20 flex items-start gap-3 text-xs sm:text-sm text-slate-350">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-900 border border-slate-850 text-brand-400 font-bold">{index + 1}</span>
                    <div className="space-y-1 flex-1">
                      <p className="text-white font-semibold">{isRtl ? q.textAr : q.textEn}</p>
                      <span className="text-2xs text-slate-500 block">Type: {q.type}</span>
                    </div>
                    <button
                      onClick={() => setAddedQuestions(prev => prev.filter((_, i) => i !== index))}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          </div>
          </div>
          
          {/* LIVE PREVIEW PANEL (RIGHT SIDE) */}
          <div className="w-full xl:sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pb-20">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative">
              <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm pb-4 border-b border-slate-800 mb-6 z-10 flex items-center gap-3">
                <Eye className="h-6 w-6 text-brand-500" />
                <h3 className="text-xl font-bold text-white">{locale === 'ar' ? 'معاينة هيكل الاختبار' : 'Exam Structure Preview'}</h3>
              </div>
              
              {!createdQuizId ? (
                <div className="text-center py-10 text-slate-500">
                  <Layers className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>{locale === 'ar' ? 'قم بإنشاء الاختبار أولاً للبدء' : 'Create the quiz first to begin building'}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-4">
                    <h4 className="font-bold text-white">{locale === 'ar' ? (titleAr || titleEn) : (titleEn || titleAr)}</h4>
                    <p className="text-xs text-brand-400 mt-1">{sections.length} {locale === 'ar' ? 'أقسام' : 'Sections'} &bull; {addedQuestions.length} {locale === 'ar' ? 'أسئلة' : 'Questions'}</p>
                  </div>
                  
                  {sections.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">{locale === 'ar' ? 'لا يوجد أقسام مضافة بعد' : 'No sections added yet'}</p>
                  ) : (
                    sections.map((sec, idx) => (
                      <div key={sec.id} className={`border rounded-xl p-4 transition-all ${activeSectionId === sec.id ? 'border-brand-500 bg-brand-500/5' : 'border-slate-800 bg-slate-950/50'}`}>
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <div 
                            className="cursor-pointer group flex-1"
                            onClick={() => setActiveSectionId(sec.id)}
                          >
                            <h5 className="font-bold text-slate-200 group-hover:text-brand-400 transition-colors">
                              {idx + 1}. {locale === 'ar' ? (sec.titleAr || sec.titleEn) : (sec.titleEn || sec.titleAr)}
                            </h5>
                            {activeSectionId === sec.id && <span className="text-[10px] uppercase font-bold text-brand-500 mt-1 block">{locale === 'ar' ? 'القسم النشط' : 'Active Section'}</span>}
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteSection(sec.id); }} className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded transition-colors shrink-0">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {(sec.passageAr || sec.passageEn) && (
                          <div 
                            className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-xs text-slate-400 mb-4 line-clamp-3 prose prose-invert prose-p:my-0 max-w-none prose-sm"
                            dangerouslySetInnerHTML={{ __html: (locale === 'ar' ? (sec.passageAr || sec.passageEn) : (sec.passageEn || sec.passageAr)) || '' }}
                          />
                        )}
                        
                        <div className="space-y-2 mt-4 pl-4 border-l-2 border-slate-800">
                          {addedQuestions.filter(q => q.sectionId === sec.id).map((q, qIdx) => (
                            <div key={q.id} className="bg-slate-900 p-3 rounded-lg text-sm flex justify-between items-start gap-2">
                              <div>
                                <span className="font-mono text-xs text-brand-500 font-bold mr-2 mt-0.5">Q{qIdx+1}</span>
                                <div 
                                  className="text-slate-300 prose prose-invert prose-p:my-0 max-w-none prose-sm" 
                                  dangerouslySetInnerHTML={{ __html: (locale === 'ar' ? (q.textAr || q.textEn) : (q.textEn || q.textAr)) || '' }} 
                                />
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(q.id); }} className="text-slate-500 hover:text-rose-500 shrink-0">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {addedQuestions.filter(q => q.sectionId === sec.id).length === 0 && (
                            <p className="text-xs text-slate-500 italic py-1">{locale === 'ar' ? 'لا يوجد أسئلة في هذا القسم' : 'No questions in this section'}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        )}

      </main>

    </div>
  );
}
