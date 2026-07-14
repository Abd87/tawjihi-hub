'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Save, AlertCircle, CheckCircle2, ArrowLeft, Trash2, Plus, Database } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function BulkQuizUploader() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [courseId, setCourseId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (courseId) {
      const course = courses.find(c => c.id === courseId);
      setLessons(course?.lessons || []);
      setLessonId('');
    } else {
      setLessons([]);
    }
  }, [courseId, courses]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (e) {}
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // For demo purposes, we will mock CSV parsing.
    // In production, use papaparse or xlsx library.
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newQuestions = [];
      
      // Skip header line
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const cols = lines[i].split(',');
        if (cols.length >= 6) {
          newQuestions.push({
            id: 'temp-' + Date.now() + i,
            text: cols[0]?.trim(),
            optionA: cols[1]?.trim(),
            optionB: cols[2]?.trim(),
            optionC: cols[3]?.trim(),
            optionD: cols[4]?.trim(),
            correctAnswer: cols[5]?.trim(),
            explanation: cols[6]?.trim() || '',
          });
        }
      }
      setQuestions([...questions, ...newQuestions]);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addEmptyRow = () => {
    setQuestions([...questions, {
      id: 'temp-' + Date.now(),
      text: '', optionA: '', optionB: '', optionC: '', optionD: '',
      correctAnswer: 'A', explanation: ''
    }]);
  };

  const updateQuestion = (id: string, field: string, value: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    if (!lessonId) {
      setMessage({ type: 'error', text: 'Please select a course and lesson first.' });
      return;
    }
    if (questions.length === 0) {
      setMessage({ type: 'error', text: 'No questions to save.' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/studio/bulk-questions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ lessonId, questions })
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: `Successfully saved ${questions.length} questions.` });
        setQuestions([]);
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save questions.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    }
    setSaving(false);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/studio" className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800">
          <ArrowLeft className="h-5 w-5 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">Bulk Quiz Uploader</h1>
          <p className="text-slate-400 text-sm mt-1">Upload or type questions rapidly.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-wrap gap-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Course</label>
          <select 
            value={courseId} 
            onChange={e => setCourseId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
          >
            <option value="">-- Choose Course --</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.titleAr} / {c.titleEn}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Lesson</label>
          <select 
            value={lessonId} 
            onChange={e => setLessonId(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
            disabled={!courseId}
          >
            <option value="">-- Choose Lesson --</option>
            {lessons.map(l => (
              <option key={l.id} value={l.id}>{l.titleAr} / {l.titleEn}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl transition-colors font-semibold">
            <Upload className="h-5 w-5" />
            <span>Upload CSV</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-8 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
          {message.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          <span className="font-semibold">{message.text}</span>
        </div>
      )}

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500 font-bold">
              <tr>
                <th className="px-4 py-3 min-w-[200px]">Question Text</th>
                <th className="px-4 py-3 min-w-[120px]">Option A</th>
                <th className="px-4 py-3 min-w-[120px]">Option B</th>
                <th className="px-4 py-3 min-w-[120px]">Option C</th>
                <th className="px-4 py-3 min-w-[120px]">Option D</th>
                <th className="px-4 py-3 min-w-[100px]">Correct</th>
                <th className="px-4 py-3 min-w-[150px]">Explanation</th>
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {questions.map((q, index) => (
                <tr key={q.id} className="hover:bg-slate-800/20">
                  <td className="p-2"><input type="text" value={q.text} onChange={e => updateQuestion(q.id, 'text', e.target.value)} className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-white focus:border-brand-500 focus:bg-slate-950" placeholder="Question..." /></td>
                  <td className="p-2"><input type="text" value={q.optionA} onChange={e => updateQuestion(q.id, 'optionA', e.target.value)} className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-white focus:border-brand-500 focus:bg-slate-950" /></td>
                  <td className="p-2"><input type="text" value={q.optionB} onChange={e => updateQuestion(q.id, 'optionB', e.target.value)} className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-white focus:border-brand-500 focus:bg-slate-950" /></td>
                  <td className="p-2"><input type="text" value={q.optionC} onChange={e => updateQuestion(q.id, 'optionC', e.target.value)} className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-white focus:border-brand-500 focus:bg-slate-950" /></td>
                  <td className="p-2"><input type="text" value={q.optionD} onChange={e => updateQuestion(q.id, 'optionD', e.target.value)} className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-white focus:border-brand-500 focus:bg-slate-950" /></td>
                  <td className="p-2">
                    <select value={q.correctAnswer} onChange={e => updateQuestion(q.id, 'correctAnswer', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-2 text-white focus:border-brand-500">
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="D">D</option>
                    </select>
                  </td>
                  <td className="p-2"><input type="text" value={q.explanation} onChange={e => updateQuestion(q.id, 'explanation', e.target.value)} className="w-full bg-transparent border border-slate-800 rounded px-3 py-2 text-white focus:border-brand-500 focus:bg-slate-950" placeholder="Optional..." /></td>
                  <td className="p-2 text-center">
                    <button onClick={() => removeQuestion(q.id)} className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {questions.length === 0 && (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <Database className="h-12 w-12 mb-4 opacity-20" />
              <p>No questions added yet. Upload a CSV or add a row manually.</p>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-slate-800 bg-slate-900/30">
          <button onClick={addEmptyRow} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-400 px-4 py-2 bg-brand-500/10 rounded-lg">
            <Plus className="h-4 w-4" /> Add Row
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave} 
          disabled={saving || questions.length === 0}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-brand-500/20"
        >
          {saving ? <AlertCircle className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          <span>Save {questions.length} Questions</span>
        </button>
      </div>

    </div>
  );
}
