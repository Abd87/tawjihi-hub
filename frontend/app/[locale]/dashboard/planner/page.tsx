'use client';

import { useState, useEffect } from 'react';

interface Block {
  id: string;
  subject: string;
  time: string;
  completed: boolean;
}

interface DaySchedule {
  day: string;
  blocks: Block[];
}

export default function PlannerPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  const [subjects, setSubjects] = useState('');
  const [studyHours, setStudyHours] = useState('4');
  const [schedule, setSchedule] = useState<DaySchedule[] | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('study_schedule');
    if (saved) {
      setSchedule(JSON.parse(saved));
    }
  }, []);

  const generateSchedule = () => {
    const subjectList = subjects.split(/[,،\n]/).map(s => s.trim()).filter(s => s.length > 0);
    if (subjectList.length === 0) return;

    const days = isAr 
      ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const newSchedule: DaySchedule[] = days.map(day => {
      const blocks: Block[] = [];
      const hours = parseInt(studyHours) || 4;
      
      // Very basic distribution: 1 hour blocks
      for (let i = 0; i < hours; i++) {
        // Pick a random subject from the list to spread them out
        const randomSubject = subjectList[Math.floor(Math.random() * subjectList.length)];
        
        blocks.push({
          id: `${day}-${i}`,
          subject: randomSubject,
          time: `جلسة بومودورو ${i + 1} (50 دقيقة دراسة + 10 راحة)`,
          completed: false
        });
      }
      return { day, blocks };
    });

    setSchedule(newSchedule);
    localStorage.setItem('study_schedule', JSON.stringify(newSchedule));
  };

  const toggleBlock = (dayIndex: number, blockIndex: number) => {
    if (!schedule) return;
    const newSchedule = [...schedule];
    newSchedule[dayIndex].blocks[blockIndex].completed = !newSchedule[dayIndex].blocks[blockIndex].completed;
    setSchedule(newSchedule);
    localStorage.setItem('study_schedule', JSON.stringify(newSchedule));
  };

  return (
    <div className="min-h-screen p-8 text-slate-100 font-sans">
      
      {/* --- Print ONLY Area --- */}
      <div className="hidden print:block text-black bg-white w-full">
        <div className="text-center mb-8 border-b-2 border-black pb-4">
          <h1 className="text-4xl font-bold">توجيهي هب - الجدول الدراسي الذكي</h1>
          <p className="text-lg text-gray-600 mt-2">رحلة الألف ميل تبدأ بخطوة. استمر في التركيز!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedule?.map((day, dIdx) => (
            <div key={dIdx} className="border border-gray-400 rounded-xl p-4 mb-4 page-break-inside-avoid">
              <h2 className="text-2xl font-bold bg-gray-100 p-2 rounded-t-lg mb-4 text-center border-b border-gray-300">
                {day.day}
              </h2>
              <div className="space-y-3">
                {day.blocks.map((block, bIdx) => (
                  <div key={block.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-gray-500 rounded-sm"></div>
                      <div>
                        <p className="font-bold text-lg">{block.subject}</p>
                        <p className="text-sm text-gray-600">{block.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            @page { margin: 1cm; size: A4 portrait; }
            body { background: white; -webkit-print-color-adjust: exact; }
          }
        `}} />
      </div>

      {/* --- Screen ONLY Area --- */}
      <div className="max-w-6xl mx-auto print:hidden">
        
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-sky-400">الجدول الدراسي الذكي 🧠</h1>
            <p className="text-slate-400 mt-2">قم بإنشاء وتتبع جدولك الدراسي باستخدام تقنية بومودورو</p>
          </div>
          {schedule && (
            <button 
              onClick={() => window.print()} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2"
            >
              🖨️ طباعة الجدول
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Settings Sidebar */}
          <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl lg:col-span-1 h-fit">
            <h2 className="text-xl font-bold mb-6 text-white border-b border-slate-700 pb-4">⚙️ إعدادات الجدول</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">المواد الدراسية (افصل بينها بفاصلة)</label>
                <textarea 
                  className="w-full bg-[#020617] border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-sky-500 focus:outline-none min-h-[100px]"
                  placeholder="مثال: رياضيات، فيزياء، لغة عربية، إنجليزي"
                  value={subjects}
                  onChange={e => setSubjects(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ساعات الدراسة اليومية</label>
                <input 
                  type="number"
                  min="1"
                  max="12"
                  className="w-full bg-[#020617] border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-sky-500 focus:outline-none"
                  value={studyHours}
                  onChange={e => setStudyHours(e.target.value)}
                />
              </div>

              <button 
                onClick={generateSchedule}
                className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-500/20"
              >
                ✨ إنشاء جدول ذكي
              </button>

              {schedule && (
                <button 
                  onClick={() => { setSchedule(null); localStorage.removeItem('study_schedule'); }}
                  className="w-full bg-transparent border border-rose-500/50 text-rose-400 hover:bg-rose-500/10 font-bold py-3 rounded-xl transition-all"
                >
                  🗑️ مسح الجدول الحالي
                </button>
              )}
            </div>
          </div>

          {/* Schedule Display */}
          <div className="lg:col-span-2">
            {!schedule ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-[#0f172a]/50 rounded-2xl border border-slate-800/50 border-dashed">
                <div className="text-5xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">لا يوجد جدول حالياً</h3>
                <p className="text-slate-500">قم بإدخال موادك وساعات الدراسة لتوليد جدولك الذكي</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedule.map((day, dIdx) => (
                  <div key={dIdx} className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                    <div className="bg-slate-800/50 p-4 border-b border-slate-700">
                      <h3 className="font-bold text-lg text-sky-300">{day.day}</h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {day.blocks.map((block, bIdx) => (
                        <div 
                          key={block.id} 
                          onClick={() => toggleBlock(dIdx, bIdx)}
                          className={`flex items-start gap-4 p-3 rounded-xl cursor-pointer transition-all border ${block.completed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#020617] border-slate-700 hover:border-slate-500'}`}
                        >
                          <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${block.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-500'}`}>
                            {block.completed && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <div>
                            <p className={`font-bold ${block.completed ? 'text-emerald-400 line-through opacity-70' : 'text-slate-200'}`}>
                              {block.subject}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{block.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
