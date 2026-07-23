'use client';

import { useState, useEffect } from 'react';

interface TypewriterTitleProps {
  phrasesAr?: string[];
  phrasesEn?: string[];
  isRtl?: boolean;
}

export default function TypewriterTitle({
  phrasesAr = [
    'بنينا بيتك الدراسي المتكامل خصيصاً لك! 🚀',
    'صممنا المنصة الأولى والوحيدة بـ BTEC 🎯',
    'وفرنا بنك الأخطاء وتوجيهات التقارير 💎',
    'نضمن لك طريق التفوق والامتياز Distinction 🏆',
  ],
  phrasesEn = [
    'Custom-Built for BTEC Students in Jordan 🚀',
    'Step-by-Step Pearson Assignment Guides 🎯',
    'Exclusive Mistake Bank & BTEC GPA Calculator 💎',
    'Achieve Distinction Grades with Confidence 🏆',
  ],
  isRtl = true,
}: TypewriterTitleProps) {
  const phrases = isRtl ? phrasesAr : phrasesEn;

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(70);

  useEffect(() => {
    const fullText = phrases[phraseIndex % phrases.length];

    const handleType = () => {
      if (!isDeleting) {
        // Typing text
        setCurrentText(fullText.substring(0, currentText.length + 1));
        setSpeed(70);

        if (currentText === fullText) {
          // Pause when full phrase is typed out
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        // Deleting text
        setCurrentText(fullText.substring(0, currentText.length - 1));
        setSpeed(35);

        if (currentText === '') {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    const timer = setTimeout(handleType, speed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex, phrases, speed]);

  return (
    <span className="inline-block min-h-[1.3em]">
      <span className="bg-gradient-to-r from-brand-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">
        {currentText}
      </span>
      <span className="inline-block w-[3px] h-[0.85em] start-1 bg-amber-400 animate-pulse align-baseline rounded-full" />
    </span>
  );
}
