'use client';

import { useState, useEffect } from 'react';
import { Calendar, Target, TrendingUp, AlertTriangle } from 'lucide-react';

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
}

export default function StudyPlanner({ courses, isRtl }: StudyPlannerProps) {
  const [examDate, setExamDate] = useState<string>('');
  
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

  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl shadow-brand-500/20">
      {/* Background Decor */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Setup & Input */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold mb-6 shadow-sm">
            <Target className="h-4 w-4" />
            {isRtl ? 'المخطط الدراسي الذكي' : 'Smart Study Planner'}
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2">
            {isRtl ? 'متى امتحانك النهائي؟' : 'When is your final exam?'}
          </h2>
          <p className="text-brand-100 mb-6 text-sm">
            {isRtl 
              ? 'أدخل تاريخ امتحانك ليقوم النظام بحساب عدد الدروس التي يجب عليك إنجازها يومياً لختم المادة في الوقت المناسب.'
              : 'Enter your exam date and the system will calculate how many lessons you need to complete daily to finish on time.'}
          </p>

          <div className="relative max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar className="h-5 w-5 text-brand-700" />
            </div>
            <input 
              type="date" 
              value={examDate}
              onChange={handleDateChange}
              className="block w-full pl-10 pr-3 py-3 border border-white/30 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all font-bold shadow-inner"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {/* Right Side: Stats Panel */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-lg">
          {!examDate ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-6">
              <Calendar className="h-12 w-12 text-brand-200 mb-3 opacity-50" />
              <p className="text-brand-100 font-medium">
                {isRtl ? 'يرجى تحديد تاريخ الامتحان لحساب خطتك الدراسية.' : 'Please select an exam date to calculate your study plan.'}
              </p>
            </div>
          ) : !isValidDate ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-6">
              <AlertTriangle className="h-12 w-12 text-amber-300 mb-3" />
              <p className="text-amber-100 font-bold">
                {isRtl ? 'تاريخ الامتحان غير صالح. يرجى اختيار تاريخ في المستقبل.' : 'Invalid exam date. Please select a date in the future.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <p className="text-brand-200 text-sm font-medium mb-1">{isRtl ? 'الأيام المتبقية' : 'Days Remaining'}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{daysRemaining}</span>
                    <span className="text-brand-200 text-sm">{isRtl ? 'يوم' : 'days'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-brand-200 text-sm font-medium mb-1">{isRtl ? 'الدروس المتبقية' : 'Lessons Remaining'}</p>
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-3xl font-bold text-white">{remainingLessons}</span>
                    <span className="text-brand-200 text-xs">/ {totalLessons}</span>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl flex items-center gap-4 ${isUrgent ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-emerald-500/20 border border-emerald-500/30'}`}>
                <div className={`p-3 rounded-lg ${isUrgent ? 'bg-amber-500/30 text-amber-200' : 'bg-emerald-500/30 text-emerald-200'}`}>
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <p className={`text-sm font-bold ${isUrgent ? 'text-amber-300' : 'text-emerald-300'}`}>
                    {isRtl ? 'المعدل اليومي المطلوب:' : 'Required Daily Pace:'}
                  </p>
                  <p className="text-white font-black text-xl">
                    {lessonsPerDay} <span className="text-sm font-medium text-brand-100">{isRtl ? 'دروس / يوم' : 'lessons / day'}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
