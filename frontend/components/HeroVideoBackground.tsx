'use client';

import { useState, useEffect } from 'react';

export default function HeroVideoBackground() {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // We defer loading the video by 2.5 seconds to ensure the 
    // initial page load (LCP) and Lighthouse scores aren't blocked by a massive 2.6MB download.
    const timer = setTimeout(() => {
      // Only load video if screen width is greater than 768px (desktop/tablets)
      // On mobile devices, the poster image is usually enough and saves massive data.
      if (window.innerWidth > 768) {
        setShouldLoadVideo(true);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <video aria-hidden="true"
      autoPlay 
      loop 
      muted 
      playsInline
      preload="none"
      poster="/_next/image?url=%2Fog-image.png&w=1200&q=40"
      className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ${shouldLoadVideo ? 'opacity-40' : 'opacity-0'}`}
    >
      {shouldLoadVideo && <source src="/hero-bg.mp4" type="video/mp4" />}
    </video>
  );
}
