'use client';

import React, { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import { useTranslatableText } from '@/hooks/useTranslatableText';

interface MathRendererProps extends React.HTMLAttributes<HTMLElement> {
  html: string;
  className?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
  as?: React.ElementType;
}

const MathRenderer = React.memo(function MathRenderer({ html, className = '', dir = 'auto', as: Tag = 'div', ...props }: MathRendererProps) {
  const containerRef = useRef<HTMLElement>(null);
  const tooltip = useTranslatableText(containerRef, html);

  useEffect(() => {
    if (containerRef.current) {
      // Re-apply the raw HTML before running KaTeX in case React reset the DOM
      containerRef.current.innerHTML = html;
      // Remove the translated flag so it can be re-processed by the hook if html changes
      containerRef.current.removeAttribute('data-translated');
      
      renderMathInElement(containerRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false }
        ],
        throwOnError: false,
        errorColor: '#f43f5e',
      });
    }
  }, [html]); // run when html changes. Note: in React 18 strict mode this might run twice. The hook handles idempotency.

  return (
    <>
      <Tag
        ref={containerRef}
        className={className}
        dir={dir}
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
      <div 
        className={`fixed z-[9999] bg-amber-500 text-slate-900 px-3 py-1.5 rounded-lg shadow-xl text-sm font-bold border border-amber-400 pointer-events-none transition-all duration-200 ease-out flex flex-col items-center ${
          tooltip.visible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`}
        style={{ left: tooltip.x, top: tooltip.y - 8, transform: `translate(-50%, ${tooltip.visible ? '-100%' : '-80%'}) scale(${tooltip.visible ? 1 : 0.95})` }}
        dir="rtl"
      >
        {tooltip.text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-amber-500"></div>
      </div>
    </>
  );
});

export default MathRenderer;
