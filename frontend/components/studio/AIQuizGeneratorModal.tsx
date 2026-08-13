'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Trash2, 
  Plus, 
  Save, 
  X, 
  Key, 
  FileText,
  Sliders,
  HelpCircle,
  Check
} from 'lucide-react';
import MathRenderer from '@/components/MathRenderer';

interface AIQuestion {
  textAr: string;
  textEn: string;
  type: string;
  explanationAr?: string;
  explanationEn?: string;
  choices: { textAr: string; textEn: string; isCorrect: boolean }[];
}

interface AIQuizGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetQuizId?: string;
  onQuestionsSaved?: (count: number) => void;
  locale?: string;
}

export default function AIQuizGeneratorModal({
  isOpen,
  onClose,
  targetQuizId: initialTargetQuizId,
  onQuestionsSaved,
  locale = 'ar',
}: AIQuizGeneratorModalProps) {
  const isRtl = locale === 'ar';

  const [topicText, setTopicText] = useState('');
  const [subject, setSubject] = useState('');
  const [track, setTrack] = useState<'ACADEMIC' | 'BTEC'>('ACADEMIC');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'EASY' | 'MEDIUM' | 'HARD' | 'TAWJIHI_EXAM'>('TAWJIHI_EXAM');
  const [customApiKey, setCustomApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<AIQuestion[]>([]);

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState(initialTargetQuizId || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !initialTargetQuizId) {
      fetchAvailableQuizzes();
    }
  }, [isOpen, initialTargetQuizId]);

  const fetchAvailableQuizzes = async () => {
    try {
      const res = await fetch('/api/quizzes');
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data.quizzes || []);
        if (data.quizzes?.length > 0 && !selectedQuizId) {
          setSelectedQuizId(data.quizzes[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!topicText.trim()) {
      setError(isRtl ? 'يرجى أدخال نص الدرس أو موضوع الأسئلة' : 'Please enter lesson text or topic');
      return;
    }

    setGenerating(true);

    try {
      const res = await fetch('/api/studio/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicText,
          subject,
          track,
          questionCount,
          difficulty,
          customApiKey: customApiKey.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isRtl ? 'فشل توليد الأسئلة' : 'Failed to generate questions'));
      }

      setGeneratedQuestions(data.questions || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleQuestionTextChange = (index: number, field: 'textAr' | 'textEn', val: string) => {
    const updated = [...generatedQuestions];
    updated[index][field] = val;
    setGeneratedQuestions(updated);
  };

  const handleChoiceChange = (qIndex: number, cIndex: number, field: 'textAr' | 'textEn', val: string) => {
    const updated = [...generatedQuestions];
    updated[qIndex].choices[cIndex][field] = val;
    setGeneratedQuestions(updated);
  };

  const handleSetCorrectChoice = (qIndex: number, cIndex: number) => {
    const updated = [...generatedQuestions];
    updated[qIndex].choices.forEach((c, idx) => {
      c.isCorrect = idx === cIndex;
    });
    setGeneratedQuestions(updated);
  };

  const handleRemoveQuestion = (index: number) => {
    setGeneratedQuestions(generatedQuestions.filter((_, idx) => idx !== index));
  };

  const handleSaveToQuiz = async () => {
    const quizIdToUse = initialTargetQuizId || selectedQuizId;

    if (!quizIdToUse) {
      setError(isRtl ? 'يرجى اختيار الاختبار الهدف لحفظ الأسئلة فيه' : 'Please select a target quiz');
      return;
    }

    if (generatedQuestions.length === 0) {
      setError(isRtl ? 'لا توجد أسئلة لحفظها' : 'No questions to save');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Send bulk questions save request
      const res = await fetch('/api/studio/bulk-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quizIdToUse,
          questions: generatedQuestions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (isRtl ? 'فشل حفظ الأسئلة' : 'Failed to save questions'));
      }

      setSuccessMsg(isRtl ? `تم حفظ ${generatedQuestions.length} سؤال بنجاح في الاختبار! 🎉` : `Saved ${generatedQuestions.length} questions successfully! 🎉`);
      
      if (onQuestionsSaved) {
        onQuestionsSaved(generatedQuestions.length);
      }

      setTimeout(() => {
        onClose();
        setGeneratedQuestions([]);
      }, 1800);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-2xl border border-brand-500/20">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {isRtl ? 'مولد الأسئلة السحري (Google Gemini AI)' : 'AI Quiz & Content Generator'}
              </h2>
              <p className="text-xs text-slate-400">
                {isRtl ? 'توليد أسئلة توجيهي وBTEC احترافية خلال ثوانٍ من نصوص ومحتوى المواد' : 'Generate instant Tawjihi MCQs & content from study notes'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold text-center">
              {successMsg}
            </div>
          )}

          {/* Form Step 1: Input controls */}
          {generatedQuestions.length === 0 ? (
            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">
                  {isRtl ? 'موضوع السؤال أو نص الدرس والملاحظات *' : 'Lesson Text / Study Topic Notes *'}
                </label>
                <textarea
                  rows={6}
                  required
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'قم بلصق نص الدرس، الملاحظات، أو موضوع المادة هنا... (مثال: تركيب الخلية الوظيفي في الأحياء، أو قواعد الأفق والأفعال الكلامية في اللغة الإنجليزية)'
                      : 'Paste study notes, lesson text, or topic summary here...'
                  }
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 transition-all custom-scrollbar"
                />
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">{isRtl ? 'اسم المادة' : 'Subject'}</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={isRtl ? 'مثال: الأحياء' : 'e.g. Biology'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">{isRtl ? 'المسار' : 'Track'}</label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-brand-500"
                  >
                    <option value="ACADEMIC">{isRtl ? 'أكاديمي (Academic)' : 'Academic'}</option>
                    <option value="BTEC">{isRtl ? 'بتيك (BTEC)' : 'BTEC Vocational'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">{isRtl ? 'عدد الأسئلة' : 'Question Count'}</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-brand-500"
                  >
                    <option value={5}>5 {isRtl ? 'أسئلة' : 'Questions'}</option>
                    <option value={10}>10 {isRtl ? 'أسئلة' : 'Questions'}</option>
                    <option value={15}>15 {isRtl ? 'سؤالاً' : 'Questions'}</option>
                    <option value={20}>20 {isRtl ? 'سؤالاً' : 'Questions'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">{isRtl ? 'مستوى الصعوبة' : 'Difficulty'}</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-brand-500"
                  >
                    <option value="EASY">{isRtl ? 'سهل (Easy)' : 'Easy'}</option>
                    <option value="MEDIUM">{isRtl ? 'متوسط (Medium)' : 'Medium'}</option>
                    <option value="HARD">{isRtl ? 'صعب (Hard)' : 'Hard'}</option>
                    <option value="TAWJIHI_EXAM">{isRtl ? 'نمط امتحان الوزارة 🔥' : 'Tawjihi Exam Style'}</option>
                  </select>
                </div>
              </div>

              {/* Optional Custom API Key accordion */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="text-xs text-slate-400 hover:text-brand-400 font-bold flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إدخال مفتاح Gemini API خاص (اختياري)' : 'Custom Gemini API Key (Optional)'}</span>
                </button>

                {showApiKeyInput && (
                  <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    <input
                      type="password"
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      {isRtl ? 'إذا لم تقم بإنشاء مفتاح، فسيتم استخدام مفتاح المجاني التلقائي للمنصة' : 'If left empty, system default free API key is used.'}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={generating}
                  className="px-8 py-3.5 bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isRtl ? 'جاري التوليد بالذكاء الاصطناعي...' : 'Generating Questions...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{isRtl ? 'توليد الأسئلة السحرية ✨' : 'Generate Magic Questions ✨'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Preview & Edit Generated Questions */
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {isRtl
                    ? `تم توليد ${generatedQuestions.length} سؤال بنجاح! يمكنك مراجعة الأسئلة وتعديل أي خيار قبل الحفظ.`
                    : `Generated ${generatedQuestions.length} questions! Review and edit choices before saving.`}
                </span>

                <button
                  onClick={() => setGeneratedQuestions([])}
                  className="px-3 py-1.5 bg-slate-800 text-xs text-slate-300 rounded-lg hover:bg-slate-700 font-bold"
                >
                  {isRtl ? 'إعادة التوليد' : 'Regenerate'}
                </button>
              </div>

              {/* Target Quiz Picker if not passed */}
              {!initialTargetQuizId && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    {isRtl ? 'اختر الاختبار المراد إضافة الأسئلة إليه:' : 'Select Target Quiz:'}
                  </label>
                  <select
                    value={selectedQuizId}
                    onChange={(e) => setSelectedQuizId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white outline-none focus:border-brand-500"
                  >
                    {quizzes.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.course?.titleAr || 'دورة'} • {q.titleAr} ({q.titleEn})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Accordion Questions List */}
              <div className="space-y-4">
                {generatedQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 relative">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-900 pb-3">
                      <span className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 font-extrabold text-xs flex items-center justify-center shrink-0">
                        #{qIndex + 1}
                      </span>
                      
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={q.textAr}
                          onChange={(e) => handleQuestionTextChange(qIndex, 'textAr', e.target.value)}
                          placeholder={isRtl ? 'نص السؤال (عربي)' : 'Arabic Question Text'}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs font-bold text-white outline-none focus:border-brand-500"
                        />
                        <input
                          type="text"
                          value={q.textEn}
                          onChange={(e) => handleQuestionTextChange(qIndex, 'textEn', e.target.value)}
                          placeholder={isRtl ? 'نص السؤال (إنجليزي)' : 'English Question Text'}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 outline-none focus:border-brand-500"
                        />
                        {(q.textAr || q.textEn) && (
                           <div className="mt-2 p-3 bg-slate-950/50 rounded-xl border border-brand-500/10">
                              <label className="text-[9px] text-brand-400 font-bold uppercase tracking-wider block mb-1">Live Preview</label>
                              <MathRenderer className="text-sm font-medium text-white" html={isRtl ? (q.textAr || q.textEn) : (q.textEn || q.textAr)} />
                           </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveQuestion(qIndex)}
                        className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title={isRtl ? 'حذف السؤال' : 'Remove Question'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Choices List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.choices.map((choice, cIndex) => (
                        <div
                          key={cIndex}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                            choice.isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/30'
                              : 'bg-slate-900/60 border-slate-800'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleSetCorrectChoice(qIndex, cIndex)}
                            className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-all ${
                              choice.isCorrect
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'border-slate-700 text-transparent hover:border-slate-500'
                            }`}
                            title={isRtl ? 'تحديد كإجابة صحيحة' : 'Mark as correct'}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex-1 space-y-1">
                            <input
                              type="text"
                              value={choice.textAr}
                              onChange={(e) => handleChoiceChange(qIndex, cIndex, 'textAr', e.target.value)}
                              placeholder="الخيار بالعربية"
                              className="w-full bg-transparent text-xs text-white outline-none"
                            />
                            <input
                              type="text"
                              value={choice.textEn}
                              onChange={(e) => handleChoiceChange(qIndex, cIndex, 'textEn', e.target.value)}
                              placeholder="Choice in English"
                              className="w-full bg-transparent text-[11px] text-slate-400 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Save CTA */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleSaveToQuiz}
                  disabled={saving}
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isRtl ? 'جاري الحفظ في الدورة...' : 'Saving to Quiz...'}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isRtl ? `حفظ ${generatedQuestions.length} سؤال في الدورة` : `Save ${generatedQuestions.length} Questions`}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
