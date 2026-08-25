import { useEffect, useState, useRef, useCallback } from 'react';

// Global dictionary cache
let dictionaryCache: Record<string, string> | null = null;
let fetchPromise: Promise<Record<string, string>> | null = null;

export function useTranslatableText(containerRef: React.RefObject<HTMLElement | null>, html: string, enabled: boolean = true) {
  const [tooltip, setTooltip] = useState<{ text: string, x: number, y: number, visible: boolean }>({ text: '', x: 0, y: 0, visible: false });
  const hoveredElement = useRef<HTMLElement | null>(null);
  
  // Clear tooltip when HTML changes (like moving to the next question)
  useEffect(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
    hoveredElement.current = null;
  }, [html]);

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

    const handleMouseOver = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Walk up slightly in case we hovered a nested element inside the span
      const spanTarget = target.closest('.translatable-word') as HTMLElement;
      if (spanTarget) {
        const word = spanTarget.getAttribute('data-word');
        if (!word) return;
        
        hoveredElement.current = spanTarget;
        
        // Wait for 250ms (hover intent) to prevent spamming APIs when moving mouse across a sentence
        await new Promise(resolve => setTimeout(resolve, 250));
        
        // If they moved away during the delay, abort
        if (hoveredElement.current !== spanTarget) return;
        
        const dict = await fetchDict();
        let translation = dict[word.toLowerCase()];
        
        // Fallback: Google Translate
        if (!translation) {
           // check if we already tried and failed (cache negative result to avoid infinite spam)
           if (dict[word.toLowerCase()] === null) return; 

           try {
             const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=${encodeURIComponent(word)}`;
             const res = await fetch(url);
             if (!res.ok) throw new Error('API Rate Limit');
             const data = await res.json();
             if (data && data[0] && data[0][0] && data[0][0][0]) {
               translation = data[0][0][0];
               dict[word.toLowerCase()] = translation; // cache it locally
             } else {
               dict[word.toLowerCase()] = null; // cache negative
             }
           } catch(err) {
             console.error('Translation fallback failed', err);
             dict[word.toLowerCase()] = null; // cache negative so we don't hit rate limit again
           }
        }

        if (translation && hoveredElement.current === spanTarget) {
          const rect = spanTarget.getBoundingClientRect();
          setTooltip({
            text: translation,
            x: rect.left + (rect.width / 2),
            y: rect.top, // position above the word
            visible: true
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const spanTarget = target.closest('.translatable-word') as HTMLElement;
      
      // If we are leaving the currently hovered word
      if (spanTarget && hoveredElement.current === spanTarget) {
        // Only clear if the mouse is actually leaving the word (not entering a child)
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

          // Replace words with span
          const span = document.createElement('span');
          // Add transition-all to allow it to be interactable
          span.innerHTML = text.replace(/([a-zA-Z]+)/g, '<span class="translatable-word cursor-pointer hover:bg-amber-500/20 hover:text-amber-500 rounded px-0.5 transition-colors select-none" data-word="$1">$1</span>');
          
          if (span.childNodes.length > 0) {
            node.parentNode?.replaceChild(span, node);
          }
        }
      };
      
      walkDOM(container);
      container.setAttribute('data-translated', 'true');
      
      // Event delegation
      container.addEventListener('mouseover', handleMouseOver);
      container.addEventListener('mouseout', handleMouseOut);
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [containerRef, enabled, html]);

  return tooltip;
}
