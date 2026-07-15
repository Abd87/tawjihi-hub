'use client';

import { X, Lock, Key, MessageCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CourseUnlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitleAr?: string;
  courseTitleEn?: string;
  isRtl: boolean;
}

export default function CourseUnlockModal({ 
  isOpen, 
  onClose, 
  courseTitleAr, 
  courseTitleEn,
  isRtl 
}: CourseUnlockModalProps) {
  const router = useRouter();
  
  if (!isOpen) return null;

  const handleWhatsApp = () => {
    // Standard WhatsApp link
    window.open('https://wa.me/962790881392', '_blank');
  };

  const handleRedeem = () => {
    onClose();
    router.push(isRtl ? '/ar/redeem' : '/en/redeem');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-slate-900 border border-brand-500/30 shadow-[0_0_50px_rgba(234,88,12,0.15)] animate-in fade-in zoom-in-95 duration-300">
        {/* Glowing bg effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 rounded-full blur-[60px]" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/20 rounded-full blur-[60px]" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 end-4 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative p-6 sm:p-8 text-center flex flex-col items-center">
          
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mb-5 shadow-inner relative">
            <div className="absolute inset-0 rounded-full bg-brand-500/10 animate-pulse" />
            <Lock className="h-7 w-7 text-brand-400" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400" />
          </div>

          <h3 className="text-2xl font-black text-white mb-2 tracking-tight" dir="auto">
            {isRtl ? 'هذا المحتوى مقفل' : 'This Content is Locked'}
          </h3>
          
          {courseTitleAr && courseTitleEn && (
            <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="text-sm font-semibold text-brand-400">
                {isRtl ? courseTitleAr : courseTitleEn}
              </span>
            </div>
          )}

          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            {isRtl 
              ? 'احصل على وصول كامل للدروس المصورة، الاختبارات التفاعلية، والملفات المرفقة. قم بشراء بطاقة توجيهي هب من أقرب مكتبة أو تواصل معنا مباشرة!' 
              : 'Get full access to video lessons, interactive quizzes, and resources. Purchase your Tawjihi Hub Access Card from your nearest bookstore or contact us directly!'}
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-500/25"
            >
              <MessageCircle className="w-5 h-5" />
              {isRtl ? 'تواصل معنا على واتساب' : 'Contact us on WhatsApp'}
            </button>
            
            <button
              onClick={handleRedeem}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm sm:text-base transition-all"
            >
              <Key className="w-5 h-5 text-brand-400" />
              {isRtl ? 'لدي كوبون تفعيل' : 'I have an Activation Coupon'}
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
