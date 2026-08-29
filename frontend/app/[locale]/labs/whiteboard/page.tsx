'use client';

import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, ArrowRight, Eraser, Pen, Trash2, Sparkles, Square, Circle, Triangle, MousePointer2, Hand, Maximize, Type } from 'lucide-react';

const WhiteboardInner = dynamic(() => import('./WhiteboardInner'), { ssr: false });

export default function CustomFabricWhiteboard() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  
  const [activeTool, setActiveTool] = useState('draw');
  const [strokeColor, setStrokeColor] = useState('#0f172a');
  const [strokeWidth, setStrokeWidth] = useState(4);
  
  const handleClearRef = useRef<any>(null);

  const addShape = (type: string) => {
    if (handleClearRef.current?.addShape) {
      handleClearRef.current.addShape(type);
    }
  };

  const addText = () => {
    if (handleClearRef.current?.addText) {
      handleClearRef.current.addText();
    }
  };

  const handleClear = () => {
    if (handleClearRef.current?.clear) {
      handleClearRef.current.clear();
    }
  };

  const handleResetZoom = () => {
    if (handleClearRef.current?.resetZoom) {
      handleClearRef.current.resetZoom();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[99999]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Custom Tailwind UI Header */}
      <div className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${locale}/dashboard`}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {isRtl ? 'العودة' : 'Back'}
          </Link>
          <div className="h-6 w-px bg-slate-300"></div>
          <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <span className="hidden lg:inline">{isRtl ? 'سبورة توجيهي هب اللانهائية' : 'Infinite Whiteboard'}</span>
          </h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200 overflow-x-auto max-w-full">
          <button 
            onClick={() => setActiveTool('pan')}
            className={`p-2 rounded-md transition-colors shrink-0 ${activeTool === 'pan' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-200'}`}
            title="Pan (تحريك اللوحة)"
          >
            <Hand className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded-md transition-colors shrink-0 ${activeTool === 'select' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-200'}`}
            title="Select & Move (المؤشر)"
          >
            <MousePointer2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('draw')}
            className={`p-2 rounded-md transition-colors shrink-0 ${activeTool === 'draw' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-200'}`}
            title="Pen (القلم)"
          >
            <Pen className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setActiveTool('erase')}
            className={`p-2 rounded-md transition-colors shrink-0 ${activeTool === 'erase' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-200'}`}
            title="Eraser (الممحاة)"
          >
            <Eraser className="w-5 h-5" />
          </button>
          
          <div className="w-px h-6 bg-slate-300 mx-1 shrink-0"></div>
          
          <button onClick={addText} className="p-2 text-slate-600 hover:bg-slate-200 rounded-md shrink-0" title="Text (نص)"><Type className="w-5 h-5" /></button>
          <button onClick={() => addShape('rect')} className="p-2 text-slate-600 hover:bg-slate-200 rounded-md shrink-0" title="Square (مربع)"><Square className="w-5 h-5" /></button>
          <button onClick={() => addShape('circle')} className="p-2 text-slate-600 hover:bg-slate-200 rounded-md shrink-0" title="Circle (دائرة)"><Circle className="w-5 h-5" /></button>
          <button onClick={() => addShape('triangle')} className="p-2 text-slate-600 hover:bg-slate-200 rounded-md shrink-0" title="Triangle (مثلث)"><Triangle className="w-5 h-5" /></button>

          <div className="w-px h-6 bg-slate-300 mx-1 shrink-0"></div>
          <button onClick={handleResetZoom} className="p-2 text-slate-600 hover:bg-slate-200 rounded-md shrink-0" title="Reset Zoom (إعادة الضبط)"><Maximize className="w-5 h-5" /></button>
          <button onClick={handleClear} className="p-2 text-red-600 hover:bg-red-50 rounded-md shrink-0" title="Clear All (مسح الكل)"><Trash2 className="w-5 h-5" /></button>
        </div>
        
        {/* Colors & Stroke */}
        <div className="hidden md:flex items-center gap-4">
          <input 
            type="range" 
            min="1" 
            max="30" 
            value={strokeWidth} 
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-24 accent-brand-500"
            title="Pen Thickness (سماكة القلم)"
          />
          <div className="flex items-center gap-1.5">
            {['#0f172a', '#dc2626', '#16a34a', '#2563eb', '#d97706', '#9333ea'].map(color => (
              <button
                key={color}
                onClick={() => setStrokeColor(color)}
                className={`w-7 h-7 rounded-full border-2 transition-transform ${strokeColor === color ? 'scale-110 border-slate-200 ring-2 ring-brand-500 shadow-md' : 'border-slate-200 shadow-sm'}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile colors bar */}
      <div className="md:hidden h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
        <input 
          type="range" 
          min="1" 
          max="30" 
          value={strokeWidth} 
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="w-1/3 accent-brand-500"
        />
        <div className="flex items-center gap-2">
          {['#0f172a', '#dc2626', '#2563eb', '#d97706'].map(color => (
            <button
              key={color}
              onClick={() => setStrokeColor(color)}
              className={`w-6 h-6 rounded-full border border-slate-200 transition-transform ${strokeColor === color ? 'scale-110 ring-2 ring-brand-500' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
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