'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BtecHubPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';

  return (
    <div className="min-h-screen p-8 text-slate-100 font-sans max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-emerald-400">مرجع مهام BTEC 📚</h1>
          <p className="text-slate-400 mt-2">مساحة عمل متكاملة لمهام وتعيينات نظام بيتيك (قريباً)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Skeleton Cards for future DB data */}
        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
          <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full mb-4 inline-block">تكنولوجيا المعلومات (IT)</span>
          <h2 className="text-xl font-bold mb-2">الوحدة الأولى: قواعد البيانات</h2>
          <p className="text-slate-400 text-sm mb-6 line-clamp-2">تصميم قاعدة بيانات علائقية وتطبيق قواعد التطبيع (Normalization) للوصول إلى النموذج الثالث.</p>
          
          <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs font-bold">
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-300 block mb-1">Pass</span>
              <span className="text-emerald-400">P1, P2</span>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-300 block mb-1">Merit</span>
              <span className="text-sky-400">M1</span>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-300 block mb-1">Distinction</span>
              <span className="text-amber-400">D1</span>
            </div>
          </div>

          <button disabled className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 py-2 rounded-xl font-medium cursor-not-allowed">
            عرض التفاصيل ومعايير التقييم
          </button>
        </div>

        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-2 h-full bg-sky-500"></div>
          <span className="text-xs font-bold px-3 py-1 bg-sky-500/20 text-sky-400 rounded-full mb-4 inline-block">إدارة الأعمال (Business)</span>
          <h2 className="text-xl font-bold mb-2">الوحدة الثانية: التسويق</h2>
          <p className="text-slate-400 text-sm mb-6 line-clamp-2">إعداد خطة تسويقية لمنتج جديد، تشمل تحليل PESTLE و SWOT وتحديد المزيج التسويقي 7Ps.</p>
          
          <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs font-bold">
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-300 block mb-1">Pass</span>
              <span className="text-emerald-400">P3, P4</span>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-300 block mb-1">Merit</span>
              <span className="text-sky-400">M2</span>
            </div>
            <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
              <span className="text-slate-300 block mb-1">Distinction</span>
              <span className="text-amber-400">D2</span>
            </div>
          </div>

          <button disabled className="w-full bg-sky-500/10 text-sky-400 border border-sky-500/30 py-2 rounded-xl font-medium cursor-not-allowed">
            عرض التفاصيل ومعايير التقييم
          </button>
        </div>
      </div>

      <div className="bg-indigo-600/10 border border-indigo-500/30 rounded-2xl p-8 text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-indigo-400 mb-4">جاري العمل على قاعدة البيانات 🚧</h3>
        <p className="text-slate-300 leading-relaxed">
          نحن نقوم الآن بربط هذه الصفحة مع قاعدة البيانات لتتمكن من تصفح كافة المهام الحقيقية المخصصة لتخصصك، وتقسيمها حسب معايير التقييم (P, M, D).
        </p>
      </div>

    </div>
  );
}
