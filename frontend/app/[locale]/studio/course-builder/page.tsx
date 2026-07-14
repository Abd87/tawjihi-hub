'use client';

import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function CourseBuilder() {
  return (
    <div className="p-8 max-w-[1200px] mx-auto text-center mt-20">
      <div className="inline-flex items-center justify-center h-24 w-24 bg-brand-500/10 rounded-full text-brand-500 mb-8">
        <Construction className="h-12 w-12" />
      </div>
      <h1 className="text-4xl font-black text-white mb-4">Rapid Course Builder</h1>
      <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
        The drag-and-drop structural editor is currently under construction. Check back soon for updates to this module.
      </p>
      <Link href="/studio" className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-bold transition-all">
        <ArrowLeft className="h-5 w-5" />
        Return to Content Studio
      </Link>
    </div>
  );
}
