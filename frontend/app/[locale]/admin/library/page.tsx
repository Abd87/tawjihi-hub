'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { UploadCloud, BookOpen, Trash2, Plus, Loader2, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLibraryPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    descriptionEn: '',
    grade: 'GRADE_12',
    subject: 'MATH',
    type: 'SUMMARY',
  });

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/library');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error(isRtl ? 'الرجاء اختيار ملف' : 'Please select a file');
    
    setIsUploading(true);
    try {
      // 1. Upload file to Cloudinary
      const uploadData = new FormData();
      uploadData.append('file', file);
      
      const uploadRes = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: uploadData
      });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.error || 'Upload failed');
      
      // 2. Save document to Database
      const docRes = await fetch('/api/library', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ ...formData, fileUrl: uploadJson.url })
      });
      
      if (!docRes.ok) throw new Error('Failed to save document');
      
      toast.success(isRtl ? 'تم الرفع بنجاح' : 'Uploaded successfully');
      setShowForm(false);
      setFile(null);
      setFormData({ ...formData, titleAr: '', titleEn: '' });
      fetchDocuments();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRtl ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return;
    try {
      const res = await fetch(/api/library/ + id, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
      });
      if (res.ok) {
        toast.success('Deleted successfully');
        setDocuments(docs => docs.filter(d => d.id !== id));
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] pt-24 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{isRtl ? 'إدارة المكتبة العامة' : 'Library Management'}</h1>
              <p className="text-sm text-slate-400">{isRtl ? 'رفع الدوسيات وأوراق العمل للطلاب' : 'Upload summaries & worksheets'}</p>
            </div>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all"
          >
            <Plus className="w-5 h-5" />
            {isRtl ? 'إضافة ملف جديد' : 'Add Document'}
          </button>
        </div>

        {/* Upload Form */}
        {showForm && (
          <form onSubmit={handleUpload} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 animate-fade-in space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">{isRtl ? 'رفع ملف جديد' : 'Upload New File'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">{isRtl ? 'العنوان (بالعربية)' : 'Title (AR)'}</label>
                <input required type="text" value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" placeholder="مثال: مكثف الرياضيات" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">{isRtl ? 'العنوان (بالإنجليزية)' : 'Title (EN)'}</label>
                <input required type="text" value={formData.titleEn} onChange={e => setFormData({...formData, titleEn: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white" placeholder="Ex: Math Summary" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">{isRtl ? 'الصف الدراسي' : 'Grade'}</label>
                <select value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white">
                  <option value="GRADE_12">{isRtl ? 'توجيهي' : 'Grade 12'}</option>
                  <option value="GRADE_11">{isRtl ? 'أول ثانوي' : 'Grade 11'}</option>
                  <option value="GRADE_10">{isRtl ? 'عاشر' : 'Grade 10'}</option>
                  <option value="FOUNDATION">{isRtl ? 'تأسيس' : 'Foundation'}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">{isRtl ? 'المادة' : 'Subject'}</label>
                <select value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white">
                  <option value="MATH">{isRtl ? 'رياضيات' : 'Math'}</option>
                  <option value="PHYSICS">{isRtl ? 'فيزياء' : 'Physics'}</option>
                  <option value="CHEMISTRY">{isRtl ? 'كيمياء' : 'Chemistry'}</option>
                  <option value="BIOLOGY">{isRtl ? 'أحياء' : 'Biology'}</option>
                  <option value="ENGLISH">{isRtl ? 'لغة إنجليزية' : 'English'}</option>
                  <option value="ARABIC">{isRtl ? 'لغة عربية' : 'Arabic'}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">{isRtl ? 'نوع الملف' : 'Type'}</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white">
                  <option value="SUMMARY">{isRtl ? 'دوسية / ملخص' : 'Summary'}</option>
                  <option value="WORKSHEET">{isRtl ? 'ورقة عمل' : 'Worksheet'}</option>
                  <option value="EXAM">{isRtl ? 'امتحان سابق' : 'Past Paper'}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-300">{isRtl ? 'ملف الـ PDF' : 'PDF File'}</label>
                <div className="relative">
                  <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" required />
                  <div className="w-full bg-slate-950 border border-slate-800 border-dashed rounded-xl px-4 py-3 text-center flex items-center justify-center gap-2 text-slate-400">
                    <UploadCloud className="w-5 h-5" />
                    {file ? <span className="text-emerald-400">{file.name}</span> : <span>{isRtl ? 'اضغط لاختيار ملف' : 'Click to select PDF'}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800">{isRtl ? 'إلغاء' : 'Cancel'}</button>
              <button type="submit" disabled={isUploading} className="px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 flex items-center gap-2 disabled:opacity-50">
                {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {isUploading ? (isRtl ? 'جاري الرفع...' : 'Uploading...') : (isRtl ? 'حفظ ونشر' : 'Save & Publish')}
              </button>
            </div>
          </form>
        )}

        {/* Documents List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>
          ) : documents.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500">{isRtl ? 'لا يوجد ملفات في المكتبة' : 'No documents in library'}</div>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <button onClick={() => handleDelete(doc.id)} className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{isRtl ? doc.titleAr : doc.titleEn}</h3>
                  <div className="flex flex-wrap gap-2 text-xs font-bold mt-3">
                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-md">{doc.grade}</span>
                    <span className="bg-brand-500/10 text-brand-400 px-2 py-1 rounded-md">{doc.subject}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md">{doc.type}</span>
                  </div>
                </div>
                <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="mt-auto text-center py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors">
                  {isRtl ? 'استعراض الملف' : 'View File'}
                </a>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}