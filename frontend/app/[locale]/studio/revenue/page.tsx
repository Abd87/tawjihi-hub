'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  DollarSign, 
  TrendingUp, 
  Ticket, 
  BookOpen, 
  Percent, 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Sparkles,
  PieChart as PieIcon,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function TeacherRevenueStudioPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'ar';
  const isRtl = locale === 'ar';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const res = await fetch('/api/analytics/teacher/revenue');
      if (!res.ok) throw new Error('Failed to fetch revenue analytics');
      const result = await res.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-10 text-center">
        <p className="text-rose-400">{error || 'No data found'}</p>
      </div>
    );
  }

  const { stats, courseBreakdown, monthlyChart, revenueSharePercent, teacher } = data;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
            <Percent className="w-3.5 h-3.5" />
            <span>{isRtl ? `نسبة الأرباح المعتمدة: ${revenueSharePercent}%` : `Revenue Share: ${revenueSharePercent}%`}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            {isRtl ? 'المالية والإيرادات' : 'Revenue & Financials'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {isRtl
              ? `تقرير الأرباح المالية واستخدام الكوبونات الخاص بدورات الأستاذ (${teacher?.nameAr || 'المعلم'})`
              : `Financial performance and coupon payout reports for (${teacher?.nameEn || teacher?.nameAr})`}
          </p>
        </div>

        <Link
          href={`/${locale}/studio`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 hover:text-white hover:border-slate-700 text-sm font-bold transition-all w-fit"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRtl ? 'العودة للاستوديو' : 'Back to Studio'}</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Teacher Net Payout */}
        <div className="bg-slate-900/60 border border-emerald-500/30 p-6 rounded-3xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 p-24 bg-emerald-500/10 blur-[80px] pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'صافي مستحقات المعلم' : 'Teacher Net Payout'}
            </span>
            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">
            {stats.teacherNetPayout.toLocaleString()} <span className="text-sm font-bold text-emerald-400">{isRtl ? 'د.أ' : 'JOD'}</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {isRtl ? `بناءً على نسبة ${revenueSharePercent}% من إجمالي المبيعات` : `Based on ${revenueSharePercent}% revenue share`}
          </p>
        </div>

        {/* Card 2: Total Gross Revenue */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'إجمالي الدخل الكلي' : 'Gross Total Sales'}
            </span>
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">
            {stats.totalGrossRevenue.toLocaleString()} <span className="text-sm font-bold text-slate-400">{isRtl ? 'د.أ' : 'JOD'}</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {isRtl ? 'قيمة مبيعات الكوبونات الكلية' : 'Total value of redeemed coupons'}
          </p>
        </div>

        {/* Card 3: Total Coupons Redeemed */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'الكوبونات المفعلة' : 'Redeemed Coupons'}
            </span>
            <div className="p-3 bg-brand-500/10 rounded-2xl text-brand-400">
              <Ticket className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">
            {stats.totalCouponsRedeemed.toLocaleString()} <span className="text-sm font-bold text-slate-400">{isRtl ? 'كوبون' : 'Coupons'}</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {isRtl ? `في ${stats.totalCourses} دورات تعليمية` : `Across ${stats.totalCourses} active courses`}
          </p>
        </div>

        {/* Card 4: Platform Keep */}
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isRtl ? 'حصة المنصة' : 'Platform Share'}
            </span>
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
              <PieIcon className="w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-black text-white">
            {stats.platformKeep.toLocaleString()} <span className="text-sm font-bold text-slate-400">{isRtl ? 'د.أ' : 'JOD'}</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            {isRtl ? `تشمل الاستضافة وتكاليف التشغيل (${100 - revenueSharePercent}%)` : `Hosting & ops fee (${100 - revenueSharePercent}%)`}
          </p>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {monthlyChart.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              {isRtl ? 'مخطط الأرباح الشهري (د.أ)' : 'Monthly Earnings Trend (JOD)'}
            </h2>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Bar dataKey="teacherNet" name={isRtl ? 'صافي المعلم (د.أ)' : 'Teacher Net (JOD)'} fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="gross" name={isRtl ? 'الإجمالي الكلي (د.أ)' : 'Gross (JOD)'} fill="#0284c7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Course Breakdown Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-400" />
            {isRtl ? 'تفاصيل الأرباح حسب الدورة' : 'Course Revenue Breakdown'}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-300 text-right dir-rtl">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-start">{isRtl ? 'اسم الدورة' : 'Course Name'}</th>
                <th className="px-6 py-4">{isRtl ? 'المسار' : 'Track'}</th>
                <th className="px-6 py-4">{isRtl ? 'سعر الدورة' : 'Price'}</th>
                <th className="px-6 py-4">{isRtl ? 'الكوبونات المفعلة' : 'Redeemed'}</th>
                <th className="px-6 py-4">{isRtl ? 'إجمالي المبيعات' : 'Gross Sales'}</th>
                <th className="px-6 py-4 text-end">{isRtl ? 'صافي أرباح المعلم' : 'Teacher Net'}</th>
              </tr>
            </thead>
            <tbody>
              {courseBreakdown.map((item: any) => (
                <tr key={item.id} className="border-b border-slate-800/40 hover:bg-slate-900/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-white text-start">
                    {isRtl ? item.titleAr : item.titleEn}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800 text-slate-300">
                      {item.track}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-300">
                    {item.price} {isRtl ? 'د.أ' : 'JOD'}
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-400">
                    {item.redeemedCoupons}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-300">
                    {item.grossRevenue.toLocaleString()} {isRtl ? 'د.أ' : 'JOD'}
                  </td>
                  <td className="px-6 py-4 font-black text-emerald-400 text-end">
                    {item.teacherNetPayout.toLocaleString()} {isRtl ? 'د.أ' : 'JOD'}
                  </td>
                </tr>
              ))}
              {courseBreakdown.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    {isRtl ? 'لا توجد مبيعات أو كوبونات مفعلة بعد' : 'No sales or redeemed coupons yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
