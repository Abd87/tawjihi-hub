'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Users, Search, CheckCircle2, XCircle, Clock, ExternalLink, Mail, Phone, BookOpen, Loader2, Calendar } from 'lucide-react';

interface Application {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  experience: string;
  resumeLink: string | null;
  status: string;
  createdAt: string;
}

export default function ApplicationsAdminPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/admin/applications', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch applications', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setApplications(apps => apps.map(app => app.id === id ? { ...app, status } : app));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#020617] font-sans">
      
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Users className="h-8 w-8 text-brand-500" />
              {isRtl ? 'طلبات التوظيف للمعلمين' : 'Teacher Applications'}
            </h1>
            <p className="text-slate-400 mt-2">
              {isRtl ? 'إدارة ومراجعة طلبات الانضمام لفريق توجيهي هب.' : 'Manage and review applications to join Tawjihi Hub.'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500`} />
              <input
                type="text"
                placeholder={isRtl ? 'البحث بالاسم أو الإيميل...' : 'Search by name or email...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-slate-900 border border-slate-700 rounded-xl py-2 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all`}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            >
              <option value="ALL">{isRtl ? 'جميع الحالات' : 'All Status'}</option>
              <option value="PENDING">{isRtl ? 'قيد الانتظار' : 'Pending'}</option>
              <option value="APPROVED">{isRtl ? 'مقبول' : 'Approved'}</option>
              <option value="REJECTED">{isRtl ? 'مرفوض' : 'Rejected'}</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <p className="text-slate-400 text-lg">{isRtl ? 'لا يوجد طلبات توظيف حتى الآن.' : 'No applications found.'}</p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-6">
                
                {/* Info Section */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{app.fullName}</h3>
                    
                    {app.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                        <Clock className="w-3.5 h-3.5" /> {isRtl ? 'قيد الانتظار' : 'Pending'}
                      </span>
                    )}
                    {app.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {isRtl ? 'مقبول' : 'Approved'}
                      </span>
                    )}
                    {app.status === 'REJECTED' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" /> {isRtl ? 'مرفوض' : 'Rejected'}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <a href={`mailto:${app.email}`} className="hover:text-brand-500 transition-colors">{app.email}</a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <a href={`tel:${app.phoneNumber}`} className="hover:text-brand-500 transition-colors" dir="ltr">{app.phoneNumber}</a>
                    </div>
                    <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold">
                      <BookOpen className="w-4 h-4" />
                      {app.subject}
                    </div>
                    {app.resumeLink && (
                      <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                        <ExternalLink className="w-4 h-4" />
                        <a href={app.resumeLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {isRtl ? 'رابط السيرة الذاتية' : 'Resume Link'}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      {new Date(app.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>

                  <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                    <p className="text-sm text-slate-400 font-bold mb-1">{isRtl ? 'الخبرة:' : 'Experience:'}</p>
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{app.experience}</p>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="lg:w-48 shrink-0 flex flex-row lg:flex-col gap-3 pt-2">
                  <button
                    onClick={() => updateStatus(app.id, 'APPROVED')}
                    disabled={app.status === 'APPROVED'}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                      app.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-500 cursor-not-allowed opacity-50' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isRtl ? 'قبول' : 'Approve'}
                  </button>
                  <button
                    onClick={() => updateStatus(app.id, 'REJECTED')}
                    disabled={app.status === 'REJECTED'}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                      app.status === 'REJECTED' ? 'bg-rose-500/20 text-rose-500 cursor-not-allowed opacity-50' : 'bg-rose-500 hover:bg-rose-600 text-white'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    {isRtl ? 'رفض' : 'Reject'}
                  </button>
                </div>
                
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
