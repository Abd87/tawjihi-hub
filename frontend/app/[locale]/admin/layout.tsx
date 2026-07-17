import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopNav from '@/components/admin/AdminTopNav';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen print:h-auto bg-[#020617] overflow-hidden print:overflow-visible">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 print:block">
        <AdminTopNav />
        <main className="flex-1 overflow-y-auto print:overflow-visible p-4 md:p-6 print:p-0 custom-scrollbar relative">
          {/* Subtle background glow for the main content area */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none print:hidden" />
          
          <div className="relative z-10 max-w-7xl mx-auto print:max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
