'use client';

import { useState } from 'react';
import { Database, FileSpreadsheet, Plus, Settings, Upload } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function StudioDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <Database className="h-8 w-8 text-brand-500" />
            Content Studio
          </h1>
          <p className="text-slate-400 mt-2">High-speed bulk content management portal.</p>
        </div>
        <Link href="/admin/courses" className="text-sm font-semibold text-brand-500 hover:text-brand-400 bg-brand-500/10 px-4 py-2 rounded-xl">
          Back to Admin
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/studio/quiz-bulk" className="block group">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-brand-500/50 hover:bg-slate-900 transition-all h-full">
            <div className="h-12 w-12 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-500 mb-4 group-hover:scale-110 transition-transform">
              <Upload className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Bulk Quiz Uploader</h2>
            <p className="text-slate-400 text-sm">Upload Excel or CSV files to instantly populate lessons with hundreds of questions at once.</p>
          </div>
        </Link>

        <Link href="/studio/course-builder" className="block group">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-brand-500/50 hover:bg-slate-900 transition-all h-full">
            <div className="h-12 w-12 bg-brand-500/10 rounded-xl flex items-center justify-center text-brand-500 mb-4 group-hover:scale-110 transition-transform">
              <Plus className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Rapid Course Builder</h2>
            <p className="text-slate-400 text-sm">Create courses, chapters, and lessons using a drag-and-drop structural editor.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
