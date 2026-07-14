'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ClipboardCheck, BarChart3, Users, Clock, FileText, ChevronRight, AlertCircle } from 'lucide-react';

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [classRes, subRes] = await Promise.all([
        fetch('/api/lms/classes'),
        fetch('/api/lms/submissions?status=PENDING'),
      ]);
      const classJson = await classRes.json();
      const subJson = await subRes.json();
      if (classJson.success) setClasses(classJson.data);
      if (subJson.success) setPendingSubmissions(subJson.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Dashboard Giáo viên</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý lớp học, bài tập và đề thi</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{classes.length}</p>
              <p className="text-xs text-slate-500 font-semibold">Lớp đang quản lý</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{pendingSubmissions.length}</p>
              <p className="text-xs text-slate-500 font-semibold">Bài chờ chấm</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">
                {classes.reduce((sum, c) => sum + (c._count?.students || 0), 0)}
              </p>
              <p className="text-xs text-slate-500 font-semibold">Tổng học sinh</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">
                {classes.reduce((sum, c) => sum + (c._count?.subjects || 0), 0)}
              </p>
              <p className="text-xs text-slate-500 font-semibold">Tổng môn học</p>
            </div>
          </div>
        </div>
      </div>

      {/* Class Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Lớp đang quản lý</h2>
        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-semibold">Chưa có lớp nào được giao</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((cls) => (
              <Link key={cls.id} href={`/lms/teacher/classes/${cls.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-primary/30 transition group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition">{cls.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {cls._count?.students || 0}/25 HS</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {cls._count?.subjects || 0} môn</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition" />
                </div>
                {/* Subject pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
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
            <h2 className="text-lg font-bold text-slate-900">Bài tập chờ chấm</h2>
            <Link href="/lms/teacher/grading" className="text-primary text-sm font-bold hover:underline">Xem tất cả →</Link>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
            {pendingSubmissions.slice(0, 5).map((sub) => (
              <div key={sub.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{sub.student?.name}</p>
                  <p className="text-xs text-slate-500">{sub.assignment?.title} · {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold">Chờ chấm</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/lms/teacher/grading" className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-5 hover:shadow-lg transition">
          <ClipboardCheck className="w-8 h-8 mb-2 opacity-80" />
          <p className="font-bold text-sm">Chấm bài AI</p>
          <p className="text-xs opacity-80 mt-1">Sử dụng SEDUAI để chấm bài tự động</p>
        </Link>
        <Link href="/lms/teacher/exams/create" className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl p-5 hover:shadow-lg transition">
          <FileText className="w-8 h-8 mb-2 opacity-80" />
          <p className="font-bold text-sm">Tạo đề thi</p>
          <p className="text-xs opacity-80 mt-1">AI sinh câu hỏi trắc nghiệm tự động</p>
        </Link>
        {classes[0] && (
          <Link href={`/lms/teacher/dashboard/${classes[0].id}`} className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-5 hover:shadow-lg transition">
            <BarChart3 className="w-8 h-8 mb-2 opacity-80" />
            <p className="font-bold text-sm">Dashboard Realtime</p>
            <p className="text-xs opacity-80 mt-1">Xem kết quả học tập theo thời gian thực</p>
          </Link>
        )}
      </div>
    </div>
  );
}
