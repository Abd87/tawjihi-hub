'use client';

import { useRef, useState } from 'react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Eraser, Pen, Trash2, Undo2, Redo2, Sparkles } from 'lucide-react';

export default function WhiteboardPrototype() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';
  
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#0f172a');
  const [strokeWidth, setStrokeWidth] = useState(4);

  const toggleEraseMode = () => {
    canvasRef.current?.eraseMode(!eraseMode);
    setEraseMode(!eraseMode);
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col z-[9999]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header & Tools */}
      <div className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm shrink-0">
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
            <span className="hidden sm:inline">{isRtl ? 'السبورة الذكية المستقرة' : 'Stable Smart Whiteboard'}</span>
          </h1>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 sm:gap-4 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
          <button 
            onClick={() => { setEraseMode(false); canvasRef.current?.eraseMode(false); }}
            className={`p-2 rounded-md transition-colors ${!eraseMode ? 'bg-white shadow text-brand-600' : 'text-slate-600 hover:bg-slate-200'}`}
            title="Pen"
          >
            <Pen className="w-5 h-5" />
          </button>
          <button 
            onClick={toggleEraseMode}
            className={`p-2 rounded-md transition-colors ${eraseMode ? 'bg-white shadow text-brand-600' : 'text-slate-600 hover:bg-slate-200'}`}
            title="Eraser"
          >
            <Eraser className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button onClick={handleUndo} className="p-2 text-slate-600 hover:bg-slate-200 rounded-md"><Undo2 className="w-5 h-5" /></button>
          <button onClick={handleRedo} className="p-2 text-slate-600 hover:bg-slate-200 rounded-md"><Redo2 className="w-5 h-5" /></button>
          <div className="w-px h-6 bg-slate-300 mx-1"></div>
          <button onClick={handleClear} className="p-2 text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-5 h-5" /></button>
        </div>
        
        {/* Colors */}
        <div className="hidden md:flex items-center gap-2">
          {['#0f172a', '#dc2626', '#16a34a', '#2563eb'].map(color => (
            <button
              key={color}
              onClick={() => { setStrokeColor(color); setEraseMode(false); canvasRef.current?.eraseMode(false); }}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${strokeColor === color && !eraseMode ? 'scale-110 border-white ring-2 ring-brand-500' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 w-full relative cursor-crosshair">
        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={eraseMode ? 20 : strokeWidth}
          eraserWidth={20}
          strokeColor={strokeColor}
          canvasColor="transparent"
          className="absolute inset-0 w-full h-full"
        />
        
        {/* Grid Background */}
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        </div>
      </div>
    </div>
  );
}