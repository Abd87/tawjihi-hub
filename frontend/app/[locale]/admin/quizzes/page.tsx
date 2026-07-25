'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Edit3, Trash2, Save, X, ChevronDown, ChevronUp, BookOpen, Plus, Layers, AlertCircle } from 'lucide-react';

export default function AdminQuizzesPage() {
  const t = useTranslations('admin');
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const router = useRouter();
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuizId, setExpandedQuizId] = useState<string | null>(null);
  
  // Quiz details state
  const [quizDetails, setQuizDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Editing state
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionData, setEditSectionData] = useState<any>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/quizzes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleExpandQuiz = async (quizId: string) => {
    if (expandedQuizId === quizId) {
      setExpandedQuizId(null);
      setQuizDetails(null);
      return;
    }
    
    setExpandedQuizId(quizId);
    setLoadingDetails(true);
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setQuizDetails(data.quiz);
      }
    } catch (e) {
      console.error(e);
    }
    
    setLoadingDetails(false);
    setEditingQId(null);
    setEditingSectionId(null);
  };

  const startEditingQuestion = (q: any) => {
    setEditingQId(q.id);
    setEditFormData({
      textAr: q.textAr || '',
      textEn: q.textEn || '',
      type: q.type || 'MCQ',
      choices: q.choices ? q.choices.map((c: any) => ({ ...c })) : [],
      explanationAr: q.explanationAr || '',
      explanationEn: q.explanationEn || ''
    });
  };

  const handleSaveQuestion = async (questionId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/quizzes/${expandedQuizId}/questions/${questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData)
      });
      
      if (response.ok) {
        alert('Question updated successfully!');
        // Update local state
        setQuizDetails((prev: any) => {
          const newSections = prev.sections.map((sec: any) => ({
            ...sec,
            questions: sec.questions.map((q: any) => q.id === questionId ? { ...q, ...editFormData } : q)
          }));
          return { ...prev, sections: newSections };
        });
        setEditingQId(null);
      } else {
        alert('Failed to update question');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/quizzes/${expandedQuizId}/questions/${questionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setQuizDetails((prev: any) => {
          const newSections = prev.sections.map((sec: any) => ({
            ...sec,
            questions: sec.questions.filter((q: any) => q.id !== questionId)
          }));
          return { ...prev, sections: newSections };
        });
      }
    } catch(e) { console.error(e); }
  };

  const startEditingSection = (sec: any) => {
    setEditingSectionId(sec.id);
    setEditSectionData({
      passageAr: sec.passageAr || '',
      passageEn: sec.passageEn || '',
      titleAr: sec.titleAr || '',
      titleEn: sec.titleEn || ''
    });
  };

  const handleSaveSection = async (sectionId: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/quizzes/${expandedQuizId}/sections/${sectionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editSectionData)
      });
      
      if (response.ok) {
        alert('Section updated successfully!');
        setQuizDetails((prev: any) => {
          const newSections = prev.sections.map((sec: any) => 
            sec.id === sectionId ? { ...sec, ...editSectionData } : sec
          );
          return { ...prev, sections: newSections };
        });
        setEditingSectionId(null);
      } else {
        alert('Failed to update section');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating section');
    }
  };

  const handleChoiceChange = (idx: number, field: string, val: any) => {
    const newChoices = [...editFormData.choices];
    newChoices[idx] = { ...newChoices[idx], [field]: val };
    
    // Enforce single correct answer for MCQ if needed
    if (field === 'isCorrect' && val === true) {
      newChoices.forEach((c, i) => { if (i !== idx) c.isCorrect = false; });
    }
    
    setEditFormData({ ...editFormData, choices: newChoices });
  };

  return (
    <div className="space-y-6 dir-ltr text-left" dir="ltr">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Quizzes</h1>
          <p className="text-slate-400">Inline editor for courses quizzes, sections, and questions.</p>
        </div>
        <button className="px-4 py-2 bg-brand-500 text-white rounded-lg flex items-center gap-2 font-bold hover:bg-brand-600 transition" onClick={() => alert('Quiz creation modal coming soon!')}>
          <Plus className="w-4 h-4" /> Create New Quiz
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
      ) : (
        <div className="space-y-4">
          {quizzes.map(quiz => (
            <div key={quiz.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => handleExpandQuiz(quiz.id)}
              >
                <div>
                  <h3 className="font-bold text-white text-lg">{quiz.titleEn || quiz.titleAr}</h3>
                  <p className="text-sm text-slate-400">Course: {quiz.course?.titleEn || 'N/A'} • Duration: {quiz.durationMinutes}m</p>
                </div>
                {expandedQuizId === quiz.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </div>

              {expandedQuizId === quiz.id && (
                <div className="border-t border-slate-800 p-4 bg-slate-900/50">
                  {loadingDetails ? (
                     <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                  ) : quizDetails && (
                    <div className="space-y-8">
                      {quizDetails.sections.map((section: any, sIdx: number) => (
                        <div key={section.id} className="bg-slate-950 p-6 rounded-2xl border border-slate-700">
                          
                          {/* SECTION HEADER & PASSAGE EDITOR */}
                          <div className="mb-6 border-b border-slate-800 pb-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-brand-400 flex items-center gap-2">
                                <Layers className="w-5 h-5" />
                                Section {sIdx + 1}: {section.titleEn || section.titleAr}
                              </h4>
                              {editingSectionId === section.id ? (
                                <div className="flex gap-2">
                                  <button onClick={() => handleSaveSection(section.id)} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-600 flex items-center gap-2">
                                    <Save className="w-4 h-4" /> Save Section
                                  </button>
                                  <button onClick={() => setEditingSectionId(null)} className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button onClick={() => startEditingSection(section)} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold hover:bg-slate-700 flex items-center gap-2">
                                  <Edit3 className="w-4 h-4" /> Edit Section/Passage
                                </button>
                              )}
                            </div>

                            {editingSectionId === section.id ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Title (EN)</label>
                                    <input value={editSectionData.titleEn} onChange={e => setEditSectionData({...editSectionData, titleEn: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1">Title (AR)</label>
                                    <input value={editSectionData.titleAr} onChange={e => setEditSectionData({...editSectionData, titleAr: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white" dir="rtl" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-xs font-bold text-brand-400 mb-1">Reading Passage (EN)</label>
                                    <textarea value={editSectionData.passageEn} onChange={e => setEditSectionData({...editSectionData, passageEn: e.target.value})} rows={6} className="w-full bg-slate-900 border border-brand-500/50 rounded-lg px-3 py-2 text-white font-mono text-xs" />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-bold text-brand-400 mb-1">Reading Passage (AR)</label>
                                    <textarea value={editSectionData.passageAr} onChange={e => setEditSectionData({...editSectionData, passageAr: e.target.value})} rows={6} className="w-full bg-slate-900 border border-brand-500/50 rounded-lg px-3 py-2 text-white font-mono text-xs" dir="rtl" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              (section.passageEn || section.passageAr) && (
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-sm text-slate-300 font-serif max-h-40 overflow-y-auto" dir={section.passageAr && !section.passageEn ? 'rtl' : 'ltr'}>
                                  {section.passageEn || section.passageAr}
                                </div>
                              )
                            )}
                          </div>

                          {/* QUESTIONS LIST */}
                          <div className="space-y-4">
                            {section.questions.map((q: any, qIdx: number) => (
                              <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                {editingQId === q.id ? (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Question (EN)</label>
                                        <textarea value={editFormData.textEn} onChange={e => setEditFormData({...editFormData, textEn: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm" rows={2} />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-1">Question (AR)</label>
                                        <textarea value={editFormData.textAr} onChange={e => setEditFormData({...editFormData, textAr: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white text-sm" rows={2} dir="rtl" />
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <label className="block text-xs font-bold text-slate-400">Options</label>
                                      {editFormData.choices.map((choice: any, cIdx: number) => (
                                        <div key={cIdx} className="flex items-center gap-3">
                                          <input type="radio" name={`correct-${q.id}`} checked={choice.isCorrect} onChange={() => handleChoiceChange(cIdx, 'isCorrect', true)} className="w-4 h-4 accent-brand-500" />
                                          <input value={choice.textEn} onChange={e => handleChoiceChange(cIdx, 'textEn', e.target.value)} placeholder="Option EN" className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" />
                                          <input value={choice.textAr} onChange={e => handleChoiceChange(cIdx, 'textAr', e.target.value)} placeholder="Option AR" className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white" dir="rtl" />
                                          <button onClick={() => setEditFormData({ ...editFormData, choices: editFormData.choices.filter((_:any, i:number) => i !== cIdx)})} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                      ))}
                                      <button onClick={() => setEditFormData({...editFormData, choices: [...editFormData.choices, {textEn:'', textAr:'', isCorrect:false}]})} className="text-xs text-brand-400 font-bold hover:underline">+ Add Option</button>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-xs font-bold text-amber-400 mb-1">Explanation (EN)</label>
                                        <textarea value={editFormData.explanationEn} onChange={e => setEditFormData({...editFormData, explanationEn: e.target.value})} className="w-full bg-slate-950 border border-amber-500/30 rounded-lg px-3 py-2 text-amber-100 text-sm" rows={2} />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-bold text-amber-400 mb-1">Explanation (AR)</label>
                                        <textarea value={editFormData.explanationAr} onChange={e => setEditFormData({...editFormData, explanationAr: e.target.value})} className="w-full bg-slate-950 border border-amber-500/30 rounded-lg px-3 py-2 text-amber-100 text-sm" rows={2} dir="rtl" />
                                      </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                      <button onClick={() => setEditingQId(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-700">Cancel</button>
                                      <button onClick={() => handleSaveQuestion(q.id)} className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold flex items-center gap-2"><Save className="w-4 h-4"/> Save Question</button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-3 flex-1">
                                      <h5 className="font-bold text-white text-sm">
                                        <span className="text-slate-500 mr-2">{qIdx + 1}.</span> 
                                        {q.textEn || q.textAr}
                                      </h5>
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        {q.choices?.map((c: any, i: number) => (
                                          <div key={i} className={`p-2 rounded-lg border ${c.isCorrect ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                                            {c.textEn || c.textAr} {c.isCorrect && '✓'}
                                          </div>
                                        ))}
                                      </div>
                                      {(q.explanationEn || q.explanationAr) && (
                                        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs text-amber-300/80 flex gap-2">
                                          <AlertCircle className="w-4 h-4 shrink-0" />
                                          <span>{q.explanationEn || q.explanationAr}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                      <button onClick={() => startEditingQuestion(q)} className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:text-white hover:bg-slate-700"><Edit3 className="w-4 h-4" /></button>
                                      <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
