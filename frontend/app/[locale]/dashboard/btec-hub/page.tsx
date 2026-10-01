'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BtecHubPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/btec');
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
    fetchTasks();
  }, []);

  // Map majors to colors
  const getColor = (major: string) => {
    switch(major.toUpperCase()) {
      case 'IT': return 'emerald';
      case 'BUSINESS': return 'sky';
      case 'ENGINEERING': return 'amber';
      case 'ART': return 'purple';
      default: return 'indigo';
    }
  };

  return (
    <div className="min-h-screen p-8 text-slate-100 font-sans max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400">مرجع مهام BTEC 📚</h1>
          <p className="text-slate-400 mt-2">مساحة عمل متكاملة لمهام وتعيينات نظام بيتيك المعتمدة</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-12 text-center">
          <h3 className="text-xl font-bold text-slate-400 mb-2">لا توجد مهام حالياً</h3>
          <p className="text-slate-500">سيقوم المعلمون والمدراء بإضافة مهام التخصصات قريباً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {tasks.map(task => {
            const c = getColor(task.major);
            return (
              <div key={task.id} className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden group flex flex-col h-full">
                {/* Fallback to hardcoded tailwind classes to ensure they compile correctly if dynamically generated classes fail in purge */}
                <div className={`absolute top-0 right-0 w-2 h-full ${c === 'emerald' ? 'bg-emerald-500' : c === 'sky' ? 'bg-sky-500' : c === 'amber' ? 'bg-amber-500' : c === 'purple' ? 'bg-purple-500' : 'bg-indigo-500'}`}></div>
                
                <span className={`text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit inline-block ${c === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : c === 'sky' ? 'bg-sky-500/20 text-sky-400' : c === 'amber' ? 'bg-amber-500/20 text-amber-400' : c === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                  {task.major}
                </span>
                
                <h2 className="text-xl font-bold mb-2 flex-grow-0">{task.titleAr}</h2>
                <p className="text-slate-400 text-sm mb-6 flex-grow">{task.descriptionAr}</p>
                
                <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs font-bold shrink-0">
                  <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                    <span className="text-slate-300 block mb-1">Pass</span>
                    <span className="text-emerald-400 line-clamp-1" title={task.passCriteria}>{task.passCriteria || '-'}</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                    <span className="text-slate-300 block mb-1">Merit</span>
                    <span className="text-sky-400 line-clamp-1" title={task.meritCriteria}>{task.meritCriteria || '-'}</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                    <span className="text-slate-300 block mb-1">Distinction</span>
                    <span className="text-amber-400 line-clamp-1" title={task.distinctionCriteria}>{task.distinctionCriteria || '-'}</span>
                  </div>
                </div>

                {task.templateUrl ? (
                  <a href={task.templateUrl} target="_blank" rel="noopener noreferrer" className={`text-center block w-full py-2 rounded-xl font-medium transition-colors ${c === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' : c === 'sky' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20' : c === 'amber' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20'}`}>
                    📥 تحميل قالب المهمة
                  </a>
                ) : (
                  <button disabled className="w-full bg-slate-800/50 text-slate-500 py-2 rounded-xl font-medium cursor-not-allowed">
                    القالب غير متوفر
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
