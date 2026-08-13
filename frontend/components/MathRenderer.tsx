'use client';

import React, { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render';

interface MathRendererProps {
  html: string;
  className?: string;
  dir?: 'rtl' | 'ltr' | 'auto';
  as?: React.ElementType;
}

export default function MathRenderer({ html, className = '', dir = 'rtl', as: Tag = 'div' }: MathRendererProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (containerRef.current) {
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
  }, [html]);

  return (
    <Tag
      ref={containerRef}
      className={className}
      dir={dir}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
