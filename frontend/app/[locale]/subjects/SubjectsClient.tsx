'use client';

import React, { useState } from 'react';
import { BookOpen, Calculator, FlaskConical, Atom, Landmark, Code2, HeartPulse, MonitorPlay, Sprout, ChevronDown, BookMarked, GraduationCap, Globe2 } from 'lucide-react';
import { subjectsData } from './curriculumData';

export default function SubjectsClient({ locale }: { locale: string }) {
  const isRtl = locale === 'ar';
  const [activeTab, setActiveTab] = useState<'academic' | 'btec'>('academic');
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);

  const filteredSubjects = subjectsData.filter(s => s.track === activeTab);

  const toggleSubject = (id: string) => {
    if (expandedSubjectId === id) setExpandedSubjectId(null);
    else setExpandedSubjectId(id);
  };

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
                onClick={() => { setActiveTab('academic'); setExpandedSubjectId(null); }}
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
                onClick={() => { setActiveTab('btec'); setExpandedSubjectId(null); }}
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
              const isExpanded = expandedSubjectId === subject.id;
              
              // Map colors exactly based on tailwind safe colors or use style logic
              const colorTheme: Record<string, string> = {
                blue: 'text-blue-500 bg-blue-500/10',
                indigo: 'text-indigo-500 bg-indigo-500/10',
                emerald: 'text-emerald-500 bg-emerald-500/10',
                rose: 'text-rose-500 bg-rose-500/10',
                amber: 'text-amber-500 bg-amber-500/10',
                slate: 'text-slate-300 bg-slate-500/10',
                brand: 'text-brand-500 bg-brand-500/10',
                orange: 'text-orange-500 bg-orange-500/10',
              };
              const themeClass = colorTheme[subject.color] || colorTheme.brand;

              return (
                <div key={subject.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300">
                  {/* Subject Header (Clickable) */}
                  <button 
                    onClick={() => toggleSubject(subject.id)}
                    className={`w-full px-6 py-5 flex items-center justify-between hover:bg-slate-800/50 transition-colors ${isRtl ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${themeClass}`}>
                        {renderIcon(subject.iconType)}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {isRtl ? subject.titleAr : subject.titleEn}
                      </h3>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded Content: Units and Lessons */}
                  {isExpanded && (
                    <div className="border-t border-slate-800 bg-slate-950/50 px-6 py-6" dir={isRtl ? 'rtl' : 'ltr'}>
                      {subject.units.length > 0 ? (
                        <div className="space-y-6">
                          {subject.units.map((unit) => (
                            <div key={unit.id} className="space-y-3">
                              <h4 className="text-lg font-semibold text-brand-400 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                {isRtl ? unit.titleAr : unit.titleEn}
                              </h4>
                              <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 pr-4 border-l-2 border-slate-800 ${isRtl ? 'border-l-0 border-r-2 mr-2 pr-4 pl-0' : 'ml-2 pl-4 border-l-2'}`}>
                                {unit.lessons.map((lesson) => (
                                  <div key={lesson.id} className="bg-slate-900 border border-slate-800/60 p-3 rounded-lg flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center shrink-0">
                                      <BookOpen className="h-3 w-3 text-slate-400" />
                                    </div>
                                    <span className="text-sm font-medium text-slate-300">
                                      {isRtl ? lesson.titleAr : lesson.titleEn}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 text-center py-4">
                          {isRtl ? 'جاري إضافة تفاصيل هذه المادة قريباً...' : 'Details for this subject are coming soon...'}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
