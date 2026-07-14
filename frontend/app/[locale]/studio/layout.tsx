import { Metadata } from 'next';
import StudioGuard from './StudioGuard';

export const metadata: Metadata = {
  title: 'Content Studio | Tawjihi Hub',
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans">
      <StudioGuard>
        {children}
      </StudioGuard>
    </div>
  );
}
