'use client';

import { Facebook } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SocialFloatingButtons() {
  const pathname = usePathname();
  
  if (pathname.includes('/grade11-exams/unit-') || pathname.match(/\/grade11-exams\/[0-9a-f-]+$/)) {
    return null;
  }

  const whatsappNumber = '962790881392';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const facebookUrl = 'https://www.facebook.com/profile.php?id=61591900810785';

  const isAppRoute = 
    pathname.includes('/courses/') || 
    pathname.includes('/dashboard') ||
    pathname.includes('/studio') ||
    pathname.includes('/admin') ||
    pathname.includes('/parent') ||
    pathname.includes('/teach') ||
    pathname.includes('/whiteboard');

  if (isAppRoute) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 print:hidden">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </a>

      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300"
        aria-label="Visit our Facebook page"
      >
        <Facebook size={28} />
      </a>
    </div>
  );
}