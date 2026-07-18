'use client';

import React, { useState } from 'react';
import { BookOpen, Calculator, FlaskConical, Atom, Landmark, Code2, HeartPulse, MonitorPlay, Sprout, BookMarked, GraduationCap, Globe2, ChevronRight, ChevronLeft } from 'lucide-react';
import { subjectsData } from './curriculumData';
import Link from 'next/link';

export default function SubjectsClient({ locale }: { locale: string }) {
  const isRtl = locale === 'ar';
  const [activeTab, setActiveTab] = useState<'academic' | 'btec'>('academic');

  const filteredSubjects = subjectsData.filter(s => s.track === activeTab);

  const renderIcon = (type: string) => {
    switch(type) {
      case 'calculator': return <Calculator className="h-6 w-6" />;
      case 'atom': return <Atom className="h-6 w-6" />;
      case 'flask': return <FlaskConical className="h-6 w-6" />;
      case 'heart': return <HeartPulse className="h-6 w-6" />;
      case 'book': return <BookOpen className="h-6 w-6" />;
      case 'monitor': return <MonitorPlay className="h-6 w-6" />;
      case 'landmark': return <Landmark className="h-6 w-6" />;
      case 'sprout': return <Sprout className="h-6 w-6" />;
      case 'globe': return <Globe2 className="h-6 w-6" />;
      case 'code': return <Code2 className="h-6 w-6" />;
      default: return <BookMarked className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {isRtl ? 'تصفح مواد التوجيهي' : 'Explore Tawjihi Subjects'}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {isRtl 
              ? 'تصفح الخطة الدراسية كاملة لجميع الفروع الأكاديمية والمهنية. اضغط على المادة لعرض الوحدات والدروس المقررة.'
              : 'Browse the complete curriculum for all academic and vocational tracks. Click a subject to view its units and lessons.'}
          </p>
        </div>

        {/* Layout */}
        <div className={`flex flex-col md:flex-row gap-8 ${isRtl ? 'md:flex-row-reverse' : ''}`}>
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-72 shrink-0">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-2 flex flex-row md:flex-col gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('academic')}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-semibold whitespace-nowrap min-w-max md:min-w-0 ${isRtl ? 'text-right flex-row-reverse' : 'text-left'} ${
                  activeTab === 'academic' 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <GraduationCap className="h-5 w-5" />
                <span>{isRtl ? 'البرنامج الأكاديمي' : 'Academic Track'}</span>
              </button>
              
              <button
                onClick={() => setActiveTab('btec')}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-semibold whitespace-nowrap min-w-max md:min-w-0 ${isRtl ? 'text-right flex-row-reverse' : 'text-left'} ${
                  activeTab === 'btec' 
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Code2 className="h-5 w-5" />
                <span>{isRtl ? 'برنامج BTEC المهني' : 'BTEC / Vocational'}</span>
              </button>
            </div>
          </div>

          {/* Subjects List */}
          <div className="flex-1 flex flex-col gap-4">
            {filteredSubjects.map((subject) => {
              // Map colors exactly based on tailwind safe colors or use style logic
              const colorTheme: Record<string, string> = {
                blue: 'text-blue-500 bg-blue-500/10 hover:bg-blue-500/20',
                indigo: 'text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20',
                emerald: 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20',
                rose: 'text-rose-500 bg-rose-500/10 hover:bg-rose-500/20',
                amber: 'text-amber-500 bg-amber-500/10 hover:bg-amber-500/20',
                slate: 'text-slate-300 bg-slate-500/10 hover:bg-slate-500/20',
                brand: 'text-brand-500 bg-brand-500/10 hover:bg-brand-500/20',
                orange: 'text-orange-500 bg-orange-500/10 hover:bg-orange-500/20',
                cyan: 'text-cyan-500 bg-cyan-500/10 hover:bg-cyan-500/20',
                green: 'text-green-500 bg-green-500/10 hover:bg-green-500/20',
                teal: 'text-teal-500 bg-teal-500/10 hover:bg-teal-500/20',
                lime: 'text-lime-500 bg-lime-500/10 hover:bg-lime-500/20',
              };
              const themeClass = colorTheme[subject.color] || colorTheme.brand;

              return (
                <Link 
                  key={subject.id} 
                  href={`/${locale}/subjects/${subject.id}`}
                  className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800/80 hover:border-slate-700 ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${themeClass.split(' ').slice(0,2).join(' ')}`}>
                      {renderIcon(subject.iconType)}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold text-white mb-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {isRtl ? subject.titleAr : subject.titleEn}
                      </h3>
                      <p className={`text-sm text-slate-400 ${isRtl ? 'text-right' : 'text-left'}`}>
                        {subject.units.length} {isRtl ? 'وحدات' : 'Units'}
                      </p>
                    </div>
                  </div>
                  {isRtl ? (
                    <ChevronLeft className="h-5 w-5 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-500" />
                  )}
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
