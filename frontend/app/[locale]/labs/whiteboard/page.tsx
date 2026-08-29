'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, ArrowRight, Eraser, Pen, Trash2, Sparkles, Square, Circle, Triangle, MousePointer2, Hand, Maximize, Type, ImagePlus, FileDown } from 'lucide-react';

const WhiteboardInner = dynamic(() => import('./WhiteboardInner'), { ssr: false });

export default function CustomFabricWhiteboard() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  
  const [activeTool, setActiveTool] = useState('draw');
  const [strokeColor, setStrokeColor] = useState('#0f172a');
  const [strokeWidth, setStrokeWidth] = useState(4);
  
  const handleClearRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type.includes('image')) {
       const reader = new FileReader();
       reader.onload = (f) => {
         handleClearRef.current?.addImage(f.target?.result as string);
       };
       reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
       handleClearRef.current?.addPDF(file);
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex flex-col z-[99999]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Header */}
      <div className="h-14 bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shadow-sm shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <Link 
            href={`/${locale}/dashboard`}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span className="hidden sm:inline">{isRtl ? 'العودة' : 'Back'}</span>
          </Link>
          <div className="hidden sm:block h-6 w-px bg-slate-300"></div>
          <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <span className="hidden md:inline">{isRtl ? 'سبورة توجيهي هب اللانهائية' : 'Infinite Whiteboard'}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* File Upload (Images & PDF) */}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors" title="Upload Image / PDF (رفع ملف)">
            <ImagePlus className="w-4 h-4" />
            <span className="hidden sm:inline">{isRtl ? 'إدراج' : 'Insert'}</span>
          </button>
          
          <div className="h-4 w-px bg-slate-200"></div>

          {/* Export PDF */}
          <button onClick={() => handleClearRef.current?.exportPDF()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" title="Export as PDF (تصدير كملف PDF)">
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">{isRtl ? 'تصدير' : 'Export'}</span>
          </button>
          
          <div className="h-4 w-px bg-slate-200"></div>

          <button onClick={() => handleClearRef.current?.resetZoom()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" title="Reset Zoom">
            <Maximize className="w-4 h-4" />
          </button>
          <button onClick={() => handleClearRef.current?.clear()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Clear All">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Toolbar */}
      <div className="bg-white border-b border-slate-200 px-2 py-2 flex items-center gap-2 overflow-x-auto shrink-0 z-10 w-full shadow-sm" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="flex items-center gap-1 sm:gap-2 mx-auto">
          <button 
            onClick={() => setActiveTool('pan')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all shrink-0 flex flex-col items-center gap-1 ${activeTool === 'pan' ? 'bg-brand-50 shadow-sm text-brand-600 ring-1 ring-brand-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Hand className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('select')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all shrink-0 flex flex-col items-center gap-1 ${activeTool === 'select' ? 'bg-brand-50 shadow-sm text-brand-600 ring-1 ring-brand-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <MousePointer2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('draw')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all shrink-0 flex flex-col items-center gap-1 ${activeTool === 'draw' ? 'bg-brand-50 shadow-sm text-brand-600 ring-1 ring-brand-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Pen className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('erase')}
            className={`p-2 sm:p-2.5 rounded-xl transition-all shrink-0 flex flex-col items-center gap-1 ${activeTool === 'erase' ? 'bg-brand-50 shadow-sm text-brand-600 ring-1 ring-brand-200' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Eraser className="w-5 h-5" />
          </button>
          
          <div className="w-px h-8 bg-slate-200 mx-1 shrink-0"></div>
          
          <button onClick={() => handleClearRef.current?.addText()} className="p-2 sm:p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl shrink-0"><Type className="w-5 h-5" /></button>
          <button onClick={() => handleClearRef.current?.addShape('rect')} className="p-2 sm:p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl shrink-0"><Square className="w-5 h-5" /></button>
          <button onClick={() => handleClearRef.current?.addShape('circle')} className="p-2 sm:p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl shrink-0"><Circle className="w-5 h-5" /></button>
          <button onClick={() => handleClearRef.current?.addShape('triangle')} className="p-2 sm:p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl shrink-0"><Triangle className="w-5 h-5" /></button>

          <div className="w-px h-8 bg-slate-200 mx-1 shrink-0"></div>
          
          {/* Colors */}
          <div className="flex items-center gap-1.5 px-2">
            {['#0f172a', '#dc2626', '#16a34a', '#2563eb', '#d97706', '#9333ea'].map(color => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-7 h-7 rounded-full border-2 transition-transform shrink-0 ${strokeColor === color ? 'scale-110 border-white ring-2 ring-brand-500 shadow-md' : 'border-transparent shadow-sm'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          
          <div className="w-px h-8 bg-slate-200 mx-1 shrink-0"></div>
          
          {/* Thickness */}
          <div className="flex items-center gap-2 px-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={strokeWidth} 
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-20 sm:w-24 accent-brand-500"
            />
            <div className="w-4 h-4 rounded-full bg-slate-800"></div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <WhiteboardInner 
        isRtl={isRtl}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        handleClearRef={handleClearRef}
      />
    </div>
  );
}