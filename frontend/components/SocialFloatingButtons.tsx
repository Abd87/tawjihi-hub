'use client';

import { Facebook } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SocialFloatingButtons() {
  const pathname = usePathname();
  const whatsappNumber = '962790881392';
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
  const facebookUrl = 'https://www.facebook.com/groups/1648666043099156';

  if (pathname.includes('/courses/')) {
    return null;
  }

  return (
    <div className="fixed bottom-6 end-6 z-50 flex flex-col gap-4">
      {/* Facebook Group Button */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#1877F2] text-white shadow-[0_4px_20px_rgba(24,119,242,0.3)] hover:shadow-[0_8px_30px_rgba(24,119,242,0.5)] hover:-translate-y-1 transition-all duration-300"
        aria-label="Facebook Group"
      >
        <Facebook className="h-7 w-7" />
        <span className="absolute end-full me-3 px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white whitespace-nowrap opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg pointer-events-none">
          انضم لمجموعتنا
        </span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_4px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] hover:-translate-y-1 transition-all duration-300"
        aria-label="WhatsApp"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span className="absolute end-full me-3 px-3 py-1.5 rounded-lg bg-slate-900 text-xs font-semibold text-white whitespace-nowrap opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg pointer-events-none">
          تواصل معنا
        </span>
      </a>
    </div>
  );
}
