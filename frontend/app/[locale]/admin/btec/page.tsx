'use client';

import { useState, useEffect } from 'react';

export default function AdminBtecPage({ params: { locale } }: { params: { locale: string } }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    major: 'IT',
    titleAr: '',
    titleEn: '',
    descriptionAr: '',
    passCriteria: '',
    meritCriteria: '',
    distinctionCriteria: '',
    templateUrl: ''
  });

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/admin/btec');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/btec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({
          major: 'IT', titleAr: '', titleEn: '', descriptionAr: '', 
          passCriteria: '', meritCriteria: '', distinctionCriteria: '', templateUrl: ''
        });
        fetchTasks();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المهمة؟')) return;
    try {
      await fetch(`/api/admin/btec/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 font-sans bg-[#020617] min-h-screen text-slate-100">
      <h1 className="text-3xl font-bold mb-8 text-sky-400">إدارة مهام BTEC</h1>
      
      <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl mb-12">
        <h2 className="text-xl font-bold mb-6">إضافة مهمة جديدة</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-slate-400">التخصص (Major)</label>
              <select 
                className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-sky-500"
                value={formData.major}
                onChange={e => setFormData({...formData, major: e.target.value})}
              >
                <option value="IT">IT (تكنولوجيا المعلومات)</option>
                <option value="Business">Business (إدارة أعمال)</option>
                <option value="Engineering">Engineering (هندسة)</option>
                <option value="Art">Art & Design (فنون وتصميم)</option>
                <option value="Agriculture">Agriculture (زراعة)</option>
                <option value="Hospitality">Hospitality (ضيافة)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1 text-slate-400">العنوان بالعربية</label>
              <input required type="text" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-white" value={formData.titleAr} onChange={e => setFormData({...formData, titleAr: e.target.value})} />
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-slate-400">الوصف العام</label>
            <textarea rows={3} className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-white" value={formData.descriptionAr} onChange={e => setFormData({...formData, descriptionAr: e.target.value})}></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-1 text-emerald-400 font-bold">Pass Criteria (P)</label>
              <textarea placeholder="P1, P2..." rows={3} className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-white" value={formData.passCriteria} onChange={e => setFormData({...formData, passCriteria: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-sm mb-1 text-sky-400 font-bold">Merit Criteria (M)</label>
              <textarea placeholder="M1, M2..." rows={3} className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-white" value={formData.meritCriteria} onChange={e => setFormData({...formData, meritCriteria: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-sm mb-1 text-amber-400 font-bold">Distinction Criteria (D)</label>
              <textarea placeholder="D1, D2..." rows={3} className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-white" value={formData.distinctionCriteria} onChange={e => setFormData({...formData, distinctionCriteria: e.target.value})}></textarea>
            </div>
          </div>
          
          <div>
            <label className="block text-sm mb-1 text-slate-400">رابط القالب (Word/PDF Template URL)</label>
            <input type="text" className="w-full bg-[#020617] border border-slate-700 rounded-lg p-2 text-white" placeholder="https://drive.google.com/..." value={formData.templateUrl} onChange={e => setFormData({...formData, templateUrl: e.target.value})} />
          </div>

          <button type="submit" className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-6 rounded-lg transition-colors">
            حفظ المهمة
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-6">المهام الحالية</h2>
      {loading ? <p>جاري التحميل...</p> : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded mb-2 inline-block">{task.major}</span>
                <h3 className="text-xl font-bold">{task.titleAr}</h3>
                <p className="text-slate-400 text-sm mt-1 line-clamp-1">{task.descriptionAr}</p>
              </div>
              <button onClick={() => handleDelete(task.id)} className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                حذف
              </button>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-slate-500">لا يوجد مهام مدخلة بعد.</p>}
        </div>
      )}
    </div>
  );
}
