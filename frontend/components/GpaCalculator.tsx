'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Calculator, ChevronDown, CheckCircle2, Award } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function GpaCalculator() {
  const t = useTranslations('calculator');
  const [track, setTrack] = useState<'ACADEMIC' | 'BTEC'>('ACADEMIC');
  const [academicScores, setAcademicScores] = useState({
    religion: 200,
    arabic: 200,
    english: 200,
    history: 200,
    specialty1: 200,
    specialty2: 200,
    specialty3: 200
  });
  
  const [btecScores, setBtecScores] = useState({
    religion: 200,
    arabic: 200,
    english: 200,
    history: 200,
    btecGrade: 'MERIT' // PASS, MERIT, DISTINCTION
  });

  const handleAcademicChange = (field: string, value: string) => {
    const num = Math.min(200, Math.max(0, parseInt(value) || 0));
    setAcademicScores(prev => ({ ...prev, [field]: num }));
  };

  const handleBtecChange = (field: string, value: string) => {
    if (field === 'btecGrade') {
      setBtecScores(prev => ({ ...prev, [field]: value }));
    } else {
      const num = Math.min(200, Math.max(0, parseInt(value) || 0));
      setBtecScores(prev => ({ ...prev, [field]: num }));
    }
  };

  const calculateGPA = () => {
    if (track === 'ACADEMIC') {
      const total = Object.values(academicScores).reduce((sum, score) => sum + score, 0);
      return (total / 1400 * 100).toFixed(1);
    } else {
      const coreTotal = btecScores.religion + btecScores.arabic + btecScores.english + btecScores.history;
      const corePercentage = (coreTotal / 800) * 100;
      
      // Rough BTEC calculation for demonstration
      let btecPercentage = 60;
      if (btecScores.btecGrade === 'MERIT') btecPercentage = 80;
      if (btecScores.btecGrade === 'DISTINCTION') btecPercentage = 95;
      
      // Usually BTEC counts for 60-70% of the total GPA, and ministry core counts for the rest
      const totalGpa = (corePercentage * 0.4) + (btecPercentage * 0.6);
      return totalGpa.toFixed(1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800 p-6 md:p-10 shadow-2xl">
      
      {/* Track Selector */}
      <div className="flex gap-4 mb-8 bg-slate-950/50 p-2 rounded-2xl border border-slate-800/60">
        <button 
          onClick={() => setTrack('ACADEMIC')}
          className={`flex-1 py-4 rounded-xl text-lg font-bold transition-all ${track === 'ACADEMIC' ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25' : 'text-slate-400 hover:text-slate-200'}`}
        >
          {t('trackAcademic')}
        </button>
        <button 
          onClick={() => setTrack('BTEC')}
          className={`flex-1 py-4 rounded-xl text-lg font-bold transition-all ${track === 'BTEC' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 'text-slate-400 hover:text-slate-200'}`}
        >
          {t('trackBtec')}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-brand-400" />
              {t('coreSubjects')} <span className="text-sm font-normal text-slate-500">(/200)</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {['religion', 'arabic', 'english', 'history'].map(subject => (
                <div key={subject}>
                  <label className="block text-sm font-medium text-slate-400 mb-1">{t(subject)}</label>
                  <input 
                    type="number"
                    max="200"
                    min="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                    value={track === 'ACADEMIC' ? academicScores[subject as keyof typeof academicScores] : btecScores[subject as keyof typeof btecScores]}
                    onChange={(e) => track === 'ACADEMIC' ? handleAcademicChange(subject, e.target.value) : handleBtecChange(subject, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              {t('specialtySubjects')}
            </h3>
            
            {track === 'ACADEMIC' ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {['specialty1', 'specialty2', 'specialty3'].map((subject, idx) => (
                  <div key={subject}>
                    <label className="block text-sm font-medium text-slate-400 mb-1">المادة {idx + 1}</label>
                    <input 
                      type="number"
                      max="200"
                      min="0"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                      value={academicScores[subject as keyof typeof academicScores]}
                      onChange={(e) => handleAcademicChange(subject, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">{t('btecDesc')}</p>
                <div className="relative">
                  <select
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none"
                    value={btecScores.btecGrade}
                    onChange={(e) => handleBtecChange('btecGrade', e.target.value)}
                  >
                    <option value="PASS">{t('pass')}</option>
                    <option value="MERIT">{t('merit')}</option>
                    <option value="DISTINCTION">{t('distinction')}</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 h-5 w-5 text-slate-500 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        <div className="flex flex-col items-center justify-center bg-slate-950 rounded-2xl border border-slate-800 p-8 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <Calculator className="h-16 w-16 text-slate-700 mb-6 group-hover:text-brand-500 transition-colors duration-500" />
          <p className="text-lg text-slate-400 font-medium mb-2">{t('yourGpa')}</p>
          <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-8">
            {calculateGPA()}%
          </div>

          <div className="w-full max-w-sm">
            <Link href="/register" className="block w-full py-4 rounded-xl bg-gradient-to-r from-brand-500 to-amber-600 hover:from-brand-600 hover:to-amber-700 text-white font-bold shadow-xl shadow-brand-500/20 hover:shadow-brand-500/30 transition-all duration-300 transform hover:-translate-y-1">
              {t('signupPromo')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
