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
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

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
    if (!activeSectionId) return;
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
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin mb-4" />
        <span>Loading Admin Panel...</span>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-slate-400 p-6">
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
    <div className="relative min-h-screen bg-[#020617] overflow-x-hidden font-sans pb-16 selection:bg-brand-500/30 selection:text-brand-300">
      
      {/* Glow backgrounds */}
      <div className="absolute top-[-10%] start-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />



      {/* Admin Panel Body */}
      <main className="max-w-4xl mx-auto px-4 pt-32 z-10 relative">
        
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
                    <button
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      className="p-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition-colors border border-rose-500/20 hover:border-rose-500"
                      title={locale === 'ar' ? 'حذف الاختبار' : 'Delete Quiz'}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
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
            <h3 className="text-lg font-bold text-white border-b border-slate-850 pb-4 mb-6 flex items-center gap-2">
              <Layers className="h-5 w-5 text-brand-500" />
              <span>{t('createQuizHeader')}</span>
            </h3>

            <form onSubmit={handleCreateQuiz} className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">{t('quizTitleAr')}</label>
                <input 
                  type="text" 
                  required
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
                  required
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

          {/* STEP 2: Questions Form (Only active after Quiz created) */}
          {createdQuizId !== null && (
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
                    <textarea 
                      required
                      rows={2}
                      value={qTextAr}
                      onChange={(e) => setQTextAr(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
                      placeholder="ما هي مشتقة الدالة..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">{t('questionTextEn')}</label>
                    <textarea 
                      required
                      rows={2}
                      value={qTextEn}
                      onChange={(e) => setQTextEn(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
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
                            required
                            value={choice.textAr}
                            onChange={(e) => handleChoiceChange(index, 'textAr', e.target.value)}
                            className="flex-grow rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs sm:text-sm text-slate-200 focus:border-brand-500 focus:outline-none"
                            placeholder={isRtl ? 'الخيار بالعربية' : 'Option in Arabic'}
                          />
                          <input 
                            type="text" 
                            required
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
        )}

      </main>

    </div>
  );
}
