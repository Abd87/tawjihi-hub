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
  courses?: Course[];
  isRtl: boolean;
  user?: any;
}

export default function StudyPlanner({ courses = [], isRtl, user }: StudyPlannerProps) {
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

  const safeCourses = Array.isArray(courses) ? courses : [];

  // Calculations
  const totalLessons = safeCourses.reduce((acc, c) => acc + (c?.mockLessonsCount || 0), 0);
  const averageProgress = safeCourses.length > 0 ? (safeCourses.reduce((acc, c) => acc + (c?.mockProgress || 0), 0) / safeCourses.length) : 0;
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
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-2xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {isRtl ? 'مخطط الدراسة والتفوق الشخصي' : 'Personal Study Planner'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRtl ? 'حدد تاريخ امتحاناتك لحساب معدل الإنجاز اليومي المطلوب' : 'Set your exam date to calculate daily study requirements'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-brand-400 shrink-0" />
          <input
            type="date"
            value={examDate}
            onChange={handleDateChange}
            className="bg-slate-950 border border-slate-800 text-xs font-bold text-white rounded-xl px-3 py-2 focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">{isRtl ? 'الأيام المتبقية' : 'Days Remaining'}</span>
          <span className={`text-2xl font-black block ${isUrgent ? 'text-rose-400' : 'text-white'}`}>
            {daysRemaining > 0 ? `${daysRemaining} ${isRtl ? 'يوم' : 'Days'}` : (isRtl ? 'حدد التاريخ' : 'Set Date')}
          </span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">{isRtl ? 'إجمالي الدروس المتبقية' : 'Remaining Lessons'}</span>
          <span className="text-2xl font-black text-amber-400 block">{remainingLessons} {isRtl ? 'درس' : 'Lessons'}</span>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400 font-semibold block">{isRtl ? 'معدل الإنجاز اليومي' : 'Daily Goal'}</span>
          <span className="text-2xl font-black text-brand-400 block">
            {lessonsPerDay > 0 ? `${lessonsPerDay} ${isRtl ? 'درس/يوم' : 'Lessons/Day'}` : '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
