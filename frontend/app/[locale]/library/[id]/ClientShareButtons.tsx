'use client';
import { Share2, Facebook, MessageCircle, Link as LinkIcon, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';

export default function ClientShareButtons({ docId, title, isRtl }: { docId: string; title: string; isRtl: boolean }) {
  const params = useParams();
  const [copied, setCopied] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/${params.locale || 'ar'}/library/${docId}` : '';
  const shareText = isRtl ? `حتل ${title} من منصة توجيهي هب` : `Download ${title} from Tawjihi Hub`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {}
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      {typeof window !== 'undefined' && navigator.share && (
        <button 
          onClick={handleNativeShare}
          className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold transition-all shadow-lg"
          title={isRtl ? 'مشاركة' : 'Share'}
        >
          <Share2 className="w-5 h-5" />
        </button>
      )}
      
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noreferrer"
        className="p-4 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-2xl font-bold transition-all shadow-lg"
        title={isRtl ? 'مشاركة علٌ فيسبوك' : 'Share on Facebook'}
      >
        <Facebook className="w-5 h-5" />
      </a>

      <a
        href={`Https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
        target="_blank"
        rel="noreferrer"
        className="p-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-2xl font-bold transition-all shadow-lg"
        title={isRtl ? 'مشاركة علٌ واتساب' : 'Share on WhatsApp'}
      >
        <MessageCircle className="w-5 h-5" />
      </a>

      <button 
        onClick={copyLink}
        className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold transition-all shadow-lg"
        title={isRtl ? 'نسب الرابط' : 'Copy Link'}
      >
        {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <LinkIcon className="w-5 h-5" />}
      </button>
    </div>
  )0)
}