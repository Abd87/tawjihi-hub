'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Play, 
  FileText, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Send,
  Info
} from 'lucide-react';

interface Lesson {
  id: string;
  titleAr: string;
  titleEn: string;
  videoUrl?: string;
  videoDuration?: number;
  pdfUrl?: string;
  order: number;
}

interface Unit {
  id: string;
  titleAr: string;
  titleEn: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  titleAr: string;
  titleEn: string;
  units: Unit[];
  lessons: Lesson[];
}

export default function DedicatedVideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || 'ar';
  const courseId = params?.id as string;
  const lessonId = params?.lessonId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [videoEnded, setVideoEnded] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const isRtl = locale === 'ar';

  useEffect(() => {
    // get user
    const userStr = localStorage.getItem('user');
    let userId = 'guest';
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setCurrentUser(u);
        userId = u.id || 'guest';
      } catch (e) {}
    }

    // fetch course
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/courses/${courseId}`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const found = await res.json();
          setCourse(found);
          const foundLesson = found.lessons?.find((l: any) => l.id === lessonId);
          if (foundLesson) {
            setCurrentLesson(foundLesson);
          }
        }
      } catch (e) {}
      setLoading(false);
    };
    fetchCourse();

    // load progress
    const storedProg = localStorage.getItem(`completed-lessons-${userId}`);
    if (storedProg) {
      try {
        setCompletedLessons(JSON.parse(storedProg));
      } catch(e) {}
    }

    setLoading(false);
  }, [courseId, lessonId]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    const userId = currentUser?.id || 'guest';
    const storedProg = localStorage.getItem(`completed-lessons-${userId}`);
    let prog = [];
    if (storedProg) {
      try { prog = JSON.parse(storedProg); } catch(e){}
    }
    if (!prog.includes(lessonId)) {
      prog.push(lessonId);
      localStorage.setItem(`completed-lessons-${userId}`, JSON.stringify(prog));
      setCompletedLessons(prog);
    }

    // Save specific item progress for syllabus page
    const itemKey = `completed-items-${userId}-${courseId}`;
    const storedItems = localStorage.getItem(itemKey);
    let itemsProg = [];
    if (storedItems) {
      try { itemsProg = JSON.parse(storedItems); } catch(e){}
    }
    const vidItem = `${lessonId}-video`;
    if (!itemsProg.includes(vidItem)) {
      itemsProg.push(vidItem);
      localStorage.setItem(itemKey, JSON.stringify(itemsProg));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mr-3"></div>
        Loading...
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
        Lesson not found.
      </div>
    );
  }

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    const videoId = match?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&controls=1&disablekb=0&fs=0&iv_load_policy=3` : url;
  };

  const isYoutube = currentLesson.videoUrl?.includes('youtube.com') || currentLesson.videoUrl?.includes('youtu.be');

  const toggleFullScreen = () => {
    const container = document.getElementById('video-wrapper');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // We should also detect if youtube iframe ends, but the youtube iframe API is complex to embed raw here. 
  // We'll rely on a manual button to mark as completed if it's youtube, or we show the practice button prominently always.
  
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] mt-16 bg-[#020617] text-slate-200 overflow-hidden font-sans">
      {/* Left Sidebar Playlist */}
      <aside className={`w-full md:w-80 lg:w-96 bg-slate-950 border-e border-slate-800 flex flex-col h-full shrink-0 ${isRtl ? 'md:order-1 border-s border-e-0' : ''}`}>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
          <h2 className="text-lg font-bold text-white truncate pr-4">
            {isRtl ? course.titleAr : course.titleEn}
          </h2>
          <Link href={`/${locale}/courses/${courseId}`} className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 transition-colors">
            {isRtl ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {course.units?.sort((a,b) => a.order - b.order).map((unit, unitIdx) => (
            <div key={unit.id} className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                {isRtl ? unit.titleAr : unit.titleEn}
              </h3>
              <div className="space-y-2">
                {unit.lessons?.sort((a,b) => a.order - b.order).map((lesson, idx) => {
                  const isActive = lesson.id === lessonId;
                  const isCompleted = completedLessons.includes(lesson.id);
                  
                  return (
                    <div key={lesson.id} className={`p-3 rounded-xl border ${isActive ? 'bg-brand-500/10 border-brand-500/30' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'} transition-colors`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${isActive ? 'border-brand-500 text-brand-400' : 'border-slate-600 text-slate-400'}`}>
                              {idx + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-sm font-semibold mb-2 ${isActive ? 'text-brand-400' : 'text-slate-200'}`}>
                            {isRtl ? lesson.titleAr : lesson.titleEn}
                          </h4>
                          
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link href={`/${locale}/courses/${courseId}/video/${lesson.id}`} className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${isActive ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'} transition-colors`}>
                              <Play className="h-3 w-3" />
                              <span>{isRtl ? 'الفيديو' : 'Video'}</span>
                            </Link>
                            
                            {lesson.pdfUrl && (
                              <Link href={lesson.pdfUrl} target="_blank" className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
                                <FileText className="h-3 w-3" />
                                <span>{isRtl ? 'الملخصات' : 'Notes'}</span>
                              </Link>
                            )}
                            
                            <Link href={`/${locale}/courses/${courseId}/practice/${lesson.id}`} className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors">
                              <Star className="h-3 w-3" />
                              <span>{isRtl ? 'التدريب' : 'Practice'}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
        {/* Video Area */}
        <div id="video-wrapper" className="w-full bg-black aspect-video relative shrink-0 shadow-2xl group">
          {currentLesson.videoUrl ? (
            isYoutube ? (
              <div className="w-full h-full relative">
                {/* Invisible Overlays to block YouTube watermark and title clicks */}
                <div className="absolute top-0 left-0 w-full h-16 z-10" title=" " /> {/* Blocks title link */}
                <div className="absolute bottom-0 right-0 w-32 h-16 z-10" title=" " /> {/* Blocks bottom right watermark */}
                
                <iframe
                  className="w-full h-full pointer-events-auto"
                  src={getYoutubeEmbedUrl(currentLesson.videoUrl)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
                {/* Custom Fullscreen Button */}
                <button 
                  onClick={toggleFullScreen}
                  className="absolute bottom-4 right-4 z-20 p-2 bg-black/60 hover:bg-black/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm border border-white/10"
                  title={isRtl ? 'ملء الشاشة' : 'Full Screen'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                </button>
              </div>
            ) : (
              <video
                src={currentLesson.videoUrl}
                className="w-full h-full object-contain"
                controls
                autoPlay
                onEnded={handleVideoEnd}
              />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              {isRtl ? 'لا يوجد فيديو لهذا الدرس.' : 'No video available for this lesson.'}
            </div>
          )}
          
          {/* Overlay when video ends (if it's not a youtube embed we can track it automatically) */}
          {videoEnded && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 backdrop-blur-sm animate-in fade-in duration-500">
              <div className="text-center p-8 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl">
                <h3 className="text-3xl font-black text-white mb-6">
                  {isRtl ? '🎉 اكتمل الدرس!' : 'Lesson Completed! 🎉'}
                </h3>
                <Link href={`/${locale}/courses/${courseId}/practice/${lessonId}`} className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold flex items-center gap-2 justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/25">
                  <Star className="h-5 w-5" />
                  <span>{isRtl ? 'انتقل إلى التمارين' : 'Go to Practice Exercises'}</span>
                  {isRtl ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Info & Discussions */}
        <div className="max-w-4xl w-full mx-auto p-6 space-y-8 pb-20">
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isRtl ? currentLesson.titleAr : currentLesson.titleEn}
            </h1>
            
            {/* Show prominent go to practice button always for YouTube since we don't track onEnded reliably without API */}
            {isYoutube && !videoEnded && (
              <Link href={`/${locale}/courses/${courseId}/practice/${lessonId}`} className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20">
                <Star className="h-4 w-4" />
                <span>{isRtl ? 'انتقل إلى التمارين' : 'Go to Practice Exercises'}</span>
              </Link>
            )}

            {videoEnded && (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold">
                <CheckCircle2 className="h-5 w-5" />
                <span>{isRtl ? 'مكتمل' : 'Completed'}</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-brand-400" />
                {isRtl ? 'حول هذا الدرس' : 'About this lesson'}
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                {isRtl ? 
                  `هذه صفحة الفيديو المخصصة لدرس "${currentLesson.titleAr}". شاهد الفيديو بانتباه وسجل ملاحظاتك باستخدام الملخصات المرفقة إن وجدت. بعد الانتهاء، تأكد من اختبار معلوماتك عبر التمارين التدريبية.` : 
                  `This is a dedicated video player page for "${currentLesson.titleEn}". Watch the video carefully and take notes using the provided PDF files if available. Once you finish watching, make sure to test your knowledge with the practice exercises.`
                }
              </p>
            </section>

            <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-400" />
                {isRtl ? 'النقاشات' : 'Discussions'}
              </h3>
              
              <div className="flex items-start gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center font-bold text-brand-400 shrink-0 uppercase">
                  {currentUser?.nameAr ? currentUser.nameAr.charAt(0) : 'U'}
                </div>
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder={isRtl ? 'أضف تعليقاً أو سؤالاً...' : 'Add a comment or question...'}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-all text-sm"
                  />
                  <button className="absolute end-2 top-2 p-1.5 bg-brand-500 hover:bg-brand-600 transition-colors text-white rounded-lg shadow-sm">
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/40">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                      T
                    </div>
                    <div>
                      <span className="text-sm font-bold text-white block">Tawjihi Hub</span>
                      <span className="text-[11px] text-slate-500">System Message</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {isRtl ? 
                      'أهلاً بك في قسم النقاشات! يمكنك طرح أسئلتك هنا وسيقوم المعلم أو زملائك بالإجابة عليها.' : 
                      'Welcome to the discussions! Feel free to ask any questions here and your teacher or peers will answer.'
                    }
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
