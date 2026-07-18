'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, ClipboardCheck, Users, ChevronRight, AlertCircle, Sparkles, PenTool, BarChart3 } from 'lucide-react';

export default function TeacherDashboard() {
  const { lmsUserId, localSync } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [classRes, subRes] = await Promise.all([
        fetch(`/api/lms/classes?teacherId=${encodeURIComponent(lmsUserId || '')}`),
        fetch(`/api/lms/submissions?status=PENDING&teacherId=${encodeURIComponent(lmsUserId || '')}`),
      ]);
      const classJson = await classRes.json();
      const subJson = await subRes.json();
      if (classJson.success) setClasses(classJson.data);
      if (subJson.success) setPendingSubmissions(subJson.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [lmsUserId]);

  useEffect(() => {
    if (lmsUserId) void loadData();
  }, [lmsUserId, loadData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="lms-shimmer h-32 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="lms-shimmer h-24 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="lms-shimmer h-40 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Lớp đang quản lý', value: classes.length, icon: <BookOpen className="w-6 h-6" />, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Bài chờ chấm', value: pendingSubmissions.length, icon: <ClipboardCheck className="w-6 h-6" />, bg: 'bg-amber-50', iconColor: 'text-amber-600', highlight: pendingSubmissions.length > 0 },
    { label: 'Tổng học sinh', value: classes.reduce((sum, c) => sum + (c._count?.students || 0), 0), icon: <Users className="w-6 h-6" />, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Tổng môn học', value: classes.reduce((sum, c) => sum + (c._count?.subjects || 0), 0), icon: <BarChart3 className="w-6 h-6" />, bg: 'bg-purple-50', iconColor: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-4 w-4" /> Tổng quan giáo viên
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">Dashboard giáo viên</h1>
          <p className="mt-2 text-sm text-slate-500">Chào {localSync.name || 'Giáo viên'}, đây là tổng quan lớp học của bạn.</p>
        </div>
        <Link href="/lms/teacher/exams/create" className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark">
          <PenTool className="h-4 w-4" /> Tạo đề mới
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className={`lms-card bg-white rounded-2xl p-5 border shadow-sm lms-fade-up ${stat.highlight ? 'border-amber-200 ring-1 ring-amber-100' : 'border-slate-200/60'}`} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 lms-stat-number">{stat.value}</p>
                <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Class Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Lớp đang quản lý
        </h2>
        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-10 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-7 h-7 text-slate-300" />
            </div>
            <p className="text-slate-600 font-bold">Chưa có lớp nào được giao</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((cls) => (
              <Link key={cls.id} href={`/lms/teacher/classes/${cls.id}`}
                className="lms-card bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm group lms-fade-up">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition">{cls.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {cls._count?.students || 0} HS</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {cls._count?.subjects || 0} môn</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition" />
                </div>
                {/* Subject pills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {cls.subjects?.slice(0, 4).map((sub: any) => (
                    <span key={sub.id} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                      {sub.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pending Submissions */}
      {pendingSubmissions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-amber-500" />
              Bài tập chờ chấm
              <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">{pendingSubmissions.length}</span>
            </h2>
            <Link href="/lms/teacher/grading" className="text-primary text-sm font-bold hover:underline">Xem tất cả →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/60 divide-y divide-slate-100 shadow-sm overflow-hidden">
            {pendingSubmissions.slice(0, 5).map((sub) => (
              <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition">
                <div>
                  <p className="text-sm font-bold text-slate-900">{sub.student?.name}</p>
                  <p className="text-xs text-slate-500">{sub.assignment?.title} · {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100">
                  Chờ chấm
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
