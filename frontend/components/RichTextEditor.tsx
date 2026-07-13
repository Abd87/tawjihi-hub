'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: 'ltr' | 'rtl';
}

export default function RichTextEditor({ value, onChange, placeholder, dir = 'ltr' }: RichTextEditorProps) {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  return (
    <div className={`rich-text-editor-container ${dir === 'rtl' ? 'rtl-editor' : ''}`}>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={modules}
        placeholder={placeholder}
        className="bg-slate-950 text-white rounded-xl overflow-hidden border border-slate-800"
      />
      <style jsx global>{`
        .rich-text-editor-container .ql-toolbar {
          background-color: #0f172a;
          border-color: #1e293b;
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
        }
        .rich-text-editor-container .ql-container {
          border-color: #1e293b;
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          font-family: inherit;
          font-size: 1rem;
        }
        .rich-text-editor-container .ql-editor {
          min-height: 120px;
        }
        .rich-text-editor-container .ql-stroke {
          stroke: #94a3b8;
        }
        .rich-text-editor-container .ql-fill {
          fill: #94a3b8;
        }
        .rich-text-editor-container .ql-picker {
          color: #94a3b8;
        }
        .rtl-editor .ql-editor {
          direction: rtl;
          text-align: right;
        }
      `}</style>
    </div>
  );
}
