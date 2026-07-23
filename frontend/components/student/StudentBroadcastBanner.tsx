'use client';

import { useState, useEffect } from 'react';
import { Radio, Flame, Bell, Info, X, ChevronRight, ChevronLeft } from 'lucide-react';

interface Broadcast {
  id: string;
  titleAr: string;
  titleEn?: string;
  contentAr: string;
  contentEn?: string;
  priority: 'NORMAL' | 'HIGH' | 'URGENT';
  teacher?: { nameAr: string; nameEn?: string };
  course?: { titleAr: string; titleEn?: string };
  createdAt: string;
}

export default function StudentBroadcastBanner({ isRtl = true }: { isRtl?: boolean }) {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentBroadcasts();
  }, []);

  const fetchStudentBroadcasts = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/student/broadcasts', { headers });
      if (res.ok) {
        const data = await res.json();
        setBroadcasts(data.broadcasts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const visibleBroadcasts = broadcasts.filter((b) => !dismissedIds.includes(b.id));

  if (loading || visibleBroadcasts.length === 0) return null;

  const dismiss = (id: string) => {
    setDismissedIds([...dismissedIds, id]);
  };

  return (
    <div className="space-y-4 mb-8">
      {visibleBroadcasts.map((b) => (
        <div
          key={b.id}
          className={`relative overflow-hidden rounded-3xl p-5 md:p-6 border backdrop-blur-xl shadow-xl transition-all ${
            b.priority === 'URGENT'
              ? 'bg-rose-950/40 border-rose-500/40 shadow-rose-500/10'
              : b.priority === 'HIGH'
              ? 'bg-amber-950/40 border-amber-500/40 shadow-amber-500/10'
              : 'bg-slate-900/80 border-slate-800'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-3 rounded-2xl shrink-0 mt-0.5 ${
                  b.priority === 'URGENT'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : b.priority === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {b.priority === 'URGENT' ? (
                  <Flame className="w-6 h-6 animate-bounce text-rose-400" />
                ) : b.priority === 'HIGH' ? (
                  <Bell className="w-6 h-6 text-amber-400" />
                ) : (
                  <Radio className="w-6 h-6 text-blue-400" />
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      b.priority === 'URGENT'
                        ? 'bg-rose-500 text-white'
                        : b.priority === 'HIGH'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {b.priority === 'URGENT'
                      ? (isRtl ? 'إعلان عاجل 🔥' : 'Urgent Notice 🔥')
                      : b.priority === 'HIGH'
                      ? (isRtl ? 'تنبيه هام 🔔' : 'Important Alert 🔔')
                      : (isRtl ? 'إعلان معلم 📢' : 'Teacher Notice 📢')}
                  </span>

                  {b.teacher && (
                    <span className="text-xs font-bold text-slate-300">
                      {isRtl ? `الأستاذ ${b.teacher.nameAr}` : `Teacher ${b.teacher.nameEn || b.teacher.nameAr}`}
                    </span>
                  )}

                  {b.course && (
                    <span className="text-xs text-slate-400">
                      • 📚 {isRtl ? b.course.titleAr : b.course.titleEn || b.course.titleAr}
                    </span>
                  )}
                </div>

                <h3 className="text-base md:text-lg font-bold text-white leading-snug">
                  {isRtl ? b.titleAr : b.titleEn || b.titleAr}
                </h3>

                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
                  {isRtl ? b.contentAr : b.contentEn || b.contentAr}
                </p>
              </div>
            </div>

            <button
              onClick={() => dismiss(b.id)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
              title={isRtl ? 'إغلاق' : 'Dismiss'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
