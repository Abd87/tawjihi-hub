'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { MessageSquare, Send, Reply, User, UserCheck, Trash2 } from 'lucide-react';

interface Author {
  id: string;
  nameAr: string;
  nameEn: string | null;
  role: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
  replies?: Comment[];
}

interface LessonQAProps {
  lessonId: string;
  locale: string;
  currentUser: any; // Passed from parent to know if we can reply
}

export default function LessonQA({ lessonId, locale, currentUser }: LessonQAProps) {
  const isRtl = locale === 'ar';
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [lessonId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments/${lessonId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const content = parentId ? replyContent : newComment;
    
    if (!content.trim() || !currentUser) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, content, parentId })
      });

      if (res.ok) {
        if (parentId) {
          setReplyContent('');
          setReplyingTo(null);
        } else {
          setNewComment('');
        }
        await fetchComments();
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-JO' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const renderBadge = (role: string) => {
    if (role === 'TEACHER') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <UserCheck className="h-3 w-3" />
          {isRtl ? 'معلم' : 'Teacher'}
        </span>
      );
    }
    if (role === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          <ShieldCheck className="h-3 w-3" />
          {isRtl ? 'إدارة' : 'Admin'}
        </span>
      );
    }
    return null;
  };

  if (isLoading) {
    return <div className="animate-pulse flex space-x-4 p-4"><div className="flex-1 space-y-4 py-1"><div className="h-2 bg-slate-800 rounded"></div><div className="space-y-3"><div className="grid grid-cols-3 gap-4"><div className="h-2 bg-slate-800 rounded col-span-2"></div></div></div></div></div>;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-brand-500" />
        {isRtl ? 'سؤال وجواب (Q&A)' : 'Q&A Community'}
      </h3>

      {/* Add New Comment */}
      {currentUser ? (
        <form onSubmit={(e) => handleSubmitComment(e, null)} className="mb-8">
          <div className="relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isRtl ? 'اسأل سؤالاً أو شارك فكرة...' : 'Ask a question or share a thought...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50 resize-none min-h-[100px]"
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <div className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'}`}>
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="p-2 bg-brand-500 hover:bg-brand-400 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-slate-950 border border-slate-800 rounded-xl text-center">
          <p className="text-slate-400 text-sm">
            {isRtl ? 'يجب تسجيل الدخول لطرح الأسئلة.' : 'You must be logged in to ask questions.'}
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-4">
            {isRtl ? 'لا توجد أسئلة بعد. كن أول من يسأل!' : 'No questions yet. Be the first to ask!'}
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
              {/* Parent Comment */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <User className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-200 text-sm">
                      {isRtl ? comment.author.nameAr : (comment.author.nameEn || comment.author.nameAr)}
                    </span>
                    {renderBadge(comment.author.role)}
                    <span className="text-xs text-slate-500 ml-auto">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{comment.content}</p>
                  
                  {currentUser && (
                    <button 
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-xs font-medium text-slate-400 hover:text-brand-400 flex items-center gap-1 transition-colors"
                    >
                      <Reply className="h-3 w-3" />
                      {isRtl ? 'رد' : 'Reply'}
                    </button>
                  )}

                  {/* Reply Input Form */}
                  {replyingTo === comment.id && (
                    <form onSubmit={(e) => handleSubmitComment(e, comment.id)} className="mt-3 relative">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={isRtl ? 'اكتب ردك هنا...' : 'Write your reply here...'}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-brand-500/50 resize-none min-h-[80px]"
                        dir={isRtl ? 'rtl' : 'ltr'}
                      />
                      <div className={`absolute bottom-2 ${isRtl ? 'left-2' : 'right-2'} flex gap-2`}>
                        <button
                          type="button"
                          onClick={() => setReplyingTo(null)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
                        >
                          {isRtl ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                          type="submit"
                          disabled={!replyContent.trim() || isSubmitting}
                          className="px-3 py-1.5 bg-brand-500 hover:bg-brand-400 text-white rounded-md text-xs font-medium disabled:opacity-50"
                        >
                          {isRtl ? 'إرسال' : 'Send'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* Replies List */}
              {comment.replies && comment.replies.length > 0 && (
                <div className={`mt-4 space-y-4 ${isRtl ? 'pr-14 border-r-2 border-slate-800/50' : 'pl-14 border-l-2 border-slate-800/50'}`}>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                          <User className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 bg-slate-900/30 rounded-xl p-3 border border-slate-800/30">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-200 text-sm">
                            {isRtl ? reply.author.nameAr : (reply.author.nameEn || reply.author.nameAr)}
                          </span>
                          {renderBadge(reply.author.role)}
                          <span className="text-[10px] text-slate-500 ml-auto">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
