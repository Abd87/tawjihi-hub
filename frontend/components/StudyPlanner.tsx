'use client';

import { useState, useEffect } from 'react';
import { Calendar, Target, TrendingUp, AlertTriangle, Book, Clock } from 'lucide-react';

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  mockProgress?: number;
  mockLessonsCount?: number;
}

interface StudyPlannerProps {
  courses: Course[];
  isRtl: boolean;
  user?: any;
}

export default function StudyPlanner({ courses, isRtl, user }: StudyPlannerProps) {
  const [examDate, setExamDate] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDate = localStorage.getItem('targetExamDate');
      if (savedDate) {
        setExamDate(savedDate);
      }
    }
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setExamDate(newDate);
    if (typeof window !== 'undefined') {
      localStorage.setItem('targetExamDate', newDate);
    }
  };

  // Calculations
  const totalLessons = courses.reduce((acc, c) => acc + (c.mockLessonsCount || 0), 0);
  const averageProgress = courses.length > 0 ? (courses.reduce((acc, c) => acc + (c.mockProgress || 0), 0) / courses.length) : 0;
  const completedLessons = Math.round(totalLessons * (averageProgress / 100));
  const remainingLessons = totalLessons - completedLessons;

  const today = new Date();
  const targetDate = examDate ? new Date(examDate) : null;
  
  let daysRemaining = 0;
  if (targetDate) {
    const diffTime = targetDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const lessonsPerDay = daysRemaining > 0 ? (remainingLessons / daysRemaining).toFixed(1) : 0;
  
  // Is it valid?
  const isValidDate = daysRemaining > 0;
  const isUrgent = daysRemaining > 0 && daysRemaining <= 30;

  const renderRoutine = () => {
    if (!user || !user.trackType) return null;
    
    if (user.trackType === 'BTEC') {
      return (
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <h4 className="text-white font-bold mb-3 flex items-center gap-2">
            <Book className="h-4 w-4 text-brand-300" />
            {isRtl ? 'روتين BTEC المقترح' : 'Suggested BTEC Routine'}
          </h4>
          <ul className="text-sm text-brand-100 space-y-2">
            <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-amber-300" /> {isRtl ? 'أيام المدرسة: ركز على المشاريع العملية (ساعتين)' : 'School Days: Focus on practical assignments (2 hours)'}</li>
            <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-emerald-300" /> {isRtl ? 'عطلة نهاية الأسبوع: مراجعة المواد النظرية وإنجاز التقارير' : 'Weekends: Review theory and finish reports'}</li>
            <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-blue-300" /> {isRtl ? 'نصيحة: قسم المشاريع الكبيرة إلى مهام يومية صغيرة' : 'Tip: Break large projects into daily mini-tasks'}</li>
          </ul>
        </div>
      );
    }

    return (
      <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
        <h4 className="text-white font-bold mb-3 flex items-center gap-2">
          <Book className="h-4 w-4 text-brand-300" />
          {isRtl ? 'الروتين الأكاديمي المقترح' : 'Suggested Academic Routine'}
        </h4>
        <ul className="text-sm text-brand-100 space-y-2">
          <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-amber-300" /> {isRtl ? 'أيام المدرسة: دراسة مادتين كحد أقصى (3 ساعات)' : 'School Days: Study max 2 subjects (3 hours)'}</li>
          <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-emerald-300" /> {isRtl ? 'عطلة نهاية الأسبوع: حل أسئلة وزارية وتكثيف الدراسة (6 ساعات)' : 'Weekends: Solve past papers and intense study (6 hours)'}</li>
          <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-blue-300" /> {isRtl ? 'نصيحة: استخدم تقنية بومودورو (25 دقيقة دراسة / 5 راحة)' : 'Tip: Use Pomodoro technique (25m study / 5m break)'}</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-5 relative overflow-hidden shadow-xl shadow-brand-500/20">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
        
        {/* Left Side: Input */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-black text-white">
              {isRtl ? 'المخطط الدراسي الذكي' : 'Smart Study Planner'}
            </h2>
          </div>
          <p className="text-brand-100 text-xs mb-4">
            {isRtl ? 'أدخل تاريخ امتحانك لحساب الخطة.' : 'Enter your exam date.'}
          </p>

          <input 
            type="date" 
            value={examDate}
            onChange={handleDateChange}
            className="block w-full max-w-[200px] px-3 py-2 border border-white/30 rounded-lg bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-white transition-all font-bold shadow-inner"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Right Side: Stats Panel */}
        <div className="w-full md:w-[60%] lg:w-[50%] bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg">
          {!examDate ? (
            <div className="text-center py-4">
              <p className="text-brand-100 text-sm font-medium">
                {isRtl ? 'يرجى تحديد تاريخ الامتحان.' : 'Please select an exam date.'}
              </p>
            </div>
          ) : !isValidDate ? (
            <div className="text-center py-4">
              <p className="text-amber-300 text-sm font-bold">
                {isRtl ? 'تاريخ غير صالح.' : 'Invalid date.'}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-3">
                <div>
                  <p className="text-brand-200 text-xs font-medium">{isRtl ? 'الأيام المتبقية' : 'Days Left'}</p>
                  <p className="text-2xl font-black text-white">{daysRemaining}</p>
                </div>
                <div className="text-right">
                  <p className="text-brand-200 text-xs font-medium">{isRtl ? 'الدروس المتبقية' : 'Lessons Left'}</p>
                  <p className="text-xl font-bold text-white">{remainingLessons}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className={`text-xs font-bold ${isUrgent ? 'text-amber-300' : 'text-emerald-300'}`}>
                  {isRtl ? 'المعدل اليومي المطلوب:' : 'Required Daily Pace:'}
                </p>
                <p className="text-white font-black text-lg">
                  {lessonsPerDay} <span className="text-xs font-medium text-brand-100">{isRtl ? 'دروس' : 'lessons'}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {examDate && isValidDate && (
        <>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-xs font-bold text-brand-200 hover:text-white transition-colors underline"
          >
            {isExpanded 
              ? (isRtl ? 'إخفاء الروتين المقترح' : 'Hide Suggested Routine')
              : (isRtl ? 'عرض الروتين المقترح' : 'Show Suggested Routine')}
          </button>
          {isExpanded && renderRoutine()}
        </>
      )}
    </div>
  );
}
