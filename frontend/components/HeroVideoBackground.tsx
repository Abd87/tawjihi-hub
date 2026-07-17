'use client';

import { useState, useEffect } from 'react';

export default function HeroVideoBackground() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // We defer loading the video by 2.5 seconds to ensure the 
    // initial page load (LCP) and Lighthouse scores aren't blocked by a massive 2.6MB download.
    const timer = setTimeout(() => {
      // Use matchMedia for a more reliable mobile check in headless browsers like Lighthouse
      if (window.matchMedia('(min-width: 768px)').matches) {
        setShouldLoadVideo(true);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <video aria-hidden="true"
      autoPlay 
      loop 
      muted 
      playsInline
      preload="none"
      poster="/og-image.webp"
      className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ${shouldLoadVideo ? 'opacity-40' : 'opacity-0'}`}
    >
      {shouldLoadVideo && <source src="/hero-bg.mp4" type="video/mp4" />}
    </video>
  );
}
