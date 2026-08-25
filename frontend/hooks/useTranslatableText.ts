import { useEffect, useState, useRef } from 'react';

// Global dictionary cache
let dictionaryCache: Record<string, string> | null = null;
let fetchPromise: Promise<Record<string, string>> | null = null;

export function useTranslatableText(containerRef: React.RefObject<HTMLElement | null>, enabled: boolean = true) {
  const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number, visible: boolean }>({ text: '', x: 0, y: 0, visible: false });
  const hoveredElement = useRef<HTMLElement | null>(null);
  
  useEffect(() => {
    if (!enabled) return;

    const fetchDict = async () => {
      if (dictionaryCache) return dictionaryCache;
      if (fetchPromise) return fetchPromise;
      
      fetchPromise = fetch('/dictionary.json').then(res => res.json()).then(data => {
        dictionaryCache = data;
        return data;
      }).catch(e => {
        console.error('Failed to load dictionary:', e);
        return {};
      });
      return fetchPromise;
    };

    fetchDict();

    if (!containerRef.current) return;
    const container = containerRef.current;
    let timeoutId: any;

    const handleMouseOver = async (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList && target.classList.contains('translatable-word')) {
        const word = target.getAttribute('data-word');
        if (!word) return;
        
        hoveredElement.current = target;
        
        const dict = await fetchDict();
        let translation = dict[word.toLowerCase()];
        
        // Fallback: If word not in local dictionary, try to fetch from Google Translate API directly
        if (!translation) {
           try {
             const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(word)}`;
             const res = await fetch(url);
             const data = await res.json();
             if (data && data[0] && data[0][0] && data[0][0][0]) {
               translation = data[0][0][0];
               dict[word.toLowerCase()] = translation; // cache it locally
             }
           } catch(err) {
             console.error('Translation fallback failed', err);
           }
        }

        if (translation && hoveredElement.current === target) {
          const rect = target.getBoundingClientRect();
          setTooltip({
            text: translation,
            x: rect.left + (rect.width / 2),
            y: rect.top, // position above the word
            visible: true
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList && target.classList.contains('translatable-word')) {
        hoveredElement.current = null;
        setTooltip(prev => ({ ...prev, visible: false }));
      }
    };

    // We need to wait for MathRenderer to finish rendering HTML (KaTeX).
    timeoutId = setTimeout(() => {
      if (!container) return;
      
      if (container.hasAttribute('data-translated')) return;
      
      const walkDOM = (node: Node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          // Ignore katex math elements, ignore already wrapped words
          if (el.classList.contains('katex') || el.classList.contains('translatable-word')) return;
          
          const children = Array.from(el.childNodes);
          for (let i = 0; i < children.length; i++) {
            walkDOM(children[i]);
          }
        } else if (node.nodeType === Node.TEXT_NODE) {
          const text = node.nodeValue || '';
          if (!/[a-zA-Z]/.test(text)) return; // Only process text with English letters

          // Replace words with span (removed underline as requested)
          const span = document.createElement('span');
          span.innerHTML = text.replace(/([a-zA-Z]+)/g, '<span class="translatable-word cursor-pointer hover:bg-brand-500/10 hover:text-brand-400 rounded px-0.5 transition-colors select-none" data-word="$1">$1</span>');
          
          if (span.childNodes.length > 0) {
            node.parentNode?.replaceChild(span, node);
          }
        }
      };
      
      walkDOM(container);
      container.setAttribute('data-translated', 'true');
      
      // Use event delegation on the container (mouseover/mouseout work natively on both desktop hover and mobile tap)
      container.addEventListener('mouseover', handleMouseOver);
      container.addEventListener('mouseout', handleMouseOut);
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [containerRef, enabled]);

  return tooltip;
}
