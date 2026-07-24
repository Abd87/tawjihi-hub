'use client';

import { useState, useEffect } from 'react';
import { getGrade11Exams, getGrade11ExamById } from '@/app/actions/grade11-exams';
import { updateGrade11Question, deleteGrade11Question, updateGrade11ExamText } from '@/app/actions/admin-grade11';
import { Loader2, Edit3, Trash2, Save, X, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function AdminGrade11ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);
  
  // Active questions for the expanded exam
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  // Editing state
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editExamText, setEditExamText] = useState<string>('');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    const data = await getGrade11Exams();
    setExams(data);
    setLoading(false);
  };

  const handleExpandExam = async (examId: string) => {
    if (expandedExamId === examId) {
      setExpandedExamId(null);
      setQuestions([]);
      return;
    }
    
    setExpandedExamId(examId);
    setLoadingQuestions(true);
    const exam = await getGrade11ExamById(examId);
    if (exam) {
      setQuestions(exam.questions);
    }
    setLoadingQuestions(false);
    setEditingQId(null);
  };

  const startEditing = (q: any) => {
    setEditingQId(q.id);
    setEditFormData({
      question: q.question,
      choices: [...q.choices],
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation || ''
    });
  };

  const handleSave = async (questionId: string) => {
    const res = await updateGrade11Question(questionId, editFormData);
    if (res.success) {
      alert('Question updated successfully!');
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, ...editFormData } : q));
      setEditingQId(null);
    } else {
      alert('Failed to update question: ' + res.error);
    }
  };

  const handleDelete = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question? This cannot be undone.')) return;
    
    const res = await deleteGrade11Question(questionId);
    if (res.success) {
      alert('Question deleted successfully!');
      setQuestions(prev => prev.filter(q => q.id !== questionId));
      setExams(prev => prev.map(e => e.id === expandedExamId ? { ...e, questionsCount: e.questionsCount - 1 } : e));
    } else {
      alert('Failed to delete question: ' + res.error);
    }
  };

  const handleChoiceChange = (idx: number, val: string) => {
    const newChoices = [...editFormData.choices];
    newChoices[idx] = val;
    setEditFormData({ ...editFormData, choices: newChoices });
  };

  const handleSaveText = async (examId: string) => {
    const res = await updateGrade11ExamText(examId, editExamText);
    if (res.success) {
      alert('Reading passage text updated successfully!');
      setExams(prev => prev.map(e => e.id === examId ? { ...e, text: editExamText } : e));
      setEditingTextId(null);
    } else {
      alert('Failed to update text: ' + res.error);
    }
  };

  return (
    <div className="space-y-6 dir-ltr text-left" dir="ltr">
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Grade 11 Free Exams</h1>
        <p className="text-slate-400">Edit or delete questions across all 10 units.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
      ) : (
        <div className="space-y-4">
          {exams.map(exam => (
            <div key={exam.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                onClick={() => handleExpandExam(exam.id)}
              >
                <div>
                  <h3 className="font-bold text-white text-lg">Unit {exam.unitNumber}: {exam.titleEn}</h3>
                  <p className="text-sm text-slate-400">{exam.questionsCount} Questions</p>
                </div>
                {expandedExamId === exam.id ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
              </div>

              {expandedExamId === exam.id && (
                <div className="border-t border-slate-800 p-4 bg-slate-900/50">
                  {loadingQuestions ? (
                     <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
                  ) : (
                    <div className="space-y-8">
                      {/* Passage Editor */}
                      <div className="bg-slate-950 p-6 rounded-2xl border border-brand-500/30">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-bold text-white flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-brand-400" />
                            Reading Passage
                          </h4>
                          {editingTextId === exam.id ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleSaveText(exam.id)}
                                className="px-4 py-2 bg-brand-500 text-white rounded-lg text-xs font-bold hover:bg-brand-600 transition-colors flex items-center gap-2"
                              >
                                <Save className="w-4 h-4" /> Save
                              </button>
                              <button 
                                onClick={() => setEditingTextId(null)}
                                className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => {
                                setEditingTextId(exam.id);
                                setEditExamText(exam.text || '');
                              }}
                              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-2"
                            >
                              <Edit3 className="w-4 h-4" /> Edit Passage
                            </button>
                          )}
                        </div>
                        
                        {editingTextId === exam.id ? (
                          <textarea 
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-300 text-sm font-mono h-[300px]"
                            value={editExamText}
                            onChange={(e) => setEditExamText(e.target.value)}
                            placeholder="Enter reading passage text here. Use <b>...</b> for bold and <u>...</u> for underlined text."
                          />
                        ) : (
                          <div className="text-sm text-slate-400 font-serif leading-relaxed line-clamp-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800" dangerouslySetInnerHTML={{ __html: exam.text || 'No reading passage added yet.' }} />
                        )}
                      </div>

                      {/* Questions List */}
                      <div className="space-y-6">
                        <h4 className="text-lg font-bold text-white mb-4">Questions ({questions.length})</h4>
                        {questions.map((q, idx) => (
                        <div key={q.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                          
                          {editingQId === q.id ? (
                            <div className="space-y-4">
                              <div>
                                <label className="block text-xs text-slate-400 mb-1">Question Text</label>
                                <textarea 
                                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white text-sm"
                                  rows={3}
                                  value={editFormData.question}
                                  onChange={(e) => setEditFormData({...editFormData, question: e.target.value})}
                                />
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {editFormData.choices.map((choice: string, cIdx: number) => (
                                  <div key={cIdx} className="flex gap-2 items-center">
                                    <input 
                                      type="radio" 
                                      name={`correct-${q.id}`} 
                                      checked={editFormData.correctAnswerIndex === cIdx}
                                      onChange={() => setEditFormData({...editFormData, correctAnswerIndex: cIdx})}
                                      className="w-4 h-4 text-brand-500"
                                    />
                                    <input 
                                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-white text-sm"
                                      value={choice}
                                      onChange={(e) => handleChoiceChange(cIdx, e.target.value)}
                                    />
                                  </div>
                                ))}
                              </div>

                              <div>
                                <label className="block text-xs text-brand-400 mb-1 font-semibold">Explanation (Optional)</label>
                                <textarea 
                                  className="w-full bg-brand-500/5 border border-brand-500/20 rounded-lg p-3 text-brand-200 text-sm placeholder-brand-500/30"
                                  rows={2}
                                  placeholder="Why is this the correct answer?"
                                  value={editFormData.explanation || ''}
                                  onChange={(e) => setEditFormData({...editFormData, explanation: e.target.value})}
                                />
                              </div>
                              
                              <div className="flex items-center gap-3 justify-end pt-2">
                                <button 
                                  onClick={() => setEditingQId(null)}
                                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                                >
                                  Cancel
                                </button>
                                <button 
                                  onClick={() => handleSave(q.id)}
                                  className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                                >
                                  <Save className="w-4 h-4" /> Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between items-start gap-4">
                                <h4 className="text-slate-200 font-medium whitespace-pre-wrap"><span className="text-slate-500 mr-2">{idx + 1}.</span>{q.question}</h4>
                                <div className="flex gap-2">
                                  <button onClick={() => startEditing(q)} className="p-1.5 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded transition-colors" title="Edit">
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDelete(q.id)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                                {q.choices.map((choice: string, cIdx: number) => (
                                  <div 
                                    key={cIdx} 
                                    className={`p-2 rounded border text-sm ${
                                      q.correctAnswerIndex === cIdx 
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                        : 'bg-slate-900 border-slate-800 text-slate-400'
                                    }`}
                                  >
                                    <span className="mr-2 opacity-50">{String.fromCharCode(65 + cIdx)}.</span>
                                    {choice}
                                  </div>
                                ))}
                              </div>
                              {q.explanation && (
                                <div className="mt-3 pl-6 text-xs text-brand-300 bg-brand-500/5 p-3 rounded-lg border border-brand-500/10">
                                  <strong>Explanation:</strong> {q.explanation}
                                </div>
                              )}
                            </div>
                          )}
                          
                        </div>
                      ))}
                      </div>
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
