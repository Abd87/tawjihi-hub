'use client';

import React, { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render';

interface MathRendererProps extends React.HTMLAttributes<HTMLElement> {
  html: string;
  className?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
  as?: React.ElementType;
}

const MathRenderer = React.memo(function MathRenderer({ html, className = '', dir = 'auto', as: Tag = 'div', ...props }: MathRendererProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Re-apply the raw HTML before running KaTeX in case React reset the DOM
      containerRef.current.innerHTML = html;
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
  }); // run on every render to ensure it catches React resets, but resetting html makes it safe

  return (
    <Tag
      ref={containerRef}
      className={className}
      dir={dir}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
});

export default MathRenderer;
